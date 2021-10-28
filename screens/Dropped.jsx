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
  RefreshControl

} from "react-native";
import { Ionicons } from "@expo/vector-icons";
const axios = require("axios");
import { key, url, BASE_URL_V2 } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebase } from '@firebase/app'
import "@firebase/database"
import "@firebase/auth";

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update the state to force render
}

const Complete = (props) => {
  const [data, setData] = useState([]);
  const [gotData, setGotData] = useState(false);
  const [refresh, setRefresh] = useState("");
  const [isLocal, setIsLocal] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const uid = firebase.auth().currentUser.uid
  const BASE_URL = BASE_URL_V2;
  const API = {
    id: "_" + Math.random().toString(36).substr(2, 9),
    url: url,
    key: key + " ",
  };
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const fetc = async () => {
      if (props.route.params.authRef.current.access.length > 0 ) {
        try {
          setIsLocal(false)
          const response = await fetch(
            `${BASE_URL}users/@me/animelist?status=dropped&limit=1000&sort=list_score`,
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
      } else {
        try {
          setIsLocal(true)
          let animeList = await fetch(
            `${API.url}/favorites/filter?status=dropped`,
            {
              method: "GET",
              headers: {
                uid: uid
              }
            }
          )
          animeList = await animeList.text()
          setData(animeList)
          if (animeList.length > 0) {
            setGotData(true)
          }
        } catch (err) {
          console.log(err)
        }
        
      }
    }
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
                      res1.data.data.map(async(info) => {
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
                          if (await AsyncStorage.getItem('accessToken') == null){
                            try {
                              let animeList = await fetch(`${API.url}/favorites/find`, {
                                method: "GET",
                                headers: {
                                  uid: firebase.auth().currentUser.uid
                                }
                              })
                              animeList = await animeList.json()
                              res1.data.data.map((info) => {
                                props.navigation.navigate("EpisodeRoom", {
                                  flag: "local",
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
                                  accessToken: "unused",
                                  animeList: animeList
                                  // there is more options such as animeJapaneseTitle, studio.
                                });
                              });
          
                            } catch (err) {

                              console.log(err)
                            }
                            
                          } else {
                            AsyncStorage.getItem('accessToken').then(async function(token) {
                              axios.get(`${BASE_URL}users/@me/animelist?fields=list_status&limit=1000&sort=list_score`, {
                                headers: {
                                  Authorization: `${API.key}${token}`,
                                }
                              }).then(async function (animeList) {

                                res1.data.data.map((info) => {
                                  props.navigation.navigate("EpisodeRoom", {
                                    flag: "MAL",
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
                                    accessToken: token,
                                    animeList: animeList.data.data
                                    // there is more options such as animeJapaneseTitle, studio.
                                  });
                                });
                          }).catch((err) => {

                            console.log(err)
                          })
                        
          
                          })
                        }
                        }
                      });
                    });
                });
            }
          });
      });
  };
  function handleRender() {
    if (!isLocal) {
      {return data.data.map((item, key) => {
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

    } else {
      {return JSON.parse(data).map((item, key) => {
        return (
          <View style={styles().map} key={key}>
            <TouchableOpacity
              onPress={() => handlePress(item.animeName)}
            >
              <Image
                style={styles().mapImage}
                source={{ uri: String(item.uri) }}
              />
            </TouchableOpacity>
            <Text style={styles().mapText}>{item.animeName}</Text>
          </View>
        );
      })}
      // for (let i = 0; i < data.length; i++) {
      //   data.push({
      //     animeName: data[i].animeName,
      //     uri: data[i].uri,
      //   })
      // }
      // {data.map((data, key) => {
      //   console.log(data.uri)
      //   return (
      //     <View style={styles().map} key={key}>
      //     <TouchableOpacity
      //       onPress={() => handlePress(data.animeName)}
      //     >
      //       <Image
      //         style={styles().mapImage}
      //         source={{ uri: data.uri }}
      //       />
      //     </TouchableOpacity>
      //     <Text style={styles().mapText}>{data.animeName}</Text>
      //   </View>

      //   )
      // })}
        
    }
  }

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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefresh(`${Math.random() * 1000000}`)}/>}
        >
          <View style={styles().container}>
            {handleRender()}
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