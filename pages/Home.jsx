import React, { useState, useEffect } from "react";
import { FAB } from "react-native-elements";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Header } from "../components/index";
const axios = require("axios");

const API = {
  id: "_" + Math.random().toString(36).substr(2, 9),
  url: "https://animelazerapi.herokuapp.com",
  key: "Bearer ",
};

const Statusbar = ({ backgroundColor, barStyle = "dark-content" }) => {
  return (
    <View style={{ backgroundColor }}>
      <StatusBar
        animated={true}
        backgroundColor={backgroundColor}
        barStyle={barStyle}
      />
    </View>
  );
};

const Home = ({ navigation, navigate, truth }) => {
  const [isLoading, setIsLoading] = useState(false);

  const [episodes, setEpisodes] = useState([]);
  const [action, setAction] = useState([]);
  const [fiction, setFiction] = useState([]);
  const [school, setSchool] = useState([]);
  const [monsters, setMonsters] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    getFictionAnimes();
    getRecentEp();
    getActionAnimes();
    getSchoolAnimes();
    getMonstersAnimes();
    getTopRatedAnimes();
  }, []);

  // const newRes = async() => {
  //   const res = await newAPI.get('')
  //   console.log(res.data)
  // }
  function getActionAnimes() {
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
          .get(`${API.url}/Animes/actionAnimes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
            },
          })
          .then(async function (res1) {
            setIsLoading(false);
            setAction(res1.data.data);
          });
      })
      .catch(function (err) {
        setIsLoading(false);
        console.log(err);
      });
  }

  function getFictionAnimes() {
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
          .get(`${API.url}/Animes/fictionAnimes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
            },
          })
          .then(async function (res1) {
            setIsLoading(false);
            setFiction(res1.data.data);
          });
      })
      .catch(function (err) {
        setIsLoading(false);
        console.log(err);
      });
  }

  function getSchoolAnimes() {
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
          .get(`${API.url}/Animes/schoolAnimes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
            },
          })
          .then(async function (res1) {
            setIsLoading(false);
            setSchool(res1.data.data);
          });
      })
      .catch(function (err) {
        setIsLoading(false);
        console.log(err);
      });
  }

  function getMonstersAnimes() {
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
          .get(`${API.url}/Animes/monstersAnimes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
            },
          })
          .then(async function (res1) {
            setIsLoading(false);
            setMonsters(res1.data.data);
          });
      })
      .catch(function (err) {
        setIsLoading(false);
        console.log(err);
      });
  }

  function getTopRatedAnimes() {
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
          .get(`${API.url}/Animes/topRatedAnimes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
            },
          })
          .then(async function (res1) {
            setIsLoading(false);
            setTopRated(res1.data.data);
          });
      })
      .catch(function (err) {
        setIsLoading(false);
        console.log(err);
      });
  }

  function getRecentEp() {
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
          .get(`${API.url}/Animes/recentEpisodes`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `${API.key}${res.data.token}`,
            },
          })
          .then(async function (res1) {
            setIsLoading(false);
            setEpisodes(res1.data.data);
          });
      })
      .catch(function (err) {
        setIsLoading(false);
        console.log(err);
      });
  }

  if (!episodes) {
    return null;
  }
  if (!action) {
    return null;
  }
  if (!fiction) {
    return null;
  }
  if (!school) {
    return null;
  }
  if (!monsters) {
    return null;
  }
  if (!topRated) {
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
          backgroundColor: truth ? "#1a1a1a" : "#f0f0f0",
          width: "100%",
          height: "100%",
          flex: 1,
        }}
      >
        <StatusBar barStyle="light-content" />
        <Header />
        <ScrollView>
          <View style={styles(truth).padding} />
          <View style={styles(truth).shows}>
            <Text style={styles(truth).showText}>Recent</Text>
            <ScrollView horizontal style={styles(truth).mapContainer}>
              {episodes.map((data, key) => {
                return (
                  <View style={styles(truth).posterCotainer} key={key}>
                    <TouchableOpacity
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
                                  src: data.animeUrl,
                                },
                              })
                              .then(async function (res1) {
                                setIsLoading(false);
                                console.log(res1.data.data);
                                navigate.navigate("WatchRoom", {
                                  src: res1,
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
                        style={styles(truth).poster}
                      />
                      <Text numberOfLines={2} style={styles(truth).posterText}>
                        {data.animeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles(truth).shows}>
            <Text style={styles(truth).showText}>Action</Text>
            <ScrollView horizontal style={styles(truth).mapContainer}>
              {action.map((data, key) => {
                return (
                  <View style={styles(truth).posterCotainer} key={key}>
                    <TouchableOpacity
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
                              .get(`${API.url}/Animes/scrapeAnimeDetails`, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl,
                                },
                              })
                              .then(async function (res1) {
                                res1.data.data.map((data) => {
                                  setIsLoading(false);
                                  navigate.navigate("EpisodeRoom", {
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
                        style={styles(truth).poster}
                      />
                      <Text numberOfLines={2} style={styles(truth).posterText}>
                        {data.animeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles(truth).shows}>
            <Text style={styles(truth).showText}>Fiction</Text>
            <ScrollView horizontal style={styles(truth).mapContainer}>
              {fiction.map((data, key) => {
                return (
                  <View style={styles(truth).posterCotainer} key={key}>
                    <TouchableOpacity
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
                              .get(`${API.url}/Animes/scrapeAnimeDetails`, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl,
                                },
                              })
                              .then(async function (res1) {
                                res1.data.data.map((data) => {
                                  setIsLoading(false);
                                  navigate.navigate("EpisodeRoom", {
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
                        style={styles(truth).poster}
                      />
                      <Text numberOfLines={2} style={styles(truth).posterText}>
                        {data.animeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles(truth).shows}>
            <Text style={styles(truth).showText}>School</Text>
            <ScrollView horizontal style={styles(truth).mapContainer}>
              {school.map((data, key) => {
                return (
                  <View style={styles(truth).posterCotainer} key={key}>
                    <TouchableOpacity
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
                              .get(`${API.url}/Animes/scrapeAnimeDetails`, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl,
                                },
                              })
                              .then(async function (res1) {
                                res1.data.data.map((data) => {
                                  setIsLoading(false);
                                  navigate.navigate("EpisodeRoom", {
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
                        style={styles(truth).poster}
                      />
                      <Text numberOfLines={2} style={styles(truth).posterText}>
                        {data.animeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles(truth).shows}>
            <Text style={styles(truth).showText}>Monsters</Text>
            <ScrollView horizontal style={styles(truth).mapContainer}>
              {monsters.map((data, key) => {
                return (
                  <View style={styles(truth).posterCotainer} key={key}>
                    <TouchableOpacity
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
                              .get(`${API.url}/Animes/scrapeAnimeDetails`, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl,
                                },
                              })
                              .then(async function (res1) {
                                res1.data.data.map((data) => {
                                  setIsLoading(false);
                                  navigate.navigate("EpisodeRoom", {
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
                        style={styles(truth).poster}
                      />
                      <Text numberOfLines={2} style={styles(truth).posterText}>
                        {data.animeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          <View style={styles(truth).shows}>
            <Text style={styles(truth).showText}>Top Rated</Text>
            <ScrollView horizontal style={styles(truth).mapContainer}>
              {topRated.map((data, key) => {
                return (
                  <View style={styles(truth).posterCotainer} key={key}>
                    <TouchableOpacity
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
                              .get(`${API.url}/Animes/scrapeAnimeDetails`, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl,
                                },
                              })
                              .then(async function (res1) {
                                res1.data.data.map((data) => {
                                  setIsLoading(false);
                                  navigate.navigate("EpisodeRoom", {
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
                        style={styles(truth).poster}
                      />
                      <Text numberOfLines={2} style={styles(truth).posterText}>
                        {data.animeName}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>
        <ActivityIndicator
          animating={isLoading}
          color="#d5e6ff"
          style={styles(truth, isLoading).loading}
          size={Platform.OS === "android" ? 51 : "large"}
        />
        <FAB
          placement="right"
          color="#0367fc"
          style={styles(truth).FAB}
          icon={{ name: "search", color: "white" }}
          onPress={() => navigate.navigate("search")}
        />
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = (truth, isLoading) => {
  return StyleSheet.create({
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
      marginLeft: 10,
      color: truth ? "#e6e6e6eb" : "#222222",
      fontWeight: "bold",
      fontSize: 20,
    },
    posterCotainer: {
      display: "flex",
      flexWrap: "wrap",
      marginRight: Dimensions.get("window").width / 100e1,
      alignItems: "center",
      width: 140,
      height: 210,
      marginTop: Dimensions.get("window").height / 46,
      paddingBottom: 30,
    },
    posterText: {
      marginTop: 2,
      marginRight: 30,
      marginLeft: 10,
      textAlign: "center",
      fontWeight: "bold",
      color: truth ? "#e6e6e6eb" : "#222222",
    },
    mapContainer: {
      height: 250,
    },
    padding: {
      marginTop: 50,
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
};
