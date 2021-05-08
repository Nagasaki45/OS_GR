import React, { useState, useEffect } from "react";
import { Linking, StyleSheet, View, Text } from "react-native";

const LatLon = require("mt-latlon");
const OsGridRef = require("mt-osgridref");
const geoRegex = /geo:(-?[0-9]+.[0-9]+),(-?[0-9]+.[0-9]+)/;

const App = (props) => {

  const [gr, setGr] = useState(null);

  const handleGeoEvent = (event) => {
    handleGeo(event.url);
  };

  // Handle geo and set gr
  const handleGeo = (url) => {
    const match = url.match(geoRegex);
    const latlon = new LatLon(match[1], match[2]);
    const point = OsGridRef.latLongToOsGrid(latlon);
    setGr(point.toString());
  };

  // Register geo handler on component mount, remove on dismount
  useEffect(() => {
    Linking.addEventListener("url", handleGeoEvent);
    return (() => {
      Linking.removeEventListener("url", handleGeoEvent);
    })
  })

  // Get the deep link used to open the app
  Linking.getInitialURL().then((initialUrl) => {
    if (initialUrl && !gr) {
      handleGeo(initialUrl)
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gr}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    color: "#fff",
  },
});

export default App;
