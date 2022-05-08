const { BaseStemmer } = require('@nlpjs/core');
const TokenizerAspects = require('./tokenizer-aspects');
const aspects = require('./aspects/khmer-aspects.json');

class StemmerKm extends BaseStemmer {
  constructor(container) {
    super(container);
    this.tokenizer = new TokenizerAspects(this.container, true, aspects);
    this.name = 'stemmer-km';
  }

  innerStem() {
    // do nothing
  }

  tokenizeAndStem(str) {
    return this.tokenizer.tokenize(str);
  }
}

module.exports = StemmerKm;
