import { expect } from 'chai';
import { getDataApi } from '../../src/utils/tsapi';
import { CreateCache } from '../../src/utils/cache';

describe('test api', function () {
  it('initialize local api', async function () {
    const dataApi = getDataApi(true);
    expect(dataApi).to.not.null;
    const cachedApi = await CreateCache(dataApi);
  });
});
