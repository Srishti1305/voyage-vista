const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{const header=req.headers.authorization;if(!header?.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'});try{req.user=jwt.verify(header.split(' ')[1],process.env.JWT_SECRET);next();}catch(e){res.status(401).json({message:'Invalid or expired token'});}};
