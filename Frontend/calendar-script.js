document.addEventListener("DOMContentLoaded", () => {
  const availableSlotsInput = document.getElementById("availableSlots");
  const calendar = document.getElementById("calendar");
  const monthLabel = document.getElementById("month-label");
  const prevMonthBtn = document.getElementById("prev-month");
  const nextMonthBtn = document.getElementById("next-month");

  const availableDates = [1, 5, 10, 15];
  const nonAvailableDates = [3, 7, 12, 20];
  const toBeAddedDates = [2, 4, 9, 18];

  let selectedDate = null;
  let currentMonth = new Date().getMonth();
  let currentYear = new Date().getFullYear();

  function updateCalendar() {
    calendar.innerHTML = "";
    monthLabel.textContent = new Date(currentYear, currentMonth).toLocaleString(
      "default",
      { month: "long", year: "numeric" }
    );

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfMonth; i++) {
      const emptyCell = document.createElement("div");
      emptyCell.classList.add("day", "empty");
      calendar.appendChild(emptyCell);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      dayElement.textContent = day;

      if (availableDates.includes(day)) {
        dayElement.classList.add("available");
      } else if (nonAvailableDates.includes(day)) {
        dayElement.classList.add("non-available");
      } else if (toBeAddedDates.includes(day)) {
        dayElement.classList.add("to-be-added");
      }

      if (
        selectedDate &&
        selectedDate.day === day &&
        selectedDate.month === currentMonth &&
        selectedDate.year === currentYear
      ) {
        dayElement.classList.add("selected");
      }

      dayElement.addEventListener("click", () => selectDate(day));
      calendar.appendChild(dayElement);
    }
  }

  function selectDate(day) {
    selectedDate = {
      day: day,
      month: currentMonth,
      year: currentYear,
    };
    updateCalendar();
  }

  availableSlotsInput.addEventListener("change", (e) => {
    const [year, month] = e.target.value.split("-");
    currentMonth = parseInt(month) - 1;
    currentYear = parseInt(year);
    selectedDate = null;
    updateCalendar();
  });

  prevMonthBtn.addEventListener("click", () => {
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    selectedDate = null;
    updateCalendar();
  });

  nextMonthBtn.addEventListener("click", () => {
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    selectedDate = null;
    updateCalendar();
  });

  updateCalendar();
});
