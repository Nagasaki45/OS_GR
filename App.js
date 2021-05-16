import React, { useState, useEffect } from "react";
import {
  Button,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const LatLon = require("mt-latlon");
const OsGridRef = require("mt-osgridref");
const geoRegex = /geo:(-?[0-9]+.[0-9]+),(-?[0-9]+.[0-9]+)/;

const App = (props) => {
  const [grString, setGrString] = useState(null);
  const [geo, setGeo] = useState(null);

  const handleGeoEvent = (event) => {
    handleGeo(event.url);
  };

  const latlonToGeo = (latlon) => {
    if (!latlon._lat || !latlon._lon) {
      return null;
    }
    const lat = latlon._lat.toFixed(6);
    const lon = latlon._lon.toFixed(6);
    return `geo:${lat},${lon}?q=${lat},${lon}`;
  };

  // Handle geo and set gr string
  const handleGeo = (geo) => {
    const match = geo.match(geoRegex);
    const latlon = new LatLon(match[1], match[2]);
    const gr = OsGridRef.latLongToOsGrid(latlon);
    setGrString(gr.toString());
    setGeo(geo);
  };

  const onChangeText = (text) => {
    const gr = OsGridRef.parse(text);
    const latlon = OsGridRef.osGridToLatLong(gr);
    const geo = latlonToGeo(latlon);
    setGrString(text);
    setGeo(geo);
  };

  // Register geo handler on component mount, remove on dismount
  useEffect(() => {
    Linking.addEventListener("url", handleGeoEvent);
    return () => {
      Linking.removeEventListener("url", handleGeoEvent);
    };
  });

  // Get the deep link used to open the app
  Linking.getInitialURL().then((initialUrl) => {
    if (initialUrl && !grString) {
      handleGeo(initialUrl);
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OS grid reference</Text>
      <TextInput
        style={styles.data}
        onChangeText={onChangeText}
        value={grString == null ? "enter value here" : grString}
      />
      <Button
        onPress={() => Linking.openURL(geo)}
        title="Open with"
        disabled={!geo}
        accessibilityLabel="Open OS grid reference in another app"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  data: {
    fontSize: 40,
    padding: 20,
    marginTop: 20,
    marginBottom: 60,
    borderWidth: 4,
  },
  title: {
    fontSize: 30,
    color: "#fff",
  },
});

export default App;
