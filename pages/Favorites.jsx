import React, { useState, useEffect, useRef } from "react";
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
import { Complete, OnHold, Dropped, Plan, Watching } from "../screens";
import { firebase } from "@firebase/app";
import "@firebase/auth";
import { WebView } from "react-native-webview";
import { clientID, codeChallenge } from "@env";

const Tab = createMaterialTopTabNavigator();
const BASE_URL = "https://myanimelist.net/v1/oauth2/";

const Favorites = ({ truth }) => {
  const [webview, setWebview] = useState(true);
  const authRef = useRef({
    auth: "",
    access: "",
    refresh: "",
    expires: 0,
  });
  const loggedRef = useRef(false);
  const handleNav = async (newNavState) => {
    console.log(newNavState);
    if (
      newNavState.url.includes("https://animelazerapi.herokuapp.com/api/MAL")
    ) {
      let code = false;
      let auth = "";
      for (let i = 0; i < newNavState.url.length; i++) {
        if (newNavState.url[i] === "=") {
          code = true;
          continue;
        }
        if (newNavState.url[i] === "&") {
          break;
        }
        if (code) {
          auth += newNavState.url[i];
        }
      }
      console.log(auth);
      const response = await fetch(`${BASE_URL}token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&code=${auth}&client_id=${clientID}&code_verifier=${codeChallenge}`,
      });
      const response_s = await response.json();
      console.log(response_s);
      authRef.current.auth = auth;
      authRef.current.access = response_s.access_token;
      authRef.current.refresh = response_s.refresh_token;
      authRef.current.expires = response_s.expires_in;
      loggedRef.current = true;
      setWebview(true);
      useForceUpdate();
    }
  };

  function useForceUpdate() {
    const [value, setValue] = useState(0);
    return () => setValue((value) => value + 1);
  }

  if (webview) {
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
          {!loggedRef.current ? (
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
                onPress={() => setWebview(false)}
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
            <Tab.Screen
              name="CURRENTLY WATCHING"
              component={Watching}
              initialParams={{ authRef, webview }}
            />
            <Tab.Screen name="PLAN TO WATCH" component={Plan} />
            <Tab.Screen name="ON HOLD" component={OnHold} />
            <Tab.Screen name="COMPLETED" component={Complete} />
            <Tab.Screen name="DROPPED" component={Dropped} />
          </Tab.Navigator>
        </SafeAreaView>
      </>
    );
  } else {
    return (
      <WebView
        source={{
          uri: `${BASE_URL}authorize?response_type=code&client_id=${clientID}&code_challenge=${codeChallenge}&code_challenge_method=plain`,
        }}
        onNavigationStateChange={handleNav}
      />
    );
  }
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
