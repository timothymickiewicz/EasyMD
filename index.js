const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config()
const token = process.env.TOKEN;
// Questions that will generate when the user uses the terminal prompt
inquirer
    .prompt([
        {
            message: "What is your GitHub username?",
            name: "username"
        },
        {
            message: "What is the title of your project?",
            name: "title"
        },
        {
            message: "Provide a description for your project.",
            name: "description"
        },
        {
            message: "Describe the steps to install your application.",
            name: "install"
        },
        {
            message: "Describe the usage of your project.",
            name: "usage"
        },
        {
            type: "checkbox",
            message: "What licensing does your application have?",
            name: "license",
            choices: [
            "MIT", 
            "GPLv2", 
            "Apache", 
            "Other"
            ]
        },
        {
            message: "Who contributed to this project?",
            name: "contributors"
        },
    ])
    // After the questions are answered, an axios call is performed on their username and token value
    .then(function(user) {
        const queryUrl = `https://api.github.com/users/${user.username}`;
            axios
            .get(queryUrl, {
                headers: {
                    "Authorization": `token ${token}`
                }
            })
            // After the questions and axios call is done, the content is generated for the readme
            .then(function(res) {
                // This is all of my content that is being written to the readme file, written in template literal format
                const runTest = "`npm run test`"; // Nesting `s inside of `s
                const content = `# ${user.title}--+ --+## Table of Contents--+* [Description](#description)--+* [Installation](#installation)--+* [Use](#use)--+* [Licensing](#licensing)--+* [Contributors](#contributors)--+* [Contributing](#contributing)--+* [Tests](#tests)--+* [Github](#github)--+ --+## Description--+${user.description}--+ --+## Installation--+${user.install}--+ --+## Use--+${user.usage}--+ --+## Licensing--+![Badge](https://img.shields.io/static/v1?label=License&message=${user.license}&color=<COLOR>?style=plastic)--+ --+## Contributors--+${user.contributors}--+ --+## Contributing--+[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](code_of_conduct.md)</br>--+Please note that this project is released with a Contributor Code of Conduct. By participating in this project you agree to abide by its terms.</br>--+https://www.contributor-covenant.org/version/2/0/code_of_conduct/--+ --+## Tests--+To run tests, you must enter ${runTest} in the terminal--+ --+## Github--+![Github Profile Picture](${res.data.avatar_url})</br>--+${res.data.email}`

                // Splitting my content for the sake of clean code on the readme file
                const splitContent = content.split('--+');

                // This uses a for each loop on my split content to put the information on a stream that writes to the new md file. This prevents the potential for some data being lost through the writeFile function as it is asynchronous (according to stack overflow).
                var stream = fs.createWriteStream("Gen-README.md");
                stream.on('error', console.error);
                splitContent.forEach((str) => { 
                    stream.write(str + '\n'); 
                });
                stream.end();
            })
            .catch(error => console.error(error))
    });