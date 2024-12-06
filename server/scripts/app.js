//const sqlite = require('node:sqlite3');
//const db = new sqlite.Database(':memory:');
const OS  = require('os');
const HOSTNAME = OS.hostname();
let recordFile = require('./models/Record');
const express = require('express');
const path = require('path');
const  app = express();
const PORT = 3000;

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json())
console.log('HOSTNAME : '+ HOSTNAME);
console.log('Listening on port : '+ PORT);
console.log("\n### Request Info ###");
console.log('HTTP METHOD | URL  ROUTE | IP | TIME');


app.get('/', (req,res) => {
	console.log("GET | / | "+ req.ip+ " | "+ Date())
	res.render('index');
})

app.get('/mediclogin', (req,res) => {
	console.log("GET | /mediclogin | "+ req.ip+ " | "+ Date());
	res.render('medicLogin');
})

app.get('/catalog', (req, res) =>{
	console.log("GET | /catalog | "+ req.ip+ " | "+ Date());
	res.render('catalog')
})

app.get('/createrecord', (req, res) => {
	console.log("GET | /createrecord | "+ req.ip+ " | "+ Date());
	res.render('createRecord')
})

app.post('/newrecord', (req, res) => {
	console.log('POST | /newrecord | '+ req.ip+' | '+ Date());
	console.log(req.body);
})

app.listen(PORT);