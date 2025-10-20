import React, { use, useEffect } from "react";
import "../App.css";
import config from "../config";
import VlogCard from "./VlogCard";

export default function Main() {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [results, setResults] = React.useState(null);
	const [vlogs, setVlogs] = React.useState([
		{id: 1, title: "Sample Vlog", description: "This is a sample vlog description.", thumbnail: "https://placehold.co/600x400"}, 
		{id: 2, title: "Another Vlog", description: "This is another vlog description.", thumbnail: "https://placehold.co/600x400"},
		{id: 3, title: "Travel Vlog", description: "Exploring new places.", thumbnail: "https://placehold.co/600x400"},
		{id: 4, title: "Tech Vlog", description: "Latest tech reviews.", thumbnail: "https://placehold.co/600x400"},
		{id: 5, title: "Food Vlog", description: "Delicious recipes and food reviews.", thumbnail: "https://placehold.co/600x400"},
		{id: 6, title: "Fitness Vlog", description: "Workout routines and health tips.", thumbnail: "https://placehold.co/600x400"},
	]);
	useEffect(() => {
		console.log("API URL from config:", config.API_URL);
	}, []);
	
	const filteredVlogs = vlogs.filter((vlog) =>
		vlog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		vlog.description.toLowerCase().includes(searchTerm.toLowerCase())
	); 



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
		<div className="AppMain">
			<header>
				<h1>Hovedforløb Web</h1>
			</header>
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
			<div className="VlogGrid" >
				{filteredVlogs.map((vlog) => (
					<VlogCard
						key={vlog.id}
						id={vlog.id}
						title={vlog.title}
						description={vlog.description}
						thumbnail={vlog.thumbnail}
						
					/>
				))}
			</div>
		</div>
		<footer>© Sandesh Jha 2024</footer>
		</div>
	);
}
