/* global Module */

/* Magic Mirror
 * Module: MMM-MPD
 *
 * By Tim Jongsma
 * MIT Licensed.
 */

Module.register("MMM-MPD",{

	// Default module config.
	defaults: {
		showPlaylist: true,
		maxRows: 10,
		fade: true,
        fadePoint: 0.3,
        port: 6600,
        hostname: 'localhost',
    },

	playerState:{
		state: 'pause',
		volume: 100,
		repeat: false,
		random: false,
		duration: null,
		started: null
	},

	playerTimer: null,
	
	playList : [],
	loading: true,
	
	getStyles: function() {
		console.log('getStyles');
        return ['font-awesome.css','MMM-MPD.css'];
    },

    getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
	},
	
	start: function() {
		console.log("starting MPD Client");
		this.addFilters();
		this.sendSocketNotification("config", this.config)
	},

	// Subclass socketNotificationReceived method.
    socketNotificationReceived: function(notification, payload) {
		//console.log(payload);
        Log.info(this.name + " received a notification??: " + notification);
        if (notification === 'mpd_status_update') {
        	this.playerState.state = payload.state;
        	this.playerState.volume = payload.volume;
        	this.playerState.repeat = payload.repeat;
			this.playerState.random = payload.random;
			
			if (payload.elapsed) {
				this.playerState.duration = payload.time.split(":");
				this.playerState.started = Date.now() - (this.playerState.duration[0] * 1000);
			}
			this.loading = false;

			this.updatePlayerTimer();
			this.updateDom();
        }
        if (notification === 'mpd_playlist_update') {
        	this.playList = payload;
			this.loading = false;
        	this.updateDom();
        }
    },

	getTemplate: function () {
        return "templates\\mmm-mpd-playlist.njk";
	},
	
    getTemplateData: function () {
        var templateData = {
            loading: this.loading,
            config: this.config,
            identifier: this.identifier,
            timeStamp: this.dataRefreshTimeStamp
		};

		if (!this.loading) {
			templateData.playerstate = this.playerState.state;
			templateData.playervolume = this.playerState.volume;

			templateData.playertime = this.playerState.playertime;

			if(this.playList.length > 0){
				templateData.playlist = this.playList;
			}
		}
        return templateData;
	},

	addFilters() {
        var env = this.nunjucksEnvironment();
		env.addFilter("getFadeOpacity", this.getFadeOpacity.bind(this));
		env.addFilter("getDuration", this.getDuration.bind(this));
	},
	
	getFadeOpacity: function(index, itemCount) {
		var fadeStart = itemCount * this.config.fadePoint;
        var fadeItemCount = itemCount - fadeStart + 1;
        if (this.config.fade && index > fadeStart) {
            return 1- ((index - fadeStart) / fadeItemCount);
        } else {
            return 1;
		}
    },
	
	getDuration: function(seconds) {
		var minutes = Math.floor(seconds / 60);
		var seconds = Math.floor(seconds - minutes * 60);
		if(seconds.toString().length < 2){
			seconds = '0' + seconds; 
		}
		return minutes + ":" + seconds;
	},

	updatePlayer: function(){
		var elapsed = (Date.now() - this.playerState.started) / 1000;
		this.playerState.playertime = elapsed;
		
		this.updateDom();
	},
	
	startPlayerTimer: function(){
        if(this.playerTimer)return;
        this.playerTimer = setInterval(this.updatePlayer.bind(this),500);
    },
	
	stopPlayerTimer: function(){
        clearInterval(this.playerTimer);
        this.playerTimer = null;
    },
	
	updatePlayerTimer: function(){
        if(this.playerState.state == 'play')
            this.startPlayerTimer();
        else
            this.stopPlayerTimer();
    }
});
