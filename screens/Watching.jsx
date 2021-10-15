import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const Watching = (props) => {
  useEffect(() => {
    console.log(props);
  }, [props.webview]);
  return (
    <View>
      <Text></Text>
    </View>
  );
};

export default Watching;

const styles = StyleSheet.create({});
