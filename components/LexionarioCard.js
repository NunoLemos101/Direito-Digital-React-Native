import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { animations, COLORS, FONTS, icons, SIZES } from "../constants";
import React, { useState } from "react";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const LexionarioCard = ({containerStyle, category, themeColor="#42C6A5"}) => {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const onPress = () => navigation.navigate("LexionarioDetails", { selectedCategory: category });

    return (
        <TouchableOpacity activeOpacity={0.5} onPressIn={() => setLoading(true)} onPressOut={() => setLoading(false)} onPress={onPress} style={{flexDirection: "row", ...containerStyle}}>
            <ImageBackground
                resizeMode="cover"
                imageStyle={{ borderRadius: SIZES.radius }}
                source={category.thumbnail}
                style={{
                    width: 130,
                    height: 130,
                    marginBottom: SIZES.radius,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                { loading && <LottieView style={{width: 130, height: 130}} source={animations.loadingAnimation} autoPlay loop />}
            </ImageBackground>

            <View style={{flex: 1, marginLeft: 15}}>
                <Text style={{...FONTS.h3, fontSize: 18, color: COLORS.gray50}}>{category.title}</Text>
                <Text>{category.article_count}</Text>
                <Text>Ultima atualização</Text>
                <Text style={{color: themeColor, ...FONTS.h3}}>{category.last_edited}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default LexionarioCard;
