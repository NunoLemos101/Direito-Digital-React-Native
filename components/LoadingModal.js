import {Provider} from "react-native-paper";
import {Modal, View} from "react-native";
import LottieView from "lottie-react-native";
import {animations} from "../constants";
import React from "react";

const LoadingModal = () => (
  <Provider>
    <Modal transparent={true} visible={true} animationType={"fade"}>
      <View style={{flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", height: "100%"}}>
        <LottieView source={animations.loadingAnimation} autoPlay loop />
      </View>
    </Modal>
  </Provider>
)

export default LoadingModal;
