import React from 'react';

const Header = (props) => {
	return (
		<h2>{props.course.name}</h2>
	)
};

const Part = (props) => {
	return (
		<p>{props.part.name} {props.part.exercises}</p>
	)
};

const Content = ({ parts }) => {
	return (
		<div>
			{parts.map(part =>
				<Part key={part.id} part={part} />
			)}
		</div>
	)
};

const Footer = (props) => {
	const sum = props.parts.reduce((acc, v) => {
		return acc + v.exercises;
	}, 0);

	return (
		<p><b>total of {sum} exercises</b></p>
	)
};

const Course = ({ course }) => {
	return (
		<div>
			<Header course={course} />
			<Content parts={course.parts} />
			<Footer parts={course.parts} />
		</div>
	)
};

export default Course;