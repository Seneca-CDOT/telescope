const textParser = require('../src/backend/utils/text-parser');

/**
 * textParser() will convert HTML fragments to plain text.
 */
describe('text-parser tests', function() {
  test('textParser() with doctype', () => {
    const result = textParser('<!DOCTYPE html><p>Hello World</p>');
    expect(result).toBe('Hello World');
  });

  test('textParser() with HTML body', () => {
    const result = textParser(
      '<body style="text-align:center;"><h1>Seneca</h1><div>OpenSource Telescope</div></body></html>'
    );
    // NOTE: we don't have a great way to deal with whitespace like this.
    expect(result).toBe('SenecaOpenSource Telescope');
  });

  test('textParser() with minimal document fragment', () => {
    const result = textParser('<p>OSD600</p>');
    expect(result).toBe('OSD600');
  });

  test('textParser() with real blog post', () => {
    // Real blog post from https://grommers.wordpress.com/
    const html = `<p>Often we go on adventures in real-life, and its pretty straight forward, you go to a location, you ask the information kiosks, and you have a very human interaction and can ask just about any question you can think of, and they&#8217;ll either point you in the right direction (if they are a decent human being, and not someone who sends you wandering aimlessly.) or get a hold of someone who can.</p>

    <p>Now this is the first year I&#8217;ve started using git extensively, I&#8217;ve run into multiple problems much like other first time programmers. The biggest hurdle though for many of us, is confidence. Am I good enough to tackle this problem? I don&#8217;t have the answer to these problems&#8230;let me find another one!<br><br>This is the problem many beginner coder&#8217;s go through in there mind, and trust me when I say you&#8217;re not alone. It&#8217;s intimidating, it&#8217;s stressful, and it&#8217;s very easy to just put your hands up and walk away. <br><br>I don&#8217;t ever suggest doing that, and the reason why? EVERYONE feels the same feelings.  So how did I begin?</p>

    <p>Well luckily enough, my professor actually forced us to get 3 issues to begin, showed us the ins and outs of searching through Github (pretty straight forward but click <a href="https://guides.github.com/features/issues/">here </a>if you want to look into it further.)<br><br><a href="https://github.com/pyproj4/pyproj/issues/449">Link #1</a> &#8211; So, the first of the three I went too actually thought had to do about cheese. It was talking about a cheese wheel. I thought hey! I like cheese! Sadly, it has very little to do with cheese, but documentation. I felt that this would be a good start for me, as it will get me some experience documenting and at least it will challenge my ability to understand something. If I can write it clean and concise to another user who knows it better then I do, I think I&#8217;ve done a good job. Fairly simple, and I think its a good base to work off of!</p>

    <p><a href="https://github.com/MaximDevoir/ins-guns2/issues/4">Link #2 </a>&#8211; This will most like before my first attempt at coding something for someone else without a rubric and just my own knowledge. Discord is a big platform right now for the gaming community, and I love my gaming communities. This is a relatively simple fix, but I think can help me understand the basic foundations of how discord modding works. This will in turn give me drive to look at this code and be able to improve my own servers on these things.</p>

    <p><a href="https://github.com/plumier/tutorial-monorepo-social-login/issues/4">Link #3</a> &#8211; Reading more into passport.js, and actually how these logins work, I felt this is something I knew quite a bit about, but how to implement it in a different manner, and in someone else code I felt was a good thing to build off something I already knew.  This will be the third issue that I&#8217;m going to try and fix. <br><br>All in all, this will be my first adventure, and hopefully not my last into the github world! If this is your first time, know I was there once as well, and as Ms. Frizzle says <a href="https://www.youtube.com/watch?v=p8jw_-Vh9Z0">&#8220;Take chances, make mistakes, get messy!&#8221;<br></a></p>
`;
    const parsed = `Often we go on adventures in real-life, and its pretty straight forward, you go to a location, you ask the information kiosks, and you have a very human interaction and can ask just about any question you can think of, and they’ll either point you in the right direction (if they are a decent human being, and not someone who sends you wandering aimlessly.) or get a hold of someone who can.

    Now this is the first year I’ve started using git extensively, I’ve run into multiple problems much like other first time programmers. The biggest hurdle though for many of us, is confidence. Am I good enough to tackle this problem? I don’t have the answer to these problems…let me find another one!This is the problem many beginner coder’s go through in there mind, and trust me when I say you’re not alone. It’s intimidating, it’s stressful, and it’s very easy to just put your hands up and walk away. I don’t ever suggest doing that, and the reason why? EVERYONE feels the same feelings.  So how did I begin?

    Well luckily enough, my professor actually forced us to get 3 issues to begin, showed us the ins and outs of searching through Github (pretty straight forward but click here if you want to look into it further.)Link #1 – So, the first of the three I went too actually thought had to do about cheese. It was talking about a cheese wheel. I thought hey! I like cheese! Sadly, it has very little to do with cheese, but documentation. I felt that this would be a good start for me, as it will get me some experience documenting and at least it will challenge my ability to understand something. If I can write it clean and concise to another user who knows it better then I do, I think I’ve done a good job. Fairly simple, and I think its a good base to work off of!

    Link #2 – This will most like before my first attempt at coding something for someone else without a rubric and just my own knowledge. Discord is a big platform right now for the gaming community, and I love my gaming communities. This is a relatively simple fix, but I think can help me understand the basic foundations of how discord modding works. This will in turn give me drive to look at this code and be able to improve my own servers on these things.

    Link #3 – Reading more into passport.js, and actually how these logins work, I felt this is something I knew quite a bit about, but how to implement it in a different manner, and in someone else code I felt was a good thing to build off something I already knew.  This will be the third issue that I’m going to try and fix. All in all, this will be my first adventure, and hopefully not my last into the github world! If this is your first time, know I was there once as well, and as Ms. Frizzle says “Take chances, make mistakes, get messy!”
`;
    expect(textParser(html)).toBe(parsed);
  });
});
