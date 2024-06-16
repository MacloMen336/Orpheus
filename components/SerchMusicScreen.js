import React, {useEffect, useState} from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';
import {
    StyleSheet, 
    View, 
    TouchableOpacity, 
    Text,
    ScrollView,
    ActivityIndicator,
    Image
} from 'react-native';
import axios from 'axios';

import { serverUrl } from './const/const.js';
import ReadAndShowLocalFiles from './ReadAndShowLocalFiles.tsx';
// import MusicPlayer from './MusicPlayeer.js';
import ReadAndShowServerFiles from './ReadAndShowServerFiles.js';

const SearchMusicScreen = () => {
    const [selectedMusicStyle, setMusicStyle] = useState('');
    const [styleList, setStyleList]=useState([]);
    const [loaded, setLoaded] = useState(false); //false для работы с сервером
    const [loadedIsFail, setLoadedIsFail] = useState(false);
    //["Рок"], ["Хип-хоп"], ["Поп"], ["EDM"], ["Кантри"], ["Фолк-музыка"], ["Регги"], ["Фанк"], ["Диско"], ["Новая волна"]
    const [musicPathServer, setMusicPathServer] = useState(false)
    
    const takeMusicStyle = async() =>{
        axios
        // .get("http://192.168.0.6/include/get_music_style_list.php") //"http://localhost/include/registration.php"
        .get(serverUrl+'include/get_music_style_list.php')
        .then((response)=>{
            response.data.map(value =>(
                styleList.push(value)
            ))
            // console.log('VALUES',styleList); //test
            // console.log(response.data); //test 
            setLoaded(true)
        }).catch((err) =>{
            setLoadedIsFail(true);
            console.log(err);
        })
    }
    if (styleList.length === 0 && !loadedIsFail){
        takeMusicStyle()
    }
    return (
        <View style={styles.mainView}>
            <View style={styles.selectMusicPathView}>
                <TouchableOpacity 
                    style={styles.btnChangeMusicPath}
                    onPress={() =>(
                        setMusicPathServer(!musicPathServer)
                    )}
                >
                    <Image
                        style={styles.btnChangeMusicPathImage}
                        resizeMode='cover'
                        source={(musicPathServer ?
                            require('../src/icon/cloud.png')
                            :
                            require('../src/icon/storagefile.png')
                        )
                        }
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.musicListView}>
                {musicPathServer ? (
                    <ReadAndShowServerFiles/>
                ):(
                    <ReadAndShowLocalFiles style={styles.localMusicListRender}/>
                )}
                
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
  mainView:{
    flex:1
  },
  selectMusicPathView:{
    backgroundColor:'#f5f5dc',
    width:'100%',
    flex:0.08,
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnChangeMusicPath:{
    backgroundColor:'#dcdcf5',
    width:50,
    height:50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:20,
    margin:10
  },
  btnChangeMusicPathImage: {
    width:30,
    height:30,
  },

  musicListView: {
    flex:0.92
  },
  serverLoadDataView: {
    alignItems:'center'
  }
});

export default SearchMusicScreen;