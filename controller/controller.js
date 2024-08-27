const Asta = require("../models/Asta");

exports.createAsta = async function (req, res, next) {
  try {
    let updatedMembers = req.body.members;

    updatedMembers = updatedMembers.map((member) => {
      return {
        email: member.email,
        admin: member.admin,
        creditsLeft: req.body.astaOptions.astaCrediti,
        porLeft: req.body.astaOptions.numeroPortieri,
        difLeft: req.body.astaOptions.numeroDifensori,
        ccLeft: req.body.astaOptions.numeroCentrocampisti,
        attLeft: req.body.astaOptions.numeroAttaccanti,
      };
    });

    console.log(updatedMembers);
    const asta = new Asta({
      ...req.body,
      members: updatedMembers,
    });

    asta
      .save()
      .then(() => {
        console.log("Nuova asta creata e salvata con successo");
        res.status(200).send("Asta creata con successo.");
      })
      .catch((error) => {
        console.error("Errore durante il salvataggio dell'asta:", error);
        throw error;
      });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.findMemberAuctions = async function (req, res, next) {
  try {
    Asta.find({ "members.email": req.body.members })
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((err) => {
        console.error("Errore durante la ricerca:", err);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.findAuction = async function (req, res, next) {
  try {
    Asta.find({ _id: req.params.auctionId })
      .then((results) => {
        res.status(200).send(results);
      })
      .catch((err) => {
        console.error("Errore durante la ricerca:", err);
      });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.updateAuctionPlayer = async function (req, res, next) {
  try {
    const { auctionId, playerId } = req.params;
    const { winner, wonFor } = req.body.payload;

    let ress = await Asta.findOneAndUpdate(
      { _id: auctionId, "listone.id": parseInt(playerId) },
      {
        $set: {
          "listone.$.winner": winner,
          "listone.$.wonFor": parseInt(wonFor),
        },
      },
      { new: true } // restituisce il documento aggiornato
    );

    console.log(ress);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.findWonPlayers = async function (req, res, next) {
  const { auctionId, winner } = req.params;

  try {
    Asta.findOne({ _id: auctionId })
      .then((auction) => {
        if (auction) {
          const playersWon = auction.listone.filter(
            (player) => player.winner === winner
          );
          res.send(playersWon);
        } else {
          throw {
            msg: "ERRORE DURANTE LA RICERCA",
          };
        }
      })
      .catch((error) => {
        throw error;
      });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
