import React from "react";
import "../styles/VlogCard.css";
import { useNavigate } from "react-router-dom";

export default function VlogCard({
	id,
	title,
	description,
	thumbnail,
	date,
	isFirst = false,
}: {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	date: string;
	isFirst?: boolean;
}) {
	const navigate = useNavigate();
	const urlFriendlyName = encodeURIComponent(title);
	return (
		<div className="vlog-card" onClick={() => navigate(`/vlog/${urlFriendlyName}`)}>
			<img
				src={"https://83.151.132.141" + thumbnail}
				width={300}
				height={200}
				alt={title}
				className="vlog-thumbnail"
				loading={isFirst ? "eager" : "lazy"}
				fetchPriority={isFirst ? "high" : "auto"}
			/>
			<h2 className="vlog-title">{title}</h2>
			<p className="vlog-description">{description}</p>
		</div>
	);
}
