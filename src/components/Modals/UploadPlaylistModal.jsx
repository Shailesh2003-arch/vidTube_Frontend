import { useState, useEffect } from "react";
import { createPlaylist, updatePlaylist } from "../../services/playlistService";

export default function UploadPlaylistModal({
  isOpen,
  onClose,
  onSuccess,
  initialData = null,
  isEdit = false,
}) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || ""
  );
  const [loading, setLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState(null); // file state
  const [preview, setPreview] = useState(initialData?.thumbnail.url || null); // preview URL

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file)); // create temporary preview URL
    }
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setThumbnail(initialData.thumbnail);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description) {
      alert("Please fill all fields!");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);

    try {
      setLoading(true);
      let response;
      if (isEdit) {
        response = await updatePlaylist(initialData._id, formData);
      } else {
        response = await createPlaylist(formData);
      }

      console.log("Response from server:", response);

      if (response.data) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.log(`Error Creating Playlist`, error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return;

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-left">
            {isEdit ? "Edit Playlist" : "Create Playlist"}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Playlist Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />

            <textarea
              placeholder="Playlist Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />

            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Playlist Thumbnail
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent"
            />

            {preview && (
              <img
                src={preview}
                alt="Playlist Preview"
                className="mt-2 w-32 h-32 object-cover rounded-md"
              />
            )}

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
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Uploading..."
                  : isEdit
                  ? "Update"
                  : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
}
