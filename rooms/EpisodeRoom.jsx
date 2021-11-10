import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import {
  Paragraph,
  Button,
  Portal,
  Dialog,
  Colors,
  Provider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  Dimensions,
  ToastAndroid,
  ActivityIndicator,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { Header } from "../components/index";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { firebase } from "@firebase/app";
import { Picker } from "react-native-woodpicker";
import { key, url, BASE_URL_V2 } from "@env";
import "@firebase/database";
import "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const axios = require("axios");

const API = {
  id: "_" + Math.random().toString(36).substr(2, 9),
  url: url,
  key: key + " ",
};

const EpisodeRoom = ({ navigation, route, truthy }) => {
  const MAX_LINES = 3;

  const [isLoading, setIsLoading] = useState(false);

  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(undefined);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const [list, setList] = useState(route.params.episodesList);
  const [isAsc, setIsAsc] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");
  const [pickedData, setPickedData] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [episode, setEpisode] = useState(0);
  const [refresh, setRefresh] = useState("");
  const [loading, setLoading] = useState(false);
  const [logged, setLogged] = useState(false);

  const db = SQLite.openDatabase("favorites.db");

  const makeDatabase = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS favorites(user_id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(150), poster_url VARCHAR(255), rating INT, episode INT, status VARCHAR(50))"
      );
    });
  };

  const data = [
    { label: "Watching", value: 1 },
    { label: "Completed", value: 2 },
    { label: "On-Hold", value: 3 },
    { label: "Dropped", value: 4 },
    { label: "Plan to Watch", value: 5 },
  ];

  const onTextLayout = useCallback(
    (e) => {
      if (e.nativeEvent.lines.length > MAX_LINES && !showText) {
        setShowMoreButton(true);
        setNumberOfLines(MAX_LINES);
      }
    },
    [showText]
  );

  useEffect(() => {
    if (showMoreButton) {
      setNumberOfLines(showText ? undefined : MAX_LINES);
    }
  }, [showText, showMoreButton]);

  const getStatus = async () => {
    const aToken = await AsyncStorage.getItem("accessToken");
    if (aToken == null) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL_V2}users/@me/animelist?fields=list_status&limit=1000`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response = await response.text();
      const ss_response = await JSON.parse(s_response);
      /* ss_response format:
        {
          "data": [
            {
              "list_status": {
                "is_rewatching": false,
                "num_episodes_watched": 0,
                "score": 0,
                "status": "plan_to_watch",
                "updated_at": "2021-10-19T12:41:09+00:00",
              },
              "node": {
                "id": 48569,
                "main_picture": Object {
                  "large": "https://api-cdn.myanimelist.net/images/anime/1321/117508l.jpg",
                  "medium": "https://api-cdn.myanimelist.net/images/anime/1321/117508.jpg",
                },
                "title": "86 Part 2",
              },
            },
            ...
            ...
            ...
          ]
        }
      */
      const ar = [];
      for (let i = 0; i < ss_response.data.length; i++) {
        if (route.params.animeTitle.includes(ss_response.data[i].node.title)) {
          ar.push(ss_response.data[i]);
        }
      }
      if (ar.length > 1) {
        for (let i = 0; i < ar.length; i++) {
          if (route.params.animeTitle == ar[i].node.title) {
            if (ar[0].list_status.status === "watching") {
              setStatus("Watching");
            } else if (ar[0].list_status.status === "completed") {
              setStatus("Completed");
            } else if (ar[0].list_status.status === "on_hold") {
              setStatus("On-Hold");
            } else if (ar[0].list_status.status === "dropped") {
              setStatus("Dropped");
            } else {
              setStatus("Plan to Watch");
            }
            setIsAdded(true);
            return;
          }
        }
      } else if (ar.length === 1) {
        if (ar[0].list_status.status === "watching") {
          setStatus("Watching");
        } else if (ar[0].list_status.status === "completed") {
          setStatus("Completed");
        } else if (ar[0].list_status.status === "on_hold") {
          setStatus("On-Hold");
        } else if (ar[0].list_status.status === "dropped") {
          setStatus("Dropped");
        } else {
          setStatus("Plan to Watch");
        }
        setIsAdded(true);
      } else {
        const ar2 = [];
        for (let i = 0; i < ss_response.data.length; i++) {
          if (
            ss_response.data[i].node.title.includes(route.params.animeTitle)
          ) {
            ar2.push(ss_response.data[i]);
          }
        }
        if (ar2.length === 1) {
          if (ar2[0].list_status.status === "watching") {
            setStatus("Watching");
          } else if (ar2[0].list_status.status === "completed") {
            setStatus("Completed");
          } else if (ar2[0].list_status.status === "on_hold") {
            setStatus("On-Hold");
          } else if (ar2[0].list_status.status === "dropped") {
            setStatus("Dropped");
          } else {
            setStatus("Plan to Watch");
          }
          setIsAdded(true);
        } else if (ar2.length > 1) {
          for (let i = 0; i < ar2.length; i++) {
            if (route.params.animeTitle == ar2[i].node.title) {
              if (ar2[0].list_status.status === "watching") {
                setStatus("Watching");
              } else if (ar2[0].list_status.status === "completed") {
                setStatus("Completed");
              } else if (ar2[0].list_status.status === "on_hold") {
                setStatus("On-Hold");
              } else if (ar2[0].list_status.status === "dropped") {
                setStatus("Dropped");
              } else {
                setStatus("Plan to Watch");
              }
              setIsAdded(true);
              return;
            }
          }
        } else {
          setIsAdded(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getLocalEverything = () => {
    setLoading(true);
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM favorites WHERE title = ?",
        [route.params.animeTitle],
        (tx, res) => {
          console.log(res);
          if (res.rows._array.length > 0) {
            setStatus(res.rows._array[0].status);
            setRating(res.rows._array[0].rating);
            setEpisode(res.rows._array[0].episode);
            setIsAdded(true);
          } else {
            setIsAdded(false);
          }
        },
        (err, errm) => console.log(errm)
      );
    });
    setRefresh(`${Math.random() * 100000000}`);
    setLoading(false);
  };

  const getRating = async () => {
    const aToken = await AsyncStorage.getItem("accessToken");
    if (aToken == null) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL_V2}users/@me/animelist?fields=list_status&limit=1000`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response = await response.text();
      const ss_response = await JSON.parse(s_response);
      const ar = [];
      for (let i = 0; i < ss_response.data.length; i++) {
        if (route.params.animeTitle.includes(ss_response.data[i].node.title)) {
          ar.push(ss_response.data[i]);
        }
      }
      if (ar.length > 1) {
        for (let i = 0; i < ar.length; i++) {
          if (route.params.animeTitle == ar[i].node.title) {
            setRating(ar[i].list_status.score);
            return;
          }
        }
      } else if (ar.length === 1) {
        setRating(ar[0].list_status.score);
      } else {
        const ar2 = [];
        for (let i = 0; i < ss_response.data.length; i++) {
          if (
            ss_response.data[i].node.title.includes(route.params.animeTitle)
          ) {
            ar2.push(ss_response.data[i]);
          }
        }
        if (ar2.length === 1) {
          setRating(ar2[0].list_status.score);
        } else if (ar2.length > 1) {
          for (let i = 0; i < ar2.length; i++) {
            if (route.params.animeTitle == ar2[i].node.title) {
              setRating(ar2[0].list_status.score);
              return;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEpisode = async () => {
    const aToken = await AsyncStorage.getItem("accessToken");
    if (aToken == null) {
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL_V2}users/@me/animelist?fields=list_status&limit=1000`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response = await response.text();
      const ss_response = await JSON.parse(s_response);
      const ar = [];
      for (let i = 0; i < ss_response.data.length; i++) {
        if (route.params.animeTitle.includes(ss_response.data[i].node.title)) {
          ar.push(ss_response.data[i]);
        }
      }
      if (ar.length > 1) {
        for (let i = 0; i < ar.length; i++) {
          if (route.params.animeTitle == ar[i].node.title) {
            setEpisode(ar[i].list_status.num_episodes_watched);
            return;
          }
        }
      } else if (ar.length === 1) {
        setEpisode(ar[0].list_status.num_episodes_watched);
      } else {
        const ar2 = [];
        for (let i = 0; i < ss_response.data.length; i++) {
          if (
            ss_response.data[i].node.title.includes(route.params.animeTitle)
          ) {
            ar2.push(ss_response.data[i]);
          }
        }
        if (ar2.length === 1) {
          setEpisode(ar2[0].list_status.num_episodes_watched);
        } else if (ar2.length > 1) {
          for (let i = 0; i < ar2.length; i++) {
            if (route.params.animeTitle == ar2[i].node.title) {
              setEpisode(ar2[0].list_status.num_episodes_watched);
              return;
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const loggedStatus = async () => {
    try {
      const truth = await AsyncStorage.getItem("logged");
      setLogged(truth);
      setRefresh(`${Math.random() * 10000000}`);
    } catch (error) {
      console.log(error);
    }
  };

  /*useEffect(() => {
    console.log("we in the first render use effect");
    console.log("we done with that shii");
  }, []);*/

  useEffect(() => {
    makeDatabase();
    loggedStatus();
    console.log(logged);
    if (logged == null) {
      getLocalEverything();
    } else {
      getStatus();
      getRating();
      getEpisode();
    }
    return;
  }, [logged]);

  const handleScore = async (score) => {
    try {
      const aToken = await AsyncStorage.getItem("accessToken");
      const response1 = await fetch(
        `https://api.myanimelist.net/v2/anime?q=${route.params.animeTitle}&limit=100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response1 = await response1.text();
      const ss_response1 = await JSON.parse(s_response1);
      const id = ss_response1.data[0].node.id;
      const response2 = await fetch(
        `https://api.myanimelist.net/v2/anime/${id}/my_list_status?score=${score}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${aToken}`,
          },
          body: `score=${score}`,
        }
      );
      const s_response2 = await response2.text();
      const ss_response2 = await JSON.parse(s_response2);
      setRating(ss_response2.score);
    } catch (error) {
      console.log(error);
    }
  };

  const localHandleScore = async (score) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE favorites SET rating = ? WHERE title = ?",
        [score, route.params.animeTitle],
        (tx, res) => console.log(res),
        (err, errm) => console.log(errm)
      );
    });
    setRating(score);
  };

  const handleNewAnime = async () => {
    try {
      setLoading(true);
      const aToken = await AsyncStorage.getItem("accessToken");
      const response1 = await fetch(
        `https://api.myanimelist.net/v2/anime?q=${route.params.animeTitle}&limit=100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response1 = await response1.text();
      const ss_response1 = await JSON.parse(s_response1);
      const id = ss_response1.data[0].node.id;
      const response2 = await fetch(
        `https://api.myanimelist.net/v2/anime/${id}/my_list_status?score=${0}&status=${"plan_to_watch"}&num_watched_episodes=${0}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${aToken}`,
          },
          body: `score=${0}&status=${"plan_to_watch"}&num_watched_episodes=${0}`,
        }
      );
      const s_response2 = await response2.text();
      const ss_response2 = await JSON.parse(s_response2);
      setRating(ss_response2.score);
      setEpisode(ss_response2.num_episodes_watched);
      setStatus("Plan To Watch");
      setIsAdded(true);
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
      console.log(error);
    }
  };

  const localHandleNewAnime = async () => {
    //"CREATE TABLE IF NOT EXISTS favorites(user_id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(150), poster_url VARCHAR(255), rating INT, episode INT, status VARCHAR(50))"
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO favorites (title, poster_url, rating, episode, status) VALUES (?, ?, ?, ?, ?)",
        [
          route.params.animeTitle,
          route.params.animeCover,
          0,
          0,
          "Plan To Watch",
        ],
        (tx, res) => {
          console.log(res);
        },
        (err, errm) => console.log(errm)
      );
    });
    setRating(0);
    setEpisode(0);
    setStatus("Plan To Watch");
    setIsAdded(true);
  };

  const handleEpisodePress = async (ep) => {
    try {
      const aToken = await AsyncStorage.getItem("accessToken");
      const response1 = await fetch(
        `https://api.myanimelist.net/v2/anime?q=${route.params.animeTitle}&limit=100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response1 = await response1.text();
      const ss_response1 = await JSON.parse(s_response1);
      const id = ss_response1.data[0].node.id;
      const response2 = await fetch(
        `https://api.myanimelist.net/v2/anime/${id}/my_list_status?num_watched_episodes=${ep}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${aToken}`,
          },
          body: `num_watched_episodes=${ep}`,
        }
      );
      const s_response2 = await response2.text();
      const ss_response2 = await JSON.parse(s_response2);
      setEpisode(ss_response2.num_episodes_watched);
    } catch (error) {
      console.log(error);
    }
  };

  const localHandleEpisodePress = (ep) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE favorites SET episode = ? WHERE title = ?",
        [ep, route.params.animeTitle],
        (tx, res) => console.log(res),
        (err, errm) => console.log(errm)
      );
    });
    setEpisode(ep);
  };

  const handlePress = async (prop) => {
    let stat;
    if (prop.label === "Watching") {
      stat = "watching";
    } else if (prop.label === "Completed") {
      stat = "completed";
    } else if (prop.label === "On-Hold") {
      stat = "on_hold";
    } else if (prop.label === "Dropped") {
      stat = "dropped";
    } else {
      stat = "plan_to_watch";
    }
    setStatus(prop.label);
    try {
      const aToken = await AsyncStorage.getItem("accessToken");
      const response1 = await fetch(
        `https://api.myanimelist.net/v2/anime?q=${route.params.animeTitle}&limit=100`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${aToken}`,
          },
        }
      );
      const s_response1 = await response1.text();
      const ss_response1 = await JSON.parse(s_response1);
      const id = ss_response1.data[0].node.id;
      const response2 = await fetch(
        `https://api.myanimelist.net/v2/anime/${id}/my_list_status?status=${stat}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${aToken}`,
          },
          body: `status=${stat}`,
        }
      );
      const s_response2 = await response2.text();
      const ss_response2 = await JSON.parse(s_response2);
    } catch (error) {
      console.log(error);
    }
  };

  const localHandlePress = (prop) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE favorites SET status = ? WHERE title = ?",
        [prop.label, route.params.animeTitle],
        (tx, res) => console.log("status updated: \n", res),
        (err, errm) => console.log(errm)
      );
    });
    setStatus(prop.label);
  };

  /*const handleInfoRoom = () => {
    navigation.navigate("InfoRoom");
  };*/

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
          {/* <MenuProvider >
            <Menu onSelect={value => alert(`You Clicked : ${value}`)}>
              <MenuTrigger > */}
          <TouchableOpacity
            style={{
              position: "absolute",
              right: 15,
            }}
            onPress={() => {
              // TODO: Add advanced search; make sorting smooth

              if (isAsc) {
                setList(list.reverse());
                setIsAsc(false);
              } else {
                setList(list);
                setIsAsc(true);
              }
              // Alert.alert('Fil ter',
              //   "Episode sort order - Select your favorite order.\n\nSearch episode - Enter the number of the episode you want to watch.",
              //   [
              //     {
              //       text: 'Cancel', onPress: (se) => console.log(se)
              //     },
              //     {
              //       text: 'Search episode', onPress: () => console.log('serach Episode')
              //     },
              //     {
              //       text: 'Episode sort order', onPress: () => console.log('closed')
              //     },
              //   ]

              // )
              // setIsLoading(true)
              // firebase.auth().onAuthStateChanged(async function (user) {
              //   const isAdded = false;
              //   const userRef = firebase.database().ref(`Users/${user.uid}/AnimeList`).orderByKey()
              //   userRef.on("value", (snapshot) => {
              //     snapshot.forEach((childSnapshot) => {
              //       if (childSnapshot.child('animeName').val() === route.params.animeTitle) {
              //         console.log('are u here')
              //         isAdded = true
              //       }
              //     })

              //   })
              //   if (!isAdded) {
              //     const timeStamp = + new Date;
              //     const ref = firebase.database().ref(`Users/${user.uid}/AnimeList/${timeStamp}/AnimeDetails`)
              //     ref.set({
              //       userUID: user.uid,
              //       animeName: route.params.animeTitle,
              //       animeImage: route.params.animeCover,
              //       animeUrl: route.params.animeUrl,
              //       timeStamp: timeStamp
              //     }).then(function () {
              //       setIsLoading(false)
              //       if (Platform.OS === 'android') {
              //         ToastAndroid.showWithGravity(
              //           `${route.params.animeTitle} just got added to your list.`,
              //           2000,
              //           ToastAndroid.BOTTOM
              //         )
              //       }
              //     }).catch(function (err) {
              //       setIsLoading(false)
              //       if (Platform.OS === 'android') {
              //         ToastAndroid.showWithGravity(
              //           `Some error occured`,
              //           2000,
              //           ToastAndroid.BOTTOM
              //         )
              //       }
              //       console.log(err)
              //     })
              //   }

              // })
            }}
          >
            {/* <MenuProvider>
              <Menu
                style={{ right: 15, flexDirection: "column" }}
                onSelect={value => alert(`Selected number: ${value}`)}
                renderer={renderers.NotAnimatedContextMenu}
              >
                <MenuTrigger> */}
            <Ionicons
              name={"filter"}
              size={30}
              color={truthy ? "white" : "black"}
            />
            {/* </MenuTrigger>
                <MenuOptions>
                  <CheckedOption value={1} text='One' />
                  <CheckedOption checked value={2} text='Two' />
                  <IconOption value={3} text='Three' />
                </MenuOptions>
              </Menu>

            </MenuProvider> */}
          </TouchableOpacity>

          {/* </MenuTrigger  >
              <MenuOptions>
                <MenuOption value={"Watching"}>
                  <Text style={styles(truthy).menuContent}>Watching</Text>
                </MenuOption>
                <MenuOption value={"Plan to watch"}>
                  <Text style={styles(truthy).menuContent}>Plan To Watch</Text>
                </MenuOption>
                <MenuOption value={"On Hold"}>
                  <Text style={styles(truthy).menuContent}>On Hold</Text>
                </MenuOption>
                <MenuOption value={"Completed"}>
                  <Text style={styles(truthy).menuContent}>Completed</Text>
                </MenuOption>
                <MenuOption value={"Dropped"}>
                  <Text style={styles(truthy).menuContent}>Dropped</Text>
                </MenuOption>
                 <MenuOption value={3} disabled={true}>
              <Text style={styles(truthy).menuContent}>Disabled Menu</Text>
            </MenuOption>
              </MenuOptions>
            </Menu>
          </MenuProvider> */}
        </View>
        <View style={{ zIndex: 1 }}>
          <ScrollView
            overScrollMode="never"
            contentContainerStyle={{ marginTop: 0 }}
            style={{ zIndex: 1 }}
          >
            <View style={styles(truthy).infoContainer}>
              <View style={styles(truthy).genInfoContainer}>
                <Image
                  source={{ uri: route.params.animeCover }}
                  alt="poster"
                  style={styles(truthy).poster}
                />
                <View style={styles(truthy).textInfoContainer}>
                  {/*<View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >*/}
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={styles(truthy).title}
                  >
                    {route.params.animeTitle}
                  </Text>
                  {/*<TouchableOpacity
                      style={{ marginLeft: 10, marginTop: 15 }}
                      //onPress={() => handleInfoRoom()}
                    >
                      <FontAwesome5
                        name="question-circle"
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>*/}
                  {/*</View>*/}
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
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={styles(truthy).innerText}
                      >
                        {route.params.season}
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
                  <View style={{ top: 10, flex: 1 }}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      overScrollMode="never"
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={{
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        alignSelf: "flex-start",
                        position: "absolute",
                      }}
                    >
                      {route.params.genres.map((data, key) => {
                        return (
                          <Text style={styles(truthy).genresCard} key={key}>
                            {data.Genre}
                          </Text>
                        );
                      })}
                    </ScrollView>
                  </View>
                </View>
              </View>
              <View style={{ ...styles(truthy).descContainer, zIndex: 1 }}>
                {isAdded ? (
                  <View
                    syle={{
                      display: "flex",
                      flexDirection: "row",
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: Dimensions.get("window").width / 3,
                        marginTop: 10,
                        marginBottom: -90,
                      }}
                    >
                      <Picker
                        item={status}
                        items={data}
                        onItemChange={
                          logged == null ? localHandlePress : handlePress
                        }
                        title="Select"
                        placeholder={status != "" ? status : "Select"}
                        style={{
                          borderWidth: 2,
                          borderRadius: 7,
                          width: 110,
                          height: 40,
                          backgroundColor: "#fff",
                          textAlign: "center",
                        }}
                        //backdropAnimation={{ opacity: 0 }}
                        //mode="dropdown"
                        //isNullable
                        //disable
                      />
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: Dimensions.get("window").width / 3,
                        position: "relative",
                        top: -40,
                        left: Dimensions.get("window").width / 3.4,
                        height: 40,
                        marginTop: 90,
                        marginBottom: -60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Modal
                        animationType="slide"
                        visible={modalVisible}
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                      >
                        <View style={styles().centeredView}>
                          <View style={styles().modalView}>
                            <Text
                              style={{
                                color: "#fff",
                                fontSize: 20,
                                alignSelf: "center",
                                marginBottom: 15,
                                fontWeight: "bold",
                              }}
                            >
                              Rate this anime
                            </Text>
                            <ScrollView
                              style={{
                                flexDirection: "row",
                                flexWrap: "wrap",
                                flexShrink: 1,
                                width: Dimensions.get("window").width / 1,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  flexShrink: 1,
                                  width: Dimensions.get("window").width / 1,
                                  justifyContent: "center",
                                }}
                              >
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(0)
                                      : handleScore(0);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    marginLeft: 22,
                                    //backgroundColor:
                                    //parseInt(score) === 0 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 30,
                                    marginBottom: 7,
                                    marginEnd: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    0
                                  </Text>
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      textAlign: "center",
                                    }}
                                  >
                                    Unrated 😶
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(1)
                                      : handleScore(1);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    //backgroundColor:
                                    //  parseInt(score) === 1 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 40,
                                    marginBottom: 7,
                                    alignItems: "center",
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    1
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Appalling 🤮
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(2)
                                      : handleScore(2);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    marginLeft: 22,
                                    //backgroundColor:
                                    //  parseInt(score) === 2 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 30,
                                    marginBottom: 7,
                                    marginEnd: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    2
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Horrible 🤢
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(3)
                                      : handleScore(3);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    //backgroundColor:
                                    //  parseInt(score) === 3 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 25.5,
                                    marginBottom: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    3
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Very bad 🙁
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(4)
                                      : handleScore(4);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    marginLeft: 22,
                                    //backgroundColor:
                                    //parseInt(score) === 4 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 48,
                                    marginBottom: 7,
                                    marginEnd: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    4
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Bad 👎
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(5)
                                      : handleScore(5);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    //backgroundColor:
                                    //  parseInt(score) === 5 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    marginBottom: 7,
                                    paddingHorizontal: 28.5,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    5
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Average 😐
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(6)
                                      : handleScore(6);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    marginLeft: 22,
                                    //backgroundColor:
                                    //parseInt(score) === 6 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 47,
                                    marginBottom: 7,
                                    marginEnd: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    6
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Fine 😌
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(7)
                                      : handleScore(7);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    //backgroundColor:
                                    //parseInt(score) === 7 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 41,
                                    marginBottom: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    7
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Good 👍
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(8)
                                      : handleScore(8);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    marginLeft: 22,
                                    //backgroundColor:
                                    //parseInt(score) === 8 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 20,
                                    marginBottom: 7,
                                    marginEnd: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    8
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Very Good 😃
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(9)
                                      : handleScore(9);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    //backgroundColor:
                                    //parseInt(score) === 9 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 40,
                                    marginBottom: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    9
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Great 🤩
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => {
                                    setModalVisible(false);
                                    logged == null
                                      ? localHandleScore(10)
                                      : handleScore(10);
                                  }}
                                  activeOpacity={1}
                                  style={{
                                    marginLeft: 22,
                                    //backgroundColor:
                                    //parseInt(score) === 10 ? "green" : "#1a1a1a",
                                    borderRadius: 5,
                                    paddingVertical: 10,
                                    paddingHorizontal: 11.5,
                                    marginBottom: 7,
                                    backgroundColor: "#5c5c5c",
                                  }}
                                >
                                  <Text
                                    style={{
                                      fontSize: 20,
                                      color: "#fff",
                                      alignSelf: "center",
                                    }}
                                  >
                                    10
                                  </Text>
                                  <Text style={{ fontSize: 20, color: "#fff" }}>
                                    Masterpiece 🤯
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </ScrollView>
                          </View>
                        </View>
                      </Modal>
                      <Text style={{ fontSize: 30 }}>
                        {rating === 0
                          ? "😶"
                          : rating === 1
                          ? "🤮"
                          : rating === 2
                          ? "🤢"
                          : rating === 3
                          ? "🙁"
                          : rating === 4
                          ? "👎"
                          : rating === 5
                          ? "😐"
                          : rating === 6
                          ? "😌"
                          : rating === 7
                          ? "👍"
                          : rating === 8
                          ? "😃"
                          : rating === 9
                          ? "🤩"
                          : rating === 10
                          ? "🤯"
                          : "🤷"}
                      </Text>
                      <TouchableOpacity
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Ionicons name="ios-star" size={40} color="#f8ef71" />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        width: Dimensions.get("window").width / 3,
                        position: "relative",
                        top: -80,
                        marginTop: 65,
                        marginBottom: -60,
                        left: 1.8 * (Dimensions.get("window").width / 3),
                        height: 40,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          fontSize: 20,
                          color: "white",
                        }}
                      >
                        Episode: {episode}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{ marginBottom: 25 }}>
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        backgroundColor: "#252525",
                        borderRadius: 10,
                        borderWidth: 3,
                        borderColor: "#959595",
                        height: 60,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={async () => {
                        logged == null
                          ? localHandleNewAnime()
                          : handleNewAnime();
                        setRefresh(`${Math.random() * 1000000}`);
                      }}
                    >
                      <AntDesign name="pluscircleo" size={35} color="#959595" />
                      <Text
                        style={{
                          color: "#959595",
                          marginLeft: 15,
                          fontSize: 25,
                        }}
                      >
                        Add To List
                      </Text>
                      <Modal
                        animationType="slide"
                        visible={loading}
                        transparent={false}
                      >
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
                          style={styles(truthy, loading).loading}
                          size={Platform.OS === "android" ? 51 : "large"}
                        />
                      </Modal>
                    </TouchableOpacity>
                  </View>
                )}
                <Text
                  onTextLayout={onTextLayout}
                  style={{ color: truthy ? "white" : "black" }}
                  numberOfLines={numberOfLines}
                  ellipsizeMode="tail"
                >
                  {route.params.synopsis}
                </Text>
                {showMoreButton && (
                  <TouchableOpacity
                    style={styles(truthy).white}
                    onPress={() => {
                      setShowText((showText) => !showText);
                    }}
                  >
                    <Ionicons
                      name={showText ? "chevron-up" : "chevron-down"}
                      size={25}
                      color={truthy ? "white" : "black"}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView
              nestedScrollEnabled={true}
              overScrollMode="never"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              style={{ zIndex: 1 }}
            >
              <View style={styles(truthy).episodesList}>
                {list.map((data, key) => {
                  return (
                    <Text
                      style={styles(truthy).episodeCard}
                      key={key}
                      onPress={() => {
                        setIsLoading(true);
                        logged == null
                          ? localHandleEpisodePress(data.epNum)
                          : handleEpisodePress(data.epNum);
                        axios
                          .get(`${API.url}AnimeLazer/Login`, {
                            headers: {
                              "Content-Type": "application/json",
                              id: API.id,
                            },
                          })
                          .then(async function (res) {
                            axios
                              .get(`${API.url}Animes/RecentEpisodesMp4Src`, {
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: `${API.key}${res.data.token}`,
                                  src: data.epUrl,
                                },
                              })
                              .then(async function (res1) {
                                setIsLoading(false);
                                //console.log(res1)
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
                                      route.params.animeTitle +
                                      " Ep " +
                                      data.epNum,
                                    src: res1.data.data,
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
                      {"Episode " + data.epNum}
                    </Text>
                  );
                })}
              </View>
            </ScrollView>
          </ScrollView>
        </View>
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
      backgroundColor: "#1a1a1a",
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
      flexWrap: "wrap",
      marginEnd: 4,
    },
    genres: {
      top: 10,
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
      backgroundColor: "#1a1a1a",
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
      top: Dimensions.get("window").height / 2.3,
      right: Dimensions.get("window").width / 2.43,
      width: 70,
      height: 70,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: isLoading ? "#585858" : "transparent",
      borderRadius: 8,
    },
    menuContent: {
      color: "white",
      fontWeight: "bold",
      padding: 2,
      fontSize: 20,
      position: "absolute",
      top: 10,
      right: 15,
    },
    listText: {
      fontSize: 20,
      color: "black",
      textAlign: "center",
    },
    listContainer: {
      marginTop: 12,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      borderRadius: 20,
      backgroundColor: "rgba(20, 20, 20, 0.9)",
      alignItems: "center",
      shadowColor: "#000",
      paddingRight: 20,
      paddingLeft: 20,
      paddingBottom: 20,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      marginTop: 100,
      marginBottom: 100,
    },
  });
