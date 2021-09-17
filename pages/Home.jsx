import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Header } from "../components/index";

const tempData = [
  {
    title: "Pokemon",
    Type: "TV",
    Episodes: 276,
    score: 7.35,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Oyasumi Punpun",
    Type: "Manga",
    Episodes: 147,
    score: 9.05,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Fullmetal Alchemist: Brotherhood",
    Type: "TV",
    Episodes: 64,
    score: 9.16,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Shingeki no Kyojin Season 3 Part 2",
    Type: "TV",
    Episodes: 10,
    score: 9.1,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Steins;Gate",
    Type: "TV",
    Episodes: 24,
    score: 9.1,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Gintama°",
    Type: "TV",
    Episodes: 51,
    score: 9.09,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Fruits Basket: The Final",
    Type: "TV",
    Episodes: 13,
    score: 9.08,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Gintama'",
    Type: "TV",
    Episodes: 51,
    score: 9.06,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Hunter x Hunter (2011)",
    Type: "TV",
    Episodes: 148,
    score: 9.06,
    url: require("../assets/assasination-classroom.jpg"),
  },
  {
    title: "Ginga Eiyuu Densetsu",
    Type: "TV",
    Episodes: 110,
    score: 9.05,
    url: require("../assets/assasination-classroom.jpg"),
  },
];

/*const newObj = {
  handle: () => {
    navigate.navigate("EpisodeRoom", {});
  },
};*/

const Home = ({ navigation, navigate }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <ScrollView>
        <View style={styles.padding} />
        <View style={styles.shows}>
          <Text style={styles.showText}>Recent</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {tempData.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...tempData[key] })
                    }
                  >
                    <Image source={data.url} style={styles.poster} />
                    <Text style={styles.posterText}>{data.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Action</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {tempData.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...tempData[key] })
                    }
                  >
                    <Image source={data.url} style={styles.poster} />
                    <Text style={styles.posterText}>{data.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Fiction</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {tempData.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...tempData[key] })
                    }
                  >
                    <Image source={data.url} style={styles.poster} />
                    <Text style={styles.posterText}>{data.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>School</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {tempData.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...tempData[key] })
                    }
                  >
                    <Image source={data.url} style={styles.poster} />
                    <Text style={styles.posterText}>{data.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Monsters</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {tempData.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...tempData[key] })
                    }
                  >
                    <Image source={data.url} style={styles.poster} />
                    <Text style={styles.posterText}>{data.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Top Rated</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {tempData.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...tempData[key] })
                    }
                  >
                    <Image source={data.url} style={styles.poster} />
                    <Text style={styles.posterText}>{data.title}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    width: "100%",
    height: "100%",
    color: "#e6e6e6",
  },
  shows: {},
  poster: {
    width: 130,
    height: 190,
    marginRight: 30,
    alignSelf: "center",
    marginLeft: 10,
    borderRadius: 6,
  },
  showText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  posterCotainer: {
    display: "flex",
    flexWrap: "wrap",
    marginRight: 30,
    alignItems: "center",
    width: 150,
    height: 210,
    marginTop: 30,
    paddingBottom: 30,
  },
  posterText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  mapContainer: {
    height: 270,
  },
  padding: {
    marginTop: 40,
  },
});
