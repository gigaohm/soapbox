'use strict';

import * as BuildConfig from 'soapbox/build-config';

//
// Tools for performance debugging, only enabled in development mode.
// Open up Chrome Dev Tools, then Timeline, then User Timing to see output.
// Also see config/webpack/loaders/mark.js for the webpack loader marks.
//

let marky: any;

if (BuildConfig.NODE_ENV === 'development') {
  if (typeof performance !== 'undefined' && performance.setResourceTimingBufferSize) {
    // Increase Firefox's performance entry limit; otherwise it's capped to 150.
    // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1331135
    performance.setResourceTimingBufferSize(Infinity);
  }
  marky = require('marky');
  // allows us to easily do e.g. ReactPerf.printWasted() while debugging
  //window.ReactPerf = require('react-addons-perf');
  //window.ReactPerf.start();
}

export function start(name: string): void {
  marky?.mark(name);
}

export function stop(name: string): void {
  marky?.stop(name);
}
