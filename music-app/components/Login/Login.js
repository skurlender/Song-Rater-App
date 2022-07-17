import React, { useState, useEffect} from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Music from '../Music/Music';
import Register from "../Registration/Register";


export default function Login() {

  const [userlst, setUserlst] = useState([]);
    
  const [ok, setOk] = useState(true);

  const [mess, setMess] = useState('');

  const [user, setUser] = useState('');

  const [pass, setPass] = useState('');
    
    useEffect(() => {
        fetch("https://cs-hw-backend.herokuapp.com/api/users/")
        // Parse the response object and extract the json response that is obtained.
        .then((resp) => resp.json())
        // Set the empty data variable to the fetched data.
        .then((json) => setUserlst(json))
        // Catch any errors thrown from the fetch call.
        .catch((error) => console.error(error))
        // While the data is loading, show the isLoading view below.
        // Once setLoading() sets isLoading to false, show the view with the
        // loaded data.
        .finally(() => setOk(false));
    }, []);

    const checkuser = () => {

      var k;
      for (k = 0; k < userlst.length; ++k) {
          // console.log(userlst[k])
          // console.log(userlst[k].username)
          if (userlst[k].username === user){
              console.log('user exists')
              if (userlst[k].password === pass) {
                console.log('pass correct');
                console.log('adding user', user)
                AsyncStorage.setItem('@user', user);
                return(setMess('navigate'))
              } 
          else {
              console.log(pass);
              return(setMess('Password incorrect for this user.'))
          }
        }
    }

    if (mess === '') {
      return(setMess('User does not exist in database.'))
    }
    }

    const oute = () => {
      return(setMess('register'))

    }



    const renderLogin = () => {
      let printme = mess
      return( 
          <View>
            <Text>{printme}</Text>
            <Text style = {styles.title}> Welcome to Share.ify</Text>
            <TextInput
            style = {styles.input}
            placeholder="Enter Username"
            onChangeText={(text) => setUser(text)}
            />
            <TextInput
            style = {styles.input}
            placeholder="Enter password"
            onChangeText={(text) => setPass(text)}
            />
            <Button title="submit" onPress={()=>{checkuser()}} />
            
            <Button title="Create New User" onPress = {() => {oute()}}/>
          </View>
      )
  }



  if (mess === 'navigate'){
    return(<Music/>);
  } else if (mess === 'register') {
    return(<Register/>);
  } else {
    return(
      <View style={styles.container}>
        {/* As long as isLoading is true, show "Loading ..." */}
        {ok ? (
        <Text>Loading...</Text>
        ) : ( 
          // Once it is false, show the fetched data.
          renderLogin()
          )}
      </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#f5bf78"
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    // font-weight: 300,
    fontSize: 40,
    color: "#1f942f",
    textAlign: "center",
  }
});

