const locationInput = document.getElementById('location-input');
const locationSearchBtn = document.getElementById('location-btn');
const locationForm = document.getElementById('location-form');

const scaleTypeCheckbox = document.querySelector('.scale-checkbox');

const weatherLocation = document.getElementById('location');
const weatherDate = document.getElementById('date');
const weatherTemp = document.getElementById('temp');
const weatherCondition = document.getElementById('condition');
const weatherConditionIcon = document.getElementById('condition-icon');

async function fetchWeather(location = 'Damascus') {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=f76538fc0ebc49bbaed160752232705&q=${location}`,
      {
        mode: 'cors',
      }
    );
    if (!response.ok) {
      throw new Error('Location not found');
    }
    const data = await response.json();
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
  try {
    const location = locationInput.value;
    locationInput.value = '';
    const weatherData = await fetchWeather(location);
    const filteredData = filterWeatherData(weatherData);
    localStorage.setItem('weatherData', JSON.stringify(filteredData));
    localStorage.setItem('location', location);
    updateWeatherOnDom(filteredData);
  } catch (error) {
    console.error(`Ops! an error occurred during fetch: ${error}`);
  }
}

async function handleDomContentLoaded() {
  const location = localStorage.getItem('location');
  const response = location
    ? await fetchWeather(location)
    : await fetchWeather();
  const filteredData = filterWeatherData(response);
  localStorage.setItem('weatherData', JSON.stringify(filteredData));
  updateWeatherOnDom(filteredData);
}

function updateWeatherOnDom(
  data = JSON.parse(localStorage.getItem('weatherData'))
) {
  const scaleType = scaleTypeCheckbox.checked ? 'f' : 'c';

  weatherLocation.textContent = `${data.location.country} / ${data.location.name}`;
  // weatherDate.textContent
  if (scaleType === 'c')
    weatherTemp.innerHTML = data.current.temp_c + '&#8451;';
  if (scaleType === 'f')
    weatherTemp.innerHTML = data.current.temp_f + '&#8457;';

  weatherCondition.textContent = data.current.condition.text;
  weatherConditionIcon.src = data.current.condition.icon;
}

locationSearchBtn.addEventListener('click', handleSearchBtnClick);
scaleTypeCheckbox.addEventListener('change', () => updateWeatherOnDom());
document.addEventListener('DOMContentLoaded', handleDomContentLoaded);

// submit form cause reload the page and interrupt fetching
locationForm.addEventListener('submit', (e) => {
  e.preventDefault();
});
