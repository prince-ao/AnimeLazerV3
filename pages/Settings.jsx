import React, { useState, useEffect } from "react";
import { Header } from "../components/index";
import {
	StyleSheet,
	Text,
	SafeAreaView,
	StatusBar,
	ScrollView,
	View,
	Switch,
	TouchableOpacity,
	Linking,
	Share,
	Dimensions,
} from "react-native";
import {
	Ionicons,
	AntDesign,
	MaterialCommunityIcons,
	FontAwesome5,
	Foundation,
} from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({ truth, truthSet }) => {
	const [isEnabled, setIsEnabled] = useState(true);
	const [appearance, setApearance] = useState("Dark");
	const onRend = async () => {
		let lightOp;
		try {
			lightOp = await AsyncStorage.getItem("lightOp");
			if (lightOp === "true") {
				setIsEnabled(false);
				setApearance("Light");
				truthSet(false);
			} else if (lightOp === "false") {
				setIsEnabled(true);
				setApearance("Dark");
				truthSet(true);
			} else {
				setIsEnabled(true);
				setApearance("Dark");
				truthSet(true);
			}
		} finally {
			// if (Boolean(lightOp)) {
			//   console.log("in here");
			//   setIsEnabled(Boolean(lightOp));
			//   setApearance(!Boolean(lightOp) ? "Light" : "Dark");
			//   truthSet(Boolean(lightOp));
			// } else {
			//   console.log("error");
			//   setIsEnabled(true);
			//   setApearance("Dark");
			// }
		}
	};
	useEffect(() => {
		onRend();
	}, []);
	const handleChange = async () => {
		try {
			await AsyncStorage.setItem("lightOp", String(truth));
			setIsEnabled(!truth);
			setApearance(truth ? "Light" : "Dark");
			truthSet(!truth);
		} catch (e) {
			console.log(e);
		}
	};
	const onShare = async () => {
		try {
			const result = await Share.share({
				message: "TODO",
			});
		} catch (error) {
			alert(error.message);
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
			<SafeAreaView
				style={{
					backgroundColor: truth ? "#1a1a1a" : "#f0f0f0",
					height: "100%",
				}}>
				<StatusBar barStyle="light-content" />
				<Header />
				<ScrollView>
					<View style={styles.settingCont}>
						<Ionicons
							name={isEnabled ? "moon" : "moon-outline"}
							size={25}
							color="#bdbdbd"
							style={styles.settingIcon}
						/>
						<Text style={styles.settingText}>Appearance: {appearance}</Text>
						<Switch
							trackColor={{ false: "#cccccc", true: "#221fce" }}
							thumbColor={isEnabled ? "#cecece" : "#221fce"}
							ios_backgroundColor="#b8b8b8"
							value={isEnabled}
							onValueChange={() => {
								handleChange();
							}}
							style={styles.settingSwitch}
						/>
					</View>
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							backgroundColor: "#4d4d4d",
							heigth: "100%",
							marginLeft: width / 13,
							marginRight: width / 13,
							marginTop: height / 23,
							borderRadius: 5,
						}}>
						<View style={{ paddingBottom: 10 }} />
						<TouchableOpacity
							style={{ ...styles.settingCont2, maringTop: 20 }}
							onPress={() =>
								Linking.openURL("mailto:animelazers@gmail.com?subject=Support&body=Hi,")
							}>
							<AntDesign
								name="mail"
								size={27}
								color="white"
								style={{ marginLeft: 20 }}
							/>
							<Text
								style={{
									marginLeft: 20,
									fontSize: 15,
									alignSelf: "center",
									color: "white",
								}}>
								Contact Us
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ ...styles.settingCont2, marginTop: 20 }}>
							<MaterialCommunityIcons
								name="shield-lock"
								size={27}
								color="#bdbdbd"
								style={{ marginLeft: 20 }}
							/>
							<Text
								style={{
									marginLeft: 20,
									fontSize: 15,
									alignSelf: "center",
									color: "white",
								}}>
								Privacy Policy
							</Text>
						</TouchableOpacity>
						<TouchableOpacity style={{ ...styles.settingCont2, marginTop: 20 }}>
							<AntDesign
								name="questioncircle"
								size={23}
								color="#bdbdbd"
								style={{ marginLeft: 20 }}
							/>
							<Text
								style={{
									marginLeft: 20,
									fontSize: 15,
									alignSelf: "center",
									color: "white",
								}}>
								FAQ
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.settingCont2, marginTop: 20 }}
							onPress={() =>
								Linking.openURL(
									"mailto:animelazer@gmail.com?subject=Rate&body=I would give this app a "
								)
							}>
							<AntDesign
								name="star"
								size={26}
								color="gold"
								style={{ marginLeft: 20 }}
							/>
							<Text
								style={{
									marginLeft: 20,
									fontSize: 15,
									alignSelf: "center",
									color: "white",
								}}>
								Rate us
							</Text>
						</TouchableOpacity>
						<View style={{ paddingBottom: 10 }} />
					</View>
					<TouchableOpacity style={styles.settingCont} onPress={onShare}>
						<FontAwesome5
							name="user-friends"
							size={22}
							color="#bdbdbd"
							style={{ marginLeft: 20 }}
						/>
						<Text
							style={{
								marginLeft: 20,
								fontSize: 15,
								alignSelf: "center",
								color: "white",
							}}>
							Suggest to Friends
						</Text>
					</TouchableOpacity>
					<View
						style={{
							display: "flex",
							flexDirection: "column",
							backgroundColor: "#4d4d4d",
							heigth: "100%",
							marginLeft: width / 13,
							marginRight: width / 13,
							marginTop: height / 23,
							borderRadius: 5,
						}}>
						<TouchableOpacity
							style={{ ...styles.settingCont2, marginTop: 20 }}
							onPress={() => Linking.openURL("https://www.instagram.com/animelazer_")}>
							<AntDesign
								name="instagram"
								size={24}
								color="#bc2a8d"
								style={{ marginLeft: 20 }}
							/>
							<Text
								style={{
									marginLeft: 20,
									fontSize: 15,
									alignSelf: "center",
									color: "white",
								}}>
								Follow us on Instagram
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={{ ...styles.settingCont2, marginTop: 20 }}
							onPress={() => Linking.openURL("https://twitter.com/lazer_anime")}>
							<AntDesign
								name="twitter"
								size={21}
								color="#1DA1F2"
								style={{ marginLeft: 20 }}
							/>
							<Text
								style={{
									marginLeft: 20,
									fontSize: 15,
									alignSelf: "center",
									color: "white",
								}}>
								Follow us on Twitter
							</Text>
						</TouchableOpacity>
						<View style={{ paddingBottom: 20 }} />
					</View>
					<TouchableOpacity
						style={styles.settingCont}
						onPress={() => Linking.openURL("https://anime-lazer.herokuapp.com/")}>
						<Foundation
							name="web"
							size={25}
							color="#1DA1F2"
							style={{ marginLeft: 20 }}
						/>
						<Text
							style={{
								marginLeft: 20,
								fontSize: 15,
								alignSelf: "center",
								color: "white",
							}}>
							Anime Lazer Website
						</Text>
					</TouchableOpacity>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

export default Settings;

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#1a1a1a",
		height: "100%",
	},
	settingCont: {
		backgroundColor: "#4d4d4d",
		display: "flex",
		flexDirection: "row",
		marginLeft: width / 13,
		marginRight: width / 13,
		borderRadius: 5,
		marginTop: height / 22,
		height: 40,
		alignItems: "center",
	},
	settingCont2: {
		display: "flex",
		flexDirection: "row",
		width: "100%",
	},
	settingText: {
		color: "white",
		marginLeft: width / 17,
	},
	settingIcon: {
		marginLeft: width / 18,
	},
	settingSwitch: {
		marginLeft: width / 4.2,
	},
});
