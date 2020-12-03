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

// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// Employee - Naame, ID, Email
// Engineer - Github username
// Intern - School
// Manager - office number

const addManager = async () =>{
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
            message: "Please enter your email:"
            //validate email
        },
        {
            type: "input",
            name: "officeNumber",
            message: "Please enter your office number:"
            
        }
    ])
    .then((response) => {
        let id = 1;
        const manager = new Manager(response.name,id,response.email,response.officeNumber);
        employeeList.push(manager);

        bulldTeam();
    });

}

const bulldTeam = async () => {
    let start = true;
    let id = 2;
    do { 
        
        let response = await inquirer.prompt({
            name: "addMember",
            message: "Would you like to add a new team member?",
            type: "confirm"
        });
        
        if(response.addMember) {
            await addTeamMember(id);
            // console.log("new member with id: "+ id)
            id++;
        }
        else if(!response.addMember) {
            console.log(employeeList);
            start = false;
            generateHtml();
        }
    } while(start) 
}

const addTeamMember = async (id) => {
    let response = await inquirer.prompt([
            {
                name: "name",
                type:"input",
                message:`Please enter the name of employee ${id-1}:`
            },
            {
                name: "email",
                type:"input",
                message:`Please enter their email:`
            },
            {
                name: "position",
                type:"list",
                message:`Please select their position:`,
                choices: ["Engineer", "Intern"]
            }
        ]);
        
    if(response.position === 'Engineer'){
        await addEngineer(response,id);
    }
    else{
        await addIntern(response,id);
    }
}

const addEngineer = async (employeeInfo,id) => {
    let response = await inquirer.prompt({
            name:"github",
            message:"Please enter their Github username:",
            type: "input"
        });
        
        const employee = new Engineer(employeeInfo.name,id,employeeInfo.email,response.github);
        employeeList.push(employee);
}

const addIntern = async (employeeInfo,id) => {
    let response = await inquirer.prompt({
            name:"school",
            message:"Please enter the name of their school:",
            type: "input"
        })
        .then((response)=>{
            const employee = new Intern(employeeInfo.name,id,employeeInfo.email,response.school);
            employeeList.push(employee);
        })
}

const generateHtml = () => {
    console.log('rendering');

    fs.writeFile(outputPath,render(employeeList),(error) => {
        (error) ? console.error(error) : console.log("file has been generated");
    })

}

const init = async () => {
    console.log("Welcome Manager. Please answer the following questions about yourself and your team members. Afterwards, you will be provided with a webpage containing the information of your team.");
    await addManager();

}

init();


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
