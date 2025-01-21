// ### IMAGENESDIAGNOSTICASNEFROLOGIA BY CARLOS DE LA ROSA ###
//-----------------------------
//BETA
//-----------------------------
//LOGIN PACIENTE (x)
//DISPLAY RECORDS PACIENTE (x)
//ENFOQUE DE RECORDS PACIENTE (x)
//PAGINA STATUS 404 (x)
//PAGINA STATUS 401 (x)
//PAGINA STATUS 403? ()
//ARREGLAR COSITAS ()
//-----------------------------
// v1.0
//-----------------------------
//LANDING PAGE ()
//VALIDACIONES ()
//PROBLEMA DE SEGURIDAD IMAGENES PUBLICAS ()
//-----------------------------
// v1.1
//-----------------------------
//COMPLETAR CRUD ()
//PROTECCION ATAQUE SQLINJECTION ()
//PROTECCION ATAQUE FUERZA BRUTA ()
//-----------------------------
// CAMPOS PACIENTE
//-----------------------------
//FECHA REGISTRO
//APELLIDO Y NOMBRE
//ID/CC
//FECHA DE NACIMIENTO
//TELEFONO
//CORREO
//PRESTADORES
//USUARIO
//CONTRASENA
//-----------------------------
// REGISTRO
//-----------------------------
//FECHA
//ID
//IDPACIENTE
//IDMEDICO
//ESTUDIO
//VALOR
//PRESTADOR
//IMGPATH
//FECHA
//ASUNTO
//OBSERVACIONES
//-----------------------------
// MEDICO
//-----------------------------
//APPELIDO Y NOMBRE
//ID
//CONTRASENA
//CORREO
//NUMERO DE TELEFONO
const config = require('./config.json');
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
const upload = multer({dest:"public/uploads/"});
const session = require('express-session');

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
console.log('Listening on port : '+ config.PORT);
console.log("\n### Request Info ###");
console.log('HTTP METHOD | URL  ROUTE | IP | TIME');



app.get('/', (req,res) => {
	console.log("GET | / | "+ req.ip+ " | "+ Date());
	res.render('index');
});

app.get('/landing', (req, res) => {
	console.log("GET | /landing | "+ req.ip+ " | "+ Date());
	res.render('landingpage');
});

app.post('/contact',(req, res) =>{
	console.log("GET | /landing | "+ req.ip+ " | "+ Date());
	console.log(req.body);
	res.redirect('/landing');
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
	if(req.session.type === "patient"){
		res.render('patientRecordCatalog', {welcome : 'Bienvenido '+ req.session.profile.firstName+'.', usertype : 'patient', id: null});	
	}else if(req.session.type === "medic"){
		res.render('patientRecordCatalog', {welcome : 'Paciente '+ req.query.patientname, usertype : 'medic', id: req.query.id});
	}
	else{
		res.render('401');
	}
})

app.get('/focusrecord', (req, res) => {
	if(req.session.type != 'patient'){
		console.log("GET | /patientrecordcatalog | "+ req.ip+ " | "+ Date());
		crud.readRecordByID(req.query.id).then( q => {
			//JSON RECORD(q[0]) id,  patientName, patientId, date, imagesPath
			q[0].imagesPath = JSON.parse(q[0].imagesPath);
			res.render('focusrecord', q[0]);	
		});
				
	}
	else{
		res.render('401');
	}	
})

app.get('/css2/:filename', (req, res) => {
    res.sendFile(__dirname + '/public/css2/' + req.params.filename);
});


app.get('/getrecords', (req, res) =>{
	if(req.session.type != 'patient'){
		res.render('401');
	}
	else{
				
	}
})

app.get('/getrecordsmediclevel', (req, res) =>{
	if(req.session.type != 'medic'){
		res.render('401');
	}
	else{
		console.log("GET | /getrecords | "+ req.ip+ " | "+ Date());
		console.log(req.query.id);
		crud.readRecordsByPatientId(req.query.id).then(q => {
				res.json({recordList: q});
		});
	}
})

