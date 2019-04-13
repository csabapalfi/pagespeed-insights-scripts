const {check, parseArgs} = require('../lib/cli-options');

describe('cli-options', () => {
  const url = 'https://www.google.com';
  const mockArgv = (args = []) => ['node', 'pagespeed-score', ...args];

  describe('check', () => {
    it('throws if URL missing', () => {
      expect(() => check({_:mockArgv([])}))
        .toThrow('URL is required');
    });

    it('throws if URL is invalid', () => {
      expect(() => check({_:mockArgv(['oops'])}))
        .toThrow('Invalid URL');
    });

    it('returns truthy if valid URL', () => {
      expect(() => check({_:mockArgv([url])}))
        .toBeTruthy()
    });
  });

  describe('parseArgs', () => {
    const argv = mockArgv([url]);
    it('returns defaults based on argv', () => {
      expect(parseArgs(argv))
        .toMatchSnapshot();
    });
  });
});