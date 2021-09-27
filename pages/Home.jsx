import React, { useState, useEffect } from "react";
import { FAB } from 'react-native-elements';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import { Header } from "../components/index";
const axios = require('axios')


const API = {
  id: '_' + Math.random().toString(36).substr(2, 9),
  url: "https://animelazerapi.herokuapp.com",
  key: "Bearer "
}


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
    axios.get(`${API.url}/AnimeLazer/Login`, {
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
    axios.get(`${API.url}/AnimeLazer/Login`, {
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
    axios.get(`${API.url}/AnimeLazer/Login`, {
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
    axios.get(`${API.url}/AnimeLazer/Login`, {
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
    axios.get(`${API.url}/AnimeLazer/Login`, {
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
    axios.get(`${API.url}/AnimeLazer/Login`, {
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
                    onPress={() => {
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
                                src: data.animeUrl
                            }
                            
                        }).then(async function(res1) {
                          console.log(res1.data.data)
                            navigate.navigate("WatchRoom", {
                                src: res1.data.data
                               })  
                        })
                    
                    
                      })
                      .catch(function(err) {
                        console.log(err)
                      })
                  }
                  }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text numberOfLines={2} style={styles.posterText}>{data.animeName}</Text>
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
                      {
                        axios.get(`${API.url}/AnimeLazer/Login`, {
                          headers: {
                              'Content-Type': 'application/json',
                              id: API.id
                          }
                        })
                        .then(async function(res) {
                          axios.get(`${API.url}/Animes/scrapeAnimeDetails`, {
                              headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl
                              }
                          }).then(async function(res1) {  
                              res1.data.data.map((data) => {
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
                                  episodesList: data.episodesList
                                  // there is more options such as animeJapaneseTitle, studio.
                                 })
                              })
                          })
                        })
                        .catch(function(err) {
                          console.log(err)
                        })
                        
                      }
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text numberOfLines={2} style={styles.posterText}>{data.animeName}</Text>
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
                      {
                        axios.get(`${API.url}/AnimeLazer/Login`, {
                          headers: {
                              'Content-Type': 'application/json',
                              id: API.id
                          }
                        })
                        .then(async function(res) {
                          axios.get(`${API.url}/Animes/scrapeAnimeDetails`, {
                              headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl
                              }
                          }).then(async function(res1) {  
                              res1.data.data.map((data) => {
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
                                  episodesList: data.episodesList
                                  // there is more options such as animeJapaneseTitle, studio.
                                 })
                              })
                          })
                        })
                        .catch(function(err) {
                          console.log(err)
                        })
                        
                      }
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text numberOfLines={2} style={styles.posterText}>{data.animeName}</Text>
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
                      {
                        axios.get(`${API.url}/AnimeLazer/Login`, {
                          headers: {
                              'Content-Type': 'application/json',
                              id: API.id
                          }
                        })
                        .then(async function(res) {
                          axios.get(`${API.url}/Animes/scrapeAnimeDetails`, {
                              headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl
                              }
                          }).then(async function(res1) {  
                              res1.data.data.map((data) => {
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
                                  episodesList: data.episodesList
                                  // there is more options such as animeJapaneseTitle, studio.
                                 })
                              })
                          })
                        })
                        .catch(function(err) {
                          console.log(err)
                        })
                        
                      }
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text numberOfLines={2} style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.shows}>
          <Text  style={styles.showText}>Monsters</Text>
          <ScrollView horizontal style={styles.mapContainer}>
            {monsters.map((data, key) => {
              return (
                <View style={styles.posterCotainer} key={key}>
                  <TouchableOpacity
                    onPress={() =>
                      {
                        axios.get(`${API.url}/AnimeLazer/Login`, {
                          headers: {
                              'Content-Type': 'application/json',
                              id: API.id
                          }
                        })
                        .then(async function(res) {
                          axios.get(`${API.url}/Animes/scrapeAnimeDetails`, {
                              headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl
                              }
                          }).then(async function(res1) {  
                              res1.data.data.map((data) => {
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
                                  episodesList: data.episodesList
                                  // there is more options such as animeJapaneseTitle, studio.

                                 })
                                
                              })
                              
                              
                          })
                      
                      
                        })
                        .catch(function(err) {
                          console.log(err)
                        })
                        
                      }
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text numberOfLines={2} style={styles.posterText}>{data.animeName}</Text>
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
                      {
                        axios.get(`${API.url}/AnimeLazer/Login`, {
                          headers: {
                              'Content-Type': 'application/json',
                              id: API.id
                          }
                        })
                        .then(async function(res) {
                          axios.get(`${API.url}/Animes/scrapeAnimeDetails`, {
                              headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `${API.key}${res.data.token}`,
                                  url: data.animeUrl
                              }
                          }).then(async function(res1) {  
                              res1.data.data.map((data) => {
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
                                  episodesList: data.episodesList
                                  // there is more options such as animeJapaneseTitle, studio.

                                 })
                                
                              })
                              
                              
                          })
                      
                      
                        })
                        .catch(function(err) {
                          console.log(err)
                        })
                        
                      }
                    }
                  >
                    <Image source={{uri: data.uri}} style={styles.poster} />
                    <Text numberOfLines={2} style={styles.posterText}>{data.animeName}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>
      <FAB placement="right"
       color="#0367fc"
        style={styles.FAB}
        icon={{name: 'search', color: 'white'}}
        onPress={() => navigate.navigate('search')}/>
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
    marginLeft: 10,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  posterCotainer: {
    display: "flex",
    flexWrap: "wrap",
    marginRight: Dimensions.get('window').width / 100e1,
    alignItems: "center",
    width: 140,
    height: 210,
    marginTop: Dimensions.get('window').height / 46,
    paddingBottom: 30,
  },
  posterText: {
    marginTop: 2,
    marginRight: 30,
    marginLeft: 10,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
  },
  mapContainer: {
    height: 250,
  },
  padding: {
  },
});
