require('dotenv').config();

const portAudio = require('naudiodon');
const Discord = require('discord.js');
const client = new Discord.Client();

// Discord Bot Token
let discordBotToken = process.env.DISCORD_BOT_TOKEN;

// roles that are able to summon the bot into their voice channel
const roleNames = ['GM', 'Admin'];

// sample bitrate to set. Adjust to your voicemeeter banana setting or just use 44100
const sampleRate = 48000;

// set the audio device ID, run `node listAudioHardware` to find out which to use, 
// or use null for the configured default device
const audioDeviceId = null;

// get the default device. Set to any device id you can find, just 
// do a console.log(portAudio.getDevices()) to find out what's your favorite device ID
let portInfo = portAudio.getHostAPIs();
let defaultDeviceId = portInfo.HostAPIs[portInfo.defaultHostAPI].defaultOutput;
let defaultDevice = portAudio.getDevices().filter(device => device.id === defaultDeviceId);

// Create an instance of AudioIO with inOptions, which will return a ReadableStream
let ai = null;

// create the transform stream
let stream = new require('stream').Transform()
stream._transform = function (chunk, encoding, done) {
  this.push(chunk);
  done();
}

// voiceChannel is saved for toggling on/off
let voiceChannel = null;

// Log startup message to console
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// waiting for message prompt
client.on('message', async message => {
  if (!message.guild) return;
  if (message.author.bot) return;
  console.log (message.author);

  // check if the user has one of the roles set above
  let isEligible = message.member.roles.array().filter(Role => roleNames.includes(Role.name)).length !== 0;

  // deny access
  if (!isEligible) {
    message.reply('Only GMs may summon me.');
    return;
  }

  if (message.content === '/ambience') {
    // leave the channel
    if (voiceChannel !== null) {
      message.reply('I can just hope that my services rendered you speechless.');
      voiceChannel.leave();
      voiceChannel = null;
      ai.quit();
      ai.unpipe(stream);
    } else {
      // Only try to join the sender's voice channel if they are in one themselves
      voiceChannel = message.member.voiceChannel;
      if (!voiceChannel) {
        message.reply('Please join a VoiceChannel first, then summon me.');
      } else {
        message.reply('At your service');
        voiceChannel.join()
        .then(connection => {
          ai = new portAudio.AudioIO({
            inOptions: {
              channelCount: 2,
              sampleFormat: portAudio.SampleFormat16Bit,
              sampleRate: sampleRate,
              deviceId: audioDeviceId !== null ? audioDeviceId : defaultDevice.id // Use -1 or omit the deviceId to select the default device
            }
          });
          
          // pipe the audio input into the transform stream and
          ai.pipe(stream);
          // the transform stream into the discord voice channel
          const dispatcher = connection.playConvertedStream(stream, { passes: 5, bitrate: 96000 });
          // start audio capturing
          ai.start();

          dispatcher.on('debug', (info) => console.log(info));
          dispatcher.on('end', () => voiceChannel.leave());
          dispatcher.on('error', (error) => console.log(error));

        })
        .catch(error => {
          console.log(error);
          message.reply(`Cannot join VoiceChannel, because ${error.message}`);
        });
      }
    }
  }
});

client.login(discordBotToken).then(console.log).catch(console.error);
