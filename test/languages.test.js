const { initProcessors, getProcessor } = require('../src');

describe('Process spanish', () => {
  it('should process spanish sentence', async () => {
    await initProcessors();
    const sentence = 'Hola, como estas?';
    const actual = getProcessor('es')(sentence);
    expect(actual).toEqual(['hol', 'como', 'esta']);
  });
});
