module.exports = class AnswerSelector {
  constructor(scraper) {
    this.scraper = scraper;
  }

  find(urls, { numAnswers, minVotes }) {
    const self = this;
    return new Promise((resolve, reject) => {
      let foundAnswers = [];
      const findAnswersRecursive = () => {
        if (urls.length === 0) {
          if (foundAnswers.length === 0) {
            return reject({ reason: 'Couldn\'t find any relevant answers' });
          }
          return resolve(foundAnswers);
        } else {
          const currentLink = urls.shift();
          return self.scraper.scrape(currentLink).then((newAnswers) => {
            foundAnswers = foundAnswers.concat(self.filter(newAnswers, minVotes));
            if (foundAnswers.length >= numAnswers) {
              return resolve(self.sort(foundAnswers).slice(0, numAnswers));
            }
            return findAnswersRecursive();
          })
          .catch(() => findAnswersRecursive());
        }
      };

      return findAnswersRecursive();
    });
  }

  sort(answers) {
    return answers.sort((a, b) => b.votes - a.votes);
  }

  filter(answers, minVotes) {
    return answers.filter(answer => answer.accepted || answer.votes > minVotes);
  }
};
