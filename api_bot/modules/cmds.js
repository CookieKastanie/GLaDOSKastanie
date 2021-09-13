const bot = require("./bot");
const PFC = require("./PFC");
const reunion = require("./reunion");
const utils = require("./utils");
const sleep = require("./sleep");

const listeCommande = `Liste des commandes :
  - help                     => Affiche cette liste
  - ping                     => Pong?
  - pierre/feuille/ciseaux   => Un jeu
  - private [message]        => T'envoi un mp
  - pd                       => Insulte de manière aléatoire
  - random  [number/coin/
               string/cat]   => Trucs aléatoires
  - screen                   => Donne le lien du channel vocal`;

/*exports.test = (params, mess) => {
  //console.log("Les params", params);

  reunion.affiche();


  //console.log(mess.channel.members);

  //console.log(mess.author.username);
}*/

exports.noCommand = (params,mess) =>{
    bot.sayOn(mess.channel, "```fix\nCommande invalide ("+ params[0] +") -> "+ bot.cmdChar +"help pour afficher les commandes disponibles ```", 15);
}

/***====================== **/
/*** FONCTIONS STANDARDES  **/
/***====================== **/

/** HELP ALED OSCOUR
 * Affiche une liste non-exaustive des commandes disponibles
 */
exports.help = (params, mess) => {
    bot.sayOn(mess.channel, "```"+ listeCommande +"```", 40);
}

exports.aled = (params, mess) => {
    exports.help(params, mess);
}

exports.oscour = exports.help;

/** PING
 * Pong
 */
exports.ping = (params, mess) => {
    //bot.sayOn(mess.channel, "***pong***", 5);
    mess.author.send("***pong***");
}

/**** PIERRE FEUILLE CISEAUX  */

exports.pierre = (params, mess) => {
    let res = PFC.jouer("pierre");
    if(res) mess.reply(":fist: | "+ res);
}

exports.feuille = (params, mess) => {
    let res = PFC.jouer("feuille");
    if(res) mess.reply(":raised_hand: | "+ res);
}
exports.papier = exports.feuille;

exports.ciseaux = (params, mess) => {
    let res = PFC.jouer("ciseaux");
    if(res) mess.reply(":v: | "+ res);
}

/**** Gestion du bot */
/* Change le jeu de l'activité de GLaDOS*/
/*exports.game = (params, mess) => {
  if(params[0]) bot.setGame(params.join(" "));
}*/

/* Pour que GlaDOS t'envoies un petit message*/
exports.private = (params, mess) => {
    let msg = params.join(" ");
    if(msg) mess.author.send(msg);
    else mess.author.send("Hey !");
}

/* Affiche l'avatar de la personne choisie (en @ ou avec l'ID, sinon la tienne)*/
exports.avatar = (params, mess) => bot.sayOn(mess.channel,(mess.guild.member(params[0])!=null?mess.guild.member(params[0]).user:false || mess.mentions.users.first() || mess.author).avatarURL({size : 4096, format : 'png'}),15);


/***============= **/
/*** L'IRRESPECT  **/
/***============= **/

/* Private joke sur Cyril*/
exports.pd = (params, mess) => {
    bot.sayOn(mess.channel, "Cyril c'est un gros pd");
}

/* Private joke sur Nathan*/
const pcPhrases = ["Alors il est bien ton pc Nathan ?", "Alors Nathan ce pc ?", "Il arrive quand ton pc ?"];
exports.pc = (params, mess) => {
    bot.sayOn(mess.channel, pcPhrases[Math.floor(Math.random() * pcPhrases.length)]);
}

/* Private joke sur la meuf de la gare */
exports.pk = (params, mess) => {
  bot.sayOn(mess.channel, "Quel est le chemin le plus court pour aller vers ton coeur ?");
}

/* Affiche un gif de rage */
exports.PUTAIN = (params, mess) => {
    bot.sayOn(mess.channel, "https://tenor.com/view/christmas-tree-hit-crazy-random-angry-gif-19034195", 10);
}

/***=========== **/
/*** DES MATHS  **/
/***=========== **/

/*Affiche la constante reliant le perimètre au diamiètre d'un cercle*/
exports.pi = (params, mess) => {
    bot.sayOn(mess.channel, Math.PI);
}

/*Affiche la constante de Euler*/
exports.e = (params, mess) => {
    bot.sayOn(mess.channel, Math.E);
}

/*Affiche la constante du golden ratio */
exports.phi = (params, mess) =>{
    bot.sayOn(mess.channel, (Math.sqrt(5)+1)/2);
}
exports.φ = exports.phi;


