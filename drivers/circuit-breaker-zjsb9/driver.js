"use strict";

const Homey = require("homey");
const model = "ZJSB9-80";

class CircuitBreaker extends Homey.Driver {
  onInit() {
    this.log("Circuit Breaker has been inited");
  }

  onPairListDevices(data, callback) {
    Homey.app.ewelinkApi
      .getDevices(model)
      .then(devices => callback(null, this.deviceList(devices)))
      .catch(error => callback(new Error(error)));
  }

  deviceList(devices) {
    console.log("[INFO]: CircuitBreaker -> deviceList -> devices", devices)
    let sortDevices = [];
    for (var device of devices) {
      let deviceList = {
        name: device.productModel + " " + device.name,
        data: {
          deviceid: device.deviceid,
          apikey: device.apikey,
          extra: device.extra.extra
        },
        settings: {
          brandName: device.brandName,
          model: device.productModel,
          ip: device.ip,
          mac: device.params.staMac,
          fwVersion: device.params.fwVersion
        }
      };
      sortDevices.push(deviceList);
    }
    return sortDevices;
  }
}

module.exports = CircuitBreaker;