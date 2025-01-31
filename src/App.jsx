import { useEffect, useState } from 'react'
import './App.css'

//Images
import searchIcon from "./assets/image/search.png"
import clearIcon from "./assets/image/clear.png"
import cloudIcon from "./assets/image/cloud.png"
import drizzleIcon from "./assets/image/drizzle.png"
import humidityIcon from "./assets/image/humidity.png"
import rainIcon from "./assets/image/rain.png"
import snowIcon from "./assets/image/snow.png"
import windIcon from "./assets/image/wind.png"

const WeatherDetails = ({ icon, temp, city, country, lat, log, humidity, wind }) => {
  return (
    <>
      <div className='image'>
        <img src={icon} alt="Image" />
      </div>
      <div className='temp'>{temp}*C</div>
      <div className='location'>{city}</div>
      <div className='country'>{country}</div>
      <div className='cord'>
        <div>
          <span className='lat'>latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className='log'>longitude</span>
          <span>{log}</span>
        </div>
      </div>
      <div className='data-container'>
        <div className='element'>
          <img src={humidityIcon} alt="Image" className='icon' />
          <div className='data'>
            <div className='humidity-percent'>{humidity}%</div>
            <div className='text'>Humidity</div>
          </div>
        </div>
        <div className='element'>
          <img src={windIcon} alt="Image" className='icon' />
          <div className='data'>
            <div className='wind-percent'>{wind} km/h</div>
            <div className='text'>Wind Speed</div>
          </div>
        </div>
      </div>
    </>
  )
}



function App() {
  let api_key = "657cd7bc0e11b87c18f71af97f9e9381"
  const [text, setText] = useState("Chennai")

  const [icon, setIcon] = useState(snowIcon)
  const [temp, setTemp] = useState(0)
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [lat, setLat] = useState(0)
  const [log, setLog] = useState(0)
  const [humidity, setHumidity] = useState(0)
  const [wind, setWind] = useState(0)

  const [cityNotFound, setCityNotFound] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": clearIcon,
    "02n": clearIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
    "14n": cloudIcon,
  }

  const search = async () => {
    setLoading(true)

    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`

    try {
      let res = await fetch(url)
      let data = await res.json()
      //  console.log(data)
      if (data.cod === "404") {
        console.error("City not found")
        setCityNotFound(true)
        setLoading(false)
        return;
      }

      setHumidity(data.main.humidity)
      setWind(data.wind.speed)
      setTemp(Math.floor(data.main.temp))
      setCity(data.name)
      setCountry(data.sys.country)
      setLat(data.coord.lat)
      setLog(data.coord.lon)
      const weatherIconCode = data.weather[0].icon
      setIcon(weatherIconMap[weatherIconCode] || clearIcon)
      setCityNotFound(false)

    }
    catch (error) {
      console.error("An error occurred:, error.message")
      setError("An error occurred while fetching weather data.")
    }
    finally {
      setLoading(false)
    }
  }


  const handleCity = (e) => {
    setText(e.target.value)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search()
    }
  }

  useEffect(function () {
    search()
  }, [])

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search City' onChange={handleCity}
            value={text} onKeyDown={handleKeyDown} />
          <div className='search-icon' onClick={() => search()}>
            <img src={searchIcon} alt='Search' />
          </div>
        </div>

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>}
        {cityNotFound && <div className='city-not-found'>City not found</div>}

        {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} humidity={humidity} wind={wind} />}



        <p className='copyright'>
          Designed by <span>Sarath Kumar</span>
        </p>
      </div>
    </>
  )
}

export default App
