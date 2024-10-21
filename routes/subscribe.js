const express = require('express');
const router = express.Router();

router.post('/subscribe', (req, res)=>{

    res.render('subscribe', {email: req.body.email})
})
router.post('/user/subscribe', (req, res)=>{

    res.render('subscribe', {email: req.body.email})
})

module.exports = router