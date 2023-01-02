import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    FlatList,
    Image,
    ImageBackground,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {COLORS, constants, dummyData, FONTS, icons, images, SIZES} from "../../constants";
import IconButton from "../../components/iconButton";
import {useSharedValue, withDelay, withTiming} from "react-native-reanimated";
import ArticlesAPI from "../../api/v1/articles";
import {useSelector} from "react-redux";
import FontModal from "../../components/FontModal";
import CreateNoteModal from "../../components/CreateNoteModal";
import ArticleNotesAPI from "../../api/v1/article-notes";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal";
import SearchModal from "../../components/SearchModal";

const course_details_tabs = constants.indice_tabs.map((course_details_tab) => ({
  ...course_details_tab,
  ref: createRef()
}))

const NotPremium = () => {

    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)

    const generateMonthlyCheckoutSession = async () => {
        setLoading(true)
        const response = await axios.get("/api/v1/checkout/price_1MGYloCxO5zuwwEZPgqNz14N")
        navigation.navigate("StripeCheckout", {url: response.data.url})
        setLoading(false)
    }

    const generateYearlyCheckoutSession = async () => {
        setLoading(true)
        const response = await axios.get("/api/v1/checkout/price_1MGYloCxO5zuwwEZPWbdm8wO")
        navigation.navigate("StripeCheckout", {url: response.data.url})
        setLoading(false)
    }

    return (
        <View style={{marginTop: 20}}>
            <Text style={{marginHorizontal: SIZES.padding, ...FONTS.h2}}>Torna-te Premium</Text>
            <TouchableOpacity onPress={generateYearlyCheckoutSession} activeOpacity={0.5} style={{flexDirection: "row", backgroundColor:  "#f3f3f3", padding: 10, marginTop: 20, marginHorizontal: SIZES.padding, borderRadius: 5}}>
                <Image style={{width: 50, height: 50, backgroundColor: COLORS.primary3, borderRadius: 5}} source={images.cube}/>
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 16, color: COLORS.black}}>Subscrição anual</Text>
                    <Text style={{color: COLORS.gray50, marginTop: 10}}><Text style={{color: COLORS.gray40, textDecorationLine: "line-through"}}>100,00€ por ano</Text> 14,00€ por ano</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity  onPress={generateMonthlyCheckoutSession} activeOpacity={0.5} style={{flexDirection: "row", backgroundColor: "#f3f3f3", padding: 10, marginTop: 10, marginHorizontal: SIZES.padding, borderRadius: 5}}>
                <Image style={{width: 50, height: 50, backgroundColor: COLORS.primary3, borderRadius: 5}} source={images.cube}/>
                <View style={{flex: 1, marginLeft: 10}}>
                    <Text style={{fontWeight: "bold", fontSize: 16, color: COLORS.black}}>Subscrição mensal</Text>
                    <Text style={{color: COLORS.gray50, marginTop: 10}}><Text style={{textDecorationLine: "line-through"}}>10,50€ por mês</Text> 1,50€ por mês</Text>
                </View>
            </TouchableOpacity>
            <Text style={{fontSize: 10, marginTop: 10, paddingHorizontal: SIZES.padding, color: COLORS.gray50}}>Os preços de lançamento serão válidos até 31 de Janeiro de 2023.</Text>
            <Countdown/>
            { loading && <LoadingModal/>}
        </View>
    )
}

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

