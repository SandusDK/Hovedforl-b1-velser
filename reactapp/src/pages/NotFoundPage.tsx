import "../styles/NotFoundPage.css";

export default function NotFoundPage() {
	return (
		<div className="notfound-container">
			<h1 className="notfound-title">404 - Siden findes ikke</h1>
			<p className="notfound-text">
				Ups! Vi kunne ikke finde den side du søgte.
			</p>
			<a href="/" className="notfound-link">
				Tilbage til forsiden
			</a>
		</div>
	);
}
