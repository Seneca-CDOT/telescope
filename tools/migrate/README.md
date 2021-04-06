# Planet CDOT Feed List migration tool

This tool downloads all users from the wiki page and dumps them into a JSON file.

## Customization

In `migrage.js` you can find the following two variables: `FEED_URL` and `FILE_NAME`.

- `FEED_URL` points to the current location of the [Planet CDOT Feed List](https://wiki.cdot.senecacollege.ca/wiki/Planet_CDOT_Feed_List#Feeds)
- `FILE_NAME` allows users to specify the desired filename of the output file

## Install Dependencies

```
cd src/tools/migrate
npm install
```

## Usage

```
cd src/tools/migrate
npm start
```
