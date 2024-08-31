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
    const { winner, wonFor, role } = req.body.payload;

    const updatedAuction = await Asta.findOneAndUpdate(
      { _id: auctionId, "listone.id": parseInt(playerId) },
      {
        $set: {
          "listone.$.winner": winner,
          "listone.$.wonFor": parseInt(wonFor),
        },
      },
      { new: true } // restituisce il documento aggiornato
    );
    if (updatedAuction) {
      const auction = await Asta.findOne({ _id: auctionId });

      if (!auction) {
        console.log('Asta non trovata');
        return;
      }
      
      const memberIndex = auction.members.findIndex(member =>
        member.email.substring(0, member.email.indexOf('@')) === winner
      );

      if (memberIndex === -1) {
        console.log("Membro non trovato");
        res.sendStatus(404);
      }

      const updateFields = {
      };

      if (role === "P") {
        updateFields[`members.${memberIndex}.porLeft`] =
          auction.members[memberIndex].porLeft - 1;
      } else if (role === "C") {
        updateFields[`members.${memberIndex}.ccLeft`] = auction.members[memberIndex].ccLeft - 1;;
      } else if (role === "D") {
        updateFields[`members.${memberIndex}.difLeft`] = auction.members[memberIndex].difLeft - 1;;
      } else if (role === "A"){
        updateFields[`members.${memberIndex}.attLeft`] = auction.members[memberIndex].attLeft - 1;;
      }

      updateFields[`members.${memberIndex}.creditsLeft`] =
        auction.members[memberIndex].creditsLeft - parseInt(wonFor);

      const updatedAuction = await Asta.findOneAndUpdate(
        { _id: auctionId },
        { $set: updateFields },
        { new: true } // Restituisce il documento aggiornato
      );

      if (updatedAuction) {
        console.log("Asta aggiornata con successo:", updatedAuction);
      } else {
        console.log("Errore durante l'aggiornamento dell'asta");
      }
    }
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

exports.updateAuctionOptionsOrdineChiamata = async function (req, res, next) {
  try {
    const { auctionId } = req.params;
    const newOrder = req.body.newOrder;
    console.log(
      "updateAuctionOptionsOrdineChiamata ASTA: " +
        auctionId +
        " NEW ORDER: " +
        newOrder +
        " START"
    );

    await Asta.findByIdAndUpdate(
      auctionId,
      { $set: { "astaOptions.ordineChiamata": newOrder } },
      { new: true }
    );

    console.log(
      "updateAuctionOptionsOrdineChiamata ASTA: " +
        auctionId +
        " NEW ORDER: " +
        newOrder +
        " END"
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};

exports.updateAuctionOptionsCountdown = async function (req, res, next) {
  try {
    const { auctionId } = req.params;
    const newCountdown = req.body.newCountdown;
    console.log(
      "updateAuctionOptionsCountdown ASTA: " +
        auctionId +
        " NEW COUNTDOWN: " +
        newCountdown +
        " START"
    );

    await Asta.findByIdAndUpdate(
      auctionId,
      { $set: { "astaOptions.countdown": newCountdown } },
      { new: true }
    );

    console.log(
      "updateAuctionOptionsCountdown ASTA: " +
        auctionId +
        " NEW COUNTDOWN: " +
        newCountdown +
        " END"
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};
