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
        {logged ? (
          <View>
            <Text>Nothing</Text>
          </View>
        ) : (
          <View style={styles(truth).container}>
            <TouchableOpacity style={styles(truth).buttons}>
              <Text style={styles(truth).buttonsText}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles(truth).buttons}>
              <Text style={styles(truth).buttonsText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        )}
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
    buttons: {
      marginBottom: 80,
      backgroundColor: "#838383",
      width: 100,
      height: 50,
      borderRadius: 10,
      marginTop: 10,
    },
    buttonsText: {
      color: "#fff",
      textAlign: "center",
      fontSize: 20,
      marginTop: 10,
    },
    title: {
      fontSize: 40,
      backgroundColor: truth ? "#1a1a1a" : "#e7e7e7",
      textAlign: "center",
      marginTop: 10,
      color: truth ? "#e7e7e7" : "#1a1a1a",
    },
  });
