class StorySetup {
    constructor({ title, summary, author, step, mode, sentenceIndex, chapterIndex, chapterInProgress, sentenceInProgress, words, acts, characters, topics, chapters }) {
        this.metadata = { title, summary, author, characters };
        this.state = { 
            step: step || "onboarding", 
            mode: mode || "create", 
            sentenceIndex: sentenceIndex || 0, 
            chapterInProgress: chapterInProgress || {},
            chapterIndex: chapterIndex || 0,
            sentenceInProgress: sentenceInProgress || {},
            words: words || [],
            acts: acts || [],
            topics: topics || [],
            chapters: chapters || []
        };
    }

    get title() { return this.metadata.title}
    get summary() { return this.metadata.summary}
    get author() { return this.metadata.author}
    get characters () { return this.metadata.characters}
    get step() { return this.state.step}
    get mode() { return this.state.mode}
    get details() { return this.state.chapterInProgress.details || [] }
    get words () { return this.state.words}
    get sentenceIndex() { return this.state.sentenceIndex}
    get sentenceInPractice() {  return this.details?.[this.sentenceIndex] }
    get sentenceInProgress() { return this.state.sentenceInProgress}
    get acts() { return this.state.acts }
    get topics() {return this.state.topics }

    nextSentence () {
        const newState = {...this.state, sentenceIndex: this.sentenceIndex + 1}
        return new StorySetup({ ...this.metadata, ...newState })
    }

    update(updates = {}) {
        const newMetadata = { ...this.metadata };
        const newState = { ...this.state };
        
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key in newMetadata) newMetadata[key] = value;
                else if (key in newState) newState[key] = value;
            }
        });
        
        return { ...newMetadata, ...newState };
    }
    
    rebuild(updates = {}) {
        const newSetup = this.update(updates)
        return new StorySetup(newSetup)
    }
}

export default StorySetup