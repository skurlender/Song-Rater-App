import React, { useState, useEffect} from "react";
import { Text, View, Button, TextInput, StyleSheet, FlatList} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from 'react-native-numeric-input'




export default function Music() {
  
  const [user, setUser] = useState('');

  const [infoList, setInfoList] = useState([]);

  const [ok, setOk] = useState(true);

  const [mess, setMess] = useState('');

  const [song, setSong] = useState('');

  const [artist, setArtist] = useState('');

  const [rating, setRating] = useState(0)

  useEffect(() => {
    fetch("https://cs-hw-backend.herokuapp.com/api/info/")
    .then((resp) => resp.json())
    .then((json) => setInfoList(json))
    .catch((error) => console.error(error))
    .finally(() => setOk(false));
  }, []);

  useEffect(()=>{
    AsyncStorage
      .getItem('@user')
      .then( value => { setUser(value) }
      );
  },[]);



  const addNew = () => {
    // console.log(infoList)
    
    const filt = infoList.filter(info => info.song === song)
    // console.log(filt)

    const filtt = filt.filter(info => info.user === user)

    if (filtt.length === 1) {

      return (
        setMess('user has already added this song')
      )
    } else{
      const item = {
        id: infoList.length + 1,
        song: song,
        artist: artist,
        rating: parseInt(rating),
        user: user
      }

      var k;
      var arr = [];
      for (k = 0; k < infoList.length; ++k) {
        // console.log(data[k].id)
        arr.push(infoList[k].id)
      }

      while (arr.includes(item.id)){
        item.id = item.id + 1
      }

      console.log('this is the content we will use http POST for: ', item)

      fetch('https://cs-hw-backend.herokuapp.com/api/info/', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artist: item.artist,
          id: item.id,
          rating: item.rating,
          song: item.song,
          user: item.user
        })
      });

      return

    }
  }

  const editInfo = () => {
  
    // console.log()

    const data = infoList
    // console.log('check')

    // console.log(this.state.song)
    //check if user has already rated song
    const filt = data.filter(info => info.song === song && info.user === user)
    
    const len = filt.length
    if (len === 1){
      const item = {
        id: Object.values(filt[0])[0],
        song: song,
        artist: artist,
        rating: rating,
        user: user,
      };
      // console.log('id: '+ item.id);

      fetch(`https://cs-hw-backend.herokuapp.com/api/info/${item.id}/`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          artist: item.artist,
          id: item.id,
          rating: item.rating,
          song: item.song,
          user: item.user
        })
      });

      return(setMess(''))
    } else{
      // console.log('Already rated');
      return(
        setMess('Song has already been rated')
      )
    }
  }
  const deleteMe = () => {
    
    
    const data = infoList
    // console.log(data)

    const filt = data.filter(info => info.song === song)
    // console.log(Object.values(filt[0]));
    const filtt = filt.filter(info => info.user === user)
    const len = filtt.length
    // console.log('values: '+ Object.values(filtt[0]));

    if (len === 1){
      // console.log(typeof Object.values(filtt[0]));
      // console.log(Object.values(filtt[0])[0]);
      const rm_id = Object.values(filtt[0])[0]

      fetch(`https://cs-hw-backend.herokuapp.com/api/info/${rm_id}`, {
        method: 'DELETE'});
      return(setMess(''))

    } else {

      return(
        setMess('user has not added this song with rating. Please do so first.')
      )
    }
  }
  
  fetch("https://cs-hw-backend.herokuapp.com/api/info/")
  .then((resp) => resp.json())
  .then((json) => setInfoList(json))
  // console.log('infolist now:', infoList)
  

  let printme = mess
  const data = infoList
  let rend = []
  let spacing = " "


  // here is the code that filters the input
  // json st each song appears only once
  // and the song is the average of the ratings
  const unique = [...new Set(data.map(item => item.song))];
  // console.log('unique: '+unique)
  var k;
  for (k = 0; k < unique.length; ++k) {
    const oki = data.filter(info=> info.song === unique[k])
    // console.log('here now')
    // console.log(oki)
    var i;
    var j = 0;
    for (i = 0; i < oki.length; ++i){
      const rm_id = Object.values(oki[i])[3]
      // console.log(rm_id)
      j = j + rm_id
    }
    var avg = j / oki.length
    // console.log(avg)
    const add = {
      id: k,
      song: unique[k],
      artist: Object.values(oki[0])[2],
      rating: avg
    }
    // console.log(add)
    rend.push(add)
  }
  return(

    <View
    style={{
      backgroundColor: "#f5bf78",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}>
    {/* As long as isLoading is true, show "Loading ..." */}
    {ok ? (
    <Text>Loading...</Text>
    ) : (
      // Once it is false, show the fetched data.
      <View
      style={{
        
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}>
        <Text> {spacing} </Text>
        
        <Text> {printme} </Text>
        

        <Text style = {styles.headingText}> View your songs! </Text>
        
        <FlatList
        data={infoList}
        keyExtractor={({ id }, index) => id}
        renderItem={({ item }) => (  
        <Text>song: {item.song}, artist: {item.artist}, rating: {item.rating}</Text>
        )}
        />
        
        
        <Text style = {styles.headingText}>Add a song</Text>

        <TextInput
          style={styles.input}
          placeholder="Song Title"
          onChangeText={(text) => setSong(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Artist"
          onChangeText={(text) => setArtist(text)}
        />
        <NumericInput
          value = {rating}
          minValue = {0}
          maxValue = {5}
          onChange={value => setRating(value)}
        />
        <Button title="Add a Song" onPress={()=>{addNew()}} />

        <Text style = {styles.headingText}>Edit song rating</Text>
        <TextInput
        style={styles.input}
        placeholder="Song Title"
        onChangeText={(text) => setSong(text)}
        />
        <TextInput
        style={styles.input}
        placeholder="Artist"
        onChangeText={(text) => setArtist(text)}
        />
        <NumericInput
        value = {rating}
        minValue = {0}
        maxValue = {5}
        onChange={value => setRating(value)}
        />
        <Button title="Edit a song" onPress={()=>{editInfo()}} />


        <Text style = {styles.headingText}>Delete a song and your rating</Text>
        <TextInput
        style={styles.input}
        placeholder="Song Title"
        onChangeText={(text) => setSong(text)}
        />
        <Button title="Delete Song" onPress={()=>{deleteMe()}} />
        
        </View>
        
        )}
  </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 108,
    backgroundColor: "#f5bf78",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 5,
  },
  title: {
    // font-weight: 300,
    fontSize: 20,
    color: "#000000",
    textAlign: "center",
  },
  headingText: {
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
    // fontWeight: 'bold',
  }
});