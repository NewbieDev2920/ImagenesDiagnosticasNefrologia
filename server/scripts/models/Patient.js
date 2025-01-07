class Patient {
	constructor(lastName, firstName, id, password){
		this.lastName = lastName;
		this.firstName = firstName;
		this.id = id;
		this.password = password;
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

	getPassword(){
		return this.password;
	}
}
module.exports.Patient = Patient;
