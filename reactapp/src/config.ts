// Configuration for API endpoints
interface Config {
	API_URL: string;
}

const config: Config = {
	API_URL: process.env.REACT_APP_API_URL || "https://83.151.132.141/api",
};

export default config;
