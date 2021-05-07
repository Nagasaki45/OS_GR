import React from 'react';
import {StyleSheet, Text} from 'react-native';

const App = () => {
  var LatLon = require('mt-latlon');
  var OsGridRef = require('mt-osgridref');
  var latlon = new LatLon(51.5136, -0.0983);
  var point = OsGridRef.latLongToOsGrid(latlon);
  return <Text style={styles.title}>{point.toString()}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: '#fff',
  },
});

export default App;
