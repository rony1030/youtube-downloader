const fs = require("fs-extra");
const path = require("path");
const youtubedl = require("youtube-dl-exec");
const ffmpegPath = require("ffmpeg-static");

const downloadsDir = path.join(__dirname, "../downloads");

const parseUrl = (value = "") => {
  const url = value.trim();
  try {
    const parsed = new URL(url);
    if (!["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "music.youtube.com"].includes(parsed.hostname)) throw new Error();
  } catch {
    const error = new Error("Pega un enlace válido de YouTube.");
    error.status = 400;
    throw error;
  }
  return url;
};

const safeFileName = (title) => title.normalize("NFKD").replace(/[<>:"/\\|?*\u0000-\u001F]/g, "").replace(/\s+/g, " ").trim().slice(0, 90) || "youtube-download";

const infoFlags = { dumpSingleJson: true, noWarnings: true, noPlaylist: true, skipDownload: true };

const getVideoInfo = async (req, res) => {
  try {
    const url = parseUrl(req.body.url);
    const info = await youtubedl(url, infoFlags);
    const heights = new Set((info.formats || []).filter((item) => item.vcodec !== "none" && item.height && item.height <= 1080).map((item) => item.height));
    res.json({
      success: true,
      data: {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: Number(info.duration || 0),
        author: info.uploader || info.channel || "YouTube",
        viewCount: Number(info.view_count || 0),
        uploadDate: info.upload_date,
        qualities: [...heights].sort((a, b) => b - a).map((height) => ({ value: String(height), label: `${height}p` })),
      },
    });
  } catch (error) {
    console.error("Could not read video info:", error.message);
    res.status(error.status || 500).json({ error: error.status ? error.message : "No pudimos leer este video. Puede ser privado o estar restringido." });
  }
};

const downloadVideo = async (req, res) => {
  let filePath;
  try {
    const url = parseUrl(req.body.url);
    const format = req.body.format === "mp3" ? "mp3" : "mp4";
    const quality = String(req.body.quality || (format === "mp3" ? "192" : "720"));
    const info = await youtubedl(url, infoFlags);
    const fileName = `${safeFileName(info.title)}-${Date.now()}.${format}`;
    filePath = path.join(downloadsDir, fileName);
    await fs.ensureDir(downloadsDir);

    const common = { output: filePath, noPlaylist: true, noWarnings: true, ffmpegLocation: ffmpegPath };
    if (format === "mp3") {
      const bitrate = ["128", "192", "320"].includes(quality) ? quality : "192";
      await youtubedl(url, { ...common, extractAudio: true, audioFormat: "mp3", audioQuality: `${bitrate}K` });
    } else {
      const height = /^\d{3,4}$/.test(quality) ? quality : "720";
      await youtubedl(url, { ...common, format: `bv*[height<=${height}]+ba/b[height<=${height}]`, mergeOutputFormat: "mp4" });
    }

    res.json({ success: true, downloadUrl: `/downloads/${encodeURIComponent(fileName)}`, fileName });
    setTimeout(() => fs.remove(filePath).catch(() => {}), 30 * 60 * 1000).unref();
  } catch (error) {
    console.error("Download failed:", error.message);
    if (filePath) await fs.remove(filePath).catch(() => {});
    if (!res.headersSent) res.status(error.status || 500).json({ error: error.status ? error.message : "No se pudo preparar la descarga. Intenta otra calidad." });
  }
};

module.exports = { getVideoInfo, downloadVideo };
