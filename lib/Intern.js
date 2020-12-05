// Intern class that extends from the Employee class and has the school name
const Employee = require("./Employee");

class Intern extends Employee {
    constructor(name, id, email, school){
        super(name, id, email);
        this.school = school;
    }
    getSchool() {
        return this.school;
    }
    getRole(){
        return "Intern"
    }

}

module.exports = Intern;