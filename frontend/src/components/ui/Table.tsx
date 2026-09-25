import {
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type ReactNode,
  forwardRef,
} from "react";
import { clsx } from "clsx";

/* ==========================================================================
   TABLE WRAPPER & ROOT CONTAINER
   ========================================================================== */

interface TableProps extends HTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
  dense?: boolean;
}

export const Table = forwardRef<HTMLTableElement, TableProps>(
  ({ className, containerClassName, dense = false, ...rest }, ref) => (
    <div
      className={clsx(
        "relative w-full overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--border-default)] bg-[var(--surface)]",
        "shadow-[var(--shadow-card)]",
        containerClassName
      )}
    >
      <table
        ref={ref}
        className={clsx(
          "w-full caption-bottom text-left border-collapse text-body-sm text-[var(--text-primary)]",
          dense && "[&_td]:py-2 [&_th]:py-2",
          className
        )}
        {...rest}
      />
    </div>
  )
);
Table.displayName = "Table";

/* ==========================================================================
   TABLE HEADER
   ========================================================================== */

export const TableHeader = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...rest }, ref) => (
  <thead
    ref={ref}
    className={clsx(
      "border-b border-[var(--border-default)] bg-[var(--surface-bg)]/80 backdrop-blur-sm",
      "[&_tr]:border-b-0",
      className
    )}
    {...rest}
  />
));
TableHeader.displayName = "TableHeader";

/* ==========================================================================
   TABLE BODY
   ========================================================================== */

export const TableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...rest }, ref) => (
  <tbody
    ref={ref}
    className={clsx(
      "divide-y divide-[var(--border-default)] bg-[var(--surface)] [&_tr:last-child]:border-0",
      className
    )}
    {...rest}
  />
));
TableBody.displayName = "TableBody";

/* ==========================================================================
   TABLE ROW
   ========================================================================== */

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  selected?: boolean;
  interactive?: boolean;
}

export const TableRow = forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, selected = false, interactive = true, ...rest }, ref) => (
    <tr
      ref={ref}
      data-state={selected ? "selected" : undefined}
      className={clsx(
        "border-b border-[var(--border-default)] transition-colors duration-fast var(--ease-out)",
        interactive && "hover:bg-[var(--surface-bg)]/80 cursor-pointer",
        selected && "bg-[var(--accent-subtle)] hover:bg-[var(--accent-subtle)]/80",
        className
      )}
      {...rest}
    />
  )
);
TableRow.displayName = "TableRow";

/* ==========================================================================
   TABLE HEAD (COLUMN HEADER)
   ========================================================================== */

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: "asc" | "desc" | null;
  onSort?: () => void;
}

export const TableHead = forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable = false, sortDirection = null, onSort, ...rest }, ref) => (
    <th
      ref={ref}
      scope="col"
      onClick={sortable ? onSort : undefined}
      className={clsx(
        "h-11 px-4 py-3 text-left align-middle text-label text-[var(--text-muted)] font-semibold tracking-wider uppercase select-none",
        sortable && "cursor-pointer hover:text-[var(--text-primary)] transition-colors group",
        className
      )}
      {...rest}
    >
      <div className="inline-flex items-center gap-1.5">
        <span>{children}</span>
        {sortable && (
          <span className="flex flex-col text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
            {sortDirection === "asc" ? (
              <svg className="h-3.5 w-3.5 text-[var(--accent)]" viewBox="0 0 16 16" fill="none">
                <path d="M4 10l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : sortDirection === "desc" ? (
              <svg className="h-3.5 w-3.5 text-[var(--accent)]" viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" viewBox="0 0 16 16" fill="none">
                <path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        )}
      </div>
    </th>
  )
);
TableHead.displayName = "TableHead";

/* ==========================================================================
   TABLE CELL
   ========================================================================== */

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  numeric?: boolean;
}

export const TableCell = forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, numeric = false, ...rest }, ref) => (
    <td
      ref={ref}
      className={clsx(
        "px-4 py-3.5 align-middle text-body-sm text-[var(--text-primary)]",
        numeric && "tabular-nums text-right font-mono",
        className
      )}
      {...rest}
    />
  )
);
TableCell.displayName = "TableCell";

/* ==========================================================================
   TABLE FOOTER
   ========================================================================== */

export const TableFooter = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...rest }, ref) => (
  <tfoot
    ref={ref}
    className={clsx(
      "border-t border-[var(--border-default)] bg-[var(--surface-bg)] font-medium text-[var(--text-primary)]",
      className
    )}
    {...rest}
  />
));
TableFooter.displayName = "TableFooter";

/* ==========================================================================
   TABLE EMPTY STATE
   ========================================================================== */

interface TableEmptyProps extends TdHTMLAttributes<HTMLTableCellElement> {
  colSpan: number;
  icon?: ReactNode;
  title?: string;
  message?: string;
  action?: ReactNode;
}

export const TableEmpty = forwardRef<HTMLTableCellElement, TableEmptyProps>(
  (
    {
      className,
      children,
      colSpan,
      icon,
      title = "No records found",
      message = "There is no data matching your criteria at this moment.",
      action,
      ...rest
    },
    ref
  ) => (
    <tr>
      <td
        ref={ref}
        colSpan={colSpan}
        className={clsx("px-4 py-16 text-center align-middle", className)}
        {...rest}
      >
        {children ?? (
          <div className="mx-auto flex max-w-sm flex-col items-center justify-center">
            {icon ? (
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-bg)] border border-[var(--border-default)] text-[var(--text-muted)]">
                {icon}
              </div>
            ) : (
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface-bg)] border border-[var(--border-default)] text-[var(--text-muted)]">
                <svg className="h-6 w-6 opacity-60" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M4 7V4h16v3M9 20h6M12 4v16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <h4 className="text-body-md font-semibold text-[var(--text-primary)]">
              {title}
            </h4>
            <p className="mt-1 text-body-sm text-[var(--text-muted)]">
              {message}
            </p>
            {action && <div className="mt-4">{action}</div>}
          </div>
        )}
      </td>
    </tr>
  )
);
TableEmpty.displayName = "TableEmpty";