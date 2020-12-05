const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const { listenerCount } = require("process");

const employeeList = [];
const existingID = [];

// Employee - Naame, ID, Email
// Engineer - Github username
// Intern - School
// Manager - office number

const capitalize = (value) => {
    // capitalize between spaces
    let capsSpace = value.toLowerCase().split(" ").map(word => {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    }).join(" ");
    // capitalize between hyphens
    let hyphenSpace = capsSpace.split("-").map(word => {
        return word.substring(0, 1).toUpperCase() + word.substring(1);
    }).join("-");

    return hyphenSpace;

}

const checkId = (value) => {
    if (existingID.includes(value)) {
        return "ID already exists. Please enter a new ID number."
    }
    else{ 
        let re = /^(\d{1,})$/;
        let pass = value.match(re);
        if (pass) return true;
        else return "Please enter a valid ID number."
    }
}

const checkEmail = (value) => {
    let re = /^([a-z0-9]{1,}((\.|-|_)[a-z0-9]{1,})*@[a-z0-9]{1,}((\.|-)[a-z0-9]{1,})*\.[a-z]{2,3})$/;
    let pass = value.toLowerCase().match(re);
    if (pass) return true;
    else return "Please enter a valid email address."
}

const addManager = () =>{
    inquirer
    .prompt([
        {
            type: "input",
            name: "name",
            message: "First, please your name:"
        },
        {
            type: "input",
            name: "email",
            message: "Please enter your email:",
            validate: value => {
                return checkEmail(value);
            }
        },
        {
            type: "input",
            name: "id",
            message: "Please enter your ID number:",
            validate: (value) => {
                return checkId(value);
            }
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Please enter your office number:",
            validate: (value) => {
                let re = /^(\d{1,}-?[A-Za-z0-9]?)$/;
                let pass = value.match(re);
                if(pass) return true;
                else return "Please enter a valid office number. It can have the format of 123, 1-A or 1-1."
            }
        }
    ])
    .then((response) => {
        const manager = new Manager(capitalize(response.name),response.id,response.email.toLowerCase(),response.officeNumber);
        employeeList.push(manager);
        existingID.push(manager.getId());

        bulldTeam();
    });

}

const bulldTeam = () => {
     
        
    inquirer.prompt({
        name: "addMember",
        message: "Would you like to add a new team member?",
        type: "list",
        choices: ["Yes","No"]
    })
    .then(response =>{
        if(response.addMember === "Yes") {
            addTeamMember();
        }
        else {
            console.log(employeeList);
            generateHtml();
        }
    });
}

const addTeamMember = () => {
    inquirer
        .prompt([
            {
                name: "name",
                type:"input",
                message:`Please enter the name of employee:`
            },
            {
                name: "email",
                type:"input",
                message:`Please enter their email:`,
                validate: value => {
                    return checkEmail(value);
                }
            },
            {
                name: "id",
                type:"input",
                message:`Please enter their ID number:`,
                validate: (value) => {
                    return checkId(value);
                }
            },
            {
                name: "position",
                type:"list",
                message:`Please select their position:`,
                choices: ["Engineer", "Intern"]
            }
        ])
        .then(response=>{
            if(response.position === 'Engineer'){
                addEngineer(response);
            }
            else{
                addIntern(response);
            }
        });
    
}

const addEngineer = (employeeInfo) => {
    inquirer
        .prompt({
            name:"github",
            message:"Please enter their Github username:",
            type: "input",
            validate: value =>{
                let re = /^([0-9a-zA-Z]{1,}-*[0-9a-zA-Z]{1,})$/;
                let pass = value.match(re);
                if(pass && value.length <= 39) return true;
                else return "Please enter a valide Github username."
            }
        })
        .then(response => {
            const employee = new Engineer(capitalize(employeeInfo.name),employeeInfo.id,employeeInfo.email.toLowerCase(),response.github);
            employeeList.push(employee);
            existingID.push(employee.getId());
            bulldTeam();
        });
}

const addIntern = (employeeInfo) => {
    inquirer
        .prompt({
            name:"school",
            message:"Please enter the name of their school:",
            type: "input"
        })
        .then((response)=> {
            const employee = new Intern(capitalize(employeeInfo.name),employeeInfo.id,employeeInfo.email.toLowerCase(),response.school);
            employeeList.push(employee);
            existingID.push(employee.getId());
            bulldTeam();
        })
}

const generateHtml = () => {
    console.log('rendering');

    fs.writeFile(outputPath,render(employeeList),(error) => {
        (error) ? console.error(error) : console.log("file has been generated");
    })

}

const init = () => {
    console.log("Welcome Manager. Please answer the following questions about yourself and your team members. Afterwards, you will be provided with a webpage containing the information of your team.");
    addManager();

}

init();

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
