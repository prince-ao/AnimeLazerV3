import React, { useState, useRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import {Video} from 'expo-av'

const WatchRoom = ({navigation, route}) => {
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    return (
        <View style={styles.container}>
        <Video
            ref={video}
            style={styles.video}
            source={{
            uri: `${route.params.src}`,
            }}
            useNativeControls
            resizeMode="strech"
            isLooping
            
            fullscreenUpdate={Video.RESIZE_MODE_STRETCH}
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
    );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#ecf0f1',
    },
    video: {
      alignSelf: 'center',
      width: 300,
      height: 200
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
})
    

export default WatchRoom;