const r = require('express').Router();
const c = require('../controllers/photoController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

r.get('/', auth, c.mine);
r.post('/', auth, (req, res, next) =>
  upload.single('photo')(req, res, err => err ? res.status(400).json({ message: err.message }) : next()), c.upload);
r.delete('/:id', auth, c.remove);

module.exports = r;
