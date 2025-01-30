// ### IMAGENESDIAGNOSTICASNEFROLOGIA BY CARLOS DE LA ROSA ###
//-----------------------------
//BETA
//-----------------------------
//LOGIN PACIENTE (x)
//DISPLAY RECORDS PACIENTE (x)
//ENFOQUE DE RECORDS PACIENTE (x)
//PAGINA STATUS 404 (x)
//PAGINA STATUS 401 (x)
//PAGINA STATUS 503 ()
//CAMBIO DE CAMPOS ()
//RECUERDA MODIFICAR AUTHENTICATION PARA EVITAR SQLINJECTION ()
//PAGINA STATUS 403? ()
//ARREGLAR COSITAS ()
//-----------------------------
// v1.0
//-----------------------------
//LANDING PAGE ()
//VALIDACIONES ()
//PROBLEMA DE SEGURIDAD IMAGENES PUBLICAS ()
//CHATBOT()
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
//USUARIO
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
	try{
		console.log("GET | / | "+ req.ip+ " | "+ Date());
		res.render('index');
	}catch(err){
		console.error('Oops! An error ocurred:', err);
	}
	
});

app.get('/landing', (req, res) => {
	try{
		console.log("GET | /landing | "+ req.ip+ " | "+ Date());
		res.render('landingpage');	
	}catch(err){
		console.error('Oops! An error ocurred:', err);
	}
	
});

app.post('/contact',(req, res) =>{

	try{
		console.log("GET | /landing | "+ req.ip+ " | "+ Date());
		console.log(req.body);
		res.redirect('/landing');	
	}catch(err){
		console.error('Oops! An error ocurred:', err);
	}
	
})

app.get('/mediclogin', (req,res) => {

	try{
		console.log("GET | /mediclogin | "+ req.ip+ " | "+ Date());
		res.render('medicLogin');
	}catch(err){
		console.error('Oops! An error ocurred:', err);
	}

})

app.get('/patientlogin', (req, res) => {

	try{
		console.log("GET | /patientlogin | "+ req.ip+ " | "+ Date());
		res.render('patientLogin');	
	}catch(err){
		console.error('Oops! An error ocurred:', err);
	}
	
})

app.get('/patientrecordcatalog', (req, res) =>{

	try{

		console.log("GET | /patientrecordcatalog | "+ req.ip+ " | "+ Date());
		if(req.session.type === "patient"){
			console.log(req.session.profile);
			res.render('patientRecordCatalog', {welcome : 'Bienvenido '+ req.session.profile.fullname+'.', usertype : 'patient', id: null});	
		}else if(req.session.type === "medic"){
			res.render('patientRecordCatalog', {welcome : 'Paciente '+ req.query.patientname, usertype : 'medic', id: req.query.id});
		}
		else{
			res.render('401');
		}
		
	}catch(err){
		console.error('Oops! An error ocurred:', err);
	}
	
	
})

app.get('/focusrecord', (req, res) => {

	try{

		if(req.session.type === 'patient' || req.session.type == 'medic'){
			console.log("GET | /patientrecordcatalog | "+ req.ip+ " | "+ Date());
			crud.readRecordByID(req.query.id).then( q => {
				q[0].imagespath = q[0].imagesPath.split(",");
				q[0].imagespath.pop();
				q[0].imagespath[0] = q[0].imagespath[0].slice(1,q[0].imagespath[0].length);
				res.render('focusrecord', q[0]);
				console.log(q[0].imagespath);
						
			});			
		}
		else{
			res.render('401');
		}
		
	}catch(err){
		console.error('Oops! An error ocurred:',err)
	}
		
})

app.get('/css2/:filename', (req, res) => {
	try{
		res.sendFile(__dirname + '/public/css2/' + req.params.filename);
	}
	catch(err){
		console.error("Oops! An error ocurred:",err)
	}
});


app.get('/getrecords', (req, res) =>{
	try{

		if(req.session.type != 'patient'){
			res.render('401');
		}
		else{
			console.log("GET | /getrecords | "+ req.ip+ " | "+ Date());
			console.log(req.session.profile.id);
			crud.readRecordsByPatientId(req.session.profile.id).then(q => {
			res.json({recordList: q});
		});		
	}	
	}catch(error){
			console.error('Oops! An error ocurred', err);
	}
	
})

app.get('/getrecordsmediclevel', (req, res) =>{
	try{

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
		
	}
	catch(err){
		console.error('Oops! An error ocurred', err);
	}
	
})

app.get('/catalog', (req, res) =>{

	try{

		if(req.session.type != 'medic'){
			res.render('401');
		}else{
			console.log("GET | /catalog | "+ req.ip+ " | "+ Date());
			res.render('catalog', {medicname : req.session.profile.full});		
		}
		
	}catch(err){
		console.error('Oops! An error ocurred', err);	
	}
	

})

app.get('/createrecord', (req, res) => {

	try{
		if(req.session.type != 'medic'){
			res.render('401');
		}else{
			console.log("GET | /createrecord | "+ req.ip+ " | "+ Date());
			res.render('createRecord');	
		}		
	}catch(err){
		console.error('Oops! An error ocurred:',err);	
	}
	
	
})

