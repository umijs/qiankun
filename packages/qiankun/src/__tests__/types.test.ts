import { expectTypeOf, it } from 'vitest';
import { type BootstrapContext, type MicroAppLifeCycles } from '../types';

it('restricts bootstrap to a readonly identity without mount props or capabilities', () => {
  expectTypeOf<BootstrapContext>().toEqualTypeOf<Readonly<{ name: string; entry: string }>>();
  expectTypeOf<keyof BootstrapContext>().toEqualTypeOf<'name' | 'entry'>();
  expectTypeOf<MicroAppLifeCycles['bootstrap']>().parameter(0).toEqualTypeOf<BootstrapContext>();
  expectTypeOf<Parameters<MicroAppLifeCycles['mount']>[0]>().toHaveProperty('container');
});
