const PFC = [":fist:", ":raised_hand:", ":v:"];
const PFCVictoire = ["Ok t'a gagné", "Quoi ?! Tricheur !", "Pas mal, pas mal"];
const PFCDefaite = ["Allé in your face !", "C'est qui le meilleur ? C'est moi", "C'est pour ma poche ;)"];
const PFCEgalite = ["Hein ! tu lis dans mes circuits ?", "Wow égalité", "Arrête de me copier !"];


exports.jouer = (t) => {
  let coup = -1;
  if (t == "pierre") coup = 0;
  if (t == "feuille") coup = 1;
  if (t == "ciseaux") coup = 2;

  if (coup != -1) {
    let victoire = 2;
    let coupBot = Math.floor(Math.random()*3);

    if (coup == 0 && coupBot == 1) victoire = 0;
    if (coup == 1 && coupBot == 2) victoire = 0;
    if (coup == 2 && coupBot == 0) victoire = 0;

    if (coup == 0 && coupBot == 2) victoire = 1;
    if (coup == 1 && coupBot == 0) victoire = 1;
    if (coup == 2 && coupBot == 1) victoire = 1;

    let pfcMessage;
    const rng = Math.floor(Math.random()*3);
    switch (victoire) {
      case 0: pfcMessage = PFCDefaite[rng]; break;
      case 1: pfcMessage = PFCVictoire[rng]; break;
      default: pfcMessage = PFCEgalite[rng];
    }

    return PFC[coupBot] +" "+ pfcMessage;
  }

  return null;
}
