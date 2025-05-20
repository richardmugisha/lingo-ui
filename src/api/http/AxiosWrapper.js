import axios from 'axios';

class AxiosWrapper {
  constructor(throttleGap = 200) {
    this.lastCalled = {}; // { [url]: timestamp }
    this.throttleGap = throttleGap;
  }

  // Internal throttle check
  _shouldThrottle(url) {
    const now = Date.now();
    const lastTime = this.lastCalled[url] || 0;
    if (now - lastTime < this.throttleGap) return true;
    this.lastCalled[url] = now;
    return false;
  }

  // Base request
  async _request(method, url, ...args) {
    if (this._shouldThrottle(url)) {
      Promise.reject({ message: `Throttled: ${url}` });
    }
    
    try {
      const response = await axios[method](url, ...args);
      return response
    } catch (err) {
      throw err;
    }
  }

  // Public versions: same signature as axios
  get(url, config) {
    return this._request('get', url, config);
  }

  post(url, data, config) {
    return this._request('post', url, data, config);
  }

  patch(url, data, config) {
    return this._request('patch', url, data, config);
  }

  delete(url, config) {
    return this._request('delete', url, config);
  }
}

export default new AxiosWrapper();