app.get('/catalog', (req, res) =>{
	if(req.session.type != 'medic'){
		res.render('401');
	}else{
		console.log("GET | /catalog | "+ req.ip+ " | "+ Date());
		res.render('catalog');		
	}

})

app.get('/createrecord', (req, res) => {
	if(req.session.type != 'medic'){
		res.render('401');
	}else{
		console.log("GET | /createrecord | "+ req.ip+ " | "+ Date());
		res.render('createRecord');	
	}
	
})

app.get('/createpatient', (req,res) =>{
	if(req.session.type != 'medic'){
		res.render('401');
	}else{
		console.log("GET | /createpatient | "+ req.ip + " | "+ Date());
		res.render('createPatient');			
	}
	
})

app.post('/newrecord', upload.array("files"),(req, res) => {
	if(req.session.type != 'medic'){
		res.render('401');
	}else{
		console.log('POST | /newrecord | '+ req.ip+' | '+ Date());
		console.log(req.body);
		console.log(req.files);
		let imagesPaths = [];
		for(let i = 0; i < req.files.length; i++){
			imagesPaths.push(req.files[i].path);
		}
		let record = new recordFile.Record(null,req.body.id, req.body.name, req.body.date, imagesPaths);
		crud.createRecord(record);
		res.json({status : "OK"});	
	}
	
})

app.post('/newpatient', (req, res) => {
	if(req.session.type != 'medic'){
		res.render('401');
	}else{
		console.log('POST | /newpatient | '+ req.ip +' | '+ Date());
		console.log(req.body);
		let patient = new patientFile.Patient(req.body.lastname, req.body.firstname, req.body.id, req.body.password);
		crud.createPatient(patient);							
	}
	
})

app.post('/newmedic', (req, res) =>{
    console.log('POST | /newmedic | '+ req.ip +' | '+ Date());
    if(req.session.admin){
		console.log(req.body);
		let medic = new medicFile.Medic(req.body.lastname, req.body.firstname, req.body.id, req.body.password);
		crud.createMedic(medic);    	
    }
	
	
})

app.get('/terminal', (req,res) =>{
	if(req.session.admin){
		res.render('terminal');	
	}else{
		res.render('401');
	}
})

app.get('/admin', (req, res) =>{
	if(req.session.admin){
		res.render('admin');	
	}else{
		res.render('401');
	}
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
			req.session.profile = new medicFile.Medic(q[0].lastName, q[0].firstName, q[0].id, null);
			req.session.type = 'medic';
			res.json({status : 'OK', redirect : '/catalog'}) 
		}else{
			console.log('INTERNAL ERROR');
		}
	})
	
	
})

app.post('/patientauth', (req, res) => {
	console.log(req.body.user);
	console.log(req.body.password);
	auth.patientCredentials(req.body.user, req.body.password).then(q => {
		if(q.length === 0){
			console.log('USERNAME OR PASSWORD IS INCORRECT');
		}
		else if(q.length === 1){
			console.log('AUTHENTICATED CORRECTLY!');
			req.session.profile = new patientFile.Patient(q[0].lastName, q[0].firstName, q[0].id, null);
			req.session.type = 'patient';
			res.json({status : 'OK', redirect : '/patientrecordcatalog'});
			
		}
	})	
})

app.get('/searchPatient', (req, res) =>{
	if(req.session.type != 'medic'){
		res.render('401');
	}
	else{
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
				
	}
	
})

app.post('/terminalExecute', (req,res) =>{
	if(req.session.admin){
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
	}
})

app.get('/adminauth', (req,res)=>{
	if(req.query.pass === config.adminPasscode){
		req.session.admin = true;
		res.send(200);
	}else{
		res.send(401);
	}
});

app.get('*', (req, res) =>{
	res.render('404');
})

app.listen(config.PORT);
