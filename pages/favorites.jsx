import React from "react";
import { StyleSheet, Text, SafeAreaView, StatusBar } from "react-native";
import { Header } from "../components/index";

const favorites = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
    </SafeAreaView>
  );
};

export default favorites;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    height: "100%",
  },
});
