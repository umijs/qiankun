let _initsCalledOutOfOrder = undefined;
let _mountsCalledOutOfOrder = undefined;
let _unmountsCalledOutOfOrder = undefined;

let _init1Called = false;
let _init2Called = false;
let _init3Called = false;
let _mount1Called = false;
let _mount2Called = false;
let _mount3Called = false;
let _unmount1Called = false;
let _unmount2Called = false;
let _unmount3Called = false;

export const init = [
  function init1() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (_init2Called)
          _initsCalledOutOfOrder = `init 2 called before init 1`;
        if (_init3Called)
          _initsCalledOutOfOrder = `init 3 called before init 1`;
        _init1Called = true;
        resolve();
      }, 10);
    });
  },

  function init2() {
    return new Promise((resolve) => {
      if (_init3Called) _initsCalledOutOfOrder = `init 2 called before init 3`;
      _init2Called = true;
      resolve();
    });
  },

  function init3() {
    return new Promise((resolve) => {
      _init3Called = true;
      resolve();
    });
  },
];

export const mount = [
  function mount1() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (_mount2Called)
          _mountsCalledOutOfOrder = `mount 2 called before mount 1`;
        if (_mount3Called)
          _mountsCalledOutOfOrder = `mount 3 called before mount 1`;
        _mount1Called = true;
        resolve();
      }, 10);
    });
  },

  function mount2() {
    return new Promise((resolve) => {
      if (_mount3Called)
        _mountsCalledOutOfOrder = `mount 2 called before mount 3`;
      _mount2Called = true;
      resolve();
    });
  },

  function mount3() {
    return new Promise((resolve) => {
      _mount3Called = true;
      resolve();
    });
  },
];

export const unmount = [
  function unmount1() {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (_unmount2Called)
          _unmountsCalledOutOfOrder = `unmount 2 called before unmount 1`;
        if (_unmount3Called)
          _unmountsCalledOutOfOrder = `unmount 3 called before unmount 1`;
        _unmount1Called = true;
        resolve();
      }, 10);
    });
  },

  function unmount2() {
    return new Promise((resolve) => {
      if (_unmount3Called)
        _unmountsCalledOutOfOrder = `unmount 2 called before unmount 3`;
      _unmount2Called = true;
      resolve();
    });
  },

  function unmount3() {
    return new Promise((resolve) => {
      _unmount3Called = true;
      resolve();
    });
  },
];

export function reset() {
  _initsCalledOutOfOrder =
    _mountsCalledOutOfOrder =
    _unmountsCalledOutOfOrder =
      undefined;
  _init1Called =
    _init2Called =
    _init3Called =
    _mount1Called =
    _mount2Called =
    _mount3Called =
    _unmount1Called =
    _unmount2Called =
    _unmount3Called =
      false;
}

export function initsCalledOutOfOrder() {
  return _initsCalledOutOfOrder;
}

export function mountsCalledOutOfOrder() {
  return _mountsCalledOutOfOrder;
}

export function unmountsCalledOutOfOrder() {
  return _unmountsCalledOutOfOrder;
}

export function init1Called() {
  return _init1Called;
}

export function init2Called() {
  return _init2Called;
}

export function init3Called() {
  return _init3Called;
}

export function mount1Called() {
  return _mount1Called;
}

export function mount2Called() {
  return _mount2Called;
}

export function mount3Called() {
  return _mount3Called;
}

export function unmount1Called() {
  return _unmount1Called;
}

export function unmount2Called() {
  return _unmount2Called;
}

export function unmount3Called() {
  return _unmount3Called;
}
