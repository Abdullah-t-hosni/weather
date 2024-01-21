/** @format */

let apiKey = "b9fcb4d2f8354d3cbd9110627241201";
let cardsContainer = document.querySelector(".forecast-cards");
let searchBox = document.querySelector("#searchBox");
let cityData = document.querySelector(".city-items");
let allBars = document.querySelectorAll(".clock");
let clearBtn = document.querySelector("#clearBtn");
let locationName = document.querySelector(".location .location");

function displayWeather(result) {
  let forecast = result.forecast.forecastday;
  let cartona = "";
  locationName.innerHTML = result.location.name;
  for (let i = 0; i < forecast.length; i++) {
    let date = new Date(forecast[i].date);
    let weekDay = date.toLocaleDateString("en-us", { weekday: "long" });
    cartona += `   
       <div class="card ${i == 0 ? "active" : ""}" data-index=${i} >
        <div class="card-header">
          <div class="day">${weekDay}</div>
        </div>
        <div class="card-body">
          <img src="./images/conditions/${forecast[i].day.condition.text}.svg"/>
          <div class="degree">${
            forecast[i].hour[date.getHours()].temp_c
          }°C</div>
        </div>
        <div class="card-data">
          <ul class="left-column">
            <li>Real Feel: <span class="real-feel">${
              forecast[0].hour[date.getHours()].feelslike_c
            }°C</span></li>
            <li>Wind: <span class="wind">${
              forecast[i].hour[date.getHours()].wind_kph
            } K/h</span></li>
            <li>Pressure: <span class="pressure">${
              forecast[i].hour[date.getHours()].pressure_mb
            } Mb</span></li>
            <li>Humidity: <span class="humidity">${
              forecast[i].hour[date.getHours()].humidity
            } %</span></li>
          </ul>
          <ul class="right-column">
            <li>Sunrise: <span class="sunrise"> ${
              forecast[i].astro.sunrise
            }  </span></li>
            <li>Sunset: <span class="sunset">${
              forecast[i].astro.sunset
            }</span></li>
          </ul>
        </div>
      </div>
`;
  }
  cardsContainer.innerHTML = cartona;
  let allCards = document.querySelectorAll(".card");
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].addEventListener("click", function (e) {
      let activeCard = document.querySelector(".card.active");
      activeCard.classList.remove("active");
      e.currentTarget.classList.add("active");
      rain(forecast[e.currentTarget.dataset.index].hour);
    });
  }
  // displayImg(result.location.name, result.location.country);
}

async function getWeather(country) {
  let response = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${country}&days=5&aqi=no&alerts=no`
  );
  let result = await response.json();
  displayWeather(result);
  displayImg(
    result.location.name,
    result.location.country.toUpperCase(
      result.location.country.split("").map((el) => el.toUpperCase())
    )
  );
  displayWeather(result);
}

function rain(weather) {
  for (let i = 0; i < allBars.length; i++) {
    let height = weather[allBars[i].getAttribute("data-clock")].chance_of_rain;
    allBars[i].querySelector(".percent").style.height = `${height}%`;
  }
}

navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let currentPosition = `${latitude},${longitude}`;
  getWeather(currentPosition);
}

function error() {
  getWeather("cairo");
}

searchBox.addEventListener("keyup", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather(searchBox.value);
  }
});

async function getImg(city) {
  let response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`
  );
  let result = await response.json();
  let randomIndex = Math.floor(Math.random() * result.results.length);
  let cityData = result.results[randomIndex];
  return cityData;
}

async function displayImg(city, country) {
  let cityInfo = await getImg(city);

  let item = `<div class="item">
<div class="city-image">
  <img src="${cityInfo.urls.regular}" alt="Image for ${city} city" />
</div>
<div class="city-name"><span class="city-name">${city}</span>, ${country}</div>
</div>`;

  cityData.innerHTML += item;
}



function clearRecentCities() {
  cityData.innerHTML = "";
}

clearBtn.addEventListener("click", clearRecentCities);
