import { useState, useEffect } from "react";

export const CreateTweetModal = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !image) {
      alert("Tweet cannot be empty");
      return;
    }

    setLoading(true);
    try {
      // make the form-data if there's an image being uploaded...
      if (image) {
        const formData = new FormData();
        formData.append("content", content);
        formData.append("image", image);
        await onSubmit(formData);
      } else {
        // its just a text data
        await onSubmit({ content });
      }
      setContent("");
      setImage(null);
      onClose();
    } catch (error) {
      console.log("Failed to post:", error.message);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          Create Post
        </h2>

        {/* Textarea */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full mt-4 p-3 rounded-lg border dark:border-gray-700
                     bg-gray-50 dark:bg-gray-800 
                     text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          rows={4}
        />

        {/* Image preview */}
        {image ? (
          <div className="mt-3">
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="w-full rounded-lg object-cover max-h-60"
            />
          </div>
        ) : null}

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <label className="cursor-pointer text-blue-600 dark:text-blue-400 text-sm">
            Upload Image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || (!content.trim() && !image)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
