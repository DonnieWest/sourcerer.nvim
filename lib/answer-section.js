module.exports = class AnswerSection {
  constructor(type, body) {
    this.type = type;
    this.body = body;
    if (this.type !== 'text' && this.type !== 'code') {
      throw new Error('Illegal type');
    } else if (this.body === '') {
      throw new Error('Illegal body size');
    }
  }

  isText() { return this.type === 'text'; }
  isCode() { return this.type === 'code'; }
};
