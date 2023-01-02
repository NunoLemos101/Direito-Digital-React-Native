import React, {useRef, useState} from "react";
import {View, Text, ScrollView, StatusBar, Animated} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {FlatList} from "react-native-gesture-handler";
import { COLORS, FONTS, SIZES, dummyData } from "../../constants";
import TextButton from "../../components/TextButton";
import LineDivider from "../../components/LineDivider";
import {useDispatch, useSelector} from "react-redux";
import CategoryCard from "../../components/CategoryCard";
import DraggableFlatList from 'react-native-draggable-flatlist'
import DraggableAreaCard from "../../components/DraggableAreaCard";
import CategorySettingsAPI from "../../api/v1/category-settings";

const Section = ({containerStyle, title, onPress, buttonLabel, children}) => {
    return (
      <View style={{...containerStyle}}>
          <View style={{flexDirection: "row", paddingHorizontal: SIZES.padding}}>
              <Text style={{flex: 1, ...FONTS.h2}}>{title}</Text>
              <TextButton
                contentContainerStyle={{width: 80, borderRadius: 30, backgroundColor: COLORS.primary}}
                label={buttonLabel}
                onPress={onPress}
              />
          </View>
          {children}
      </View>
    )
}

const Home = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch()
    const categories = useSelector(state => state.reducer.categorySettings)
    const [displayDragHelp, setDisplayDragHelp] = useState(false)
    const animatedMarginTop = useRef(new Animated.Value(-25)).current
    const animatedMarginleft = useRef(new Animated.Value(-SIZES.width)).current

    const onDragEnd = ({data}) => CategorySettingsAPI.offlineUpdate(data, dispatch);


  function renderResults() {
    return (
      <Section title="Legislação" buttonLabel={"Mudar"} containerStyle={{marginTop: 30}}>
        <FlatList
          data={dummyData.codigos}
          keyExtractor={item => `Results-${item.id}`}
          contentContainerStyle={{paddingHorizontal: SIZES.padding}}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          keyboardDismissMode="on-drag"
          renderItem={({item, index}) => (
            <CategoryCard
              category={item}
              containerStyle={{
                marginVertical: SIZES.padding,
                marginTop: index === 0 ? SIZES.radius : SIZES.padding,
                radius: SIZES.padding
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <LineDivider lineStyle={{backgroundColor: COLORS.gray10, height: 2}} />
          )}
        />
      </Section>
    )
  }

  function renderDraggableCategories() {
      const handleOnPress = () => {
          setDisplayDragHelp(prevState => !prevState)
          if (!displayDragHelp) {
              Animated.timing(animatedMarginTop, {toValue: 0, duration: 500, useNativeDriver: false}).start()
              Animated.timing(animatedMarginleft, {toValue: 0, duration: 500, useNativeDriver: false}).start()
          } else {
              Animated.timing(animatedMarginTop, {toValue: -25, duration: 500, useNativeDriver: false}).start()
              Animated.timing(animatedMarginleft, {toValue: -SIZES.width, duration: 500, useNativeDriver: false}).start()
          }
      }

      return (
          <Section title={"Categorias"} onPress={handleOnPress} buttonLabel={"Mudar"} >
              <Animated.Text style={[{fontSize: 14, paddingTop: 5, paddingHorizontal: SIZES.padding, color: COLORS.gray50}, {marginLeft: animatedMarginleft}]}>Pressione e arraste os cartões para alterar a ordem</Animated.Text>
              <Animated.View style={[{marginTop: animatedMarginTop}]}>
                  <DraggableFlatList
                      horizontal
                      data={categories}
                      listKey={"Categories"}
                      keyExtractor={item => `Categories-${item.id}`}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{
                          marginTop: SIZES.radius
                      }}
                      onDragEnd={onDragEnd}
                      renderItem={({item, index, drag}) => (
                          <DraggableAreaCard
                              sharedElementPrefix={"Home"}
                              category={item}
                              drag={drag}
                              onPress={() => navigation.navigate("CourseListing", {category: item, sharedElementPrefix: "Home"})}
                              containerStyle={{
                                  marginLeft: index === 0 ? SIZES.padding : SIZES.base,
                                  marginRight: index === categories.length - 1 ? SIZES.padding : 0,
                                  padding: 0
                              }}
                          />
                      )}
                  />
              </Animated.View>
          </Section>
      )
  }

    return (
            <>
                <StatusBar backgroundColor={COLORS.white} barStyle={"dark-content"}/>
                <ScrollView contentContainerStyle={{paddingBottom: 70, paddingTop: 15, backgroundColor: COLORS.white}} showsVerticalScrollIndicator={false}>
                    {renderDraggableCategories()}
                    {renderResults()}
                </ScrollView>
            </>
    )
}

export default Home;
