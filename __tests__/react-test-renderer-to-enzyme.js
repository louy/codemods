const { defineTest } = require('jscodeshift/dist/testUtils');

defineTest(__dirname, 'react-test-renderer-to-enzyme', null, null);
defineTest(
  __dirname,
  'react-test-renderer-to-enzyme',
  null,
  'react-test-renderer-to-enzyme.specific-import',
);
defineTest(
  __dirname,
  'react-test-renderer-to-enzyme',
  null,
  'react-test-renderer-to-enzyme.specific-import-alias',
);
defineTest(__dirname, 'react-test-renderer-to-enzyme', null, 'react-test-renderer-to-enzyme.mixed');
defineTest(
  __dirname,
  'react-test-renderer-to-enzyme',
  null,
  'react-test-renderer-to-enzyme.mixed-shallow',
);
