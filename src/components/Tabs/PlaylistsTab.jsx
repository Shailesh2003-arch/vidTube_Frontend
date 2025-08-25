export default function PlaylistsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      <p className="text-gray-500 dark:text-gray-400 mb-2">
        No playlists created yet
      </p>
      <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
        New playlist
      </button>
    </div>
  );
}
