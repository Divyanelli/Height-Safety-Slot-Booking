document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const workerIdsParam = urlParams.get("workers");
  const agencyIdsParam = urlParams.get("agencies");

  console.log("Worker IDs from URL:", workerIdsParam);
  console.log("Agency IDs from URL:", agencyIdsParam);
  const workerIds = workerIdsParam ? workerIdsParam.split(",") : [];
  const agencyIds = agencyIdsParam ? agencyIdsParam.split(",") : [];

  const workersList = document.getElementById("workers-list");
  workersList.innerHTML = "";
  const beltsList = document.getElementById("belts-list");
  beltsList.innerHTML = "";
  const checkbtn = document.getElementById("check-button");
  const submitbtn = document.getElementById("submit");

  checkbtn.addEventListener("click", () => {
    const monthInput = document.getElementById("month").value;
    const yearInput = document.getElementById("year").value;

    var month = parseInt(monthInput);
    const year = parseInt(yearInput);

    month = month < 10 ? `0${month}` : `${month}`;
    console.log(`Month: ${month}, Year: ${year}`);

    if (month >= 1 && month <= 12 && year) {
      fetch(`http://localhost:5000/api/slots/${month}/${year}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const slotsList = document.getElementById("slots-list");
          slotsList.innerHTML = "";

          if (data && data.length > 0) {
            data.forEach((slot) => {
              if (slot.avl_slots > 0) {
                // Check if available slots are greater than 0
                const row = document.createElement("tr");
                row.innerHTML = `
                  <td><input type="checkbox" name="select-slot" value="${slot._id}"></td>
                  <td>${slot.slot_date}</td>
                  <td>${slot.avl_slots}</td>
                  <td>${slot.booked_slots}</td>
                `;
                slotsList.appendChild(row);
              }
            });
          } else {
            slotsList.innerHTML =
              "<tr><td colspan='4'>No slots found.</td></tr>";
          }
        })
        .catch((err) => {
          console.error("Error fetching slots:", err);
        });
    } else {
      alert("Please enter a valid month and year.");
    }
  });

  for (const workerId of workerIds) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/workers/${workerId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched Worker Data:", data);

      if (data && data.length > 0) {
        data.forEach((worker) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${worker.worker_name}</td>
            <td>${worker.worker_skill}</td>
            <td>${worker.spass_no}</td>
            <td>${worker.gpass_no}</td>
          `;
          workersList.appendChild(row);
        });
      } else {
        workersList.innerHTML =
          "<tr><td colspan='5'>No workers found.</td></tr>";
      }
    } catch (error) {
      console.error("Error fetching nominated workers:", error);
      workersList.innerHTML =
        "<tr><td colspan='5'>Error fetching workers.</td></tr>";
    }
  }

  for (const agencyId of agencyIds) {
    try {
      const response = await fetch(
        `http://localhost:5000/api/agencies/${agencyId}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched Agency Data:", data);

      if (data && data.length > 0) {
        data.forEach((agency) => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${agency.serial_no}</td>
            <td>${agency.make}</td>
            <td>${agency.bis_license_no}</td>
            <td>${agency.mfg_date}</td>
            <td>${agency.shelf_life}</td>
          `;
          beltsList.appendChild(row);
        });
      } else {
        beltsList.innerHTML =
          "<tr><td colspan='5'>No agencies found.</td></tr>";
      }
    } catch (error) {
      console.error("Error fetching nominated agencies:", error);
      beltsList.innerHTML =
        "<tr><td colspan='5'>Error fetching agencies.</td></tr>";
    }
  }
  submitbtn.addEventListener("click", () => {
    alert("Thank you the slots are booked for nominated Workers.Mail sent");
  });
});
