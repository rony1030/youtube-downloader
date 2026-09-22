import { useState } from "react";
import { FaArrowRight, FaBolt, FaCheckCircle, FaLink, FaMusic, FaPlay } from "react-icons/fa";
import { downloadVideo, fileUrl, getVideoInfo } from "../services/api";
import DownloadButton from "./DownloadButton";
import VideoInfo from "./VideoInfo";

const VideoDownloader = () => {
  const [url, setUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState(null);

  const handleGetInfo = async (event) => {
    event.preventDefault();
    if (!url.trim()) return setNotice({ type: "error", text: "Pega primero un enlace de YouTube." });
    setLoading(true); setNotice(null); setVideoInfo(null);
    try { setVideoInfo((await getVideoInfo(url)).data); }
    catch (error) { setNotice({ type: "error", text: error.message }); }
    finally { setLoading(false); }
  };

  const handleDownload = async (quality, format) => {
    setDownloading(true); setNotice({ type: "progress", text: "Estamos preparando tu archivo. Puede tardar un momento…" });
    try {
      const response = await downloadVideo(url, quality, format);
      const link = document.createElement("a");
      link.href = fileUrl(response.downloadUrl); link.download = response.fileName;
      document.body.appendChild(link); link.click(); link.remove();
      setNotice({ type: "success", text: "¡Listo! Tu descarga acaba de comenzar." });
    } catch (error) { setNotice({ type: "error", text: error.message }); }
    finally { setDownloading(false); }
  };

  const resetUrl = (event) => {
    setUrl(event.target.value); setVideoInfo(null); setNotice(null);
  };

  return (
    <main className="page-shell">
      <nav className="nav">
        <a className="brand" href="#" aria-label="Inicio"><span className="brand-mark"><FaPlay /></span><span>Tubo</span></a>
        <span className="nav-note"><span /> Gratis · Sin registro</span>
      </nav>

      <section className="hero">
        <div className="eyebrow"><FaBolt /> Rápido, limpio y fácil</div>
        <h1>Tu música y videos,<br /><em>siempre contigo.</em></h1>
        <p className="hero-copy">Pega un enlace de YouTube, elige tu formato favorito y descarga. Así de simple.</p>

        <form className="search-card" onSubmit={handleGetInfo}>
          <div className="url-field">
            <FaLink aria-hidden="true" />
            <input type="url" inputMode="url" placeholder="Pega aquí el enlace de YouTube…" value={url} onChange={resetUrl} disabled={loading || downloading} aria-label="Enlace de YouTube" />
          </div>
          <button className="primary-btn" disabled={loading || downloading || !url.trim()}>
            {loading ? <span className="loader" /> : <>Continuar <FaArrowRight /></>}
          </button>
        </form>
        <p className="legal">Descarga únicamente contenido propio o que tengas permiso para usar.</p>
      </section>

      {notice && <div className={`notice ${notice.type}`} role="status">{notice.type === "success" && <FaCheckCircle />}<span>{notice.text}</span></div>}

      {videoInfo && (
        <section className="result-card">
          <VideoInfo videoInfo={videoInfo} />
          <DownloadButton videoInfo={videoInfo} onDownload={handleDownload} disabled={downloading} />
        </section>
      )}

      {!videoInfo && (
        <section className="benefits">
          <article><span className="benefit-icon violet"><FaBolt /></span><div><h2>En segundos</h2><p>Sin pasos innecesarios.</p></div></article>
          <article><span className="benefit-icon coral"><FaMusic /></span><div><h2>Audio y video</h2><p>MP3 o MP4, tú eliges.</p></div></article>
          <article><span className="benefit-icon mint"><FaCheckCircle /></span><div><h2>Calidad flexible</h2><p>Elige entre las opciones disponibles.</p></div></article>
        </section>
      )}
    </main>
  );
};

export default VideoDownloader;
