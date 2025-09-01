export const createPlaylist = async (formData) => {
  try {
    const res = await fetch(`http://localhost:4000/api/v1/users/playlist`, {
      credentials: "include",
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to create playlist");
    }
    return data;
  } catch (error) {
    console.log(`Error creating the playlist: `, error.message);
  }
};

export const updatePlaylist = async (playlistId, formData) => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/v1/users/playlist/${playlistId}`,
      {
        credentials: "include",
        method: "PATCH",
        body: formData,
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to update playlist");
    }

    return data;
  } catch (error) {
    console.error("Error updating playlist:", error.message);
    throw error;
  }
};

export const deletePlaylist = async (playlistId) => {
  try {
    const res = await fetch(
      `http://localhost:4000/api/v1/users/playlist/${playlistId}`,
      {
        credentials: "include",
        method: "DELETE",
      }
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to delete the Playlist");
    }
    return data;
  } catch (error) {
    console.log(`Error deleting the Playlist`, error.message);
  }
};
