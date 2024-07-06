document.addEventListener("DOMContentLoaded", () => {
  const jobCode = document.getElementById("jobCode");
  const agencySelect = document.getElementById("agency");
  const ContractorNameInput = document.getElementById("csNo");
  const WorkArea = document.getElementById("workArea");
  const jobEndDate = document.getElementById("jobEndDate");
  const fetchWorkersButton = document.getElementById("fetch-workers-button");
  const workerTableBody = document.querySelector(".worker-table tbody");
  const beltsTableBody = document.querySelector(".belts-table tbody");

  fetchWorkersButton.addEventListener("click", () => {
    const selectedJobCode = jobCode.value;

    if (selectedJobCode) {
      fetch(`http://localhost:5000/api/contract/${selectedJobCode}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.contractors && data.contractors.length > 0) {
            const contractorName = data.contractors[0].contractor_name;
            ContractorNameInput.value = contractorName;

            const work = data.contractors[0].work_area;
            WorkArea.value = work;

            const end_date = data.contractors[0].job_end_dt;
            jobEndDate.value = end_date;
          }

          if (data.agency && data.agency.length > 0) {
            const agen = data.agency[0].agency_code;
            agencySelect.value = agen;

            beltsTableBody.innerHTML = "";
            data.agency.forEach((agen) => {
              const row = document.createElement("tr");
              row.innerHTML = `
              <td><input type="checkbox" name="select-agency" value="${agency._id}"></td>
              <td>${agen.serial_no}</td>
                <td>${agen.make}</td>
                <td>${agen.bis_license_no}</td>
                <td>${agen.mfg_date}
                <td>${agen.shelf_life}</td>
                <td>${agen.status}</td>
              `;
              beltsTableBody.appendChild(row);
            });
          }

          if (data.worker && data.worker.length > 0) {
            workerTableBody.innerHTML = "";
            data.worker.forEach((worker) => {
              const row = document.createElement("tr");
              row.innerHTML = `
              <td><input type="checkbox" name="select-worker" value="${worker._id}"></td>
                <td>${worker.worker_name}</td>
                <td>${worker.worker_desig}</td>
                <td>${worker.worker_skill}</td>
                <td>${worker.spass_no}</td>
                <td>${worker.gpass_no}</td>
              `;
              workerTableBody.appendChild(row);
            });
          }
        })

        .catch((error) => console.error("Error fetching workers:", error));
    } else {
      alert("Please enter a job code.");
    }
  });
});
