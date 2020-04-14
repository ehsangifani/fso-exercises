import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Statistic = (props) => {
	return (
		<tr>
			<td>{props.text}</td>
			<td>{props.value}</td>
		</tr>
	)
}

const Statistics = (props) => {
	const { good, neutral, bad } = props;

	const all = good + neutral + bad;

	if (all === 0) {
		return (
			<p>No feedback given</p>
		)
	}

	return (
		<table>
			<tbody>
				<Statistic text="good" value={good} />
				<Statistic text="neutral" value={neutral} />
				<Statistic text="bad" value={bad} />
				<Statistic text="all" value={all} />
				<Statistic text="average" value={(good - bad) / all} />
				<Statistic text="positive" value={(good / all * 100) + ' %'} />
			</tbody>
		</table>
	)
}

const Button = ({ onClick, text }) => {
	return (
		<button onClick={onClick}>{text}</button>
	)
}

const App = () => {
	// save clicks of each button to own state
	const [good, setGood] = useState(0)
	const [neutral, setNeutral] = useState(0)
	const [bad, setBad] = useState(0)

	return (
		<div>
			<h1>give feedback</h1>
			<Button onClick={() => setGood(good + 1)} text="good" />
			<Button onClick={() => setNeutral(neutral + 1)} text="neutral" />
			<Button onClick={() => setBad(bad + 1)} text="bad" />
			<h2>statistics</h2>
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	)
}

ReactDOM.render(
	<App />,
	document.getElementById('root')
);