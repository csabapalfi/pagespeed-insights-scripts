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

    it('allows if valid URL', () => {
      expect(check({_:mockArgv([url])}))
        .toBeTruthy()
    });

    it('allows if local + lantern-debug', () => {
      expect(check({_:mockArgv([url]), lanternDebug: true, local: true}))
        .toBeTruthy()
    });

    it('allows if local + !lantern-debug', () => {
      expect(check({_:mockArgv([url]), lanternDebug: false, local: true}))
        .toBeTruthy()
    });

    it('allows if !local + !lantern-debug', () => {
      expect(check({_:mockArgv([url]), lanternDebug: false, local: false}))
        .toBeTruthy()
    });

    it('throws if !local + lantern-debug', () => {
      expect(() => check({_:mockArgv([url]), lanternDebug: true, local: false}))
        .toThrow('--lantern-debug only works with --local')
    });
  });

  describe('parseArgs', () => {
    const argv = mockArgv([url]);
    it('returns defaults based on argv', () => {
      const args = parseArgs({argv})
      expect(args).toMatchSnapshot();
    });
  });
});