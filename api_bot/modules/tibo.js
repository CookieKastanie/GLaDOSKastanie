const schedule = require('node-schedule');
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

const { MusicSubscription, Track } = require('./audio');

let musicSubscription = null;

exports.noCommand = async (params, mess) =>{
    if(mess.member.voice.channel) {
        if(!musicSubscription || musicSubscription.isDestroyed()) {
            musicSubscription = new MusicSubscription(mess.member.voice.channel);
        }

        const track = await Track.from('./datas/mp3/aspirateur.mp3', {
            onStart() {
              
            },

            onFinish() {
                if(musicSubscription && musicSubscription.queueIsEmpty()) {
                    musicSubscription.destroy();
                    musicSubscription = null;
                }
            },

            onError(error) {
                console.warn(error);
            },
        });

        track.setVolume(0.8);

        musicSubscription.enqueue(track);
        if(musicSubscription.isPlaying()) musicSubscription.skip();
    } else {
        bot.sayOn(mess.channel, 'Je ne peux pas je passe l\'aspirateur', 5);
    }
  }
