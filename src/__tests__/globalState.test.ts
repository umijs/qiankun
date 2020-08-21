/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

import { initGlobalState, getMicroAppStateActions } from '../globalState';

const master = initGlobalState({ user: 'qiankun' });

test('test master to master actions', () => {
  const callback1 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'matser', user: 'master' });
    expect(prevState).toEqual({ user: 'qiankun' });
  };
  master.onGlobalStateChange(callback1);
  master.setGlobalState({
    ignore: 'matser',
    user: 'master',
  });

  const callback2 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'matser', user: 'master' });
    expect(prevState).toEqual({ ignore: 'matser', user: 'master' });
  };
  master.onGlobalStateChange(callback2, true);

  // 注销监听保证下一个 case 测试
  master.offGlobalStateChange();
});

// global: { ignore: 'matser', user: 'master' }

const slaveA = getMicroAppStateActions('slaveA');

test('test master to slave actions', () => {
  const slaveCallback1 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'matser', user: 'master2' });
    expect(prevState).toEqual({ ignore: 'matser', user: 'master' });
  };
  slaveA.onGlobalStateChange(slaveCallback1);

  master.setGlobalState({
    user: 'master2',
  });

  const slaveCallback2 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'matser', user: 'master2' });
    expect(prevState).toEqual({ ignore: 'matser', user: 'master2' });
  };
  slaveA.onGlobalStateChange(slaveCallback2, true);

  // 注销监听保证下一个 case 测试
  slaveA.offGlobalStateChange();
});

// global: { ignore: 'matser', user: 'master2' }

test('test slave to master actions', () => {
  const callback1 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'slaveA', user: 'slaveA' });
    expect(prevState).toEqual({ ignore: 'matser', user: 'master2' });
  };
  master.onGlobalStateChange(callback1);

  slaveA.setGlobalState({
    ignore: 'slaveA',
    user: 'slaveA',
  });

  const callback2 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'slaveA', user: 'slaveA' });
    expect(prevState).toEqual({ ignore: 'slaveA', user: 'slaveA' });
  };
  master.onGlobalStateChange(callback2, true);

  // 注销监听保证下一个 case 测试
  master.offGlobalStateChange();
});

// global: { ignore: 'slaveA', user: 'slaveA' }

const slaveB = getMicroAppStateActions('slaveB');
test('test slave to slave actions', () => {
  const callback1 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'slaveA', user: 'slaveB' });
    expect(prevState).toEqual({ ignore: 'slaveA', user: 'slaveA' });
  };
  slaveA.onGlobalStateChange(callback1);

  slaveB.setGlobalState({
    ignore2: 'slaveB',
    user: 'slaveB',
  });

  const callback2 = (state: Record<string, any>, prevState: Record<string, any>) => {
    expect(state).toEqual({ ignore: 'slaveA', user: 'slaveB' });
    expect(prevState).toEqual({ ignore: 'slaveA', user: 'slaveB' });
  };
  slaveA.onGlobalStateChange(callback2, true);
});
