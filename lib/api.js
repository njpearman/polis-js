const logError = (error) => { console.log('API: ' + JSON.stringify(error)); };

module.exports = class TcsPolis {
  constructor(client) {
    this.client = client;
  };

  asQueryString(parameters) {
    return this.client.paramsToQueryString(
      this.client.deleteNullParameters(parameters));
  }

  dataConditions(lang = 'en') {
    return Promise.reject(new Error('/dataconditions does not currently work'));
    return this.client.getOptions('/dataconditions', this.withLanguage(lang))
      .then(options => this.client.promiseToGet(options, response => response))
      .catch(logError);
  }

  locations(typeId = null, lang = 'en', parentId = null, date = null) {
    let queryString = this.withLanguage(lang, {
      locationtypeid: typeId,
      parentid: parentId,
      date: date
    });

    return this.client.getOptions('/locations', queryString)
      .then(options => this.client.promiseToGet(options, response => response.Location))
      .catch(logError);
  };

  location(id, lang = 'en') {
    if(typeof(id) !== 'number') {
      throw new Error('A location ID must be provided as an integer')
    }

    return this.client.getOptions('/locations/' + id, this.withLanguage(lang))
      .then(options => this.client.promiseToGet(options, response => response.Location))
      .catch(error => console.log('Could not get locations: ' + error));
  }

  parties(partyId = null, lang = 'en', locationId = null, electionId = null) {
    let queryString = this.withLanguage(lang, {
        partyid: partyId,
        locationid: locationId,
        electionid: electionId
      });

    return this.client.getOptions('/parties', queryString)
      .then(options => this.client.promiseToGet(options, response => response.Party))
      .catch(logError);
  }

  party(id, lang = 'en') {
    if(typeof(id) !== 'number') {
      throw new Error('A party ID must be provided as an integer')
    }

    return this.client.getOptions('/parties/' + id, this.withLanguage(lang))
      .then(options => this.client.promiseToGet(options, response => response.Party))
      .catch(logError);
  }

  officials(officialType = 33, lang = 'en') {
    if(officialType !== 33 && officialType !== 44) {
      throw new Error("Offical type must be either 33 (national council) or 44 (state council)")
    }

    let queryString = this.withLanguage(lang, { officialid: officialType });

    return this.client.getOptions('/official', queryString)
      .then(options => this.client.promiseToGet(options, response => response.Official))
      .catch(logError);
  }

  official(id, lang = 'en') {
    if(typeof(id) !== 'number') {
      throw new Error('An official ID must be provided as an integer')
    }

    return this.client.getOptions('/official/' + id, this.withLanguage(lang))
      .then(options => this.client.promiseToGet(options, response => {
        console.log('And we are back');
        return response.Official;
      }))
      .catch(logError);
  }

  withLanguage(lang, otherOptions = {}) {
    return this.asQueryString(Object.assign({}, otherOptions, {lang: lang}));
  }
}
