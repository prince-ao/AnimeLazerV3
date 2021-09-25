import React, { useState, useRef } from 'react';
import { StyleSheet, View, Platform, Button, NativeModules, useWindowDimensions } from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation'
import {ResizeMode, Video} from 'expo-av'

const WatchRoom = ({navigation, route}) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    
    const window = useWindowDimensions()
    

    const onFullScreenUpdate = async({fullScreenUpdate}) => {
        switch(fullScreenUpdate) {
            case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
                await ScreenOrientation.unlockAsync() // only on android requires
                break
            case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
                await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT) // only requires on android
        }
    }
    return (
        <>
        {
            (Platform.OS === 'ios') ? (
                <View style={{transform: [{rotate: '90deg'}]}}>
                <Video
                    ref={video}
                    style={{backgroundColor: '#000',alignSelf: 'center' ,width: window.width, height: window.height}}
                    source={{
                    uri: `${route.params.src}`,
                    }}
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls={true}
                    fullscreenUpdate={onFullScreenUpdate}
                    onReadyForDisplay={params => {
                        params.naturalSize.orientation = "landscape"
                    }}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                </View>

            ) : (
                <View style={styles.container}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                    uri: `${route.params.src}`,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls={true}
                    // fullscreenUpdate={onFullScreenUpdate}
                    onReadyForDisplay={params => {
                        params.naturalSize.orientation = "landscape"
                    }}
                    onPlaybackStatusUpdate={status => setStatus(() => status)}
                />
                {/* <View style={styles.buttons}>
                    <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                    />
                </View> */}
                </View>

            )
        }
        </>
    );
}
const styles = StyleSheet.create({
    container: {
        // transform: [{rotate: '90deg'}],
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
    },
    video: {
    alignSelf: 'center',
    width: 300,
    height: 300
    }
})

    

export default WatchRoom;