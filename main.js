const form = document.getElementById("form");

const dayInput = document.getElementById("day-input");
const monthInput = document.getElementById("month-input");
const yearInput = document.getElementById("year-input");

const dayOutput = document.getElementById("day-output");
const monthOutput = document.getElementById("month-output");
const yearOutput = document.getElementById("year-output");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  removeError(dayInput);
  removeError(monthInput);
  removeError(yearInput);

  const dayIsValid = validateDay();
  const monthIsValid = validateMonth();
  const yearIsValid = validateYear();

  if (dayIsValid && monthIsValid && yearIsValid) {
    if (validateDate()) {
      const currentDate = dayjs();
      const pastDate = dayjs(
        new Date(yearInput.value, monthInput.value - 1, dayInput.value)
      );

      dayOutput.textContent = Math.abs(
        currentDate.toObject().date - pastDate.toObject().date
      );
      monthOutput.textContent = currentDate.diff(pastDate, "months") % 12;
      yearOutput.textContent = currentDate.diff(pastDate, "years");
    } else {
      dayOutput.textContent = "--";
      monthOutput.textContent = "--";
      yearOutput.textContent = "--";
    }
  }
});

// Validate form inputs

function validateDay() {
  try {
    validateNotEmpty(dayInput);
    validateIsInt(dayInput);

    if (dayInput.value < 1 || dayInput.value > 31) {
      throw new Error("Must be a valid day");
    }

    return true;
  } catch (err) {
    displayError(dayInput, err.message);
  }
}

function validateMonth() {
  try {
    validateNotEmpty(monthInput);
    validateIsInt(monthInput);

    if (monthInput.value < 1 || monthInput.value > 12) {
      throw new Error("Must be a valid month");
    }

    return true;
  } catch (err) {
    displayError(monthInput, err.message);
  }
}

function validateYear() {
  try {
    validateNotEmpty(yearInput);
    validateIsInt(yearInput);

    if (yearInput.value < 0) {
      throw new Error("Must be a valid year");
    }

    return true;
  } catch (err) {
    displayError(yearInput, err.message);
  }
}

function validateDate() {
  const day = dayInput.value;
  const month = monthInput.value;
  const year = yearInput.value;
  const date = `${year.padStart(4, "0")}-${month.padStart(
    2,
    "0"
  )}-${day.padStart(2, "0")}`;

  let dateIsValid = dayjs(date, "YYYY-MM-DD", true).isValid();

  if (!dateIsValid) {
    displayError(dayInput, "Must be a valid date");
    displayError(monthInput);
    displayError(yearInput);
  } else if (dayjs(date).unix() > dayjs().unix()) {
    displayError(dayInput, "Must be in the past");
    displayError(monthInput);
    displayError(yearInput);

    dateIsValid = false;
  }

  return dateIsValid;
}

// Validation tests

function validateNotEmpty(el) {
  if (el.value === "") {
    throw new Error("This field is required");
  }
}

function validateIsInt(el) {
  if (!Number.isInteger(Number(el.value))) {
    throw new Error(`Must be a valid ${el.name}`);
  }
}

// Display errors to user

function displayError(el, message) {
  el.parentElement.classList.add("error");
  message && (el.nextElementSibling.textContent = message);
}

function removeError(el) {
  el.parentElement.classList.remove("error");
  el.nextElementSibling.textContent = "";
}
