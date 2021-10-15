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
const axios = require("axios");
import { Complete, OnHold, Dropped, Plan, Watching } from "../screens";
import { firebase } from "@firebase/app"
import "@firebase/auth"
import { WebView } from "react-native-webview";

//Client-id: ad890e37ef61deb935fe6e8afc7eed5a

const Tab = createMaterialTopTabNavigator();

const Favorites = ({ truth }) => {
  const [logged, setLogged] = useState(false);
  const [webview, setWebview] = useState(true);
  const [cody, setCody] = useState({
    auth: "",
    access: "",
    refresh: "",
    expires: 0,
  });
  const [auth, setAuth] = useState("");
  const webRef = useRef();
  /*useEffect(() => {
    fetch(
      `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=12345&state=NY&code_challenge=${string}&code_challenge_method=plain`
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }, []); */
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
      setWebview(true);
      console.log(auth);
      const run = async () => {
        const bod = {
          grant_type: "authorization_code",
          code: `${auth}`,
          client_id: "ad890e37ef61deb935fe6e8afc7eed5a",
          code_verifier: "S4kFlQhwPAjOboud2A33KfeXEJbTJWR5FyDI1IfcsaGJWODzkK",
        };
        const response = await fetch(
          "https://myanimelist.net/v1/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&code=${auth}&client_id=ad890e37ef61deb935fe6e8afc7eed5a&code_verifier=S4kFlQhwPAjOboud2A33KfeXEJbTJWR5FyDI1IfcsaGJWODzkK`,
          }
        );
        const response_s = await response.json();
        //console.log(response_s);
        setCody({
          auth: auth,
          access: response_s.access_token,
          refresh: response_s.refresh_token,
          expires: response_s.expires_in,
        });
        setLogged(true);
      };
    }
  };
  useEffect(() => {
    if (webview) {
      console.log(auth);
      const run = async () => {
        const bod = {
          grant_type: "authorization_code",
          code: `${auth}`,
          client_id: "ad890e37ef61deb935fe6e8afc7eed5a",
          code_verifier: "S4kFlQhwPAjOboud2A33KfeXEJbTJWR5FyDI1IfcsaGJWODzkK",
        };
        const response = await fetch(
          "https://myanimelist.net/v1/oauth2/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `grant_type=authorization_code&code=${auth}&client_id=ad890e37ef61deb935fe6e8afc7eed5a&code_verifier=S4kFlQhwPAjOboud2A33KfeXEJbTJWR5FyDI1IfcsaGJWODzkK`,
          }
        );
        const response_s = await response.json();
        //console.log(response_s);
        setCody({
          auth: auth,
          access: response_s.access_token,
          refresh: response_s.refresh_token,
          expires: response_s.expires_in,
        });
        setLogged(true);
      };
      run();
    }
  }, [webview]);

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
              initialParams={{ cody, setCody }}
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
        ref={webRef}
        source={{
          uri: "https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=ad890e37ef61deb935fe6e8afc7eed5a&state=NY&code_challenge=S4kFlQhwPAjOboud2A33KfeXEJbTJWR5FyDI1IfcsaGJWODzkK&code_challenge_method=plain",
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
