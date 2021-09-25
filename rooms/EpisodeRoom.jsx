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
  Dimensions
} from "react-native";
import { Header } from "../components/index";
import { Ionicons } from "@expo/vector-icons";



const EpisodeRoom = ({ navigation, route }) => {
  const MAX_LINES = 3;
  const [showMore, setShowMore] = useState(false);
  const [lengthMore, setLengthMore] = useState(false);


  const toggleNumberOfLines = () => {
    setShowMore(!showMore)
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
            <View style={styles.genres}>
              {
               route.params.genres.map((data, key) => {
                  return (
                    <Text style={styles.genresCard} key={key}>{data.Genre}</Text>
                  )
                })
              }
            </View>
          </View>
        </View>
        <View style={styles.descContainer}>
          <Text numberOfLines={showMore ? undefined : MAX_LINES} onTextLayout={onTextLayout} style={styles.white}>
          {route.params.summary}
          </Text>
          {
            lengthMore ? <Ionicons
            onPress={toggleNumberOfLines} size={22} style={styles.arrow} name={showMore ? 'chevron-up-sharp' : 'chevron-down-sharp'}>
              </Ionicons>
            : null
          }
        </View>
      </View>
      <ScrollView>
      <View style={styles.episodesList}>
              {
               route.params.episodesList.map((data, key) => {
                  return (
                    <Text style={styles.episodeCard} key={key}>{data.episode}</Text>
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
    padding: 5,
    textAlign: "center",
    backgroundColor: "#383838",
    borderRadius: 13,
    flexDirection: "row",
    display: "flex",
    marginBottom: 6,
    marginEnd: 4
    
    
  },
  genres: {
    top: 7,
    alignItems: "baseline",
    flexDirection: "column",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 1,
    flex: 0.9,
    
  },
  episodesList: {
    top: 7,
    alignItems: "baseline",
    justifyContent: "center",
    flexWrap: "wrap",
    flexGrow: 1,
    flex: 0.9,

  },
  episodeCard: {
    color: "white",
    padding: 5,
    textAlign: "center",
    backgroundColor: "#383838",
    borderRadius: 10,
    flexDirection: "row",
    display: "flex",
    marginBottom: 6,
    marginEnd: 4
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
    marginLeft: 325,
    color: "white"
  },
  genInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 50,
  },
  textInfoContainer: {
    marginLeft: 25,
  },
  title: {
    fontSize: 20,
    color: "white",
    width: 180,
  },
  genDesc: {
    marginTop: 10,
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
