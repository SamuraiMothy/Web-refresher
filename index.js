require('dotenv').config();
const nodemailer = require('nodemailer');
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--incognito']
    });
    const page = await browser.newPage();

    await page.goto('https://scribie.com/transcription-test#files');

    let isRunning = true;

    // Utility function to generate a random delay
    function getRandomDelay(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to log messages with timestamp
    function log(message) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`);
    }

    // Function to click the audio button
    async function clickAudioButton() {
        const audioButton = await page.$('.glyphicon.glyphicon-play');
        if (audioButton) {
            await page.evaluate(button => button.click(), audioButton);
            log('Audio button clicked');
            await waitForAudioToPlay();
        }
    }

    // Function to wait for the audio to start playing
    async function waitForAudioToPlay() {
        await page.waitForSelector('.audio-preview.btn.btn-round.btn-info', { visible: true });
        log('Audio started playing');
        await clickSelectButton();
    }

    // Function to click the select button
    async function clickSelectButton() {
        const selectButton = await page.$('.btn.btn-success');
        if (selectButton) {
            await page.evaluate(button => button.click(), selectButton);
            log('Select button clicked');
            isRunning = false; // Stop the script
            await sendEmailNotification(); // Send email notification
            log('Email notification sent');
            await browser.close();
        }
    }

    // Function to send an email notification
    async function sendEmailNotification() {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'olasunkannmmii@gmail.com',
            subject: 'File found and selected',
            text: 'A file was found and selected on the Scribie test page.'
        };

        await transporter.sendMail(mailOptions);
        log('Email notification sent');
    }

    // Function to start refreshing the page
    async function startRefreshing() {
        while (isRunning) {
            log('Refreshing page');
            await page.reload({ waitUntil: 'networkidle2' });
            await page.waitForTimeout(getRandomDelay(6000, 9000));
            await clickAudioButton();
        }
    }

    await startRefreshing();
})();
