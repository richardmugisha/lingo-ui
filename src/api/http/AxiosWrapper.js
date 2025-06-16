import axios from 'axios';

class AxiosWrapper {
  constructor(throttleGap = 200) {
    this.lastCalled = {}; // { [method:url]: timestamp }
    this.throttleGap = throttleGap;
    console.log('AxiosWrapper initialized with throttleGap:', throttleGap);
  }

  // Internal throttle check
  _shouldThrottle(method, url) {
    const now = Date.now();
    const key = `${method}:${url}`;
    const lastTime = this.lastCalled[key] || 0;
    const timeDiff = now - lastTime;
    
    // console.log('Throttle Check:', {
    //   method,
    //   url,
    //   key,
    //   now,
    //   lastTime,
    //   timeDiff,
    //   throttleGap: this.throttleGap,
    //   shouldThrottle: timeDiff < this.throttleGap
    // });

    if (timeDiff < this.throttleGap) return true;
    this.lastCalled[key] = now;
    return false;
  }

  // Base request
  async _request(method, url, ...args) {
    console.log('Request started:', { method, url, timestamp: Date.now() });
    
    if (this._shouldThrottle(method, url)) {
      console.log('Request throttled:', { method, url });
      return Promise.reject({ message: `Throttled: ${method.toUpperCase()} ${url}` });
    }
    
    try {
      console.log('Making request:', { method, url });
      const response = await axios[method](url, ...args);
      console.log('Request successful:', { method, url });
      return response;
    } catch (err) {
      console.log('Request failed:', { method, url, error: err.message });
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
