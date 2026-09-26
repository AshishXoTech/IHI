import { NextResponse } from "next/server";

function parseGithubUrl(raw: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(raw.trim());
    if (!url.hostname.includes("github.com")) return null;
    const parts = url.pathname.replace(/\.git$/, "").split("/").filter(Boolean);
    if (parts.length < 2) return null;
    return { owner: parts[0], repo: parts[1] };
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const repoUrl = searchParams.get("repoUrl") || "";

  const parsed = parseGithubUrl(repoUrl);
  if (!parsed) {
    return NextResponse.json(
      { ok: false, error: "Invalid GitHub repo URL", mock: true },
      { status: 400 }
    );
  }

  const { owner, repo } = parsed;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "User-Agent": "IHI-Judge-Portal",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const [repoRes, commitsRes, contribRes, activityRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers, next: { revalidate: 300 } }),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`,
        { headers, next: { revalidate: 300 } }
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=100`,
        { headers, next: { revalidate: 300 } }
      ),
      fetch(
        `https://api.github.com/repos/${owner}/${repo}/stats/commit_activity`,
        { headers, next: { revalidate: 300 } }
      ),
    ]);

    if (repoRes.status === 404) {
      return NextResponse.json(
        { ok: false, error: "Repository not found or private", mock: true },
        { status: 404 }
      );
    }

    if (!repoRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: `GitHub API ${repoRes.status}`,
          mock: true,
        },
        { status: 502 }
      );
    }

    const repoJson = await repoRes.json();

    // Total commits via Link header on commits endpoint
    let commitCount = 0;
    const link = commitsRes.headers.get("link") || "";
    const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
    if (lastMatch) {
      commitCount = parseInt(lastMatch[1], 10);
    } else if (commitsRes.ok) {
      const commits = await commitsRes.json();
      commitCount = Array.isArray(commits) ? commits.length : 0;
    }

    // Contributors
    let contributorCount = 0;
    if (contribRes.ok) {
      const contribs = await contribRes.json();
      contributorCount = Array.isArray(contribs) ? contribs.length : 0;
    }

    // Weekly activity → frequency grade
    let commitsLast4Weeks = 0;
    let velocity: "A+" | "A" | "B" | "C" | "D" | "N/A" = "N/A";
    if (activityRes.ok) {
      const activity = await activityRes.json();
      if (Array.isArray(activity) && activity.length > 0) {
        const last4 = activity.slice(-4);
        commitsLast4Weeks = last4.reduce(
          (sum: number, w: { total?: number }) => sum + (w.total || 0),
          0
        );
        const avgPerWeek = commitsLast4Weeks / 4;
        if (avgPerWeek >= 20) velocity = "A+";
        else if (avgPerWeek >= 10) velocity = "A";
        else if (avgPerWeek >= 5) velocity = "B";
        else if (avgPerWeek >= 2) velocity = "C";
        else velocity = "D";
      }
    }

    // Fallback commit count from default branch compare if still 0
    if (commitCount === 0 && repoJson.default_branch) {
      // approximate via pushed_at / size is weak; leave 0 and show activity
    }

    return NextResponse.json({
      ok: true,
      mock: false,
      owner,
      repo,
      htmlUrl: repoJson.html_url,
      description: repoJson.description,
      stars: repoJson.stargazers_count ?? 0,
      forks: repoJson.forks_count ?? 0,
      openIssues: repoJson.open_issues_count ?? 0,
      defaultBranch: repoJson.default_branch,
      commitCount,
      contributorCount,
      commitsLast4Weeks,
      velocity,
      pushedAt: repoJson.pushed_at,
      language: repoJson.language,
    });
  } catch (e) {
    console.error("[repo-stats]", e);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch GitHub stats", mock: true },
      { status: 500 }
    );
  }
}