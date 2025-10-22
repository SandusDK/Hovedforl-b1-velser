import { useParams } from "react-router-dom";
import "../styles/VlogPage.css";
import { VlogPageData } from "../types/Vlog";

interface VlogPageProps {
	vlogs: VlogPageData[];
}

export default function VlogPage({ vlogs }: VlogPageProps) {
	const { id } = useParams<{ id: string }>();

	const vlog = vlogs.find((vlog) => vlog.id === id);

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
							<h5>{post.publishDate}</h5>
							<div
								className="fakeimg"
								style={{
									height: "200px",
									backgroundImage: `url(${post.featuredImage})`,
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
					<div className="card">
						<h2>{vlog.about.title}</h2>
						<div
							className="fakeimg"
							style={{
								height: "100px",
								backgroundImage: `url(${vlog.about.image})`,
								backgroundSize: "cover",
								backgroundPosition: "center",
							}}
						></div>
						<p>{vlog.about.description}</p>
					</div>

					<div className="card">
						<h3>Popular Posts</h3>
						{vlog.popularPosts.map((post, idx) => (
							<div key={idx} style={{ marginBottom: "10px" }}>
								<div
									className="fakeimg"
									style={{
										backgroundImage: `url(${post.image})`,
										backgroundSize: "cover",
										backgroundPosition: "center",
										height: "100px",
									}}
								></div>
								<p>{post.title}</p>
							</div>
						))}
					</div>

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
