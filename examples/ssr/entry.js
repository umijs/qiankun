(global => {
  global['ssr'] = {
    bootstrap: () => {
      console.log('ssr bootstrap');
      return Promise.resolve();
    },
    mount: () => {
      console.log('ssr mount');
      return Promise.resolve();
    },
    unmount: () => {
      console.log('ssr unmount');
      return Promise.resolve();
    },
  };
})(window);
