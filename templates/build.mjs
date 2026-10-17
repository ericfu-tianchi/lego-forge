// See AGENTS.md §6. Grid: x, z studs; y plates (3 = one brick). Front = +z.
import { Model } from '../../engine/model.mjs';
import * as kit from '../../engine/kit.mjs';

const m = new Model({ title: 'My set', subtitle: '', budget: [300, 1500] });
const g = kit.base(m, { w: 24, d: 16, color: 'Dark Bluish Gray' });

m.section('blockout', () => {
  m.box(6, g, 4, 12, 8, 12, 'Tan', { hollow: true });
});

export default m;
