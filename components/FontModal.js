import React, { useState } from "react";
import {View, Text, TouchableOpacity, Image, FlatList} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle, withDelay,
    withTiming,
} from "react-native-reanimated";
import {COLORS, FONTS, SIZES, constants} from "../constants";
import TextButton from "./TextButton";
import {useDispatch, useSelector} from "react-redux";
import FontSettingsAPI from "../api/v1/font-settings";
import ColorPicker from "react-native-wheel-color-picker";

const FontTypeOption = ({containerStyle, classType, isSelected, onPress}) => {
    return (
        <TouchableOpacity
            style={{
                flex: 1,
                height: 100,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: SIZES.radius,
                borderRadius: SIZES.radius,
                backgroundColor: isSelected ? COLORS.primary3 : COLORS.additionalColor9,
                ...containerStyle
            }}
            onPress={() => onPress(classType, isSelected)}
        >
            <Image source={classType.icon} resizeMode={"contain"} style={{width: 40, height: 40, tintColor: isSelected ? COLORS.white : COLORS.gray80}} />
            <Text style={{marginTop: SIZES.base, color: isSelected ? COLORS.white : COLORS.gray80, ...FONTS.h3}} >{classType.label}</Text>
        </TouchableOpacity>
    )
}

const FontModal = ({sharedValue1, sharedValue2}) => {

    const dispatch = useDispatch()
    const fontSettings = useSelector(state => state.reducer.fontSettings)
    const [colorMode, setColorMode] = useState("text")

    const onFontTypeOptionPress = (styleType, value) => {
        const tempFontSettings = {...fontSettings}
        tempFontSettings[styleType.key] = value ? styleType.value1 : styleType.value2
        FontSettingsAPI.offlineUpdate(tempFontSettings, dispatch)
    }

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sharedValue1.value, [SIZES.height, 0], [0, 1]),
            transform: [ { translateY: sharedValue1.value } ]
        }
    })

    const bgAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sharedValue2.value, [SIZES.height, 0], [0, 1])
        }
    })

    const contentAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sharedValue2.value, [SIZES.height, 0], [0, 1]),
            transform: [ { translateY: sharedValue2.value } ]
        }
    })
    return (
        // Main container
        <Animated.View style={[{
            position: "absolute",
            bottom: 0,
            height: SIZES.height,
            width: SIZES.width
        }, containerAnimatedStyle]}>
            <Animated.View style={[{
                flex: 1,
                height: SIZES.height,
                width: SIZES.width,
                backgroundColor: COLORS.transparentBlack7
            }, bgAnimatedStyle]}>
                <Animated.View
                    style={[{
                        position: "absolute",
                        bottom: 0,
                        height: SIZES.height * 0.9,
                        width: SIZES.width,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        backgroundColor: COLORS.white
                    }, contentAnimatedStyle]}
                >
                    <View style={{marginTop: SIZES.padding, flexDirection: "row", paddingHorizontal: SIZES.padding}}>
                        <View style={{width: 60}} />
                        <Text style={{flex: 1, textAlign: "center", ...FONTS.h1}}>
                            Fonte
                        </Text>
                        <TextButton
                            label={"Fechar"}
                            contentContainerStyle={{
                                width: 60,
                                backgroundColor: null
                            }}
                            labelStyle={{
                                color: COLORS.black,
                                ...FONTS.body3
                            }}
                            onPress={() => {
                                sharedValue2.value = withTiming(SIZES.height, { duration: 500})
                                sharedValue1.value = withDelay(500, withTiming(SIZES.height, { duration: 100 }))
                            }}
                        />
                    </View>
                    <View>
                        <FlatList contentContainerStyle={{marginTop: 20}} data={constants.font_families} horizontal={true} showsHorizontalScrollIndicator={false} renderItem={({item, index}) => {
                            return (
                                <TouchableOpacity style={{
                                    backgroundColor: fontSettings.fontFamily === item.font ? COLORS.primary3 : COLORS.additionalColor9,
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    marginLeft: index === 0 ? SIZES.padding : SIZES.base,
                                    marginRight: index === constants.font_families.length - 1 ? SIZES.padding : 0,
                                    borderRadius: SIZES.base,
                                }}
                                    onPress={() => {
                                        const tempFontSettings = {...fontSettings}
                                        tempFontSettings.fontFamily = item.font
                                        FontSettingsAPI.offlineUpdate(tempFontSettings, dispatch)
                                    }}
                                >
                                    <Text style={{fontFamily: item.font, color: fontSettings.fontFamily === item.font ? COLORS.white : COLORS.gray80}}>{item.font}</Text>
                                </TouchableOpacity>
                            )
                        }}/>
                    </View>
                    <View style={{flexDirection: "row", marginTop: 10, paddingHorizontal: SIZES.padding}}>
                        {constants.class_types.map((item, index) => {
                                return (
                                    <FontTypeOption
                                        key={`ClassType-${index}`}
                                        classType={item}
                                        isSelected={fontSettings[item.key] !== "normal"}
                                        onPress={onFontTypeOptionPress}
                                        containerStyle={{marginLeft: index === 0 ? 0 : SIZES.base}}
                                    />
                                )
                            }
                        )}
                    </View>
                    <View style={{marginTop: 10, paddingHorizontal: SIZES.padding, height: 260}}>
                        <View style={{flexDirection: "row"}}>

                                        <TouchableOpacity
                                            style={{
                                                flex: 1,
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                paddingHorizontal: SIZES.radius,
                                                borderTopLeftRadius: SIZES.base,
                                                borderBottomLeftRadius: SIZES.base,
                                                backgroundColor: COLORS.additionalColor9,
                                                paddingVertical: 5
                                            }}
                                            onPress={() => setColorMode("text")}
                                        >
                                            <Text style={{color: COLORS.gray80, ...FONTS.h3}} >Cor do texto</Text>
                                        </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: SIZES.radius,
                                    borderTopRightRadius: SIZES.base,
                                    borderBottomRightRadius: SIZES.base,
                                    backgroundColor: COLORS.additionalColor9,
                                    paddingVertical: 5
                                }}
                                onPress={() => setColorMode("background")}
                            >
                                <Text style={{color: COLORS.gray80, ...FONTS.h3}} >Cor do fundo</Text>
                            </TouchableOpacity>

                        </View>
                        <ColorPicker color={colorMode === "text" ? fontSettings.color : fontSettings.backgroundColor} onColorChangeComplete={(color) => {
                            const tempFontSettings = {...fontSettings}
                            if (colorMode === "text") {
                                tempFontSettings.color = color
                            } else {
                                tempFontSettings.backgroundColor = color
                            }
                            FontSettingsAPI.offlineUpdate(tempFontSettings, dispatch)
                        }}
                         swatchesLast={false} discrete={true} swatches={false} thumbSize={25}/>
                    </View>
                    <View>
                        <FlatList
                                  contentContainerStyle={{marginTop: 20}}
                                  data={constants.font_sizes}
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}
                                  renderItem={({item, index}) => {
                            return (
                                <TouchableOpacity style={{
                                    backgroundColor: COLORS.additionalColor9,
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    marginLeft: index === 0 ? SIZES.padding : SIZES.base,
                                    marginRight: index === constants.font_sizes.length - 1 ? SIZES.padding : 0,
                                    borderRadius: SIZES.base,
                                }}
                                    onPress={() => {
                                        const tempFontSettings = {...fontSettings}
                                        tempFontSettings.fontSize = item
                                        tempFontSettings.lineHeight = item
                                        FontSettingsAPI.offlineUpdate(tempFontSettings, dispatch)
                                    }}
                                >
                                    <Text style={{color: COLORS.gray80, ...FONTS.h2}}>{item}</Text>
                                </TouchableOpacity>
                            )
                        }}/>
                    </View>
                    <View style={{
                        marginTop: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        height: 70,
                        borderRadius: SIZES.radius,
                        marginHorizontal: SIZES.padding,
                        backgroundColor: fontSettings.backgroundColor,
                    }}>
                        <Text style={{
                            fontFamily: fontSettings.fontFamily,
                            color: fontSettings.color,
                            fontSize: fontSettings.fontSize,
                            fontWeight: fontSettings.fontWeight,
                            fontStyle: fontSettings.fontStyle
                        }}>Demonstração</Text>
                    </View>
                </Animated.View>
            </Animated.View>
        </Animated.View>
    )
}

export default FontModal;

