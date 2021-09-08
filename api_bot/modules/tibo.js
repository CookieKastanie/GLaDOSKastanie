const schedule = require('node-schedule');
const fs = require("fs");
const bot = require("./bot");

exports.init = () => {

    const passeLAspirateur = () => {
       bot.setCmdsSet("tibo");
       bot.setActivite("Passe l'aspirateur",'',"orange");
    }

    const rangeLAspirateur = () => {
        bot.setCmdsSet();
        bot.setActivite('','',"vert");
    }

    const debutAspirateur             = new schedule.RecurrenceRule();
          debutAspirateur.dayOfWeek   = [new schedule.Range(0,6)];
          debutAspirateur.hour        = 20;
          debutAspirateur.minute      = 55;

    const finAspirateur               = new schedule.RecurrenceRule();
          finAspirateur.dayOfWeek     = [new schedule.Range(0,6)];
          finAspirateur.hour          = 21;
          finAspirateur.minute        = 00;

    schedule.scheduleJob(debutAspirateur, passeLAspirateur);
    schedule.scheduleJob(  finAspirateur, rangeLAspirateur);

}

exports.noCommand = async (params,mess) =>{
    if(mess.member.voice.channel) {
        const connection = await mess.member.voice.channel.join();
        const dispatcher = connection.play("./datas/mp3/aspirateur.mp3", {volume: 0.8});
        dispatcher.on("finish", () => {connection.disconnect(); tokenSound = true;});
    }
    else{
        bot.sayOn(mess.channel, 'Je ne peux pas je passe l\'aspirateur', 5);
    }
  }
