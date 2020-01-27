const {launch} = require('chrome-launcher');
const lighthouse = require('lighthouse');
const runLighthouse = require('../lib/run-lighthouse');

jest.mock('chrome-launcher');
jest.mock('lighthouse');

describe('run-lighthouse', () => {
  it('runLightHouse launches chrome and runs Lighthouse', async () => {
    const url = 'https://www.google.com';
    const lighthouseResult = {};
    const lighthouseArtifacts = {};
    const options = {cpuSlowDown: 4};
    const chrome = {port: 1234, kill: jest.fn()};
    launch.mockResolvedValue(chrome);
    lighthouse.mockResolvedValue({
      lhr: lighthouseResult, 
      artifacts: lighthouseArtifacts
    });

    const {result, artifacts} = await runLighthouse(options, url);

    expect(result).toBe(lighthouseResult);
    expect(artifacts).toBe(lighthouseArtifacts);

    expect(launch).toHaveBeenCalledTimes(1);
    expect(launch.mock.calls[0]).toMatchSnapshot();

    expect(lighthouse).toHaveBeenCalledTimes(1);
    expect(lighthouse.mock.calls[0]).toMatchSnapshot();

    expect(chrome.kill).toHaveBeenCalledTimes(1);
  });
});