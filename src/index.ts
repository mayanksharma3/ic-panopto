#!/usr/bin/env node

import ora from "ora";
import chalk from "chalk";
import updateNotifier from "update-notifier";
import {ArgumentParser} from "argparse";
import {askCredentials} from "./lib/inquirer";
import Keystore from "./lib/keystore";
import {Credentials} from "./utils/credentials";
import puppeteer, {HTTPResponse} from 'puppeteer';
import sanitize from "sanitize-filename";
import cliprogress from 'cli-progress';

const download = require("node-hls-downloader").download;
const pkg = require('../package.json');
const version = pkg.version;
const notifier = updateNotifier({pkg, updateCheckInterval: 0});

const parser = new ArgumentParser({
    description: 'IC Panopto Downloader'
});

parser.add_argument('video_url', {nargs: '?', help: "Video url from panopto to download"})
parser.add_argument('-v', '--version', {action: 'version', version});
parser.add_argument('-c', '--clean', {action: 'store_true', help: "Clean configurations"});
const argv = parser.parse_args();

const run = async () => {
    notifier.notify();
    const keystore = new Keystore();

    if (argv.clean) {
        await keystore.deleteCredentials()
        console.log(chalk.greenBright("Configuration cleared!"))
        return;
    }

    let credentials: Credentials = await keystore.getCredentials()
    if (!credentials) {
        credentials = await askCredentials();
        await keystore.setCredentials(credentials)
    }

    if (!argv.video_url) {
        console.log(chalk.red("Please specify a video to download!"))
        return;
    }

    const spinner = ora('Opening Link...').start();
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(argv.video_url);
    spinner.stop()
    spinner.clear()
    const spinnerSignIn = ora("Link Opened. Signing in...").start();
    await page.type('#username', credentials.username);
    await page.type('#password', credentials.password);
    await page.click('button[name="_eventId_proceed"]');
    await page.waitForNavigation();
    spinnerSignIn.stop()
    spinnerSignIn.clear()
    console.log("Downloading video...")
    let totalSegments = -1
    let bar;
    page.on("response", async (request: HTTPResponse) => {
        if (request.url().endsWith("DeliveryInfo.aspx")) {
            const res = await request.json()
            await browser.close()
            await download({
                quality: "best",
                concurrency: 5,
                outputFile: sanitize(res.Delivery.SessionName) + ".mp4",
                streamUrl: res.Delivery.Streams[0].StreamUrl,
                logger: (a: string) => {
                    if(a.includes("Queueing")) {
                        totalSegments = parseInt(a.split("Queueing ")[1].split(" ")[0])
                        bar = new cliprogress.SingleBar({}, cliprogress.Presets.shades_classic);
                        bar.start(totalSegments, 0);
                    } else if (a.startsWith("Received:")) {
                        bar.increment()
                    } else if (a.startsWith("All segments received")) {
                        bar.stop()
                    }
                }
            });
        }
    })
};

run();

