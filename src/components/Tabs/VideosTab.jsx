import { useState } from "react";
import { useVideos } from "../../hooks/useVideos";
import UploadVideoModal from "../Modals/UploadVideoModal";
import EditVideoModal from "../Modals/EditVideoModal";
import timeAgo from "../../utils/formatTimeAgo";
import UploadButton from "../UplaodButton";
import { Upload } from "lucide-react";

export default function VideosTab() {
  const { videos, error, loading, fetchVideos, deleteVideo, updateVideo } =
    useVideos();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="w-full relative">
      {/* Desktop Upload Button */}
      <div className="hidden md:flex fixed bottom-6 right-6 w-16 mb-4">
        <div onClick={() => setIsUploadOpen(true)}>
          <UploadButton />
        </div>
      </div>

      {/* Videos Content */}
      {videos.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
          No videos available
        </p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Views</th>
                  <th className="text-left p-2">Published</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {videos.map((video) => (
                  <tr key={video._id} className="border-b dark:border-gray-700">
                    <td className="p-2 font-medium">{video.title}</td>
                    <td className="p-2 text-gray-600 dark:text-gray-400 line-clamp-1">
                      {video.description}
                    </td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-400">
                      {video.views || 0}
                    </td>
                    <td className="p-2 text-sm text-gray-700 dark:text-gray-400">
                      {timeAgo(video.createdAt)}
                    </td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setSelectedVideo(video);
                        }}
                        className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteVideo(video._id)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                      <button
                        // onClick={() => {
                        //   setSelectedVideo(video);
                        //   setIsPlaylistModalOpen(true);
                        // }}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Add to Playlist
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4 mt-6 w-full">
            {videos.map((video) => (
              <div
                key={video._id}
                className="border dark:border-gray-700 rounded-lg p-4 shadow"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {video.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {video.description}
                </p>
                <div className="flex justify-between items-center mt-3 text-sm text-gray-500 dark:text-gray-400">
                  <span>{video.views || 0} views</span>
                  <span>{timeAgo(video.createdAt)}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setSelectedVideo(video);
                    }}
                    className="flex-1 px-3 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteVideo(video._id)}
                    className="flex-1 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    // onClick={() => {
                    //   setSelectedVideo(video);
                    //   setIsPlaylistModalOpen(true);
                    // }}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add to Playlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Floating Upload FAB for Mobile */}
      <button
        onClick={() => setIsUploadOpen(true)}
        className="fixed bottom-6 right-6 w-16  text-white rounded-full shadow-lg flex items-center justify-center  z-50 md:hidden"
      >
        <UploadButton />
      </button>

      {/* Modals */}
      {isUploadOpen && (
        <UploadVideoModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={() => {
            fetchVideos();
            setIsUploadOpen(false);
          }}
        />
      )}
      {isEditModalOpen && (
        <EditVideoModal
          video={selectedVideo}
          onClose={() => setIsEditModalOpen(false)}
          onSave={updateVideo}
        />
      )}
    </div>
  );
}
