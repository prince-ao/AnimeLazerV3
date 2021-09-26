import React, { useState, useEffect, useCallback } from "react";
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
  ToastAndroid
} from "react-native";
import { Header } from "../components/index";
import { Ionicons } from "@expo/vector-icons";


const axios = require('axios')

const API = {
  id: '_' + Math.random().toString(36).substr(2, 9),
  url: "https://animelazerapi.herokuapp.com",
  key: "Bearer "
}

const EpisodeRoom = ({ navigation, route}) => {
  const MAX_LINES = 3;
  const [showLess, setShowLess] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);


  const toggleNumberOfLines = () => {
    setShowLess(!showLess)
  }

  const onTextLayout = useCallback(
    (e) => {
      setLengthMore(e.nativeEvent.lines.length > MAX_LINES);
    }, []);


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.back}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-sharp" size={35} color="#5c94dd" />
        </TouchableOpacity>
        <Image style={styles.logo} source={require("../assets/Logo.png")} />
        {/* <TouchableOpacity
          style={{left: 170, top: 0, margin: 0}}
        >
          <Ionicons name="heart-sharp" size={35} color="#5c94dd" />
        </TouchableOpacity> */}

      </View>
      <View style={styles.infoContainer}>
        <View style={styles.genInfoContainer}>
          <Image source={{uri: route.params.animeCover}} alt="poster" style={styles.poster} />
          <View style={styles.textInfoContainer}>
            <Text numberOfLines={2} ellipsizeMode='tail' style={styles.title}>{route.params.animeTitle}</Text>
            <View style={styles.genDesc}>
              <Text style={styles.white}>Type: <Text style={styles.innerText}>{route.params.type} </Text></Text>
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.white}>Released: <Text style={styles.innerText}>{(route.params.season).includes("Anime") ? (route.params.season).replace("Anime", "") : (route.params.season)} </Text> </Text>
              <Text style={styles.white}>Episodes: <Text style={styles.innerText}>{route.params.episodes} </Text></Text>
              <Text style={styles.white}>Status: <Text style={styles.innerText}>{route.params.status} </Text></Text>
            </View>
            <ScrollView
            overScrollMode="never"
            showsVerticalScrollIndicator ={false} style={styles.genres}>
            <View>
              {
               route.params.genres.map((data, key) => {
                  return (
                    <Text style={styles.genresCard} key={key}>{data.Genre}</Text>
                  )
                })
              }
            </View>
            </ScrollView>
          </View>
        </View>
        <View style={styles.descContainer}>
          <Text numberOfLines={showLess ? undefined : MAX_LINES} onTextLayout={onTextLayout} style={styles.white}>
          {route.params.summary}
          </Text>
          {
            lengthMore ? <Ionicons
            onPress={toggleNumberOfLines} size={22} style={styles.arrow} name={showLess ? 'chevron-up-sharp' : 'chevron-down-sharp'}>
              </Ionicons>
            : null
          }
        </View>
      </View>
      <ScrollView
      overScrollMode="never"
      showsVerticalScrollIndicator ={false}
      showsHorizontalScrollIndicator={false}>
      <View style={styles.episodesList}>
              {
               route.params.episodesList.map((data, key) => {
                  return (
                    <Text style={styles.episodeCard} key={key} onPress={() => {
                      axios.get(`${API.url}/AnimeLazer/Login`, {
                        headers: {
                            'Content-Type': 'application/json',
                            id: API.id
                        }
                      })
                      .then(async function(res) {
                        axios.get(`${API.url}/Animes/RecentEpisodesMp4Src`, {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `${API.key}${res.data.token}`,
                                src: data.url
                            }
                            
                        }).then(async function(res1) {
                          console.log(res1.data.data)
                            navigation.navigate("WatchRoom", {
                                src: res1.data.data
                               })  
                        })
                    
                    
                      })
                      .catch(function(err) {
                        console.log(err)
                      })
                    }}> { "Episode " +data.episode}</Text>
                  )
                })
              }
            </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EpisodeRoom;


const styles = StyleSheet.create(
  {
  
  container: {
    backgroundColor: "#1b1b1b",
    width: "100%",
    height: "100%",
    color: "white",
  },
  headerContainer: {
    width: "100%",
    height: 15,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
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
    display: "flex"
    
  },
  genres: {
    top: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1
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
    color: "gray"
  },
  white: {
    color: "white",
  },
  arrow: {
    marginLeft: Dimensions.get('window').width / 1.2,
    color: "white"
  },
  genInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: Dimensions.get('window').height / 20,
  },
  textInfoContainer: {
    marginLeft: Dimensions.get('window').width / 16,
  },
  title: {
    fontSize: 20,
    color: "white",
    width: Dimensions.get('window').height / 5,
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
    margin: 15
  },
  logo: {
    marginTop: 40,
    width: 150,
    height: 30,
  },
  back: {
    position: "absolute",
    left: 20,
    top: 10,
  },
});
