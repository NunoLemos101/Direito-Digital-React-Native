import React, {useRef, useState} from 'react';
import {
    View,
    Text
} from 'react-native';
import { FlatList } from "react-native-gesture-handler";
import Animated, {
    useAnimatedScrollHandler,
    useSharedValue, withDelay, withTiming,
} from "react-native-reanimated";
import TextButton from "../../components/TextButton";
import AreaCard from "../../components/AreaCard";
import {COLORS, FONTS, SIZES, dummyData, icons} from "../../constants";
import { useNavigation } from "@react-navigation/native";
import {useSelector} from "react-redux";
import IconButton from "../../components/iconButton";
import SearchModal from "../../components/SearchModal";

const Section = ({containerStyle, title, onPress, buttonLabel, children}) => {
    return (
        <View style={{...containerStyle}}>
            <View style={{flexDirection: "row", paddingHorizontal: SIZES.padding, alignItems: "center"}}>
                <Text style={{flex: 1, ...FONTS.h2}}>{title}</Text>
                <IconButton
                    icon={icons.search}
                    iconStyle= {{width: 18, height: 18}}
                    onPress={onPress}
                    containerStyle={{width: 36, height: 36, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: COLORS.primary3}}/>
            </View>
            {children}
        </View>
    )
}

const Search = () => {

    const scrollViewRef = useRef();
    const navigation = useNavigation();
    const categories = useSelector(state => state.reducer.categorySettings)
    const [searchModal, toogleSearchModal] = useState(false)

    const scrollY = useSharedValue(0);
    const onScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    })

    const searchModalSharedValue = useSharedValue(SIZES.height)

    const onArticleSelectSearchBar = (article) => {
        toogleSearchModal(false)
        searchModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
        navigation.navigate("CourseDetails", { selectedCategory: dummyData.codigos[0], initialArticle: article })
    }

    function renderBrowseCategories() {
        return (
            <Section title={"Pesquisar nas Categorias"} onPress={() => {
                toogleSearchModal(true)
                searchModalSharedValue.value = withDelay(500, withTiming(0, {duration: 500}))
            }}>
                <FlatList
                    data={categories}
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
            </Section>
        )
    }

    return (
          <Animated.ScrollView
            ref={scrollViewRef}
            contentContainerStyle={{paddingBottom: 100, paddingTop: 10}}
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
              { renderBrowseCategories() }
              <SearchModal setToogleState={toogleSearchModal} onArticleSelect={onArticleSelectSearchBar} paddingBottom={90} sharedValue={searchModalSharedValue} placeholder={"Pesquisar em todas as categorias"} />
          </Animated.ScrollView>
    )
}

export default Search;
