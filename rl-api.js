var rls = require('rls-api');

var token_api = process.env.TOKEN_API;

function RlsApi() {
    this.client = new rls.Client({
        token: token_api
    });
    this.getSeasonsData(function(data) {
        for (var i in data) {
            console.log(data[i]);
            if (!data[i].endedOn) {
                console.log('blbl');
                this.season = data[i].seasonId;
                console.log(this.season);
            }
        }
    });
}

RlsApi.prototype.getSeason = function(next) {
    this.getSeasonsData(function(data) {
        for (var i in data) {
            console.log(data[i]);
            if (!data[i].endedOn) {
                console.log('blbl');
                this.season = data[i].seasonId;
                console.log(this.season);
            }
        }
        next(this.season);
    });
    
}

RlsApi.prototype.getPlatformsData = function() {
    this.client.getPlatformsData(function(status, data) {
        if(status === 200){
            console.log("-- Platforms data:", data);
            return data;
        } else {
            console.log("-- getPlatformsData failed: " + status);
        }
    });
};

RlsApi.prototype.getSeasonsData = function(next) {
    this.client.getSeasonsData(function(status, data){
        if(status === 200){
            console.log("-- Seasons data:", data);
            next(data);
        } else {
            console.log("-- getSeasonsData failed: " + status);
            next(null);
        }
    });
};

RlsApi.prototype.getPlaylistsData = function() {

    this.client.getPlaylistsData(function(status, data){
        if(status === 200){
            console.log("-- Playlists data:", data);
            return data;
        } else {
            console.log("-- getPlaylistsData failed: " + status);
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
            console.log("-- Player Data:", data);
            console.log('ranked', (data));
            next(data);
        } else {
            console.log("-- getPlayer failed: " + status);
            next(null);
        }
    });
};


module.exports = (new RlsApi());