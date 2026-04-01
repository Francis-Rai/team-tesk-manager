export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages });

  return (
    <div className="flex items-center justify-between border-t pt-4">
      {/* Previous */}

      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-muted"
      >
        Previous
      </button>

      {/* Page numbers */}

      <div className="flex gap-1">
        {pages.map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-3 py-1 text-sm rounded-md border ${
              page === i
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Next */}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= totalPages}
        className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 hover:bg-muted"
      >
        Next
      </button>
    </div>
  );
}
