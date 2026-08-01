import * as singleSpa from 'single-spa';

// qiankun fork: upstream #1307 renamed the parcel's bootstrapPromise to initPromise; parcels
// returned by qiankun's loadMicroApp are public API, so the old name stays as a permanent alias
// (see packages/single-spa/README.md).
describe(`bootstrapPromise alias`, () => {
  it(`exposes bootstrapPromise as the same promise instance as initPromise, and it resolves`, async () => {
    const parcelConfig = {
      async bootstrap() {},
      async mount() {},
      async unmount() {},
    };

    const parcel = singleSpa.mountRootParcel(parcelConfig, {
      domElement: document.createElement('div'),
    });

    expect(parcel.bootstrapPromise).toBe(parcel.initPromise);

    await parcel.bootstrapPromise;
    await parcel.mountPromise;
    expect(parcel.getStatus()).toBe(singleSpa.AppOrParcelStatus.MOUNTED);

    await parcel.unmount();
  });
});
