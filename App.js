import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Home, Search, Favorites, Settings } from "./pages/index";
import { createStackNavigator } from "@react-navigation/stack";
import EpisodeRoom from "./rooms/EpisodeRoom";
import WatchRoom from "./rooms/WatchRoom";

const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation, truthy, setTruthy }) => {
  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "search") {
            iconName = focused ? "search" : "search-outline";
          } else if (route.name === "favorites") {
            iconName = focused ? "star" : "star-outline";
          } else if (route.name === "settings") {
            iconName = focused ? "ios-cog" : "ios-cog-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0367fc",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="home">
        {(props) => <Home {...props} navigate={navigation} truth={truthy} />}
      </Tab.Screen>
      <Tab.Screen name="search">
        {(props) => <Search {...props} navigate={navigation} truth={truthy} />}
      </Tab.Screen>
      <Tab.Screen name="favorites">
        {(props) => (
          <Favorites {...props} navigate={navigation} truth={truthy} />
        )}
      </Tab.Screen>
      <Tab.Screen name="settings">
        {(props) => (
          <Settings
            {...props}
            navigate={navigation}
            truth={truthy}
            truthSet={setTruthy}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default function App() {
  const [truthy, setTruthy] = useState(true);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BottomTab"
        screenOptions={{ tabBarShowLabel: false, headerShown: false }}
      >
        <Stack.Screen name="BottomTab">
          {(props) => (
            <BottomTab {...props} truthy={truthy} setTruthy={setTruthy} />
          )}
        </Stack.Screen>
        <Stack.Screen name="EpisodeRoom">
          {(props) => <EpisodeRoom {...props} truthy={truthy} />}
        </Stack.Screen>
        <Stack.Screen name="WatchRoom">
          {(props) => <WatchRoom {...props} truthy={truthy} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6e6e6",
    alignItems: "center",
    justifyContent: "center",
  },
});