/***=================== **/
/*** GROSSES FONCTIONS  **/
/***=================== **/

/****--------------- */
/**** RANDOM         */
/****--------------- */
/* Permet à GLaDOS de montrer ses connaissances infinies */

exports.random = (params, mess) => {
    let p = undefined;
    if(params[0]) p = params[0].toLowerCase();

    switch (p) {
        case "number":
            let b1 = parseFloat(params[1]);
            let b2 = parseFloat(params[2]);

            if(!b1) b1 = 0;
            if(!b2) b2 = 100;

            if(b1 > b2){
                let save = b1;
                b1 = b2;
                b2 = save;
            }

            bot.sayOn(mess.channel, `Mmmm ${Math.floor(Math.random() * b2 + b1)} ;)`);
        break;

        case "cat":
            utils.httpGetJSON("http://aws.random.cat/meow").then(data => {
                if(data.file){
                    bot.sayOn(mess.channel, data.file);
                }
            });
        break;

        case "string":
            let text = "";
            let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            let b = parseFloat(params[1]);
            if (!b) b = 10;

            for (let i = 0; i < Math.abs(b); ++i)
                text += possible.charAt(Math.floor(Math.random() * possible.length));

            bot.sayOn(mess.channel, `Bip bop... ${text}`);

        break;

        case undefined:
            if(Math.random() > 0.5) bot.sayOn(mess.channel, "Flip^ ... Pile !");
            else bot.sayOn(mess.channel, "Flip^ ... Face !");
        break;

        default:
            bot.sayOn(mess.channel, `Mmm... ${params[Math.floor(Math.random() * params.length)]}`);
    }
}

/****--------------- */
/**** DEFAULT DANCE  */
/****--------------- */
/* Permet à GLaDOS de flex sur tout le monde en 4Dx */

const ddf = require("../datas/defaultDanceFrames");
let lastTimeDancePlay = 0;
exports.default = async (params, mess) => {
    if(lastTimeDancePlay + 30000 < Date.now()) {
        lastTimeDancePlay = Date.now();

        if(mess.member.voice.channel) playSound(params,mess,'./datas/mp3/fortnite-default-dance-sound.mp3',1.0);

        mess.channel.send("```"+ ddf[0] +"```")
        .then(async (_mess) => {
            for(let i = 1; i < ddf.length; ++i) {
                await sleep(700);

                try {
                    await _mess.edit("```"+ ddf[i] +"```");
                } catch (error) { }
            }

            await sleep(800);

            _mess.delete().catch(() => {});
        })
        .catch(() => {});
    } else {
        bot.sayOn(mess.channel, "Trop de danse pour moi :x", 5);
    }
}

/***=================== **/
/*** INTERFACE DISCORD  **/
/***=================== **/

/** SCREEN
 * Envoi le lien pour ouvrir l'interface vidéo
 * N'est plus utile car Discord le gère maintenant
 */
exports.screen = (params, mess) => {
    if(mess.member.voice.channel) {
        bot.sayOn(mess.channel, bot.richEmbed()
        .addField('Lien du channel vocal:', `https://discordapp.com/channels/${mess.guild.id}/${mess.member.voice.channel.id}`)
        .setColor(0x9B59B6));
    } else {
        bot.sayOn(mess.channel, 'Gros pd, tu doit être connecté à un voice channel pour utiliser cette commande >:(', 15);
    }
}

/** HIDE
 * Permet de se cacher dans le vocal secret
 */
exports.hide = (params, mess) => {
    mess.member.fetch(mess.author).then(mem => {
        const chan = bot.getVocalChannels().get("Vocal secret");
        mem.voice.setChannel(chan)
        .then(() => {})
        .catch(() => {});
    }).catch(() => {});
}

/***===================== **/
/*** GESTION DE REUNIONS  **/
/***===================== **/

/** PRESENT
 * Permet d'indiquer qu'on est présent à la réunion prévue
 */
exports.present = (params, mess) => {
    if(!reunion.existe(mess.channel.name)) {
        bot.sayOn(mess.channel, `Aucune réunion de prévu sur le canal ***${mess.channel.name}***`, 15);
    } else {
        let success = reunion.addUserOn(mess.channel.name, mess.member.user.id);
        if (success) {
            let r = reunion.get(mess.channel.name);
            mess.author.send(`Vous avez rejoint la reunion "${r.sujet}" sur le canal ***${mess.channel.name}*** prévu pour le ${reunion.dateToString(r.date)}`);
            bot.sayOn(mess.channel, `${mess.author.username} sera présent à la réunion !`);
        }
    }
}

