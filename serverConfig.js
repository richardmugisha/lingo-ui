// serverConfig.js
const servers = import.meta.env

const HOST = servers.DEV ? "localhost:3500" : servers.VITE_HOST
const PATH = servers.VITE_PATH

const email = servers.VITE_EMAIL
const password = servers.VITE_PWD

const config = { email, password }
const httpEndpoint = `http${servers.DEV ? "" : "s"}://${HOST}/${PATH}`

const wsEndpoint = `http${servers.DEV ? "" : "s"}://${HOST}`

const awsUrl = servers.VITE_AWS_URL

// //console.log(httpEndpoint, wsEndpoint)

export { httpEndpoint, wsEndpoint, awsUrl, config }
