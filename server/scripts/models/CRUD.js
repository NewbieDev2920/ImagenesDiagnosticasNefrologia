const sqlite = require('sqlite3');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

class CRUD{
	constructor(){
		this.db = new sqlite.Database('models/storage/patient.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
		this.db.run('CREATE TABLE IF NOT EXISTS patients (id VARCHAR(15) PRIMARY KEY, lastname VARCHAR(50), firstname VARCHAR(50))');
	}

    createPatient(id, lastname, firstname){
		this.db.run('INSERT INTO patients (id, lastname, firstname) VALUES (?,?,?)', [id, lastname, firstname]);
	}

	readAll(){
		this.db.all("SELECT * FROM patients", function(err, rows) {  
		    rows.forEach(function (row) {  
		        console.log(row.id, row.lastname, row.firstname);  
		    })  
		});
	}

	readByPatientId(id){
		this.db.all("SELECT * FROM patients WHERE id LIKE '"+id+"%'", (err, rows) => {
			console.log(typeof rows+ " typeof rows");
			return rows;
		});
	}

	readByPatientName(name){
		this.db.all("SELECT * FROM patients WHERE lastname LIKE '"+name+"%'", (err, rows) => {
			return rows;
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