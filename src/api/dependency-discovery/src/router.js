const { Router } = require('@senecacdot/satellite');
const { getDependencyList, getNpmPackageInfo, isPackageDependency } = require('./dependency-list');

const router = Router();

router.get('/projects', async (req, res, next) => {
  try {
    res.set('Cache-Control', 'max-age=3600');
    res.status(200).json(await getDependencyList());
  } catch (err) {
    next(err);
  }
});

// For project names that use a full name convention (e.g. @senecacdot/satellite),
// we will use /projects/:namespace/:name, for projects that have regular name,
// then we will use /projects/:name.
// That means that if "name" is undefined, then we hit /projects/:name, instead.
router.get('/projects/:namespace/:name?', async (req, res, next) => {
  const { namespace, name } = req.params;
  const packageName = name ? `${namespace}/${name}` : namespace;

  try {
    if (!(await isPackageDependency(packageName))) {
      res.status(404);
      next();
    } else {
      res.set('Cache-Control', 'max-age=3600');
      res.status(200).json(await getNpmPackageInfo(packageName));
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
