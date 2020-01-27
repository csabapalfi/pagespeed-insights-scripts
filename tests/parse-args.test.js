const {check, parseArgs} = require('../lib/parse-args');

describe('parse-args', () => {
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

    it('throws if --save-assets used without --local', () => {
      expect(() => check({_:mockArgv([url]), saveAssets: true}))
        .toThrow('--save-assets only works with --local');
    });

    it('throws if --cpu-slowdown set without --local', () => {
      expect(() => check({_:mockArgv([url]), cpuSlowdown: 6}))
        .toThrow('--cpu-slowdown only works with --local');
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