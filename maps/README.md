# Week 7 Day 2. Morning Videos & Individual Exercises

### Setup

```sh
npm install
npm start
```

Connect the running expo app using the Expo Client on your phone.

## Part 1. MapView

### [Watch Me: Geolocation](https://vimeo.com/224884883)
### [Watch Me: MapView](https://vimeo.com/224886756)

Build a `MapView` that can take you to Istanbul, Sydney, and Hong Kong.
Use 3 buttons (i.e. `TouchableOpacity`s) at the top of the screen to change
the region the map is currently displaying.

<details><summary>
Hint
</summary><p>

Use the `region` property instead of the `initialRegion` property if you want
to be able to change a `MapView` region via state.

</p></details>

<details><summary>
Coordinates
</summary><p>

- Istanbul: 41.067841, 29.045258
- Sydney: -33.866174, 151.220345
- Hong Kong: 22.294074, 114.171995

</p></details>

### Result

![Goal animated screenshot](https://cl.ly/1e0x3c430D2C/Screen%20Recording%202017-07-11%20at%2012.10%20AM.gif)

### Links

- [AirBnB React Native Maps documentation](https://github.com/airbnb/react-native-maps)

## Part 2. Geolocation

### Install additional dependencies

In order to find the user's location we'll be installing a few other packages.

```sh
npm install expo-constants expo-location expo-permissions
```

**Add the following to the top of `App.js`**

```js
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
```

Add a 4th button to the top of the screen that centers the map on the the users'
current location.

When the user clicks the `Here` button, first request permission using

```js
let { status } = await Permissions.askAsync(Permissions.LOCATION);
```

then find the location using:

```js
let location = await Location.getCurrentPositionAsync({});
```

And set the result in the component as state.

<details><summary>
Hint
</summary><p>


Using an async function, we first request permission to access the user's location

```js
async function getLocationAsync() {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    // set error message state, permission was not granted
  }

  let location = await Location.getCurrentPositionAsync({});
  // set the location using the state
  this.setState({ location });
};
```


</p></details>

### Result

![Goal animated screenshot](https://cl.ly/0k1F0g1Y001j/Screen%20Recording%202017-07-11%20at%2012.06%20AM.gif)

### Links

- [Expo location documentation](https://docs.expo.io/versions/latest/sdk/location/)

## Part 3. AsyncStorage

### [Watch Me: AsyncStorage](https://vimeo.com/224880785)

Use `onRegionChangeComplete` to detect when `MapView` is moved. Inside the
`onRegionChangeComplete` callback use `AsyncStorage` to store new location.

When the component is first loaded use `componentDidMount()` to read
the last location from `AsyncStorage` and restore the map to its last location.


**Import AsyncStorage from react-native**

```js
import { AsyncStorage } from 'react-native'
```

### Result

![Goal animated screenshot](https://cl.ly/0Y1B2b413q2l/Screen%20Recording%202017-07-11%20at%2012.22%20AM.gif)

### Links

- [React Native AsyncStorage documentation](https://facebook.github.io/react-native/docs/asyncstorage.html)



## Solution

<details>
<summary>
Show Solution
</summary>


```js
import React, { useEffect, useState } from "react";
import { TouchableOpacity, AsyncStorage, Text, View } from "react-native";
import MapView from "react-native-maps";

import Constants from "expo-constants";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";

var places = {
  Istanbul: {
    latitude: 41.067841,
    longitude: 29.045258
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

const DEFAULT_LONG_DELTA = 0.04;
const DEFAULT_LAT_DELTA = 0.09;

function App() {
  const [region, setRegion] = useState({
    ...places["Istanbul"],
    longitudeDelta: DEFAULT_LONG_DELTA,
    latitudeDelta: DEFAULT_LAT_DELTA
  });

  async function loadLocation() {
    const loc = await AsyncStorage.getItem("location");
    if (!loc) {
      return;
    }

    setRegion(JSON.parse(loc));
  }

  useEffect(() => {
    loadLocation();
  }, []);

  function setRegionFromPlace(place) {
    const { longitude, latitude } = places[place];
    setRegion({
      longitudeDelta: DEFAULT_LONG_DELTA,
      latitudeDelta: DEFAULT_LAT_DELTA,
      longitude,
      latitude
    });
  }

  async function getCurrentLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      // set error message state, permission was not granted
      return;
    }

    let { coords } = await Location.getCurrentPositionAsync({});
    setRegion({
      longitudeDelta: DEFAULT_LONG_DELTA,
      latitudeDelta: DEFAULT_LAT_DELTA,
      longitude: coords.longitude,
      latitude: coords.latitude
    });
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
          onPress={() => setRegionFromPlace("Istanbul")}
        >
          <Text>Istanbul</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
          onPress={() => setRegionFromPlace("Sydney")}
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
          onPress={() => setRegionFromPlace("Hong Kong")}
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
          onPress={getCurrentLocation}
        >
          <Text>Here</Text>
        </TouchableOpacity>
      </View>
      <MapView
        style={{ flex: 7 }}
        region={region}
        onRegionChangeComplete={data => {
          AsyncStorage.setItem("location", JSON.stringify(data));
        }}
      />
    </View>
  );
}

export default App;

```


</details>