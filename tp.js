var _ = require('lodash');
var request = require('request');
var readline = require('readline');

var config = {
  baseUrl: 'https://targetprocess.cisco.com/api/v1',
  token: 'YOUR_TOKEN',
  filter: "(EntityState.Name ne 'Completed') and (Owner.Id eq 'YOUR_USERID')",
  payload: {
    "Description":"", // no descrption for now
    "User":{
      "Id":YOUR_USERID
    },
    "Role":{
      "Id":1 // I assume you are a developer(roleId == 1)
    }
  },
  opts: {
    rejectUnauthorized: false,
    json: true,
  }
};

var Tasks = function(config){
  this.config = config;
  var that = this;
  this.update = function(){
    var opts = _.extend({}, that.config.opts, {
      uri: that.config.baseUrl+'/Tasks?token=' + that.config.token,
      qs: {
        where: that.config.filter
      }
    });
    request(opts, function(err, res, json) {
      if (typeof json === 'string') {
        err = new Error("Couldn't find resource at "+ opts.uri);
      }

      if (json && json.Error) {
        err = new Error(json.Error.Message);
      }

      if (typeof err === 'string') {
        err = new Error(err);
      }

      // normalize reponse data
      if (json && json.Items) {
        json = json.Items;
      }

      var id2Remain = {};
      json.forEach(function(task) {
        console.log(task.Id + '| ' + task.Name + '| Spent: ' + task.TimeSpent + '| Remain: ' + task.TimeRemain);
        id2Remain[task.Id] = task.TimeRemain;
      });

      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      rl.question('\nTo update hours, format: taskId|hourSpent, taskId2|hourSpent, ...\n', function(line) {
        var pairs = line.split(',');
        pairs.forEach(function(pair){
          var inputs = pair.split('|');
          var taskId = inputs[0].trim();
          var hourSpent = inputs[1].trim();
          var hourRemain = parseInt(id2Remain[taskId], 10) - parseInt(hourSpent, 10);
          hourRemain = hourRemain > 0 ? hourRemain.toString() : '0';
          that._updateTime(taskId, hourSpent, hourRemain);
        });

        rl.close();
      });
    });
  };

  this._updateTime = function(taskId, hourSpent, hourRemain){
    var payload = _.extend({}, this.config.payload, {
      "Assignable":{
        "Id": taskId
      },
      "Spent": hourSpent,
      "Remain": hourRemain
    });
    var opts = _.extend({}, this.config.opts, {
      uri: this.config.baseUrl+'/Times/?token=' + this.config.token,
      json: payload
    });
    request.post(opts, function(err, res, body) {
      if (res.statusCode == 201) {
        console.log('Time updated for task: ', body.Task.Id);
        console.log('New remain hour: ', body.Remain);
      } else {
        err = new Error(err);
      }
    });
  };

};

new Tasks(config).update();

