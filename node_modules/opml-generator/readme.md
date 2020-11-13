# opml-generator.js [![Build Status](https://travis-ci.org/azu/opml-generator.svg)](https://travis-ci.org/azu/opml-generator)

Generate opml from object.

## Installation

```sh
npm install opml-generator
```

## Usage

``` js
var header = {
    "title": "title-text",
    "dateCreated": new Date(2014, 2, 9),
    "ownerName": "azu"
};
var outlines = [
    {
        text: "txt",
        title: "title-text",
        type: "rss",
        "xmlUrl": "http://example.com/rss",
        "htmlUrl": "http://example.com/"
    },
    {
        text: "txt",
        title: "title-text",
        type: "rss",
        "xmlUrl": "http://example.com/rss",
        "htmlUrl": "http://example.com/"
    }
];
opml(header, outlines);// => XML
```

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT
