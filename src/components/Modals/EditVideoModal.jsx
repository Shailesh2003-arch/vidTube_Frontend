import { useState, useEffect } from "react";

export default function EditVideoModal({ video, onClose, onSave }) {
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [thumbnail, setThumbnail] = useState(null); // new file
  const [preview, setPreview] = useState(video.thumbnail); // current or new thumbnail
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", description: "" });

  // Handle file change
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // Cleanup memory for URL.createObjectURL
  useEffect(() => {
    return () => {
      if (preview && preview !== video.thumbnail) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview, video.thumbnail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    let hasError = false;
    const newErrors = { title: "", description: "" };
    if (!title.trim()) {
      newErrors.title = "Title is required";
      hasError = true;
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // Prepare FormData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    setLoading(true);
    try {
      await onSave(video._id, formData); // parent API call
      onClose();
    } catch (err) {
      console.error("Error updating video:", err);
      alert("Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">Update Video Details</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`p-2 rounded-lg border ${
              errors.title
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-transparent`}
          />
          {errors.title && (
            <span className="text-red-500 text-xs">{errors.title}</span>
          )}

          {/* Description */}
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`p-2 rounded-lg border ${
              errors.description
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } bg-transparent`}
          />
          {errors.description && (
            <span className="text-red-500 text-xs">{errors.description}</span>
          )}

          {/* Thumbnail */}
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Thumbnail
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
          />

          {/* Preview */}
          {preview && (
            <div className="flex flex-col gap-1">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Current / Selected Thumbnail Preview
              </span>
              <img
                src={preview}
                alt="Thumbnail Preview"
                className="w-full h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-700"
              />
            </div>
          )}

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
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
