require('dotenv').config();

const Client = require('./lib/client.js');
const Polis = require('./lib/api.js');

const CLIENT_KEY    = process.env.CLIENT_TOKEN;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

let client = new Client(CLIENT_KEY, CLIENT_SECRET)
let polisApi = new Polis(client);

const logError = (error) => { 'Script: ' + console.log(error); };

console.log('*** Testing /locations ***');
polisApi.locations(2, 'en', 1, '2013-04-01')
   .then(locations => {
     console.log('How many locations? ' + locations.length);

     console.log('*** Testing /parties ***');
     polisApi.parties()
       .then(party => {
         console.log('How many parties?  ' + party.length + '!!!')

         console.log('*** Testing /official ***');
         polisApi.officials()
           .then(officials => {
             console.log('How many officials...?  ' + officials.length);

             polisApi.official(44)
               .then(official => {
                 console.log('How many "44" officials...?  ' + official);
                 console.log('Officials: ' + JSON.stringify(official));

                 console.log('*** Testing /dataconditions ***')
                 polisApi.dataConditions()
                   .then(conditions => console.log(JSON.stringify(conditions)))
                   .catch(logError);
               })
           })
       });
   })
   .catch(logError);
