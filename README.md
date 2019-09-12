# Stream your local music directly into your RPG Session on Discord
There are several solutions streaming your local audio directly into Discord, many invovle PulseAudio or Voicemeeter (Banana/ Potato). The audio quality for me was never sufficient.

By registering a bot on the Discord Site, then running this bot locally and inviting it to your own Discord server, you have a much higher quality of your current audio stream with minimal config

## Configuration

### Setting up Discord

1. Go to the [Discord Developer Portal](https://discordapp.com/developers/applications/) and register a new application.
2. On the `General Information`-Tab: Provide a App Icon and a Name
3. On the `OAuth2`-Tab: Check the `bot` scope, then copy the generated oAuth link into your clipboard
4. On the same tab, check the following permissions: `Voice Permissions/Connect` and `Voice Permissions/speak`
5. On the `Bot`-Tab: Upload an App Icon and copy the bot token, insert that into the `.env´ file locally
6. Go to the copied oauth2 URL and invite the bot to the desired server.

### Setting up the local environment

This bot has been testet on Windows 10 and it is working. Since we are using low-level system access, we do need to compile several libraries locally. node-gyp will do the heavy lifting for us, but we need to install some prerequisites by hand.

#### Linux
`sudo apt-get install build-essentials`

#### Windows
1. Open a powershell command line with elevated (= admin) rights.
2. Run `npm install --global windows-build-tools`

The installation is taken quite long and you might be getting stuck in either the Windows build tools installer or in the python installer. Unfortunately, this setup is rather fragile and I can only recommend to 

- reboot the server, then do the installation since it is sensible if any outstanding tasks from the installer service are not yet finished
- remove any manually installed python versions if the installer fails

### Get your Audio Device
Run `node listAudioHardware` to get the ID of your desired audo device and insert that into the variable `audioDeviceId` in `index.js`. 

### Permissions
Change `roleNames` to any Role Name that should be able to use the bot. **Note:** they still must have the `index.js` on their computer and need to run through the requirements above to prepare a work environment for the locally run bot.

## Usage

1. Connect to your Discord server
2. Go into a voice Channel
3. `/ambience` summons the bot into your channel, it starts playing audio right away
4. `/ambience` again will disconnect the bot from the current audio channel