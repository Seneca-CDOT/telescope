module.exports = [{
      plugin: require('../plugins/gatsby-plugin-top-layout/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-material-ui/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Telescope","short_name":"Telescope","start_url":"/","background_color":"#242424","theme_color":"#242424","display":"minimal-ui","icon":"src/images/logo.svg","cache_busting_mode":"query","include_favicon":true,"legacy":true,"theme_color_in_head":true,"cacheDigest":"cdb93b99e5b4d668f90bbae8556cb09f"},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
