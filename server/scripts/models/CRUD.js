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

	read(){
		this.db.all("SELECT * FROM patients", function(err, rows) {  
		    rows.forEach(function (row) {  
		        console.log(row.id, row.lastname, row.firstname);    // and other columns, if desired
		    })  
		});
	}

	update(){
		
	}

	//Delete
	erase(){
		
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