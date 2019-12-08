const fs = require('fs');
const path = require('path');
const analyzeText = require('../src/backend/utils/basic_analysis');
const { logger } = require('../src/backend/utils/logger');

const log = logger.child({ module: 'basic-analysis-test' });

const text1 = 'Hello, world';
const text2 = 'Navigate to the root directory of telescope';
const text3 =
  'Run npm start to start telescope. If you get a series of errors, you may have to start redis-server depending on your installation configuration, do this by running the command redis-server in a seperate command window).';
let text4;
let text5;
let text6;

try {
  text4 = fs.readFileSync(path.join(__dirname, '/test_files/basic_analysis.test1.txt')).toString();
  text5 = fs.readFileSync(path.join(__dirname, '/test_files/basic_analysis.test2.txt')).toString();
  text6 = fs.readFileSync(path.join(__dirname, '/test_files/basic_analysis.test3.txt')).toString();
} catch (error) {
  log.error({ error }, 'Error reading text file for analysis test');
}

// Test 1: Output Type Test
describe('Output type test', () => {
  let data;
  beforeAll(async () => {
    data = await analyzeText(text1).getAsyAnalysis();
  });

  test('type of word count is ', () => expect(typeof data.wordCount).toBe('number'));
  test('type of readability is', () => expect(typeof data.readability).toBe('string'));
  test('type of reading time is', () => expect(typeof data.readingTime).toBe('number'));
});

describe('Output error type test', () => {
  let data1;
  let data2;
  let data3;
  beforeAll(async () => {
    data1 = await analyzeText('').getAsyAnalysis();
    data2 = await analyzeText(undefined).getAsyAnalysis();
    data3 = await analyzeText(11).getAsyAnalysis();
  });

  test('data1 has ', () => expect(typeof data1).toEqual('string'));
  test('data2 is ', () => expect(data2).toBe('Not Vaild Text Input!'));
  test('data3 is ', () => expect(data3).toBe('Not Vaild Text Input!'));
});

// Test 3: Basic anaysis output test
describe('Basic analysis test 1', () => {
  let data;
  beforeAll(async () => {
    data = await analyzeText(text2).getAsyAnalysis();
  });

  test('the number of of word count is ', async () => expect(data.wordCount).toEqual(7));
  test('the level of of readability is ', async () => expect(data.readability).toEqual('hard'));
  test('the number of of reading time is ', async () => expect(data.readingTime).toEqual(0));
});

describe('Basic analysis test 2', () => {
  let data;
  beforeAll(async () => {
    data = await analyzeText(text3).getAsyAnalysis();
  });

  test('the number of of word count is ', async () => expect(data.wordCount).toEqual(36));
  test('the level of of readability is ', async () => expect(data.readability).toEqual('hard'));
  test('the number of of reading time is ', async () => expect(data.readingTime).toEqual(0));
});

describe('Basic analysis test 3', () => {
  let data;
  beforeAll(async () => {
    data = await analyzeText(text4).getAsyAnalysis();
  });

  test('the number of of word count is ', async () => expect(data.wordCount).toEqual(560));
  test('the level of of readability is ', async () => expect(data.readability).toEqual('hard'));
  test('the number of of reading time is ', async () => expect(data.readingTime).toEqual(3));
});

describe('Basic analysis test 4', () => {
  let data;
  beforeAll(async () => {
    data = await analyzeText(text5).getAsyAnalysis();
  });

  test('the number of of word count is ', async () => expect(data.wordCount).toEqual(6254));
  test('the level of of readability is ', async () => expect(data.readability).toEqual('hard'));
  test('the number of of reading time is ', async () => expect(data.readingTime).toEqual(31));
});

describe('Basic analysis test 5', () => {
  let data;
  beforeAll(async () => {
    data = await analyzeText(text6).getAsyAnalysis();
  });

  test('the number of of word count is ', async () => expect(data.wordCount).toEqual(25648));
  test('the level of of readability is ', async () => expect(data.readability).toEqual('hard'));
  test('the number of of reading time is ', async () => expect(data.readingTime).toEqual(128));
});
