# Reports

There are a number of reports that get generated, and can aid in developer understanding.

## Coverage

The report you can generate is test coverage information. To generate this report,
run the following command:

```
npm run coverage
```

After the tests complete, a text summary report is printed. However, a much more
useful, dynamic HTML version is created in `coverage/lcov-report/index.html`, which
you can open in your web browser.

## Webhint

The second report is for [Webhint](https://webhint.io/) information about the frontend.
To generate this report:

```
npm run webhint
```

This will start the web server and run webhint in a browser. A text summary will
be printed to the console, and an HTML version created in `hint-report/http-localhost-3000/index.html`, which you can open in your web browser.
