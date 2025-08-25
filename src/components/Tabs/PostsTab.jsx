export default function PostsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      <p className="text-gray-500 dark:text-gray-400 mb-2">
        No posts published
      </p>
      <button className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700">
        Create post
      </button>
    </div>
  );
}
