import React from "react";
import "../App.css";

export default function Main() {
	const [searchTerm, setSearchTerm] = React.useState("");

	return (
		<div className="Main">
			<input
				type="text"
				placeholder="Du kan søge her..."
				className="SøgeInput"
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			></input>
			<button
				className="Button"
				onClick={() => {
					setSearchTerm("");
				}}
			>
				Klik her
			</button>
		</div>
	);
}
