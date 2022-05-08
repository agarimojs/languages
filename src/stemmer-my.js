const { BaseStemmer } = require('@nlpjs/core');
const TokenizerAspects = require('./tokenizer-aspects');
const aspects = require('./aspects/burmese-aspects.json');

class StemmerMy extends BaseStemmer {
  constructor(container) {
    super(container);
    this.tokenizer = new TokenizerAspects(this.container, true, aspects);
    this.name = 'stemmer-my';
  }

  innerStem() {
    // do nothing
  }

  tokenizeAndStem(str) {
    return this.tokenizer.tokenize(str);
  }
}

module.exports = StemmerMy;
