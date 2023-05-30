const locationInput = document.getElementById('location-input');
const locationSearchBtn = document.getElementById('location-btn');
const locationForm = document.getElementById('location-form');

async function fetchWeather(location = 'Damascus') {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=f76538fc0ebc49bbaed160752232705&q=${location}`
    );
    const data = await response.json();
    console.log('forecast weather:', data);
    return data;
  } catch (error) {
    alert(`Ops! an error interrupted the fetch: ${error}`);
  }
}

function filterWeatherData(data) {
  return {
    current: {
      condition: {
        text: data.current.condition.text,
        icon: data.current.condition.icon,
      },
      temp_c: data.current.temp_c,
      temp_f: data.current.temp_f,
    },
    location: {
      country: data.location.country,
      name: data.location.name,
    },
  };
}

async function handleSearchBtnClick() {
  const location = locationInput.value;
  locationInput.value = '';
  const weatherData = await fetchWeather(location);
  console.log(filterWeatherData(weatherData));
}

locationSearchBtn.addEventListener('click', handleSearchBtnClick);

// submit form cause reload the page and interrupt fetching
locationForm.addEventListener('submit', (e) => {
  e.preventDefault();
});
