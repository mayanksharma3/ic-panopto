import inquirer from "inquirer";
import chalk from "chalk";
import {Credentials} from "../utils/credentials";

export async function askCredentials(): Promise<Credentials> {
    const questions = [
        {
            name: 'username',
            type: 'input',
            message: 'Enter your Imperial Shortcode:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your Imperial Shortcode';
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password.';
                }
            }
        }
    ];
    const response = await inquirer.prompt(questions);
    console.log(chalk.greenBright("Successfully saved credentials!"))
    return response;
}

export async function promptOpenFolder() {
    const questions = [
        {
            name: 'openFolder',
            type: 'confirm',
            default: true,
            message: 'Open Folder?'
        }
    ];
    return inquirer.prompt(questions);
}
