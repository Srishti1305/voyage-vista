const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    const [exists] = await db.query("SELECT id FROM users WHERE email=?", [
      email,
    ]);
    if (exists.length)
      return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const [r] = await db.query(
      "INSERT INTO users(name,email,password_hash) VALUES(?,?,?)",
      [name, email, hash],
    );
    res.status(201).json({ message: "Account created", userId: r.insertId });
  } catch (e) {
    console.error(e);res.status(500).json({message:'Could not create account'});
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const [rows] = await db.query("SELECT * FROM users WHERE email=?", [email]);
    if (
      !rows.length ||
      !(await bcrypt.compare(password, rows[0].password_hash))
    )
      return res.status(401).json({ message: "Invalid email or password" });
    const u = rows[0];
    const token = jwt.sign(
      { id: u.id, name: u.name, email: u.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({ token, user: { id: u.id, name: u.name, email: u.email } });
  } catch (e) {
    res.status(500).json({ message: "Could not login" });
  }
};
