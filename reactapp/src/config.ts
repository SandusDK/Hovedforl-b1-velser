// Configuration for API endpoints
interface Config {
  API_URL: string;
}

const config: Config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api'
};

export default config;
