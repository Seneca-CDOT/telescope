/**
 * This file contains the class Post with methods of it.
 * Class Post is used to generate objects that contain
 * data of each blog post.
 */

class Post {
  constructor(author, title, htmlContent, textContent, datePublished, dateUpdated, postLink, guid) {
    this.author = author;
    this.title = title;
    this.content = htmlContent;
    this.text = textContent;
    this.published = datePublished;
    this.updated = dateUpdated;
    this.postLink = postLink;
    this.guid = guid;
    this.wordCount = 0;
  }
}

module.exports = Post;
