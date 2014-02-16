var util = require('util');
var expect = require('chai').expect;
var logger = require('../..');

var Component = function(parent, bitwise) {
  this.message = 'mock %s message';
  this.name = 'subcomponent';
  var options = {component: this.name};
  if(bitwise) options.level = logger.BW_INFO;
  this.logger = parent.child(options, bitwise);
}

Component.prototype.print = function() {
  this.logger.info(this.message, this.name);
}

describe('cli-logger:', function() {
  it('should create child logger (json)', function(done) {
    var name = 'mock-child-logger';
    var conf = {name: name, json: true};
    var log = logger(conf);
    var child = new Component(log);
    var msg = util.format(child.message, child.name);
    child.logger.on('write', function(record, stream) {
      expect(record).to.be.an('object');
      expect(record.component).to.eql(child.name);
      expect(record.msg).to.eql(msg);
      done();
    })
    child.print();
  });
  it('should create bitwise child logger (json)', function(done) {
    var name = 'mock-child-logger';
    var conf = {name: name, json: true};
    var log = logger(conf);
    var child = new Component(log, true);
    expect(log.level()).to.eql(logger.INFO);
    expect(child.logger.level()).to.eql(logger.BW_INFO);
    var msg = util.format(child.message, child.name);
    child.logger.on('write', function(record, stream) {
      expect(record).to.be.an('object');
      expect(record.component).to.eql(child.name);
      expect(record.msg).to.eql(msg);
      done();
    })
    child.print();
  });
  // TODO: assert on appending streams on child
  // TODO: assert on inheriting parent serializers once implemented
})
