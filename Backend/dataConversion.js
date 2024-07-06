const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Worker = require("./models/WorkerModel");
const AgencyData = require("./models/AgencyModel");
const ContractData = require("./models/JobModel");

const uri =
  "mongodb+srv://divyanelli14:Divya%4014@cluster0.ydwmy0r.mongodb.net/workerDatabase?retryWrites=true&w=majority";

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const dataPath = path.join(__dirname, "gapass-data.json");
const rawData = fs.readFileSync(dataPath);
const jsonData = JSON.parse(rawData)["SQL Results"];

// Transform JSON data to match MongoDB schema
const transformedData = jsonData
  .map((item) => {
    return {
      _id: item._id,
      appl_no: item.APPL_NO,
      worker_name: item.WORKER_NAME,
      worker_desig: item.WORKER_DESIG,
      worker_skill: item.WORKER_SKILL,
      spass_no: item.SPASS_NO,
      spass_expiry_dt: item.SPASS_EXPIRY_DT,
      gpass_no: item.GPASS_NO,
      gpass_expiry_dt: item.GPASS_EXPIRY_DT,
      job_cd: item.JOB_CD,
    };
  })
  .filter(
    (worker) =>
      worker._id &&
      worker.appl_no &&
      worker.worker_name &&
      worker.worker_desig &&
      worker.worker_skill &&
      worker.spass_no &&
      worker.spass_expiry_dt &&
      worker.gpass_no &&
      worker.gpass_expiry_dt &&
      worker.job_cd
  );

async function seedDatabase() {
  try {
    await Worker.insertMany(transformedData);
    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding database:", error);
    mongoose.connection.close();
  }
}

seedDatabase();

//for agency data
const rawDataa = fs.readFileSync("safety-belt DB.json");
const data = JSON.parse(rawDataa);

const isValidData = (item) => {
  return Object.values(item).every((value) => value !== null && value !== "");
};

const formatDate = (dateString) => {
  if (dateString) {
    const [day, month, year] = dateString.split("-");
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
};

const insertData = async () => {
  const validData = data["SQL Results"].filter(isValidData).map((item) => ({
    serial_no: item.SERIAL_NO,
    make: item.MAKE,
    bis_license_no: item.BIS_LICENSE_NO,
    mfg_date: formatDate(item.MFG_DATE),
    shelf_life: item.SHELF_LIFE,
    third_party_validity: item.THIRD_PARTY_VALIDITY,
    expiry_date: formatDate(item.EXPIRY_DATE),
    agency_code: item.AGENCY_CODE,
    status: item.STATUS,
    job_cd: item.JOB_CD,
  }));

  try {
    await AgencyData.insertMany(validData);
    console.log("Data successfully inserted");
  } catch (err) {
    console.error("Error inserting data", err);
  } finally {
    mongoose.connection.close();
  }
};

//insertData();

const raw_Data = fs.readFileSync("contract master.json");
const c_data = JSON.parse(raw_Data);

const insertc_data = async () => {
  const valid_c_Data = c_data["SQL Results"]
    .filter(isValidData)
    .map((item) => ({
      job_cd: item.JOB_CD,
      contractor_name: item.CONTRACTOR_NAME,
      contractor_address: item.CONTRACTOR_ADDRESS,
      work_area: item.WORK_AREA,
      job_end_dt: item.JOB_END_DT,
      party_cd: item.PARTY_CD,
      job_desc: item.JOB_DESC,
    }));

  try {
    await ContractData.insertMany(valid_c_Data);
    console.log("Data successfully inserted");
  } catch (err) {
    console.error("Error inserting data", err);
  } finally {
    mongoose.connection.close();
  }
};

//insertc_data();
