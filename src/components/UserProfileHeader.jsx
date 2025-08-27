// src/components/UserProfileHeader.jsx
// src/components/UserProfileHeader.jsx
export const UserProfileHeader = ({ avatar, fullName, username }) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 md:flex-row md:items-start md:gap-6 w-full overflow-hidden ">
      {/* Avatar */}
      <img
        src={avatar}
        alt={fullName}
        className="w-24 h-24 rounded-full object-cover shrink-0"
      />

      {/* Name & username */}
      <div className="text-center md:text-left flex-1 min-w-0">
        <h2 className="text-2xl font-bold">{fullName}</h2>
        <p className="text-gray-400">
          @{username} •{" "}
          <span className="text-blue-400 cursor-pointer">View channel</span>
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4 md:mt-0 md:ml-auto flex-wrap justify-center md:justify-end">
        <button className="px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span>Switch account</span>
        </button>
        <button className="px-4 py-2 rounded-lg border border-black/20 dark:border-white/20 bg-white dark:bg-gray-800 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <span>Google Account</span>
        </button>
      </div>
    </div>
  );
};
