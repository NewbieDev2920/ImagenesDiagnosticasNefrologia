class Patient {
	constructor(lastName, firstName, id){
		this.lastName = lastName;
		this.firstName = firstName;
		this.id = id;
	}

	getLastName(){
		return this.lastName;
	}

	getFirstName(){
		return this.firstName;
	}

	getId(){
		return this.id;
	}
}
module.exports.Patient = Patient;