app.get('/createpatient', (req,res) =>{
	try{
		if(req.session.type != 'medic'){
			res.render('401');
		}else{
			console.log("GET | /createpatient | "+ req.ip + " | "+ Date());
			res.render('createPatient');			
	}		
	}catch(err){
		console.error("Oops! An error ocurred:",err);	
	}
	
	
})

app.post('/newrecord', upload.array("files"),(req, res) => {
	try{
		if(req.session.type != 'medic'){
			res.render('401');
		}else{
			console.log('POST | /newrecord | '+ req.ip+' | '+ Date());
			console.log(req.body);
			console.log(req.files);
			let imagespaths = "";
			for(let i = 0; i < req.files.length; i++){
					console.log(typeof req.files[i].path);
					req.files[i].path = req.files[i].path.slice(7,req.files[i].path.length);
					imagespaths = imagespaths+req.files[i].path+",";
			}
			let record = new recordFile.Record(null,req.body.patientId, req.body.patientName, req.body.study, req.body.price,req.body.sponsor,req.body.observations, null,imagespaths,req.session.profile.id, req.session.profile.fullname);
			crud.createRecord(record);
			res.json({status : "OK"});	
		}					
	}catch(err){
		console.error("Oops! An error ocurred:",err);
	}
		
})

app.post('/newpatient', (req, res) => {
	try{
		if(req.session.type != 'medic'){
			res.render('401');
		}else{
			console.log('POST | /newpatient | '+ req.ip +' | '+ Date());
			console.log(req.body);
			let patient = new patientFile.Patient(req.body.fullname,req.body.idtype, req.body.id, req.body.birthdate, req.body.cellphone, req.body.email, req.body.user,req.body.password, null);
			crud.createPatient(patient);							
		}		
	}catch(err){
		console.error("Oops! An error ocurred:",err);
	}
	
	
});

app.post('/newmedic', (req, res) =>{
	try{

		console.log('POST | /newmedic | '+ req.ip +' | '+ Date());
		if(req.session.admin){
			console.log(req.body);
			let medic = new medicFile.Medic(req.body.fullname, req.body.id, req.body.email, req.body.cellphone, req.body.user, req.body.password, null);
			crud.createMedic(medic);    	
		}
	}catch(err){
		console.error('Oops! An error ocurred:',err);
	}
    
});

app.get('/terminal', (req,res) =>{
	try{
		if(req.session.admin){
			res.render('terminal');	
		}else{
			res.render('401');
		}
	}catch(err){
		console.error('Oops! An error ocurred', err);
	}
	
})

app.get('/admin', (req, res) =>{
	try{

		if(req.session.admin){
			res.render('admin');	
		}else{
			res.render('401');
		}
		
	}catch(err){
		console.error('Oops! An error ocurred', err);
	}
	
})

app.post('/medicauth', (req,res)=>{
	try{
		console.log(req.body.user);
		console.log(req.body.password);
		auth.medicCredentials(req.body.user, req.body.password).then(q => {
			if(q.length === 0){
				console.log('USERNAME OR PASSWORD IS INCORRECT');
			}
			else if(q.length === 1){
				console.log('AUTHENTICATED CORRECTLY!');
				req.session.profile = new medicFile.Medic(q[0].fullname, q[0].id, q[0].email, q[0].cellphone, q[0].user,null, q[0].registerdate);
				req.session.type = 'medic';
				res.json({status : 'OK', redirect : '/catalog'}) 
			}else{
				console.log('INTERNAL ERROR');
			}
		})	
	}catch(err){
		console.error('Oops! An error ocurred: ', err);
	}
	
	
	
})

app.post('/patientauth', (req, res) => {
	try{
		console.log(req.body.user);
			console.log(req.body.password);
			auth.patientCredentials(req.body.user, req.body.password).then(q => {
				if(q.length === 0){
					console.log('USERNAME OR PASSWORD IS INCORRECT');
				}
				else if(q.length === 1){
					console.log('AUTHENTICATED CORRECTLY!');
					//row.fullname, row.idtype, row.id,row.birthdate, row.cellphone, row.email, row.user, row.sponsor, row.password, row.registerdate
					req.session.profile = new patientFile.Patient(q[0].fullname, q[0].idtype, q[0].id, q[0].birthdate, q[0].cellphone, q[0].email, q[0].user,null, q[0].registerdate);
					req.session.type = 'patient';
					res.json({status : 'OK', redirect : '/patientrecordcatalog'});
					
				}
			})
	}catch(err){
		console.error("Oops! An error ocurred:",err);
	}
		
})

app.get('/searchPatient', (req, res) =>{
	try{

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
		
	}catch{
		console.error('Oops! An error ocurred:',err);
	}
	
	
})

app.post('/terminalExecute', (req,res) =>{
	try{
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
	}catch(err){
		console.error('Oops! An error ocurred:',err);
	}
	
})

app.get('/adminauth', (req,res)=>{
	try{
		if(req.query.pass === config.adminPasscode){
			req.session.admin = true;
			res.send(200);
		}else{
			res.send(401);
		}
	}catch(err){
		console.error('Oops! An error ocurred:',err);
	}
	
});

app.get('*', (req, res) =>{
	try{
		res.render('404');		
	}catch(err){
		console.error('Oops! An error ocurred:',err);
	}
	
})

app.listen(config.PORT);
