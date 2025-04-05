export default function PreviewPage() {
  const videoDate = "12/18/2024, 3:45:00 PM";
  const videoCommit = "429f7e4";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#957777]">Video Preview</h1>
      <div className="max-w-4xl mx-auto">
        <video
          controls
          className="w-full rounded-lg shadow-lg"
          src="/Preview-MissionEnrollment-WebApp.mp4"
        >
          Your browser does not support the video tag.
        </video>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Last updated: {videoDate} (commit: {videoCommit})
        </p>
      </div>
    </div>
  );
}
