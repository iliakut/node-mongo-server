const cors = require('cors');

const whitelist = ['http://localhost:3000', 'https://localhost:3444'];

const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  console.log(req.header('Origin'));
  if( whitelist.includes(req.header('Origin'))) {
    corsOptions = { origin: true };
  }
  else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);