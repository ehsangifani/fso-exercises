import React, { useState, useEffect } from 'react';
import axios from 'axios';

const api_key = process.env.REACT_APP_API_KEY;

const url = `http://api.weatherstack.com/current?access_key=${api_key}`

const Weather = ({ weather }) => {
	/* const [data, setData] = useState({});

	useEffect(() => {
		const q = `${url}&query=${country.capital}`;
		axios
			.get(q)
			.then(response => {
				console.log(response.data); //debug
				setData(response.data);
			});
	}, [country.capital]);
	const temp = data.current && data.current.temperature;
	const icon = data.current && data.current.weather_icons[0];
	const wind = data.current && data.current.wind_speed;
	const wdir = data.current && data.current.wind_dir; */
	const temp = weather && weather.current.temperature;
	const icon = weather && weather.current.weather_icons[0];
	const wind = weather && weather.current.wind_speed;
	const wdir = weather && weather.current.wind_dir;
	return (
		<div>
			<p>temperature: {temp} Celsius</p>
			<img width="100" src={icon} alt="" />
			<p>wind: {wind} km/h direction {wdir}</p>
		</div>
	);
};

const Country = ({ value, weather }) => {
	return (
		<div>
			<h2>{value.name}</h2>
			<p>capital {value.capital}</p>
			<p>population {value.population}</p>
			<h3>languages</h3>
			<ul>
				{value.languages.map(lang =>
					<li key={lang.iso639_1}>{lang.name}</li>
				)}
			</ul>
			<img width="200" src={value.flag} alt={`flag of ${value.name}`} />
			<h3>Weather in {value.capital}</h3>
			<Weather weather={weather} />
		</div>
	)
};

const Display = ({ countries, onShow, weathers }) => {
	if (countries.length === 1) {
		return (
			<Country value={countries[0]}
				weather={weathers[countries[0].name]}
			/>
		);
	} else if (countries.length < 10) {
		return (
			<div>
				<ul>
					{countries.map(country =>
						<li key={country.name}>
							{country.name}
							<button value={country.name} onClick={onShow}>
								show
							</button>
						</li>
					)}
				</ul>
			</div>
		);
	}

	return (
		<div>Too many mathces; try typing more</div>
	)
};

const App = () => {
	const [countries, setCountries] = useState([]);
	const [filterKW, setFilterKW] = useState('');
	const [weathers, setWeathers] = useState({});

	useEffect(() => {
		axios
			.get("https://restcountries.eu/rest/v2/all")
			.then(response => {
				setCountries(response.data)
			});
	}, []);

	const handleKWChange = (event) => {
		setFilterKW(event.target.value.toLowerCase())
	};

	const filterCountries = () => {
		return countries.filter(country =>
			country.name.toLowerCase().includes(filterKW)
		)
	};

	const handleShowClick = (event) => {
		setFilterKW(event.target.value.toLowerCase())
	}

	const countriesToShow = filterKW ? filterCountries() : countries;

	useEffect(() => {
		if (countriesToShow.length !== 1)
			return;
		const country = countriesToShow[0];
		if (country.name in weathers)
			return;
		const q = `${url}&query=${country.capital}`;
		// stop multiple requests
		setWeathers({ ...weathers, [country.name]: undefined });
		axios
			.get(q)
			.then(response => {
				console.log('REQUEST SENT', country.name, response.data); //debug
				setWeathers({ ...weathers, [country.name]: response.data });
			});

	}, [countriesToShow, weathers]);

	return (
		<div>
			find countries
			<input value={filterKW} onChange={handleKWChange} />
			<Display countries={countriesToShow}
				weathers={weathers}
				onShow={handleShowClick} />
		</div>
	);
};

export default App;
