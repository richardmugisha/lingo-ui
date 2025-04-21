
import { CHUNK_SIZE, CHUNK_TARGET_MASTERY_LEVEL, TARGET_PERFECT_LEVEL } from "../../../../../constants"

const wordMastery = (level) => {
    return level / TARGET_PERFECT_LEVEL
}

const topicChunkperc  = (chunk) => {
    if (!chunk?.length) return 0
    const weighted = sum(chunk.map(word => wordMastery(word.level)))
    const perc = weighted * 100 / chunk.length

    return perc
}


const wholeTopicPerc = (learning, words) => {
    if (!learning?.words?.length) return 0
    const { topicLevel, chunkIndex } = learning
    const chunkCount = Math.ceil((words || learning.words).length / CHUNK_SIZE)
    const pastPerc = topicLevel * 100 / TARGET_PERFECT_LEVEL
    const thisChunkperc = topicChunkperc(learning.words)
    console.log(pastPerc, thisChunkperc, chunkIndex, chunkCount, words)
    return (pastPerc + thisChunkperc) * (chunkIndex + 1) / chunkCount
}

const sum = (list) => {
    return list.reduce((acc, curr) => acc + curr, 0)
}

export { topicChunkperc, wholeTopicPerc, wordMastery }