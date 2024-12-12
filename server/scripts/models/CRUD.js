const sqlite = require('sqlite3');
const patientFile = require('./Patient');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

class CRUD{
	constructor(){
		this.db = new sqlite.Database('models/storage/patient.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
		this.db.run('CREATE TABLE IF NOT EXISTS patients (id VARCHAR(15) PRIMARY KEY, lastname VARCHAR(50), firstname VARCHAR(50))');
	}

    createPatient(patient){
		this.db.run('INSERT INTO patients (id, lastname, firstname) VALUES (?,?,?)', [patient.getId(), patient.getLastname(), patient.getFirstname()]);
	}

	readAll(){
		this.db.all("SELECT * FROM patients", function(err, rows) {  
		    rows.forEach(function (row) { 
		    	let patient = new patientFile.Patient(row.lastname,row.firstname, row.id); 
		        console.log(patient.getId(), patient.getLastName(), patient.getFirstName());  
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
	                new patientFile.Patient(row.lastname, row.firstname, row.id)
	            );
	            
	            resolve(queryResult);
	        });
	    });
	}

	readByPatientName(name) {
	    return new Promise((resolve, reject) => {
	        this.db.all("SELECT * FROM patients WHERE lastname LIKE ?", [`${name}%`], (err, rows) => {
	            if (err) {
	                reject(err);
	                return;
	            }
	            
	            const queryResult = rows.map(row => 
	                new patientFile.Patient(row.lastname, row.firstname, row.id)
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
}
module.exports.CRUD = CRUD;