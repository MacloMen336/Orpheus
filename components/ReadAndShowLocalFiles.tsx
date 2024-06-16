import * as React from 'react';

import { 
  StyleSheet, 
  View, 
  Text,
  Image, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { getAll, getAlbums, searchSongs, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import { Song } from './NativeTurboSongs';

import { PERMISSIONS, requestMultiple } from 'react-native-permissions';

import TrackPlayer from 'react-native-track-player';

const tracks = [];

let ReadAndShowLocalFiles = () => {
  const [result, setResult] = React.useState<Song[]>([]);

  const hasPermissions = async () => {
     await requestMultiple([
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
      ]);
  };

  const test = async () => {

    const permissions = await hasPermissions();
    
    if (true) {
      const songsResults = await getAll({
        limit: 20,
        offset: 0,
        coverQuality: 50,
        minSongDuration: 1000,
        sortOrder: SortSongOrder.DESC,
        sortBy: SortSongFields.TITLE,
      });
      if (typeof songsResults === 'string') {
        return;
      }
      setResult(songsResults);
      // console.log(result[1]['url'])
      // console.log(result[1]['title'])

      /*const albums = await getAlbums({
        limit: 10,
        offset: 0,
        coverQuality: 50,
        artist: 'Rihanna',
        sortOrder: SortSongOrder.DESC,
        sortBy: SortSongFields.ALBUM,
      });
      console.log(albums, 'Albums[]');*/
      /*const songsResults = await searchSongs({
        limit: 10,
        offset: 0,
        coverQuality: 50,
        searchBy: 'what',
        sortOrder: SortSongOrder.DESC,
        sortBy: SortSongFields.DURATION,
      });
      console.log(songsResults, 'SongResult[]');*/
    }
  };

  React.useEffect(() => {
    test();
  }, []);

  const render = () => {
    if (result?.length === 0) {
      // return <Text>No items</Text>;
      return <ActivityIndicator size="large" color='tomato'/>
    }

    return result?.map((song, index) => (
      <View 
      key={index}
      style={styles.aboutTrackView}
      >
        <Image
          source={song.cover === "" ?(
              require('../src/icon/note_music.png')
              ):(
              {uri: song.cover}
          )}
          resizeMode="cover"
          style={styles.infoTrackImage}
        />
        <View style={styles.infoTrackView}>
          <View 
            style={{width:'70%'}}
          >
            <Text style={styles.textTrackTitle}
            onPress={()=>(
              TrackPlayer.setQueue(result),
              TrackPlayer.skip(index),
              TrackPlayer.play()
            )}
            numberOfLines={1}
            >
              {song.title}
            </Text>
          </View>
          <Text style={styles.textTrackArtist}>
            {(song.artist ==='<unknown>') ?
            (
              'Неизв. исполнетель'
            ):(
              song.artist
            )}
          </Text>
        </View>
        <View style={styles.textTrackDuration}>
          <Text>
            {String((Math.floor(song.duration/60000)+(song.duration/60000%1*(6/10))).toFixed(2)).replace('.', ':')}
          </Text>
        </View>
      </View>
    ));
    };

  return <ScrollView 
  keyboardDismissMode='on-drag'
  style={{width:'100%'}}
  >{render()}</ScrollView>;
}

const styles = StyleSheet.create({
  aboutTrackView: {
    flex: 1,
    flexDirection: 'row',
    padding:4,
    margin:4,
    borderRadius:10,
    backgroundColor:'#D3D3D3',
    alignItems: 'center'
  },
  infoTrackImage:{
    width: 50,
    height: 50,
    borderRadius:10
  },
  infoTrackView: {
    width:'100%',
    paddingHorizontal:6
  },
  textTrackTitle: {
    color: 'black',
    fontSize:14
  },
  textTrackArtist: {
    color: 'gray',
    fontSize:12
  },
  textTrackDuration: {
    position:'absolute',
    right:10
  }
});
export default ReadAndShowLocalFiles;