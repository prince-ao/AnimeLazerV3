
import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Button, Platform } from 'react-native';
import { Video, ResizeMode } from 'expo-av'
import * as FileSystem from 'expo-file-system';
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from 'expo-screen-orientation';


const { width, height } = Dimensions.get('window');

const WatchRoom = ({navigation, route}) => {
  const [videoUrl, setVideoUrl] = useState(route.params.src)
  const [buttonTitle, setButtonTitle] = useState('Download')
  const [progressValue, setProgressValue] = useState(0)
  const [totalSize, setTotalSize] = useState(0)

  const videoRef = useRef()

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // async function getVideoUrl() {
  //   let tmp = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'small.mp4');
  //   let url = tmp.exists ? FileSystem.documentDirectory + 'small.mp4' : videoUrl
  //   return url
  // }

  // getVideoUrl().then((url) => {
  //   setVideoUrl(url)
  // })

  async function downloadVideo() {
    setButtonTitle('Downloading')

    const callback = downloadProgress => {
      setTotalSize(formatBytes(downloadProgress.totalBytesExpectedToWrite))

      var progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
      progress = progress.toFixed(2) * 100
      setProgressValue(progress.toFixed(0))
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      videoUrl,
      FileSystem.documentDirectory + 'small.mp4',
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', uri);
      setButtonTitle('Downloaded')
    } catch (e) {
      console.error(e);
    }


  }
  const onFullscreenUpdate = async ({fullscreenUpdate}) => {
    switch (fullscreenUpdate) {
        case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
            await ScreenOrientation.unlockAsync() // only on Android required
            break;
        case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only on Android required
            break;
    }
}
const showVideoInFullscreen = async () => { await videoRef.current.presentFullscreenPlayer() }

  return (

    <View style={styles.container}>
        {
            (Platform.OS === 'android') ? (
            <Video
            style={styles.video}
            ref={videoRef}
            source={{uri: videoUrl}}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls={true}
            onFullscreenUpdate={onFullscreenUpdate}

        />
            ) : (
                <Video
                source={{ uri: videoUrl }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                shouldPlay={false}
                isLooping={false}
                useNativeControls
                style={styles.video}
              />

            )
        
        }
      <View style={styles.back}>
            <Ionicons onPress={() => navigation.goBack()} name="chevron-back-sharp" size={35} color="#5c94dd" /> 
      </View>
      <Button title={buttonTitle} onPress={downloadVideo}></Button>
      <Text> Size: {totalSize} </Text>
      <Text>Progress: {progressValue} %</Text>
    </View>
  );
}

export default  WatchRoom

const styles = StyleSheet.create({
  video: {
    width: width,
    height: height / 3
  },
  back: {
    position: "absolute",
     padding: 10,
    left: 20,
    top: 10,
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
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