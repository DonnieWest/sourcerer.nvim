module.exports = class Answer {
  constructor(author, votes, accepted, sections) {
    this.author = author;
    this.votes = votes;
    this.accepted = accepted;
    this.sections = sections;
  }

  hasCode() {
    return (this.sections.filter(section => section.isCode())).length > 0;
  }

  getAnswer({
    insertDescription,
    credit,
    commentText,
  }) {
    const result = [];
    if (credit) {
      const creditText = commentText.replace('%s', ` ~ Snippet by StackOverflow user ${this.author} from an answer with ${this.votes} votes. ~`).replace(/\r?\n|\r/g, ' ');
      result.push(creditText);
    }

    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      if (section.isCode() || insertDescription) {
        for (let sect of section.body.split(/\r?\n|\r/g)) {
          if (section.isText()) {
            sect = commentText.replace('%s', sect);
          }
          result.push(sect);
        }
        result.push('');
      }
    }
    return result;
  }
};
