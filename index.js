const inquirer = require("inquirer");
const axios = require("axios");
const fs = require("fs");
require("dotenv").config()
const token = process.env.TOKEN;

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
        console.log(process.env.name_value);
        console.log(user);
        const queryUrl = `https://api.github.com/users/${user.username}`;
            axios
            .get(queryUrl, {
                headers: {
                    "Authorization": `token ${token}`
                }
            })
            .then(function(res) {
                console.log(res);
                // This is all of my content that is being written to the readme file, written in template literal format
                const content = `<h1>${user.title}</h1></br>,<h2>Description</h2></br>,${user.description},<h2>Installation</h2></br>,${user.install},<h2>Use</h2></br>,${user.usage},<h2>Licensing</h2></br>,${user.license},<h2>Contributors</h2></br>,${user.contributors},<h2>Github</h2></br>,![Github Profile Picture](${res.data.avatar_url})</br>,${res.data.email}`

                // Splitting my content for the sake of clean code on the readme file
                const splitContent = content.split(',');

                // This uses a for each loop on my split content to put the information on a stream that writes to the new md file. This prevents the potential for some data being lost through the writeFile function as it is asynchronous (according to stack overflow).
                var stream = fs.createWriteStream("README.md");
                stream.on('error', console.error);
                splitContent.forEach((str) => { 
                    stream.write(str + '\n'); 
                });
                stream.end();
            })
            .catch(error => console.error(error))
    });