'use strict';

const path = require('path');
const coffee = require('coffee');
const mm = require('mm');
const bin = require.resolve('../bin/g');


describe('test/g.test.js', function() {

  it('should run without hook', function(done) {
    coffee.fork(bin, [''])
    .debug()
    .end(done);
  });

  it.only('should clone', function(done) {
    mm(process.env, 'HOME', path.join(__dirname, 'fixtures/clone'));
    coffee.fork(bin, ['clone', 'https://github.com/popomore/coffee'])
    .debug()
    .expect('code', 0)
    .end(done);
  });
});
