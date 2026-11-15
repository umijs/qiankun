import * as singleSpa from 'single-spa';

describe(`invalid-load-function`, () => {
  let errs = [];

  function handleError(err) {
    errs.push(err);
  }

  beforeEach(() => {
    location.hash = '#';
    errs = [];
    singleSpa.addErrorHandler(handleError);
  });

  afterEach(() => {
    location.hash = '#';
    singleSpa.removeErrorHandler(handleError);
  });

  it.each([
    ['undefined', 'invalid-load-1', () => undefined],
    ['a function', 'invalid-load-2', () => () => {}],
    ['a non-thenable object', 'invalid-load-3', () => ({})],
  ])('Dies if the load function returns %s instead of a promise', (_label, appName, loadFunction) => {
    singleSpa.registerApplication(appName, loadFunction, (location) => location.hash === `#${appName}`);

    location.hash = `#${appName}`;

    return singleSpa.triggerAppChange().then(() => {
      expect(errs).toHaveLength(1);
      expect(errs[0].appOrParcelName).toBe(appName);
      expect(
        errs[0].message.indexOf(
          'single-spa loading function did not return a promise. Check the second argument to registerApplication',
        ),
      ).toBeGreaterThan(-1);
      expect(singleSpa.getAppStatus(appName)).toBe(singleSpa.AppOrParcelStatus.SKIP_BECAUSE_BROKEN);
    });
  });

  it('It retries loading an application that previously failed', () => {
    let count = 0;
    function loadFunction() {
      count++;
      if (count === 1) return Promise.reject(`It didn't load`);
      else
        return Promise.resolve({
          bootstrap: () => new Promise(),
          mount: () => new Promise(),
          unmount: () => new Promise(),
        });
    }
    singleSpa.registerApplication('invalid-load-4', loadFunction, (location) =>
      location.hash.includes('#invalid-load-function'),
    );

    location.hash = '#invalid-load-function';

    return singleSpa.triggerAppChange().then(() => {
      expect(errs.length).toBeGreaterThan(0);
      expect(errs[0].appOrParcelName).toBe('invalid-load-4');
      expect(errs[0].message.indexOf(`It didn't load`)).toBeGreaterThan(-1);

      location.hash = '#invalid-load-function-1';

      return new Promise((resolve) => setTimeout(resolve, 201)).then(() =>
        singleSpa.triggerAppChange().then(() => {
          expect(singleSpa.getAppStatus('invalid-load-4')).toBe(singleSpa.AppOrParcelStatus.NOT_BOOTSTRAPPED);
        }),
      );
    });
  });
});
