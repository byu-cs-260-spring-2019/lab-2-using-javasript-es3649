
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
    return hours + ":" + minutes + " " + apm;
}

async function getWeather() {
    console.log("Getting weather");

    const value = document.getElementById("weatherInput").value;
    if (value === "") {
        console.log("no value");
        return;
    }

    console.log("Value is: " + value);
    
    const url = "http://api.openweathermap.org/data/2.5/weather?q=" + value + ",US&units=imperial" + "&APPID=9fb681a7c8aeac29e2793482ec531898";
    console.log("Fetching" + url);

    try {
        const response = await fetch(url);
        const json = await response.json();

        console.log(json);

        // set attributes
        document.getElementById("location-name").innerHTML = json.name;
        document.getElementById("lat").innerHTML = json.coord.lat.toFixed(2);
        document.getElementById("lon").innerHTML = json.coord.lon.toFixed(2);


        document.getElementById("degrees-current").innerHTML = json.main.temp.toFixed(1);
        document.getElementById("degrees-max").innerHTML = json.main.temp_max.toFixed(1);
        document.getElementById("degrees-min").innerHTML = json.main.temp_min.toFixed(1);

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
        weatherImage.src="http://openweathermap.org/img/w/"+ json.weather[0].icon +".png";
        weatherImage.alt="weatherIcon: " + json.weather[0].icon;
        weatherImage.title=json.weather[0].description;
        
    } catch (err) {
        console.log(err);
    }
        
  };