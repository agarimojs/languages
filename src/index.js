const langAll = require('@nlpjs/lang-all');
const StemmerKm = require('./stemmer-km');
const StemmerMy = require('./stemmer-my');

const stemmers = {};
const processors = {};

let defaultNormalize = (str) =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

let defaultTokenize = (text) =>
  text.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);
let defaultStem = (str) =>
  defaultTokenize(defaultNormalize(str)).filter((x) => x);
const stem = {
  tokenizeAndStem: defaultStem,
};

let preProcessor;
let postProcessor;

async function initProcessors() {
  const tokenizerTh = new langAll.TokenizerTh();
  const stemmerZh = new langAll.StemmerZh();
  const stemmerJa = new langAll.StemmerJa();
  await stemmerJa.init();
  stemmers.ja = {
    tokenizeAndStem: (str) => {
      const tokens = stemmerJa.formalityLevel(str).informalTokens;
      return tokens
        .map((token) =>
          token.replace(
            /[＿－・，、；：！？．。（）［］｛｝｢｣＠＊＼／＆＃％｀＾＋＜＝＞｜～≪≫─＄＂_\-･,､;:!?.｡()[\]{}「」@*/&#%`^+<=>|~«»$"\s]+/g,
            ''
          )
        )
        .filter((token) => token !== '');
    },
  };
  stemmers.km = new StemmerKm();
  stemmers.my = new StemmerMy();
  stemmers.nb = langAll.getStemmer('no');
  stemmers.th = { tokenizeAndStem: (str) => tokenizerTh.tokenize(str) };
  stemmers.zh = { tokenizeAndStem: (str) => stemmerZh.processText(str) };
}

function getProcessor(srcLocale) {
  const locale = srcLocale.slice(0, 2);
  if (!processors[locale]) {
    if (!stemmers[locale]) {
      try {
        const stemmer = langAll.getStemmer(locale);
        stemmers[locale] = stemmer;
      } catch (e) {
        stemmers[locale] = stem;
      }
    }
    processors[locale] = (srcStr) => {
      const str = preProcessor ? preProcessor(srcStr) : srcStr;
      const tokens = stemmers[locale].tokenizeAndStem(str);
      return postProcessor ? postProcessor(tokens) : tokens;
    };
  }
  return processors[locale];
}

function setProcessor(srcLocale, processor) {
  const locale = srcLocale.slice(0, 2);
  processors[locale] = processor;
}

const getDefaultNormalize = () => defaultNormalize;
const setDefaultNormalize = (value) => (defaultNormalize = value);
const getDefaultTokenize = () => defaultTokenize;
const setDefaultTokenize = (value) => (defaultTokenize = value);
const getDefaultStem = () => defaultStem;
const setDefaultStem = (value) => (defaultStem = value);
const getPreProcessor = () => preProcessor;
const setPreProcessor = (value) => (preProcessor = value);
const getPostProcessor = () => postProcessor;
const setPostProcessor = (value) => (postProcessor = value);

module.exports = {
  initProcessors,
  getProcessor,
  setProcessor,
  getDefaultNormalize,
  setDefaultNormalize,
  getDefaultTokenize,
  setDefaultTokenize,
  getDefaultStem,
  setDefaultStem,
  getPreProcessor,
  setPreProcessor,
  getPostProcessor,
  setPostProcessor,
};
