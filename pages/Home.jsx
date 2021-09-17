import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Header } from "../components/index";
const axios = require('axios')


const API = {
  id: '_' + Math.random().toString(36).substr(2, 9),
  url: "https://animelazerapi.herokuapp.com",
  key: "Bearer "
}

// const tempData = [
//   {
//     title: "Pokemon",
//     Type: "TV",
//     Episodes: 276,
//     score: 7.35,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Oyasumi Punpun",
//     Type: "Manga",
//     Episodes: 147,
//     score: 9.05,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Fullmetal Alchemist: Brotherhood",
//     Type: "TV",
//     Episodes: 64,
//     score: 9.16,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Shingeki no Kyojin Season 3 Part 2",
//     Type: "TV",
//     Episodes: 10,
//     score: 9.1,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Steins;Gate",
//     Type: "TV",
//     Episodes: 24,
//     score: 9.1,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Gintama°",
//     Type: "TV",
//     Episodes: 51,
//     score: 9.09,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Fruits Basket: The Final",
//     Type: "TV",
//     Episodes: 13,
//     score: 9.08,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Gintama'",
//     Type: "TV",
//     Episodes: 51,
//     score: 9.06,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Hunter x Hunter (2011)",
//     Type: "TV",
//     Episodes: 148,
//     score: 9.06,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
//   {
//     title: "Ginga Eiyuu Densetsu",
//     Type: "TV",
//     Episodes: 110,
//     score: 9.05,
//     url: require("../assets/assasination-classroom.jpg"),
//   },
// ];

/*const newObj = {
  handle: () => {
    navigate.navigate("EpisodeRoom", {});
  },
};*/

const Home = ({ navigation, navigate }) => {

  const [episodes, setEpisodes] = useState([])
  const [action, setAction] = useState([])
  const [fiction, setFiction] = useState([])
  const [school, setSchool] = useState([])
  const [monsters, setMonsters] = useState([])
  const [topRated, setTopRated] = useState([])


  useEffect(()=> {
    getFictionAnimes()
    getRecentEp()
    getActionAnimes()
    getSchoolAnimes()
    getMonstersAnimes()
    getTopRatedAnimes()
  }, [])

  // const newRes = async() => {
  //   const res = await newAPI.get('')
  //   console.log(res.data)
  // }
  function getActionAnimes() {
    axios.post(`${API.url}/AnimeLazer/Login`, {
      headers: {
          'Content-Type': 'application/json',
          id: API.id
      }
    })
    .then(async function(res) {
      axios.get(`${API.url}/Animes/actionAnimes`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `${API.key}${res.data.token}`
          }
      }).then(async function(res1) {
          setAction(res1.data.data)
      })
  
  
    })
    .catch(function(err) {
      console.log(err)
    })
    

  }


  function getFictionAnimes() {
    axios.post(`${API.url}/AnimeLazer/Login`, {
      headers: {
          'Content-Type': 'application/json',
          id: API.id
      }
    })
    .then(async function(res) {
      axios.get(`${API.url}/Animes/fictionAnimes`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `${API.key}${res.data.token}`
          }
      }).then(async function(res1) {
          setFiction(res1.data.data)
      })
  
  
    })
    .catch(function(err) {
      console.log(err)
    })
    

  }


  function getSchoolAnimes() {
    axios.post(`${API.url}/AnimeLazer/Login`, {
      headers: {
          'Content-Type': 'application/json',
          id: API.id
      }
    })
    .then(async function(res) {
      axios.get(`${API.url}/Animes/schoolAnimes`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `${API.key}${res.data.token}`
          }
      }).then(async function(res1) {
          setSchool(res1.data.data)
      })
  
  
    })
    .catch(function(err) {
      console.log(err)
    })
    

  }

  function getMonstersAnimes() {
    axios.post(`${API.url}/AnimeLazer/Login`, {
      headers: {
          'Content-Type': 'application/json',
          id: API.id
      }
    })
    .then(async function(res) {
      axios.get(`${API.url}/Animes/monstersAnimes`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `${API.key}${res.data.token}`
          }
      }).then(async function(res1) {
          setMonsters(res1.data.data)
      })
  
  
    })
    .catch(function(err) {
      console.log(err)
    })
    

  }

  function getTopRatedAnimes() {
    axios.post(`${API.url}/AnimeLazer/Login`, {
      headers: {
          'Content-Type': 'application/json',
          id: API.id
      }
    })
    .then(async function(res) {
      axios.get(`${API.url}/Animes/topRatedAnimes`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `${API.key}${res.data.token}`
          }
      }).then(async function(res1) {
          setTopRated(res1.data.data)
      })
  
  
    })
    .catch(function(err) {
      console.log(err)
    })
    

  }


  function getRecentEp() {
    axios.post(`${API.url}/AnimeLazer/Login`, {
      headers: {
          'Content-Type': 'application/json',
          id: API.id
      }
    })
    .then(async function(res) {
      axios.get(`${API.url}/Animes/recentEpisodes`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `${API.key}${res.data.token}`
          }
      }).then(async function(res1) {
          setEpisodes(res1.data.data)
      })
  
  
    })
    .catch(function(err) {
      console.log(err)
    })
    
  }

  if (!episodes) {
    return null
  }
  if (!action) {
    return null
  }
  if (!fiction) {
    return null
  }
  if (!school) {
    return null
  }
  if (!monsters) {
    return null
  }
  if (!topRated) {
    return null
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Header />
      <ScrollView>
        <View style={styles.padding} />
        <View style={styles.shows}>
          <Text style={styles.showText}>Recent</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {episodes.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...episodes[key] })
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Action</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {action.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...action[key] })
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Fiction</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {fiction.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...fiction[key] })
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>School</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {school.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...school[key] })
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Monsters</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {monsters.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...monsters[key] })
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text style={styles.showText}>Top Rated</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {topRated.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      navigate.navigate("EpisodeRoom", { ...topRated[key] })
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
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
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  posterCotainer: {
    display: "flex",
    flexWrap: "wrap",
    marginRight: 30,
    alignItems: "center",
    width: 150,
    height: 210,
    marginTop: 30,
    paddingBottom: 30,
  },
  posterText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  mapContainer: {
    height: 270,
  },
  padding: {
    marginTop: 40,
  },
});
