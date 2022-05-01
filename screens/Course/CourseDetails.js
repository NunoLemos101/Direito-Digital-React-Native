import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Animated,
    ScrollView,
    FlatList, Slider, Image,
} from "react-native";
import IconButton from "../../components/iconButton";
import { COLORS, FONTS, SIZES, icons, constants } from "../../constants";
import ArticlesAPI from "../../api/v1/articles";
import SearchModal from "../../components/SearchModal";
import {
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import FontModal from "../../components/FontModal";
import {useSelector} from "react-redux";

const course_details_tabs = constants.course_details_tabs.map((course_details_tab) => ({
  ...course_details_tab,
  ref: createRef()
}))

const Discussion = ({articleId}) => {

  const [article, setArticle] = useState({})
  const scrollRef = useRef()
  const fontSettings = useSelector(state => state.reducer.fontSettings)

  const responseCallback = (response) => {
    setArticle(response.data)
  }

  useEffect(() => {
    ArticlesAPI.retrieve(articleId, responseCallback)
    scrollRef.current?.scrollTo({y:0, animated: true});
  }, [articleId])
  return (
      <>
          <ScrollView ref={scrollRef} style={{}}>
              <Text style={{...fontSettings, paddingHorizontal: 10, paddingTop: 10}} selectable>{article.body}</Text>
          </ScrollView>
      </>
  )
}

const TabIndicator = ({measureLayout, scrollX}) => {
  const inputRange = course_details_tabs.map((_, i) => i * SIZES.width);

  const tabIndicatorWidth = scrollX.interpolate({inputRange, outputRange: measureLayout.map(measure => measure.width)})

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: measureLayout.map(measure => measure.x)
  })

  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        height: 4,
        top:56,
        width:
        tabIndicatorWidth,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        transform: [{translateX}]}}
    />
  )
}

