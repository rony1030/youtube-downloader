import { FaClock, FaEye } from "react-icons/fa";

const formatDuration = (value) => {
  const seconds = Number(value);
  const parts = [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60];
  if (!parts[0]) parts.shift();
  return parts.map((part, index) => index ? String(part).padStart(2, "0") : part).join(":");
};

const formatViews = (views) => new Intl.NumberFormat("es", { notation: "compact", maximumFractionDigits: 1 }).format(views);

const VideoInfo = ({ videoInfo }) => (
  <div className="video-info">
    <div className="thumbnail-wrap">
      <img src={videoInfo.thumbnail} alt="" />
      <span className="duration"><FaClock /> {formatDuration(videoInfo.duration)}</span>
    </div>
    <div className="video-copy">
      <span className="found-label">Video encontrado</span>
      <h2>{videoInfo.title}</h2>
      <div className="video-meta"><span>{videoInfo.author}</span><i /><span><FaEye /> {formatViews(videoInfo.viewCount)} vistas</span></div>
    </div>
  </div>
);

export default VideoInfo;
