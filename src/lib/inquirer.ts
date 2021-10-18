import inquirer from "inquirer";
import chalk from "chalk";
import {Credentials} from "../utils/credentials";
import path from "path";

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

export async function setFolder() {
    const questions = [
        {
            name: 'folderPath',
            type: 'input',
            default: path.join(require("os").homedir(), "Documents", "Panopto Videos"),
            message: 'Enter the default path for saving all videos:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter the path for saving all videos:';
                }
            }
        }
    ];
    return inquirer.prompt(questions);
}

export async function promptOpenFolder() {
    const questions = [
        {
            name: 'openFolder',
            type: 'confirm',
            default: true,
            message: 'Open Video?'
        }
    ];
    return inquirer.prompt(questions);
}
