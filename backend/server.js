// server.js
import express from "express"; // Hvis du bruger ES Modules (Node v18+)
// const express = require("express"); // (alternativ, CommonJS)
import cors from "cors";
import getMatchingImages from "./serverFunctions/ImageSearch.js";
import DBController from "./dbController.js";

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// CORS configuration
const corsOptions = {
	origin: NODE_ENV === 'production'
		? ['http://83.151.132.141', 'https://83.151.132.141', 'http://83.151.132.141:3001']
		: ['http://localhost:3001', 'http://127.0.0.1:3001', 'http://localhost'],
	credentials: true
};

app.use(cors(corsOptions));// Instantiate and export a single dbController instance for other modules to use
const db = new DBController();
export default db;

// Middleware til at parse JSON
app.use(express.json());

// Eksempel på route
app.get("/", (req, res) => {
	res.json({ message: "API'en kører! 🚀" });
});

// Eksempel på route med data
app.get("/api/users", (req, res) => {
	res.json([
		{ id: 1, name: "Sander" },
		{ id: 2, name: "Lauridsen" },
	]);
});

// Mock example of searching for something using searchbar. Lets say Image.
app.get("/api/search", async (req, res) => {
	const query = req.query.image;
	try {
		const results = await getMatchingImages(query); // Returns image metadata
		res.json(results);
	} catch (err) {
		console.error('Error in /api/search:', err);
		res.status(500).json({ error: 'Server error' });
	}
});




// Start server
app.listen(PORT, HOST, () => {
	console.log(`Serveren kører i ${NODE_ENV} mode`);
	console.log(`Backend API: http://${HOST}:${PORT}`);
	if (NODE_ENV === 'production') {
		console.log(`Tilgængelig på: http://83.151.132.141:${PORT}`);
	}
});
