const auth = require("../middleware/auth"); // to restrict route
const jwt = require("jsonwebtoken");
const config = require("config");
const bcrypt = require('bcrypt');
const _ = require("lodash");
const {User, validate} = require('../models/user.js');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	const {error} = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({email: req.body,email});
	if(user) return res.status(400).send('User already exists');

	// user = new User({
	// 	name = req.body.name,
	// 	email = req.body.email,
	// 	password = req.body.password
	// });

	user = new User(_.pick(req.body, ['name', 'email', 'password']));

	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	const token = user.generateAuthToken();
	res.header('x-token-auth', token).send(_.pick(user, ['_id', 'name', 'email']));

})


// router.get('/', (req,res) => {
// 	res.send([1,2,3,4,5]);
// });

router.get('/me',auth, async (req,res) => {
	// res.send(req.params.id);
	const user = User.findById(req.user._id).select('-password');
	res.send(user);
});

module.exports = router;