import React from "react";
import { StyleSheet, View, SafeAreaView, Image } from "react-native";

const Header = () => {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image style={styles.logo} source={require("../assets/Logo.png")} />
      </View>
    </SafeAreaView>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 30,
  },
});
