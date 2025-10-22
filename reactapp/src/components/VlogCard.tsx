import React from "react";
import "../styles/VlogCard.css";
import { useNavigate } from "react-router-dom";

export default function VlogCard({
	id,
	title,
	description,
	thumbnail,
	date,
}: {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	date: string;
}) {
	const navigate = useNavigate();
	return (
		<div className="vlog-card" onClick={() => navigate(`/vlog/${id}`)}>
			<img
				src={"https://83.151.132.141" + thumbnail}
				alt={title}
				className="vlog-thumbnail"
			/>
			<h2 className="vlog-title">{title}</h2>
			<p className="vlog-description">{description}</p>
		</div>
	);
}
