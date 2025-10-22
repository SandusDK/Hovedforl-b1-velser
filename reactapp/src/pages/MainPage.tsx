import React, { useEffect, useState } from "react";
import "../App.css";
import config from "../config";
import VlogCard from "../components/VlogCard";
import { VlogPageData } from "../types/Vlog";

interface MainPageProps {
	vlogs: VlogPageData[];
	setVlogs: React.Dispatch<React.SetStateAction<VlogPageData[]>>;
}

export default function MainPage({ vlogs, setVlogs }: MainPageProps) {
	const [searchTerm, setSearchTerm] = useState("");
	const [displayedVlogs, setDisplayedVlogs] = useState<VlogPageData[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchVlogs = async (keyword: string = "page") => {
		try {
			console.log(
				"Henter vlogs fra API fra:",
				`${config.API_URL}/BlogSearch/search?q=${keyword}`
			);
			const response = await fetch(
				`${config.API_URL}/BlogSearch/search?q=${keyword}`
			);

			if (!response.ok) throw new Error(`HTTP-fejl: ${response.status}`);
			const data = await response.json();
			return data.results as VlogPageData[];
		} catch (error) {
			console.error("Fejl ved hentning af vlogs:", error);
			return [];
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			const data = await fetchVlogs();
			console.log("Fetched vlogs:", data);
			setVlogs(data);
			setDisplayedVlogs(data);
			setLoading(false);
		};
		fetchData();
	}, [setVlogs]);

	const handleSearch = async () => {
		if (!searchTerm.trim()) {
			setLoading(true);
			const data = await fetchVlogs();
			setDisplayedVlogs(data);
			setLoading(false);
			return;
		}

		setLoading(true);
		const data = await fetchVlogs(searchTerm);
		setDisplayedVlogs(data);
		setLoading(false);
	};

	const handleClear = async () => {
		setSearchTerm("");
		setLoading(true);
		const data = await fetchVlogs();
		setDisplayedVlogs(data);
		setLoading(false);
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
				<button className="Button" onClick={handleClear}>
					Ryd
				</button>

				<div className="VlogGrid">
					{loading ? (
						<p>Loading vlogs...</p>
					) : displayedVlogs.length > 0 ? (
						displayedVlogs.map((vlog) => {
							const firstPost = vlog.posts[0];
							return (
								<VlogCard
									key={vlog.id}
									id={vlog.id}
									title={vlog.blogName}
									description={vlog.followText ?? "Ingen beskrivelse"}
									thumbnail={firstPost?.featuredImage ?? ""}
									date={firstPost?.publishDate ?? "Ukendt dato"}
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
