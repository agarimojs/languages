const suffixes = [
  // 'dakı',
  'dəki',
  'lar',
  'lər',
  'la',
  'lə',
  'ıb',
  // 'ub',
  // 'üb',
  'ım',
  'im',
  // 'um',
  'üm',
  'ın',
  'in',
  'un',
  'ün',
  'ıl',
  'il',
  'ul',
  'ül',
  'sı',
  'si',
  'ı',
  'i',
  'u',
  'ü',
  'mız',
  'miz',
  'muz',
  'müz',
  'nız',
  'niz',
  'nuz',
  'nüz',
  'əm',
  'ik',
  'uq',
  'ük',
  'sınız',
  'siniz',
  'sunuz',
  'sünüz',
  'dır',
  'mə',
  'aq',
  'ək',
  'ır',
  'acaq',
  'əcək',
  'ar',
  'ər',
  'a',
  'ə',
  'malı',
  'məli',
  'mış',
  'miş',
  'dı',
  'di',
  'du',
  'dü',
  'y',
  '-',
  'cı',
  'ci',
  'cu',
  'can',
  'cən',
  'dək',
  'ca',
  'cə',
  'sana',
  'sənə',
  'mı',
  'mi',
  'mu',
];

class StemmerAz {
  constructor() {
    this.suffixes = suffixes.map((x) => this.normalize(x));
  }

  normalize(str) {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  tokenize(str) {
    return str.split(/[\s,.!?;:([\]'"¡¿)/]+/).filter((x) => x);
  }

  stemWord(srcWord) {
    let word = srcWord;
    if (
      word.endsWith('lig') ||
      word.endsWith('lug') ||
      word.endsWith('lag') ||
      word.endsWith('cig') ||
      word.endsWith('cag') ||
      word.endsWith('ıg') ||
      word.endsWith('ug') ||
      word.endsWith('ag')
    ) {
      word = `${word.slice(0, -1)}q`;
    } else if (
      word.endsWith('iy') ||
      word.endsWith('uy') ||
      word.endsWith('əy')
    ) {
      word = `${word.slice(0, -1)}k`;
    } else if (word === 'ed') {
      word = 'et';
    } else if (word === 'ged') {
      word = 'get';
    }
    for (let i = 0; i < this.suffixes.length; i += 1) {
      if (word.endsWith(this.suffixes[i])) {
        word = word.slice(0, -this.suffixes[i].length);
        break;
      }
    }
    return word;
  }

  tokenizeAndStem(str) {
    const words = this.tokenize(this.normalize(str));
    return words.map((word) => this.stemWord(word)).filter((word) => word);
  }
}

module.exports = StemmerAz;
