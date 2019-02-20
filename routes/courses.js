const auth = require("../middleware/auth"); // to restrict route
const express = require('express');
const router = express.Router();

router.get('/',auth,(req,res) => {
	res.send([1,2,3,4,5]);
});

router.get('/:id', (req,res) => {
	res.send(req.params.id);
});

module.exports = router;