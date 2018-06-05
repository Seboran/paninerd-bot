var rls = require('rls-api');

var token_api = process.env.TOKEN_API;

function RlsApi() {
    this.client = new rls.Client({
        token: token_api
    });
    this.getSeasonsData(function(data) {
        for (var i in data) {
            
            if (!data[i].endedOn) {
                
                this.season = data[i].seasonId;
                
            }
        }
    });
}

RlsApi.prototype.getSeason = function(next) {
    this.getSeasonsData(function(data) {
        for (var i in data) {
            
            if (!data[i].endedOn) {
                this.season = data[i].seasonId;
            }
        }
        next(this.season);
    });
    
}

RlsApi.prototype.getPlatformsData = function() {
    this.client.getPlatformsData(function(status, data) {
        if(status === 200){
            return data;
        } else {
        }
    });
};

RlsApi.prototype.getSeasonsData = function(next) {
    this.client.getSeasonsData(function(status, data){
        if(status === 200){
            next(data);
        } else {
            next(null);
        }
    });
};

RlsApi.prototype.getPlaylistsData = function() {

    this.client.getPlaylistsData(function(status, data){
        if(status === 200){
            return data;
        } else {
        }
    });
};
RlsApi.prototype.getTiersData = function() {
    this.client.getTiersData(function(status, data){
        if(status === 200){
            console.log("-- Tiers data:", data);
            return data;
        } else {
            console.log("-- getTiersData failed: " + status);
        }
    });
};

RlsApi.prototype.getPlayer = function(id, next) {
    this.client.getPlayer(id, rls.platforms.STEAM, function(status, data){
        if(status === 200){
            next(data);
        } else {
            next(null);
        }
    });
};


module.exports = (new RlsApi());