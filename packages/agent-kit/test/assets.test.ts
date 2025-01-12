import { test } from 'vitest';
import { getAllVerifiedFuelAssets } from '../src/utils/assets.js';

test('get asset ids', async () => {
  const assets = await getAllVerifiedFuelAssets();
  console.log(assets);
});
