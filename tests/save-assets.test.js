const {resolve} = require('path');
const {writeFileSync} = require('fs');
const {saveAssets} = require('lighthouse/lighthouse-core/lib/asset-saver');
const {assetSaver} = require('../lib/save-assets');

jest.mock('path');
jest.mock('fs');
jest.mock('lighthouse/lighthouse-core/lib/asset-saver');


describe('save-assets', () => {
  const filePrefix = 'prefix-';
  const index = 1;
  const audits = {};
  const result = {audits};
  const resolvedPath = 'resolvedPath';

  afterEach(() => { 
    jest.resetAllMocks();
    delete process.env.LANTERN_DEBUG;
  });

  function expectToSaveReport() {
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve.mock.calls[0])
      .toEqual([process.cwd(), `${filePrefix}${index}`]);

    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileSync.mock.calls[0]).toMatchSnapshot();
  }

  it('saves report only if no artifacts', async () => {
    resolve.mockReturnValue(resolvedPath);
    
    await assetSaver({filePrefix})(index, result);

    expectToSaveReport();
  });

  it('saves report and artifacts', async () => {
    const artifacts = {};
    resolve.mockReturnValue(resolvedPath);
    
    await assetSaver({filePrefix})(1, result, artifacts);

    expectToSaveReport();

    expect(process.env.LANTERN_DEBUG).toBeUndefined();

    expect(saveAssets).toHaveBeenCalledTimes(1);
    expect(saveAssets.mock.calls[0][0]).toBe(artifacts);
    expect(saveAssets.mock.calls[0][1]).toBe(audits);
    expect(saveAssets.mock.calls[0][2]).toBe(resolvedPath);
  });

  it('saves report and artifacts with LANTERN_DEBUG', async () => {
    const artifacts = {};
    resolve.mockReturnValue(resolvedPath);
    const output = {filePrefix, lanternDebug: true};
    await assetSaver(output)(1, result, artifacts);

    expectToSaveReport();

    expect(process.env.LANTERN_DEBUG).toBe('true');

    expect(saveAssets).toHaveBeenCalledTimes(1);
    expect(saveAssets.mock.calls[0][0]).toBe(artifacts);
    expect(saveAssets.mock.calls[0][1]).toBe(audits);
    expect(saveAssets.mock.calls[0][2]).toBe(resolvedPath);
  });
});