# Module: MMM-MPD
This module uses MPD (Music Player Deamon) to connect to your favorite music player, for example mopidy, 
and shows the current state of your music player on your magic mirror.

![screenshot of MMM-MPD](https://user-images.githubusercontent.com/3584382/31564034-be25b64c-b061-11e7-93e6-2209d26000c9.PNG)

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: "mpd_config",
		position: "top_right",	// This can be any of the regions.
		config: {
			// See 'Configuration options' for more information.
			hostname: "localhost",
			port: 6600
			
		}
	}
]
````
Run npm install in the module folder.

## Configuration options

The following properties can be configured:

| Option | Description
| ------ | -----------
| `hostname` | The hostname of the machine running the MPD server. <br><br> **Example:** `'192.168.0.10'` <br> **Default value:** `'localhost'`
| `port` | The port of the MPD server. <br><br> **Example:** `'6600` <br> **Default value:** `'6600'`
| `maxRows` | The number of songs comming up in your playlist which will be displayed. <br><br> **Example:** `'10` <br> **Default value:** `'10'`
| `fadePoint` |the point where the playlist starts to fade <br><br> **Example:** `'0.5` <br> **Default value:** `'0.5'`
