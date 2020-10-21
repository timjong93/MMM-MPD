# MagicMirror Module: MMM-MPD

This module uses MPD (Music Player Deamon) to connect to your favorite music player, for example mopidy, 
and shows the current state of your music player on your magic mirror.

[![Platform](https://img.shields.io/badge/platform-MagicMirror-informational)](https://MagicMirror.builders)

## Example

![screenshot of MMM-MPD](https://user-images.githubusercontent.com/55058372/96780350-f34c3700-13ec-11eb-8c2d-536098016fef.jpg)

## Installation

In your terminal, go to your MagicMirror's Module folder:

````bash
cd ~/MagicMirror/modules
````

Clone this repository:

````bash
git clone https://github.com/timjong93/MMM-MPD.git
````

Run npm install in the module folder:

````bash
npm install
````

Configure the module in your `config/config.js` file.

## Updating

If you want to update your MMM-MPD module to the latest version, use your terminal to go to your MMM-MPD module folder and type the following command:

````bash
git pull && npm install
````

If you haven't changed the modules, this should work without any problems.
Type `git status` to see your changes, if there are any, you can reset them with `git reset --hard`. After that, git pull should be possible.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: "MMM-MPD",
		position: "top_right",	// This can be any of the regions.
		config: {
			// See 'Configuration options' for more information.
			hostname: "localhost",
			port: 6600
			
		}
	}
]
````

## Configuration options

The following properties can be configured:

| Option | Description
| ------ | -----------
| `hostname` | The hostname of the machine running the MPD server. <br><br> **Example:** `'192.168.0.10'` <br> **Default value:** `'localhost'`
| `port` | The port of the MPD server. <br><br> **Example:** `'6600` <br> **Default value:** `'6600'`
| `showPlaylist` | Show playlist or not <br><br> **Example:** `'true` <br> **Default value:** `'true'`
| `maxRows` | The number of songs comming up in your playlist which will be displayed. <br><br> **Example:** `'10` <br> **Default value:** `'10'`
| `fade` | Enable fading effect. <br><br> **Example:** `'true` <br> **Default value:** `'true'`
| `fadePoint` | The point where the playlist starts to fade. <br><br> **Example:** `'0.3` <br> **Default value:** `'0.3'`

### Displaying the MMM-MPD module

Stop and start your Magic Mirror (your exact method may vary)

````bash
pm2 restart mm
````