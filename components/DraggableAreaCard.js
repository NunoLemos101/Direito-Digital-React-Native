import React from "react";
import {TouchableOpacity, Text, Image, StyleSheet, View, Vibration} from "react-native";
import { SharedElement } from "react-navigation-shared-element";

import { COLORS, FONTS, SIZES } from "../constants";
import {OpacityDecorator} from "react-native-draggable-flatlist";

const DraggableAreaCard = ({sharedElementPrefix, category, containerStyle, onPress, drag}) => {
    return (
        <OpacityDecorator activeOpacity={0.5}>
            <TouchableOpacity style={{height: 150, width: 200, ...containerStyle}} onPress={onPress} onLongPress={() => {
                drag()
                Vibration.vibrate(100);
            }}>
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
        </OpacityDecorator>
    )
}

export default DraggableAreaCard;

