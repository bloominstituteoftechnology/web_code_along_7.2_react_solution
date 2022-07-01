import React, { useState, useEffect } from "react";
import axios from "axios";

import WeatherDisplay from "./WeatherDisplay";
import Error from "./Error";

function App() {
  const [openWeather, setOpenWeather] = useState(null);
  const [userData, setUserData] = useState({ name: "Casey Harding", age: 74, bestInstructor: true });
  const [error, setError] = useState(null);
  const [tempType, setTempType] = useState("f");

  useEffect(() => {
    const func = (pos) => {
      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=4ade206763c0f24a2dcbe10b1d355375`)
        .then(res => {
          const normalizedTemp = ((9/5) * (res.data.main.temp - 273) + 32).toFixed(2);
          const weather = {
            icon: res.data.weather[0].icon,
            cityName: res.data.name,
            cityTemp: normalizedTemp
          }
          setOpenWeather(weather);
        }).catch(err => setError("Check back soon, our engineers are working around the clock to restore service!"))
      }
      navigator.geolocation.getCurrentPosition(func)
  }, [])
  
  const convertC = () => {
    const currentTemp = openWeather.cityTemp;
    const convertTemp = (currentTemp - 32) * (5/9);
    setOpenWeather({ ...openWeather, cityTemp: convertTemp.toFixed(2) });
    setTempType("c");
  }

  const convertF = () => {
    const currentTemp = openWeather.cityTemp;
    const convertTemp = currentTemp * 1.8 + 32;
    setOpenWeather({ ...openWeather, cityTemp: convertTemp.toFixed(2) });
    setTempType("f")
  }

  return (
    <div>
      { error ? <Error error={error} /> : 
        openWeather ? <WeatherDisplay openWeather={openWeather} userData={userData} /> : <p>Weather data coming soon!</p>
      }
      <button onClick={tempType === "f" ? convertC : convertF }>Convert to: {tempType === "f" ? "Celsius" : "Farhenheit"}</button>    </div>
    )
}

export default App;
