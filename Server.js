const TwitchPackets = require('twitchpackets');
const express = require('express');
const fs = require('fs');
const path = require('path');


const ACCESS_KEYS = {};

const files = fs.readdirSync(path.join(__dirname, 'secrets'));

for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
        const fileContents = JSON.parse(String(fs.readFileSync(path.join(__dirname, 'secrets', file))));
        ACCESS_KEYS[fileContents.username] = {
            username: fileContents.username,
            refresh: fileContents.refreshToken,
            accessTime: 0,
        };
    } catch (error) {}
}

const EDDIE_NAME = 'hfgsads';
let eddieAccessTime = 0;

const LISTENER_USERNAME = 'the_kuju';
const LISTENER_HOST = 'the_kuju';
const LISTENER_CLIENT = 'redacted';
const LISTENER_SECRET = 'redacted';
const LISTENER_REFRESH = 'redacted';

TwitchPackets.connectPermanent(LISTENER_USERNAME, LISTENER_HOST, LISTENER_CLIENT, LISTENER_SECRET, LISTENER_REFRESH);
TwitchPackets.addListener(TwitchPackets.EVENT_MESSAGE, (event) => {
    (ACCESS_KEYS[event.username] || {}).accessTime = Date.now();

    if (event.username === EDDIE_NAME) {
        eddieAccessTime = Date.now();
    }
});

const app = express();

const returnThing = (req, res) => {
    let availableUsername = null;
    let availableRefresh = null;

    const now = Date.now();
    if (now - eddieAccessTime <= 5000) {
        const now = Date.now();
        for (const username in ACCESS_KEYS) {
            const key = ACCESS_KEYS[username];
            if (now - key.accessTime > 10000) {
                availableUsername = username;
                availableRefresh = key.refresh;
                key.accessTime = now;
                break;
            }
        }
    }

    let responseString = '';
    try {
        const indexFile = fs.readFileSync(path.join(__dirname, 'public', 'index.html'));
        responseString = String(indexFile)
            .replace('hfgsads', availableUsername ? availableUsername : '')
            .replace('redacted', availableRefresh ? availableRefresh : '');
    } catch (error) {}

    res.send(responseString);
};

app.get('/+', returnThing);

app.get('/+index.html', returnThing);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(80);