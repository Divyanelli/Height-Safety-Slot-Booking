const mongoose = require("mongoose");

const agencySchema = new mongoose.Schema({
  serial_no: String,
  make: String,
  bis_license_no: String,
  mfg_date: Date,
  shelf_life: String,
  third_party_validity: String,
  expiry_date: Date,
  agency_code: String,
  status: String,
  job_cd: String,
});

module.exports = mongoose.model("AgencyData", agencySchema);
