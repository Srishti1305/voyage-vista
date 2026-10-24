const r=require('express').Router(),c=require('../controllers/destinationController');r.get('/',c.getAll);r.get('/:id',c.getOne);module.exports=r;
