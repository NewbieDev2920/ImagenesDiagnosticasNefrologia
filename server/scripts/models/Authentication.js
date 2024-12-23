const sqlite = require('sqlite3');
const patientFile = require('./Patient');
const medicFile = require('./Medic');
class Authentication{
	constructor(){
		this.db = new sqlite.Database('models/storage/patient.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
	}

	medicCredentials(user, pass){
		return new Promise((resolve, reject) => {
			        this.db.all("SELECT * FROM medics WHERE lastname='"+user+"' AND password='"+pass+"'", (err, rows) => {
			            if (err) {
			                reject(err);
			                return 0;
			            }
			            
			            const queryResult = rows.map(row => 
			                new medicFile.Medic(row.lastname, row.firstname, row.id, row.password)
			            );
			            
			            resolve(queryResult);
			        });
			    });
	}

	patientCredentials(){
		
	}
}
module.exports.Authentication = Authentication;
