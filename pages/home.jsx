import React, { useState } from "react";
import { StyleSheet, Text, View, StatusBar, ScrollView } from "react-native";
import { Header } from "../components/index";

const home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/*Header */}
      <Header />
      {/*home ScrollView */}
      <ScrollView>
        {/*This view contains the indevidual section, like recommendations, action, etc., there will be multiple*/}
        <View></View>
      </ScrollView>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    width: "100%",
    height: "100%",
    color: "#e6e6e6",
  },
});
