import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
} from "react-native";
import { Header } from "../components/index";
import { Ionicons } from "@expo/vector-icons";

const EpisodeRoom = ({ navigation, route }) => {
  //console.log(route.params);
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-sharp" size={35} color="#5c94dd" />
        </TouchableOpacity>
        <Image style={styles.logo} source={require("../assets/Logo.png")} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.genInfoContainer}>
          <Image source={{uri: route.params.animeCover}} alt="poster" style={styles.poster} />
          <View style={styles.textInfoContainer}>
            <Text style={styles.title}>{route.params.animeName}</Text>
            <View style={styles.genDesc}>
              <Text style={styles.white}>Type: {route.params.type}</Text>
              <Text style={styles.white}>Score: {route.params.score}</Text>
              <Text style={styles.white}>Episodes: {route.params.episodes}</Text>
            </View>
            <View style={styles.description}>
              <Text style={styles.white}>Desdasdassc</Text>
              <Text style={styles.white}>Ddasdsc</Text>
              <Text style={styles.white}>Desdsdsadasc</Text>
              <Text style={styles.white}>Ddsadsadasesc</Text>
              <Text style={styles.white}>Dedasdasdsasc</Text>
            </View>
          </View>
        </View>
        <View style={styles.descContainer}>
          <Text style={styles.white}>
          {route.params.summary}
          </Text>
        </View>
      </View>
      <ScrollView></ScrollView>
    </SafeAreaView>
  );
};

export default EpisodeRoom;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1b1b1b",
    width: "100%",
    height: "100%",
    color: "white",
  },
  headerContainer: {
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  poster: {
    height: 200,
    width: 130,
    borderRadius: 10,
    marginLeft: 30,
  },
  white: {
    color: "white",
  },
  genInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  textInfoContainer: {
    marginLeft: 50,
  },
  title: {
    fontSize: 30,
    color: "white",
    width: 180,
  },
  genDesc: {
    marginTop: 10,
  },
  description: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: 160,
    marginTop: 20,
  },
  logo: {
    width: 150,
    height: 30,
  },
  back: {
    position: "absolute",
    left: 20,
    top: 10,
  },
});
