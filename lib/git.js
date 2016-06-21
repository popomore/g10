'use strict';

const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const ini = require('ini');
const assert = require('assert');
const giturl = require('giturl');


const defaults = {
  'clone.base': path.join(process.env.HOME, 'g10'),
};

class Git {

  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig() {
    const configPath = path.join(process.env.HOME, '.g10');
    let config = {};
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, '');
    } else {
      config = ini.parse(fs.readFileSync(configPath, 'utf8'));
    }

    return Object.assign({}, defaults, config);
  }

  * run(action, args) {
    args = args || [];
    if (this[action]) {
      yield this[action](args);
    } else {
      yield this.origin(action, args);
    }
  }

  /**
   * g clone https://github.com/popomore/g10
   * will clone to $base/github.com/popomore/g10
   * @param {Array} args 参数
   */
  * clone(args) {
    const originalUrl = args[0];
    assert(originalUrl);
    const url = giturl.parse(originalUrl);
    const base = this.config['clone.base'].replace(/^~/, process.env.HOME);
    const dest = path.join(base, url.replace(/https?:\/\//, ''));
    yield this.origin('clone', [ originalUrl, dest ]);
    console.info('clone %s into %s', originalUrl, dest);
  }

  origin(action, args) {
    const arr = [ action ];
    args.forEach(arg => arr.push(arg));
    return new Promise(function(resolve, reject) {
      const git = cp.spawn('git', arr, { stdio: 'inherit' });
      git.once('error', reject);
      git.once('exit', function(code) {
        if (code !== 0) {
          reject(new Error('exit with code ' + code));
        } else {
          resolve();
        }
      });
    });
  }

}

module.exports = Git;
