// Engineer class that extends from the Employee class and has the github username
const Employee = require("./Employee");

class Engineer extends Employee {
    constructor(name, id, email, github){
        super(name, id, email);
        this.github = github;
    }
    getGithub() {
        return this.github;
    }
    getRole(){
        return "Engineer"
    }

}

module.exports = Engineer;