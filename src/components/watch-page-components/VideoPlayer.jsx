export const VideoPlayer = ({ videoUrl }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
      <video
        src={videoUrl}
        controls
        autoPlay
        className="w-full h-full object-cover"
      />
    </div>
  );
};
