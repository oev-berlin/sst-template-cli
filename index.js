#!/usr/bin/env node

import('./dist/index.js').then(async ({ main }) => await main());
