const OS  = require('os');
const HOSTNAME = OS.hostname();
let recordFile = require('./models/Record');
let CRUDFile = require('./models/CRUD');
let patientFile = require('./models/Patient');
const express = require('express');
const path = require('path');
const  app = express();
const PORT = 3000;

const crud = new CRUDFile.CRUD();
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

app.get('/createpatient', (req,res) =>{
	console.log("GET | /createpatient | "+ req.ip + " | "+ Date());
	res.render('createPatient');
	
})

app.post('/newrecord', (req, res) => {
	console.log('POST | /newrecord | '+ req.ip+' | '+ Date());
	console.log(req.body);
})

app.post('/newpatient', (req, res) => {
	console.log('POST | /newpatient | '+ req.ip +' | '+ Date());
	console.log(req.body);
	let patient = new patientFile.Patient(req.body.lastname, req.body.firstname, req.body.id);
	crud.createPatient(patient);
	
})

app.get('/terminal', (req,res) =>{
	res.render('terminal');
})

app.get('/searchPatient', (req, res) =>{
	console.log('GET | /searchPatient | '+ req.socket.remoteAddress +' | '+ Date());
	let queryResult;
	if(req.query.searchType == 0){
		crud.readByPatientId(req.query.text).then(q => {
			queryResult = q;
			res.json(queryResult);
		});
	}
	else if(req.query.searchType == 1){
		 crud.readByPatientName(req.query.text).then(q => {
			queryResult = q;
			console.log(queryResult);
			res.json(queryResult);
		});
	}


})

app.post('/terminalExecute', (req,res) =>{
	let command = req.body.command.split(" ");
	//command[0] command itself, command[1] parameter.
	if(command[0] === "/erase"){
		crud.erase(command[1]);
	}else if(command[0] === "/show"){
		crud.readAll();
	}
	else if(command[0] === "/deleteall"){
		crud.deleteAll();
	}
	else{
		console.log(command[0]+" Is not a valid command");
	}
	
})

app.listen(PORT);