'use strict';

module.exports = function (app) {

  var async = require("async");
  var request = require("request");

  // configure
  var mapbox_token = app.mapbox.access_token;
  var serverUrl = app.serverUrl;
  var exchangeCoordsList = [];

  ////////////////////////////////////////////////////////////////////////////
  // Renders Page
  ////////////////////////////////////////////////////////////////////////////
  app.get('/', callbackGetPage);

  ////////////////////////////////////////////////////////////////////////////
  // API
  ////////////////////////////////////////////////////////////////////////////
  app.get('/api/all', callbackGetAllExchangeApi);
  app.get('/api/exchanges/:excParams/:excValue', callbackGetExchangeApi);
  app.get('/api/group-list/:excParams?/:excValue?', callbackGetGroupListApi);
  app.get('/api/filter-by', callbackGetFilterByListApi);

  ////////////////////////////////////////////////////////////////////////////
  // Call back functions
  ////////////////////////////////////////////////////////////////////////////
  /* GET home page. */
  function callbackGetPage(req, res, next) {

    res.render('index', {
      title: 'Exchange List',
      serverUrl: serverUrl,
      access_token: mapbox_token
    });
  }

  function callbackGetAllExchangeApi(req, res) {
    var target = "exchanges-nodes/",
        exchangeList = [];
    getRequestApi(target, function(d) {
      if (d.statusCode == 200) {
        exchangeList = d;
      }
      return res.json(d);
    });
  }

  function callbackGetGroupListApi(req, res) {
    var parameters = req.params.excParams || "",
        values = req.params.excValue || "";
    var target = "exchanges-groups/",
        exchangeList = [];

    if (parameters.length > 0 && values.length > 0) {
      parameters = encodeURIComponent(parameters.toUpperCase());
      values = encodeURIComponent(values);
      target += "?"+parameters+"="+values;
    }

    getRequestApi(target, function(d) {
      if (d.statusCode == 200) {
        exchangeList = d;
      }
      return res.json(d);
    });
  }

  function callbackGetExchangeApi(req, res) {
    var parameters = req.params.excParams,
        values = encodeURIComponent(req.params.excValue);
    parameters = encodeURIComponent(parameters.toUpperCase());

    var target = "exchanges-nodes/?"+parameters+"="+values,
        exchangeList = [];
    getRequestApi(target, function(d) {
      if (d.statusCode == 200) {
        exchangeList = d;
      }
      return res.json(d);
    });
  }

  function callbackGetFilterByListApi(req, res) {
    var parameters = req.query;
    var target = "exchanges-nodes/",
        exchangeList = [];

    if (!isEmpty(parameters)) {
      var num = 0;
      target += "?";
      for (var i in parameters) {
        num++;
        if (num > 0) target += "&";
        var params = i,
            values = parameters[i];

        params = encodeURIComponent(params.toUpperCase());
        values = encodeURIComponent(values);
        target += params+"="+values;
      }
    }
    //console.log("target",target);
    getRequestApi(target, function(d) {
      if (d.statusCode == 200) {
        exchangeList = d;
      }
      return res.json(d);
    });
  }

  /**
   * To get data from exchange api
   */
  function getRequestApi(target, callback) {
    // timeout at 15 seconds
    var timeout = 40*10000;
    var path = "http://"+serverUrl+"/"+target;

    console.log("path: " + path);
    return request.get({
      url: path,
      method: "GET",
      timeout: timeout
    }, function (error, response, body) {
      if (error) {
        console.log("error",error);
        var statusCode = 408;
        var errorMsg = error.toString();
        var errObj = {
          statusCode: error.bytesParsed || statusCode,
          message: error.code || "Timeout!",
          Data: []
        };
        if (typeof response == 'undefined') {
          callback(errObj);
        }
        console.log(response);
        if (typeof response != 'undefined' && response.hasOwnProperty("statusCode")) statusCode=response.statusCode;
        if (typeof body != 'undefined' && body.hasOwnProperty("error")) errorMsg=body.error.toString();
        callback({
          statusCode: statusCode || 400,
          message: errorMsg,
          Data: []
        });
      }
      var d = JSON.parse(body);
      console.log("d", typeof d);
      callback({
        statusCode: response.statusCode,
        message: d.result || "OK",
        Data: d.data
      })

    });
  }

  function isEmpty(obj) {
    for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
        return false;
    }

    return true;
  }
};
