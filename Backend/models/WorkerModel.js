const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    appl_no: {
      type: String,
      required: true,
    },
    worker_name: {
      type: String,
      required: true,
    },
    worker_desig: {
      type: String,
      required: true,
    },
    worker_skill: {
      type: String,
      required: true,
    },
    spass_no: {
      type: String,
      required: true,
    },
    spass_expiry_dt: {
      type: String,
      required: true,
    },
    gpass_no: {
      type: String,
      required: true,
    },
    gpass_expiry_dt: {
      type: String,
      required: true,
    },
    job_cd: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

module.exports = mongoose.model("WorkersData", workerSchema);
