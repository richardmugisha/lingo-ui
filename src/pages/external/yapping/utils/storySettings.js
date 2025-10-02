class StorySetup {
    constructor({ title, summary, imageUrl, author, step, mode, details, sentenceIndex, sentenceInProgress, words, suggestedWords, acts, characters, _id, outline, selectedIndices, operation, editableText, typeSettings, chapters, scene }) {
        this.metadata = { _id, title, summary, imageUrl, author, characters, outline, typeSettings: typeSettings || {}, chapters: chapters || [] };
        this.state = { 
            step: step || "onboarding", 
            mode: mode || "create", 
            details: details || "", 
            scene: scene,
            sentenceIndex: mode === "create" ? details?.length: sentenceIndex, 
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
    get imageUrl() { return this.metadata.imageUrl }
    get outline() { return this.metadata.outline }
    get title() { return this.metadata.title}
    get summary() { return this.metadata.summary}
    get author() { return this.metadata.author}
    get characters () { return this.metadata.characters}
    get step() { return this.state.step}
    get mode() { return this.state.mode}
    get details() { return this.state?.details || ""}
    get scene() { return this.state.scene }
    get words () { return this.state.words}
    get suggestedWords () { return this.state.suggestedWords }
    get sentenceIndex() { return this.details.length}
    // get sentenceInPractice() {  return this.state.mode === "practice" && this.details?.[this.sentenceIndex] }
    // get sentenceInProgress() { return this.state.sentenceInProgress}
    get acts() { return this.state.acts }
    get selectedIndices() { return this.state.selectedIndices }
    get operation () { return this.state.operation }
    get editableText () { return this.state.editableText }
    get typeSettings () { return this.metadata.typeSettings }
    get chapters () { return this.metadata.chapters }

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

    reset(newWhat) {
        this.state.details = ""
        this.state.sentenceInProgress = {}
        this.state.sentenceIndex = newDetails.length

        return this
    }
}

export default StorySetup