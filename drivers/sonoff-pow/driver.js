"use strict";

const Homey = require("homey");
const models = ["Sonoff Pow", "POWR2"];

const deviceCapabilities = { "Sonoff Pow": ["onoff", "measure_power"], POWR2: ["onoff", "measure_power", "meter_power", "measure_voltage"] };

class SonoffPow extends Homey.Driver {
  async onPairListDevices(data, callback) {
    await Homey.app.ewelinkApi
      .getDevices()
      .then((devices) => {
        callback(null, this.deviceList(devices.filter((device) => models.includes(device.productModel))));
      })
      .catch((error) => callback(new Error(error)));
  }

  deviceList(devices) {
    let sortDevices = [];

    for (var device of devices) {
      let deviceList = {
        name: device.productModel + " " + device.name,
        data: {
          deviceid: device.deviceid,
          apikey: device.apikey,
          uiid: device.extra.uiid,
        },
        capabilities: deviceCapabilities[device.productModel],
        settings: {
          brandName: device.brandName,
          model: device.productModel,

          mac: device.params.staMac,
          fwVersion: device.params.fwVersion,
          powerResponse: device.params.startup,
          networkLed: device.params.sledOnline,
          duration: device.params.pulse,
          durationLimit: parseFloat(device.params.pulseWidth / 1000),
        },
      };
      sortDevices.push(deviceList);
    }
    return sortDevices;
  }
}

module.exports = SonoffPow;
