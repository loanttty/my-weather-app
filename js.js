function createNewFavCity (chosenCity) {
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.textContent = chosenCity;
	a.className = 'dropdown-item';
	chosenCity = chosenCity.replace(" ","-"); /**cater for city name with 2 or more words */
	li.className = chosenCity;
	li.appendChild(a);
	return li;
}

function format_two_digits (n,b) {
	/**
	 * *b is indicator, 1: format for month, 0: format for minutes or hours or date
	 */
	return (n+b) < 10 ? '0' + (n+b) : (n+b);
}

function convertTime (dt,timezone) {
	var d = new Date (dt);
	var localTime = d.getTime();
	var localOffset = d.getTimezoneOffset() * 60000;
	var utc = localTime + localOffset;
	var timeConverted = utc + timezone * 1000; //convert a UNIX timestamp to JS
	return timeConverted;
}

function time (newDate) {
	let date = newDate.getDate();
	let hour = newDate.getHours();
	let minute = newDate.getMinutes();
	let year = newDate.getFullYear();
	
	let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	let day = days[newDate.getDay()];
	
	let months = ["Jan", "Feb",	"Mar", "Apr", "May", "Jun",	"Jul", "Aug", "Sep", "Oct",	"Nov", "Dec"];
	let month = months[newDate.getMonth()];
	let dateDisplayed = document.querySelector(".rowDate");
	dateDisplayed.innerHTML = `${day}, ${month} ${date} ${year} ${format_two_digits(hour,0)}:${format_two_digits(minute,0)}`;
	
	let dayFuture = document.querySelectorAll(".rowFutureDay");
	var a, i;
	for(i = 0; i<dayFuture.length; i++) {
		a=newDate.getDay()+1;
		if ((i+a) < 7) {
			dayFuture[i].innerHTML = `${days[(i+a)]}`;
		} else {
			dayFuture[i].innerHTML = `${days[(i+a-7)]}`;
		};
	};
	
	let dateFuture = document.querySelectorAll(".rowFutureDate");
	var i;
	for(i = 0; i<dateFuture.length; i++) {
		var dateTest = new Date(year, newDate.getMonth(), date);
		dateTest.setDate(date + i + 1);
		dateFuture[i].innerHTML = `${format_two_digits(dateTest.getDate(),0)}/${format_two_digits(dateTest.getMonth(),1)}`;
	};
};

var ctx = document.getElementById('myChart');
var config = {
	type: 'line',
	data: {
		labels: [],
		datasets: [{
			label: 'Day Temperature',
			data: [],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255, 99, 132, 1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1,
			//pointBorderWidth: 1
		}]
	},
	options: {
		legend: {
			display: false,
		},
		scales: {
			xAxes: [{
				gridLines: {
					display: false
				},
				ticks: {
					fontColor: 'palevioletred'
				}
			}],
			yAxes: [{
				gridLines: {
					display: false,
					drawBorder: false
				},
				ticks: {
					display: false,
					max: 120
				}
			}],
		},
		plugins: {
			datalabels: {
				display: true,
				align: 'top',
				color: 'palevioletred'
			}
		},
		tooltips: false
	}};
	
var myChart;

var tempUnitIndicator = "metric"; //* indicate which temperature unit is chosen for API URL. Values: metric/imperial

