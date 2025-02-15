import React, { Component } from 'react';

import { StyleSheet } from 'react-native';

import { ViroARScene, ViroText } from 'react-viro';

export default class HelloWorldSceneAR extends Component {
  constructor() {
    super();

    // Set initial state here
    this.state = {
      text: 'Initializing AR...',
      northPointX: 0,
      northPointZ: 0,
      southPointX: 0,
      southPointZ: 0,
      eastPointX: 0,
      eastPointZ: 0,
      westPointX: 0,
      westPointZ: 0,
    };

    // bind 'this' to functions
    this._onInitialized = this._onInitialized.bind(this);
    this._latLongToMerc = this._latLongToMerc.bind(this);
    this._transformPointToAR = this._transformPointToAR.bind(this);
  }

  render() {
    return (
      <ViroARScene onTrackingInitialized={this._onInitialized}>
        <ViroText
          text={this.state.text}
          scale={[0.2, 2, 0.2]}
          position={[0, -2, -5]}
          style={styles.helloWorldTextStyle}
        />
        <ViroText
          text="North Text"
          scale={[3, 3, 3]}
          transformBehaviors={['billboard']}
          position={[this.state.northPointX, 0, this.state.northPointZ]}
          style={styles.helloWorldTextStyle}
        />
        <ViroText
          text="South Text"
          scale={[3, 3, 3]}
          transformBehaviors={['billboard']}
          position={[this.state.southPointX, 0, this.state.southPointZ]}
          style={styles.helloWorldTextStyle}
        />
        <ViroText
          text="West Text"
          scale={[3, 3, 3]}
          transformBehaviors={['billboard']}
          position={[this.state.westPointX, 0, this.state.westPointZ]}
          style={styles.helloWorldTextStyle}
        />
        <ViroText
          text="East Text"
          scale={[3, 3, 3]}
          transformBehaviors={['billboard']}
          position={[this.state.eastPointX, 0, this.state.eastPointZ]}
          style={styles.helloWorldTextStyle}
        />
      </ViroARScene>
    );
  }

  _onInitialized() {
    const northPoint = this._transformPointToAR(47.618574, -122.338475);
    const eastPoint = this._transformPointToAR(47.618534, -122.338061);
    const westPoint = this._transformPointToAR(47.618539, -122.338644);
    const southPoint = this._transformPointToAR(47.61821, -122.338455);
    console.log(
      `obj north final x:${  northPoint.x  }final z:${  northPoint.z}`
    );
    console.log(`obj south final x:${southPoint.x}final z:${southPoint.z}`);
    console.log(`obj east point x${eastPoint.x}final z${eastPoint.z}`);
    console.log(`obj west point x${westPoint.x}final z${westPoint.z}`);
    this.setState({
      northPointX: northPoint.x,
      northPointZ: northPoint.z,
      southPointX: southPoint.x,
      southPointZ: southPoint.z,
      eastPointX: eastPoint.x,
      eastPointZ: eastPoint.z,
      westPointX: westPoint.x,
      westPointZ: westPoint.z,
      text: 'AR Init called.',
    });
  }

  _latLongToMerc(lat_deg, lon_deg) {
    const lon_rad = (lon_deg / 180.0) * Math.PI;
    const lat_rad = (lat_deg / 180.0) * Math.PI;
    const sm_a = 6378137.0;
    const xmeters = sm_a * lon_rad;
    const ymeters = sm_a * Math.log((Math.sin(lat_rad) + 1) / Math.cos(lat_rad));
    return { x: xmeters, y: ymeters };
  }

  _transformPointToAR(lat, long) {
    const objPoint = this._latLongToMerc(lat, long);
    const devicePoint = this._latLongToMerc(47.618534, -122.338478);
    console.log(`objPointZ: ${objPoint.y}, objPointX: ${objPoint.x}`);
    // latitude(north,south) maps to the z axis in AR
    // longitude(east, west) maps to the x axis in AR
    const objFinalPosZ = objPoint.y - devicePoint.y;
    const objFinalPosX = objPoint.x - devicePoint.x;
    // flip the z, as negative z(is in front of us which is north, pos z is behind(south).
    return { x: objFinalPosX, z: -objFinalPosZ };
  }
}

var styles = StyleSheet.create({
  helloWorldTextStyle: {
    fontFamily: 'Arial',
    fontSize: 30,
    color: '#000000',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
});

module.exports = HelloWorldSceneAR;
