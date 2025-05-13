import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

//open weather map API Key
const API_KEY = "4c7dfcc2681ae88a2b1d086a8d05bcfa";

function App() {
  //state for input city
  const [city, setCity] = useState("");

  //state to store fetched weather data
  const [weather, setWeather] = useState(null);

  //state to show loading animtion
  const [loading, setLoading] = useState(false); 

  //state to show error message
  const [error, setError] = useState("");

  //state to toggle dark mode
  const [darkMode, setDarkMode] = useState(false);

  //state to store recent search history
  const [history, setHistory] = useState(() => {
    const stored = localStorage.getItem("weatherHistory");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(history));
  }, [history]);

  const fetchWeather = async (selectedCity = city) => {
    if (!selectedCity) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${selectedCity}&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
      setCity("");
      updateHistory(selectedCity);
    } catch (err) {
      setError("City not found");
    }
    setLoading(false);
  };

  const updateHistory = (newCity) => {
    setHistory((prev) => {
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== newCity.toLowerCase()
      );
      return [newCity, ...filtered].slice(0, 5);
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold">Weather Dashboard</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-yellow-400 dark:bg-blue-800 px-4 py-2 rounded shadow hover:scale-105 transition-transform"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        <form onSubmit={handleSearch} className="mb-6 flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border px-4 py-2 rounded text-black w-full sm:w-auto"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </form>

        {history.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Recent Searches:</h3>
            <div className="flex flex-wrap gap-2">
              {history.map((cityName, idx) => (
                <button
                  key={idx}
                  onClick={() => fetchWeather(cityName)}
                  className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  {cityName}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-4">No recent searches yet.</p>
        )}

        {loading && (
          <div className="flex justify-center items-center my-4">
            <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-red-500 text-lg">{error}</p>}

        {weather && (
          <div className="bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-4 max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-2">{weather.name}</h2>
            <p className="capitalize text-lg">{weather.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="weather icon"
              className="mx-auto my-2"
            />
            <p className="text-xl font-semibold">{weather.main.temp}°C</p>
            <p>Humidity: {weather.main.humidity}%</p>
            <p>Wind Speed: {weather.wind.speed} km/h</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

