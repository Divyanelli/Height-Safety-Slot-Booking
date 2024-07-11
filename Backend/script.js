const express = require("express");
const mongoose = require("mongoose");
const WorkerData = require("./models/WorkerModel");
const AgencyData = require("./models/AgencyModel");
const ContractData = require("./models/JobModel");
const SlotData = require("./models/SlotModel");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Route to fetch workers with valid passes
app.get("/api/workers/:workerId", async (req, res) => {
  const { workerId } = req.params;

  try {
    const worker = await WorkerData.find({ _id: workerId });
    if (!worker || worker.length === 0) {
      console.log(`No workers found for ID: ${workerId}`);
      return res.status(404).json({ message: "Workers not found" });
    }
    res.json(worker);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/agencies/:agencyId", async (req, res) => {
  const { agencyId } = req.params;
  try {
    const agencies = await AgencyData.find({ _id: agencyId });
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/agencies/:agency_code", async (req, res) => {
  const { agency_code } = req.params;
  console.log(`Received agency_code: ${agency_code}`);

  try {
    const agency = await AgencyData.find({ agency_code: agency_code });

    if (!agency) {
      console.log(`No agency found for AGENCY_CODE: ${agency_code}`);
      return res.status(404).json({ message: "Agency not found" });
    }
    res.json(agency);
  } catch (err) {
    console.error(`Error querying for agency: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/worker/:job_code", async (req, res) => {
  const { job_code } = req.params;

  try {
    const worker = await WorkerData.find({ job_cd: job_code });
    if (!worker || worker.length === 0) {
      console.log(`No workers found for JOB_CD: ${job_code}`);
      return res.status(404).json({ message: "Workers not found" });
    }
    console.log(worker);

    const contractors = await ContractData.find({ job_cd: job_code });

    if (!contractors || contractors.length === 0) {
      console.log(`No contractors found for JOB_CD(s): ${job_code}`);
      return res.status(404).json({ message: "contractors not found" });
    }
    const contract_data = contractors.map(
      (contractors) => contractors.contractor_name
    );
    console.log(`Contractor Data: ${contract_data.join(", ")}`);
    res.json(contractors);
  } catch (err) {
    console.error(`Error querying for worker: ${err.message}`);
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/contract/:job_code", async (req, res) => {
  const { job_code } = req.params;

  try {
    const contractors = await ContractData.find({ job_cd: job_code });

    if (!contractors || contractors.length === 0) {
      console.log(`No contractors found for JOB_CD(s): ${job_code}`);
      return res.status(404).json({ message: "contractors not found" });
    }
    const agencyCode = contractors[0].party_cd;

    const agency = await AgencyData.find({ agency_code: agencyCode });
    console.log(agency);
    if (!agency || agency.length === 0) {
      console.log(`No agency found for agency_iD(s): ${job_code}`);
      return res.status(404).json({ message: "agency not found" });
    }

    const worker = await WorkerData.find({ job_cd: job_code });
    if (!worker || worker.length === 0) {
      console.log(`No workers found for JOB_CD: ${job_code}`);
      return res.status(404).json({ message: "Workers not found" });
    }
    console.log(worker);
    res.json({ contractors, agency, worker });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/slots/:month/:year", async (req, res) => {
  const { month, year } = req.params;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required" });
  }

  try {
    const slots = await SlotData.find();
    const filteredSlots = slots.filter((slot) => {
      const [day, slotMonth, slotYear] = slot.slot_date.split("-");
      return slotMonth === month && slotYear === year;
    });

    res.json(filteredSlots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/nominated-workers", async (req, res) => {
  const { workerIds } = req.query;

  if (!workerIds) {
    return res.status(400).json({ message: "Worker IDs are required" });
  }

  const idsArray = workerIds
    .split(",")
    .map((id) => mongoose.Types.ObjectId(id));

  try {
    const workers = await WorkerData.find({ _id: { $in: idsArray } });
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.get("/api/nominated-agencies", async (req, res) => {
  const { agencyIds } = req.query;
  if (!agencyIds) {
    return res.status(400).json({ message: "Agency IDs are required" });
  }

  const idsArray = agencyIds
    .split(",")
    .map((id) => mongoose.Types.ObjectId(id));
  try {
    const agencies = await AgencyData.find({ _id: { $in: idsArray } });
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
