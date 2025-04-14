const prefetchAllAudio = async (awsUrl, title, totalLines, options = {}) => {
    const {
      maxRetries = 5,
      retryDelay = 3000,      // delay between normal retries
     
    } = options;
  
  
    const startFetchingAll = async () => {
        const cache = await caches.open("audio-lines-cache" + title);
      
      for (let i = 0; i < totalLines; i++) {
        fetchAndCache(cache, awsUrl, i, maxRetries, retryDelay, title);
      }
    };
  
   
    await startFetchingAll();
  };
  
export default prefetchAllAudio;

const fetchAndCache = async (cache, awsUrl, lineNumber, retriesLeft, retryDelay, title) => {
    const url = `${awsUrl}/script/${title}/audio/line-${lineNumber}.wav`;
    const alreadyCached = await cache.match(url);
    if (alreadyCached) return;

    try {
      const response = await fetch(url);
      if (response.ok) {
        await cache.put(url, response.clone());
        console.log(`✅ Cached line ${lineNumber}`);
      } else {
        if (retriesLeft > 0) {
          console.warn(`🔁 Line ${lineNumber} not ready, retrying...`);
          setTimeout(() => fetchAndCache(cache, awsUrl, lineNumber, retriesLeft - 1, retryDelay, title), retryDelay);
        } else {
          console.warn(`❌ Line ${lineNumber} failed after ${5} retries`);
        }
      }
    } catch (err) {
      if (retriesLeft > 0) {
        console.warn(`⚠️ Network error on line ${lineNumber}, retrying...`);
        setTimeout(() => fetchAndCache(cache, awsUrl, lineNumber, retriesLeft - 1, retryDelay, title), retryDelay);
      } else {
        console.error(`❌ Error caching line ${lineNumber}:`, err);
      }
    }
  };

const waitForLine0 = async (retriesLeft, headDelay, title, awsUrl) => {
    const line0Url = `${awsUrl}/script/${title}/audio/line-0.wav`;
    console.log(line0Url)
    try {
      const response = await fetch(line0Url, { method: "HEAD" });
      if (response.ok) {
        console.log("✅ Line 0 is ready. Starting full audio prefetch.");
        const cache = await caches.open("audio-lines-cache" + title);
        await fetchAndCache(cache, awsUrl, 0, 3, headDelay, title)
        return true;
      } else {
        console.warn(`⏳ Line 0 not ready yet. Retries left: ${retriesLeft}`);
      }
    } catch (err) {
      console.error(`⚠️ HEAD request error for line 0:`, err);
    }

    if (retriesLeft > 0) {
      await new Promise(resolve => setTimeout(resolve, headDelay));
      return waitForLine0(retriesLeft - 1, headDelay, title, awsUrl);
    } else {
      console.error("❌ Gave up waiting for line 0. Aborting prefetch.");
      return false;
    }
  };

// const getSafeUrl = (awsUrl, title, lineNumber) => {
//     // encode title to ensure consistency
//     const safeTitle = encodeURIComponent(title);
//     return `${awsUrl}/script/${safeTitle}/audio/line-${lineNumber}.wav`;
// };
  

export {
    waitForLine0,
}