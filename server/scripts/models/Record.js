const {randomUUID} = require('crypto');
class Record{	
	constructor(patientId,patientName,date, imagesPath){
		this.id  = randomUUID();
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