/** NOT PRESENT
 * Permet d'indiquer qu'on ne fait plus parti de la réunion prévue
 */
exports.notpresent = (params, mess) => {
    let success = reunion.removeUserOn(mess.channel.name, mess.member.user.id);
    if(success) {
        let r = reunion.get(mess.channel.name);
        let d = new Date(r.date);
        mess.author.send(`Vous avez quitté la reunion "${r.sujet}" sur le canal ***${mess.channel.name}***`);
        bot.sayOn(mess.channel, `${mess.author.username} ne sera plus présent à la réunion !`);
    }
}

/***====================== **/
/*** GESTION DE REACTIONS  **/
/***====================== **/

/****---------- */
/**** 🅱 R U H */
/****---------- */

let lastBruh; // Sauvegarde la référence du dernier message ayant reçu la demande "BRUH"

/** BRUH
 * Ajoute les réactions "B" "R" "U" "H" au dernier message, ou à celui choisi
 */
exports.bruh = (params, mess) => {
    let messId;
    if (params[0]) messId = params[0].split('/')[6];  //Si on choisi un message en envoyant son lien
    if(messId){
        exports.bigbruh(params, mess);
    }
    else                                              //Sinon on le fait sur le dernier message

    mess.channel.messages.fetch({ limit: 1}).then(async messages => {
        let lastMessage = messages.first();
        lastBruh = lastMessage;
        await lastMessage.react('🅱️');
        await lastMessage.react('🇷');
        await lastMessage.react('🇺');
        await lastMessage.react('🇭');
    }).catch();
}

/** UN-BRUH
 * Enlève les réactions "B" "R" "U" "H" au dernier message, ou à celui choisi
 */
exports.unbruh = (params, mess) =>{
    let messId;

    if (params[0]) messId = params[0].split('/')[6];

    if(messId){
        exports.stepbruh(params, mess);
    }
    else {
        try {
            if(lastBruh) {
                lastBruh.reactions.cache.forEach(reaction => {
                    if (reaction.emoji.name === '🅱️' 
                    ||reaction.emoji.name === '🇷' 
                    ||reaction.emoji.name === '🇺' 
                    ||reaction.emoji.name === '🇭' ) reaction.users.remove(bot.user);
                });
            }
        } catch(e){}
    }
}

/** BIG BRUH
 * Permet de realiser la commande "BRUH" sur n'importe message tant qu'on a le lien
 */
exports.bigbruh = (params, mess) => {
    const messId = params[0].split('/')[6];
    if(messId === undefined) {}
    else {
        mess.channel.messages.fetch(messId).then(async message => {
            await message.react('🅱️');
            await message.react('🇷');
            await message.react('🇺');
            await message.react('🇭');
        }).catch();
    }
}

/** STEP BRUH
 * Permet de realiser la commande "UN-BRUH" sur n'importe message tant qu'on a le lien
 */
exports.stepbruh = (params, mess) => {
    const messId = params[0].split('/')[6];
    const chanId = params[0].split('/')[5];
    if(messId === undefined) {}
    else{
        const chanal = Array.from(bot.getTextChannels().values()).find(c => c.id === chanId);

        chanal.messages.fetch(messId).then(async message => {
              message.reactions.cache.forEach(reaction => {
                  if (reaction.emoji.name === '🅱️' 
                    ||reaction.emoji.name === '🇷' 
                    ||reaction.emoji.name === '🇺' 
                    ||reaction.emoji.name === '🇭' ) reaction.users.remove(bot.user);
            });
        }).catch();
    }
}

/****--------- */
/**** ✔ O T E  */
/****--------- */

let lastVote; // Sauvegarde la référence du dernier message ayant reçu la demande "VOTE"

/** VOTE
 * Ajoute les réactions de vote "oui" et "non" sur le dernier message
 */
exports.vote = (params, mess) => {
    mess.channel.messages.fetch({limit: 1}).then(async messages => {
        let lastMessage = messages.first();
        lastVote = lastMessage;
        await lastMessage.react('👍');
        await lastMessage.react('👎');
    }).catch();
}

/** UN-VOTE
 * Enlève les réactions de vote sur le dernier message
 */
exports.unvote = (params, mess) =>{
    try{
        if(lastVote) {
            lastVote.reactions.cache.forEach(reaction => {
                if (reaction.me && (reaction.emoji.name === '👍' 
                                || reaction.emoji.name === '👎')) reaction.users.remove(bot.user);
            });
        }
    } catch(e) {}
}

