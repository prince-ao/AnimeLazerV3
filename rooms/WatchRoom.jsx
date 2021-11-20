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
	ActivityIndicator,
	StatusBarIOS,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import * as FileSystem from "expo-file-system";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";

const { width, height } = Dimensions.get("window");

const WatchRoom = ({ navigation, route, truthy }) => {
	const videoUrl = route.params.src;
	const referer = route.params.referer;
	const [buttonTitle, setButtonTitle] = useState("Download");
	const [progressValue, setProgressValue] = useState(0);
	const [isDownloading, setIsDownloading] = useState(false);
	const [totalSize, setTotalSize] = useState(0);
	const [showTitle, setShowTitle] = useState(true);
	const [orientation, setOrientation] = useState(true);
	const videoRef = useRef();
	const [status, setStatus] = useState({});
	const title = route.params.title;
	useEffect(() => {
		setTimeout(() => {
			setShowTitle(false);
		}, 5000);
		setShowTitle(true);
	}, []);

	async function changeScreenOrientation() {
		await ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
		);
	}
	async function changeToPortrait() {
		await ScreenOrientation.lockAsync(
			ScreenOrientation.OrientationLock.PORTRAIT_UP
		);
	}

	// console.log("title: " + title)
	// console.log("src: " + videoUrl)

	const [star, setStar] = useState(false);

	useEffect(() => {
		StatusBar.setHidden(true);
		const backAction = async () => {
			await changeToPortrait();
			navigation.goBack();
			return true;
		};

		BackHandler.addEventListener("hardwareBackPress", backAction);
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
			setIsDownloading(false);
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

	const playVideo = async () => {
		await videoRef.current.playAsync();
	};

	const pauseVideo = async () => {
		await videoRef.current.pauseAsync();
	};
	return (
		<View style={styles(truthy).container}>
			{Platform.OS === "android" ? (
				<>
					<Video
						style={styles(truthy).video}
						ref={videoRef}
						source={{
							uri: videoUrl,
							headers: {
								"User-Agent":
									"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36",
								Referer: referer,
							},
						}}
						resizeMode={ResizeMode.STRETCH}
						shouldPlay={false}
						usePoster={false}
						isLooping={false}
						isMuted={false}
						useNativeControls={true}
						onError={(err) => console.log(err)}
						onReadyForDisplay={async (param) => {
							await ScreenOrientation.lockAsync(
								ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
							);
							param.naturalSize.height = 200;
							param.naturalSize.width = 200;
						}}
						onPlaybackStatusUpdate={(status) => {
							setStatus(() => status);
							//console.log(status.positionMillis);
						}}
					/>
					{/*
          I commented it out because it was buffering eternally and it is not nessesary.
          <ActivityIndicator
            animating={status.isBuffering ? true : false}
            style={styles().loading}
            size={60}
            color="red"
          />*/}
					{/*<TouchableOpacity
            onPress={() => {
              status.isPlaying
                ? videoRef.current.pauseAsync()
                : videoRef.current.playAsync();
            }}
            style={{ position: "absolute" }}
          >
            <Ionicons
              name={status.isPlaying ? "pause" : "play"}
              size={55}
              color="#fff"
            />
          </TouchableOpacity>*/}
				</>
			) : (
				<Video
					ref={videoRef}
					source={{
						uri: videoUrl,
						headers: { Referer: "https://goload.one" },
					}}
					rate={1.0}
					volume={1.0}
					isMuted={false}
					onPress={() => console.log("pressed")}
					resizeMode={ResizeMode.CONTAIN}
					shouldPlay={true}
					isLooping={false}
					onReadyForDisplay={async (param) => {
						await ScreenOrientation.lockAsync(
							ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
						);
					}}
					useNativeControls={true}
					style={styles(truthy).video}
					onPlaybackStatusUpdate={(status) => {
						setStatus(() => status);
						//console.log(status);
					}}
				/>
			)}
			{showTitle ? (
				<Text
					numberOfLines={2}
					ellipsizeMode="tail"
					style={{
						position: "absolute",
						fontSize: 20,
						color: "black",
						padding: 10,
						left: width / 2,
						top: height / 20,
						fontWeight: "bold",
						backgroundColor: "#ffffff",
					}}>
					{title}
				</Text>
			) : null}
			{/* <TouchableOpacity onPress={() => console.log(status.getStatusAsync)}>
          <Ionicons name="play-forward" size={35} color="#527ef5" />
        </TouchableOpacity> */}
			<View style={styles(truthy).back}>
				<Ionicons
					onPress={async () => {
						await changeToPortrait();
						navigation.goBack();
					}}
					name="chevron-back-sharp"
					size={45}
					color="#689ee6"
				/>
			</View>
			<View style={styles().rotation}>
				<MaterialIcons
					onPress={async () => {
						setOrientation(!orientation);
						if (orientation) {
							changeToPortrait();
						} else {
							changeScreenOrientation();
						}
					}}
					name="screen-rotation"
					size={45}
					color="#689ee6"
				/>
			</View>
			{/* <Button title={buttonTitle} onPress={downloadVideo}></Button>
        {isDownloading ? (
          <>
            <Text style={{ color: "white" }}> Size: {totalSize} </Text>
            <Text style={{ color: "white" }}>Progress: {progressValue} %</Text>
          </>
        ) : null} */}
		</View>
	);
};

export default WatchRoom;

const styles = (truthy) =>
	StyleSheet.create({
		video: {
			width: "100%",
			height: "100%",
		},
		back: {
			position: "absolute",
			padding: 10,
			left: 20,
			top: 10,
			marginLeft: 50,
			borderRadius: 10,
			backgroundColor: "#0000008d",
		},

		container: {
			flex: 1,
			backgroundColor: truthy ? "#000" : "#eeeeee",
			alignItems: "center",
			justifyContent: "center",
		},
		loading: {
			position: "absolute",
			top: height / 2.3,
			right: width / 2.43,
			width: width / 5.3,
			height: height / 7.8,
			alignItems: "center",
			justifyContent: "center",
			borderRadius: 8,
		},
		rotation: {
			backgroundColor: "#0000008d",
			borderRadius: 10,
			position: "absolute",
			padding: 10,
			left: 20,
			top: 10,
			marginLeft: 120,
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
