import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import { Animated, FlatList, ImageBackground, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { COLORS, constants, FONTS, icons, SIZES } from "../../constants";
import IconButton from "../../components/iconButton";
import LineDivider from "../../components/LineDivider";
import { useSharedValue } from "react-native-reanimated";
import ArticlesAPI from "../../api/v1/articles";

const course_details_tabs = constants.indice_tabs.map((course_details_tab) => ({
  ...course_details_tab,
  ref: createRef()
}))

const TabContent = ({category, onPress}) => {

  const renderLetterTag = (item, index) => {
    return (
      <View style={{backgroundColor: COLORS.primary5, paddingVertical: SIZES.base, borderBottomWidth: 1}}>
        <Text style={{...FONTS.h3, color: COLORS.white, paddingLeft: SIZES.radius}}>{item.letter}</Text>
      </View>
    )
  }

  const renderTitle = (item, index) => {
    return (
      <TouchableOpacity onPress={() => onPress(item)} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
        <Text style={{paddingLeft: SIZES.radius}}>{item.name}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View>
      <FlatList
        data={category.indice}
        renderItem={({item, index}) => (item.letter ? renderLetterTag(item, index) : renderTitle(item, index))}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => `indiceIndex1-${item.id}`}
      />
    </View>
  )
}

const TabContent2 = ({articles, onArticlePress}) => {

  const renderItem = ({item, index}) => (
    <TouchableOpacity onPress={() => onArticlePress(item)} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
      <Text style={{paddingLeft: SIZES.radius}}>{item.title1}</Text>
      <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
    </TouchableOpacity>
  )

  return (
    <FlatList data={articles} renderItem={renderItem}/>
  )
}

const TabContent3 = ({articleId}) => {

  const [article, setArticle] = useState({})
  const scrollRef = useRef()

  const responseCallback = (response) => {
    setArticle(response.data)
    scrollRef.current?.scrollTo({y:0, animated: true});
  }

  useEffect(() => {
    ArticlesAPI.retrieve(articleId, responseCallback)
  }, [articleId])

  return (
    <ScrollView ref={scrollRef} style={{paddingHorizontal: 10}}>
      <Text selectable>{article.body}</Text>
    </ScrollView>
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
        width: tabIndicatorWidth,
        borderRadius: SIZES.radius,
        backgroundColor: COLORS.primary,
        top:56,
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

const Indice = ({ navigation, route }) => {
  const { selectedCategory } = route.params;

  const [selectedArticles, setSelectedArticles] = useState(selectedCategory.indice[1].artigos)
  const [articleId, setArticleId] = useState(selectedCategory.articles["0"][1].id)
  const [searchModal, toogleSearchModal] = useState(false)

  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

  const searchModalSharedValue = useSharedValue(SIZES.height)

  const onArticlePress = (item) => {
    setArticleId(item.id)
    onTabPress(2)
  }

  const onTabPress = useCallback(tabIndex => {
    flatListRef?.current?.scrollToOffset({offset: tabIndex * SIZES.width})
  })

  function renderImageSection() {
    return (
      <View style={{
        height: SIZES.height > 880 ? 220 : 200,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: COLORS.gray90
      }}>
        <ImageBackground source={selectedCategory?.thumbnail}
                         blurRadius={10}
                         style={{
                           width: "100%",
                           height: "100%",
                           alignItems: "center",
                           justifyContent: "center"
                         }}>
          <Text style={{...FONTS.body1, color: COLORS.white,fontWeight: "normal", marginTop: 60}}>{selectedCategory.title}</Text>
          <Text style={{...FONTS.body1, color: COLORS.white,fontWeight: "normal", marginTop: 10}}>Índice Temático</Text>
        </ImageBackground>
      </View>
    )
  }

  function renderContent() {
    return (
      <View style={{flex: 1}}>
        {/* renderSearchBar() */ }
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
                {index === 0 && <TabContent category={selectedCategory} onPress={(indiceItem) => {
                  setSelectedArticles(indiceItem.artigos)
                  onTabPress(1)
                }}/>}
                {index === 1 && <TabContent2 articles={selectedArticles} onArticlePress={onArticlePress}/>}
                {index === 2 && <TabContent3 articleId={articleId}/>}
              </View>
            )
          }}
        />
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
            iconStyle={{tintColor: COLORS.white, width: 25, height: 25}}
            containerStyle={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}
          />
          <IconButton
            icon={icons.sun}
            iconStyle={{tintColor: COLORS.white}}
            containerStyle={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
      {renderHeader()}
      {renderImageSection()}
      {renderContent()}
    </View>
  )
}

export default Indice;
