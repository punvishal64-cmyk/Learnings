const input = document.getElementById("cityInput");
const button = document.getElementById("searchBtn");
const result = document.getElementById("weatherResult");

const API_KEY = "002c11ae8f0057818c0e7ecb26060751";

button.addEventListener("click", async () => {
  const city = input.value.trim();

  if (!city) {
    result.innerHTML = "";
    return;
  }

  // ⏳ Show loading
  result.innerHTML = "Loading...";

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`;

  try {
    const response = await fetch(url);

    // ❗ Check if city is valid
    if (!response.ok) {
      throw new Error("City not found");
    }

    const data = await response.json();

    const temp = data.main.temp;
    const weather = data.weather[0].description;

    result.innerHTML = `
      <p>📍 City: ${city}</p>
      <p>🌡️ Temperature: ${temp}°C</p>
      <p>🌥️ Condition: ${weather}</p>
    `;
  } catch (error) {
    result.innerHTML = "⚠️ " + error.message;
  }
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    button.click();
  }
});