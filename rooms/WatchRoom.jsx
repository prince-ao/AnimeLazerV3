
import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Button,
  Platform,
  BackHandler,
  Alert,
  StatusBar,
  
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

const { width, height } = Dimensions.get("window");

const WatchRoom = ({ navigation, route, truthy }) => {
  const videoUrl = route.params.src;
  const [buttonTitle, setButtonTitle] = useState("Download");
  const [progressValue, setProgressValue] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const videoRef = useRef();
  const [status, setStatus] = useState({});
  const title = route.params.title
  
  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }
  async function changeToPortrait() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
  }

  // console.log("title: " + title)
  // console.log("src: " + videoUrl)


  const [star, setStar] = useState(false);

  useEffect(() => {
    StatusBar.setHidden(true)
    const backAction = async() => {
      await changeToPortrait()
      navigation.goBack()
      return true;
    };

    BackHandler.addEventListener('hardwareBackPress', backAction);

  }, []);

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
    setIsDownloading(true);
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
      setIsDownloading(false);
      console.log("Finished downloading to ", uri);
      setButtonTitle("Downloaded");
    } catch (e) {
      setIsDownloading(false)
      console.error(e);
    }
  }
  // const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
  //   switch (fullscreenUpdate) {
  //     case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
  //       await ScreenOrientation.unlockAsync(); // only on Android required
  //       break;
  //     case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
  //       await ScreenOrientation.lockAsync(
  //         ScreenOrientation.OrientationLock.PORTRAIT
  //       ); // only on Android required
  //       break;
  //   }
  // };
  const showVideoInFullscreen = async () => {
    await videoRef.current.presentFullscreenPlayer();
  };

  const playVideo = async() => {
    await videoRef.current.playAsync()
  }

  const pauseVideo = async() => {
    await videoRef.current.pauseAsync()
  }

  return (
    <>
      <SafeAreaView
        style={{
          flex: 0,
          backgroundColor: "#000",
        }}
      />
      <View style={styles(truthy).container}>
        <Text
        numberOfLines={2}
        ellipsizeMode="tail"
          style={{
            color: "white",
            fontSize: 20,
            marginTop: height / 200,
            marginBottom: 30,
          }}
        >
          {title}
            
        </Text>
        {Platform.OS === "android" ? (
          <Video
            style={styles(truthy).video}
            ref={videoRef}
            source={{ uri: videoUrl,
                      headers:{
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
                        "Referer" : "https://goload.one"
                      },
                  }}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls={true}
            shouldPlay={false}
            usePoster={true}
            onError={(err) => console.log(err)}
            onReadyForDisplay={async(param) => {
              await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
            }}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        ) : (
          <Video
            ref={video}
            source={{ uri: videoUrl, headers:{"Referer" : "https://goload.one"}, overrideFileExtensionAndroid: 'm3u8' }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay={true}
            isLooping={false}
            onReadyForDisplay={async(param) => {
              await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT)
            }}
            useNativeControls={true}
            style={styles(truthy).video}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
        )}
        <TouchableOpacity
          onPress={() => {
            status.isPlaying
            ? videoRef.current.pauseAsync() 
            : videoRef.current.playAsync()
          }}
          style={{ position: "absolute", top: height / 2.4, left: width / 2.2 }}
        >
          <Ionicons
            name={status.isPlaying ? "" : "play"}
            size={55}
            color="#fff"
          />
        </TouchableOpacity>
         {/* <TouchableOpacity onPress={() => console.log(status.getStatusAsync)}>
          <Ionicons name="play-forward" size={35} color="#527ef5" />
        </TouchableOpacity> */}
        <View style={styles(truthy).back}>
          <Ionicons
            onPress={async() => {
              await changeToPortrait()
              navigation.goBack()
            }}
            name="chevron-back-sharp"
            size={35}
            color="#5c94dd"
          />
        </View>
        <Button title={buttonTitle} onPress={downloadVideo}></Button>
        {isDownloading ? (
          <>
            <Text style={{ color: "white" }}> Size: {totalSize} </Text>
            <Text style={{ color: "white" }}>Progress: {progressValue} %</Text>
          </>
        ) : null}
      </View>
    </>
  );
};

export default WatchRoom;

const styles = (truthy) =>
  StyleSheet.create({
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
      backgroundColor: truthy ? "#000" : "#eeeeee",
      alignItems: "center",
      justifyContent: "center",
    },
  });
























// import React, { useState, useRef } from 'react';
// import { StyleSheet, View, Platform, Button, NativeModules, Dimensions} from 'react-native';
// import * as ScreenOrientation from 'expo-screen-orientation'
// import Video from 'react-native-video'


// const { width, height } = Dimensions.get("window");


// const WatchRoom = ({navigation, route, truthy}) => {
//     const video = React.useRef(null);
//     const [status, setStatus] = React.useState({});
//     const videoUrl = route.params.src;

//     const videoRef = useRef();

//   //   const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
//   //     switch (fullscreenUpdate) {
//   //       case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
//   //         await ScreenOrientation.unlockAsync(); // only on Android required
//   //         break;
//   //       case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
//   //         await ScreenOrientation.lockAsync(
//   //           ScreenOrientation.OrientationLock.PORTRAIT
//   //         ); // only on Android required
//   //         break;
//   //   }
//   // };
//   console.log('src: ' + videoUrl)
//   // const showVideoInFullscreen = async () => {
//   //   await videoRef.current.presentFullscreenPlayer();
//   // };
//     return (
//         <>
//         {
//             (Platform.OS === 'android') ? (
//               <Video
//                 style={styles(truthy).video}
//                 ref={videoRef}
//                 source={{ uri: "http://techslides.com/demos/sample-videos/small.mp4"}}
//                 useNativeControls={true}
//                 shouldPlay={true}
//                 onReadyForDisplay={params => {
//                   params.naturalSize.orientation = "landscape"
//               }}
//               />

//             ) : (
//               <Video
//               ref={video}
//               style={{backgroundColor: '#000',alignSelf: 'center'}}
//               source={{
//               uri: `${route.params.src}`,
//               }}
//               resizeMode={ResizeMode.CONTAIN}
//               useNativeControls={true}
//               fullscreenUpdate={onFullscreenUpdate}
//               onReadyForDisplay={params => {
//                   params.naturalSize.orientation = "landscape"
//               }}
//               onPlaybackStatusUpdate={status => setStatus(() => status)}
//           />

//             )
//         }
//         </>
//     );
// }
// const styles = (truthy) =>
//   StyleSheet.create({
//     video: {
//       width: width,
//       height: height / 2.5,
//     },
//     back: {
//       position: "absolute",
//       padding: 10,
//       left: 20,
//       top: 10,
//     },

//     container: {
//       flex: 1,
//       backgroundColor: truthy ? "#000" : "#eeeeee",
//       alignItems: "center",
//       justifyContent: "center",
//     },
//   });


// export default WatchRoom;











