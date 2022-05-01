import React from "react";
import { Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import { COLORS, SIZES } from "../../constants";
import { useDispatch } from "react-redux";
import RestAuthAPI from "../../api/v1/rest-auth";

const NetworkError = () => {

  const dispatch = useDispatch()

  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
      <Text>NetworkError</Text>
      <TouchableRipple
        onPress={() => console.log('Pressed')}
        rippleColor="rgba(0, 0, 0, .32)"
        style={{backgroundColor: COLORS.primary, padding: 10, borderRadius: SIZES.base}}
        onPress={() => RestAuthAPI.autoSignIn(dispatch)}
      >
        <Text>Try Again</Text>
      </TouchableRipple>
    </View>
  )
}

export default NetworkError;
