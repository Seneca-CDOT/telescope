const request = require('supertest');
const { app } = require('../src');

const depsList = [
  '@apidevtools/json-schema-ref-parser',
  '@babel/code-frame',
  '@babel/compat-data',
  '@babel/core", "@babel/generator',
  '@babel/helper-annotate-as-pure',
  '@babel/helper-builder-binary-assignment-operator-visitor',
  '@babel/helper-compilation-targets',
  '@babel/helper-create-class-features-plugin',
  '@babel/helper-create-regexp-features-plugin',
];

jest.mock('../src/dependency-list');

describe('GET /projects', () => {
  beforeEach(() => {
    require('../src/dependency-list').__setMockDepList(depsList);
  });

  test('Should return 200 and an array of dependencies', async () => {
    const res = await request(app).get('/projects');
    expect(res.status).toBe(200);
    expect(typeof res.body).toEqual('object');
    expect(res.body.length).toBe(depsList.length);
  });
});
