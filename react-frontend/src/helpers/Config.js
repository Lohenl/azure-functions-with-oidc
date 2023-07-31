/*if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Config-Prod');
} else {
  module.exports = require('./Config-Dev');
}
*/

switch (process.env.REACT_APP_ENV) {
  case 'production':
    // module.exports = require('./Config-Prod');
    break;
  case 'development':
    // module.exports = require('./Config-Dev');
    break;
  case 'local':
    module.exports = require('./Config-Local');
    break;
  default:
    // module.exports = require('./Config-Prod');
    break;
}
