import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Header } from "../components/index";
const axios = require("axios");
import { Complete, OnHold, Dropped, Plan, Watching } from "../screens";
import { firebase } from "@firebase/app"
import "@firebase/auth"

const Tab = createMaterialTopTabNavigator();

const Favorites = ({ truth }) => {
  const [logged, setLogged] = useState(false);
  /*useEffect(() => {
    fetch(
      `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=12345&state=NY&code_challenge=${string}&code_challenge_method=plain`
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []); */
  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: "#000",
        }}
      />
      <SafeAreaView
        style={{
          backgroundColor: truth ? "#1a1a1a" : "#f0f0f0",
          height: "100%",
          flex: 1,
        }}
      >
        <StatusBar barStyle="light-content" />
        <Header />
        {!logged ? (
          <View
            style={{
              marginBottom: 10,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 10,
                marginLeft: 140,
                backgroundColor: "#2450e2",
                width: 120,
                height: 50,
                borderRadius: 8,
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  color: "white",
                  textAlign: "center",
                  marginTop: 15,
                  marginLeft: 9,
                }}
              >
                Sign in
              </Text>
              <Image
                style={{ width: 40, height: 40, marginLeft: 9, marginTop: 5 }}
                source={require("../assets/mal.png")}
              />
            </TouchableOpacity>
          </View>
        ) : null}
        <Tab.Navigator
          screenOptions={{
            tabBarItemStyle: { width: 200 },
            tabBarScrollEnabled: true,
          }}
        >
          <Tab.Screen name="CURRENTLY WATCHING" component={Watching} />
          <Tab.Screen name="PLAN TO WATCH" component={Plan} />
          <Tab.Screen name="ON HOLD" component={OnHold} />
          <Tab.Screen name="COMPLETED" component={Complete} />
          <Tab.Screen name="DROPPED" component={Dropped} />
        </Tab.Navigator>
      </SafeAreaView>
    </>
  );
};

export default Favorites;

const styles = (truth) =>
  StyleSheet.create({
    container: {
      backgroundColor: truth ? "#1a1a1a" : "#e7e7e7",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 40,
      backgroundColor: truth ? "#1a1a1a" : "#e7e7e7",
      textAlign: "center",
      marginTop: 10,
      color: truth ? "#e7e7e7" : "#1a1a1a",
    },
  });
