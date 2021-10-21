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
} from "react-native";
import { Header } from "../components/index";
import { Ionicons } from "@expo/vector-icons";
import { firebase } from "@firebase/app";
import { key, url, BASE_URL_V2 } from "@env";
import "@firebase/database";
import "@firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState("");

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
      //Do something
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
            setStatus(ar[i].list_status.status);
            return;
          }
        }
      } else {
        setStatus(ar[0].list_status.status);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getStatus();
  }, []);

  const handlePress = async (prop) => {
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
        `https://api.myanimelist.net/v2/anime/${id}/my_list_status?status=${prop}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${aToken}`,
          },
          body: `status=${prop}`,
        }
      );
      const s_response2 = await response2.text();
      const ss_response2 = await JSON.parse(s_response2);
      setStatus(ss_response2.status);
    } catch (error) {
      console.log(error);
    }
  };

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
            style={{ position: "absolute", right: 15 }}
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
          <TouchableOpacity
            style={{ position: "absolute", right: 10, top: 5, zIndex: 100 }}
            onPress={() => setShow(!show)}
          >
            <Ionicons name="add-outline" size={40} color="white" />
          </TouchableOpacity>
          {show ? (
            <View
              style={{
                backgroundColor: "#fff",
                zIndex: 20,
                position: "absolute",
                top: 50,
                right: 10,
                borderRadius: 5,
                width: 170,
                height: 190,
              }}
            >
              <ScrollView>
                <View style={styles().listContainer}>
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 12,
                    }}
                    onPress={async () => await handlePress("watching")}
                  >
                    <Ionicons
                      name="checkmark-sharp"
                      size={24}
                      color="green"
                      style={{
                        display: status === "watching" ? "flex" : "none",
                      }}
                    />
                    <Text
                      style={{
                        ...styles().listText,
                        color: status === "watching" ? "green" : "black",
                        marginLeft: status === "watching" ? 8 : 0,
                      }}
                    >
                      Watching
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles().listContainer}>
                  <TouchableOpacity
                    onPress={async () => handlePress("completed")}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 12,
                    }}
                  >
                    <Ionicons
                      name="checkmark-sharp"
                      size={24}
                      color="green"
                      style={{
                        display: status === "completed" ? "flex" : "none",
                      }}
                    />
                    <Text
                      style={{
                        ...styles().listText,
                        color: status === "completed" ? "green" : "black",
                        marginLeft: status === "completed" ? 8 : 0,
                      }}
                    >
                      Completed
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles().listContainer}>
                  <TouchableOpacity
                    onPress={async () => handlePress("on_hold")}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 12,
                    }}
                  >
                    <Ionicons
                      name="checkmark-sharp"
                      size={24}
                      color="#979500"
                      style={{
                        display: status === "on_hold" ? "flex" : "none",
                      }}
                    />
                    <Text
                      style={{
                        ...styles().listText,
                        color: status === "on_hold" ? "#979500" : "black",
                        marginLeft: status === "on_hold" ? 8 : 0,
                      }}
                    >
                      On Hold
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles().listContainer}>
                  <TouchableOpacity
                    onPress={async () => handlePress("dropped")}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 12,
                    }}
                  >
                    <Ionicons
                      name="checkmark-sharp"
                      size={24}
                      color="red"
                      style={{
                        display: status === "dropped" ? "flex" : "none",
                      }}
                    />
                    <Text
                      style={{
                        ...styles().listText,
                        color: status === "dropped" ? "red" : "black",
                        marginLeft: status === "dropped" ? 8 : 0,
                      }}
                    >
                      Dropped
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles().listContainer}>
                  <TouchableOpacity
                    onPress={async () => handlePress("plan_to_watch")}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginLeft: 12,
                    }}
                  >
                    <Ionicons
                      name="checkmark-sharp"
                      size={24}
                      color="blue"
                      style={{
                        display: status === "plan_to_watch" ? "flex" : "none",
                      }}
                    />
                    <Text
                      style={{
                        ...styles().listText,
                        color: status === "plan_to_watch" ? "blue" : "black",
                      }}
                    >
                      Plan To Watch
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          ) : null}
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
                                  src: data.epUrl,
                                },
                              })
                              .then(async function (res1) {
                                setIsLoading(false);
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
  });
