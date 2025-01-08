const {randomUUID} = require('crypto');
class Record{	
	constructor(id,patientId,patientName,date, imagesPath){
		if(id === null){
			this.id  = randomUUID();	
		}
		else{
			this.id = id;	
		}
		this.patientName = patientName;
		this.patientId = patientId;
		this.date = date;
		this.imagesPath = imagesPath;
	}

	getId(){
		return this.id;
	}

	getPatientName(){
		return this.patientName;
	}

	getPatientId(){
		return this.patientId;
	}

	getDate(){
		return this.date;
	}

	getImagesPath(){
		return this.imagesPath
	}
}

module.exports.Record = Record;

