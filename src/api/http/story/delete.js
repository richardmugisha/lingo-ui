import AxiosWrapper from "../AxiosWrapper"
import { httpEndpoint } from "../../../../serverConfig"

export default async (ids) => {
    try {
        const res = AxiosWrapper.delete(`${ httpEndpoint }/story/${ids}`)
        return res.data
    } catch (error) {
        throw error
    }
}