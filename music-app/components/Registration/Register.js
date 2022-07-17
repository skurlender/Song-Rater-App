import React, { useState, useEffect} from "react";
import { Text, View, Button, TextInput, StyleSheet } from "react-native";
import Login from '../Login/Login'

export default function Register() {

  const [userlst, setUserlst] = useState([]);

  const [ok, setOk] = useState(true);

  const [mess, setMess] = useState('');

  const [user, setUser] = useState('');

  const [pass, setPass] = useState('');

  
    useEffect(() => {
      fetch("https://cs-hw-backend.herokuapp.com/api/users/")
      .then((resp) => resp.json())
      .then((json) => setUserlst(json))
      .catch((error) => console.error(error))
      .finally(() => setOk(false));
    }, []);


    const checkuser = () => {
        
        var k;
        for (k = 0; k < userlst.length; ++k) {
            if (userlst[k].username === user){
                console.log('not allowed bc user exists')
                return(setMess('user already exists'))
            }
        }
    
        if (mess === '') {
            console.log('ADDING USER')
            fetch('https://cs-hw-backend.herokuapp.com/api/users/', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                username: user,
                password: pass
              })
            });
            console.log('navigating out to music.js')
            return(setMess('navigate'))
        }
    }

    const renderRegistration = () => {
      let printme = mess
        return(
          <View>
            <Text>{printme}</Text>
            <Text style = {styles.title}>Register</Text>
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
          </View>
        )
    }

    if (mess !== 'navigate') {
      return(
        <View style={styles.container}>
        {/* As long as isLoading is true, show "Loading ..." */}
        {ok ? (
        <Text>Loading...</Text>
        ) : (
          // Once it is false, show the fetched data.
          renderRegistration()
  
          )}
      </View>
      );
    } else{
      return(<Login/>)
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
    color: "#000000",
    textAlign: "center",
  }
});