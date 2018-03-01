const request = require('request');
const Buffer = require('buffer/').Buffer;
const AccessToken = require('./accessToken.js');

const HOST          = 'https://api.srgssr.ch';
const ROOT_PATH     = '/polis-api/v2';

const logError = (error) => { console.log('Client: ' + error); };

module.exports = class Client {
  constructor(clientToken, clientSecret, host = HOST, rootPath = ROOT_PATH) {
    this.clientToken = clientToken;
    this.clientSecret = clientSecret;
    this.host = host;
    this.rootPath = rootPath;
  }

  currentAccessToken() {
    console.log('Getting current token...');
    if(typeof(this.accessToken) === 'undefined') {
      let props = Object.assign({}, this, {rootPath: '/oauth/v1'});
      this.accessToken = new AccessToken(props);
    }

    return this.accessToken.current();
  }

  deleteNullParameters(parameters) {
    Object.keys(parameters).forEach((key) => {
      if(parameters[key] === null){
        delete parameters[key];
      }
    });

    return parameters;
  }

  getOptions(endpoint, queryString = '') {
    console.log('Sending query string ' + queryString);
    return new Promise((resolve, reject) => {
      this.currentAccessToken().then((token) => {
        resolve({
          url: this.host + this.rootPath + endpoint + queryString,
          headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
          }
        });
      }).catch(error => {
        reject(new Error('Client unable to get access token', error));
      });
    });
  }

  paramsToQueryString(parameters) {
    let asString = Object.keys(parameters)
      .map((key) => key + '=' + parameters[key])
      .join('&');

    return '?' + asString;
  }

  promiseToGet(options, mapResponse) {
    return new Promise(
      (resolve, reject) => {
        console.log('I promise to respond to ' + options.url);
        request.get(options, (error, response) => {
          if(error) {
            if(typeof(response) !== 'undefined') {
              console.log('Got error from \n' + JSON.stringify(response));
            }
            console.log('No good: ' + JSON.stringify(error));
            reject(new Error('No good: ' + JSON.stringify(error)));
          } else {
            console.log('Got successful response');
            resolve(mapResponse(JSON.parse(response.body)));
          }
        });
      }
    );
  }
}
