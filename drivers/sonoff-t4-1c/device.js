"use strict";

const Homey = require("homey");

class SonoffT41C extends Homey.Device {
  onInit() {
    this.log("Sonoff Basic has been inited");
    this.driver = this.getDriver();
    this.data = this.getData();
    this.registerStateChangeListener();
    this.registerToggle("onoff");
    this.saving = false;
  }

  handleStateChange(device) {
    console.log("[INFO]: SonoffT41C -> handleStateChange -> device", device);
    if (device.params) {
      if (device.params.switch == "on")
        this.updateCapabilityValue("onoff", true);
      if (device.params.switch == "off")
        this.updateCapabilityValue("onoff", false);
      if (device.params.startup && !this.saving)
        this.setSettings({
          powerResponse: device.params.startup
        });
      if (device.params.sledOnline && !this.saving)
        this.setSettings({
          networkLed: device.params.sledOnline
        });
      if (device.params.pulse && !this.saving)
        this.setSettings({
          duration: device.params.pulse
        });
      if (device.params.pulseWidth && !this.saving)
        this.setSettings({
          durationLimit: parseFloat(device.params.pulseWidth / 1000)
        });
    }
  }

  async onSettings(oldSettingsObj, newSettingsObj, changedKeysArr, callback) {
    this.saving = true;
    let params = {
      startup: newSettingsObj.powerResponse,
      sledOnline: newSettingsObj.networkLed,
      pulse: newSettingsObj.duration,
      pulseWidth: newSettingsObj.durationLimit * 1000
    };

    let data = {
      deviceid: this.data.deviceid,
      apikey: this.data.apikey
    };

    Homey.app.ewelinkApi
      .setParams(data, params)
      .then(() => callback(null, true));
  }

  updateCapabilityValue(name, value, trigger) {
    if (this.getCapabilityValue(name) != value) {
      this.setCapabilityValue(name, value);
    }
  }

  registerToggle(name, trigger) {
    let data = {
      deviceid: this.data.deviceid,
      apikey: this.data.apikey
    };
    this.registerCapabilityListener(name, async value => {
      Homey.app.ewelinkApi.setPowerState(data, value);
    });
  }

  registerStateChangeListener() {
    Homey.app.ewelinkApi.on(`${this.data.deviceid}`, event =>
      this.handleStateChange(event)
    );
  }

  unregisterStateChangeListener() {
    Homey.app.ewelinkApi.removeListener(`${this.data.deviceid}`, event =>
      this.handleStateChange(event)
    );
  }
}

module.exports = SonoffT41C;
