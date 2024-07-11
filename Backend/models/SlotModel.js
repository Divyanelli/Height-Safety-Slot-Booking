const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  slot_date: {
    type: String,
    required: true,
  },
  avl_slots: {
    type: Number,
    required: true,
  },
  booked_slots: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("SlotsData", slotSchema);
