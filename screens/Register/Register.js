import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Text, TextInput, TouchableOpacity, View, StyleSheet, StatusBar, TouchableWithoutFeedback } from "react-native";
import { COLORS, FONTS, icons, images, SIZES, constants } from "../../constants";
import { Shadow } from "react-native-shadow-2";
import TextButton from "../../components/TextButton";
import RestAuthAPI from "../../api/v1/rest-auth";
import { useDispatch } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

const ERROR_COLOR = "#ce0000"

const RegisterLabel = () => (
    <>
        <Text style={{color: COLORS.black, ...FONTS.h2}}>Regista-te</Text>
        <Text style={{color: COLORS.black, ...FONTS.h2}}>para continuares</Text>
    </>
)

const ErrorLabel = (error) => <Text style={{color: COLORS.black, ...FONTS.h2}}>{error.message}</Text>


const Register = ({navigation}) => {

    const dispatch = useDispatch();

    const components = {
        registerLabel: RegisterLabel,
        errorLabel: ErrorLabel
    }

    const [error, setError] = useState(null)
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password1, setPassword1] = useState()
    const [password2, setPassword2] = useState()
    const [loading, setLoading] = useState(false)

    const [cardMessage, setCardMessage] = useState({label: "Bem vindo ao Direito Digital", background: "#252525"})

    const onRegisterError = (error) => {
        setLoading(false)
        console.log(error.response.status)
        if (error.response.status === 400) {
            setError(error)
        } else {
            // in case of an unexpected error
            setError(error)
            setCardMessage({label: "Aconteceu um erro inesperado", background: ERROR_COLOR })
        }
    }


    const performRegister = () => {
        setLoading(true);
        const data = { username: username, email: email, password1: password1, password2: password2 };
        RestAuthAPI.register(data, dispatch, onRegisterError)
    }

    const performGoogleLogin = async () => {
        try {
            setLoading(true)
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            RestAuthAPI.googleOAuth({code: userInfo.serverAuthCode}, dispatch)
        } catch (error) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                setLoading(false)
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                setLoading(false)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                setLoading(false)
                setCardMessage({label: "Google Play Services não está disponivel neste dispositivo", background: ERROR_COLOR })
            } else {
                // some other error happened
                console.log(error)
                setLoading(false)
                setCardMessage({label: "Aconteceu um erro inesperado. Tente novamente", background: ERROR_COLOR })
            }
        }
    }

    const Label = () => {
        if (error) {
            const errors = []
            if (error.response.data.email) errors.push(["email", error.response.data.email])
            if (error.response.data.username) errors.push(["username", error.response.data.username])
            if (error.response.data.password1) errors.push(["password1", error.response.data.password1])
            if (error.response.data.password2) errors.push(["password2", error.response.data.password2])
            if (error.response.data.non_field_errors) errors.push(['field error', error.response.data.non_field_errors])

            return (
                <>
                { errors.map((item, index) => <Text style={{color: "red", ...FONTS.body4}}>* {item[0]} : {constants.translation_EN_PT[item[1]]}</Text> )}
                </>
            )
        }
        return (
            <>
                <Text style={{color: COLORS.black, ...FONTS.h2}}>Regista-te</Text>
                <Text style={{color: COLORS.black, ...FONTS.h2}}>para continuares</Text>
            </>

        )
    }

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: "468886173237-slod99lh6s91h75p0spkfbt745no22o0.apps.googleusercontent.com",
            offlineAccess: true,
            forceCodeForRefreshToken: true
        })
    }, [])

    const img = require("../../assets/images/bg_1.png")
    return (
        <>
            <ImageBackground resizeMode="cover" source={img} style={{height: "100%", flex: 1, backgroundColor: "#f6f6f6"}}>
                <StatusBar backgroundColor={"#A9D5C0"}/>
                { loading ? <LoadingModal/> : null }
                <View style={{ height: "100%", marginTop: 50, alignItems: "center"}}>
                    <Shadow viewStyle={{backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 15, width: SIZES.width - 60}}>
                        <View>
                            <Label/>
                            <View style={{marginTop: 15}}>
                                <TextInput onChangeText={(text) => setUsername(text)} placeholder={"Nome de utilizador"} style={{paddingLeft: 10, backgroundColor: COLORS.gray10, borderRadius: SIZES.base}}/>
                                <TextInput onChangeText={(text) => setEmail(text)} placeholder={"E-mail"} style={{marginTop: 15, paddingLeft: 10, backgroundColor: COLORS.gray10, borderRadius: SIZES.base}}/>
                                <TextInput onChangeText={(text) => setPassword1(text)} placeholder={"Password"} secureTextEntry={true} style={{marginTop: 15, paddingLeft: 10, backgroundColor: COLORS.gray10, borderRadius: SIZES.base}}/>
                                <TextInput onChangeText={(text) => setPassword2(text)} placeholder={"Confirma a password"} secureTextEntry={true} style={{marginTop: 15, paddingLeft: 10, backgroundColor: COLORS.gray10, borderRadius: SIZES.base}}/>

                            </View>
                            <TextButton
                                contentContainerStyle={{
                                    height: 50,
                                    marginTop: 50,
                                    backgroundColor: COLORS.primary3,
                                    borderRadius: SIZES.radius,
                                }}
                                label="Regista-te"
                                labelStyle={{
                                    color: COLORS.white,
                                    ...FONTS.body3
                                }}
                                //onPress
                                onPress={performRegister}
                            />
                        </View>
                    </Shadow>
                    <View style={{marginTop: 30, alignItems: "center"}}>
                        <Shadow viewStyle={{backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 15, width: SIZES.width - 60}}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("Login")}>
                                <Text style={{textAlign: "center", color: COLORS.black, ...FONTS.body3}}>Já tens conta? <Text style={{color: COLORS.black, ...FONTS.h3}}>Inicia sessão</Text></Text>
                            </TouchableWithoutFeedback>
                            <Text style={{marginTop: 30, marginBottom: 5, textAlign: "center", color: COLORS.black, ...FONTS.body3}}>Ou regista-te com</Text>
                            <TouchableOpacity onPress={performGoogleLogin} style={{backgroundColor: COLORS.primary3, alignItems: "center", paddingVertical: 10, borderRadius: SIZES.radius}}>
                                <Image source={icons.google} style={{width: 30, height: 30}}/>
                            </TouchableOpacity>
                        </Shadow>
                    </View>
                </View>
            </ImageBackground>
        </>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    searchSection: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray10,
    },
    searchIcon: {
        backgroundColor: COLORS.gray10,
        padding: 10,
        tintColor: "red",
        width: 40,
        height: 40
    },
    input: {
        flex: 1,
        paddingTop: 40,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 0,
        backgroundColor: COLORS.gray10,
        color: '#424242',
    },

})

export default Register;
