import { useEffect, useState } from "react";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [temp, setTemp] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [weatherType, setWeatherType] = useState("");
  const [forecast, setForecast] = useState({});
  const [forecastDays, setForecastDays] = useState("");

  const fetchForecast = async () => {
    try {
      const forecastEndpoint = `https://api.weatherapi.com/v1/forecast.json?key=e1485d1fcb9e4ffd8b4205345241104&q=${city}&days=${forecastDays}`;
      const response = await fetch(forecastEndpoint);

      if (!response.ok) {
        throw new Error("Error occured while fetching forecast.");
      }

      const jsonData = await response.json();

      setForecast(jsonData.forecast);
      setIsLoading(false);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);

    try {
      const currentEndpoint = `https://api.weatherapi.com/v1/current.json?key=e1485d1fcb9e4ffd8b4205345241104&q=${city}`;
      const response = await fetch(currentEndpoint);

      if (!response.ok) {
        throw new Error("Error occured while fetching data.");
      }

      const jsonData = await response.json();

      setTemp(jsonData.current[weatherType]);
      setLocation(jsonData.location.name);
      fetchForecast();
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    if (!city.trim()) {
      setError("Please enter a city.");
      return;
    }

    fetchData();
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleWeatherTypeChange = (e) => {
    const selectedWeatherType = e.target.value.toLowerCase();
    setWeatherType(`temp_${selectedWeatherType}`);
  };

  const handleDayForecastChange = (e) => {
    setForecastDays(e.target.value);
  };

  useEffect(() => {
    if (!forecastDays) return;
    fetchData();
  }, [forecastDays, weatherType]);

  const getForecast = () => {
    return Object.values(forecast)?.map((forecastObj) => {
      const elements = [];

      for (let day in forecastObj) {
        let dayForecast = forecastObj[day];

        elements.push(
          <div style={{ paddingRight: "2rem" }}>
            <div>Date: {dayForecast.date}</div>
            <div>Min: {dayForecast["day"][`min${weatherType}`]}</div>
            <div>Max: {dayForecast["day"][`max${weatherType}`]}</div>
            <br />
          </div>
        );
      }
      return elements;
    });
  };

  return (
    <div
      style={{
        padding: "10rem",
        width: "100%",
      }}
    >
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error.message}</div>
        ) : (
          <>
            <form>
              <label htmlFor="city">City:</label>
              <input type="text" placeholder={city} onChange={handleCityChange} />

              <div style={{ padding: "1rem 0" }}>
                <label>
                  <input
                    type="radio"
                    value="C"
                    checked={weatherType === "temp_c"}
                    onChange={handleWeatherTypeChange}
                  />
                  C
                </label>

                <label>
                  <input
                    type="radio"
                    value="F"
                    checked={weatherType === "temp_f"}
                    onChange={handleWeatherTypeChange}
                  />
                  F
                </label>
              </div>

              <div style={{ padding: "1rem 0" }}>
                <label>
                  <input
                    type="radio"
                    value="3"
                    checked={forecastDays === "3"}
                    onChange={handleDayForecastChange}
                  />
                  3
                </label>

                <label>
                  <input
                    type="radio"
                    value="4"
                    checked={forecastDays === "4"}
                    onChange={handleDayForecastChange}
                  />
                  4
                </label>

                <label>
                  <input
                    type="radio"
                    value="5"
                    checked={forecastDays === "5"}
                    onChange={handleDayForecastChange}
                  />
                  5
                </label>
              </div>

              <button type="submit" onClick={handleSubmit}>
                Submit
              </button>
            </form>

            <h1>
              {temp} {weatherType.charAt(weatherType.length - 1).toUpperCase()}
            </h1>
            <h2>Current Temperature in {location}</h2>
            <h2>{forecastDays} Day Forecast</h2>
            <div style={{ display: "flex" }}>{getForecast()}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
