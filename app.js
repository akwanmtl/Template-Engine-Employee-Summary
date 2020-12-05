// declare variables that requires modules and files 
const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const render = require("./lib/htmlRenderer");
const { listenerCount } = require("process");

// declare the path where the files will be created
const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");
const outputPathStyle = path.join(OUTPUT_DIR, "style.css");

// declare empty arrays 
const employeeList = []; //list of employees
const existingID = []; //iist of existing IDs


// Function that initializes the application - it will call on the addManager function
const init = () => {
    console.log("Welcome Manager. Please answer the following questions about yourself and your team members. Afterwards, you will be provided with a webpage containing the information of your team.");
    addManager();

}

// function that capitalize the first letter of the words (in case the user did not enter names with capital letters)
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

// function that checks whether the ID is not already existing and that is valid (positive integer)
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

// function that checks whether the email is in a valid format - common format
const checkEmail = (value) => {
    let re = /^([a-z0-9]{1,}((\.|-|_)[a-z0-9]{1,})*@[a-z0-9]{1,}((\.|-)[a-z0-9]{1,})*\.[a-z]{2,3})$/;
    let pass = value.toLowerCase().match(re);
    if (pass) return true;
    else return "Please enter a valid email address."
}

// function that asks the user for their information (i.e. Manager's position)
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
    // creates a Manager obj from the response
    // pushes the Manager obj into the list of employees
    // pushes the ID to the list of existing IDs
    // calls on the build team function
    .then((response) => {
        const manager = new Manager(capitalize(response.name),response.id,response.email.toLowerCase(),response.officeNumber);
        employeeList.push(manager);
        existingID.push(manager.getId());

        bulldTeam();
    });

}

// function that askes the user if they want to add team member
const bulldTeam = () => { 
    inquirer.prompt({
        name: "addMember",
        message: "Would you like to add a new team member?",
        type: "list",
        choices: ["Yes","No"]
    })
    .then(response =>{
        // if yes, call the addTeamMember function
        if(response.addMember === "Yes") {
            addTeamMember();
        }
        // if no, generate the html file
        else {
            // console.log(employeeList);
            generateHtml();
        }
    });
}

// asks the user common questions about the employee
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
            // if the position is engineer, calls on the addEngineer function
            if(response.position === 'Engineer'){
                addEngineer(response);
            }
            // if the position is intern, calls on the addIntern function
            else{
                addIntern(response);
            }
        });
}

// function that asks the user the github information of the engineer
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
                else return "Please enter a valid Github username."
            }
        })
        // creates a Engineer obj from the response
        // pushes the Engineer obj into the list of employees
        // pushes the ID to the list of existing IDs
        // calls on the build team function
        .then(response => {
            const employee = new Engineer(capitalize(employeeInfo.name),employeeInfo.id,employeeInfo.email.toLowerCase(),response.github);
            employeeList.push(employee);
            existingID.push(employee.getId());
            bulldTeam();
        });
}

// function that asks the user the school of the intern
const addIntern = (employeeInfo) => {
    inquirer
        .prompt({
            name:"school",
            message:"Please enter the name of their school:",
            type: "input"
        })
        // creates a Intern obj from the response
        // pushes the Intern obj into the list of employees
        // pushes the ID to the list of existing IDs
        // calls on the build team function
        .then((response)=> {
            const employee = new Intern(capitalize(employeeInfo.name),employeeInfo.id,employeeInfo.email.toLowerCase(),response.school);
            employeeList.push(employee);
            existingID.push(employee.getId());
            bulldTeam();
        })
}

// function that generates the html file and copies the css file to the output folder
const generateHtml = () => {
    console.log('rendering');

    fs.writeFile(outputPath,render(employeeList),(error) => {
        (error) ? console.error(error) : console.log("file has been generated");
    })
    fs.copyFile('./templates/style.css', outputPathStyle, (error) => {
        (error) ? console.error(error) : console.log("stylesheet has been copied");
      });
}

// runs the initialization function upon executing the file
init();
