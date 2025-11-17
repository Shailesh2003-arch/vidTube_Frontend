import { useState } from "react";

// here we have not used the axios instance... keep in mind.
export default function UploadVideoModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVideoUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !thumbnail || !videoFile) {
      alert("Please fill all fields!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("thumbnail", thumbnail);
    formData.append("videoFile", videoFile);

    try {
      const res = await fetch(`http://localhost:4000/api/v1/videos/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      console.log("Upload response:", data);

      // call success callback if video uploaded
      if (data?.data) {
        onSuccess?.(data.data);
      }

      onClose();
    } catch (error) {
      console.log(`Error Uploading the video`, error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ye check ab component level pe hoga, na ki handler me
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Upload Video</h2>

        <form onSubmit={handleVideoUpload} className="flex flex-col gap-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Video Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
          />

          {/* Description */}
          <textarea
            placeholder="Video Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
          />

          {/* Thumbnail */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
          />

          {/* Video */}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
          />

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-400 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
