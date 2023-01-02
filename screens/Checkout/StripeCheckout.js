import React from "react";
import WebView from "react-native-webview";

const StripeCheckout = ({navigation, route}) => {
    const checkoutUrl = route.params.url;

    const handleRedirect = (event) => {
        if (event.url === "https://example.com/success") {
            navigation.navigate("Dashboard");
        } else if (event.url === "https://example.com/cancel") {
            navigation.navigate("Dashboard")
        }
    }

    return <WebView onNavigationStateChange={handleRedirect} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} source={{uri: checkoutUrl}}/>
}

export default StripeCheckout;
