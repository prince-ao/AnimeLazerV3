import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
const axios = require("axios");

const Plan = (props) => {
  const [data, setData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const BASE_URL = "https://api.myanimelist.net/v2/";
  const API = {
    id: "_" + Math.random().toString(36).substr(2, 9),
    url: "https://animelazerapi.herokuapp.com",
    key: "Bearer ",
  };
  useEffect(() => {
    const fetc = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}users/@me/animelist?status=plan_to_watch&limit=1000&sort=list_score`,
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
  }, [props.route.params.webview]);
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
      <ScrollView
        style={styles.mapContainer}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {data.data.map((item) => {
            return (
              <View style={styles.map}>
                <TouchableOpacity
                  onPress={() => handlePress(item.node.title)}
                  key={item.node.title}
                >
                  <Image
                    style={styles.mapImage}
                    source={{ uri: String(item.node.main_picture.large) }}
                  />
                </TouchableOpacity>
                <Text style={styles.mapText}>{item.node.title}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View>
        <Text>Nothing</Text>
      </View>
    );
  }
};

export default Plan;

const styles = StyleSheet.create({
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
});
