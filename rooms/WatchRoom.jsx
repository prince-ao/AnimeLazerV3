import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Button,
  Platform,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { color } from "react-native-elements/dist/helpers";

const { width, height } = Dimensions.get("window");

const WatchRoom = ({ navigation, route }) => {
  const videoUrl = route.params.src
  const [buttonTitle, setButtonTitle] = useState("Download");
  const [progressValue, setProgressValue] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false)
  const [totalSize, setTotalSize] = useState(0);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const title = route.params.title
  const [star, setStar] = useState(false);

  // useEffect(() => {
  //   let count = 0;
  //   let title = "";
  //   let realTitle = "";
  //   for (let i = 0; i < route.params.src.config.headers.src.length; i++) {
  //     if (route.params.src.config.headers.src[i] === "/") {
  //       count++;
  //     }
  //     if (count === 4) {
  //       title += route.params.src.config.headers.src[i];
  //     }
  //   }
  //   for (let i = 0; i < title.length; i++) {
  //     if (title[i] === "/") {
  //       continue;
  //     } else if (title[i] === "-") {
  //       realTitle += " ";
  //     } else {
  //       realTitle += title[i];
  //     }
  //   }
  //   setTitle(realTitle);
  // }, []);

  const videoRef = useRef();

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // async function getVideoUrl() {
  //   let tmp = await FileSystem.getInfoAsync(FileSystem.documentDirectory + videoUrl);
  //   let url = tmp.exists ? FileSystem.documentDirectory + videoUrl : videoUrl
  //   return url
  // }

  // getVideoUrl().then((url) => {
  //   setVideoUrl(url)
  // })

  async function downloadVideo() {
    setIsDownloading(true)
    setButtonTitle("Downloading");

    const callback = (downloadProgress) => {
      setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite));

      var progress =
        downloadProgress.totalBytesWritten /
        downloadProgress.totalBytesExpectedToWrite;
      progress = progress.toFixed(2) * 100;
      setProgressValue(progress.toFixed(0));
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      FileSystem.documentDirectory + title,
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      setIsDownloading(false)
      console.log("Finished downloading to ", uri);
      setButtonTitle("Downloaded");
    } catch (e) {
      console.error(e);
    }
  }
  const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
    switch (fullscreenUpdate) {
      case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
        await ScreenOrientation.unlockAsync(); // only on Android required
        break;
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT
        ); // only on Android required
        break;
    }
  };
  const showVideoInFullscreen = async () => {
    await videoRef.current.presentFullscreenPlayer();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setStar(!star);
        }}
        style={{ position: "absolute", top: 50, right: 50 }}
      >
        <Ionicons name="star" size={25} color={star ? "#ffd700" : "#fff"} />
      </TouchableOpacity>
      <Text
        style={{
          color: "white",
          fontSize: 32,
          marginTop: -10,
          marginBottom: 30,
        }}
      >
        {title}
      </Text>
      {Platform.OS === "android" ? (
        <Video
          style={styles.video}
          ref={videoRef}
          source={{ uri: videoUrl }}
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls={true}
          onFullscreenUpdate={onFullscreenUpdate}
        />
      ) : (
        <Video
          ref={video}
          source={{ uri: videoUrl }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="cover"
          shouldPlay={false}
          isLooping={false}
          useNativeControls={true}
          style={styles.video}
          onPlaybackStatusUpdate={(status) => setStatus(() => status)}
        />
      )}
      <TouchableOpacity
        onPress={() => {
          status.isPlaying
            ? video.current.pauseAsync()
            : video.current.playAsync();
        }}
        style={{ position: "absolute", top: height / 2.4, left: width / 2.2 }}
      >
        <Ionicons
          name={status.isPlaying ? "" : "play"}
          size={55}
          color="#fff"
        />
      </TouchableOpacity>
      <View style={styles.back}>
        <Ionicons
          onPress={() => navigation.goBack()}
          name="chevron-back-sharp"
          size={35}
          color="#5c94dd"
        />
      </View>
      <Button title={buttonTitle} onPress={downloadVideo}></Button>
      {
        isDownloading ? (
          <>
        <Text style={{color: "white"}}> Size: {totalSize} </Text>
        <Text style={{color: "white"}}>Progress: {progressValue} %</Text>
        </>
        ) : (
          null
        )
      }
    </View>
  );
};

export default WatchRoom;

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height / 2.5,
  },
  back: {
    position: "absolute",
    padding: 10,
    left: 20,
    top: 10,
  },

  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
});

// import React, { useState, useRef } from 'react';
// import { StyleSheet, View, Platform, Button, NativeModules, useWindowDimensions } from 'react-native';
// import * as ScreenOrientation from 'expo-screen-orientation'
// import {ResizeMode, Video} from 'expo-av'

// const WatchRoom = ({navigation, route}) => {
//     const video = React.useRef(null);
//     const [status, setStatus] = React.useState({});

//     const window = useWindowDimensions()

//     const onFullScreenUpdate = async({fullScreenUpdate}) => {
//         switch(fullScreenUpdate) {
//             case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
//                 await ScreenOrientation.unlockAsync() // only on android requires
//                 break
//             case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
//                 await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only requires on android
//         }
//     }
//     return (
//         <>
//         {
//             (Platform.OS === 'ios') ? (
//                 <View style={{transform: [{rotate: '90deg'}]}}>
//                 <Video
//                     ref={video}
//                     style={{backgroundColor: '#000',alignSelf: 'center' ,width: window.width, height: window.height}}
//                     source={{
//                     uri: `${route.params.src}`,
//                     }}
//                     resizeMode={ResizeMode.CONTAIN}
//                     useNativeControls={true}
//                     fullscreenUpdate={onFullScreenUpdate}
//                     onReadyForDisplay={params => {
//                         params.naturalSize.orientation = "landscape"
//                     }}
//                     onPlaybackStatusUpdate={status => setStatus(() => status)}
//                 />
//                 </View>

//             ) : (
//                 <View style={styles.container}>
//                 <Video
//                     ref={video}
//                     style={styles.video}
//                     source={{
//                     uri: `${route.params.src}`,
//                     }}
//                     useNativeControls
//                     resizeMode={ResizeMode.CONTAIN}
//                     useNativeControls={true}
//                     // fullscreenUpdate={onFullScreenUpdate}
//                     onReadyForDisplay={params => {
//                         params.naturalSize.orientation = "landscape"
//                     }}
//                     onPlaybackStatusUpdate={status => setStatus(() => status)}
//                 />
//                 {/* <View style={styles.buttons}>
//                     <Button
//                     title={status.isPlaying ? 'Pause' : 'Play'}
//                     onPress={() =>
//                         status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
//                     }
//                     />
//                 </View> */}
//                 </View>

//             )
//         }
//         </>
//     );
// }
// const styles = StyleSheet.create({
//     container: {
//         // transform: [{rotate: '90deg'}],
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: '#ecf0f1',
//     },
//     video: {
//     alignSelf: 'center',
//     width: 300,
//     height: 300
//     }
// })

// export default WatchRoom;
