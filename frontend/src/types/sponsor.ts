export type SponsorStatus = "pending" | "approved" | "rejected";

export interface Sponsor {
  id: string;
  event_id: string | null;
  company_name: string;
  industry: string;
  website: string;
  linkedin_company_page: string | null;
  technologies: string[];
  sponsorship_type: string;
  sponsorship_criteria: string | null;
  contact_email: string;
  logo_url: string | null;
  status: SponsorStatus;
  created_at: string;
  updated_at: string;
}
