import React from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar } from "react-native";
import { Header } from "../components/index";

const Favorites = ({ truth }) => {
  return (
    <SafeAreaView
      style={{
        backgroundColor: truth ? "#1a1a1a" : "#f0f0f0",
        height: "100%",
      }}
    >
      <StatusBar barStyle="light-content" />
      <Header />
    </SafeAreaView>
  );
};

export default Favorites;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    height: "100%",
  },
});
