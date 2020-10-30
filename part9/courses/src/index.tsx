import React from 'react';
import ReactDOM from 'react-dom';

const assertNever = (value: never): never => {
	throw new Error(
		`Unhandled discriminated union member: ${JSON.stringify(value)}`
	);
};

interface CoursePartBase {
	name: string;
	exerciseCount: number;
}

interface CoursePartBaseDesc extends CoursePartBase {
	description: string;
}

interface CoursePartOne extends CoursePartBaseDesc {
	name: "Fundamentals";
}

interface CoursePartTwo extends CoursePartBase {
	name: "Using props to pass data";
	groupProjectCount: number;
}

interface CoursePartThree extends CoursePartBaseDesc {
	name: "Deeper type usage";
	exerciseSubmissionLink: string;
}

interface CoursePartFour {
	name: "Course part four";
	exerciseCount: number;
	description: string;
}

type CoursePart = CoursePartOne | CoursePartTwo | CoursePartThree | CoursePartFour;



const courseParts: CoursePart[] = [
	{
		name: "Fundamentals",
		exerciseCount: 10,
		description: "This is an awesome course part"
	},
	{
		name: "Using props to pass data",
		exerciseCount: 7,
		groupProjectCount: 3
	},
	{
		name: "Deeper type usage",
		exerciseCount: 14,
		description: "Confusing description",
		exerciseSubmissionLink: "https://fake-exercise-submit.made-up-url.dev"
	}
];

const Header: React.FC<{ name: string; }> = (props) => (
	<h1>{props.name}</h1>
);

const Part: React.FC<{ course: CoursePart; }> = ({ course }) => {
	switch (course.name) {
		case "Fundamentals":
			return <div>
				<p>{course.name}</p>
				<p>{course.exerciseCount}</p>
				<p>{course.description}</p>
			</div>;
		case "Using props to pass data":
			return <div>
				<p>{course.name}</p>
				<p>{course.exerciseCount}</p>
				<p>{course.groupProjectCount}</p>
			</div>;
		case "Deeper type usage":
			return <div>
				<p>{course.name}</p>
				<p>{course.exerciseCount}</p>
				<p>{course.description}</p>
				<p>{course.exerciseSubmissionLink}</p>
			</div>;
		case "Course part four":
			return <div>
				<p>{course.name}</p>
				<p>{course.exerciseCount}</p>
				<p>{course.description}</p>
			</div>;
		default:
			return assertNever(course);
	}
};

const Content: React.FC<{ courses: Array<CoursePart>; }> = ({ courses }) => {
	return <div>
		{courses.map(course =>
			<Part key={course.name} course={course} />
		)}
	</div>;
};

const Total: React.FC<{ total: number; }> = ({ total }) => (
	<p>Number of exercises{" "} {total}</p>
);


const App: React.FC = () => {
	const courseName = "Half Stack application development";

	return (
		<div>
			<Header name={courseName} />
			<Content courses={courseParts} />
			<Total total={courseParts.reduce((acc, v) => acc + v.exerciseCount, 0)} />
		</div>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);

