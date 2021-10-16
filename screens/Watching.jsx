import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const Watching = (props) => {
  const BASE_URL = "https://api.myanimelist.net/v2/";
  useEffect(() => {
    const fetc = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}users/@me/animelist?status=watching`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${props.route.params.authRef.current.access}`,
            },
          }
        );
        const s_response = await response.text();
        console.log(s_response);
      } catch (e) {
        console.log(e);
      }
    };
    fetc();
    //console.log(props.route.params);
  }, [props.route.params.webview]);
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Watching;

const styles = StyleSheet.create({});
