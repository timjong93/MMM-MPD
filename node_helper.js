const NodeHelper = require("node_helper");
var mpd = require('mpd'),
cmd = mpd.cmd

module.exports = NodeHelper.create({

	start: function() {
		console.log("Starting module helper: " + this.name);
		this.config = {};
		this.curPos = 0;
	},

	parsePlaylist: function(msg, start, end){
		let playList = [];
		let track = '';
		let lines = msg.split('\n');
		
		while(lines[0]){
			if(track.length > 0 && lines[0].trim().startsWith('file')){
				playList.push(mpd.parseKeyValueMessage(track));
				track = '';
			}
			track += lines[0] + '\n';
			lines.shift();
			
			if(lines.length === 1 && !lines[0].trim().startsWith('file') && track.length > 0){
				playList.push(mpd.parseKeyValueMessage(track));
			}
		}
		playList = playList.filter(function(track) {
			return parseInt(track.Pos) >= start && parseInt(track.Pos) < end;
		});
		return playList;
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if(notification === 'config'){
			self.config = payload;

			self.client = mpd.connect({
				port: this.config.port,
				host: this.config.hostname,
			});

			self.client.on('ready', function(err) {
				if (err) throw err;
				console.log('ready');
				self.client.sendCommand(cmd("status", []), function(err, msg) {
					if (err) throw err;

					let payload = mpd.parseKeyValueMessage(msg);
					self.sendSocketNotification('mpd_status_update', payload);
					self.curPos = parseInt(payload.song);

					if(self.config.maxRows){
						self.client.sendCommand(cmd("playlistinfo", []), function(err, msg) {
							if (err) throw err;
							let payload  = self.parsePlaylist(msg, self.curPos, self.curPos+self.config.maxRows);
							self.sendSocketNotification('mpd_playlist_update', payload);
						});
					}
				});
			});

			self.client.on('system', function(name) {
				self.client.sendCommand(cmd("status", []), function(err, msg) {
					if (err) throw err;

					let payload = mpd.parseKeyValueMessage(msg);
					self.sendSocketNotification('mpd_status_update', payload);
					self.curPos = parseInt(payload.song);

					self.client.sendCommand(cmd("playlistinfo", []), function(err, msg) {
						if (err) throw err;
						let payload  = self.parsePlaylist(msg, self.curPos, self.curPos+self.config.maxRows);
						self.sendSocketNotification('mpd_playlist_update', payload);
					});
				});
			});
		}
	}
});