function createNewFavCity (chosenCity) {
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.textContent = chosenCity;
	a.className = 'dropdown-item';
	li.appendChild(a);
	return li;
}

var clickFavorite = document.querySelector(".rowPlace");
clickFavorite.addEventListener("click", 
    function () {
        const icon =this.querySelector('i');
		var markedCity = this.querySelector(".city");
		console.log(markedCity);
		const menu = document.querySelector(".dropdown-menu");
        if (icon.classList.contains('far')) {
			icon.classList.remove('far');
            icon.classList.add('fas');
			//todo: still have to check for duplication in existling list before append
			//* the newly appended item is not stored, disappear with every page refreshing*/
			//* which leads to thefailure of appending fave city to title */
			menu.appendChild(createNewFavCity(markedCity.innerHTML));
        } else {
			icon.classList.remove('fas');
            icon.classList.add('far');
			//todo: when a city is unmarked, it should be removed from the list
        }
    });

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
	if (this.innerHTML === '|°F') {
		this.innerHTML=this.innerHTML.replace("|°F","|°C");
		changeValue(".celcius","°F");
		changeValue(".celcius-big","°F");
		convertDegree(".number","°F");
		convertDegree(".number-big","°F");
	} else {
		this.innerHTML=this.innerHTML.replace("|°C","|°F");
		changeValue(".celcius","°C");
		changeValue(".celcius-big","°C");
		convertDegree(".number","°C");
		convertDegree(".number-big","°C");
    };
}
);

function format_two_digits (n,b) {
	/**
	 * *b is indicator, 1: format for month, 0: format for minutes or hours
	 */
	return (n+b) < 10 ? '0' + (n+b) : (n+b);
}

function time (newDate) {
	let date = newDate.getDate();
	let hour = newDate.getHours();
	let minute = newDate.getMinutes();
	let year = newDate.getFullYear();
	
	let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
	let day = days[newDate.getDay()];
	
	let months = ["Jan",	"Feb",	"Mar",	"Apr",	"May",	"Jun",	"Jul",	"Aug",	"Sep",	"Oct",	"Nov",	"Dec"	];
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
		dateFuture[i].innerHTML = `${dateTest.getDate()}/${format_two_digits(dateTest.getMonth(),1)}`;
	};
};

function convertTime (timezone) {
	var d = new Date ();
	var localTime = d.getTime();
	var localOffset = d.getTimezoneOffset() * 60000;
	var utc = localTime + localOffset;
	var timeConverted = utc + timezone * 1000; //convert a UNIX timestamp to JS
	time (new Date(timeConverted));
}

var ctx = document.getElementById('myChart');
var config = {
	type: 'line',
	data: {
		labels: ['06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '00:00', '03:00'],
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
					display: false,
				},
			}],
			yAxes: [{
				gridLines: {
					display: false,
					drawBorder: false,
				},
				ticks: {
					display: false,
					max: 40,
				}
			}],
		}
	},
	};
	
var myChart;

function getCurrentWeather (place) {
	let key = "e799217a4276d0646d61cfe92b79802b";
	let url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${key}&&units=metric`;
	axios.get(url).then((response) => {
		let realFeel = document.querySelector(".realFeel");
		realFeel.innerHTML = Math.round(response.data.main.feels_like);
		let humidity = document.querySelector(".humidity");
		humidity.innerHTML = Math.round(response.data.main.humidity);
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
		convertTime(response.data.timezone); 
	}
	);

	function changeForecastedTemp (i,response) {
		forecastedTemp[i].innerHTML = `${Math.round(response.data.list[6+c].main.temp)}`;
		c = c+8;
	}
	let forecastedTemp = document.querySelectorAll(".forecast");
	var i, c = 0;
	for (i = 0; i<forecastedTemp.length; i++) {
		let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${key}&&units=metric`;
		axios.get(forecastUrl).then(changeForecastedTemp.bind(null,i))
	};
	
	function changeForecastedIcon (i,response) {
		forecastedIcon[i].innerHTML = `<img src = "https://openweathermap.org/img/wn/${response.data.list[6+d].weather[0].icon}@2x.png">`;
		d = d+8;
	}
	let forecastedIcon = document.querySelectorAll(".rowFutureIcon");
	var i, d = 0;
	for (i = 0; i<forecastedIcon.length; i++) {
		let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${key}&&units=metric`;
		axios.get(forecastUrl).then(changeForecastedIcon.bind(null,i))
	};

	if (myChart) {
		/** 
		 ** to prevent the old data to reappear when mouse is hovered on data points
		 */
		myChart.destroy();
		console.log(myChart);
	}
	myChart = new Chart(ctx,config);
	let forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${key}&&units=metric`;
	axios.get(forecastUrl).then((response) => {
		var i;
		myChart.data.datasets.forEach((test) => {
			test.data.length = 0;
			for (i = 0; i < 8; i++) {
				test.data.push(Math.round(response.data.list[i].main.temp));
			}
		})
	});
	myChart.update();
}
getCurrentWeather("Singapore");

function search(event) {
	event.preventDefault();
	let searchInput = document.querySelector("#enterCity");
	let city = document.querySelector(".city");
	
	if (searchInput.value) {
		city.innerHTML = `${searchInput.value}`;
		getCurrentWeather(searchInput.value);
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
}

let clickDropDownItem = document.querySelectorAll(".dropdown-item");
clickDropDownItem.forEach(function (clickItem) {
	clickItem.addEventListener("click", () => {
		appendLikedCity(clickItem.innerHTML);
		getCurrentWeather(clickItem.innerHTML);
	});
});

function displayCurrentCity() {
	navigator.geolocation.getCurrentPosition((response) => {
		var lat = response.coords.latitude;
		var lon = response.coords.longitude;
		let key = "e799217a4276d0646d61cfe92b79802b";
		let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}&units=metric`;
		axios.get(url).then((response) => {
			appendLikedCity(response.data.name);
			getCurrentWeather(response.data.name);
		})
	})
}
let searchCurrent = document.querySelector(".searchCurrent");
searchCurrent.addEventListener("click", displayCurrentCity);


/**
 * *DONE todo: enter city name in Search Engine or click fave-marked cities, display current info, even date and time
 * *DONE todo: add button 'current location', display current location info
 * todo: transmit data to chart
 * ?todo: DONE BUT NEED TO TIDY UP transmit forecasted data to 5-day-forecast part
 */
