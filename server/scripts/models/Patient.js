class Patient{
	constructor(fullname, idtype, id, birthdate, cellphone, email, user, password, registerDate){
		this.fullname = fullname;
		this.idtype = idtype;
		this.id = id;
		this.birthdate = birthdate;
		this.cellphone = cellphone;
		this.email = email;
		this.user = user;
		this.password = password;
		if(registerDate === null){
			this.registerDate = Date();
		}else{
			this.registerDate = registerDate;	
		}
		
	}

	getFullname(){
		return this.fullname;
	}

	getIdtype(){
		return this.idtype;
	}

	getId(){
		return this.id;
	}

	getBirthdate(){
		return this.birthdate;
	}

	getCellphone(){
		return this.cellphone;
	}

	getEmail(){
		return this.email;
	}

	getUser(){
		return this.user;
	}

	getPassword(){
		return this.password;
	}

	getRegisterDate(){
		return this.registerDate;
	}
}
module.exports.Patient = Patient;
