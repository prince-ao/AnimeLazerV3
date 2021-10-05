import React from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  View,
  TouchableOpacity,
} from "react-native";
import { Header } from "../components/index";

const Favorites = ({ truth, logged }) => {
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
        <Text style={styles(truth).title}>Favorites</Text>
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
