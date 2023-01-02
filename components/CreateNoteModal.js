import React, {useEffect, useState} from "react";
import {View, Text, TouchableOpacity, Image, FlatList, TextInput, Keyboard} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
} from "react-native-reanimated";
import {COLORS, FONTS, SIZES, constants} from "../constants";
import TextButton from "./TextButton";
import {useSelector} from "react-redux";
import ColorPicker from "react-native-wheel-color-picker";
import ArticleNotesAPI from "../api/v1/article-notes";

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

const CreateNoteModal = ({articleId, editNote, onDeleteCallback, onEditCallback, onCreateCallback, onCloseCallback, sharedValue}) => {

    const userFontSettings = useSelector(state => state.reducer.fontSettings)
    const [fontSettings, setFontSettings] = useState(editNote ? {
        color: editNote.color,
        backgroundColor: editNote.backgroundColor,
        fontFamily: editNote.fontFamily,
        fontSize: editNote.fontSize,
        lineHeight: editNote.lineHeight,
        fontWeight: editNote.fontWeight,
        fontStyle: editNote.fontStyle} : {...userFontSettings})
    const [position, setPosition] = useState(editNote ? editNote.position : "end");
    const [colorMode, setColorMode] = useState("text")
    const [text, setText] = useState(editNote ? editNote.body : "Escreva aqui a sua nota");

    useEffect(() => {
        setFontSettings(editNote ? {
            color: editNote.color,
            backgroundColor: editNote.backgroundColor,
            fontFamily: editNote.fontFamily,
            fontSize: editNote.fontSize,
            lineHeight: editNote.lineHeight,
            fontWeight: editNote.fontWeight,
            fontStyle: editNote.fontStyle} : {...userFontSettings})
        setPosition(editNote ? editNote.position : "end")
        setColorMode("text")
        setText(editNote ? editNote.body : "Escreva aqui a sua nota")
    }, [editNote, userFontSettings])

    const resetFontSettings = () => setFontSettings({...userFontSettings})

    const onFontTypeOptionPress = (styleType, value) => {
        const tempFontSettings = {...fontSettings}
        tempFontSettings[styleType.key] = value ? styleType.value1 : styleType.value2
        setFontSettings(tempFontSettings)
    }

    const handleSubmit = () => {
        if (editNote) {
            setColorMode("text")
            setPosition("end")
            setText("Escreva aqui a sua nota");
            setFontSettings({...userFontSettings});
            onEditCallback({data: {body: text, last_edited: new Date().toDateString(), id: editNote.id, position: position, article: articleId, ...fontSettings}})
            ArticleNotesAPI.update(editNote.id, {body: text, position: position, article: articleId, ...fontSettings}, () => {})
        } else {
            const callback = (response) => {
                onCreateCallback(response);
                setColorMode("text")
                setPosition("end")
                setText("Escreva aqui a sua nota");
                setFontSettings({...userFontSettings});
            }

            ArticleNotesAPI.create({body: text, position: position, article: articleId, ...fontSettings}, callback)
        }
    }

    const containerAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sharedValue.value, [SIZES.height, 0], [0, 1]),
            transform: [ { translateY: sharedValue.value } ]
        }
    })

    const contentAnimatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(sharedValue.value, [SIZES.height, 0], [0, 1]),
            transform: [ { translateY: sharedValue.value } ]
        }
    })

    return (
        // Main container
        <Animated.ScrollView
            style={[{
                position: "absolute",
                height: SIZES.height,
                width: SIZES.width,
                backgroundColor: COLORS.white,
            }, contentAnimatedStyle]}
        >
            {/* Header */}
            <View style={{marginTop: SIZES.padding, flexDirection: "row", paddingHorizontal: SIZES.padding}}>
                <TextButton
                    label={"Reset"}
                    contentContainerStyle={{
                        width: 60,
                        backgroundColor: null
                    }}
                    labelStyle={{
                        color: COLORS.black,
                        ...FONTS.body3
                    }}
                    onPress={resetFontSettings}
                />
                <Text style={{flex: 1, textAlign: "center", ...FONTS.h1}}>
                    Criar Nota
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
                    onPress={onCloseCallback}
                />
            </View>
            <View style={{
                marginTop: 20,
                marginHorizontal: SIZES.padding,
                backgroundColor: fontSettings.backgroundColor,
                borderWidth: 1,
                borderColor: fontSettings.color,
                padding: 10,
                borderRadius: SIZES.base
            }}>
                <TextInput onChangeText={(value) => setText(value)} multiline style={{
                    fontFamily: fontSettings.fontFamily,
                    color: fontSettings.color,
                    fontSize: fontSettings.fontSize,
                    fontWeight: fontSettings.fontWeight,
                    fontStyle: fontSettings.fontStyle
                }}>{text}</TextInput>
            </View>

            <View style={{flexDirection: "row", marginTop: 10, paddingHorizontal: SIZES.padding}}>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        padding: SIZES.radius,
                        borderRadius: SIZES.radius,
                        backgroundColor: position === "start" ? COLORS.primary3 : COLORS.additionalColor9,
                    }}
                    onPress={() => setPosition("start")}
                >
                    <Text style={{color: position === "start" ? COLORS.white : COLORS.gray80, ...FONTS.h3}} >Início do artigo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        padding: SIZES.radius,
                        borderRadius: SIZES.radius,
                        marginLeft: SIZES.base,
                        backgroundColor: position === "end" ? COLORS.primary3 : COLORS.additionalColor9,
                    }}
                    onPress={() => setPosition("end")}
                >
                    <Text style={{color: position === "end" ? COLORS.white : COLORS.gray80, ...FONTS.h3}} >Fim do artigo</Text>
                </TouchableOpacity>
            </View>

            <TextButton
                onPress={handleSubmit}
                contentContainerStyle={{borderRadius: SIZES.base, marginTop: 20, marginHorizontal: SIZES.padding, padding: 10, backgroundColor: COLORS.primary}}
                label={editNote ? "Guardar" : "Criar Nota"}
            />
            {editNote && <TextButton
                onPress={onDeleteCallback}
                contentContainerStyle={{borderRadius: SIZES.base, marginTop: 10, marginHorizontal: SIZES.padding, padding: 10, backgroundColor: "#d95252"}}
                label={"Eliminar nota"}
            />}
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
                                              setFontSettings(tempFontSettings)
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
                    setFontSettings(tempFontSettings)
                }}
                             swatchesLast={false} discrete={true} swatches={false} thumbSize={25}/>
            </View>
            <View>
                <FlatList
                    contentContainerStyle={{marginTop: 20, paddingBottom: 50}}
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
                                                  setFontSettings(tempFontSettings)
                                              }}
                            >
                                <Text style={{color: COLORS.gray80, ...FONTS.h2}}>{item}</Text>
                            </TouchableOpacity>
                        )
                    }}/>
            </View>
        </Animated.ScrollView>
    )
}

export default CreateNoteModal;
