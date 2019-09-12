const portAudio = require('naudiodon');

// get the default device. Set to any device id you can find, just 
// do a console.log(portAudio.getDevices()) to find out what's your favorite device ID
let portInfo = portAudio.getHostAPIs();
let defaultDeviceId = portInfo.HostAPIs[portInfo.defaultHostAPI].defaultOutput;
let defaultDevice = portAudio.getDevices().filter(device => device.id === defaultDeviceId);

console.log("Default Device");
console.log("=======================================");
console.log(defaultDevice);

console.log("");
console.log("Output devices");
console.log("=======================================");
let devices = portAudio.getDevices().filter(device => device.maxOutputChannels !== 0).map(device => {
    return {
        id: device.id, 
        name: device.name, 
        api: device.hostAPIName, 
        sampleRate: device.defaultSampleRate
    }
});
console.log(devices);
