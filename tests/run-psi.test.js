const {runPagespeed} = require('../lib/run-psi');
const wreck = require('wreck');

describe('run-psi', () => {

  jest.mock('wreck');
  const lighthouseResult = {};

  it('runPageSpeed calls API and returns Lighthouse result', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

    wreck.get = jest.fn()
      .mockResolvedValue({payload: {lighthouseResult}});
  
 
    
    expect(await runPagespeed('https://www.google.com'))
      .toBe(lighthouseResult);
    expect(wreck.get).toHaveBeenCalledTimes(1)
    expect(wreck.get.mock.calls[0]).toMatchSnapshot();
  });
});