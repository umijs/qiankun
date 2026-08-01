let initProps, mountProps, unmountProps, unloadProps;

export function init(props) {
  initProps = props;
  return Promise.resolve();
}

export function mount(props) {
  mountProps = props;
  return Promise.resolve();
}

export function unmount(props) {
  unmountProps = props;
  return Promise.resolve();
}

export function unload(props) {
  unloadProps = props;
  return Promise.resolve();
}

export function getInitProps() {
  return initProps;
}

export function getMountProps() {
  return mountProps;
}

export function getUnmountProps() {
  return unmountProps;
}

export function getUnloadProps() {
  return unloadProps;
}

export function reset() {
  initProps = mountProps = unmountProps = unloadProps = null;
}
