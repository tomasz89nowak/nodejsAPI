// const noteRoutes = require('./api/noteRoutes');
// const userRoutes = require('./api/userRoutes');
//
// module.exports = function(app, db){
//     noteRoutes(app, db);
// };

var router = require('express').Router();

router.use('/api', require('./api'));

module.exports = router;