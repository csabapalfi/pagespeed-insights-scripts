const {runPagespeed} = require('../lib/run-pagespeed');
const wreck = require('wreck');
jest.mock('wreck');

describe('run-pagespeed', () => {
  const lighthouseResult = {};

  it('runPageSpeed calls Mobile API and returns Lighthouse result', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);
    wreck.get = jest.fn()
      .mockResolvedValue({payload: {lighthouseResult}});

    const {result} = await runPagespeed('https://www.google.com');

    expect(result).toBe(lighthouseResult);
    expect(wreck.get).toHaveBeenCalledTimes(1)
    expect(wreck.get.mock.calls[0]).toMatchSnapshot();
  });

  it('runPageSpeed calls Desktop API and returns Lighthouse result', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);
    wreck.get = jest.fn()
      .mockResolvedValue({payload: {lighthouseResult}});

    const {result} = await runPagespeed('https://www.google.com', 'desktop');

    expect(result).toBe(lighthouseResult);
    expect(wreck.get).toHaveBeenCalledTimes(1)
    expect(wreck.get.mock.calls[0]).toMatchSnapshot();
  });

});
