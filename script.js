document.addEventListener("DOMContentLoaded", () => {
    const apiKey = `80d0fbd97490a79df0097c5be555ef88`;
    let map;
    let marker;
  
    // Initially hide the weather info and map
    document.querySelector('.weather').style.display = 'none';
    document.getElementById('map').style.display = 'none';
  
    document.getElementById('searchButton').addEventListener('click', () => {
      const city = document.getElementById('cityInput').value;
      if (city) {
        fetchWeatherData(city);
      }
    });
  
    function fetchWeatherData(city) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
          if (data.cod === 200) {
            updateWeatherInfo(data);
            const { lat, lon } = data.coord;
            showMap(lat, lon, data.name);
            document.querySelector('.weather').style.display = 'block'; // Show weather info
            document.getElementById('map').style.height = '400px'; // Set map height to make it visible
          } else {
            showError();
          }
        })
        .catch(error => {
          console.error('Error fetching weather data:', error);
          showError();
        });
    }
  
    function updateWeatherInfo(data) {
      document.querySelector('.weatherIcon').src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
      document.querySelector('.temp').textContent = `${data.main.temp}°C`;
      document.querySelector('.city').textContent = data.name;
      document.querySelector('.humidity').textContent = `${data.main.humidity}%`;
      document.querySelector('.wind').textContent = `${data.wind.speed} km/h`;
      document.querySelector('.sunrise').textContent = `Sunrise: ${new Date(data.sys.sunrise * 1000).toLocaleTimeString()}`;
      document.querySelector('.sunset').textContent = `Sunset: ${new Date(data.sys.sunset * 1000).toLocaleTimeString()}`;
    }
  
    function showMap(lat, lon, cityName) {
      // Ensure the map container is visible and properly sized
      const mapContainer = document.getElementById('map');
      mapContainer.style.display = 'block';
  
      if (!map) {
        map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        marker = L.marker([lat, lon]).addTo(map)
          .bindPopup(cityName)
          .openPopup();
      } else {
        map.invalidateSize(); // Ensure the map resizes properly
        map.setView([lat, lon], 13);
        if (marker) {
          marker.setLatLng([lat, lon]).setPopupContent(cityName).openPopup();
        } else {
          marker = L.marker([lat, lon]).addTo(map)
            .bindPopup(cityName)
            .openPopup();
        }
      }
    }
  
    function showError() {
      document.querySelector('.error').style.display = 'block';
      setTimeout(() => {
        document.querySelector('.error').style.display = 'none';
      }, 3000);
    }
  });
  
