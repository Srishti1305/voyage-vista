const crypto = require("crypto");
const db = require("../config/db");
const supabase = require("../config/supabase");

const BUCKET = process.env.SUPABASE_BUCKET || "trip-photos";
const SIGNED_URL_SECONDS = 60 * 60; // links expire after 1 hour
const EXT = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

exports.mine = async (req, res) => {
  try {
    const params = [req.user.id];
    let sql = `SELECT p.id, p.filename, p.caption, p.created_at, p.destination_id, d.name AS destination_name
               FROM trip_photos p JOIN destinations d ON d.id = p.destination_id WHERE p.user_id = ?`;
    if (req.query.destination_id) {
      sql += " AND p.destination_id = ?";
      params.push(req.query.destination_id);
    }
    sql += " ORDER BY p.created_at DESC";
    const [rows] = await db.query(sql, params);
    if (!rows.length) return res.json([]);

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(
        rows.map((r) => r.filename),
        SIGNED_URL_SECONDS,
      );
    if (error) throw error;
    const urlByPath = Object.fromEntries(
      data.map((d) => [d.path, d.signedUrl]),
    );

    res.json(rows.map((r) => ({ ...r, url: urlByPath[r.filename] || "" })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load photos" });
  }
};

exports.upload = async (req, res) => {
  const { destination_id, caption = "" } = req.body;
  if (!req.file)
    return res.status(400).json({ message: "Choose an image to upload" });
  let path;
  try {
    const [d] = await db.query("SELECT id FROM destinations WHERE id=?", [
      destination_id,
    ]);
    if (!d.length)
      return res.status(400).json({ message: "Pick a valid destination" });

    path = `${req.user.id}/${crypto.randomUUID()}${EXT[req.file.mimetype]}`;
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, req.file.buffer, { contentType: req.file.mimetype });
    if (error) throw error;

    await db.query(
      "INSERT INTO trip_photos(user_id,destination_id,filename,caption) VALUES(?,?,?,?)",
      [req.user.id, destination_id, path, caption.slice(0, 255)],
    );
    res.status(201).json({ message: "Photo saved to the cloud" });
  } catch (e) {
    console.error(e);
    if (path) await supabase.storage.from(BUCKET).remove([path]);
    res.status(500).json({ message: "Could not save photo" });
  }
};

exports.remove = async (req, res) => {
  try {
    const [r] = await db.query(
      "SELECT filename FROM trip_photos WHERE id=? AND user_id=?",
      [req.params.id, req.user.id],
    );
    if (!r.length) return res.status(404).json({ message: "Photo not found" });
    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([r[0].filename]);
    if (error) throw error;
    await db.query("DELETE FROM trip_photos WHERE id=?", [req.params.id]);
    res.json({ message: "Deleted" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not delete photo" });
  }
};
