import { expect } from 'vitest';
import 'vitest-dom/extend-expect';
import * as domMatchers from 'vitest-dom/matchers';

expect.extend(domMatchers);
