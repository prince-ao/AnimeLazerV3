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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ truth, truthSet }) => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [appearance, setApearance] = useState("Dark");
  const handleChange = () => {
    truthSet(!truth);
  };
  return (
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
      </ScrollView>
    </SafeAreaView>
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
