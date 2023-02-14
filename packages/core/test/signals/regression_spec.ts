/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {computed, signal, Watch} from '@angular/core/src/signals';

describe('non-regression', () => {
  it('should not mark dirty computed signals that are dirty already', () => {
    const source = signal('a');
    const derived = computed(() => source().toUpperCase());

    let watchCount = 0;
    const watch = new Watch(
        () => {
          derived();
        },
        () => {
          watchCount++;
        });

    watch.run();
    expect(watchCount).toEqual(0);

    // change signal, mark downstream dependencies dirty
    source.set('b');
    expect(watchCount).toEqual(1);

    // change signal again, downstream dependencies should be dirty already and not marked again
    source.set('c');
    expect(watchCount).toEqual(1);

    // resetting dependencies back to clean
    watch.run();
    expect(watchCount).toEqual(1);

    // expecting another notification at this point
    source.set('d');
    expect(watchCount).toEqual(2);
  });
});
