const {randomUUID} = require('crypto');
class Record{	
	constructor(id,patientId,patientName, study, price, sponsor, observations, date, imagesPath, medicId, medicName){
		if(id === null){
			this.id  = randomUUID();	
		}
		else{
			this.id = id;	
		}
		this.patientId = patientId;
		this.patientName = patientName;
		this.study = study;
		this.price = price;
		this.sponsor = sponsor;
		this.observations = observations;
		if(date === null){
			this.date = Date();
		}
		else{
			this.date = date;	
		}
		this.imagesPath = imagesPath;
		this.medicId = medicId;
		this.medicName = medicName;
	}

	getId(){
		return this.id;
	}

	getPatientId(){
			return this.patientId;
		}

	getPatientName(){
		return this.patientName;
	}

	getStudy(){
		return this.study;
	}

	getPrice(){
		return this.price;
	}

	getSponsor(){
		return this.sponsor;
	}

	getObservations(){
		return this.observations;
	}

	getDate(){
		return this.date;
	}

	getImagesPath(){
		return this.imagesPath;
	}

	getMedicId(){
		return this.medicId;
	}

	getMedicName(){
		return this.medicName;
	}
}

module.exports.Record = Record;

