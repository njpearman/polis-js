# A project for SRG SSR hackday 2018

This client is for use against the tpc Polis API as defined on 1st March, 2018 during the [SSR SRG Hackdays 2018](https://www.srgssr.ch/en/news-media/news/hackdays-2018/).  [The API is documented here](https://developer.srgssr.ch/apis/tpc-polis)


Endpoints are called as Promises.  Each call will first request an access token if one hasn't been stored already, or use the token that was requested previously.

There is very little robust error handling at this point and no way to renew access tokens if they expire.

The host and root path for the API are configured statically in the `lib/api.js` file, pinned to the v2 of the API available during the two days of the hackathon.

## Usage

Create an instance of the `Client`, which will include you client key and secret, then create an instance of the `API` using the client.  Endpoints can then be called against the `API`.

```javascript
const Client = require('./lib/client.js');
const Polis = require('./lib/api.js');

const CLIENT_TOKEN    = '<token>';
const CLIENT_SECRET = '<secret>';

let client = new Client(CLIENT_TOKEN, CLIENT_SECRET)
let polisApi = new Polis(client);
```
