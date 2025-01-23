class Medic {
	constructor(fullname, id, email, cellphone, user, password, registerdate){
		this.fullname = fullname;
		this.id = id;
		this.email = email;
		this.cellphone = cellphone;
		this.user = user;
		this.password = password;
		if(registerdate === null){
			this.registerdate = Date();
		}else{
			this.registerdate = registerdate;
		}
	}

	getFullname(){
		return this.fullname;
	}

	getId(){
		return this.id;
	}

	getEmail(){
		return this.email;
	}

	getCellphone(){
		return this.cellphone;
	}

	getUser(){
		return this.user;
	}

	getPassword(){
		return this.password;
	}

	getRegisterDate(){
		return this.registerdate;
	}
}
module.exports.Medic = Medic;
