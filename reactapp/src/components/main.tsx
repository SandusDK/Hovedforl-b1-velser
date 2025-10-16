import React from "react";
import "../App.css";
import config from "../config";

export default function Main() {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [results, setResults] = React.useState(null);

	const handleSearch = async () => {
		if (!searchTerm) return;

		try {
			// Use the API URL from config (already includes /api prefix)
			const response = await fetch(`${config.API_URL}/search?image=${encodeURIComponent(searchTerm)}`);
			const data = await response.json();
			setResults(data);
			console.log("Search results:", data);
		} catch (error) {
			console.error("Error searching:", error);
		}
	};	return (
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
				onClick={handleSearch}
			>
				Søg
			</button>
			<button
				className="Button"
				onClick={() => {
					setSearchTerm("");
					setResults(null);
				}}
			>
				Ryd
			</button>
			{results && (
				<div className="results">
					<pre>{JSON.stringify(results, null, 2)}</pre>
				</div>
			)}
		</div>
	);
}
