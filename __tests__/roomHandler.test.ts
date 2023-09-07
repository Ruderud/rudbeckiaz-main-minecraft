import { roomHandler, add } from '../src';

test('correct greeting is generated', () => {
  const res = add(2, 3);
  expect(res).toEqual(5);
});
