import React, {useState} from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import {COLORS, FONTS, SIZES, icons, images} from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import { authLogout } from "../../redux/actions/auth";
import TextButton from "../../components/TextButton";
import {useNavigation} from "@react-navigation/native";
import axios from "axios";
import LoadingModal from "../../components/LoadingModal";

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

const Profile = () => {

    const dispatch = useDispatch()

    const navigation = useNavigation();
    const google = useSelector(state => state.reducer.pictureURI)
    const user = useSelector(state => state.reducer)
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

    function renderProfile() {

        const renderEmail = () => {
            if (user.socialAccount) {
                const parsedData = JSON.parse(user.socialAccount.extra_data)
                return parsedData.email
            } else if (user.email) {
                return user.email
            } else {
                return "Sem email"
            }
        }

        return (
            <Section title={"Perfil"} buttonLabel={"Logout"} onPress={() => dispatch(authLogout())} containerStyle={{alignContent: "center", alignItems: "center"}}>
                <View style={{width: 80, height: 80, marginTop: 50}}>
                    <Image source={{uri: google}} style={{width: "100%", height: "100%", borderRadius: 40, borderWidth: 1, borderColor: COLORS.white}} />
                </View>
                <Text style={{color: COLORS.black, ...FONTS.h3, marginTop: 5}}>{user.username}</Text>
                <Text style={{color: COLORS.gray40}}>Registou-se a {new Date(user.dateJoined).toLocaleDateString()}</Text>
                {user.socialAccount &&
                    <View style={{paddingVertical: 5, paddingHorizontal: 10, backgroundColor: COLORS.primary3, marginTop: 5, borderRadius: 5}}>
                        <Text style={{color: COLORS.white, ...FONTS.h4}}><Image source={icons.google} style={{width: 15, height: 15}}/> {renderEmail()}</Text>
                    </View>}
            </Section>
        )
    }

    function renderPricingCard() {
        return (
            <Section title={"Preços de lançamento"} buttonLabel={"Detalhes"} containerStyle={{marginTop: 50}}>
                <TouchableOpacity onPress={generateYearlyCheckoutSession} activeOpacity={0.5} style={{flexDirection: "row", backgroundColor:  "#f3f3f3", padding: 10, marginTop: 10, marginHorizontal: SIZES.padding, borderRadius: 5}}>
                    <Image style={{width: 50, height: 50, backgroundColor: COLORS.primary3, borderRadius: 5}} source={images.cube}/>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <Text style={{fontWeight: "bold", fontSize: 16, color: COLORS.black}}>Subscrição anual</Text>
                        <Text style={{color: COLORS.gray50, marginTop: 10}}><Text style={{color: COLORS.gray40, textDecorationLine: "line-through"}}>100,00€ por ano</Text> 14,00€ por ano</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={generateMonthlyCheckoutSession} activeOpacity={0.5} style={{flexDirection: "row", backgroundColor: "#f3f3f3", padding: 10, marginTop: 10, marginHorizontal: SIZES.padding, borderRadius: 5}}>
                    <Image style={{width: 50, height: 50, backgroundColor: COLORS.primary3, borderRadius: 5}} source={images.cube}/>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <Text style={{fontWeight: "bold", fontSize: 16, color: COLORS.black}}>Subscrição mensal</Text>
                        <Text style={{color: COLORS.gray50, marginTop: 10}}><Text style={{textDecorationLine: "line-through"}}>10,50€ por mês</Text> 1,50€ por mês</Text>
                    </View>
                </TouchableOpacity>
                <Text style={{fontSize: 10, marginTop: 10, paddingHorizontal: SIZES.padding, color: COLORS.gray50}}>Os preços de lançamento serão válidos até 31 de Janeiro de 2023.</Text>
            </Section>
        )
    }

    function renderSubscriptionCard() {
        return (
            <Section title={"Sua subscrição"} buttonLabel={"detalhes"} containerStyle={{marginTop: 50}}>
                <View activeOpacity={0.5} style={{flexDirection: "row", backgroundColor:  "#f3f3f3", padding: 10, marginTop: 10, marginHorizontal: SIZES.padding, borderRadius: 5}}>
                    <Image style={{width: 50, height: 50, backgroundColor: COLORS.primary3, borderRadius: 5}} source={images.cube}/>
                    <View style={{flex: 1, marginLeft: 10}}>
                        <Text style={{fontWeight: "bold", fontSize: 16, color: COLORS.black}}>Acesso Premium</Text>
                        <Text style={{color: COLORS.gray50, marginTop: 10}}>Válida até {new Date(user.subscription.valid_until).toLocaleString()}</Text>
                    </View>
                </View>
                <Text style={{fontSize: 10, marginTop: 10, paddingHorizontal: SIZES.padding, color: COLORS.gray50}}>A subscrição é renovada periodicamente consoante o seu plano escolhido.</Text>
            </Section>
        )
    }

    return (
        <ScrollView contentContainerStyle={{paddingTop: 15, flex: 1, backgroundColor: COLORS.white, paddingBottom: 150}}>
            {renderProfile()}
            {user.subscription.is_valid ? renderSubscriptionCard() : renderPricingCard()}
            { loading && <LoadingModal/>}
        </ScrollView>
    )
}

export default Profile;
