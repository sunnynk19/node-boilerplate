const Joi = require("joi");
const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoose = require("mongoose");

const users = require("./routes/users");
const auth = require("./routes/authentication");
const courses = require("./routes/courses");

const express = require('express');
const app = express();

if(!config.get("jwtPrivateKey")){
	console.error("FATAL ERROR: jwtPrivateKey is not defined");
	process.exit(1);  
}

app.use(express.json()); //req.body
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());

mongoose.connect("mongodb://localhost/opentasks")
	.then(() => console.log("db connected"))
	.catch(err => console.log(err));

// console.log(config.get("api_url"));

app.get('/', (req,res) => {
	res.send("Hello World");
});

app.use('/api/courses', courses);
app.use('/api/users', users);
app.use('/api/auth', auth);

const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Listening app on port ${port}...`)})