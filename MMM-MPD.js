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
        maxRows: 10,
        fadePoint: 0.5,
        port: 6600,
        hostname: 'localhost',
    },

	playerState:{
		state: 'pause',
		volume: 100,
		repeat: false,
		random: false,
	},

	playList : [],

	getStyles: function() {
		console.log('getStyles');
        return ['font-awesome.css','MMM-MPD.css'];
    },

	start: function() {
		console.log("starting MPD Client");
		this.sendSocketNotification("config", this.config)
	},

	// Subclass socketNotificationReceived method.
    socketNotificationReceived: function(notification, payload) {
        Log.info(this.name + " received a notification??: " + notification);
        if (notification === 'mpd_status_update') {
        	console.log(payload);
        	this.playerState.state = payload.state;
        	this.playerState.volume = payload.volume;
        	this.playerState.repeat = payload.repeat;
        	this.playerState.random = payload.random
        	this.updateDom();
        }
        if (notification === 'mpd_playlist_update') {
        	this.playList = payload; 
        	console.log(payload);
        	this.updateDom();
        }

    },

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");
		var playerStateDiv = document.createElement('div');
		if(this.playerState.state === 'play'){
			playerStateDiv.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
		}else{
			playerStateDiv.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
		}
		if(this.playList.length > 0){
			let currentDiv = document.createElement('div');
			currentDiv.innerHTML = this.playList[0].Title+'<br>'+this.playList[0].Artist+'<br>'+this.playList[0].Album;
			currentDiv.classList.add('current', 'small');
			playerStateDiv.appendChild(currentDiv);
		}
		wrapper.appendChild(playerStateDiv);

		// <header class="module-header">Calendar</header>
		let playListHeader = document.createElement("header");
		playListHeader.className = "module-header";
		playListHeader.innerHTML = 'playList'
		wrapper.appendChild(playListHeader);

		let tableWrapper = document.createElement("table");
        tableWrapper.className = "small playList";
        for (var i = 0; i < this.playList.length; i++) {
        	let tr = document.createElement("tr");

        	var startingPoint = 3;
            var steps = this.playList.length - this.config.fadePoint;
            if (i >= startingPoint) {
                var currentStep = i - startingPoint;
                tr.style.opacity = 1 - (1 / steps * currentStep);
            }

        	let tdSong = document.createElement("td");
        	tdSong.innerHTML = this.playList[i].Title + " - " + this.playList[i].Artist;
        	tdSong.className = "align-left bright";
        	tr.appendChild(tdSong)
        	let tdTime = document.createElement("td");
        	let minutes = Math.floor(this.playList[i].Time / 60);
        	var seconds = this.playList[i].Time - minutes * 60;
        	if(seconds.toString().length < 2){
        		seconds = '0' + seconds; 
        	}
        	tdTime.innerHTML = minutes + ":" + seconds;
        	tdTime.className = "align-right light";
        	tr.appendChild(tdTime)
        	tableWrapper.appendChild(tr);
        }
        wrapper.appendChild(tableWrapper);
		return wrapper;
	}
});
