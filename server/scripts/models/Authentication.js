const sqlite = require('sqlite3');
const patientFile = require('./Patient');
const medicFile = require('./Medic');
class Authentication{
	constructor(){
		this.db = new sqlite.Database('models/storage/patient.db', sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
	}

	medicCredentials(user, pass){
		return new Promise((resolve, reject) => {
			        this.db.all("SELECT * FROM medics WHERE user='"+user+"' AND password='"+pass+"'", (err, rows) => {
			            if (err) {
			                reject(err);
			                return 0;
			            }
			            
			            const queryResult = rows.map(row => 
			                new medicFile.Medic(row.fullname, row.id, row.email,row.cellphone,row.user,null,row.registerdate)
			            );
			            
			            resolve(queryResult);
			        });
			    });
	}

	patientCredentials(user, pass){
		return new Promise((resolve, reject) => {
					        this.db.all("SELECT * FROM patients WHERE user='"+user+"' AND password='"+pass+"'", (err, rows) => {
					            if (err) {
					                reject(err);
					                return 0;
					            }
					            
					            const queryResult = rows.map(row => 
					                new patientFile.Patient(row.fullname, row.idtype, row.id, row.birthdate, row.cellphone, row.email,row.user,null, row.registerdate)
					            );
					            
					            resolve(queryResult);
					        });
					    });
	}
}
module.exports.Authentication = Authentication;
