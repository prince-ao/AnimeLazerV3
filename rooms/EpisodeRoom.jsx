import React from "react";
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from "react-native";

const EpisodeRoom = ({ navigation }) => {
  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Go Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EpisodeRoom;

const styles = StyleSheet.create({});
