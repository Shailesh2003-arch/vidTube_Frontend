export const Tweets = () => {
  return (
    <div className="flex h-screen ">
      {/* Main content */}
      <div className="flex-1 p-4 flex flex-col ">
        <div className="flex items-end justify-end gap-4">
          {/* <NotificationBell /> */}
        </div>

        <h2 className="text-xl font-bold mb-4">Tweets</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-scroll h-[80vh] hide-scrollbar "></div>
      </div>
    </div>
  );
};
