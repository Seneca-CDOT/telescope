var plugins = [{
      plugin: require('/home/heidi/Documents/Projects/OSD600/telescope/src/frontend/plugins/gatsby-plugin-top-layout/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/home/heidi/Documents/Projects/OSD600/telescope/src/frontend/node_modules/gatsby-plugin-material-ui/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/home/heidi/Documents/Projects/OSD600/telescope/src/frontend/node_modules/gatsby-plugin-react-helmet/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/home/heidi/Documents/Projects/OSD600/telescope/src/frontend/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"Telescope","short_name":"Telescope","start_url":"/","background_color":"#242424","theme_color":"#242424","display":"minimal-ui","icon":"src/images/logo.svg","cache_busting_mode":"query","include_favicon":true,"legacy":true,"theme_color_in_head":true,"cacheDigest":"cdb93b99e5b4d668f90bbae8556cb09f"},
    },{
      plugin: require('/home/heidi/Documents/Projects/OSD600/telescope/src/frontend/node_modules/gatsby-plugin-use-query-params/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/home/heidi/Documents/Projects/OSD600/telescope/src/frontend/gatsby-ssr'),
      options: {"plugins":[]},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
