const fs = require('fs');
const path = require('path');
const analyzeText = require('../src/analysis/basic_analysis.js');

const text1 = 'w';
const text2 = '';
const text3 = 12;
const text4 = { title: 'Check Ojbect' };
const text5 = undefined;
const text6 = '123123123 3423 23423';
const text7 = 'Navigate to the root directory of telescope';
const text8 = 'Run npm start to start telescope. If you get a series of errors, you may have to start redis-server depending on your installation configuration, do this by running the command redis-server in a seperate command window).';
let text9;
let text10;
let text11;

try {
  text9 = fs.readFileSync(path.join(__dirname, '/test_files/basic_analysis.test1.txt')).toString();
  text10 = fs.readFileSync(path.join(__dirname, '/test_files/basic_analysis.test2.txt')).toString();
  text11 = fs.readFileSync(path.join(__dirname, '/test_files/basic_analysis.test3.txt')).toString();
} catch (err) {
  console.log(err);
}

console.log(analyzeText);

// Test 1: Test Promise Chain Try && Catch
test('Test 1-1: Test Promise Chain(then)', () => {
  analyzeText(text1).getAsyAnalysis()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});

test('Test 1-2: Test Promise Chain(catch)', () => {
  analyzeText(text2).getAsyAnalysis()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});

// Test 2: Test text input
test('Test 2-1: Test text - input(number)', () => {
  analyzeText(text3).getAsyAnalysis()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});
test('Test 2-2: Test text - input(object)', () => {
  analyzeText(text4).getAsyAnalysis()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});
test('Test 2-3: Test text - input(undefined)', () => {
  analyzeText(text5).getAsyAnalysis()
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
});

// Test 3: Test word count
test('Test 3-1: Test word count - number strings', () => {
  analyzeText(text6).getAsyAnalysis()
    .then((data) => console.log(data.wordCount))
    .catch((err) => console.log(err));
});
test('Test 3-2: Test word count - strings 1', () => {
  analyzeText(text7).getAsyAnalysis()
    .then((data) => console.log(data.wordCount))
    .catch((err) => console.log(err));
});
test('Test 3-3: Test word count - strings 2', () => {
  analyzeText(text8).getAsyAnalysis()
    .then((data) => console.log(data.wordCount))
    .catch((err) => console.log(err));
});

// Test 4: Test reading time
test('Test 4-1: Test reading time', () => {
  analyzeText(text9).getAsyAnalysis()
    .then((data) => console.log(data.readingTime))
    .catch((err) => console.log(err));
});
test('Test 4-2: Test reading time', () => {
  analyzeText(text10).getAsyAnalysis()
    .then((data) => console.log(data.readingTime))
    .catch((err) => console.log(err));
});
test('Test 4-3: Test reading time', () => {
  analyzeText(text11).getAsyAnalysis()
    .then((data) => console.log(data.readingTime))
    .catch((err) => console.log(err));
});
