import * as React from 'react';
import { 
  StyleSheet, 
  Text, 
  Image, 
  StatusBar,
  // PermissionsAndroid
} from 'react-native';
//npm i @react-navigation/native
import { NavigationContainer } from '@react-navigation/native';
//npm i @react-navigation/bottom-tabs
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SearchMusicScreen from './components/SerchMusicScreen.js';
import RegistrationScreen  from './components/Registration.js'
import MusicPlayer from './components/MusicPlayeer.js';

function HomeScreen() {
  return (
    <SearchMusicScreen/>
    // <Text>Home!</Text>
  );
}

function MyMusicScreen() {
  return (
    <MusicPlayer/>
    // <Text>Settings!</Text>
  );
}

function SettingScreen() {
  return (
    <RegistrationScreen/>
    // <Text>Account!</Text>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends React.Component{
  
  componentDidMount(){
    StatusBar.setBarStyle( 'dark-content',true) //Цвет иконок уведомлений // dark-content
    StatusBar.setBackgroundColor('#f5f5dc') //Цвет панели уведомлений
  }

  render(){
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName='Плеер'
          backBehavior = 'initialRoute'
          screenOptions={({ route }) => ({
            tabBarIcon: () => {
              let icon;
              if (route.name === 'Поиск') {
                  icon = require('./src/icon/search.png')
              } else if (
                  route.name === 'Плеер'
              ) {
                  icon = require('./src/icon/vinil.png')
              } else if (
                route.name === 'Профиль'
              ) {
                  icon = require('./src/icon/gear.png')
              }
              return (
                <Image 
                  style={styles.tabImage}
                  source={icon}
                  tintColor={'black'} //изменение цвета иконок
                  />
              );
            },
            headerShown: false,
            headerStyle:{ backgroundColor: '#f5f5dc', borderBottomWidth:0 },
            tabBarLabelStyle:{ fontSize: 12, fontFamily:'serif'},
            tabBarStyle: { backgroundColor: '#dcdcf5' }, //black white
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'black',
            tabBarActiveBackgroundColor:'#d0d0f2'
        })}
        >
          <Tab.Screen
            name="Поиск"
            component={HomeScreen}
          />
          <Tab.Screen
            name="Плеер"
            component={MyMusicScreen}
          />
          <Tab.Screen
            name="Профиль"
            component={SettingScreen}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  tabImage: {
    width:26, 
    height:26,
    resizeMode:'stretch',
    justifyContent: 'center',
    marginTop:5
  }
});


// import React from 'react';
// import { 
//   ActivityIndicator, 
//   StyleSheet, 
//   Text, 
//   View, 
//   Image, 
//   Button 
// } from 'react-native';

// // npm install react-device-detect --save
// // import { isMobile } from "react-device-detect";

// import MyTabs from './components/MyTabs.js';
// import RegistrationScreen  from './components/RegistrationScreen.js'

// function Player(){
  
// }

// export default class App extends React.Component{
//   // UNSAFE_componentWillMount() {}
//   constructor(props) {
//     super(props);
//     this.state = {
//       loaded: false

//     };
//   }

//   componentDidMount() {
//     setTimeout(() => this.setState({loaded: this.state.loaded = true}), 1000) //3000
//     // this.setState({loaded: this.state.loaded = true})
//   }
//   // UNSAFE_componentWillMount(){
//   //   this.setState({loaded: this.state.loaded = true})
//   // }

//   render(){
//     const {loaded} = this.state

//     // console.log({'Переменна!!!': loaded})
//     return(
//       <View style={styles.container}>
//         {loaded ?
//           (
//             <MyTabs/>
//           // <RegistrationScreen/>
//           // <View>
//           // <Text>{isMobile ? 'Это телефон':'Это комп'}</Text>
//           // <Button
//           //   title='#'
//           //   onPress={() => Alert.alert('Simple Button pressed')}
//           // />
//           // </View>
//           )
//           :
//           (
//           <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems: 'center'}}>
//             <Image source={require('./logo/OrpheusPlovdiv.png')} resizeMode='center' style={styles.image}/>
//             <ActivityIndicator size="large" color='#dec476' style={styles.loadIndicator}/>
//           </View>
//           )
//           }
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex:1,
//     backgroundColor: '#f5f5dc',//#7FFFD4
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   image: {
//     width:'80%',
//     height:'80%',
//     justifyContent: 'center',
//   },
//   loadIndicator:{
//     position:'absolute',
//     bottom:'2%',
//     right:'2%',
//     color:'black'
//   }
// });
