
// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ListView from "./js/List"
import DetailsView from "./js/Detail"
import AudioView from "./js/Audio"

import {
  Button,
  SafeAreaView,
  StyleSheet
} from 'react-native';

const Stack = createStackNavigator();

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="List" component={ListView} />
          <Stack.Screen name="Detail" component={DetailsView} />
          <Stack.Screen name="Audio" component={AudioView} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default App;
