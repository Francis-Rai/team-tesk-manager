// import { useState } from "react";
// import Button from "../common/components/Button";
import { useNavigate, useParams } from "react-router-dom";
import CreateProjectModal from "../features/projects/components/CreateProjectModal";
import { useProjects } from "../features/projects/hooks/useProject";

/*
 * Project page showing projects.
 */
export default function ProjectsPage() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useProjects(teamId!);

  const projects = data?.content ?? [];

  if (isLoading) return <div>Loading projects...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Projects</h1>

      <CreateProjectModal />

      <div className="grid grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => navigate(`/teams/${teamId}/projects/${project.id}`)}
            className="border p-4 rounded hover:bg-gray-50 cursor-pointer"
          >
            <h3 className="font-semibold">{project.name}</h3>

            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
// export default function ProjectsPage() {
//   const { data, isLoading } = useProjects();
//   const navigate = useNavigate();

//   const [showCreate, setShowCreate] = useState(false);

//   if (isLoading) {
//     return (
//       <div className="page flex justify-center items-center">
//         <p>Loading projects...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="page">
//       <div className="max-w-5xl w-full mx-auto px-4">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-3xl font-bold">Projects</h1>
//             <p className="text-gray-500">Select a project to view its tasks</p>
//           </div>

//           <Button
//             size="lg"
//             variant="primary"
//             onClick={() => setShowCreate(true)}
//           >
//             + Add Project
//           </Button>
//         </div>

//         {/* Content */}
//         <div className="min-h-[300px]">
//           {data && data.length > 0 ? (
//             <ProjectList
//               projects={data}
//               onSelect={(id) => navigate(`/projects/${id}`)}
//             />
//           ) : (
//             <div className="flex flex-col items-center justify-center h-[300px] border border-dashed rounded-lg text-gray-500">
//               <p className="text-lg font-medium">No projects yet</p>
//               <p className="text-sm">
//                 Click “Add Project” to create your first project
//               </p>
//             </div>
//           )}
//         </div>

//         {/* Modal */}
//         <CreateProjectModal
//           isOpen={showCreate}
//           onClose={() => setShowCreate(false)}
//         />
//       </div>
//     </div>
//   );
// }
