import React from "react";
import { TouchableOpacity, Text, Image, StyleSheet, View } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import { COLORS, FONTS, SIZES } from "../constants";

const AreaCard = ({sharedElementPrefix, category, containerStyle, onPress}) => {
  return (
    <TouchableOpacity style={{height: 150, width: 200, ...containerStyle}} onPress={onPress}>
      <SharedElement
        id={`${sharedElementPrefix}-CategoryCard-Bg-${category?.id}`}
        style={[StyleSheet.absoluteFillObject]}
      >
        <Image source={category?.thumbnail} resizeMode="cover" style={{width: "100%", height: "100%", borderRadius: SIZES.radius}}/>
      </SharedElement>

      <SharedElement
        id={`${sharedElementPrefix}-CategoryCard-Title-${category?.id}`}
        style={[StyleSheet.absoluteFillObject]}
      >
        <View style={{position: "absolute", bottom: 50, left: 10}}>
          <Text style={{color: COLORS.white, position: "absolute", ...FONTS.h2}}>{category?.title}</Text>
        </View>
      </SharedElement>
    </TouchableOpacity>
  )
}

export default AreaCard;
