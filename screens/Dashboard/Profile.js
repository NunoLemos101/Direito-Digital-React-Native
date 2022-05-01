
import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet
} from 'react-native';
import { TouchableRipple } from "react-native-paper";
import { COLORS, FONTS, SIZES, icons, images } from "../../constants";
import {useDispatch, useSelector} from "react-redux";
import { authLogout } from "../../redux/actions/auth";
import IconButton from "../../components/iconButton";
import TextButton from "../../components/TextButton";
import LineDivider from "../../components/LineDivider";

const Profile = () => {

    const dispatch = useDispatch()

    const google = useSelector(state => state.reducer.pictureURI)
    const user = useSelector(state => state.reducer)

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
                    <Text style={{color: COLORS.white, ...FONTS.h1}}>Perfil</Text>
                </View>

                <IconButton icon={icons.sun} iconStyle={{tintColor: COLORS.white}}/>
            </View>
        )
    }

    function renderProfileCard() {
        return (
            <View style={{flexDirection: "row", marginTop: SIZES.padding, paddingHorizontal: SIZES.radius, paddingVertical: 24, borderRadius: SIZES.radius, backgroundColor: COLORS.primary3}}>
                <TouchableOpacity style={{width: 80, height: 80}}>
                    <Image source={{uri: google}} style={{width: "100%", height: "100%", borderRadius: 40, borderWidth: 1, borderColor: COLORS.white}} />
                </TouchableOpacity>
                <View style={{flex: 1, marginLeft: SIZES.radius, alignItems: "flex-start"}}>
                    <TouchableOpacity>
                        <Text style={{color: COLORS.white, ...FONTS.h2}}>{user.username}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <View style={{flex: 1, backgroundColor: COLORS.white}}>
            {renderHeader()}
            <ScrollView contentContainerStyle={{paddingHorizontal: SIZES.padding, paddingBottom: 150}}>
                {renderProfileCard()}
                <TouchableRipple
                    onPress={() => dispatch(authLogout())}
                    rippleColor="rgba(0, 0, 0, .32)"
                    style={{padding: 30, backgroundColor: COLORS.primary, borderRadius: 5}}
                >
                    <Text>Logout</Text>
                </TouchableRipple>
            </ScrollView>
        </View>
    )
}

export default Profile;
