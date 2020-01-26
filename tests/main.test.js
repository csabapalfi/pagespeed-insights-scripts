const main = require('../lib/main');

describe('main', () => {
  const options = {
    runs: 1,
    url: 'https://www.google.com',
    lighthouse: {enabled: false},
    output: {saveAssets: false},
  };

  it('returns runner', () => {
    expect(main(options)).toMatchSnapshot();
  });
});