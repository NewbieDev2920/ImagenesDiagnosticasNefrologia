const sqlite = require('sqlite3');
const patientFile = require('./Patient');
const recordFile = require('./Record');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

class CRUD{
	constructor(){
		this.db = new sqlite.Database('models/storage/patient.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
		this.db.run('CREATE TABLE IF NOT EXISTS patients (id VARCHAR(15) PRIMARY KEY, idtype VARCHAR(3), fullname VARCHAR(50), birthdate VARCHAR(10), cellphone VARCHAR(15), email VARCHAR(50), user VARCHAR(20), password VARCHAR(50), registerdate VARCHAR(50))');
		this.db.run('CREATE TABLE IF NOT EXISTS records (id VARCHAR(50) PRIMARY KEY, patientid VARCHAR(15), patientname VARCHAR(50), study VARCHAR(100), price VARCHAR(10), sponsor VARCHAR(30), observations VARCHAR(300), date VARCHAR(50), imagespath VARCHAR(300), medicid VARCHAR(15), medicname VARCHAR(50))');
	    this.db.run('CREATE TABLE IF NOT EXISTS medics (id VARCHAR (15) PRIMARY KEY, fullname VARCHAR(50), email VARCHAR(50), cellphone VARCHAR(15), user VARCHAR(20), password VARCHAR(50), registerdate VARCHAR(50))');
	}

    createPatient(patient){
		this.db.run('INSERT INTO patients (id, idtype,fullname, birthdate,cellphone,email,user,password, registerdate) VALUES (?,?,?,?,?,?,?,?,?)', [patient.getId(), patient.getIdtype(),patient.getFullname(), patient.getBirthdate(), patient.getCellphone(), patient.getEmail(), patient.getUser(), patient.getPassword(), patient.getRegisterDate()]);
	}

	createRecord(record){
		this.db.run('INSERT INTO records (id,patientid,patientname,study,price,sponsor,observations,date,imagespath,medicid,medicname) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [record.getId(), record.getPatientId(),record.getPatientName(),record.getStudy(),record.getPrice(),record.getSponsor(),record.getObservations(),record.getDate(),JSON.stringify(record.getImagesPath()),record.getMedicId(),record.getMedicName()]);
	}

	createMedic(medic){
		this.db.run('INSERT INTO medics (id, fullname, email, cellphone, user, password, registerdate) VALUES (?,?,?,?,?,?,?)', [medic.getId(), medic.getFullname(), medic.getEmail(), medic.getCellphone(), medic.getUser(), medic.getPassword(), medic.getRegisterDate()]);
	}

	readRecordByID(id){
		return new Promise( (resolve, reject) => {
			this.db.all('SELECT * FROM records WHERE id = ?', [id], (err, rows) => {
						if(err){
							reject(err);
							return;
						}
			
						const queryResult = rows.map(  row => {
							console.log("ROW PRINT ", row);
							return new recordFile.Record(row.id,row.patientid,row.patientname,row.study,row.price,row.sponsor,row.observations,row.date,row.imagespath,row.medicid,row.medicname);
						});
			
						resolve(queryResult);
			
						
					})
			
		});
					
	}

	readAllRecords(){
		this.db.all('SELECT * FROM records', (err, rows) =>{
			rows.forEach((row)=> {
				console.log(row);
			})
		})
	}

	readAllMedics(){
		this.db.all('SELECT * FROM medics', (err, rows) =>{
					rows.forEach((row)=> {
						console.log(row);
					})
				})
	}

	readAll(){
		this.db.all("SELECT * FROM patients", function(err, rows) {  
		    rows.forEach(function (row) { 
		    	let patient = new patientFile.Patient(row.fullname, row.idtype, row.id,row.birthdate, row.cellphone, row.email, row.user, row.password, row.registerdate); 
		        console.log(JSON.stringify(patient));  
		    })  
		});
	}

	readByPatientId(id) {
	    return new Promise((resolve, reject) => {
	        this.db.all("SELECT * FROM patients WHERE id LIKE ?", [`${id}%`], (err, rows) => {
	            if (err) {
	                reject(err);
	                return;
	            }
	            
	            const queryResult = rows.map(row => 
	                new patientFile.Patient(row.fullname, row.idtype, row.id,row.birthdate, row.cellphone, row.email, row.user, null, row.registerdate)
	            );
	            
	            resolve(queryResult);
	        });
	    });
	}

	readRecordsByPatientId(id){
		return new Promise((resolve, reject) =>{
			this.db.all("SELECT * FROM records WHERE patientId = ?",[id] ,(err, rows) => {
				if(err){
					reject(err);
					return;
				}

				const queryResult = rows.map(row =>{
					console.log(row);
					return new recordFile.Record(row.id,row.patientid,row.patientname,row.study,row.price,row.sponsor,row.observations,row.date,row.imagespath,row.medicid,row.medicname);
				}		
				);

				resolve(queryResult);
			});
			
		})
	}

	readByPatientName(name) {
	    return new Promise((resolve, reject) => {
	        this.db.all("SELECT * FROM patients WHERE fullname LIKE ?", [`${name}%`], (err, rows) => {
	            if (err) {
	                reject(err);
	                return;
	            }
	            
	            const queryResult = rows.map(row => 
	                new patientFile.Patient(row.fullname, row.idtype, row.id, row.birthdate, row.cellphone, row.email, row.user, null, row.registerdate)
	            );
	            
	            resolve(queryResult);
	        });
	    });
	}
	update(){
		
	}

	/*Delete
	Condition must be a string
	Current Columns: id(String), lastname, firstname 
	condition example: id='id=123'
	*/
	erase(condition){
		this.db.run("DELETE FROM patients WHERE "+condition+";");
		console.log("Deleted elements with the folowing attributes: " + condition);
	}

	deleteAll(){
		readline.question('Are you sure you want to erase all data in Patients table? y/n', answer  => {
		  if(answer === 'y'){
		    console.log('DELETED PATIENTS');
		  	this.db.run('DELETE FROM patients');
		  }else if( answer === 'n'){
		  	console.log('Abort');
		  }else{
		  	console.log('Not valid input')
		  }
		  readline.close();
		});
		
	}

	deleteTable(tablename){
		this.db.run("DROP TABLE "+tablename);
		console.log("TABLE NAMED : ",tablename, 'DELETED!!!');
	}
}
module.exports.CRUD = CRUD;
