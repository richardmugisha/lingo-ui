class StorySetup {
    constructor({ title, summary, author, step, mode, details, sentenceIndex, sentenceInProgress, words, suggestedWords, acts, characters, _id, outline, selectedIndices, operation, editableText }) {
        this.metadata = { _id, title, summary, author, characters, outline };
        this.state = { 
            step: step || "onboarding", 
            mode: mode || "create", 
            details: details || [], 
            sentenceIndex: mode === "create" ? details.length: sentenceIndex, 
            sentenceInProgress: sentenceInProgress || {},
            words: words || [],
            suggestedWords: suggestedWords || [],
            acts: acts || [],
            selectedIndices: selectedIndices || [],
            operation: operation, //delete or edit,
            editableText: editableText || "",
        };
    }
    get _id() { return this.metadata._id }
    get outline() { return this.metadata.outline }
    get title() { return this.metadata.title}
    get summary() { return this.metadata.summary}
    get author() { return this.metadata.author}
    get characters () { return this.metadata.characters}
    get step() { return this.state.step}
    get mode() { return this.state.mode}
    get details() { return this.state.details}
    get words () { return this.state.words}
    get suggestedWords () { return this.state.suggestedWords }
    get sentenceIndex() { return this.details.length}
    get sentenceInPractice() {  return this.state.mode === "practice" && this.details?.[this.sentenceIndex] }
    get sentenceInProgress() { return this.state.sentenceInProgress}
    get acts() { return this.state.acts }
    get selectedIndices() { return this.state.selectedIndices }
    get operation () { return this.state.operation }
    get editableText () { return this.state.editableText }

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