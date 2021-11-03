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
  ActivityIndicator,
  Modal,
} from "react-native";
import { SearchBar } from "react-native-elements";
import { key, url } from "@env";

const axios = require("axios");
const API = {
  id: "_" + Math.random().toString(36).substr(2, 9),
  url: url,
  key: key + " ",
};

const Search = ({ navigation, navigate, truth }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    getQueryRes(query);
  };

  function getQueryRes(searchQuery) {
    setIsLoading(true);
    axios
      .get(`${API.url}AnimeLazer/Login`, {
        headers: {
          "Content-Type": "application/json",
          id: API.id,
        },
      })
      .then(async function (res) {
        axios
          .get(`${API.url}Animes/Search`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
              query: `${searchQuery}`,
            },
          })
          .then(async function (res1) {
            console.log(res1);
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
            if (
              (typeof res1.data.data !== "undefined" &&
                res1.data.data.length === 0) ||
              typeof res1.data.data === "string"
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
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
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
          backgroundColor: "#1a1a1a",
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
          placeholder="Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
        />
        <ScrollView
          overScrollMode="never"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 15,
            alignItems: "baseline",
          }}
        >
          {searchResult.map((data, i) => {
            return (
              <View style={styles(truth).searchContainer} key={i}>
                <TouchableOpacity
                  style={styles(truth).searchContainer}
                  onPress={() => {
                    setIsLoading(true);
                    axios
                      .get(`${API.url}AnimeLazer/Login`, {
                        headers: {
                          "Content-Type": "application/json",
                          id: API.id,
                        },
                      })
                      .then(async function (res) {
                        axios
                          .get(`${API.url}Animes/scrapeAnimeDetails`, {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `${API.key}${res.data.token}`,
                              url: data.animeUrl,
                            },
                          })
                          .then(async function (res1) {
                            res1.data.data.map((info) => {
                              setIsLoading(false);
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
                                  type: info.type,
                                  synopsis: info.synopsis,
                                  animeCover: info.animeCover,
                                  animeTitle: info.animeEnglishTitle,
                                  episodes: info.episodesAvaliable,
                                  season: info.season,
                                  language: info.language,
                                  genres: info.genres,
                                  status: info.status,
                                  episodesList: info.episodesList,
                                  animeUrl: data.animeUrl,
                                  otherNames: info.otherNames,

                                  // there is more options such as animeJapaneseTitle, studio.
                                });
                              }
                            });
                          });
                      })
                      .catch(function (err) {
                        setIsLoading(false);
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
                      {data.JapaneseTitle}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={styles(truth).JapaneseText}
                    ></Text>
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
        {isLoading ? (
          <Modal style={{}}>
            <Image
              source={require("../assets/cute-anime-dancing.gif")}
              style={{
                width: Dimensions.get("window").width,
                height: Dimensions.get("window").height,
                paddingTop: 100,
              }}
            />
            <ActivityIndicator
              animating={isLoading}
              color="#d5e6ff"
              style={styles(truth, isLoading).loading}
              size={Platform.OS === "android" ? 51 : "large"}
            />
          </Modal>
        ) : null}
        {/*<ActivityIndicator
          animating={isLoading}
          color="#d5e6ff"
          style={styles(truth, isLoading).loading}
          size={Platform.OS === "android" ? 51 : "large"}
        />*/}
      </SafeAreaView>
    </>
  );
};

export default Search;

const styles = (truth, isLoading) =>
  StyleSheet.create({
    searchBar: {},
    searchContainer: {
      display: "flex",
      flexWrap: "wrap",
      marginRight: Dimensions.get("window").width / 100e1,
      alignItems: "center",
      width: Dimensions.get("window").width / 0.1,
      height: Dimensions.get("window").height / 4.9,
      marginTop: Dimensions.get("window").height / 100,
    },
    AnimeImage: {
      width: 130,
      height: 150,
      marginRight: 15,
      borderRadius: 6,
      resizeMode: "cover",
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
    loading: {
      position: "absolute",
      top: Dimensions.get("window").height / 2.3,
      right: Dimensions.get("window").width / 2.43,
      width: Dimensions.get("window").width / 5.5,
      height: Dimensions.get("window").height / 10.5,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLoading ? "#585858" : "transparent",
      borderRadius: 8,
    },
  });
