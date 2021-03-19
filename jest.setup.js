/* global jest */
const path = require('path');
const fetch = require('jest-fetch-mock');

require('dotenv').config({ path: path.join(__dirname, './config/env.development') });

jest.setMock('node-fetch', fetch);
