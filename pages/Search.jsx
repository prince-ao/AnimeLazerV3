import React, { useState, useEffect } from "react";
import { Alert, Platform, ToastAndroid } from "react-native";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";

const axios = require("axios");

const API = {
  id: "_" + Math.random().toString(36).substr(2, 9),
  url: "https://animelazerapi.herokuapp.com",
  key: "Bearer ",
};

const Search = ({ navigation, navigate, truth }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    getQueryRes(query);
  };

  useEffect(() => {
    getQueryRes();
  }, []);

  function getQueryRes(searchQuery) {
    axios
      .get(`${API.url}/AnimeLazer/Login`, {
        headers: {
          "Content-Type": "application/json",
          id: API.id,
        },
      })
      .then(async function (res) {
        axios
          .get(`${API.url}/Animes/Search`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
              query: `${searchQuery}`,
            },
          })
          .then(async function (res1) {
            if (
              typeof res1.data.data !== "undefined" &&
              res1.data.data.length === 0
            ) {
              /*Platform.OS === "android"
                ? ToastAndroid.showWithGravity(
                    `No results found for '${searchQuery}'`,
                    1500,
                    ToastAndroid.BOTTOM
                  )
                : Alert.alert(
                    "Warning",
                    `No results found for '${searchQuery}'`,
                    [
                      {
                        text: "Cancel",
                        onPress: () => console.log("Cancel Pressed"),
                        style: "cancel",
                      },
                      { text: "OK", onPress: () => console.log("OK Pressed") },
                    ]
                  );*/
            } else {
              setSearchResult(res1.data.data);
            }
          });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  if (!searchResult) {
    return null;
  }
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
          width: "100%",
          height: "100%",
          backgroundColor: truth ? "#1a1a1a" : "#f0f0f0",
          flex: 1,
        }}
      >
        <SearchBar
          containerStyle={{
            backgroundColor: "#1a1a1a",
            borderBottomWidth: 1,
          }}
          style={styles(truth).searchBar}
          onSubmitEditing={() => getQueryRes(searchQuery)}
          placeholder="Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <ScrollView style={{ height: 250 }}>
          {searchResult.map((data, i) => {
            return (
              <View style={styles(truth).searchContainer} key={i}>
                <TouchableOpacity
                  style={styles(truth).searchContainer}
                  onPress={() => {
                    axios
                      .get(`${API.url}/AnimeLazer/Login`, {
                        headers: {
                          "Content-Type": "application/json",
                          id: API.id,
                        },
                      })
                      .then(async function (res) {
                        axios
                          .get(`${API.url}/Animes/scrapeAnimeDetails`, {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `${API.key}${res.data.token}`,
                              url: data.animeUrl,
                            },
                          })
                          .then(async function (res1) {
                            res1.data.data.map((data) => {
                              if (data === null) {
                                Platform.OS === "android"
                                  ? ToastAndroid.showWithGravity(
                                      res1.data.data,
                                      1500,
                                      ToastAndroid.BOTTOM
                                    )
                                  : Alert.alert("Warning", res1.data.data, [
                                      {
                                        text: "Cancel",
                                        onPress: () =>
                                          console.log("Cancel Pressed"),
                                        style: "cancel",
                                      },
                                      {
                                        text: "OK",
                                        onPress: () =>
                                          console.log("OK Pressed"),
                                      },
                                    ]);
                              } else {
                                navigation.navigate("EpisodeRoom", {
                                  type: data.type,
                                  summary: data.summary,
                                  animeCover: data.animeCover,
                                  animeTitle: data.animeEnglishTitle,
                                  episodes: data.episodesAvaliable,
                                  season: data.season,
                                  language: data.language,
                                  genres: data.genresList,
                                  status: data.status,
                                  episodesList: data.episodesList,
                                  // there is more options such as animeJapaneseTitle, studio.
                                });
                              }
                            });
                          });
                      })
                      .catch(function (err) {
                        console.log(err);
                      });
                  }}
                >
                  <Image
                    source={{ uri: data.uri }}
                    style={styles(truth).AnimeImage}
                  />
                  <View style={styles(truth).info}>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles(truth).EnglishText}
                    >
                      {data.EnglishTitle}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles(truth).JapaneseText}
                    >
                      {data.JapaneseTitle}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={styles(truth).status}
                    >
                      {data.status}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Search;

const styles = (truth) =>
  StyleSheet.create({
    searchBar: {},
    searchContainer: {
      display: "flex",
      flexWrap: "wrap",
      marginRight: Dimensions.get("window").width / 100e1,
      alignItems: "center",
      width: Dimensions.get("window").width / 0.1,
      height: 151,
      marginTop: Dimensions.get("window").height / 95,
    },
    AnimeImage: {
      width: 130,
      height: 150,
      marginRight: 15,
      alignSelf: "center",
      marginLeft: 10,
      borderRadius: 6,
    },
    status: {
      marginTop: 20,
      color: truth ? "#dddddd" : "#1b1b1b",
    },
    JapaneseText: {
      color: "gray",
      marginRight: Dimensions.get("window").width / 120,
      marginTop: 20,
      fontSize: 15,
    },
    EnglishText: {
      fontSize: 17,
      marginTop: 2,
      marginRight: Dimensions.get("window").width / 120,
      fontWeight: "bold",
      color: truth ? "#dddddd" : "#1b1b1b",
    },
    info: {
      width: Dimensions.get("window").width / 1.7,
      height: 210,
    },
  });
