const temp = document.getElementById("temp");
        const place = document.getElementById("city");
        const desc = document.getElementById("desc");
        const feels_like = document.getElementById("feels_like");
        const humidity = document.getElementById("humidity");
        const speed = document.getElementById("speed");
        const input = document.querySelector("input");
        const search = document.getElementById("search");
        const image = document.getElementById("icon");
        const weatherbody = document.querySelector('.weatherbody');
        const error = document.querySelector('.error');
        document.getElementById("icon").className="fa-solid fa-cloud";
        
        // Open-Meteo needs no API key. WMO weather codes are grouped into the
        // same conditions the icons below were written for.
        const conditions = [
            [[0], 'Clear', 'clear sky'],
            [[1, 2, 3], 'Clouds', 'cloudy'],
            [[45, 48], 'Mist', 'fog'],
            [[51, 53, 55, 56, 57], 'Drizzle', 'drizzle'],
            [[61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99], 'Rain', 'rain'],
            [[71, 73, 75, 77, 85, 86], 'Snow', 'snow'],
        ];
        const descriptions = {1: 'mainly clear', 2: 'partly cloudy', 3: 'overcast', 95: 'thunderstorm', 96: 'thunderstorm with hail', 99: 'thunderstorm with hail'};

        function showError(){
            weatherbody.style.display = "none";
            error.style.display="flex";
        }

        async function getWeather(city){
            const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`).then(response=>response.json());
            if(!geo.results || geo.results.length===0){
                showError();
                return;
            }
            const {latitude, longitude, name} = geo.results[0];
            const data = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code`).then(response=>response.json());
            if(!data.current){
                showError();
                return;
            }
            const current = data.current;
            const [, main, label] = conditions.find(([codes])=>codes.includes(current.weather_code)) || [null, 'Clouds', 'cloudy'];
            error.style.display="none";
            weatherbody.style.display = "block";
            temp.innerText=Math.round(current.temperature_2m)+"°C";
            place.innerText = name;
            desc.innerText=descriptions[current.weather_code] || label;
            feels_like.innerText="Feels like "+Math.round(current.apparent_temperature)+"°C";
            humidity.innerText=current.relative_humidity_2m+"%";
            speed.innerText=current.wind_speed_10m+" km/h";
            
            
            document.getElementById("icon").className="fa-solid fa-cloud";
            switch(main){
                case 'Clouds':
                    image.className="fa-solid fa-cloud";
                    break;
                case 'Clear':
                    image.className="fa-solid fa-sun";
                        break;
                case 'Rain':
                    image.className="fa-solid fa-cloud-showers-heavy";
                        break;
                case 'Mist':
                    image.className="fa-solid fa-smog";
                        break;
                case 'Snow':
                    image.className="fa-regular fa-snowflake";
                        break;
                case 'Drizzle':
                    image.className="fa-solid fa-cloud-sun-rain";
                        break;
            }
        }

        search.addEventListener("click", ()=>{
            getWeather(input.value);
        });