/** STOP THE COUNT
 * Permet de "UN-VOTE" n'importe quel message dont on a le lien
 */
exports.stopthecount = (params, mess) => {
    const messId = params[0].split('/')[6];
    const chanId = params[0].split('/')[5];
    if(messId === undefined) {}
    else {
        const chanal = Array.from(bot.getTextChannels().values()).find(c => c.id === chanId);

        chanal.messages.fetch(messId).then(async message => {
            message.reactions.cache.forEach(reaction => {
                if (reaction.emoji.name === '👍' 
                  ||reaction.emoji.name === '👎') reaction.users.remove(bot.user);
            });
        }).catch();
    }
}

/***=========================== **/
/*** GESTION DES SONS EN VOCAL  **/
/***=========================== **/

const { MusicSubscription, Track } = require('./audio');

let musicSubscription = null;

const playSound = async (params, mess, file, soundVolume, skip = true) => {
    if(mess.member.voice.channel) {
        if(!musicSubscription || musicSubscription.isDestroyed()) {
            musicSubscription = new MusicSubscription(mess.member.voice.channel);
        }

        const track = await Track.from(file, {
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
                bot.sayOn(mess.channel, `Cette source audio n'existe pas !`, 15);
            },
        });

        track.setVolume(soundVolume);

        musicSubscription.enqueue(track, skip);
        if(skip && musicSubscription.isPlaying()) musicSubscription.skip();
    } else {
        bot.sayOn(mess.channel, 'Gros pd, tu doit être connecté à un voice channel pour utiliser cette commande >:(', 15);
    }
} 

exports.somaj = (params, mess) => {
    playSound(params,mess,'./datas/mp3/somaj.mp3', 2.0);
}

exports.bong = (params, mess) => {
    playSound(params,mess,'./datas/mp3/bong.mp3', 0.5);
}

exports.bang = (params, mess) => {
    playSound(params,mess,'./datas/mp3/bang.mp3', 1.0);
}

exports.dearsister = exports.bang2 = (params, mess) => {
    playSound(params,mess,'./datas/mp3/DearSister.wav', 0.3);
}

exports.bruh2 = (params, mess) => {
    playSound(params,mess,'./datas/mp3/bruh-sound-effect-2.mp3', 1.0);
}

exports.yooooooooooo = (params, mess) => {
    playSound(params,mess,'./datas/mp3/yooooooooooo.mp3', 0.7);
}

exports.kfc = (params, mess) => {
    playSound(params,mess,'./datas/mp3/11-tenders-kfc-pour-seulement-695eur-le-mardi.mp3', 1.0);
}

exports.ine = (params, mess) => {
    playSound(params,mess,'./datas/mp3/ine.mp3', 1.0);
}

exports.wooow = (params, mess) => {
    playSound(params,mess,'./datas/mp3/wooow.mp3', 1.0);
}

exports.cum = (params, mess) => {
    playSound(params,mess,'./datas/mp3/keanu-reeves-says-why-do-you-cum.mp3', 1.0);
}

/***=========================== **/
/***     MUSIQUES  YOUTUBE      **/
/***=========================== **/

const ytSearch = require('youtube-search');
const ytOpts = {
    maxResults: 1,
    key: require('../secrete.json').ytApiKey
};

exports.play = (params, mess) => {
    const songName = params.join(' ');
    if(songName.startsWith('http')) {
        playSound(params, mess, songName, 0.2, false);
    } else {
        ytSearch(songName, ytOpts, (err, results) => {
            if(err){
                bot.sayOn(mess.channel, `Youtube c'est de la merde, utilise une url directe`, 10);
                return console.warn(err);
            }
            
            if(results.length >= 1) {
                playSound(params, mess, results[0].link, 0.2, false);
            } else {
                bot.sayOn(mess.channel, `Aucun résultat pour : ${songName}`, 10);
            }
        });
    }

    
    /*
    // recherche de timestamp
    const n = params[params.length-1].search("\\?t=");
    let time = n!==-1?params[params.length-1].substr(n+2,params[params.length-1].length):0;
    time = time ? parseInt(time.match(/\d+/), 10) : 0;
    */
}

exports.tg = exports.stop = async (params, mess) => {
    if(mess.member.voice.channel && musicSubscription) {
        musicSubscription.stop();
    }
}

exports.skip = (params, mess) => {
    if(mess.member.voice.channel && musicSubscription) {
        musicSubscription.skip();
    }
}
