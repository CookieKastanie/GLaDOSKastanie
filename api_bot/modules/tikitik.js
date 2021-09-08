const schedule = require('node-schedule');
const fs = require("fs");
const bot = require("./bot");

exports.init = () => {
    const file = fs.readFileSync("./datas/tikilist.txt", "utf8");
    const mots = file.split('\n');

    const changeName = () => {
        try {
            const index = Math.floor(Date.now() / 86400000) % mots.length;
            bot.setNickName("217708349377085440", "356034407796310016", mots[index]);
        } catch (error) {
            console.error(error);
        }
    }

    let rule = new schedule.RecurrenceRule();
    rule.dayOfWeek = [new schedule.Range(0,6)];
    rule.hour = 0;
    rule.minute = 1;

    schedule.scheduleJob(rule, changeName);

    //changeName();
}
