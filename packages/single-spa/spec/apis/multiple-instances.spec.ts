describe(`multiple instances of single-spa`, () => {
  let consoleWarnSpy;

  beforeEach(() => {
    consoleWarnSpy = jest.spyOn(console, "warn");
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  it(`should log a warning to the console when you load single-spa on a page that already has loaded single-spa`, async () => {
    // This is how we "fool" single-spa into thinking it was already loaded on the page
    window.singleSpaNavigate = function () {};

    expect(consoleWarnSpy).not.toHaveBeenCalled();

    await import("single-spa");

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      "single-spa minified message #41: single-spa has been loaded twice on the page. This can result in unexpected behavior. See https://single-spa.js.org/error/?code=41",
    );
  });
});
