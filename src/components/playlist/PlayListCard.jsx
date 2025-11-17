import { Link } from "react-router-dom";
export const PlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlist/${playlist._id}`} className="group block">
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        <img src={playlist.thumbnail} className="..." />

        <div
          className="absolute inset-0 bg-black/40 opacity-0 
            group-hover:opacity-100 transition flex items-center justify-center"
        >
          <button className="bg-white px-4 py-2 rounded font-semibold">
            PLAY ALL
          </button>
        </div>
      </div>

      <h3 className="font-semibold mt-2">{playlist.title}</h3>
      <p className="text-sm text-gray-500">{playlist.videos.length} videos</p>
    </Link>
  );
};
