const bot = require("./bot");
const reunion = require("./reunion");

module.exports = app => {
  app.route("/refreshAuth").get((req, res) => {
    require("./api").refreshAuth();
    res.sendStatus(200);
  });

  app.route("/canaux").get((req, res) => {
    res.json(bot.getCannaux());
  });

  app.route("/sayOn").post((req, res) => {
    let valid = bot.sayOn(req.body.channel, req.body.msg, req.body.delay);
    valid ? res.sendStatus(200) : res.sendStatus(400);
  });

  app.route("/reunion").post((req, res) => {
    let data = req.body;
    if(!bot.getCannaux().text.includes(data.canal)) {
      res.sendStatus(400);
      return;
    }

    let valid = reunion.create(data.canal, data);
    if (valid) {
      let r = reunion.get(data.canal);
      const embed = bot.richEmbed()
      .setTitle("Nouvelle réunion !")
      .setColor("#9b59b6")
      .addField(r.sujet, r.description)
      .setDescription(`Prévu pour le ${reunion.dateToString(r.date)}`)
      .setFooter("Tapez $present pour signaler votre présence");

      bot.sayOn(data.canal, {embed});
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  });
}
