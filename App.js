import { StatusBar } from "expo-status-bar";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { home, search, favorites, settings } from "./pages/index";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
        })}
      >
        <Tab.Screen name="home" component={home} />
        <Tab.Screen name="search" component={search} />
        <Tab.Screen name="favorites" component={favorites} />
        <Tab.Screen name="settings" component={settings} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
