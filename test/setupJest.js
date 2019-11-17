const fetch = require('jest-fetch-mock');

jest.setMock('node-fetch', fetch);
