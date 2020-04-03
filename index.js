const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");

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
        // I want to generate a table of contents after these inputs are generated to the readme
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
    .then(function(user) {
        console.log(user);
        const queryUrl = `https://api.github.com/users/${user.username}/repos?per_page=100`;
        axios
        .get(queryUrl)
        .then(function(res) {

            const content = `<h1>${user.title}<h1></br><h2>Description</h2></br>${user.description}</br><h2>Installation</h2></br>${user.install}</br><h2>Use</h2></br>${user.usage}<h2>Licensing</h2></br>${user.license}<h2>Contributors</h2></br>${user.contributors}`
            
            // var stream = fs.createWriteStream("README.md");
            // stream.on('error', console.error);
            // content.forEach((str) => { 
            //     stream.write(str + '\n'); 
            // });
            // stream.end();
            fs.writeFileSync("README.md", content, err => {
                if (err) {
                    console.error(err)
                    return
                }
            });
        });
    });