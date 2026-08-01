import * as singleSpa from 'single-spa';

// qiankun fork: bootstrapPromise is the canonical parcel promise name (reverting upstream #1307's
// rename); initPromise stays as a permanent alias for v7-flavored consumers, always the same
// promise instance (see packages/single-spa/README.md).
describe(`bootstrapPromise naming`, () => {
  it(`exposes initPromise as the same promise instance as bootstrapPromise, and it resolves`, async () => {
    const parcelConfig = {
      async bootstrap() {},
      async mount() {},
      async unmount() {},
    };

    const parcel = singleSpa.mountRootParcel(parcelConfig, {
      domElement: document.createElement('div'),
    });

    expect(parcel.initPromise).toBe(parcel.bootstrapPromise);

    await parcel.bootstrapPromise;
    await parcel.mountPromise;
    expect(parcel.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);

    await parcel.unmount();
  });
});
