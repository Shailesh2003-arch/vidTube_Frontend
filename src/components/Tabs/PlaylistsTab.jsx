import UploadButton from "../UplaodButton";
export default function PlaylistsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-60 text-center">
      <p className="text-gray-500 dark:text-gray-400 mb-2">
        No playlists created yet
      </p>
      {/* <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700">
        New playlist
      </button> */}
      <div className="hidden md:flex fixed bottom-6 right-6 w-16 mb-4">
        <div onClick={() => setIsUploadOpen(true)}>
          <UploadButton />
        </div>
      </div>

      {/* Floating Upload FAB for Mobile */}
      <button
        // [PENDING]
        onClick={() => setIsUploadOpen(true)} // add new modal of uploading the playlist...
        className="fixed bottom-6 right-6 w-16  text-white rounded-full shadow-lg flex items-center justify-center  z-50 md:hidden"
      >
        <UploadButton />
      </button>
    </div>
  );
}
