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
import { clientID, codeChallenge, BASE_URL_V1 } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Tab = createMaterialTopTabNavigator();
const BASE_URL = `${BASE_URL_V1}`;

const Favorites = ({ truth }) => {
  //console.log(truth);
  const [webview, setWebview] = useState(true);
  const [again, setAgain] = useState("");
  const webviewRef = useRef(true);
  const authRef = useRef({
    auth: "",
    access: "",
    refresh: "",
    expires: 0,
  });
  const loggedRef = useRef(false);
  const checkItem = async () => {
    const aToken = await AsyncStorage.getItem("accessToken");
    //console.log(aToken);
    if (aToken !== undefined || aToken !== null) {
      return true;
    }
    return false;
  };
  const setItem = async () => {
    authRef.current.access = await AsyncStorage.getItem("accessToken");
    authRef.current.refresh = await AsyncStorage.getItem("refreshToken");
    loggedRef.current = true;
    setWebview(true);
  };
  const handleDelete = async () => {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("refreshToken");
  };
  useEffect(() => {
    const checkItem = async () => {
      const aToken = await AsyncStorage.getItem("accessToken");
      if (aToken !== null) {
        loggedRef.current = true;
        setItem();
        setAgain(true);
      } else {
        loggedRef.current = false;
        setAgain("reload please");
      }
    };
    checkItem();
  }, []);
  const handleNav = async (newNavState) => {
    //console.log(newNavState);
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
      //console.log(auth);

      const response = await fetch(`${BASE_URL}token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=authorization_code&code=${auth}&client_id=${clientID}&code_verifier=${codeChallenge}`,
      });
      const response_s = await response.json();
      //console.log(response_s);
      try {
        await AsyncStorage.setItem("accessToken", response_s.access_token);
        await AsyncStorage.setItem("refreshToken", response_s.refresh_token);
      } catch (e) {
        console.log(e);
      }
      authRef.current.auth = auth;
      authRef.current.access = response_s.access_token;
      authRef.current.refresh = response_s.refresh_token;
      authRef.current.expires = response_s.expires_in;
      loggedRef.current = true;
      setWebview(true);
    }
  };

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
                onPress={() => {
                  setWebview(false);
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
            <Tab.Screen
              name="CURRENTLY WATCHING"
              component={Watching}
              initialParams={{ authRef, webview, truth, again }}
            />
            <Tab.Screen
              name="PLAN TO WATCH"
              component={Plan}
              initialParams={{ authRef, webview, truth, again }}
            />
            <Tab.Screen
              name="ON HOLD"
              component={OnHold}
              initialParams={{ authRef, webview, truth, again }}
            />
            <Tab.Screen
              name="COMPLETED"
              component={Complete}
              initialParams={{ authRef, webview, truth, again }}
            />
            <Tab.Screen
              name="DROPPED"
              component={Dropped}
              initialParams={{ authRef, webview, truth, again }}
            />
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
