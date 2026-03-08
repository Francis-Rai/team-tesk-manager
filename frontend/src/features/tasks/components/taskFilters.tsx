import type { Dispatch, SetStateAction } from "react";

interface Props {
  search: string;
  status: string;
  view: "list" | "board";

  setSearch: Dispatch<SetStateAction<string>>;
  setStatus: Dispatch<SetStateAction<string>>;
  setPage: Dispatch<SetStateAction<number>>;
  setView: Dispatch<SetStateAction<"list" | "board">>;
}

export default function TaskFilters({
  search,
  status,
  view,
  setSearch,
  setStatus,
  setView,
}: Props) {
  return (
    <div className="flex flex-wrap gap-4">
      <input
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded px-3 py-2 text-sm w-62.5"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border rounded px-3 py-2 text-sm"
      >
        <option value="">All Status</option>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      <div className="flex gap-2">
        <button
          onClick={() => setView("list")}
          className={`px-3 py-1 border rounded text-sm ${
            view === "list" ? "bg-primary text-white" : "bg-white"
          }`}
        >
          List
        </button>

        <button
          onClick={() => setView("board")}
          className={`px-3 py-1 border rounded text-sm ${
            view === "board" ? "bg-primary text-white" : "bg-white"
          }`}
        >
          Board
        </button>
      </div>
    </div>
  );
}
