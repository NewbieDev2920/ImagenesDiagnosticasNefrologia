const multer = require('multer')
const OS  = require('os');
const HOSTNAME = OS.hostname();
let recordFile = require('./models/Record');
let CRUDFile = require('./models/CRUD');
let authFile = require('./models/Authentication');
let patientFile = require('./models/Patient');
let medicFile = require('./models/Medic');
const express = require('express');
const path = require('path');
const  app = express();
const PORT = 3000;
const upload = multer({dest:"uploads/"});
const session = require('express-session')

app.use(session({
	secret: "clave super secreta",
	resave: false,
	saveUninitialized: false,
}))

const crud = new CRUDFile.CRUD();
const auth = new authFile.Authentication();
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname,'public')));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
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

app.get('/patientlogin', (req, res) => {
	console.log("GET | /patientlogin | "+ req.ip+ " | "+ Date());
	res.render('patientLogin');
})

app.get('/patientrecordcatalog', (req, res) =>{
	console.log("GET | /patientrecordcatalog | "+ req.ip+ " | "+ Date());
	res.render('patientRecordCatalog');
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

app.post('/newrecord', upload.array("files"),(req, res) => {
	console.log('POST | /newrecord | '+ req.ip+' | '+ Date());
	console.log(req.body);
	console.log(req.files);
	let imagesPaths = [];
	for(let i = 0; i < req.files.length; i++){
		imagesPaths.push(req.files[i].path);
	}
	let record = new recordFile.Record(req.body.id, req.body.name, req.body.date, imagesPaths);
	crud.createRecord(record);
	res.json({status : "OK"});
})

app.post('/newpatient', (req, res) => {
	console.log('POST | /newpatient | '+ req.ip +' | '+ Date());
	console.log(req.body);
	let patient = new patientFile.Patient(req.body.lastname, req.body.firstname, req.body.id);
	crud.createPatient(patient);
	
})

app.post('/newmedic', (req, res) =>{
	console.log(req.body);
	let medic = new medicFile.Medic(req.body.lastname, req.body.firstname, req.body.id, req.body.password);
	crud.createMedic(medic);
	
})

app.get('/terminal', (req,res) =>{
	res.render('terminal');
})

app.get('/admin', (req, res) =>{
	res.render('admin');
})

app.post('/medicauth', (req,res)=>{
	console.log(req.body.user);
	console.log(req.body.password);
	auth.medicCredentials(req.body.user, req.body.password).then(q => {
		if(q.length === 0){
			console.log('USERNAME OR PASSWORD IS INCORRECT');
		}
		else if(q.length === 1){
			console.log('AUTHENTICATED CORRECTLY!');
			req.session.firstname = q[0].firstName;
			res.redirect('/sess'); 
		}else{
			console.log('INTERNAL ERROR');
		}
	})
	
	
})

app.get('/sess', (req, res) => {
    if (req.session.firstname) {
        res.send('Hello ' + req.session.firstname);  // Session data is available
    } else {
        res.send('Session not set or expired');
    }
});


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
		if(command[1]=="patients"){
			crud.readAll();	
		}
		else if(command[1]=="records"){
			crud.readAllRecords();
		}
		else if(command[1] == "medics"){
			crud.readAllMedics();
		}
		else{
			console.log('TABLE DOESNT EXISTS');
		}
	}
	else if(command[0] === "/deleteall"){
		crud.deleteAll();
	}
	else if(command[0] === "/deletetable"){
		crud.deleteTable(command[1]);
	}
	else{
		console.log(command[0]+" Is not a valid command");
	}
	
})

app.listen(PORT);
