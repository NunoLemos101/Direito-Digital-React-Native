import React, { useRef, useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Image, Keyboard } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS, SIZES, icons } from "../constants";
import IconButton from "./iconButton";
import { searchForResults } from "../utility";

const SearchModal = ({sharedValue, setToogleState, onArticleSelect}) => {

  const searchRef = useRef();

  const [input, setInput] = useState("")
  const [queryData, setQueryData] = useState({matches: []});

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sharedValue.value, [SIZES.height, 0], [0, 1]),
      transform: [ { translateY: sharedValue.value } ]
    }
  })

  function renderSearchBar() {
    return (
      <View>
        <View style={{
          height: 50,
          backgroundColor: COLORS.primary3,
        }}>
          <View style={{flexDirection: "row", marginTop: 5}}>
            <TextInput
              ref={searchRef}
              onChangeText={(text) => {
                setInput(text);
                setQueryData(searchForResults(text))
              }}
              style={{height: 35, marginHorizontal: 10, flex: 1, borderRadius: 5, backgroundColor: COLORS.white, ...FONTS.body5}}
              value={input}
              placeholder={`Pesquisar em Código Civil`}
              placeholderTextColor={COLORS.gray20}
            />
            <IconButton
              icon={icons.close}
              iconStyle={{tintColor: COLORS.white, width: 20, height: 20}}
              containerStyle={{width: 35, height: 35, marginRight: 20, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, borderRadius: 25}}
              onPress={() => {
                setToogleState(false)
                sharedValue.value = withTiming(SIZES.height, { duration: 500})
              }}
            />
          </View>
        </View>
        {queryData.execTime !== undefined &&
          (<View>
            <Text style={{color: COLORS.white, paddingVertical: 5, paddingLeft: 10, backgroundColor: COLORS.primary}}>{queryData.matches.length} resultados em {queryData.execTime.toFixed(2)} ms</Text>
          </View>)}
      </View>
    )
  }

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={() => onArticleSelect(item)} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
        <Text style={{paddingLeft: SIZES.radius}}>{item.title1}</Text>
        <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
      </TouchableOpacity>
    )
  }

  return (
     <Animated.View
        style={[{
          position: "absolute",
          height: SIZES.height,
          width: SIZES.width,
          backgroundColor: COLORS.white,
        }, contentAnimatedStyle]}
      >
        {/* Header */}
          {renderSearchBar()}
        <FlatList onScrollBeginDrag={() => { Keyboard.dismiss() }} initialNumToRender={1} data={queryData.matches} keyExtractor={(item, index) => `SearchResults-${item.id}-${index}`} renderItem={renderItem}/>
   </Animated.View>
  )
}

export default SearchModal;

