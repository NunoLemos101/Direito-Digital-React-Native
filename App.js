import React, { useEffect } from "react";
import { AsyncStorage, Easing, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import {
  MainLayout,
  CourseListing,
  Welcome,
  Login,
  Register,
  CourseDetails,
  NetworkError,
} from "./screens";
import { Provider, useDispatch, useSelector } from "react-redux";
import {store} from "./redux";
import { authLogout } from "./redux/actions/auth";
import LottieView from "lottie-react-native";
import { animations } from "./constants";
import axios from "axios";
import RestAuthAPI from "./api/v1/rest-auth";
import indice from "./screens/Course/Indice";
import { TransitionPresets } from "@react-navigation/stack";


const Stack = createSharedElementStackNavigator();
const options = {
  gestureEnabled: false,
  transitionSpec: {
    open: {
      animation: "timing",
      config: {
        duration: 400,
        easing: Easing.inOut(Easing.ease)
      }
    },
    close: {
      animation: "timing",
      config: {
        duration: 400,
        easing: Easing.inOut(Easing.ease)
      }
    }
  },
  cardStyleInterpolator: ({current: {progress}}) => {
    return {
      cardStyle: {
        opacity: progress
      }
    }
  }
}

const LoggedInNavigator = () => (
  <Stack.Navigator
    screenOptions={{
      useNativeDriver: true,
      headerShown: false
    }}
    initialRouteName={'Dashboard'}
    detachInactiveScreens={false}
  >
    <Stack.Screen name="Dashboard" component={MainLayout}/>
    <Stack.Screen name="CourseListing" component={CourseListing} options={() => options}/>
    <Stack.Screen name={"CourseDetails"} component={CourseDetails} options={() => ({...TransitionPresets.SlideFromRightIOS})} />
    <Stack.Screen name={"Indice"} component={indice} options={() => ({...TransitionPresets.SlideFromRightIOS})}/>
  </Stack.Navigator>
)

const NotLoggedInNavigator = ({initialRoute}) => (
  <Stack.Navigator
    screenOptions={{
      useNativeDriver: true,
      headerShown: false
    }}
    initialRouteName={initialRoute}
    detachInactiveScreens={false}
  >
    <Stack.Screen name="Login" component={Login}/>
    <Stack.Screen name="Register" component={Register}/>
    <Stack.Screen name="Welcome" component={Welcome}/>
    <Stack.Screen name="NetworkError" component={NetworkError}/>
  </Stack.Navigator>
)

const RootNavigator = () => {

  const dispatch = useDispatch()
  const onInitRoute = useSelector(state => state.reducer.onInitRoute)

  const onInit = async () => {
    const storageToken = await AsyncStorage.getItem("token")
    if (storageToken) {
      axios.defaults.headers.common["Authorization"] = `Token ${storageToken}`
      RestAuthAPI.autoSignIn(dispatch)
    } else {
      dispatch(authLogout())
    }
  }

  useEffect(() => {
    axios.defaults.baseURL = "https://direito-digital.herokuapp.com";
    onInit()
  }, [])

  switch (onInitRoute) {
    case "LoadingScreen":
      return <View style={{flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f1f1f1"}}><LottieView source={animations.loadingAnimation} autoPlay loop /></View>;
    case "Dashboard":
      return <LoggedInNavigator/>
    case "Welcome":
      return <NotLoggedInNavigator initialRoute={onInitRoute}/>
    case "NetworkError":
      return <NotLoggedInNavigator initialRoute={onInitRoute}/>
  }
}

const App = () => {

  return (
      <Provider store={store}>
        <NavigationContainer>
          <RootNavigator/>
        </NavigationContainer>
      </Provider>
  )
}

export default App
