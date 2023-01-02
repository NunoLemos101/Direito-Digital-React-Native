import React, { createRef, useCallback, useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    ImageBackground,
    TouchableOpacity,
    Animated,
    ScrollView,
    FlatList, Image, StatusBar,
} from "react-native";
import IconButton from "../../components/iconButton";
import {COLORS, FONTS, SIZES, icons, constants, images} from "../../constants";
import ArticlesAPI from "../../api/v1/articles";
import SearchModal from "../../components/SearchModal";
import {
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import FontModal from "../../components/FontModal";
import {useSelector} from "react-redux";
import CreateNoteModal from "../../components/CreateNoteModal";
import ArticleNotesAPI from "../../api/v1/article-notes";
import {ProgressBar} from "react-native-paper";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal";
import {useNavigation} from "@react-navigation/native";

const lexionario_details_tabs = constants.lexionario_details_tabs.map((tab) => ({
    ...tab,
    ref: createRef()
}))

const Countdown = () => {
    const [basis, setBasis] = useState(() => {
        var t = new Date();
        t.setSeconds(t.getSeconds() + 10)
        return t.valueOf()
    });
    const [timer, setTimer] = useState();
    const [timerDisp, setTimerDisp] = useState(0);
    const [intervalId, setIntervalId] = useState()

    useEffect(() => {
        let _intervalId;
        _intervalId = setInterval(() => {
            setTimer(new Date().valueOf());
        }, 100)
        setIntervalId(_intervalId)
        return () => {
            clearInterval(_intervalId)
        }
    }, [])


    useEffect(() => {
        if (basis && timer) {
            const toDisp = Math.floor((basis - timer) / 1000)
            if (timerDisp !== toDisp) {
                setTimerDisp(toDisp)
            }
        }
    }, [timer])


    useEffect(() => {
        if (timerDisp <= 0) {
            clearInterval(intervalId);
        }
    }, [timerDisp])
    return (
        <ProgressBar style={{margin: SIZES.padding}} color={COLORS.primary} progress={1 - (timerDisp / 10)}/>
    )
};

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

const TabIndicator = ({measureLayout, scrollX}) => {
    const inputRange = lexionario_details_tabs.map((_, i) => i * SIZES.width);

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

        lexionario_details_tabs.forEach(course_details_tab => {
            course_details_tab?.ref?.current?.measureLayout(
                containerRef.current,
                (x, y, width, height) => {
                    ml.push({x, y, width, height});
                    if (ml.length === lexionario_details_tabs.length) {
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
            {lexionario_details_tabs.map((item, index) => {
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


const Questions = ({category, onPress}) => {

    const renderLetterTag = (item, index) => {
        return (
            <View style={{backgroundColor: COLORS.primary5, paddingVertical: SIZES.base, borderBottomWidth: 1}}>
                <Text style={{...FONTS.h3, color: COLORS.white, paddingLeft: SIZES.radius}}>{item.letter}</Text>
            </View>
        )
    }

    const renderTitle = (item, index) => {
        return (
            <TouchableOpacity onPress={() => onPress(item.id)} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    return (
        <FlatList
            data={category.articles}
            showsVerticalScrollIndicator={false}
            initialNumToRender={1}
            renderItem={({ item, index }) => (item.letter ? renderLetterTag(item, index) : renderTitle(item, index))}
        />
    )
}

const Answers = ({article, articleId, editNoteCallback}) => {

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
        <ScrollView ref={scrollRef}>
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

const LexionarioDetails = ({navigation, route}) => {

    const { selectedCategory, initialArticle } = route.params;
    const [article, setArticle] = useState({notes: []})
    const [articleId, setArticleId] = useState(() => (initialArticle ? initialArticle.id : selectedCategory.articles[1].id))
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [searchModal, toogleSearchModal] = useState(false)
    const [fontModal, toogleFontModal] = useState(false)
    const [createNoteModal, toogleCreateNoteModal] = useState(false)

    const flatListRef = useRef();
    const scrollX = useRef(new Animated.Value(0)).current;

    const searchModalSharedValue = useSharedValue(SIZES.height)

    const fontModalSharedValue1 = useSharedValue(SIZES.height)
    const fontModalSharedValue2 = useSharedValue(SIZES.height)

    const createNoteModalSharedValue = useSharedValue(SIZES.height)

    const onTabPress = useCallback(tabIndex => {
        flatListRef?.current?.scrollToOffset({offset: tabIndex * SIZES.width})
    })

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

    const articleResponseCallback = (response) => {
        setArticle(response.data)
    }

    const onArticleSelectSearchBar = (article) => {
        setArticleId(article.id)
        toogleSearchModal(false)
        searchModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
        onTabPress(2)
    }

    const onCreateNoteModalClose = () => {
        setNoteToEdit(null)
        toogleCreateNoteModal(false)
        createNoteModalSharedValue.value = withTiming(SIZES.height, { duration: 500})
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

    const handleEditNoteIcon = (note) => {
        setNoteToEdit(note)
        toogleCreateNoteModal(true)
        createNoteModalSharedValue.value = withTiming(0, {duration: 100})
    }

    const onArticlePress = (id) => {
        setArticleId(id)
        onTabPress(1)
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
                    data={constants.lexionario_details_tabs}
                    keyExtractor={item => `CourseDetailTabs-${item.id}`}
                    onScroll={
                        Animated.event([{nativeEvent: {contentOffset: {x: scrollX } } },], { useNativeDriver: false })}
                    renderItem={({item, index}) => {
                        return (
                            <View style={{width: SIZES.width}}>
                                { index === 0 && <Questions category={selectedCategory} onPress={onArticlePress}/> }
                                { index === 1 && <Answers article={article} articleId={articleId} editNoteCallback={handleEditNoteIcon} /> }
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

    useEffect(() => {
        ArticlesAPI.retrieve(articleId, articleResponseCallback)
    }, [articleId])

    return (
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
            <StatusBar backgroundColor={COLORS.primary3} barStyle={"light-content"}/>
            {(!searchModal && !createNoteModal) ? renderHeader() : null}
            {renderVideoSection()}
            {renderContent()}
            {createNoteModal && <CreateNoteModal onDeleteCallback={onNoteDelete} onCloseCallback={onCreateNoteModalClose} onEditCallback={onNoteEditCallback} editNote={noteToEdit} onCreateCallback={onNoteCreateCallback} articleId={articleId} sharedValue={createNoteModalSharedValue}/>}
            {searchModal && <SearchModal setToogleState={toogleSearchModal} onArticleSelect={onArticleSelectSearchBar} sharedValue={searchModalSharedValue} codesToSearch={[selectedCategory]} placeholder={`Pesquisar em ${selectedCategory.title}`}/>}
            {fontModal && <FontModal sharedValue1={fontModalSharedValue1} sharedValue2={fontModalSharedValue2} />}
        </View>
    )
}

export default LexionarioDetails;
