let bootstrapProps, mountProps, unmountProps, unloadProps;

export function bootstrap(props) {
  bootstrapProps = props;
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
  return bootstrapProps;
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
  bootstrapProps = mountProps = unmountProps = unloadProps = null;
}
