import React, {useEffect, useState} from 'react';
import TrackPlayer, { 
  Capability, 
  useProgress, 
  AppKilledPlaybackBehavior,
  RepeatMode,
  Event,
  useTrackPlayerEvents
} from 'react-native-track-player';
import {
  StyleSheet, 
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';

import Slider from '@react-native-community/slider';

const tracks = []
// const tracks = [
//   {
//     id: 1,
//     url: {uri:'file:///storage/emulated/0/Music/Bon Jovi - You Give Love A Bad Name.mp3'},
//     // require('../tracks/AintNoRest.mp3'),
//     title: 'Cage The Elephant - Aint No Rest For The Wicked',
//     // artwork: 'http://192.168.0.6/gear.png'
//     artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg'
//   },
//   {
//     id: 2,
//     url: require('../tracks/WarThunder.mp3'),
//     title: 'War Thunder',
//     artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg'
//   },
//   {
//     id: 3,
//     url: require('../tracks/DeepPurple.mp3'),
//     title: 'Deep Purple - Smoke on the Water',
//     // artwork: 'https://www.bensound.com/bensound-img/happyrock.jpg'
//   },
// ];

const MusicPlayer = () => {
  const [isTrackPlayerInit, setIsTrackPlayerInit] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const {position, duration} = useProgress(250);//250
  
  const [isRepeatMode, setRepeatMode] = useState('Off');
  const [repeatTintColor, setRepeatTintColor] = useState('black');
  
  const [nowTrackArtwork, setNowTrackArtwork] = useState('');
  const [nowTrackTitle, setNowTrackTitle] = useState('Выберите файл');
  const [nowTrackArtist, setNowTrackArtist] = useState('');
  const [nowTrackDuration, setNowTrackDuration] = useState('');

  const slidingStarted = () => {
  setIsSeeking(true);
  };

  const slidingCompleted = async (value) => {
    await TrackPlayer.seekTo(value * duration);
    setSliderValue(value);
    setIsSeeking(false);
  };
  
  useEffect(() => {
    if (!isSeeking && position && duration) {
      setSliderValue(position / duration);
      // console.log(sliderValue); //test
    }
  }, [position, duration]);

  const btnPlayPause = (nextTrack) => {
    if (!isPlaying || nextTrack) {
      TrackPlayer.play();
      setIsPlaying(true);
    } else {
      TrackPlayer.pause();
      setIsPlaying(false);
    }
  };

  const setUpTrackPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add(tracks);
      // console.log('Tracks added',tracks);
      await TrackPlayer.updateOptions({
        autoHandleInterruptions: true,
        androidAudioContentType: true,
        android: {
          appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification
        },
        capabilities: [
          Capability.Pause,
          Capability.Play,
          Capability.SkipToPrevious,
          Capability.SkipToNext,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        notificationCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        // Obviously, color property would not work if artwork is specified. It can be used as a fallback.
        color: 99410543
      });
    } catch (e) {
      console.log(e);
    }
    return(true)
  };

  useEffect(() => {
    const startPlayer = async () => {
       let isInit =  await setUpTrackPlayer();
       setIsTrackPlayerInit(isInit);
    }
    if (!isTrackPlayerInit)
      startPlayer();
  }, []);

  const events = [
    Event.PlaybackActiveTrackChanged,
    // Event.PlaybackQueueEnded
  ];


  useTrackPlayerEvents(events, (event) => {
    if (event.type === Event.PlaybackActiveTrackChanged) {
      const takeNowTrackMeta = async () =>{
        try {let trackMeta = await TrackPlayer.getActiveTrack();
          setNowTrackTitle(trackMeta['title'])
          setNowTrackArtwork(trackMeta['cover'])
          setNowTrackArtist(trackMeta['artist'])
          setNowTrackDuration(trackMeta['duration'])
          
        }
        catch (e) {
          console.log(e);
        }
      }
      takeNowTrackMeta();
    }
  });

  return (
    <View style={styles.container}>
      <Image
        style={[styles.trackImage,
          {transform:(nowTrackArtwork === '' || nowTrackArtwork === undefined)?
            ([{ scaleX: 0.4}, { scaleY: 0.4}]
            ):(
            [{ scaleX: 1 }, { scaleY: 1 }])
          }
        ]}
        source={
          (nowTrackArtwork === '' || nowTrackArtwork === undefined)? (
            require('../src/icon/note_music.png')
          ):(
            {uri:nowTrackArtwork}
          )
          
        }
        resizeMode='cover'
      />
      <View style={styles.infoAndControlView}>
        <View style={styles.infoView}>
          <Text style={[styles.textInfoDuration,{left:10}]}>
            {String((Math.floor(position/60)+(position/60%1*(6/10))).toFixed(2)).replace('.', ':')}
          </Text>
          <Text style={[styles.textInfoDuration,{right:10}]}>
            {String((Math.floor(nowTrackDuration/60000)+(nowTrackDuration/60000%1*(6/10))).toFixed(2)).replace('.', ':')}
          </Text>
          <Text style={styles.textInfoTitle}>
            {nowTrackTitle}
          </Text>
          <Text style={styles.textInfoArtist}>
            {nowTrackArtist}
          </Text>
        </View>
        <View style={styles.controlView}>

        <TouchableOpacity
          style={[styles.btnTouchableOpacity, styles.smallBtnTouchableOpacity]}
          onPress={() => (
            (isRepeatMode === 'Off') ? (
              TrackPlayer.setRepeatMode(RepeatMode.Queue),
              setRepeatMode('Queue'),
              setRepeatTintColor('tomato')
              ):(
              (isRepeatMode === 'Queue') ? (
                TrackPlayer.setRepeatMode(RepeatMode.Track),
                setRepeatMode('Track'),
                setRepeatTintColor('tomato')
              ):(
                TrackPlayer.setRepeatMode(RepeatMode.Off),
                setRepeatMode('Off'),
                setRepeatTintColor('black')
            )))
            }>
              
          <Image
          style={styles.btnImage}
          source={
            (isRepeatMode === 'Off' || isRepeatMode === 'Queue')?(
              require('../src/icon/sync.png')
            ):(
              require('../src/icon/sync1.png')
            )
          }
          tintColor={repeatTintColor}
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnTouchableOpacity}
          onPress={() => (
            (sliderValue < 0.1) ? (
              TrackPlayer.skipToPrevious(),
              setSliderValue(0)
            ):(
              setSliderValue(0),
              TrackPlayer.seekTo(0)
            ),
            btnPlayPause(true))}
          >
          
          <Image
          style={[styles.btnImage,{transform: [{rotate: '180deg'}]}]}
          source={require('../src/icon/fast-forward.png')}
          tintColor={'black'}
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnTouchableOpacity,{padding:0}]}
          onPress={() => btnPlayPause()}>

          <Image 
          style={styles.btnImage}
          source={isPlaying ? 
            (require('../src/icon/pause.png')):
            (require('../src/icon/play.png'))
          }
          // source={isPlaying ? 
          //   (require('../src/icon/pause.png')):
          //   (require('../src/icon/play.png'))
          // }
          tintColor={'black'}
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnTouchableOpacity}
          onPress={() => (
            TrackPlayer.skipToNext(),
            setSliderValue(0),
            btnPlayPause(true)
            )}>

          <Image
          style={styles.btnImage}
          source={require('../src/icon/fast-forward.png')
          }
          tintColor={'black'}
          />

        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnTouchableOpacity, styles.smallBtnTouchableOpacity]}
          onPress={() => (
              // test1(),
              console.log('1')
            )}>

          <Image
          style={styles.btnImage}
          source={require('../src/icon/list.png')
          }
          tintColor={'black'}
          />

        </TouchableOpacity>

        </View>
      </View>
      <Slider
        style={styles.trackScroll}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        minimumTrackTintColor='black'//До точки
        maximumTrackTintColor='gray' //После точки
        thumbTintColor= 'tomato' //точка
        onSlidingStart={slidingStarted}
        onSlidingComplete={slidingCompleted}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f5f5dc'
  },
  trackImage:{
    flex:1,
    width:'100%'
  },
  trackScroll:{
    width: '80%', 
    height: 10,
    position:'absolute',
    top:'50%',
    transform: [{ scaleX: 1.35 }, { scaleY: 1.35 }],
    paddingBottom:6
  },

  infoAndControlView: {
    flex:1,
    width:'100%',
    justifyContent: 'center',
    alignItems:'center'
  },
  infoView: {
    flex:0.5,
    width:'100%',
    justifyContent: 'center',
    alignItems:'center'
  },
  textInfoTitle: {
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
    marginTop:'30%'
  },
  textInfoArtist: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
  textInfoDuration: {
    fontSize: 11,
    color: 'gray',
    textAlign: 'center',
    position:'absolute',
    top:12
  },

  controlView: {
    flexDirection: 'row',
    alignItems:'center',
    flex:0.5
  },
  btnTouchableOpacity: {
    backfaceVisibility:'hidden',
    margin: 6,
    height: 80,
    width: 80,
    justifyContent: 'center',
    alignItems:'center'
  },
  smallBtnTouchableOpacity:{
    height: 50,
    width: 50,
  },
  btnImage: {
    width:'60%',
    height:'60%',
    resizeMode:'contain',
  },
  
});

export default MusicPlayer;