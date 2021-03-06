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
	Modal,
} from "react-native";
import { Header } from "../components/index";
import { key, url } from "@env";

const axios = require("axios");
const API = {
	id: "_" + Math.random().toString(36).substr(2, 9),
	url: url,
	key: key + " ",
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
	const [onGoing, setOnGoing] = useState([]);
	// const [refreshing, setRefreshing] = useState(false);
	// const [refresh, setRefresh] = useState("");

	// const wait = (timeout) => {
	//   return new Promise((resolve) => setTimeout(resolve, timeout));
	// };

	// const onRefresh = useCallback(() => {
	//   setRefreshing(true);
	//   wait(2000).then(() => {
	//     setRefresh(`${Math.random() * 1000000}`);
	//     setRefreshing(false);
	//   });
	// }, []);

	useEffect(() => {
		getRecentEp();
		getActionAnimes();
		getFictionAnimes();
		getSchoolAnimes();
		getMonstersAnimes();
		getTopRatedAnimes();
		getOnGoingAnime();
	}, []);
	// const newRes = async() => {
	//   const res = await newAPI.get('')
	//   console.log(res.data)
	// }

	function getOnGoingAnime() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/onGoingAnime`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `${API.key}${res.data.token}`,
						},
					})
					.then(async function (res1) {
						setIsLoading(false);
						setOnGoing(res1.data.data);
					});
			})
			.catch(function (err) {
				setIsLoading(false);
				console.log(err);
			});
	}

	function getActionAnimes() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/actionAnimes`, {
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

	function getMonstersAnimes() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/monstersAnimes`, {
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

	function getFictionAnimes() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/fictionAnimes`, {
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

	function getTopRatedAnimes() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/topRatedAnimes`, {
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

	function getSchoolAnimes() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/schoolAnimes`, {
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

	function getRecentEp() {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/recentEpisodes`, {
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

	function handleAnime(data) {
		setIsLoading(true);
		axios
			.get(`${API.url}AnimeLazer/Login`, {
				headers: {
					"Content-Type": "application/json",
					id: API.id,
				},
			})
			.then(async function (res) {
				axios
					.get(`${API.url}Animes/scrapeAnimeDetails`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: `${API.key}${res.data.token}`,
							url: data.animeUrl,
						},
					})
					.then(async function (res1) {
						if ((await AsyncStorage.getItem("accessToken")) == null) {
							try {
								let animeList = await fetch(`${API.url}favorites/find`, {
									method: "GET",
									headers: {
										uid: firebase.auth().currentUser.uid,
									},
								});
								animeList = await animeList.json();
								setIsLoading(false);
								res1.data.data.map((info) => {
									navigate.navigate("EpisodeRoom", {
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
										accessToken: null,
										animeList: animeList,
										// there is more options such as animeJapaneseTitle, studio.
									});
								});
							} catch (err) {
								setIsLoading(false);
								console.log(err);
							}
						} else {
							AsyncStorage.getItem("accessToken").then(async function (token) {
								axios
									.get(
										`${BASE_URL}users/@me/animelist?fields=list_status&limit=1000&sort=list_score`,
										{
											headers: {
												Authorization: `${API.key}${token}`,
											},
										}
									)
									.then(async function (animeList) {
										setIsLoading(false);
										res1.data.data.map((info) => {
											navigate.navigate("EpisodeRoom", {
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
												animeList: animeList.data.data,
												// there is more options such as animeJapaneseTitle, studio.
											});
										});
									})
									.catch((err) => {
										setIsLoading(false);
										console.log(err);
									});
							});
						}
					});
			})
			.catch(function (err) {
				setIsLoading(false);
				console.log(err);
			});
	}

	function handleEpisode(data) {
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
						setTimeout(() => {
							setIsLoading(false);
						}, 2000);
						navigate.navigate("WatchRoom", {
							title: data.animeName + " Ep " + data.epNum,
							src: res1.data.data,
						});
					});
			})
			.catch(function (err) {
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
				}}>
				<StatusBar barStyle="light-content" />
				<Header />
				<ScrollView overScrollMode="never">
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
																	src: data.animeUrl,
																},
															})
															.then(async function (res1) {
																setTimeout(() => {
																	setIsLoading(false);
																}, 2000);
																navigate.navigate("WatchRoom", {
																	title: data.animeName + " Ep " + data.epNum,
																	src: res1.data.data.m3u8,
																	referer: res1.data.data.referer,
																});
															});
													})
													.catch(function (err) {
														setTimeout(() => {
															setIsLoading(false);
														}, 2000);
														console.log(err);
													});
											}}>
											<Image source={{ uri: data.uri }} style={styles(truth).poster} />
											<Text numberOfLines={2} style={styles(truth).posterText}>
												{data.animeName}
											</Text>
											<Text style={styles(truth).epText}>Episode {data.epNum}</Text>
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
													.get(`${API.url}AnimeLazer/Login`, {
														headers: {
															"Content-Type": "application/json",
															id: API.id,
														},
													})
													.then(async function (res) {
														axios
															.get(`${API.url}Animes/scrapeAnimeDetails`, {
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `${API.key}${res.data.token}`,
																	url: data.animeUrl,
																},
															})
															.then(async function (res1) {
																res1.data.data.map((info) => {
																	setTimeout(() => {
																		setIsLoading(false);
																	}, 2000);
																	navigate.navigate("EpisodeRoom", {
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
																		// there is more options such as animeJapaneseTitle, studio.
																	});
																});
															});
													})
													.catch(function (err) {
														setTimeout(() => {
															setIsLoading(false);
														}, 2000);
														console.log(err);
													});
											}}>
											<Image
												source={{ uri: data.animeImg }}
												style={styles(truth).poster}
											/>
											<Text numberOfLines={2} style={styles(truth).posterText}>
												{data.animeTitle}
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
													.get(`${API.url}AnimeLazer/Login`, {
														headers: {
															"Content-Type": "application/json",
															id: API.id,
														},
													})
													.then(async function (res) {
														axios
															.get(`${API.url}Animes/scrapeAnimeDetails`, {
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `${API.key}${res.data.token}`,
																	url: data.animeUrl,
																},
															})
															.then(async function (res1) {
																res1.data.data.map((info) => {
																	setTimeout(() => {
																		setIsLoading(false);
																	}, 2000);
																	navigate.navigate("EpisodeRoom", {
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
																		// there is more options such as animeJapaneseTitle, studio.
																	});
																});
															});
													})
													.catch(function (err) {
														setIsLoading(false);
														console.log(err);
													});
											}}>
											<Image
												source={{ uri: data.animeImg }}
												style={styles(truth).poster}
											/>
											<Text numberOfLines={2} style={styles(truth).posterText}>
												{data.animeTitle}
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
													.get(`${API.url}AnimeLazer/Login`, {
														headers: {
															"Content-Type": "application/json",
															id: API.id,
														},
													})
													.then(async function (res) {
														axios
															.get(`${API.url}Animes/scrapeAnimeDetails`, {
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `${API.key}${res.data.token}`,
																	url: data.animeUrl,
																},
															})
															.then(async function (res1) {
																res1.data.data.map((info) => {
																	setTimeout(() => {
																		setIsLoading(false);
																	}, 2000);
																	navigate.navigate("EpisodeRoom", {
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
																		// there is more options such as animeJapaneseTitle, studio.
																	});
																});
															});
													})
													.catch(function (err) {
														setTimeout(() => {
															setIsLoading(false);
														}, 2000);
														console.log(err);
													});
											}}>
											<Image
												source={{ uri: data.animeImg }}
												style={styles(truth).poster}
											/>
											<Text numberOfLines={2} style={styles(truth).posterText}>
												{data.animeTitle}
											</Text>
										</TouchableOpacity>
									</View>
								);
							})}
						</ScrollView>
					</View>
					<View style={styles(truth).shows}>
						<Text style={styles(truth).showText}>Horror</Text>
						<ScrollView horizontal style={styles(truth).mapContainer}>
							{monsters.map((data, key) => {
								return (
									<View style={styles(truth).posterCotainer} key={key}>
										<TouchableOpacity
											onPress={() => {
												setIsLoading(true);
												axios
													.get(`${API.url}AnimeLazer/Login`, {
														headers: {
															"Content-Type": "application/json",
															id: API.id,
														},
													})
													.then(async function (res) {
														axios
															.get(`${API.url}Animes/scrapeAnimeDetails`, {
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `${API.key}${res.data.token}`,
																	url: data.animeUrl,
																},
															})
															.then(async function (res1) {
																res1.data.data.map((info) => {
																	setTimeout(() => {
																		setIsLoading(false);
																	}, 2000);
																	navigate.navigate("EpisodeRoom", {
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
																		// there is more options such as animeJapaneseTitle, studio.
																	});
																});
															});
													})
													.catch(function (err) {
														setTimeout(() => {
															setIsLoading(false);
														}, 2000);
														console.log(err);
													});
											}}>
											<Image
												source={{ uri: data.animeImg }}
												style={styles(truth).poster}
											/>
											<Text numberOfLines={2} style={styles(truth).posterText}>
												{data.animeTitle}
											</Text>
										</TouchableOpacity>
									</View>
								);
							})}
						</ScrollView>
					</View>
					<View style={styles(truth).shows}>
						<Text style={styles(truth).showText}>Popular</Text>
						<ScrollView horizontal style={styles(truth).mapContainer}>
							{topRated.map((data, key) => {
								return (
									<View style={styles(truth).posterCotainer} key={key}>
										<TouchableOpacity
											onPress={() => {
												setIsLoading(true);
												axios
													.get(`${API.url}AnimeLazer/Login`, {
														headers: {
															"Content-Type": "application/json",
															id: API.id,
														},
													})
													.then(async function (res) {
														axios
															.get(`${API.url}Animes/scrapeAnimeDetails`, {
																headers: {
																	"Content-Type": "application/json",
																	Authorization: `${API.key}${res.data.token}`,
																	url: data.animeUrl,
																},
															})
															.then(async function (res1) {
																res1.data.data.map((info) => {
																	setTimeout(() => {
																		setIsLoading(false);
																	}, 2000);
																	navigate.navigate("EpisodeRoom", {
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
																		// there is more options such as animeJapaneseTitle, studio.
																	});
																});
															});
													})
													.catch(function (err) {
														setTimeout(() => {
															setIsLoading(false);
														}, 2000);
														console.log(err);
													});
											}}>
											<Image
												source={{ uri: data.animeImg }}
												style={styles(truth).poster}
											/>
											<Text numberOfLines={2} style={styles(truth).posterText}>
												{data.animeTitle}
											</Text>
										</TouchableOpacity>
									</View>
								);
							})}
						</ScrollView>
					</View>
					<View style={styles(truth).shows}>
						<Text style={styles(truth).showText}>Top Airing</Text>
						{onGoing.map((data, key) => {
							return (
								<View key={key}>
									<TouchableOpacity
										style={styles(truth).topAiringView}
										onPress={() => {
											console.log(data.animeUrl);
											setIsLoading(true);
											axios
												.get(`${API.url}AnimeLazer/Login`, {
													headers: {
														"Content-Type": "application/json",
														id: API.id,
													},
												})
												.then(async function (res) {
													axios
														.get(`${API.url}Animes/scrapeAnimeDetails`, {
															headers: {
																"Content-Type": "application/json",
																Authorization: `${API.key}${res.data.token}`,
																url: data.animeUrl,
															},
														})
														.then(async function (res1) {
															res1.data.data.map((info) => {
																setTimeout(() => {
																	setIsLoading(false);
																}, 2000);
																navigate.navigate("EpisodeRoom", {
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
																	// there is more options such as animeJapaneseTitle, studio.
																});
															});
														});
												})
												.catch(function (err) {
													setTimeout(() => {
														setIsLoading(false);
													}, 2000);
													console.log(err);
												});
										}}>
										<Image
											style={styles(truth).imageView}
											source={{ uri: data.animeImg }}
										/>
										<View style={styles(truth).infoView}>
											<Text
												style={styles(truth).boldText}
												numberOfLines={2}
												ellipsizeMode="tail">
												{data.animeTitle}
											</Text>
											<View style={styles(truth).genreView}>
												{data.genreList.map((data, key) => {
													return (
														<Text style={styles(truth).genreText} key={key}>
															{data.Genre}
														</Text>
													);
												})}
											</View>
											<Text style={{ top: 10, color: "white" }}>
												Latest: <Text style={{ color: "gray" }}>{data.latestEp}</Text>
											</Text>
										</View>
									</TouchableOpacity>
								</View>
							);
						})}
					</View>
				</ScrollView>
				{isLoading ? (
					<Modal style={{}}>
						<Image
							source={require("../assets/cute-anime-dancing.gif")}
							style={{
								width: Dimensions.get("window").width,
								height: Dimensions.get("window").height,
								paddingTop: 100,
							}}
						/>
						<ActivityIndicator
							animating={isLoading}
							color="#d5e6ff"
							style={styles(truth, isLoading).loading}
							size={Platform.OS === "android" ? 51 : "large"}
						/>
					</Modal>
				) : null}
				{/*
        <ActivityIndicator
          animating={isLoading}
          color="#d5e6ff"
          style={styles(truth, isLoading).loading}
          size={Platform.OS === "android" ? 51 : "large"}
        />*/}
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
			marginTop: 20,
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
		epText: {
			marginLeft: 10,
			paddingTop: 6,
			paddingLeft: 6,
			paddingRight: 6,
			paddingBottom: 6,
			fontWeight: "bold",
			color: truth ? "#e6e6e6eb" : "#222222",
			position: "absolute",
			backgroundColor: "rgba(52, 52, 52, 0.6)",
			borderRadius: 10,
			textAlign: "center",
		},
		genreText: {
			color: "white",
			fontSize: 11,
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
		genreView: {
			top: 10,
			alignItems: "flex-start",
			alignContent: "flex-start",
			flexWrap: "wrap",
			flexDirection: "row",
			alignSelf: "flex-start",
			position: "relative",
		},
		boldText: {
			fontSize: 17,
			marginTop: 2,
			marginRight: Dimensions.get("window").width / 120,
			fontWeight: "bold",
			color: truth ? "#dddddd" : "#1b1b1b",
		},
		infoView: {
			flexDirection: "column",
			width: Dimensions.get("window").width / 1.6,
			height: 210,
		},
		imageView: {
			width: 130,
			height: 150,
			marginRight: 15,
			borderRadius: 6,
			resizeMode: "cover",
		},
		topAiringView: {
			display: "flex",
			flexWrap: "wrap",
			marginRight: Dimensions.get("window").width / 100e1,
			alignItems: "center",
			width: Dimensions.get("window").width / 0.1,
			height: Dimensions.get("window").height / 4.9,
			marginTop: Dimensions.get("window").height / 100,
		},
	});
};
