import React from 'react';
import {
  View,
  Text,
  Image, ImageBackground, StatusBar,
} from "react-native";

import TextButton from "../../components/TextButton";
import { COLORS, FONTS, SIZES, images } from '../../constants';

const img_bg = require("../../assets/images/welcome-bg.png")

const Welcome = ({ navigation }) => {
  return (
    <ImageBackground
      source={img_bg}
      style={{
        flex: 1,
        backgroundColor: "#f5f5f5"
      }}
    >
      <StatusBar backgroundColor={"#DDF4EA"} barStyle={"dark-content"}/>
      {/* Logo & Title */}
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Image
          source={images.learning_welcome}
          resizeMode={"contain"}
          style={{width: 300, height: 300, alignItems: "center", marginTop: -120}}
        />

        <Text style={{ marginTop: SIZES.padding, ...FONTS.h1 }}>
          Bem-vindo(a) ao
        </Text>
        <Text style={{ marginTop: SIZES.base, ...FONTS.h1 }}>
          Direito Digital
        </Text>
      </View>

      {/* Footer Buttons */}
      <View
        style={{
          paddingHorizontal: SIZES.padding,
          marginBottom: 30
        }}
      >
        <TextButton
          contentContainerStyle={{
            height: 50,
            borderRadius: SIZES.radius
          }}
          label="Começa Já"
          onPress={() => navigation.navigate("Register")}
        />

        <TextButton
          contentContainerStyle={{
            height: 50,
            marginTop: SIZES.base,
            backgroundColor: COLORS.primary3,
            borderRadius: SIZES.radius,
          }}
          label="Já tenho uma conta"
          labelStyle={{
            color: COLORS.white
          }}
          //onPress
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </ImageBackground>
  )
}

export default Welcome;
