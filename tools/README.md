# Telescope Tools

This directory contains a number of useful tools for doing development
and analysis in the Telescope project.

Where possible, we try to write tools that will work cross-platform, and prefer
node to shell scripts. This is not always possible.

## Tools

A number of the tools can be run as binary scripts via node.js, linked to this
directory. To do this, you should first run the following command in the root
of the project:

```
npm link
```

NOTE: if you have issues running `npm link` (e.g., `Error: EACCESS: permission denied`), see [this discussion of possible solutions](https://docs.npmjs.com/resolving-eacces-permissions-errors-when-installing-packages-globally).

### [add-feed](add-feed.js)

`add-feed` allows you to manually insert feeds into the queue, specifying the
`name` and `url` of a feed:

```
add-feed --name "Bender Bending Rodriguez" --url futurama.wordpress.com/feed
```

### [html-elements](html-elements.js)

`html-elements` allows you to get a list and count of all HTML elements seen
in the posts that are indexed in the Redis database. You call it like so:

```
$ html-elements
Processing 5534 posts...
Processing 194,922 elements...
1. <br> (69,015)
2. <p> (36,408)
3. <a> (19,760)
4. <div> (15,244)
5. <li> (8,779)
6. <td> (7,124)
7. <strong> (6,432)
8. <img> (6,205)
9. <code> (4,448)
10. <pre> (4,076)
11. <b> (3,176)
12. <em> (2,699)
13. <ul> (2,325)
14. <tr> (1,790)
15. <h3> (1,726)
16. <i> (1,380)
17. <h4> (1,075)
18. <blockquote> (1,004)
19. <ol> (538)
20. <hr> (441)
21. <table> (365)
22. <tbody> (364)
23. <th> (269)
24. <h5> (133)
25. <iframe> (63)
26. <strike> (37)
27. <h6> (27)
28. <thead> (14)
29. <caption> (5)
```

NOTE: this will only work after you have processed posts into Redis using
`npm start` to run the server for a while.
