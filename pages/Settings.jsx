import React, { useState } from "react";
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
} from "react-native";
import {
  Ionicons,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";

const Settings = ({ truth, truthSet }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [appearance, setApearance] = useState("Dark");
  const handleChange = () => {
    truthSet(!truth);
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
        }}
      >
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
                setIsEnabled(!isEnabled);
                setApearance(isEnabled ? "Light" : "Dark");
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
              marginLeft: 30,
              marginRight: 30,
              marginTop: 40,
              borderRadius: 5,
            }}
          >
            <View style={{ paddingBottom: 10 }} />
            <TouchableOpacity
              style={{ ...styles.settingCont2, maringTop: 20 }}
              onPress={() =>
                Linking.openURL(
                  "mailto:animelazers@gmail.com?subject=Support&body=Hi,"
                )
              }
            >
              <AntDesign
                name="customerservice"
                size={27}
                color="#bdbdbd"
                style={{ marginLeft: 20 }}
              />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 15,
                  marginTop: 5,
                  color: "white",
                }}
              >
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
                  marginTop: 5,
                  color: "white",
                }}
              >
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
                  marginTop: 5,
                  color: "white",
                }}
              >
                FAQ
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.settingCont2, marginTop: 20 }}
              onPress={() =>
                Linking.openURL(
                  "mailto:animelazer@gmail.com?subject=Rate&body=I would give this app a "
                )
              }
            >
              <AntDesign
                name="star"
                size={26}
                color="#bdbdbd"
                style={{ marginLeft: 20 }}
              />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 15,
                  marginTop: 5,
                  color: "white",
                }}
              >
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
                marginTop: 5,
                color: "white",
              }}
            >
              Suggest to Friends
            </Text>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#4d4d4d",
              heigth: "100%",
              marginLeft: 30,
              marginRight: 30,
              marginTop: 40,
              borderRadius: 5,
            }}
          >
            <TouchableOpacity style={{ ...styles.settingCont2, marginTop: 20 }}>
              <AntDesign
                name="instagram"
                size={24}
                color="#bdbdbd"
                style={{ marginLeft: 20 }}
              />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 15,
                  marginTop: 5,
                  color: "white",
                }}
              >
                Follow us on Instagram
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ ...styles.settingCont2, marginTop: 20 }}
              onPress={() => Linking.openURL("https://twitter.com/lazer_anime")}
            >
              <AntDesign
                name="twitter"
                size={21}
                color="#bdbdbd"
                style={{ marginLeft: 20 }}
              />
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 15,
                  marginTop: 5,
                  color: "white",
                }}
              >
                Follow us on Twitter
              </Text>
            </TouchableOpacity>
            <View style={{ paddingBottom: 20 }} />
          </View>
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
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 5,
    marginTop: 40,
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
    marginLeft: 20,
  },
  settingIcon: {
    marginLeft: 20,
  },
  settingSwitch: {
    marginLeft: 110,
  },
});
