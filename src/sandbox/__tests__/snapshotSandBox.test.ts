import SnapshotSandbox from '../snapshotSandbox';

it('modify, add and delete  props should isolated at sandbox', () => {
  window.globalProps = { a: 1 };
  window.globalDeletedProps = { b: [] };
  const sandbox1 = new SnapshotSandbox('app1');
  const sandbox2 = new SnapshotSandbox('app2');
  sandbox1.active();
  window.globalProps = { a: 2 };
  window.globalAddedProps = 3;
  delete window.globalDeletedProps;
  sandbox1.inactive();
  // change to sandbox2
  sandbox2.active();
  expect(window.globalProps).toEqual({ a: 1 });
  expect(window.globalAddedProps).not.toBeDefined();
  expect(window.globalDeletedProps).toEqual({ b: [] });
  sandbox2.inactive();
  // restore sandbox1
  sandbox1.active();
  expect(window.globalProps).toEqual({ a: 2 });
  expect(window.globalAddedProps).toEqual(3);
  expect(window.globalDeletedProps).not.toBeDefined();
  // add delete props
  window.globalDeletedProps = { b: [2] };
  sandbox1.inactive();
  expect(window.globalDeletedProps).toEqual({ b: [] });
  sandbox1.active();
  expect(window.globalDeletedProps).toEqual({ b: [2] });
  // delete props again
  delete window.globalDeletedProps;
  sandbox1.inactive();
  expect(window.globalDeletedProps).toEqual({ b: [] });
  sandbox1.active();
  expect(window.globalDeletedProps).not.toBeDefined();
  // 1. add props 2. modify props 2. delete props
  window.globalDeletedProps = { b: [2] };
  window.globalDeletedProps = { b: [3] };
  delete window.globalDeletedProps;
  sandbox1.inactive();
  expect(window.globalDeletedProps).toEqual({ b: [] });
  sandbox1.active();
  expect(window.globalDeletedProps).not.toBeDefined();
  // 1. delete props 2. add props 3. modify props
  delete window.globalAddedProps;
  window.globalAddedProps = 3;
  window.globalAddedProps = 4;
  sandbox1.inactive();
  expect(window.globalAddedProps).not.toBeDefined();
  sandbox1.active();
  expect(window.globalAddedProps).toEqual(4);
});
