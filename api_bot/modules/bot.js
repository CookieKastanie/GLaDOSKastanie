const Discord = require("discord.js");
const bot = new Discord.Client();
const canaux = new Map();
const canauxVocaux = new Map();
//const cmds = require("./cmds");
const tibo = require("./tibo");
const cmds = {
  default: require("./cmds"),
  tibo
};
const tikitik = require("./tikitik");

let currentCmdsSet = "default";
const cmdChar = '$';
exports.cmdChar = cmdChar;

const findCanaux = () => {
  bot.channels.cache.forEach(c => {
    if(c.type == 'text') {
      canaux.set(c.name, c);
    } else if(c.type == 'voice') {
      canauxVocaux.set(c.name, c);
    }
  });
}

////////////////////////////////////////////////////

/*bot.on('message', (mess) => {
  let text = mess.content;

  if (text.startsWith(cmdChar)) {
      mess.delete().then(() => {
        let params = text.substr(1).split(/\s+/g);
        let cmdName = params[0];
        params.shift();
        let cmd = cmds[cmdName];
        if(cmd) cmd(params, mess);
        else sayOn(mess.channel, "```fix\nCommande invalide ("+ cmdName +") -> "+ cmdChar +"help pour afficher les commandes disponibles ```", 15);
      }).catch(() => {});
    }
});*/

bot.on('message', (mess) => {
  let text = mess.content;

  if (text.startsWith(cmdChar)) {
    mess.delete().then(() => {

      let params = text.substr(1).split(/\s+/g);
        let cmdName = params[0];
        params.shift();
        const cmdsSet = cmds[currentCmdsSet];
        let cmd = cmdsSet[cmdName];
        if(cmd && (cmdName != "noCommand")) cmd(params, mess);
        else {
          if (cmdsSet["noCommand"])
            cmdsSet["noCommand"]([cmdName],mess);
          else sayOn(mess.channel, "```fix\nCommande invalide```", 5)
        }

    }).catch(() => {});
  }

});

exports.setCmdsSet = (name) => {
    switch (name){
      case "tibo" : 
        currentCmdsSet = name; break;
      default : currentCmdsSet = "default";
    }

}

////////////////////////////////////////////////////

exports.getCannaux = () => {
  return {
    text: Array.from(canaux.keys()),
    vocal: Array.from(canauxVocaux.keys())
  }
}

exports.start = () => {
  return new Promise((resolve) => {
    let secrete = require("../secrete.json");

    bot.on('ready', () => {
      console.log("Bot prêt");
      //bot.user.setActivity("lécher son écran");

      findCanaux();

      tikitik.init();
      tibo.init();

      resolve();
    });

    bot.login(secrete.apiKey);
  });
}

exports.setGame = (str) => {
  exports.setActivite(str);
  
}

exports.setActivite = (name, typeName='PLAYING', couleur="vert" ) => {

  switch (typeName){
    case 'STREAMING':
    case 'LISTENING':
    case 'WATCHING':
    case 'COMPETING': 
    break;
    default : typeName = 'PLAYING';
  }

  if (name) {
    bot.user.setPresence({
      activity: {name: name, type : typeName},
      status:   statusFromCouleur(couleur)
    });
  }
  else {
    bot.user.setPresence({
      activity: {name: "", type : ""},
      status:   statusFromCouleur(couleur)
    });
  }
  
}

const statusFromCouleur = (couleur) => {
  let statut = 'online'; // vert

  if(couleur == 'rouge' ) statut = 'dnd';
  if(couleur == 'orange') statut = 'idle';
  if(couleur == 'none'  ) statut = 'invisible';

  return statut;
}

exports.setCouleur = (couleur) => {
  bot.user.setStatus(statusFromCouleur(couleur));
}


exports.setNickName = (serverIdent, userIdent, name) => {
  bot.guilds.fetch(serverIdent).then(serv => {
    return serv.members.fetch(userIdent);
  }).then(member => {
    member.setNickname(name).catch(() => {});
  });
}

const sayOn = (canal, message, secs = 0) => {
  if(typeof canal == "string") canal = canaux.get(canal);
  if(!canal) return false;

  secs = Math.min(180, secs);

  if(typeof message == "string"){
    canal.send(`${message} ${(secs ? " ```fix\nCe message s'auto détruira dans "+ secs +" secondes```" : "")}`).then(mess => {
      if(secs) {
        setTimeout(() => {
          mess.delete().catch(() => {});
        }, secs * 1000);
      }
    }).catch(e => {
      console.log(e);
    });
  } else {
    canal.send(message).catch(e => {
      console.log(e);
    });
  }

  return true;
}
exports.sayOn = sayOn;

exports.getUserById = async id => {
   return await bot.users.fetch(id);
}

exports.getTextChannels = () => {
  return canaux;
}

exports.getVocalChannels = () => {
  return canauxVocaux;
}

exports.richEmbed = () => {
  return new Discord.MessageEmbed();
}
