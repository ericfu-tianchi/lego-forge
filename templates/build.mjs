// See the guide (AGENTS.md / `lego guide`) §6. Grid: x, z studs; y plates (3 = one brick). Front = +z.
// `lego build <name>` calls this function with the toolkit: Model (the set) and kit (proven sub-builds).
export default function build({ Model, kit }) {
  const m = new Model({ title: 'My set', subtitle: '', budget: [300, 1500] });
  const g = kit.base(m, { w: 24, d: 16, color: 'Dark Bluish Gray' });

  m.section('blockout', () => {
    m.box(6, g, 4, 12, 8, 12, 'Tan', { hollow: true });
  });

  return m;
}
