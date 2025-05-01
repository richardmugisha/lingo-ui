
import AxiosWrapper from "../AxiosWrapper";
import { httpEndpoint } from "../../../../serverConfig";

export default async (fypState) => {
    const user = JSON.parse(localStorage.getItem('user')).userId
    try {
        console.log("about to ----")
        const res = await AxiosWrapper.patch(`${httpEndpoint}/fyp`, { user, fypState})
        return res
    } catch (error) {
        console.log(error)
    }
}