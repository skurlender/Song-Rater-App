import React from 'react'
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import Login from "./components/Login/Login"
import Register from './components/Registration/Register';
import Music from './components/Music/Music'


export default function App() {
  return (
    <NavigationContainer>
      <Login />
      {/* <Test /> */}
    </NavigationContainer>
  );
}