import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/VlogPage.css";
import { VlogPageData } from "../types/Vlog";
import config from "../config";

interface VlogPageProps {
	vlogs: VlogPageData[];
}

export default function VlogPage({ vlogs }: VlogPageProps) {
	const { blogName } = useParams<{ blogName: string }>();
	const BASE_URL = "https://83.151.132.141";
	const [vlog, setVlog] = useState<VlogPageData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchVlogByName = async () => {
			if (!blogName) {
				setLoading(false);
				return;
			}

			const decodedName = decodeURIComponent(blogName);
			const localVlog = vlogs.find(
				(v) => v.blogName === decodedName
			);

			if (localVlog) {
				setVlog(localVlog);
				setLoading(false);
				return;
			}

			try {
				const response = await fetch(
					`${config.API_URL}/BlogSearch/search?q=${encodeURIComponent(decodedName)}`
				);
			if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
			const data = await response.json();
			const matchedVlog = data.results?.find(
				(v: VlogPageData) => v.blogName === decodedName
			);				setVlog(matchedVlog || null);
			} catch (error) {
				console.error("Error fetching vlog:", error);
				setVlog(null);
			}
			setLoading(false);
		};

		fetchVlogByName();
	}, [blogName, vlogs]);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (!vlog) {
		return <div>Vlog not found</div>;
	}

	return (
		<div className="blog-layout">
			<div className="header">
				<h2>{vlog.blogName}</h2>
			</div>

			<div className="row">
				{/* Left column – posts */}
				<div className="leftcolumn">
					{vlog.posts.map((post) => (
						<div className="card" key={post.id}>
							<h2>{post.title}</h2>
							<h5>{new Date(post.publishDate).toLocaleDateString()}</h5>
							<div
								className="fakeimg"
								style={{
									height: "200px",
									backgroundImage: `url(${BASE_URL}${post.featuredImage})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
								}}
							></div>
							<p>{post.content}</p>
						</div>
					))}
				</div>

				{/* Right column – about + popular + follow */}
				<div className="rightcolumn">
					{/* About section */}
					<div className="card">
						<h2>{vlog.about.title}</h2>
						<div
							className="fakeimg"
							style={{
								height: "100px",
								backgroundImage: `url(${BASE_URL}${vlog.about.image})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						></div>
						<p>{vlog.about.description}</p>
					</div>

					{/* Popular posts */}
					<div className="card">
						<h3>Popular Posts</h3>
						{vlog.popularPosts.map((post, idx) => (
							<div key={idx} style={{ marginBottom: "10px" }}>
								<div
									className="fakeimg"
									style={{
										backgroundImage: `url(${BASE_URL}${post.image})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										height: "100px",
									}}
								></div>
								<p>{post.title}</p>
							</div>
						))}
					</div>

					{/* Follow text */}
					<div className="card">
						<h3>Follow Me</h3>
						<p>{vlog.followText}</p>
					</div>
				</div>
			</div>

			<div className="footer">
				<h2>Footer</h2>
			</div>
		</div>
	);
}
