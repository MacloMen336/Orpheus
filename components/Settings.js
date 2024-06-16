import React, {useEffect, useState} from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
} from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";

//npm install axios --save
import axios from "axios";

const Settings = () =>{
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const [isSubmit, setisSubmit] = useState(false);

    useEffect(()=>{
        const authenticate = async() =>{
            axios
            .post("http://192.168.0.6/include/registration.php", //"http://localhost/include/registration.php"
                JSON.stringify({
                    email: email,
                    password: password,
                    username: username,
                })
            )
            .then((response)=>{
                console.log(response.data.result) //test
                setisSubmit(false);
            }).catch((err) =>{
                console.log(err);
            })
        }
        if (isSubmit) authenticate();
    },[isSubmit])

    const usernameHandler = (text) => {
        setUsername(text);
    };

    return(
        <View style={styles.container}>
            <TextInput 
                placeholder="Логин"
                style={styles.input}
                onChangeText={usernameHandler}
            />
            <TextInput 
                placeholder="Email" 
                style={styles.input}
                autoCapitalize="none"
                keyboardType='email-address'
                onChangeText={(text) =>setEmail(text)}
            />
            <TextInput 
                placeholder="Пароль"
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="newPassword"
                secureTextEntry
                value={password}
                enablesReturnKeyAutomatically
                onChangeText={(text) =>setPassword(text)}
            />
            <View style={styles.buttonContainer}>
                <Button 
                    title="Зарегистрироваться"
                    onPress={()=>setisSubmit(true)}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5dc',
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        padding:'15%'
    },
    input: {
        paddingVertical:'4%',
        borderBottomColor:'black',
        borderBottomWidth: 1,
        textAlign:'left',
        padding: 5
    },
    buttonContainer: {
        marginTop:20,
    }
})
export default Settings;