const {resolve} = require('path');
const {writeFileSync} = require('fs');
const {saveAssets: lhSaveAssets} = require('lighthouse/lighthouse-core/lib/asset-saver');
const {saveAssets} = require('../lib/save-assets');

jest.mock('path');
jest.mock('fs');
jest.mock('lighthouse/lighthouse-core/lib/asset-saver');


describe('save-assets', () => {
  const index = 1;
  const audits = {};
  const result = {audits};
  const resolvedPath = 'resolvedPath';

  afterEach(() => { 
    jest.resetAllMocks();
  });

  function expectToSaveReport() {
    expect(resolve).toHaveBeenCalledTimes(1);
    expect(resolve.mock.calls[0])
      .toEqual([process.cwd(), index]);

    expect(writeFileSync).toHaveBeenCalledTimes(1);
    expect(writeFileSync.mock.calls[0]).toMatchSnapshot();
  }

  it('saves report only if no artifacts', async () => {
    resolve.mockReturnValue(resolvedPath);
    
    await saveAssets(index, result);

    expectToSaveReport();
  });

  it('saves report and artifacts', async () => {
    const artifacts = {};
    resolve.mockReturnValue(resolvedPath);
    
    await saveAssets(1, result, artifacts);

    expectToSaveReport();

    expect(lhSaveAssets).toHaveBeenCalledTimes(1);
    expect(lhSaveAssets.mock.calls[0][0]).toBe(artifacts);
    expect(lhSaveAssets.mock.calls[0][1]).toBe(audits);
    expect(lhSaveAssets.mock.calls[0][2]).toBe(resolvedPath);
  });
});