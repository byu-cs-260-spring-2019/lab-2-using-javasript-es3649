
/**
 * takes an integer as a number of degrees and converts it to 
 * one of 16 cardinal directions based on a table I found online
 * 
 * @param {int} degrees 
 */
function degreesToDirection(degrees) {
    if (degrees < 11.25) {
        return "N";
    } else if (degrees < 33.75) {
        return "NNE";
    } else if (degrees < 56.25) {
        return "NE";
    } else if (degrees < 78.75) {
        return "ENE";
    } else if (degrees < 101.25) {
        return "E";
    } else if (degrees < 123.75) {
        return "ESE";
    } else if (degrees < 146.25) {
        return "SE";
    } else if (degrees < 168.75) {
        return "SSE";
    } else if (degrees < 191.25) {
        return "S";
    } else if (degrees < 213.75) {
        return "SSW";
    } else if (degrees < 236.25) {
        return "SW";
    } else if (degrees < 258.75) {
        return "WSW";
    } else if (degrees < 281.25) {
        return "W";
    } else if (degrees < 303.75) {
        return "WNW";
    } else if (degrees < 326.25) {
        return "NW";
    } else if (degrees < 348.75) {
        return "WWN";
    } else {
        return "N";
    }
}

/**
 * Takes a date object and formats it to:
 * HH:MM [ap]m
 * 
 * @param {Date} date 
 */
function dateToTime(date) {
    var minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var hours = date.getHours();
    var apm = "am";
    if (hours > 12) {
        hours = hours % 12;
        apm = "pm";
    }
    if (hours == 0) {
        hours = 12;
    }
    return hours + ":" + minutes + " " + apm;
}

/**
 * Converts a date to a day of the week (as a string)
 * @param {Date} date the date to convert to day-of-week
 */
function getDayOfWeek(date) {
    switch(date.getDay()) {
        case 0:
            return "Sun";
        case 1:
            return "Mon";
        case 2:
            return "Tues";
        case 3:
            return "Wed";
        case 4:
            return "Thurs";
        case 5:
            return "Fri";
        case 6:
            return "Sat";
        default:
            return "8 days a week!";
    }
}

function getWeather() {
    console.log("Getting weather");

    const value = document.getElementById("weatherInput").value;
    if (value === "") {
        console.log("no value");
        return;
    }

    console.log("Value is: " + value);

    getCurrentWeather(value);
    get5DayForecast(value);
}

async function getCurrentWeather(value) {
    
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=9fb681a7c8aeac29e2793482ec531898";
    console.log("Fetching" + url);

    try {
        const response = await fetch(url);
        const json = await response.json();

        console.log(json);

        document.getElementById("error-message").style.display = "none";
        document.getElementById("weather-display").style.display = "block";

        // set attributes
        document.getElementById("location-name").innerHTML = json.name;
        document.getElementById("lat").innerHTML = json.coord.lat.toFixed(2);
        document.getElementById("lon").innerHTML = json.coord.lon.toFixed(2);


        document.getElementById("degrees-current").innerHTML = json.main.temp.toFixed(1);
        document.getElementById("degrees-max").innerHTML = json.main.temp_max.toFixed(1);
        document.getElementById("degrees-min").innerHTML = json.main.temp_min.toFixed(1);

        // capitalize each word
        document.getElementById("weather-condition").innerHTML = 
            json.weather[0].description.replace(/\b\w/g, l => l.toUpperCase());
        // Thanks you, stack overflow, for this line ^~~~~~~~~~~~~~~~~~~~^

        document.getElementById("humidity").innerHTML = json.main.humidity;
        document.getElementById("pressure").innerHTML = json.main.pressure;
        document.getElementById("visibility").innerHTML = (json.visibility/1609).toFixed(1); // conversion from metres to miles
        document.getElementById("cloud-cover").innerHTML = json.clouds.all;

        var sunset = new Date(0);
        sunset.setUTCSeconds(json.sys.sunset);
        document.getElementById("sunset").innerHTML = dateToTime(sunset);
        var sunrise = new Date(0);
        sunrise.setUTCSeconds(json.sys.sunrise);
        document.getElementById("sunrise").innerHTML = dateToTime(sunrise);
        
        document.getElementById("wind").innerHTML = json.wind.speed.toFixed(1);
        document.getElementById("wind-direction").innerHTML = degreesToDirection(json.wind.degrees);

        var weatherImage = document.getElementById("weather-pic");
        weatherImage.src="https://openweathermap.org/img/w/"+ json.weather[0].icon +".png";
        weatherImage.alt="weatherIcon: " + json.weather[0].icon;
        weatherImage.title=json.weather[0].description;
        
    } catch (err) {
        console.log(err);
        
        // change UI to show failure
        document.getElementById("error-message").style.display = "block";
        document.getElementById("weather-display").style.display = "none";

        document.getElementById("error-location").innerHTML = value;
    }
        
};

/**
 * converts the given value to a 2 digit octal value
 * @param {int} i the value to convert
 */
function getElemID(i) {
    var idString = i.toString(8); // to base 8 string
    if (idString < 8) {
        idString = "0" + idString;
    }

    // console.log(i + "->" + idString);
    return idString;
}

async function get5DayForecast(value) {
    const url = "https://api.openweathermap.org/data/2.5/forecast?q=" + value + ",US&units=imperial" + "&APPID=9fb681a7c8aeac29e2793482ec531898";
    console.log("Fetching" + url);

    try {
        const response = await fetch(url);
        const json = await response.json();

        console.log(json);

        // document.getElementById("forecast-error").style.display = "none";
        document.getElementById("forecast-results").style.display = "block";

        for (var i = 0; i < json.cnt; i++) {
            const elem = getElemID(i);
            const weather = json.list[i];

            var date = new Date(0);
            date.setUTCSeconds(weather.dt);

            if (i%8 == 0) {
                // do this once per round

                document.getElementById("date" + Math.floor(i / 8)).innerHTML = getDayOfWeek(date);
            }

            document.getElementById("time" + elem).innerHTML = dateToTime(date);

            document.getElementById("temp-min" + elem).innerHTML = weather.main.temp_min.toFixed(1);
            document.getElementById("temp-max" + elem).innerHTML = weather.main.temp_max.toFixed(1);

            document.getElementById("wind" + elem).innerHTML = weather.wind.speed.toFixed(1);
            document.getElementById("wind-direction" + elem).innerHTML = degreesToDirection(weather.wind.deg);

            var img = document.getElementById("image" + elem);
            img.src = "https://openweathermap.org/img/w/"+ weather.weather[0].icon +".png";

            var data = weather.weather[0].description.replace(/\b\w/g, l => l.toUpperCase()) + "\n";

            if (weather.hasOwnProperty("rain")) {
                data += "Rain: " + weather.rain["3h"] + " in\n";
            }
            if (weather.hasOwnProperty("snow")) {
                data += "Snow: " + weather.snow["3h"] + " in\n";
            }

            data += "Cloud cover: " + weather.clouds.all + "%\n";
            data += "Humidity: " + weather.main.humidity + "%";

            img.title = data;

        }

    } catch (err) {
        console.log(err);

        // document.getElementById("forecast-error").style.display = "block";
        // document.getElementById("forecast-results").style.display = "none";

        // document.getElementById("forecast-error-location").innerHTML = value;
    }
}