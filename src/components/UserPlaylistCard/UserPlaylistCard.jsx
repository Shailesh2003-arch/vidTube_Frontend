import { Link } from "react-router-dom";
export const UserPlaylistCard = ({ playlist }) => {
  return (
    <Link to={`/playlists/${playlist._id}`} className="group block w-full">
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-200 dark:bg-gray-900">
        <img
          src={playlist.thumbnail}
          alt={playlist.name}
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300"
        />

        {/* Hover overlay */}
        <div
          className="absolute inset-0 bg-black/50 
          opacity-0 group-hover:opacity-100 
          transition flex items-center justify-center"
        >
          <span
            className="px-4 py-2 text-sm font-medium 
          bg-black/40 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg 
          text-white border border-gray-700"
          >
            ▶ PLAY ALL
          </span>
        </div>
      </div>

      {/* Info Section */}
      <h3
        className="
        font-semibold mt-3 
        text-gray-900 dark:text-gray-100 
        truncate
      "
      >
        {playlist.name}
      </h3>

      <p
        className="
        text-sm 
        text-gray-600 dark:text-gray-400
      "
      >
        {playlist.videos?.length} videos
      </p>
    </Link>
  );
};
