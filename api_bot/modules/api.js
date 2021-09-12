const express = require("express");
const app = express();
const fs = require('fs');

let server = null;
let secreteAuth = null;

const config = require("../config.json");

exports.start = cb => {
    refreshAuth();

    app.use(require('body-parser').json());

    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        if ('OPTIONS' === req.method) res.sendStatus(200);
        else {
            const auth = req.header('Authorization');
            if(auth === secreteAuth) next();
            else res.sendStatus(401);
        }
    });

    const listenCB = () => {
        require("./setRoutes")(app);
        if(typeof cb == "function") cb(config.port_HTPP);
    }

    const secrete = require('../secrete.json');
    if(secrete.ssl) {
        const options = {
            cert: fs.readFileSync(secrete.ssl.certificate_path, 'utf8'),
            key: fs.readFileSync(secrete.ssl.certificate_key_path, 'utf8')
        };

        serveur = require('https').createServer(options, app);
        serveur.listen(config.port_HTPP, listenCB);
    } else {
        server = app.listen(config.port_HTPP, listenCB);
    }
}

const refreshAuth = () => {
    const data = fs.readFileSync('./secrete.json', 'utf8');
    secreteAuth = JSON.parse(data).pswManager;
}
exports.refreshAuth = refreshAuth;

exports.stop = () => {
    if (server) {
        server.close();
        server = null;
    }
}
