let apiKey = "b9fcb4d2f8354d3cbd9110627241201";
let cardsContainer = document.querySelector(".forecast-cards");
let searchBox = document.querySelector("#searchBox");
let cityData = document.querySelector(".city-items");
let allBars = document.querySelectorAll(".clock");
let clearBtn = document.querySelector("#clearBtn");
let locationName = document.querySelector(".location .city-image");

// Function to handle theme switching
(function () {
  let e = document.documentElement,
    t = document.querySelector("#theme-switcher");
  function a(t) {
    e.setAttribute("data-theme", t), localStorage.setItem("theme", t);
  }
  let n, o;
  (n = localStorage.getItem("theme")),
    (o = window.matchMedia("(prefers-color-scheme: dark)").matches),
    a(n || (o ? "dark" : "light")),
      // Apply the stored or default theme

    t.addEventListener("click", function t() {
      a("dark" === e.getAttribute("data-theme") ? "light" : "dark");
    });
})();
function displayWeather(result) {
  const forecast = result.forecast.forecastday;
  let cartona = "";
  const currentHour = new Date().getHours();
  
  locationName.innerHTML = result.location.name;

  forecast.forEach((day, i) => {
    const date = new Date(day.date);
    const weekDay = date.toLocaleDateString("en-ar", { weekday: "long" });
    const isActive = i === 0 ? "active" : "";
    const hourData = day.hour[currentHour] || day.hour[0];

    cartona += `   
      <div class="card ${isActive}" data-index=${i}>
        <div class="card-header">
          <div class="day">${weekDay}</div>
        </div>
        <div class="card-body">
          <img src="./images/conditions/${day.day.condition.text}.svg" alt="${day.day.condition.text}"/>
                   <div class="degree">${hourData.temp_c}°C</div>
        </div>
        <div class="card-data">
          <ul class="left-column">
            <li>Real Feel: <span class="real-feel">${hourData.feelslike_c}°C</span></li>
            <li>Wind: <span class="wind">${hourData.wind_kph} K/h</span></li>
            <li>Pressure: <span class="pressure">${hourData.pressure_mb} Mb</span></li>
            <li>Humidity: <span class="humidity">${hourData.humidity} %</span></li>
          </ul>
          <ul class="right-column">
            <li>Sunrise: <span class="sunrise">${day.astro.sunrise}</span></li>
            <li>Sunset: <span class="sunset">${day.astro.sunset}</span></li>
            <li>Condition: <span class="condition">${day.day.condition.text}</span></li>
          </ul>
        </div>
      </div>
    `;
  });

  cardsContainer.innerHTML = cartona;

  attachCardEvents(forecast);
}


function attachCardEvents(forecast) {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const activeCard = document.querySelector(".card.active");
      if (activeCard) activeCard.classList.remove("active");
      e.currentTarget.classList.add("active");

      const cardIndex = e.currentTarget.dataset.index;
      rain(forecast[cardIndex].hour);
    });
  });
}


async function getWeather(country) {
  try {
    let response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=5&aqi=no&alerts=no`
    );
    let result = await response.json();
    
    displayWeather(result);
    
    let countryNameUpper = result.location.country.toUpperCase();
    
    displayImg(result.location.name, countryNameUpper);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}


function rain(weather) {
  for (let i = 0; i < allBars.length; i++) {
    let clock = allBars[i].getAttribute("data-clock");
    

    if (weather[clock] && weather[clock].chance_of_rain !== undefined) {
      let height = weather[clock].chance_of_rain; 
      console.log(`Clock: ${clock}, Chance of Rain: ${height}`); 
      allBars[i].querySelector(".percent").style.height = `${height}%`; 
    } else {
      console.warn(`No rain data available for clock: ${clock}`);
      allBars[i].querySelector(".percent").style.height = `60%`;
    }
  }
}




navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let currentPosition = `${latitude},${longitude}`;
  
  getWeather(currentPosition);
}


function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  alert("Unable to retrieve your location. Please enable location services.");
}



function error() {
  getWeather("Cairo");
}


searchBox.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather(searchBox.value);
    searchBox.value = "";
  }
});


async function getImg(city) {
  try {
    let response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`
    );
    let result = await response.json();
    let randomIndex = Math.floor(Math.random() * result.results.length);
    return result.results[randomIndex];
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
}


async function displayImg(city, country) {
  let cityInfo = await getImg(city);

  if (cityInfo) {
    let item = `
      <div class="item">
        <div class="city-image">
          <img src="${cityInfo.urls.regular}" alt="Image for ${city} city" />
        </div>
        <div class="city-name"><span class="city-name">${city}</span>, ${country}</div>
      </div>
    `;

    cityData.innerHTML += item;
  }
}

function clearRecentCities() {
  cityData.innerHTML = "";
}


clearBtn.addEventListener("click", clearRecentCities);