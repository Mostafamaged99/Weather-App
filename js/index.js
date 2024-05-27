//! ===== HTML ELEMENTS ===== !\\
const weatherForcast = document.querySelector(".weatherForcast");
const weatherLocation = document.querySelector(".location");
const searchBar = document.getElementById("searchBar");
const progress = document.querySelectorAll(".progress");
const cityCard = document.querySelector(".city-card");
const wrong = document.querySelector(".wrong");
const btnOk = document.querySelector(".btnOk");
const clearBtn = document.querySelector(".clearBtn");
//! ===== VARIABLES ===== !\\
let apiKey = "90a9e7a616e1493c920155644242505";
let baseUrl = "https://api.weatherapi.com/v1/forecast.json";
let currentLocation = "cairo";
let recentCities = JSON.parse(localStorage.getItem("cities")) || [];
//! ===== FUNCTIONS ===== !\\

async function getWeather(location) {
  const linkApi = `${baseUrl}?key=${apiKey}&q=${location}&days=3`;
  const response = await fetch(linkApi);
  console.log(linkApi);
  const data = await response.json();
  if (response.status !== 200) return;
  displayWeather(data);
}

function success(position) {
  currentLocation = `${position.coords.longitude},${position.coords.latitude}`;
  getWeather(currentLocation);
}

function displayWeather(data) {
  const days = data.forecast.forecastday;

  const today = days[0];

  const nextDay = days[1];

  const afterNextDay = days[2];

  const todayDate = new Date(today.date);

  const nextDayDate = new Date(nextDay.date);

  const afterNextDayDate = new Date(afterNextDay.date);

  const now = new Date();

  for (let par of progress) {
    let width = today.hour[par.dataset.clock].chance_of_rain;
    let clock = par.dataset.clock;
    par.querySelector(".progress-bar").style.width = `${width}%`;
  }

  const weatherBox = `
  <div class="col-md-6 mb-2">
      <div class="card rounded-4 ">
          <div class="card-header d-flex justify-content-between align-items-center  rounded-4 h4 ">
              <div class="day"><p>${todayDate.toLocaleDateString("en-us", {
                weekday: "long",
              })}</p></div>
              <div class="time"><p>${now.getHours()}:${now.getMinutes()}</p></div>
          </div>
          <div class="card-body d-flex justify-content-between align-items-center">
              <div class="degree">
                  <h3 class="fs-80">${today.hour[now.getHours()].temp_c}°C</h3>
              </div>
              <img src="./images/conditions/${
                today.day.condition.text
              }.svg" alt="${today.day.condition.text}" class="w-25">
          </div>
          <div class="card-data ">
              <div class="list d-flex justify-content-between px-3 ">
                  <ul class="left-list ">
                      <li><span>Real Feel:</span> ${
                        today.hour[now.getHours()].feelslike_c
                      } °C</li>
                      <li><span>Wind:</span> ${
                        today.hour[now.getHours()].wind_kph
                      } K/h</li>
                      <li><span>Pressure:</span> ${
                        today.hour[now.getHours()].pressure_mb
                      } Mb</li>
                  </ul>
                  <ul class="right-list ">
                      <li><span>Humidity:</span> ${
                        today.hour[now.getHours()].humidity
                      } %</li>
                      <li><span>Sunset:</span> ${today.astro.sunset}</li>
                      <li><span>Sunrise:</span> ${today.astro.sunrise}</li>
                  </ul>
              </div>
          </div>
      </div>
  </div>
  
  <div class="col-md-3 mb-2">
      <div class="second-card rounded-4 mx-4  d-flex flex-column text-center justify-content-center  " >
          <div class="header h4 m-2">
              <div class="day border-bottom border-white m-2 "><p class="m-2">${nextDayDate.toLocaleDateString(
                "en-us",
                { weekday: "long" }
              )}</p></div>
          </div>
          <div class="card-body ">
          <img src="./images/conditions/${
            nextDay.day.condition.text
          }.svg" alt="${
    nextDay.day.condition.text
  }" class="w-100 text-center d-inline">
              <div class="degree"><h3 class="fs-3">${
                nextDay.hour[now.getHours()].temp_c
              }</h3></div>
          </div>
      </div>
  </div>
  
  <div class="col-md-3 mb-2">
      <div class="second-card rounded-4 mx-4  d-flex flex-column text-center justify-content-center " >
          <div class="header h4 m-2">
              <div class="day border-bottom border-white m-2 "><p class="m-2">${afterNextDayDate.toLocaleDateString(
                "en-us",
                { weekday: "long" }
              )}</p></div>
          </div>
          <div class="card-body ">
          <img src="./images/conditions/${
            afterNextDay.day.condition.text
          }.svg" alt="${
    afterNextDay.day.condition.text
  }"  class="w-100 text-center d-inline">
              <div class="degree"><h3 class="fs-3">${
                afterNextDay.hour[now.getHours()].temp_c
              }</h3></div>
          </div>
      </div>
  </div>`;
  weatherForcast.innerHTML = weatherBox;
  displayLocation(data);
}

function displayLocation(data) {
  const locationBox = `
    <i class="fa-solid fa-location-dot"></i>
    <p class=" d-flex gap-2 align-items-center">${data.location.name},<span class="fw-bolder"> ${data.location.country}</span></p>
`;
  weatherLocation.innerHTML = locationBox;
  let exist = recentCities.find((city) => {
    return city.city == data.location.name;
  });
  if (exist) return;
  displayCityImg(`${data.location.name}`, `${data.location.country}`);
  recentCities.push({
    city: data.location.name,
    country: data.location.country,
  });
  localStorage.setItem("cities", JSON.stringify(recentCities));
}

async function getCityImg(city) {
  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${city}&client_id=maVgNo3IKVd7Pw7-_q4fywxtQCACntlNXKBBsFdrBzI&per_page=5&orientation=landscape`
  );
  const data = await response.json();
  const results = data.results;
  return results;
}
async function displayCityImg(city, country) {
  const imgArr = await getCityImg(city);
  if (imgArr.length !== 0) {
    const random = Math.trunc(Math.random() * imgArr.length);
    let imgsBox = `
    <div class="col-md-2 my-3 ">
        <div class="city-img overflow-hidden rounded-4">
            <img src='${imgArr[random].urls.regular}' alt="${city} city" class="w-100 rounded-4">
        </div> 
        <p class=" my-2 text-center">${city},<span class="fw-bolder"> ${country}</span></p>
    </div>
    `;
    cityCard.innerHTML += imgsBox;
    console.log(imgsBox);
  }
}

//! ===== EVENTS ===== !\\
window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(success);
  for (let i = 0; i < recentCities.length; i++) {
    displayCityImg(recentCities[i].city, recentCities[i].country);
  }
});

searchBar.addEventListener("change", function () {
  getWeather(this.value);
  searchBar.value = "";
});
window.addEventListener("keyup", function (e) {
  if (e.code == "Enter") {
    getWeather(searchBar.value);
    searchBar.value = "";
  }
});
btnOk.addEventListener("click", () => {
  wrong.classList.replace("d-flex", "d-none");
});
clearBtn.addEventListener("click", () => {
   localStorage.removeItem("cities");
    recentCities = [];
    cityCard.innerHTML = ''
//   for (let i = 0; i < recentCities.length; i++) {
//     displayCityImg(recentCities[i].city, recentCities[i].country);
//   }
});
