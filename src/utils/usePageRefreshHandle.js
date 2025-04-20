import { fetchOneTopic } from "../api/http"
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { chooseTopic } from "../features/personal/topic/topicSlice";

export default () => {
    const [searchParams] = useSearchParams();
    const dispatch = useDispatch()

    return (topicID) => {
        if (!topicID) {
            const topicIDhere = searchParams.get('topic')
            if (topicIDhere) {
                fetchOneTopic(topicIDhere)
                .then(topic => dispatch(chooseTopic(topic)))
                return topicIDhere
            }
        }
        else return topicID
    }
}