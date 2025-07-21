import { httpEndpoint } from "../../../serverConfig";
import AxiosWrapper from "./AxiosWrapper";

export { default as deleteTopics } from "./topic/delete";
export { default as fetchManyTopics } from "./topic/fetchAll";
export { default as fetchOneTopic } from "./topic/fetchOne";
export { default as apiBatchRequest } from "./batchRequest";
export { default as masteryUpdate } from "./topic/update"
export { default as fetchSuggestions } from "./topic/fetchSuggestions"
export { default as saveTopics } from "./topic/saveTopics"
export { default as searchTopics } from "./topic/searchTopics"
export { default as getWords } from "./word/getWords"
export { default as searchWords } from "./word/searchWords"
export { default as getLearning } from "./learning/getLearning"
export { default as createLearning } from "./learning/createLearning"

export { default as getFyp } from "./fyp/get"
export { default as updateFyp } from "./fyp/update"

export { default as liveChat } from "./live-chat/chat"
export { default as saveAgent } from "./live-chat/saveAgent"
export { default as getAgents } from "./live-chat/getAgents"
export { default as saveAgentPair } from "./live-chat/saveAgentPair"
export { default as getAgentPairs } from "./live-chat/getAgentPairs"

export { default as fetchAllStories } from "./story/fetchAll"
export { default as createStory, createChapter, createScene } from "./story/create"
export { patchStory, patchChapter, patchEditDetails, patchDeleteDetails, patchTypeSettings, patchChapterLog, patchUserContribution, patchUserWritingGoal } from "./story/update"
export { fetchChapter, fetchStories, fetchStory, fetchScene, fetchUserContribution, fetchUserGoal } from "./story/fetch"

export { default as prepareEpisode } from "./script/prepareEpisode"
 
export { register, login } from "./auth"

export { httpEndpoint, config } from "../../../serverConfig"

export const ping = () => AxiosWrapper.get(`${httpEndpoint}/uptime`)