require('express-async-errors');
const error = require("./middleware/error");

const Joi = require("joi");
// const config = require("config");
const morgan = require("morgan");
const helmet = require("helmet");
// const mongoose = require("mongoose");

const users = require("./routes/users");
const auth = require("./routes/authentication");
const courses = require("./routes/courses");

const bodyParser = require('body-parser');

const express = require('express');
const app = express();

const cors = require('cors')
var whitelist = ['http://localhost:3006', 'http://bugzilla.intellicar.in:3000', 'https://bugzilla.intellicar.in:3000', 'http://bugzilla.intellicar.in:10328', 'https://bugzilla.intellicar.in:10328']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded(
  { 
    limit: '50mb', extended: true 
  }));

app.use(cors());

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