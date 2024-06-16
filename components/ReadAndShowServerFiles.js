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

const ReadAndShowServerFiles = () => {
    const [selectedMusicStyle, setMusicStyle] = useState('');
    const [styleList, setStyleList]=useState([]);
    const [loaded, setLoaded] = useState(false); //false для работы с сервером
    const [loadedIsFail, setLoadedIsFail] = useState(false);
    //["Рок"], ["Хип-хоп"], ["Поп"], ["EDM"], ["Кантри"], ["Фолк-музыка"], ["Регги"], ["Фанк"], ["Диско"], ["Новая волна"]
   
    //http://192.168.0.6/takeAudioMetaData.php
    //"http://192.168.0.6/include/get_music_style_list.php"
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
        <ScrollView>
        {loaded ? (
        <View style={styles.loadedFromServerMusicView}>
            <View style={styles.musicStyleView}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // Не работает без данных от сервера
                // style={[styles.musicStyleView, {flex:1, backgroundColor:'#f5f5dc', padding:4}]}
            >
            {styleList.map(value => (
                <TouchableOpacity 
                key={value}
                style={styles.btnMusicStyle} 
                onPress={() =>  (
                    setMusicStyle(value),
                    console.log(value)
                )}
                >
                <Text style={{fontSize:14, color:'white'}}>
                    {value}
                </Text>
                </TouchableOpacity>
            ))}
            </ScrollView>
            </View>
        
        {/* Отрисовку загруженных файлов сюда */}

        </View>
        ):(
        <View style={styles.serverLoadDataView}>
            {loadedIsFail ? (
                <View>
                    <Text>Не удалось подключиться</Text>
                    <TouchableOpacity 
                        style={[
                            styles.btnChangeMusicPath
                            ,{width:200
                                ,margin:0
                            }
                        ]}
                        onPress={() =>(
                            takeMusicStyle(),
                            setLoadedIsFail(false)
                        )}
                    >
                        <Image
                            style={styles.btnChangeMusicPathImage}
                            resizeMode='cover'
                            source={
                                require('../src/icon/sync.png')
                            }
                        />
                    </TouchableOpacity>
                </View>
            ):(
                <ActivityIndicator size="large" color='tomato' style={styles.loadIndicator}/>
            )}
        </View>
        )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  musicListView: {
    flex:0.92
  },
  serverLoadDataView: {
    alignItems:'center'
  },

  loadedFromServerMusicView: {
    alignItems: 'center',
  },
  musicStyleView: {
    height: 40,
    width:'100%',
  },
  btnMusicStyle:{
    backgroundColor: 'gray',
    borderRadius:20,
    paddingHorizontal:10,
    marginVertical:2,
    marginHorizontal:4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  localMusicListRender:{
    width:'100%',
    backgroundColor:'#f5f5dc'
  }
});

export default ReadAndShowServerFiles;