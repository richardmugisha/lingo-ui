
import AxiosWrapper from "../AxiosWrapper";
import { httpEndpoint } from "../../../../serverConfig";

export default async () => {
    const user = JSON.parse(localStorage.getItem('user')).userId
    try {
        console.log("about to ----")
        const res = await AxiosWrapper.get(`${httpEndpoint}/fyp`, { params: { user }})
        return res.data.fyp
    } catch (error) {
        console.log(error)
    }
}