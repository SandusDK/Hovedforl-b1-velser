import React, { useEffect, useState } from "react";
import "../App.css";
import config from "../config";
import VlogCard from "./VlogCard";
import { VlogPageData } from "../types/Vlog";
import VlogSeed from "../data/VlogSeed";

export default function Main() {
	const [searchTerm, setSearchTerm] = useState("");
	const [vlogs, setVlogs] = useState<VlogPageData[]>(VlogSeed);
	const [filteredVlogs, setFilteredVlogs] = useState<VlogPageData[]>([]);

	useEffect(() => {
		console.log("API URL from config:", config.API_URL);
		// Show all vlogs by default
		//setFilteredVlogs(VlogSeed);
	}, []);

	const handleSearch = () => {
		if (!searchTerm) {
			setFilteredVlogs(vlogs);
			return;
		}

		const filtered = vlogs.filter((vlog) => {
			const firstPost = vlog.posts[0];
			return (
				vlog.blogName.toLowerCase().includes(searchTerm.toLowerCase()) ||
				firstPost?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
				firstPost?.description.toLowerCase().includes(searchTerm.toLowerCase())
			);
		});

		setFilteredVlogs(filtered);
	};

	return (
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
				/>
				<button className="Button" onClick={handleSearch}>
					Søg
				</button>
				<button
					className="Button"
					onClick={() => {
						setSearchTerm("");
						setFilteredVlogs(vlogs);
					}}
				>
					Ryd
				</button>

				<div className="VlogGrid">
					{filteredVlogs.length > 0 ? (
						filteredVlogs.map((vlog, index) => {
							const firstPost = vlog.posts[0];

							return (
								<VlogCard
									key={index}
									id={vlog.id}
									title={vlog.blogName}
									description={firstPost?.description ?? "Ingen beskrivelse"}
									thumbnail={firstPost?.image ?? ""}
									date={firstPost?.date ?? "Ukendt dato"}
								/>
							);
						})
					) : (
						<p>No results found.</p>
					)}
				</div>
			</div>

			<footer>© Sandesh Jha 2024</footer>
		</div>
	);
}
