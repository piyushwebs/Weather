import { useState } from "react";
import countries from "i18n-iso-countries";
// Optionally, import language support:
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);

export default function MainPage() {
  const [weather, setWeather] = useState(null);
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  async function success(pos) {
    const crd = pos.coords;
    const lat = crd.latitude;
    const lon = crd.longitude;
    return getWeatherReport(lat, lon);
  }

  async function getWeatherReport(lat, lon) {
    const api_key = "246ec31602cb3c1bb1c79d17df8f6d9a";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
    )
      .then((response) => {
        return response.json(); // parse body into JSON
      })
      .then((data) => {
        console.log("Weather Data:", data); // actual weather info
        setWeather(data);
      })
      .catch((err) => console.error("Error:", err));
  }

  function error(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }
  function handleUpload() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      console.log("Location is not supported by the browser");
    }
  }
  return (
    <>
      <div>
        {weather && (
          <div>
            <h1>{countries.getName(weather.sys.country, "en")}</h1>
            <h2>{weather.name}</h2>
            <p>Latitude :- {weather.coord.lat}</p>
            <p>Longitute :- {weather.coord.lon}</p>
            <p>Weather :- {weather.weather?.[0]?.main || "Loading ... "}</p>
          </div>
        )}
      </div>
      <div>
        <p>Get Weather Report According To My Loaction :- </p>
        <button onClick={handleUpload}> Get weather Report </button>
      </div>
    </>
  );
}
