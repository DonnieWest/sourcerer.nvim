const google = require('google');

google.resultsPerPage = 10;

module.exports = class Search {
  buildSearchString(query, language) {
    const normalizedQuery = query.toLowerCase().trim();
    return `${normalizedQuery} in ${language} site:stackoverflow.com`;
  }

  searchGoogle(query, language) {
    const self = this;
    return new Promise((resolve, reject) => {
      const searchQuery = self.buildSearchString(query, language);
      return google(searchQuery, (err, res) => {
        if (err) {
          return reject({ reason: 'Google Error - are you online?' });
        } else if (res.links.length === 0) {
          return reject({ reason: 'No results were found' });
        }
        return resolve(res.links.map(item => item.link));
      });
    });
  }
};
