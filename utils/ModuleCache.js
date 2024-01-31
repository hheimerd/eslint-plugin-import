'use strict';

const {createMemo} = require("./createMemo");
exports.__esModule = true;

const log = require('debug')('eslint-module-utils:ModuleCache');


class ModuleCache {
  constructor() {
    this.map = createMemo();
  }

  /**
   * returns value for returning inline
   * @param {[type]} cacheKey [description]
   * @param {[type]} result   [description]
   */
  set(cacheKey, result) {
    this.map.set(cacheKey, { result, lastSeen: process.hrtime() });
    log('setting entry for', cacheKey);
    return result;
  }

  get(cacheKey, settings) {
    const f = this.map.get(cacheKey);
    if (f) {
      // check freshness
      if (process.hrtime(f.lastSeen)[0] < settings.lifetime) { return f.result; }
    } else {
      log('cache miss for', cacheKey);
    }
    // cache miss
    return undefined;
  }

}

ModuleCache.getSettings = function (settings) {
  const cacheSettings = Object.assign({
    lifetime: 30,  // seconds
  }, settings['import/cache']);

  // parse infinity
  if (cacheSettings.lifetime === '∞' || cacheSettings.lifetime === 'Infinity') {
    cacheSettings.lifetime = Infinity;
  }

  return cacheSettings;
};

exports.default = ModuleCache;
