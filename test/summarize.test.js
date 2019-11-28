const summarize = require('../src/backend/utils/summarize');

describe('summarize tests...', () => {
  const inputData =
    'Alright, we are into the last few days of Hacktoberfest and here’s my status update. Bad news first because I’m a cup half empty kind of guy: I gave up on working with PHP and Laurel because I just ran out of time and lack the drive to really focus on learning a new technology when there are so many other fun things waiting to be tinkered. The good news: I have completed my four PRs required for Hacktoberfest! The last two issues I worked on contrasted each quite a bit. One was a new component for a react-app while the other was just a simple “add a button to html page” (Sorry, I ran out of time). The latter was no fun so I’ll just talk about the react component. The component was for a web-based comic book reader called Villian. The issue involved adding a tooltip to the slider on the toolbar to indicate the handle’s value. My first iteration of the feature involved me googling how other people implemented tooltips. Turns out the base code used in the project was nearly identical to the ones from the React tutorials on their official site. So I just those code segments into the project and submitted the PR. Thought it was a easy fix, but then I was asked to properly add the tooltip as a component and seamlessly incorporate it into the app. This took some time as I was no longer just copy, pasting and editing. I had to look up some react documentation to recall how the framework operated, which took a day, and then modify my PR. I was very satisfied with my end result, the code was a lot cleaner, compact, and modular. The effort is worth the satisfaction. Before Hacktoberfest ends I will be monitoring my other PRs as they have yet been reviewed. But I have to say, I am very happy that I participated in the event. It was really fun and I actually felt like I was programming, not just doing mundane maintenance work. I believe I will be continuing to work in the open source community after this month.\n';
  let predicted;

  beforeAll(async () => {
    predicted = await summarize(inputData, 3);
  });

  test('summarize returns string', () => expect(typeof predicted).toBe('string'));

  /*
  node-summarizer's implementation of TextRank fails to return consistent summaries
  over multiple runs with the same input data.  This might be just an attribute of
  the TestRank algorithm itself as it randomly traverses the word map to generate a
  ranking of the most relavent sentences. Therefore, it is best to not test for
  an expected summary. However, the number of sentences returned should work
  but for some reason it also fails at times. More investigation is required before
  the sentence count and the summary value may be tested.
  */
});
