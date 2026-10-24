const r=require('express').Router(),c=require('../controllers/tripController'),auth=require('../middleware/authMiddleware');r.post('/',auth,c.create);r.get('/mine',auth,c.mine);module.exports=r;
