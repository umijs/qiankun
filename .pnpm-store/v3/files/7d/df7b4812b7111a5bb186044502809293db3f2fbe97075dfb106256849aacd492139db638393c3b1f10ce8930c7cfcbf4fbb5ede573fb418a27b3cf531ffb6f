/**
 * Gets the source (i.e. host) of the script currently running.
 * @returns {string}
 */
function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to get the current running script,
  // but is not supported in all browsers (most notably, IE).
  if (document.currentScript) {
    return document.currentScript.getAttribute('src');
  }

  // Fallback to getting all scripts running in the document.
  const scriptElements = document.scripts || [];
  const scriptElementsWithSrc = Array.prototype.filter.call(scriptElements, function (elem) {
    return elem.getAttribute('src');
  });
  if (scriptElementsWithSrc.length) {
    const currentScript = scriptElementsWithSrc[scriptElementsWithSrc.length - 1];
    return currentScript.getAttribute('src');
  }
}

export default getCurrentScriptSource;
