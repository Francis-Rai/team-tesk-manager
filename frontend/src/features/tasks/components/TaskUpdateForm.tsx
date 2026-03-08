export default function TaskUpdateForm() {
  return (
    <div className="space-y-3">
      <div className="border rounded-lg p-4 bg-background space-y-3">
        <textarea
          placeholder="Write an update or comment..."
          className="w-full resize-none text-sm outline-none"
        />

        <div className="flex justify-end">
          <button className="px-4 py-2 text-sm bg-primary text-white rounded-md">
            Post Update
          </button>
        </div>
      </div>
    </div>
  );
}
