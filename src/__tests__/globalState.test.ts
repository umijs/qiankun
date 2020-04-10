/**
 * @author dbkillerf6
 * @since 2020-04-10
 */

import { initGlobalState, getMicroAppStateActions } from '../globalState';

const master = initGlobalState({ user: 'qiankun' });

test('test master to master actions', () => {
  const callback1 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'master' });
    expect(prev).toEqual({
      ignore: 'matser',
      user: 'master',
    });
  };
  master.onGlobalStateChange(callback1);
  master.setGlobalState({
    ignore: 'matser',
    user: 'master',
  });

  const callback2 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'master' });
    expect(prev).toEqual(null);
  };
  master.onGlobalStateChange(callback2, true);

  // 注销监听保证下一个 case 测试
  master.offGlobalStateChange();
});

// gloabal: { user: 'master' }

const slaveA = getMicroAppStateActions('slaveA');

test('test master to slave actions', () => {
  const slaveCallback1 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'master2' });
    expect(prev).toEqual({
      ignore: 'matser2',
      user: 'master2',
    });
  };
  slaveA.onGlobalStateChange(slaveCallback1);

  master.setGlobalState({
    ignore: 'matser2',
    user: 'master2',
  });

  const slaveCallback2 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'master2' });
    expect(prev).toEqual(null);
  };
  slaveA.onGlobalStateChange(slaveCallback2, true);

  // 注销监听保证下一个 case 测试
  slaveA.offGlobalStateChange();
});

// gloabal: { user: 'master2' }

test('test slave to master actions', () => {
  const callback1 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'slaveA' });
    expect(prev).toEqual({
      ignore: 'slaveA',
      user: 'slaveA',
    });
  };
  master.onGlobalStateChange(callback1);

  slaveA.setGlobalState({
    ignore: 'slaveA',
    user: 'slaveA',
  });

  const callback2 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'slaveA' });
    expect(prev).toEqual(null);
  };
  master.onGlobalStateChange(callback2, true);

  // 注销监听保证下一个 case 测试
  master.offGlobalStateChange();
});

// gloabal: { user: 'slaveA' }

const slaveB = getMicroAppStateActions('slaveB');
test('test slave to slave actions', () => {
  const callback1 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'slaveB' });
    expect(prev).toEqual({
      ignore: 'slaveB',
      user: 'slaveB',
    });
  };
  slaveA.onGlobalStateChange(callback1);

  slaveB.setGlobalState({
    ignore: 'slaveB',
    user: 'slaveB',
  });

  const callback2 = (state: Record<string, any>, prev: Record<string, any> | null) => {
    expect(state).toEqual({ user: 'slaveB' });
    expect(prev).toEqual(null);
  };
  slaveA.onGlobalStateChange(callback2, true);
});
