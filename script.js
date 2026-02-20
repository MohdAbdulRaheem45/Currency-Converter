// Stable API
const BASE_URL = "https://open.er-api.com/v6/latest";

// Select elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selection
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }

    select.append(newOption);
  }

  // Update flag when dropdown changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate(); // auto update rate on change
  });
}

// Exchange rate function
const updateExchangeRate = async () => {
  try {
    let amount = document.querySelector(".amount input");
    let amtVal = amount.value;

    if (amtVal === "" || amtVal < 1) {
      amtVal = 1;
      amount.value = "1";
    }

    // Fetch from API
    const URL = `${BASE_URL}/${fromCurr.value}`;
    let response = await fetch(URL);
    let data = await response.json();

    if (data.result !== "success") {
      throw new Error("API failed");
    }

    let rate = data.rates[toCurr.value];

    let finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate!";
    console.error("Error:", error);
  }
};

// Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");

  img.src = newSrc;
};

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Load default rate on page load
window.addEventListener("load", () => {
  updateExchangeRate();
});