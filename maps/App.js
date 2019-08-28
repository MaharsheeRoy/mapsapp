import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import MapView from "react-native-maps";

import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

var places = {
  Roanoke: {
    latitude: 37.26210021001458,
    longitude: -79.93852944899639
  },
  Istanbul: {
    latitude: 41.023065765458114,
    longitude: 28.97705558315181
  },
  Sydney: {
    latitude: -33.866174,
    longitude: 151.220345
  },
  "Hong Kong": {
    latitude: 22.294074,
    longitude: 114.171995
  }
};

const DEFAULT_LONG_DELTA = 0.07;
const DEFAULT_LAT_DELTA = 0.15;

function App() {
  const [region, setRegion] = useState({
    // initial region
    // latitude, longitude, longitudeDelta, latitudeDelta
    ...places.Roanoke,
    longitudeDelta: DEFAULT_LONG_DELTA,
    latitudeDelta: DEFAULT_LAT_DELTA
  });
  async function movetoSavedLocation() {
    const locationJSON = await AsyncStorage.getItem('location')
    if (!locationJSON){
      return
    }

    setRegion(JSON.parse(locationJSON))
  }

  useEffect(() => {
    movetoSavedLocation()
  }, [])

  function moveToLocation(loc) {
    const place = places[loc];
    setRegion({
      longitude: place.longitude,
      latitude: place.latitude,
      longitudeDelta: DEFAULT_LONG_DELTA,
      latitudeDelta: DEFAULT_LAT_DELTA
    });
  }

  function gotoCurrentLocation2() {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status !== "granted") {
          return Promise.reject();
        }
        return Location.getCurrentPositionAsync({});
      })
      .then(location => {

      });
      console.log('immediately run')
  }

  async function gotoCurrentLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('got current location', location)
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      longitudeDelta: DEFAULT_LONG_DELTA,
      latitudeDelta: DEFAULT_LAT_DELTA,
    })
  }

  return (
    <View
      style={{
        flex: 1
      }}
    >
      <View style={{ flex: 1, flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => moveToLocation("Roanoke")}
        >
          <Text>Roanoke, VA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => moveToLocation("Sydney")}
        >
          <Text>Sydney</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => moveToLocation("Hong Kong")}
        >
          <Text>Hong Kong</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => gotoCurrentLocation()}
        >
          <Text>Here</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={{ flex: 7 }}
        region={region}
        onRegionChangeComplete={data => {
          AsyncStorage.setItem('location' JSON.stringify(data))
        }}
      />
    </View>
  );
}

export default App;
