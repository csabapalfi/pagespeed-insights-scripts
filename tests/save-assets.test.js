const {resolve} = require('path');
const {writeFileSync} = require('fs');
const {getFilenamePrefix} = require('lighthouse/lighthouse-core/lib/file-namer');
const {saveAssets} = require('lighthouse/lighthouse-core/lib/asset-saver');
const {assetSaver} = require('../lib/save-assets');

jest.mock('path');
jest.mock('fs');
jest.mock('lighthouse/lighthouse-core/lib/file-namer');
jest.mock('lighthouse/lighthouse-core/lib/asset-saver');


describe('save-assets', () => {
  const audits = {};
  const result = {audits};
  const fileNamePrefix = 'prefix';
  const resolvedPath = 'resolvedPath';

  afterEach(() => jest.resetAllMocks());

  function expectToSaveReport() {
    expect(getFilenamePrefix).toHaveBeenCalledTimes(1);
    expect(getFilenamePrefix.mock.calls[0][0]).toBe(result);

    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve.mock.calls[0])
      .toEqual([process.cwd(), fileNamePrefix]);

    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileSync.mock.calls[0]).toMatchSnapshot();
  }

  it('saves report only if no artifacts', async () => {
    getFilenamePrefix.mockReturnValue(fileNamePrefix);
    resolve.mockReturnValue(resolvedPath);
    
    await assetSaver('lighthouse')(result);

    expectToSaveReport();
  });

  it('saves report and artifacts', async () => {
    const artifacts = {};
    getFilenamePrefix.mockReturnValue(fileNamePrefix);
    resolve.mockReturnValue(resolvedPath);
    
    await assetSaver('lighthouse')(result, artifacts);

    expectToSaveReport();

    expect(saveAssets).toHaveBeenCalledTimes(1);
    expect(saveAssets.mock.calls[0][0])
      .toBe(artifacts);
    expect(saveAssets.mock.calls[0][1])
      .toBe(audits);
    expect(saveAssets.mock.calls[0][2])
      .toBe(resolvedPath);
  });
});