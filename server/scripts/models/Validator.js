const sqlite = require('sqlite3');
const config = require('./config.json');
class Validator{
	//Return false (Error), Return true (OK)
	constructor(){
		this.db = new sqlite.Database('models/storage/patient.db',sqlite.OPEN_READWRITE | sqlite.OPEN_CREATE);
	}

	fulfillGeneralValidation(string){
		if(isEmptyOrNullString(string) || isTrivialString(string) || isVeryLong(string, config.fieldMax)){
			return false;
		}
		return true;
	}

	isEmptyOrNullString(string){
		if(string === "" || string === null){
			return false;
		}
		else{
			return true;
		}
	}

	containsCharacter(string, char){
		let array = string.split('');
		for(let i = 0; i < array.length; i++){
			if(array[i] === char){
				return true;
			}
		}
		return false;
	}

	isWholeCharacterString(string,char){
		let array = string.split('');
		let isCharacterFull = false;
		for(let i = 0; i < array.length; i++){
			if(array[i] === char){
				isCharacterFull = true;
				break;
			}
		}
		return isCharacterFull;
	}

	isTrivialString(string){
		if(isWholeCharacterString(string,'\t') || isWholeCharacterString(string,' ')){
			return true;
		}
		return false;
	}

	isVeryLong(string, treshold){
		if(string.length > treshold){
			return true;
		}
		return false;
	}

	isVeryShort(string, treshold){
		if(string.length <= treshold){
			return true;
		}
		return false;
	}

	isRepeatedId(id, table){
		//pass
	}

	isRepeatedUser(user, table){
		//pass
	}
}
