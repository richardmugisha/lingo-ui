// serverConfig.js
const servers = import.meta.env

const HOST = servers.DEV ? "localhost:3500" : servers.VITE_HOST
const PATH = servers.VITE_PATH

const httpEndpoint = `http${servers.DEV ? "" : "s"}://${HOST}/${PATH}`

const wsEndpoint = `http${servers.DEV ? "" : "s"}://${HOST}`

const awsUrl = servers.VITE_AWS_URL

// //console.log(httpEndpoint, wsEndpoint)

export { httpEndpoint, wsEndpoint, awsUrl }
