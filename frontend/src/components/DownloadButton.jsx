import { useEffect, useMemo, useState } from "react";
import { FaDownload, FaMusic, FaVideo } from "react-icons/fa";

const audioQualities = [{ value: "128", label: "128 kbps", hint: "Ligero" }, { value: "192", label: "192 kbps", hint: "Recomendado" }, { value: "320", label: "320 kbps", hint: "Máxima" }];

const DownloadButton = ({ videoInfo, onDownload, disabled }) => {
  const [format, setFormat] = useState("mp3");
  const videoQualities = useMemo(() => videoInfo.qualities?.length ? videoInfo.qualities : [{ value: "360", label: "360p" }], [videoInfo]);
  const [quality, setQuality] = useState("192");
  const options = format === "mp3" ? audioQualities : videoQualities;

  useEffect(() => setQuality(format === "mp3" ? "192" : (videoQualities.find((item) => item.value === "720")?.value || videoQualities[0].value)), [format, videoQualities]);

  return (
    <div className="download-panel">
      <div className="panel-row">
        <div><span className="step-label">1 · Formato</span><div className="format-toggle">
          <button className={format === "mp3" ? "active" : ""} onClick={() => setFormat("mp3")} type="button"><FaMusic /> MP3 <small>Audio</small></button>
          <button className={format === "mp4" ? "active" : ""} onClick={() => setFormat("mp4")} type="button"><FaVideo /> MP4 <small>Video</small></button>
        </div></div>
        <div className="quality-block"><label className="step-label" htmlFor="quality">2 · Calidad</label><select id="quality" value={quality} onChange={(event) => setQuality(event.target.value)}>{options.map((item) => <option key={item.value} value={item.value}>{item.label}{item.hint ? ` · ${item.hint}` : ""}</option>)}</select></div>
      </div>
      <button className="download-btn" onClick={() => onDownload(quality, format)} disabled={disabled}>{disabled ? <><span className="loader" /> Preparando…</> : <><FaDownload /> Descargar {format.toUpperCase()}</>}</button>
    </div>
  );
};

export default DownloadButton;
