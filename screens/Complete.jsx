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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const axios = require("axios");
import { key, url, BASE_URL_V2 } from "@env";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const Complete = (props) => {
  const [data, setData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [refresh, setRefresh] = useState("");
  const BASE_URL = BASE_URL_V2;
  const API = {
    id: "_" + Math.random().toString(36).substr(2, 9),
    url: url,
    key: key + " ",
  };
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const fetc = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}users/@me/animelist?status=completed&limit=1000&sort=list_score`,
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
  }, [props.route.params.webview, props.route.params.again, refresh]);
  const handlePress = (title) => {
    axios
      .get(`${API.url}/AnimeLazer/Login`, {
        headers: {
          "Content-Type": "application/json",
          id: API.id,
        },
      })
      .then(async (res) => {
        await axios
          .get(`${API.url}/Animes/Search`, {
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
                .get(`${API.url}/AnimeLazer/Login`, {
                  headers: {
                    "Content-Type": "application/json",
                    id: API.id,
                  },
                })
                .then(async (res) => {
                  axios
                    .get(`${API.url}/Animes/scrapeAnimeDetails`, {
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
          style={styles().mapContainer}
          overScrollMode="never"
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles().container}>
            {data.data.map((item, key) => {
              return (
                <View style={styles().map} key={key}>
                  <TouchableOpacity
                    onPress={() => handlePress(item.node.title)}
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
        </ScrollView>
      </>
    );
  } else {
    return (
      <View style={styles().noDataContainer}>
        <TouchableOpacity
          onPress={() => setRefresh(`${Math.random() * 1000000}`)}
        >
          <Ionicons name="refresh-outline" size={60} color="black" />
        </TouchableOpacity>
        <Text style={styles().noDataText}>If already logged in, refresh</Text>
      </View>
    );
  }
};

export default Complete;

const styles = () =>
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