function getCurrentWeather (place) {
	var lon;
	var lat;
	let key = "e799217a4276d0646d61cfe92b79802b";
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${key}&&units=${tempUnitIndicator}`;
	axios.get(url).then((response) => {
		let realFeel = document.querySelector(".realFeel");
		realFeel.innerHTML = Math.round(response.data.main.feels_like);
		let windSpeed = document.querySelector(".windSpeed");
		windSpeed.innerHTML = Math.round(response.data.wind.speed);
		let temp = document.querySelector(".number-big");
		temp.innerHTML = Math.round(response.data.main.temp);
		let bigIcon = document.querySelector(".icon-big");
		bigIcon.innerHTML = `<img src = "https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png">`;
		let desc = document.querySelector(".rowDesc");
		desc.innerHTML = response.data.weather[0].main;
		let currentMax = document.querySelector(".currentMax");
		currentMax.innerHTML = Math.round(response.data.main.temp_max);
		let currentMin = document.querySelector(".currentMin");
		currentMin.innerHTML = Math.round(response.data.main.temp_min);
		time(new Date(convertTime(response.data.dt*1000,response.data.timezone))); 

		lat = response.data.coord.lat;
		lon = response.data.coord.lon;
	
		function changeForecastedTempAndIcon (i,response) {
			let forecastedTemp = document.querySelectorAll(".rowFutureWeather");
			let forecastedIcon = document.querySelectorAll(".rowFutureIcon");
			forecastedTemp[i].innerHTML = `<span class="number forecast">${Math.round(response.data.daily[i+1].temp.max)}</span>
											<span class="noCelcius">°</span>/
											<span class="number forecast">${Math.round(response.data.daily[i+1].temp.min)}</span>
											<span class="noCelcius">°</span>`
			forecastedIcon[i].innerHTML = `<img src = "https://openweathermap.org/img/wn/${response.data.daily[i+1].weather[0].icon}@2x.png">`;
		}
		var i;
		for (i = 0; i < 5 ; i++) {
			let forecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely&appid=${key}&units=${tempUnitIndicator}`;
			axios.get(forecastUrl).then(changeForecastedTempAndIcon.bind(null,i))
		};
	}
	);
	
	if (myChart) {
		/** 
		 ** to prevent the old data to reappear when mouse is hovered on data points
		 */
		myChart.destroy();
	}
	myChart = new Chart(ctx,config);
	let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${key}&cnt=40&units=${tempUnitIndicator}`;
	axios.get(forecastUrl).then((response) => {
		var i;
		config.data.datasets[0].data.splice(0, config.data.datasets[0].data.length);
		config.data.labels.splice(0, config.data.labels.length);
		for (i = 0; i < 8; i++) {
			config.data.datasets[0].data.push(Math.round(response.data.list[i].main.temp));
			
			/**
			 * *Convert epoch according to current time of searched place and push to labels of xAxis
			 */
			var timestamp = new Date(convertTime(response.data.list[i].dt*1000,response.data.city.timezone));

			config.data.labels.push(`${format_two_digits(timestamp.getHours(),0)}:00`);
		}
		myChart.update();
	});
}
getCurrentWeather("London");

function convertDegree (where,indicator) {
	var degree, i;
	degree = document.querySelectorAll(where);
	for(i=0; i<degree.length; i++) {
		if (indicator === "°F") {
			degree[i].innerHTML = Math.round((degree[i].innerHTML* 9) / 5 + 32);
		} else {
			degree[i].innerHTML = Math.round((degree[i].innerHTML - 32) * 5 / 9);
		}
	};
}
function changeValue (where,toBeValue) {
	var unit, i;
	unit = document.querySelectorAll(where);
	for(i=0; i<unit.length; i++) {
		unit[i].innerHTML = `${toBeValue}`;
	};
};

var clickFarenheit = document.querySelector('.farenheitConversion');
clickFarenheit.addEventListener("click", function () {
	var i;
	if (this.innerHTML === '°F') {
		this.innerHTML=this.innerHTML.replace("°F","°C");
		tempUnitIndicator = "imperial";
		changeValue(".celcius","°F");
		changeValue(".celcius-big","°F");
		convertDegree(".number","°F");
		convertDegree(".number-big","°F");
		
		for (i = 0; i < 8; i++) {
			config.data.datasets[0].data[i] = Math.round((config.data.datasets[0].data[i]* 9) / 5 + 32);
			myChart.update();
		}
	} else {
		this.innerHTML=this.innerHTML.replace("°C","°F");
		tempUnitIndicator = "metric";
		changeValue(".celcius","°C");
		changeValue(".celcius-big","°C");
		convertDegree(".number","°C");
		convertDegree(".number-big","°C");
		
		for (i = 0; i < 8; i++) {
			config.data.datasets[0].data[i] = Math.round((config.data.datasets[0].data[i]- 32) * 5 / 9);
			myChart.update();
    };
	}});
	

function changeHeart2Icon (toBeRemovedIcon,toBeAddedIcon) {
	const icon =document.querySelector('#heart2');
	if (icon.classList.contains(toBeRemovedIcon)) {
		icon.classList.remove(toBeRemovedIcon);
		icon.classList.add(toBeAddedIcon);
	}
}

function checkDupplicatedMarkedCity (cityName) {
	let dropDownItemList = document.querySelectorAll(".dropdown-item");
	var faveCityList = Array.from(dropDownItemList);
	var i; array = [];
	for (i = 0; i < faveCityList.length; i++) {
		array.push(faveCityList[i].innerHTML);
	}
	
	for (i = 0; i < array.length; i++) {
		if (cityName === array[i]) {
			var existingCity = array[i];
		}
	}	

	return existingCity; /** check if city input exists in drop-down list */
}

function search(event) {
	event.preventDefault();
	let searchInput = document.querySelector("#enterCity");
	let city = document.querySelector(".city");
	
	if (searchInput.value) {
		var formattedCity = searchInput.value.trim().split(" ");
		var i; 
		for (i = 0; i < formattedCity.length; i++) {
			var b = formattedCity[i];
			b = b[0].toUpperCase() + b.substring(1);
			formattedCity[i] = b;
		}
		formattedCity = formattedCity.join(" ");
		city.innerHTML = `${formattedCity}`;

		getCurrentWeather(formattedCity);

		if (checkDupplicatedMarkedCity(formattedCity) === undefined) {
			changeHeart2Icon('fas','far')
		} else {
			changeHeart2Icon('far','fas')
		};
		
	} else {
		alert(`Please enter a city`);
	}
}

let form = document.querySelector("form, .searchButton");
form.addEventListener("submit", search);

function appendLikedCity (cityName) {
	//event.preventDefault();
	let city = document.querySelector(".city");
	city.innerHTML = `${cityName}`;
	changeHeart2Icon('far','fas');
}

function selectDropDownItem() {
	let clickDropDownItem = document.querySelectorAll(".dropdown-item");
	clickDropDownItem.forEach(function (clickItem) {
		clickItem.addEventListener("click", () => {
			appendLikedCity(clickItem.innerHTML);
			getCurrentWeather(clickItem.innerHTML);
		});
	});
}

selectDropDownItem();

var clickFavorite = document.querySelector(".rowPlace");
clickFavorite.addEventListener("click", 
    function () {
		var markedCity = this.querySelector(".city");
        const icon =this.querySelector('i');
		const menu = document.querySelector(".dropdown-menu");
        if (icon.classList.contains('far')) {
			icon.classList.remove('far');
            icon.classList.add('fas');
			menu.appendChild(createNewFavCity(markedCity.innerHTML));
			selectDropDownItem(); //*search weather of newly marked city  */

        } else {
			icon.classList.remove('fas');
            icon.classList.add('far');
			//* when a city is unmarked, it should be removed from the list */
			var test = markedCity.innerHTML;
			test = test.replace(" ","-"); /**cater for city name with 2 or more words */
			test = `.${test}`;
			menu.removeChild(menu.querySelector(test));
        }
    });

function displayCurrentCity() {
	navigator.geolocation.getCurrentPosition((response) => {
		var lat = response.coords.latitude;
		var lon = response.coords.longitude;
		let key = "e799217a4276d0646d61cfe92b79802b";
		let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=${tempUnitIndicator}`;
		axios.get(url).then((response) => {
			let city = document.querySelector(".city");
			city.innerHTML = `${response.data.name}`;
			getCurrentWeather(response.data.name);

			if (checkDupplicatedMarkedCity(response.data.name) === undefined) {
			changeHeart2Icon('fas','far')
			} else {
			changeHeart2Icon('far','fas')
			};
		})
	})
}
let searchCurrent = document.querySelector(".searchCurrent");
searchCurrent.addEventListener("click", displayCurrentCity);