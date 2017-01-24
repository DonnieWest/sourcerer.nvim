const SearchEngine = require('../../lib/search');
const PageLoader = require('../../lib/page-loader');
const Scraper = require('../../lib/scraper');
const AnswerSelector = require('../../lib/answer-selector');

const search = new SearchEngine();
const loader = new PageLoader();
const scraper = new Scraper(loader);
const selector = new AnswerSelector(scraper);

function getLineOrBuffer(nvim, range, callback) {
  if (range[0] === range[1]) {
    nvim.getCurrentLine((err, line) => {
      callback(err, line);
    });
  } else {
    nvim.getCurrentBuffer((err, buffer) => {
      buffer.getLineSlice(range[0], range[1], true, false, (err, lines) => {
        callback(err, lines.join(' '));
      });
    });
  }
}

function getConfiguration(nvim, callback) {
  nvim.eval('g:sourcerer_minimum_votes', (err, minVotes) => {
    nvim.eval('g:sourcerer_minimum_snippets', (err, minSnippets) => {
      nvim.eval('g:sourcerer_feeling_lucky', (err, feelingLucky) => {
        nvim.eval('g:sourcerer_insert_answer_text', (err, insertText) => {
          nvim.getCurrentBuffer((err, buffer) => {
            buffer.getOption('commentstring', (err, commentText) => {
              callback(err, {
                minVotes,
                minSnippets,
                feelingLucky,
                insertText,
                commentText,
              });
            });
          });
        });
      });
    });
  });
}

function fetch(range, nvim, cb) {
  getConfiguration(nvim, (err, config) => {
    nvim.eval('&filetype', (err, language) => {
      nvim.getCurrentBuffer((err, buffer) => {
        getLineOrBuffer(nvim, range, (err, query) => {
          search.searchGoogle(query, language).then(soLinks =>
            selector.find(soLinks, {
              numAnswers: config.minSnippets,
              minVotes: config.minVotes,
            })).then((answers) => {
              if (config.feelingLucky) {
                const best = answers[0];
                const answer = best.getAnswer({
                  insertDescription: config.insertText,
                  credit: true,
                  commentText: config.commentText,
                });
                buffer.setLineSlice(range[0], range[1], true, true, answer, cb);
              } else {
                let counter = 0;
                let message = '';
                for (const answer of answers) {
                  const answerText = answer.getAnswer({
                    insertDescription: true,
                    credit: false,
                    commentText: config.commentText,
                  }).join('\n');
                  message += `-------${counter}-------\n${answerText}\n`;
                  counter++;
                }
                message += 'Which answer looks correct? ';
                nvim.callFunction('input', [message], (error, index = 0) => {
                  const best = answers[index];
                  const answer = best.getAnswer({
                    insertDescription: config.insertText,
                    credit: true,
                    commentText: config.commentText,
                  });
                  buffer.setLineSlice(range[0], range[1], true, true, answer, cb);
                });
              }
            });
        });
      });
    });
  });
}


plugin.commandSync('Sourcerer', {
  range: '',
  nargs: '*',
}, (nvim, args, range, cb) => {
  try {
    fetch(range, nvim, cb);
  } catch (err) {
    cb(err);
  }
});
