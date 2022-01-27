// Define various roles for our tokens
module.exports.seneca = () => ['seneca'];
module.exports.telescope = () => ['seneca', 'telescope'];
module.exports.admin = () => ['seneca', 'telescope', 'admin'];
module.exports.superUser = () => ['seneca', 'admin'];
