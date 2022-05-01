import React from "react";
import { View, Text, ScrollView, StatusBar, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {FlatList} from "react-native-gesture-handler";
import { COLORS, FONTS, SIZES, icons, dummyData, constants } from "../../constants";
import IconButton from "../../components/iconButton";
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

    const username = useSelector(state => state.reducer.username)
    const categories = useSelector(state => state.reducer.categorySettings)

    const getTodayDate = () => {
      const date = new Date()
      const month = constants.months[date.getMonth()]
      const week_day = constants.week_days[date.getDay()]
      return `${week_day}, ${date.getDate()} de ${month}`
    }


    const onDragEnd = ({data}) => CategorySettingsAPI.offlineUpdate(data, dispatch);

    function renderHeader() {
        return (
          <View style={{
              height: 75,
              backgroundColor: COLORS.primary3,
              flexDirection: "row",
              paddingVertical: 10,
              marginBottom: 10,
              paddingHorizontal: SIZES.padding,
              alignItems: "center"
          }}>

              <View style={{flex: 1}}>
                  <Text style={{...FONTS.h2, color: COLORS.white}}>Bem-vindo, {username}!</Text>
                  <Text style={{color: COLORS.gray20, ...FONTS.body3}}>{getTodayDate()}</Text>
              </View>

              <IconButton icon={icons.sun} iconStyle={{tintColor: COLORS.white}}/>

          </View>
        )
    }

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
      return (
          <Section title={"Categorias"} buttonLabel={"Mudar"} >
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
                              marginRight: index === dummyData.categories.length - 1 ? SIZES.padding : 0,
                              padding: 0
                          }}
                      />
                  )}
              />
          </Section>
      )
  }

    return (
      <View style={{flex: 1, backgroundColor: COLORS.white}}>
        <StatusBar backgroundColor={COLORS.primary3}/>
          {renderHeader()}
          <ScrollView contentContainerStyle={{paddingBottom: 70}} showsVerticalScrollIndicator={false}>
              {renderDraggableCategories()}
              {renderResults()}
          </ScrollView>
      </View>
    )
}

export default Home;
