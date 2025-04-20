
import { configureStore } from "@reduxjs/toolkit";
//import { reduxLogger} from 'redux-logger'
import systemReducer from "../features/system/systemSlice";
import topicReducer from "../features/personal/topic/topicSlice";
import quizReducer from "../features/personal/quiz/quizSlice";
import authReducer from "../features/auth/authSlice";

import networkReducer from "../features/network/networkSlice"

//const logger = reduxLogger.createLogger()

const store = configureStore({
    reducer: {
        system: systemReducer,
        topic: topicReducer,
        quiz: quizReducer,
        auth: authReducer,
        network: networkReducer
    },
    //middleware: (getDefaultMiddleWare) => getDefaultMiddleWare().concat(logger),
})

export default store