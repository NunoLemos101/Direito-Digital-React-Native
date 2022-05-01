import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  runOnJS
} from "react-native-reanimated";
import { SharedElement } from "react-navigation-shared-element";

import IconButton from "../../components/iconButton";
import LineDivider from "../../components/LineDivider";
import { COLORS, FONTS, SIZES, images, icons, dummyData } from "../../constants";
import CategoryCard from "../../components/CategoryCard";
import SearchModal from "../../components/SearchModal";


const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const HEADER_HEIGHT = 250;

const CourseListing = ({navigation, route}) => {

  const {category, sharedElementPrefix, initOnSearchModal} = route.params;
  console.log(category.themeColor)
  const flatListRef = useRef();
  const scrollY = useSharedValue(0);
  const [searchModal, toogleSearchModal] = useState(false)
  const searchModalSharedValue = useSharedValue(SIZES.height)



  const onScroll = useAnimatedScrollHandler((event) => { scrollY.value = event.contentOffset.y })

  const headerSharedValue = useSharedValue(80);

  const onArticleSelectSearchBar = (article) => {
    toogleSearchModal(false)
    searchModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
    navigation.navigate("CourseDetails", { selectedCategory: dummyData.codigos[0], initialArticle: article })
  }

  function renderHeader() {

    const inputRange = [0, HEADER_HEIGHT - 50];

    headerSharedValue.value = withDelay(500, withTiming(0, {duration: 500}));

    const headerFadeAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(headerSharedValue.value, [80, 0], [0, 1])
      }
    })

    const headerTranslateAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateY: headerSharedValue.value}
        ]
      }
    })

    const headerHeightAnimatedStyle = useAnimatedStyle(() => {
      return {
        height: interpolate(scrollY.value, inputRange, [HEADER_HEIGHT, 120], Extrapolate.CLAMP)
      }
    })

    const headerHideOnScrollAnimatedStyle = useAnimatedStyle(() => {
      return {
        opacity: interpolate(scrollY.value, [80, 0], [0, 1], Extrapolate.CLAMP),
        transform: [
          {
            translateY: interpolate(scrollY.value, inputRange, [0, 200], Extrapolate.CLAMP)
          }
        ]
      }
    })

    return (
      <Animated.View
        style={[{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 250,
          overflow: "hidden"
        }, headerHeightAnimatedStyle]}
      >
        <SharedElement
          id={`${sharedElementPrefix}-CategoryCard-Bg-${category?.id}`}
          style={[StyleSheet.absoluteFillObject]}
        >
          <Image source={category?.thumbnail} resizeMode="cover" style={{height: "100%", width: "100%", borderBottomLeftRadius: 60}} />
        </SharedElement>

        <Animated.View
          style={[{position: "absolute", bottom: 70, left: 80}, headerHideOnScrollAnimatedStyle]}
        >
          <SharedElement
            id={`${sharedElementPrefix}-CategoryCard-Title-${category?.id}`}
            style={[StyleSheet.absoluteFillObject]}
          >
              <Text style={{color: COLORS.white, position: "absolute", ...FONTS.h2}}>{category?.title}</Text>
          </SharedElement>
        </Animated.View>

        <Animated.View>
          <IconButton
            icon={icons.back}
            iconStyle={{tintColor: COLORS.black}}
            containerStyle={{
              position: "absolute",
              top: 40,
              left: 20,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 25,
              backgroundColor: COLORS.white
          }}
            onPress={() => {
              if (scrollY.value >= 0 && scrollY.value <= 200) {
                flatListRef.current?.scrollToOffset({offset: 0, animated: true})
                setTimeout(() => {
                  headerSharedValue.value = withTiming(80, {
                    duration: 500
                  }, () => {
                    runOnJS(navigation.goBack)();
                  })
                }, 100)
              } else {
                navigation.goBack()
              }
            }}
          />
        </Animated.View>

        <Animated.Image
          source={images.mobile_image}
          resizeMode="contain"
          style={[{
            position: "absolute",
            right: 40,
            bottom: -40,
            width: 100,
            height: 200
          }, headerFadeAnimatedStyle, headerTranslateAnimatedStyle, headerHideOnScrollAnimatedStyle]}
        />

      </Animated.View>
    )
  }

  function renderResults() {
    return (
      <AnimatedFlatList
        ref={flatListRef}
        data={category.codigos}
        keyExtractor={item => `Results-${item.id}`}
        contentContainerStyle={{paddingHorizontal: SIZES.padding}}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        keyboardDismissMode="on-drag"
        onScroll={onScroll}
        ListHeaderComponent={
        <View style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 270,
          marginBottom: SIZES.base
        }}>
          <Text style={{flex: 1, ...FONTS.body3}}>{category.codigos.length} Resultados</Text>
          <IconButton
            icon={icons.search}
            onPress={() => {
              toogleSearchModal(true)
              searchModalSharedValue.value = withDelay(500, withTiming(0, {duration: 500}))
            }}
            iconStyle= {{width: 20, height: 20}}
            containerStyle={{width: 40, height: 40, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: category.themeColor}}/>
        </View>
      }
      renderItem={({item, index}) => (
        <CategoryCard
          themeColor={category.themeColor}
          category={item}
          containerStyle={{
            marginVertical: SIZES.padding,
            marginTop: index === 0 ? SIZES.radius : SIZES.padding,
            radius: SIZES.padding
        }}
        />
      )}
        ItemSeparatorComponent={() => (
          <LineDivider lineStyle={{backgroundColor: COLORS.gray10}} />
        )}
      />
    )
  }

  useEffect(() => {
    // in case User comes from Browsing Tab
    if (initOnSearchModal) {
      toogleSearchModal(true)
      searchModalSharedValue.value = withDelay(1000, withTiming(0, {duration: 500}))
    }
  }, [])

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>

      {renderResults()}
      {renderHeader()}
      { searchModal ? <SearchModal setToogleState={toogleSearchModal} onArticleSelect={onArticleSelectSearchBar} sharedValue={searchModalSharedValue}/> : null }
    </View>
  )
}

CourseListing.sharedElements = (route, otherRoute, showing) => {

  if (otherRoute.name === "Dashboard") {
    const {category, sharedElementPrefix} = route.params;
    return [
      {
        id: `${sharedElementPrefix}-CategoryCard-Bg-${category?.id}`
      },
      {
        id: `${sharedElementPrefix}-CategoryCard-Title-${category?.id}`
      },
    ]
  }
}

export default CourseListing;
