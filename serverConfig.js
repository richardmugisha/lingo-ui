// serverConfig.js
const servers = import.meta.env
const API_BASE_URL = servers[servers.VITE_API_BASE_URL] || servers.VITE_SERVER_1

export default API_BASE_URL;