const TabContent3 = ({article, articleId, editNoteCallback}) => {

    const scrollRef = useRef()
    const user = useSelector(state => state.reducer)
    const fontSettings = useSelector(state => state.reducer.fontSettings)
    const [displayPricing, setDisplayPricing] = useState(false)

    useEffect(() => {
        if (!user.subscription.is_valid) {
            setDisplayPricing(true)
            setTimeout(() => {
                setDisplayPricing(false)
            }, 10000)
        }
        scrollRef.current?.scrollTo({y:0, animated: true});
    }, [articleId])

    if (displayPricing) {
        return (
            <NotPremium/>
        )
    }

  return (
    <ScrollView ref={scrollRef} style={{paddingHorizontal: 10}}>
        {
            article.notes.map((note, index) => {
                if (note.position === "start") {
                    return (
                        <View key={index} style={{backgroundColor: note.backgroundColor, borderBottomWidth: 1, borderBottomColor: fontSettings.color, paddingTop: 10, paddingBottom: 10}}>
                            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{
                                    color: note.color,
                                    fontFamily: note.fontFamily,
                                    fontSize: note.fontSize,
                                    lineHeight: note.lineHeight,
                                    fontWeight: note.fontWeight,
                                    fontStyle: note.fontStyle,
                                    paddingTop: 1,
                                    paddingHorizontal: 10,}} selectable>Ultima edição {new Date(note.last_edited).toLocaleDateString()}</Text>
                                <IconButton
                                    icon={icons.edit}
                                    iconStyle={{tintColor: note.color, width: 25, height: 25}}
                                    containerStyle={{width: 50, height: 50, justifyContent: "center"}}
                                    onPress={() => editNoteCallback(note)}
                                />
                            </View>
                            <Text style={{
                                color: note.color,
                                fontFamily: note.fontFamily,
                                fontSize: note.fontSize,
                                lineHeight: note.lineHeight,
                                fontWeight: note.fontWeight,
                                fontStyle: note.fontStyle,
                                paddingHorizontal: 10, paddingTop: 10}} selectable>{note.body}</Text>
                        </View>
                    )
                }
            })
        }
      <Text style={{...fontSettings, paddingHorizontal: 10, paddingTop: 10}} selectable>{article.body}</Text>
        {
            article.notes.map((note, index) => {
                if (note.position === "end") {
                    return (
                        <View key={index} style={{backgroundColor: note.backgroundColor, borderTopWidth: 1, borderTopColor: fontSettings.color, paddingTop: 10, paddingBottom: index + 1 === article.notes.length ? 50 : 10}}>
                            <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                                <Text style={{
                                    color: note.color,
                                    fontFamily: note.fontFamily,
                                    fontSize: note.fontSize,
                                    lineHeight: note.lineHeight,
                                    fontWeight: note.fontWeight,
                                    fontStyle: note.fontStyle,
                                    paddingHorizontal: 10,
                                    paddingTop: 10}} selectable>Ultima edição {new Date(note.last_edited).toLocaleDateString()}</Text>
                                <IconButton
                                    icon={icons.edit}
                                    iconStyle={{tintColor: note.color, width: 25, height: 25}}
                                    containerStyle={{width: 50, height: 50, justifyContent: "center"}}
                                    onPress={() => editNoteCallback(note)}
                                />
                            </View>
                            <Text style={{color: note.color,
                                fontFamily: note.fontFamily,
                                fontSize: note.fontSize,
                                lineHeight: note.lineHeight,
                                fontWeight: note.fontWeight,
                                fontStyle: note.fontStyle, paddingHorizontal: 10, paddingTop: 10}} selectable>{note.body}</Text>
                        </View>
                    )
                }
            })
        }
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
  const indiceObject = dummyData.indices_dict[selectedCategory.code.toLowerCase()]
    const [selectedArticles, setSelectedArticles] = useState(indiceObject.articles[1].artigos)
    const [article, setArticle] = useState({notes: []})
    const [articleId, setArticleId] = useState(selectedCategory.articles["0"][1].id)
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [fontModal, toogleFontModal] = useState(false)
    const [searchModal, toogleSearchModal] = useState(false)
    const [createNoteModal, toogleCreateNoteModal] = useState(false)

    const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;

    const searchModalSharedValue = useSharedValue(SIZES.height)

    const fontModalSharedValue1 = useSharedValue(SIZES.height)
    const fontModalSharedValue2 = useSharedValue(SIZES.height)

    const createNoteModalSharedValue = useSharedValue(SIZES.height)

    const onArticleSelectSearchBar = (article) => {
        setArticleId(article.id)
        toogleSearchModal(false)
        searchModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
        onTabPress(2)
    }

    const onNoteCreateCallback = (response) => {
        setArticle(prevState => ({...prevState, notes: [...prevState.notes, response.data]}))
        onCreateNoteModalClose()
    }

    const onNoteEditCallback = (response) => {
        const newState = article.notes.map(note => {
            if (note.id === response.data.id) {
                return {...response.data}
            }
            return note
        })
        setArticle(prevState => ({...prevState, notes: newState}))
        onCreateNoteModalClose()
    }

    const onNoteDelete = () => {
        ArticleNotesAPI.delete(noteToEdit.id);
        const newState = article.notes.filter((note) => note.id !== noteToEdit.id)
        setArticle(prevState => ({...prevState, notes: newState}))
        onCreateNoteModalClose()
    }

const onCreateNoteModalClose = () => {
    setNoteToEdit(null)
    toogleCreateNoteModal(false)
    createNoteModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
}

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

    const handleEditNoteIcon = (note) => {
        setNoteToEdit(note)
        toogleCreateNoteModal(true)
        createNoteModalSharedValue.value = withTiming(0, {duration: 100})
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
                {index === 2 && <TabContent3 article={article} articleId={articleId} editNoteCallback={handleEditNoteIcon}/>}
              </View>
            )
          }}
        />
      </View>
    )
  }

  function renderHeader() {

      const onAddNoteButtonPress = () => {
          toogleCreateNoteModal(true)
          createNoteModalSharedValue.value = withDelay(500, withTiming(0, {duration: 500}))
      }

      const onSearchButtonPress = () => {
          toogleSearchModal(true)
          searchModalSharedValue.value = withDelay(500, withTiming(0, {duration: 500}))
      }

      const onFontButtonPress = () => {
          toogleFontModal(true)
          fontModalSharedValue1.value = withTiming(0, {duration: 100})
          fontModalSharedValue2.value = withDelay(100, withTiming(0, {duration: 500}))
      }

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
                    icon={icons.edit}
                    onPress={onAddNoteButtonPress}
                    iconStyle={{tintColor: COLORS.white, width: 25, height: 25}}
                    containerStyle={{width: 50, height: 50, alignItems: "center", justifyContent: "center"}}
                />
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

    const articleResponseCallback = (response) => {
        setArticle(response.data)
    }

    useEffect(() => {
        ArticlesAPI.retrieve(articleId, articleResponseCallback)
    }, [articleId])

  return (
    <View style={{flex: 1, backgroundColor: COLORS.white}}>
        <StatusBar backgroundColor={COLORS.primary3} barStyle={"light-content"}/>
        {(!searchModal && !createNoteModal) ? renderHeader() : null}
        {renderImageSection()}
        {renderContent()}
        {createNoteModal && <CreateNoteModal onDeleteCallback={onNoteDelete} onCloseCallback={onCreateNoteModalClose} onEditCallback={onNoteEditCallback} editNote={noteToEdit} onCreateCallback={onNoteCreateCallback} articleId={articleId} sharedValue={createNoteModalSharedValue}/>}
        {searchModal && <SearchModal setToogleState={toogleSearchModal} onArticleSelect={onArticleSelectSearchBar} sharedValue={searchModalSharedValue} codesToSearch={[indiceObject]} placeholder={`Pesquisar em ${selectedCategory.title} (Índice Temático)`}/>}
        <FontModal sharedValue1={fontModalSharedValue1} sharedValue2={fontModalSharedValue2} />
    </View>
  )
}

export default Indice;
