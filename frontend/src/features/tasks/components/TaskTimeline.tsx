// import { useState } from "react";
// import { useTaskUpdates } from "../hooks/useTaskUpdates";
// import Avatar from "../../../common/components/Avatar";

// interface Props {
//   teamId: string;
//   projectId: string;
//   taskId: string;
// }

// export default function TaskTimeline({ teamId, projectId, taskId }: Props) {
//   const [page, setPage] = useState(0);

//   const { data } = useTaskUpdates(teamId, projectId, taskId, {
//     page,
//     size: 5,
//   });

//   const updates = data?.content ?? [];
//   const totalPages = data?.totalPages ?? 0;

//   const isFirstPage = page === 0;
//   const isLastPage = page + 1 >= totalPages;

//   return (
//     <div className="space-y-4">
//       <h2 className="text-sm font-medium text-muted-foreground">Activity</h2>

//       <div className="space-y-6">
//         {updates.map((update) => (
//           <div key={update.id} className="flex gap-3">
//             <Avatar name={update.createdByName} />

//             <div className="flex-1">
//               <div className="flex items-center gap-2 text-sm">
//                 <span className="font-medium">{update.createdByName}</span>

//                 <span className="text-xs text-muted-foreground">
//                   {new Date(update.createdAt).toLocaleString()}
//                 </span>
//               </div>

//               <p className="text-sm text-muted-foreground">{update.message}</p>
//             </div>
//           </div>
//         ))}

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="flex items-center justify-between border-t pt-4">
//             <button
//               onClick={() => setPage((p) => Math.max(p - 1, 0))}
//               disabled={isFirstPage}
//               className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
//             >
//               Previous
//             </button>

//             <span className="text-xs text-muted-foreground">
//               Page {page + 1} of {totalPages}
//             </span>

//             <button
//               onClick={() => setPage((p) => (isLastPage ? p : p + 1))}
//               disabled={isLastPage}
//               className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useTaskUpdates } from "../hooks/useTaskUpdates";
import TimelineItem from "./TimelineItems";

interface Props {
  teamId: string;
  projectId: string;
  taskId: string;
}

export default function TaskTimeline({ teamId, projectId, taskId }: Props) {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useTaskUpdates(teamId, projectId, taskId, {
    page,
    size: 5,
  });

  const updates = data?.content ?? [];
  const totalPages = data?.totalPages ?? 0;

  const isFirstPage = page === 0;
  const isLastPage = page + 1 >= totalPages;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading activity...</div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">Activity</h2>

      <div>
        {updates.length === 0 && (
          <p className="text-sm text-muted-foreground">No activity yet.</p>
        )}

        {updates.map((update, index) => (
          <TimelineItem
            key={update.id}
            name={update.createdByName}
            message={update.message}
            createdAt={update.createdAt}
            isLast={index === updates.length - 1}
          />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-4">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={isFirstPage}
            className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
          >
            Previous
          </button>

          <span className="text-xs text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => (isLastPage ? p : p + 1))}
            disabled={isLastPage}
            className="px-3 py-1.5 text-sm border rounded-md disabled:opacity-40 disabled:cursor-not-allowed hover:bg-muted"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
