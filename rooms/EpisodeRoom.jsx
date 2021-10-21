import React, { useState, useEffect, useCallback, useRef } from "react";
import {Searchbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
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
  TouchableWithoutFeedback
} from "react-native";
import { Ionicons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {key, url, BASE_URL_V2 as BASE_URL} from "@env"
import "@firebase/database"
import "@firebase/auth"


const axios = require("axios");

const API = {
  id: "_" + Math.random().toString(36).substr(2, 9),
  url: url,
  key: key + " ",
};



const EpisodeRoom = ({ navigation, route, truthy }) => {
  const MAX_LINES = 3;

  const [isLoading, setIsLoading] = useState(false);

  // description check
  const [showText, setShowText] = useState(false);
  const [numberOfLines, setNumberOfLines] = useState(undefined);
  const [showMoreButton, setShowMoreButton] = useState(false);

  // reverse filter
  const [list, setList] = useState(route.params.episodesList)
  const [isAsc, setIsAsc] = useState(false);

  // modal view
  const [modalVisible, setModalVisible] = useState(false);

  // anime status
  const [token, setToken] = useState(route.params.accessToken)
  const [animeList, setAnimeList] = useState(route.params.animeList)
  const [isAdded, setIsAdded] = useState(null)
  const [status, setStatus] = useState(null)
  const [score, setScore] = useState(null)

  // for Advanced episode search
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredSearch, setFilteredSearch] = useState([]);
  const onChangeSearch = (query) => {
    setFilteredSearch(list.filter((data) => {return data.epNum.startsWith(query)}))
    setSearchQuery(query)
  };


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
    animeStatus()

  }, [showText, showMoreButton]);

  // const fetchAnimeList = async() => {
  //   try {
  //     if (token == null) {
  //       console.log('sign in first')
  //     }
  //     setIsLoading(true)
  //     const response = await axios.get(
  //       `${BASE_URL}users/@me/animelist?fields=list_status&limit=1000&sort=list_score`, {
  //         headers: {
  //           Authorization: `${API.key}${token}`,
  //         }
  //       });
  //     setIsLoading(false)
  //     setAnimeList(response.data.data)
  //     animeStatus()
  //     if (response.data.data.length > 0) {
  //       console.log('data avaliable')
  //     }
  //   } catch (e) {
  //     setIsLoading(false)
  //     console.log(e);
  //   }
  // }
  const handleStatus = () => {

  }

  const animeStatus = () => {
    if (animeList.length > 0) {
      animeList.map((data, key) => {
        if(data.node.title == route.params.animeTitle) {
          setIsAdded(true)
          setStatus(data.list_status.status)
          setScore(data.list_status.score)
          console.log(data.list_status.status)
        }
      })

    } else {
      console.log('Sign in first')
    }
    if (!isAdded) {
      console.log('Not Added')
    } else {
      console.log('Is Added')
    }
  }


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
         <TouchableOpacity style={{ position: "absolute", right: 65 }}
            onPress={() => {
              setModalVisible(!modalVisible);
            }}>
            <Ionicons
              name={"search"}
              size={30}
              color={truthy ? "white" : "black"}
            />

          </TouchableOpacity>
          
          <TouchableOpacity style={{ position: "absolute", right: 15 }}
            onPress={() => {
              if (!isAsc) {
                setList(list.reverse())
                setIsAsc(true)
              } else {
                setList(list.reverse())
                setIsAsc(false)
              }
            }}>
            <Ionicons
              name={"filter"}
              size={30}
              color={truthy ? "white" : "black"}
            />

          </TouchableOpacity>
        </View>
        <View>
          <ScrollView overScrollMode="never" contentContainerStyle={{ marginTop: 0 }}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(!modalVisible)}
            >
            {/* <TouchableOpacity 
            style={styles(truthy).centeredView} 
            activeOpacity={1} 
            onPressOut={() => {setModalVisible(!modalVisible)}}
          > */}
            <View style={styles(truthy).centeredView}>
              <View style={styles(truthy).modalView}>
              <TouchableOpacity
                style={[styles(truthy).button, styles(truthy).buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
                >
                  <Ionicons
                  name={"close"}
                  size={12}
                  color={truthy ? "black" : "white"}
                />

            </TouchableOpacity>
              <Searchbar
              placeholder="Search episode number..."
              onChangeText={onChangeSearch}
              value={searchQuery}/>
                <ScrollView
                nestedScrollEnabled={true}
                overScrollMode="never"
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}>
                  <View style={styles(truthy).searchFilterContainer}>
                      {filteredSearch.map((data, key) => {
                        return (
                          <Text
                            style={styles(truthy).episodeCard}
                            key={key}
                            onPress={() => {
                              setModalVisible(false)
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
                                            route.params.animeTitle + " Ep " + data.epNum,
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
                        )

                      })
                      }

                    </View>
              </ScrollView>
            </View>
        </View> 
        {/* </TouchableOpacity> */}
              
            </Modal>
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
                      <Text numberOfLines={1} ellipsizeMode="tail" style={styles(truthy).innerText}>
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
                        flexWrap: 'wrap',
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
              <View style={styles(truthy).descContainer}>
              <View style={{marginBottom: 10, flexDirection: "row", alignSelf: "center", position: "relative"}}>
                {(isAdded) ? (
                  <>
                    <View style={{position: "relative"}}>
                    <TouchableOpacity
                          onPress={() => {
                            console.log('hello')
                          }}
                        >
                          <MaterialCommunityIcons
                            name={"movie"}
                            size={25}
                            color={truthy ? "white" : "black"}
                            style={{alignSelf: "center", position: "relative"}}
                          />
                          <Text style={{color: truthy ? "white" : "black", textAlign: "center"}}>{(status != null) ? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ') : "None"}</Text>
                        </TouchableOpacity>
                  </View>
                  <View style={{paddingEnd: 80, position: "relative"}}>
                    {/* <TouchableOpacity
                          onPress={() => {
                            console.log('hello')
                          }}
                        >
                          <MaterialCommunityIcons
                            name={"eye"}
                            size={25}
                            color={truthy ? "white" : "black"}
                            style={{alignSelf: "center"}}
                          /> */}
                          {/* <Text style={{color: truthy ? "white" : "black", textAlign: "center"}}>0/{route.params.episodes}</Text> */}
                        {/* </TouchableOpacity> */}
                  </View>
                  <View style={{position: "relative"}}>
                    <TouchableOpacity
                          onPress={() => {
                            console.log('hello')
                          }}
                        >
                          <AntDesign
                            name={"like1"}
                            size={25}
                            color={truthy ? "white" : "black"}
                            style={{ marginBottom: 1, alignSelf: "center"}}
                          />
                          <Text style={{color: truthy ? "white" : "black", textAlign: "center"}}>{(score != null) ? score : "None"}</Text>
                        </TouchableOpacity>
                  </View>
                </>

                ) : (
                <TouchableOpacity onPress={() => console.log("TODO")} style={styles(truthy).isAdded}>
                    <Ionicons
                    name={"add"}
                    color="#fff"
                    size={25} />
                  <Text style={styles(truthy).isAddedText}>ADD TO LIST</Text>
                </TouchableOpacity>
                )}
              </View>
                <Text
                  onTextLayout={onTextLayout}
                  style={{ color: truthy ? "white" : "black" }}
                  numberOfLines={numberOfLines}
                  ellipsizeMode="tail"
                >
                  {route.params.synopsis}
                  {'\n\nOther name(s): '}
                  {(route.params.otherNames === undefined) ? 'None' : (route.params.otherNames)}
                </Text>
                {showMoreButton && (
                  <TouchableOpacity
                    style={styles(truthy).white}
                    onPress={() => {
                      setShowText((showText) => !showText)
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
                                      route.params.animeTitle + " Ep " + data.epNum,
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
                  )
                })

                }

              </View>
            </ScrollView>
          </ScrollView>
        </View>
        <ActivityIndicator
          animating={isLoading}
          color="#d5e6ff"
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
      marginEnd: 4

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
      backgroundColor: "#1a1a1a"
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
      alignItems: 'center',
      justifyContent: 'center',
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
      right: 15
    },
    backgroundImage: {
      height: '100%',
      width: '100%',
      flex: 1,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
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
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      marginTop: 100,
      marginBottom: 100,
    },
    button: {
      margin: 5,
      borderRadius: 20,
      padding: 5,
      elevation: 2,
      alignSelf: "flex-end",
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "white",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
    searchFilterContainer: {
      paddingTop: 20,
      marginLeft: 20,
      justifyContent: "center",
      alignItems: "baseline",
      flexDirection: "row",
      flexWrap: "wrap",
    },
    isAdded: {
      width: '100%',
      backgroundColor: "#1a1a1a",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 2,
      borderColor: "#fff",
      flexDirection: "row"
    },
    isAddedText: {
      fontSize: 18,
      color: "#fff",
      fontWeight: "bold",
      marginLeft: 90
    }
  });
