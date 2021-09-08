const bot = require("./modules/bot");
const server = require("./modules/api");

console.log("Demarrage bot");
bot.start().then(() => {
  server.start(port => {
    console.log(`Le serveur HTTP est allumé sur le port ${port}`);
  });
});
