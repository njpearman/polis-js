const request = require('request');
const Buffer = require('buffer/').Buffer;

const logError = (error) => { console.log('AccessToken: ' + error); };

module.exports = class AccessToken {
  constructor(props) {
    console.log("Props: " + JSON.stringify(props));
    this.requestConfig = props;
  }

  encodeCredentials() {
    let credentials = this.requestConfig.clientToken + ":" + this.requestConfig.clientSecret;
    return Buffer.from(credentials).toString('base64');
  }

  mapError(error) {
    return new Error('Unable to get an access token: ' + JSON.stringify(error))
  }

  mapResponse(response) {
    console.log("Access token response: " + JSON.stringify(response));
    this.value = JSON.parse(response.body).access_token;
    return this.value;
  };

  options(credentials) {
    let url = this.requestConfig.host + this.requestConfig.rootPath +
      '/accesstoken?grant_type=client_credentials';

    return {
      url: url,
      headers: {
        'Authorization': 'Basic ' + credentials,
        'Cache-Control': 'no-cache',
        'Content-Length': '0',
      }
    };
  }

  current() {
    console.log('Getting AccessToken.current() ...');
    return new Promise(
      (resolve, reject) => {
        console.log('I promise to access with ' + JSON.stringify(this.requestConfig));
        if(typeof(this.value) === 'string' && this.value.length > 0) {
          console.log('Already have a token');
          resolve(this.value);
        } else {
          request.post(this.options(this.encodeCredentials()),
                       (error, response) => {
            if(error) {
              console.log('No token :( ');
              reject(this.mapError(error));
            } else {
              console.log('Got token!');
              resolve(this.mapResponse(response));
            }
          });
        }
      }
    );
  }
}
