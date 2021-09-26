// import React in our code
import React, {useState, useRef} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

//Import React Native Video to play video
import Video from 'react-native-video';

//Media Controls to control Play/Pause/Seek and full screen
import
  MediaControls, {PLAYER_STATES}
from 'react-native-media-controls';

const WatchRoom = () => {
  const videoPlayer = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paused, setPaused] = useState(false);
  const [
    playerState, setPlayerState
  ] = useState(PLAYER_STATES.PLAYING);
  const [screenType, setScreenType] = useState('content');

  const onSeek = (seek) => {
    //Handler for change in seekbar
    videoPlayer.current.seek(seek);
  };

  const onPaused = (playerState) => {
    //Handler for Video Pause
    setPaused(!paused);
    setPlayerState(playerState);
  };

  const onReplay = () => {
    //Handler for Replay
    setPlayerState(PLAYER_STATES.PLAYING);
    videoPlayer.current.seek(0);
  };

  const onProgress = (data) => {
    // Video Player will progress continue even if it ends
    if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
      setCurrentTime(data.currentTime);
    }
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setIsLoading(false);
  };

  const onLoadStart = (data) => setIsLoading(true);

  const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

  const onError = () => alert('Oh! ', error);

  const exitFullScreen = () => {
    alert('Exit full screen');
  };

  const enterFullScreen = () => {};

  const onFullScreen = () => {
    setIsFullScreen(isFullScreen);
    if (screenType == 'content') setScreenType('cover');
    else setScreenType('content');
  };

  const renderToolbar = () => (
    <View>
      <Text style={styles.toolbar}> toolbar </Text>
    </View>
  );

  const onSeeking = (currentTime) => setCurrentTime(currentTime);

  return (
    <View style={{flex: 1}}>
      <Video
        onEnd={onEnd}
        onLoad={onLoad}
        onLoadStart={onLoadStart}
        onProgress={onProgress}
        paused={paused}
        ref={videoPlayer}
        resizeMode={screenType}
        onFullScreen={isFullScreen}
        source={{
          uri:
            'https://assets.mixkit.co/videos/download/mixkit-countryside-meadow-4075.mp4',
        }}
        style={styles.mediaPlayer}
        volume={10}
      />
      <MediaControls
        duration={duration}
        isLoading={isLoading}
        mainColor="#333"
        onFullScreen={onFullScreen}
        onPaused={onPaused}
        onReplay={onReplay}
        onSeek={onSeek}
        onSeeking={onSeeking}
        playerState={playerState}
        progress={currentTime}
        toolbar={renderToolbar()}
      />
    </View>
  );
};

export default WatchRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
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