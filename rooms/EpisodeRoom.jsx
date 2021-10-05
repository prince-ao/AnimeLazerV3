import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Button,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { Header } from "../components/index";
import { Ionicons } from "@expo/vector-icons";

const axios = require("axios");

const API = {
  id: "_" + Math.random().toString(36).substr(2, 9),
  url: "https://animelazerapi.herokuapp.com",
  key: "Bearer ",
};

const EpisodeRoom = ({ navigation, route, truthy }) => {
  const MAX_LINES = 3;
  const [showLess, setShowLess] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);
  const [descLength, setDescLength] = useState(30);
  const [drop, setDrop] = useState(false);
  const inputEl = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const toggleNumberOfLines = () => {
    setShowLess(!showLess);
  };

  const onTextLayout = useCallback((e) => {
    setLengthMore(e.nativeEvent.lines.length > MAX_LINES);
  }, []);

  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: "#000",
        }}
      />
      <SafeAreaView style={styles(truthy).container}>
        <StatusBar barStyle="light-content" />
        <View style={styles(truthy).headerContainer}>
          <Image
            style={styles(truthy).logo}
            source={require("../assets/Logo.png")}
          />
          {/* <TouchableOpacity
          style={{left: 170, top: 0, margin: 0}}
        >
          <Ionicons name="heart-sharp" size={35} color="#5c94dd" />
        </TouchableOpacity> */}
          <TouchableOpacity
            style={{ position: "absolute", top: 10, left: 15 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles(truthy).infoContainer}>
          <View style={styles(truthy).genInfoContainer}>
            <Image
              source={{ uri: route.params.animeCover }}
              alt="poster"
              style={styles(truthy).poster}
            />
            <View style={styles(truthy).textInfoContainer}>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={styles(truthy).title}
              >
                {route.params.animeTitle}
              </Text>
              <View style={styles(truthy).genDesc}>
                <Text style={styles(truthy).white}>
                  Type:{" "}
                  <Text style={styles(truthy).innerText}>
                    {route.params.type}{" "}
                  </Text>
                </Text>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={styles(truthy).white}
                >
                  Released:{" "}
                  <Text style={styles(truthy).innerText}>
                    {route.params.season.includes("Anime")
                      ? route.params.season.replace("Anime", "")
                      : route.params.season}{" "}
                  </Text>{" "}
                </Text>
                <Text style={styles(truthy).white}>
                  Episodes:{" "}
                  <Text style={styles(truthy).innerText}>
                    {route.params.episodes}{" "}
                  </Text>
                </Text>
                <Text style={styles(truthy).white}>
                  Status:{" "}
                  <Text style={styles(truthy).innerText}>
                    {route.params.status}{" "}
                  </Text>
                </Text>
              </View>
              <ScrollView
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                style={styles(truthy).genres}
              >
                <View>
                  {route.params.genres.map((data, key) => {
                    return (
                      <Text style={styles(truthy).genresCard} key={key}>
                        {data.Genre}
                      </Text>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          </View>
          <View ref={inputEl} style={styles(truthy).descContainer}>
            {/*TODO later version: find a way to calculate the size of a the Text */}
            <Text
              style={{ height: descLength, color: truthy ? "white" : "black" }}
            >
              {route.params.summary}
            </Text>
            <TouchableOpacity
              style={styles(truthy).white}
              onPress={() => {
                descLength === 30 ? setDescLength(200) : setDescLength(30);
                setDrop(!drop);
              }}
            >
              <Ionicons
                name={drop ? "chevron-up" : "chevron-down"}
                size={25}
                color={truthy ? "white" : "black"}
              />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View style={styles(truthy).episodesList}>
            {route.params.episodesList.map((data, key) => {
              return (
                <Text
                  style={styles(truthy).episodeCard}
                  key={key}
                  onPress={() => {
                    setIsLoading(true);
                    axios
                      .get(`${API.url}/AnimeLazer/Login`, {
                        headers: {
                          "Content-Type": "application/json",
                          id: API.id,
                        },
                      })
                      .then(async function (res) {
                        axios
                          .get(`${API.url}/Animes/RecentEpisodesMp4Src`, {
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: `${API.key}${res.data.token}`,
                              src: data.url,
                            },
                          })
                          .then(async function (res1) {
                            setIsLoading(true);
                            if (
                              res1.data.data.length === 0 ||
                              (typeof res1.data.data === undefined) | null
                            ) {
                              Platform.OS === "android"
                                ? ToastAndroid.showWithGravity(
                                    "This video file cannot be played.",
                                    2000,
                                    ToastAndroid.BOTTOM
                                  )
                                : Alert.alert(
                                    "Warning",
                                    "This video file cannot be played",
                                    [
                                      {
                                        text: "Cancel",
                                        onPress: () => setIsLoading(false),
                                        style: "cancel",
                                      },
                                      {
                                        text: "OK",
                                        onPress: () => setIsLoading(false),
                                      },
                                    ]
                                  );
                            } else {
                              navigation.navigate("WatchRoom", {
                                title:
                                  route.params.animeTitle + " " + data.episode,
                                src: res1,
                              });
                            }
                          });
                      })
                      .catch(function (err) {
                        setIsLoading(false);
                        console.log(err);
                      });
                  }}
                >
                  {" "}
                  {"Episode " + data.episode}
                </Text>
              );
            })}
          </View>
        </ScrollView>
        <ActivityIndicator
          animating={isLoading}
          color="#0367fc"
          style={styles(truthy, isLoading).loading}
          size={Platform.OS === "android" ? 51 : "large"}
        />
      </SafeAreaView>
    </>
  );
};

export default EpisodeRoom;

const styles = (truthy, isLoading) =>
  StyleSheet.create({
    container: {
      backgroundColor: truthy ? "#1b1b1b" : "#e6e6e6e6",
      width: "100%",
      height: "100%",
      color: "white",
      flex: 1,
    },
    headerContainer: {
      width: "100%",
      height: 15,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000",
      height: 50,
    },
    genresCard: {
      color: "white",
      fontSize: 14,
      padding: 7,
      textAlign: "center",
      backgroundColor: "#383838",
      borderRadius: 14,
      borderTopRightRadius: 15,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      borderBottomRightRadius: 15,
      marginBottom: 6,
      marginEnd: 8,
      display: "flex",
    },
    genres: {
      top: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      flex: 1,
    },
    episodesList: {
      marginLeft: 21,
      justifyContent: "center",
      alignItems: "baseline",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    episodeCard: {
      color: "white",
      padding: 10,
      textAlign: "center",
      backgroundColor: "#383838",
      borderRadius: 10,
      display: "flex",
      marginBottom: 10,
      marginEnd: 25,
    },
    poster: {
      height: 235,
      width: 150,
      borderRadius: 3,
      marginLeft: 20,
    },
    innerText: {
      color: "gray",
    },
    white: {
      color: truthy ? "white" : "black",
    },
    arrow: {
      marginLeft: Dimensions.get("window").width / 1.2,
      color: "white",
    },
    genInfoContainer: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      marginTop: Dimensions.get("window").height / 20,
    },
    textInfoContainer: {
      marginLeft: Dimensions.get("window").width / 16,
    },
    title: {
      fontSize: 20,
      color: truthy ? "white" : "black",
      width: Dimensions.get("window").height / 5,
    },
    genDesc: {
      marginTop: 5,
    },
    description: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      width: 160,
      marginTop: 20,
    },
    descContainer: {
      margin: 15,
    },
    logo: {
      marginTop: 5,
      width: 150,
      height: 30,
    },
    back: {
      position: "absolute",
      left: 20,
      top: 10,
      width: 400,
      height: 300,
    },
    loading: {
      position: "absolute",
      top: 300,
      left: 170,
      width: 70,
      height: 70,
      backgroundColor: isLoading ? "#585858" : "transparent",
      borderRadius: 8,
    },
  });