const Tabs = ({scrollX, onTabPress}) => {

  const [measureLayout, setMeasureLayout] = useState([]);
  const containerRef = useRef();

  useEffect(() => {
    let ml = [];

    course_details_tabs.forEach(course_details_tab => {
      course_details_tab?.ref?.current?.measureLayout(
        containerRef.current,
        (x, y, width, height) => {
        ml.push({x, y, width, height});
        if (ml.length === course_details_tabs.length) {
          setMeasureLayout(ml);
        }
      })
    })
  }, [containerRef.current])

  return (
    <View ref={containerRef} style={{flex: 1, flexDirection: "row", backgroundColor: COLORS.primary3, borderBottomWidth: 1, borderBottomColor: COLORS.primary3}}>

      { /* Tab Indicator */ }
      {measureLayout.length > 0 && <TabIndicator measureLayout={measureLayout} scrollX={scrollX}/>}
      { /* Tabs */ }
      {course_details_tabs.map((item, index) => {
        return (
          <TouchableOpacity
            key={`Tab-${index}`}
            ref={item.ref}
            style={{
              flex: 1,
              paddingHorizontal: 15,
              alignItems: "center",
              justifyContent: "center"
            }}
            onPress={() => onTabPress(index)}
          >
          <Text style={{...FONTS.body3, color: COLORS.gray10, fontSize: SIZES.height > 800 ? 18 : 17}}>{item.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const Indice = ({onPress, category, index}) => {

  const data = category.articles[index]

  return (
    <FlatList
      data={data}
      showsVerticalScrollIndicator={false}
      initialNumToRender={1}
      renderItem={({ item, index }) => {
        if (item.S) {
          return (
            <View style={{backgroundColor: COLORS.primary5, flexDirection: 'row', alignItems: 'center', paddingVertical: SIZES.base}}>
              <View style={{flex: 1}}>
                {item.title ?  <Text style={{...FONTS.h3, color: COLORS.black,paddingLeft: SIZES.radius, marginBottom: 10, backgroundColor: COLORS.white}}>{item.title}</Text>  : null }
                <Text style={{...FONTS.h3, color: COLORS.white, marginBottom: 5, marginTop: 5, marginLeft: SIZES.radius}}>{item.text}</Text>
              </View>
            </View>
          )
        }
        return (
          <TouchableOpacity onPress={() => onPress(item.id)} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}>{item.title1}</Text>
            <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
          </TouchableOpacity>
        )
      }}
    />
  )
}

const Chapters = ({ category, onPress }) => {
  return (
    <FlatList
      data={category.rows}
      showsVerticalScrollIndicator={false}
      initialNumToRender={1}
      renderItem={({ item, index }) => {
      return (
        <TouchableOpacity onPress={() => onPress(`${item.id}`)} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
          <Text style={{paddingLeft: SIZES.radius}}>{item.title}</Text>
        </TouchableOpacity>
      )
    }}
    />
  )
}

const CourseDetails = ({navigation, route}) => {

  const { selectedCategory, initialArticle } = route.params;

  const [selectedArticles, setSelectedArticles] = useState("0")
  const [articleId, setArticleId] = useState(() => (initialArticle ? initialArticle.id : selectedCategory.articles["0"][1].id))
  const [searchModal, toogleSearchModal] = useState(false)
  const [fontModal, toogleFontModal] = useState(false)

  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const searchModalSharedValue = useSharedValue(SIZES.height)

  const fontModalSharedValue1 = useSharedValue(SIZES.height)
  const fontModalSharedValue2 = useSharedValue(SIZES.height)


    const onTabPress = useCallback(tabIndex => {
    flatListRef?.current?.scrollToOffset({offset: tabIndex * SIZES.width})
  })

  const onSearchButtonPress = () => {
    toogleSearchModal(true)
    searchModalSharedValue.value = withDelay(500, withTiming(0, {duration: 500}))
  }

  const onFontButtonPress = () => {
      toogleFontModal(true)
      fontModalSharedValue1.value = withTiming(0, {duration: 100})
      fontModalSharedValue2.value = withDelay(100, withTiming(0, {duration: 500}))
  }

  const onArticleSelectSearchBar = (article) => {
    setArticleId(article.id)
    toogleSearchModal(false)
    searchModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
    onTabPress(2)
  }

  const onArticleIntervalPress = (index) => {
    setSelectedArticles(index);
    onTabPress(1)
  };

  const onArticlePress = (id) => {
    setArticleId(id)
    onTabPress(2)
  }

  function renderVideoSection() {
    return (
      <View style={{
        height: SIZES.height > 880 ? 220 : 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.gray90
      }}>
        <ImageBackground source={selectedCategory?.thumbnail}
         style={{
          width: "100%",
          height: "100%",
        }}>
        </ImageBackground>
      </View>
    )
  }

  function renderHeader() {
    return (
      <View style={{
        position: "absolute",
        top: SIZES.height > 800 ? 40 : 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        paddingHorizontal: SIZES.padding,
        zIndex: 1
      }}>
        <View style={{flex: 1}}>
          <IconButton
            icon={icons.back}
            onPress={() => navigation.goBack()}
            iconStyle={{width: 25, height: 25, tintColor: COLORS.black}}
            containerStyle={{width: 40, height: 40, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.white, borderRadius: 20}}
          />
        </View>
        <View style={{flexDirection: "row"}}>
          <IconButton
            icon={icons.search}
            onPress={onSearchButtonPress}
            iconStyle={{tintColor: COLORS.white, width: 25, height: 25}}
            containerStyle={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}
          />
          <IconButton
            icon={icons.font}
            onPress={onFontButtonPress}
            iconStyle={{tintColor: COLORS.white}}
            containerStyle={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}
          />
        </View>
      </View>
    )
  }

  function renderContent() {
    return (
      <View style={{flex: 1}}>
        <View style={{height: 60}}>
            <Tabs onTabPress={onTabPress} scrollX={scrollX}/>
        </View>
        <Animated.FlatList
          ref={flatListRef}
          horizontal={true}
          pagingEnabled={true}
          snapToAlignment="center"
          snapToInterval={SIZES.width}
          decelerationRate="fast"
          keyboardDismissMode="on-drag"
          showsHorizontalScrollIndicator={false}
          data={constants.course_details_tabs}
          keyExtractor={item => `CourseDetailTabs-${item.id}`}
          onScroll={
          Animated.event([{nativeEvent: {contentOffset: {x: scrollX } } },], { useNativeDriver: false })}
          renderItem={({item, index}) => {
            return (
              <View style={{width: SIZES.width}}>
                {index === 0 && <Chapters onPress={onArticleIntervalPress} category={selectedCategory} />}
                {index === 1 && <Indice category={selectedCategory} onPress={onArticlePress} index={selectedArticles}/>}
                {index === 2 && <Discussion articleId={articleId}/>}
              </View>
            )
          }}
        />
      </View>
    )
  }

  useEffect(() => {
    if (initialArticle) onTabPress(2)
  }, [])

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
        {!searchModal ? renderHeader() : null}
        {renderVideoSection()}
        {renderContent()}
        <SearchModal setToogleState={toogleSearchModal} onArticleSelect={onArticleSelectSearchBar} sharedValue={searchModalSharedValue}/>
        <FontModal setToogleState={toogleFontModal} onArticleSelect={onArticleSelectSearchBar} sharedValue1={fontModalSharedValue1} sharedValue2={fontModalSharedValue2} />
    </View>
  )
}

export default CourseDetails;
