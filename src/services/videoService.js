export const fetchHomePageVideos = async (page, limit = 10) => {
  const res = await fetch(
    `http://localhost:4000/api/v1/videos/homepage?page=${page}&limit=${limit}`,
    {
      credentials: "include",
    }
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch videos");
  return data;
};
