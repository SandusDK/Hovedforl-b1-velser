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
	const [filteredVlogs, setFilteredVlogs] = useState<VlogPageData[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchVlogs = async () => {
		try {
			console.log(
				"Henter vlogs fra API fra:",
				`${config.API_URL}/BlogSearch/search?q=page`
			);
			const response = await fetch(
				`${config.API_URL}/BlogSearch/search?q=page`
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
			setFilteredVlogs(data); // så du har noget at vise fra start
			setLoading(false);
		};
		fetchData();
	}, [setVlogs]);

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
				firstPost?.content.toLowerCase().includes(searchTerm.toLowerCase())
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
					{loading ? (
						<p>Loading vlogs...</p>
					) : filteredVlogs.length > 0 ? (
						filteredVlogs.map((vlog) => {
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
