import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  DevSettings,
  RefreshControl,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const axios = require("axios");
import { key, url, BASE_URL_V2 } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("favorites.db");

const OnHold = (props) => {
  const [data, setData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [brightness, setBrightness] = useState(true);
  const [refresh, setRefresh] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [offlineData, setOfflineData] = useState([]);
  const [logged, setLogged] = useState(false);

  const BASE_URL = BASE_URL_V2;
  const API = {
    id: "_" + Math.random().toString(36).substr(2, 9),
    url: url,
    key: key + " ",
  };

  const getLogged = async () => {
    const truth = await AsyncStorage.getItem("logged");
    setLogged(truth);
  };

  const localGetData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favorites WHERE status = ?",
        ["On-Hold"],
        (tx, res) => setOfflineData(res.rows._array),
        (err, errm) => console.log(errm)
      );
    });
    setGotData(true);
  };

  useEffect(() => {
    getLogged();
    if (logged == null) {
      localGetData();
    } else {
      const fetc = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}users/@me/animelist?status=on_hold&limit=1000&sort=list_score`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${props.route.params.authRef.current.access}`,
              },
            }
          );
          const s_response = await response.text();
          const ss_response = await JSON.parse(s_response);
          setData(ss_response);
          if (ss_response.data.length > 0) {
            setGotData(true);
          }
        } catch (e) {
          console.log(e);
        }
      };
      fetc();
      //console.log(props.route.params);
    }
  }, [props.route.params.webview, props.route.params.again, refresh]);
  const handlePress = (title) => {
    setLoading(true);
    axios
      .get(`${API.url}AnimeLazer/Login`, {
        headers: {
          "Content-Type": "application/json",
          id: API.id,
        },
      })
      .then(async (res) => {
        await axios
          .get(`${API.url}Animes/Search`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
              query: `${title}`,
            },
          })
          .then(async (res1) => {
            const data = res1.data.data;
            if (
              (typeof res1.data.data !== "undefined" &&
                res1.data.data.length === 0) ||
              typeof res1.data.data === "string"
            ) {
              Platform.OS === "android"
                ? ToastAndroid.showWithGravity(
                    `No results found for '${title}'`,
                    1500,
                    ToastAndroid.BOTTOM
                  )
                : Alert.alert("Warning", `No results found for '${title}'`, [
                    { text: "OK" },
                  ]);
            } else {
              axios
                .get(`${API.url}AnimeLazer/Login`, {
                  headers: {
                    "Content-Type": "application/json",
                    id: API.id,
                  },
                })
                .then(async (res) => {
                  axios
                    .get(`${API.url}Animes/scrapeAnimeDetails`, {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `${API.key}${res.data.token}`,
                        url: data[0].animeUrl,
                      },
                    })
                    .then(async function (res1) {
                      res1.data.data.map((info) => {
                        if (data[0] === null) {
                          Platform.OS === "android"
                            ? ToastAndroid.showWithGravity(
                                res1.data.data,
                                1500,
                                ToastAndroid.BOTTOM
                              )
                            : Alert.alert("Warning", res1.data.data, [
                                {
                                  text: "Cancel",
                                  onPress: () => console.log("Cancel Pressed"),
                                  style: "cancel",
                                },
                                {
                                  text: "OK",
                                  onPress: () => console.log("OK Pressed"),
                                },
                              ]);
                        } else {
                          setTimeout(() => {
                            setLoading(false);
                          }, 2000);
                          props.navigation.navigate("EpisodeRoom", {
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

                            // there is more options such as animeJapaneseTitle, studio.
                          });
                        }
                      });
                    });
                });
            }
          });
      });
  };
  //props.route.params.truth
  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  if (gotData) {
    return (
      <>
        <TouchableOpacity
          style={styles().floatRefresh}
          onPress={() => setRefresh(`${Math.random() * 1000000}`)}
        >
          <Ionicons name="refresh-outline" size={24} color="black" />
        </TouchableOpacity>
        <ScrollView
          style={styles(brightness).mapContainer}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                wait(2000).then(() => {
                  setRefresh(`${Math.random() * 1000000}`);
                  setRefreshing(false);
                });
              }}
              tintColor="black"
            />
          }
        >
          {logged == null ? (
            <View>
              {offlineData.map((item, key) => {
                return (
                  <View style={styles().map} key={key}>
                    <TouchableOpacity onPress={() => handlePress(item.title)}>
                      <Image
                        style={styles().mapImage}
                        source={{ uri: String(item.poster_url) }}
                      />
                    </TouchableOpacity>
                    <Text>{item.title}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles().container}>
              {data.data.map((item, key) => {
                return (
                  <View style={styles().map} key={key}>
                    <TouchableOpacity
                      onPress={() => handlePress(item.node.title)}
                      key={item.node.title}
                    >
                      <Image
                        style={styles().mapImage}
                        source={{ uri: String(item.node.main_picture.large) }}
                      />
                    </TouchableOpacity>
                    <Text style={styles().mapText}>{item.node.title}</Text>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
        {loading ? (
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
              animating={loading}
              color="#d5e6ff"
              style={styles.loading}
              size={Platform.OS === "android" ? 51 : "large"}
            />
          </Modal>
        ) : null}
      </>
    );
  } else {
    return (
      <View>
        <TouchableOpacity
          style={styles().noDataContainer}
          onPress={() => setRefresh(`${Math.random() * 1000000}`)}
        >
          <Ionicons name="refresh-outline" size={60} color="black" />
        </TouchableOpacity>
      </View>
    );
  }
};

export default OnHold;

const styles = (truth) =>
  StyleSheet.create({
    mapContainer: {
      display: "flex",
      flexDirection: "column",
      flexWrap: "wrap",
    },
    container: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-evenly",
    },
    map: {
      width: 175,
      marginTop: 30,
      display: "flex",
      alignItems: "center",
    },
    mapText: {
      marginTop: 10,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 18,
    },
    mapImage: {
      width: 150,
      height: 200,
      borderRadius: 5,
    },
    noDataContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 200,
    },
    noDataText: {
      fontSize: 20,
      marginTop: 10,
      textAlign: "center",
    },
    floatRefresh: {},
  });
