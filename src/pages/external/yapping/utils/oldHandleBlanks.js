const handleBlanksGen = (sentence, expressions) => {
    const removePunctuation = str => str.replace(/[.,/#!$%^&*;:{}=\-_`~()?"']/g, "");
    const toCleanWords = str => removePunctuation(str).toLowerCase().trim().split(" ");
  
    const originalChunks = sentence.trim().split(" ");
    const cleanChunks = originalChunks.map(chunk => removePunctuation(chunk.toLowerCase()));
    const usedExpressions = {};
  
    const blankedChunks = originalChunks.map((originalChunk, index) => {
      const cleanChunk = cleanChunks[index];
  
      for (const rawExpr of expressions) {
        const expression = removePunctuation(rawExpr).toLowerCase();
        
        for (const word of expression.split(" ")) {
          const threshold = Math.max(word.length / 2, 5);
          // console.log(word, sentence, cleanChunk || "sub-holder", cleanChunk.slice(0, threshold).includes(word.slice(0, threshold)))
          if (cleanChunk.slice(0, threshold).includes(word.slice(0, threshold))) {
            usedExpressions[rawExpr] = (usedExpressions[rawExpr] || 0 ) + 1
            console.log(expression, originalChunk, cleanChunk.slice(0, threshold), word.slice(0, threshold), threshold)
            return '-'.repeat(5); // You can adjust blank length if needed
          }
        }
        
      }
  
      return originalChunk; // Return untouched original chunk
    });
  
    return {
      blanked: blankedChunks.join(" "),
      usedExpressions: Object.keys(usedExpressions).filter(k => usedExpressions[k] >= k.split(" ").length / 2)
    };
};