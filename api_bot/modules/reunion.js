const fs = require('fs');
const schedule = require('node-schedule');
const bot = require("./bot");
const jsonPath = "./datas/reunions.json";

let reunions = new Object();
let isLoad = false;

const loadFromJson = () => {
    if(!isLoad){
        try {
            let data = fs.readFileSync(jsonPath, 'utf8');
            let r = JSON.parse(data);

            for (let canal in r) {
                let opts = r[canal];
                exports.create(canal, opts);
            }

            isLoad = true;
        } catch (e) {
            console.log(e);
        }
    }
}

const saveInJson = () => {
    fs.writeFile(jsonPath, JSON.stringify(reunions, null, 2), 'utf8', err => {
        if (err) console.error("JSON reunion write fail");
    });
}

exports.affiche = () => {
    console.log(reunions);
}

exports.create = (canal, opts) => {
    if (reunions[canal]) return false;
    let date = parseInt(opts.date);
    if(isNaN(date) || !canal || canal == "") return false;

    date = Math.floor(date / 60000) * 60000;

    if((date + (5 * 60000)) < Date.now()) return false; // 5 * 60000 -> 5 minutes

    reunions[canal] = {
        sujet: opts.sujet || "",
        description: opts.description || "",
        date: date,
        participants: opts.participants || new Array()
    }

    saveInJson();

    schedule.scheduleJob(date, () => {
        exports.fire(canal);
    });

    return true;
}

exports.fire = canal => {
    let r = reunions[canal];

    if (!r) return false;

    bot.sayOn(canal, `${r.sujet}, c'est ici que ça ce passe !`);

    for (let id of r.participants) {
        bot.getUserById(id).then(user => {
            user.send(`C'est l'heure ! RDV sur le canal ${canal}`);
        }).catch(e => {
            console.log(e);
        });
    }

    exports.delete(canal);
    return true;
}

exports.delete = canal => {
    if (!reunions[canal]) return false;
    delete reunions[canal];
    saveInJson();
}

exports.existe = canal => {
    return reunions[canal] != undefined;
}

exports.get = canal => {
    return reunions[canal];
}

exports.addUserOn = (canal, userId) => {
    let reunion = reunions[canal];
    if(!reunion) return false;
    if(reunion.participants.includes(userId)) return false;

    reunion.participants.push(userId);
    saveInJson();
    return true;
}

exports.removeUserOn = (canal, userId) => {
    let reunion = reunions[canal];
    if(!reunion) return false;
    if(!reunion.participants.includes(userId)) return false;

    reunion.participants = reunion.participants.filter(e => e != userId);
    saveInJson();
    return true;
}

exports.dateToString = (val) => {
    let d = new Date(val);
    //return `${d.toLocaleDateString("fr-FR")} à ${d.toLocaleTimeString("fr-FR")}`;
    return d.toLocaleString("fr-FR", {timeZone: "Europe/Paris"});
}


loadFromJson();
