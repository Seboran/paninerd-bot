var rls = require("rls-api");

var token_api = process.env.TOKEN_API;

function RlsApi() {
  this.client = new rls.Client({
    token: token_api
  });
}

RlsApi.prototype.getPlayer = function(id, next) {
  this.client.getPlayer(id, rls.platforms.STEAM, function(status, data) {
    if (status === 200) {
      next(data);
    } else {
      next(null);
    }
  });
};

module.exports = new RlsApi();
