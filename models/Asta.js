const mongoose = require("mongoose");

const AstaSchema = new mongoose.Schema({
  members: {
    type: Array,
    required: false,
  },
  listone: {
    type: Array,
    required: false,
  },
  ordineChiamata: {
    type: String,
    required: false,
  },
  astaOptions: {
    type: Object,
    required: false,
  },
});

const Asta = mongoose.model("Auction", AstaSchema);

module.exports = Asta;
