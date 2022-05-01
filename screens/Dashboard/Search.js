import React, {useRef} from 'react';
import {
    View,
    Text,
    Image,
    TextInput
} from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue,
} from "react-native-reanimated";
import TextButton from "../../components/TextButton";
import AreaCard from "../../components/AreaCard";
import { COLORS, FONTS, SIZES, icons, dummyData } from "../../constants";
import { useNavigation } from "@react-navigation/native";

const Search = () => {

    const scrollViewRef = useRef();
    const navigation = useNavigation();

    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    function renderTopSearches() {
        return (
          <View style={{marginTop: SIZES.padding}}>
              <Text style={{marginHorizontal: SIZES.padding, ...FONTS.h2}}>Top Searches</Text>
              <FlatList
                horizontal
                data={dummyData.top_searches}
                listKey="TopSearches"
                keyExtractor={item => `TopSearches-${item.id}`}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{marginTop: SIZES.radius}}
                renderItem={({item, index}) => (
                  <TextButton
                    label={item.label}
                    contentContainerStyle={{
                        paddingVertical: SIZES.radius,
                        paddingHorizontal: SIZES.padding,
                        marginLeft: index === 0 ? SIZES.padding : SIZES.radius,
                        marginRight: index === dummyData.top_searches.length - 1 ? SIZES.padding : 0,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.gray10
                    }}
                    labelStyle={{color: COLORS.gray50, ...FONTS.h3}}
                  />
                )}
              />
          </View>
        )
    }

    function renderBrowseCategories() {
        return (
          <View style={{marginTop: SIZES.padding}}>
              <Text style={{marginHorizontal: SIZES.padding, ...FONTS.h2}}>Pesquisar nas Categorias</Text>
              <FlatList
                data={dummyData.categories}
                numColumns={2}
                scrollEnabled={false}
                listKey="BrowseCategories"
                keyExtractor={item => `BrowseCategories-${item.id}`}
                contentContainerStyle={{marginTop: SIZES.radius}}
                renderItem={({item, index}) => (
                  <AreaCard
                    category={item}
                    sharedElementPrefix={"Search"}
                    onPress={() => navigation.navigate("CourseListing", {category: item, sharedElementPrefix: "Search", initOnSearchModal: true})}
                    containerStyle={{
                        height: 130,
                        width: (SIZES.width - (SIZES.padding * 2) - SIZES.radius) / 2,
                        marginTop: SIZES.radius,
                        marginLeft: (index + 1) % 2 === 0 ? SIZES.radius : SIZES.padding
                    }}
                  />
                )}
              />
          </View>
        )
    }

    return (
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        <View style={{
          height: 75,
          backgroundColor: COLORS.primary3,
          paddingVertical: 10,
          marginBottom: 10,
          paddingHorizontal: SIZES.padding,
        }}>
            <View style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              width: SIZES.width - (SIZES.padding * 2),
              paddingHorizontal: SIZES.radius,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.white
            }}>
              <Image source={icons.search} style={{width: 25, height: 25, tintColor: COLORS.gray40}}/>
              <TextInput
                style={{flex: 1, marginLeft: SIZES.base, ...FONTS.h4}}
                value=""
                placeholder="Search Topics, Courses & Educators"
                placeholderTextColor={COLORS.gray}
              />
            </View>
        </View>
          <Animated.ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{paddingBottom: 300}}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            keyboardDismissMode="on-drag"
            onScroll={onScroll}
            onScrollEndDrag={(event) => {
                if (event.nativeEvent.contentOffset.y > 10 && event.nativeEvent.contentOffset.y < 50) {
                    scrollViewRef.current?.scrollTo({x:0, y:60, animated: true})
                }
            }}
          >
              { renderTopSearches() }
              { renderBrowseCategories() }

          </Animated.ScrollView>

      </View>
    )
}

export default Search;
