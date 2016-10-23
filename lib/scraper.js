const cheerio = require('cheerio');
const AnswerSection = require('./answer-section');
const Answer = require('./answer');

module.exports = class Scraper {
  constructor(loader) {
    this.loader = loader;
  }

  scrape(url) {
    const self = this;
    return new Promise((resolve, reject) =>
      self.loader.get(url).then((body) => {
        const $ = cheerio.load(body);

        const answers = [];
        $('div.answer').each((i, elem) => answers.push(self.scrapeAnswer(elem)));

        return resolve(answers);
      })
      .catch(reject)
    );
  }

  scrapeAnswer(elem) {
    const sections = [];
    const $ = cheerio.load(elem);
    $('.post-text').children().each((i, child) => {
      if (child.tagName === 'pre') {
        return sections.push(new AnswerSection('code', $(child).text()));
      } else if (child.tagName === 'p') {
        return sections.push(new AnswerSection('text', $(child).text()));
      }
      return sections;
    });

    const author = $('.user-details a').text().trim();
    const votes = parseInt($('.vote-count-post').text(), 10);
    const accepted = $('span.vote-accepted-on').length === 1;

    return new Answer(author, votes, accepted, sections);
  }
};
