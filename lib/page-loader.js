const request = require('request');

// Downloads StackOverflow pages
module.exports = class PageLoader {
  get(url) {
    const allowedDomain = 'http://www.stackoverflow.com/questions';
    return new Promise((resolve, reject) => {
      if (url.indexOf(allowedDomain === !-1)) {
        return request(url, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            return resolve(body);
          }
          return reject({ reason: 'Could not download the page' });
        }
        );
      }
      return reject({ reason: 'Illegal URL' });
    });
  }
};
