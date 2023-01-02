import React, { useRef, useState } from "react";
import { View, TextInput, FlatList, Text, TouchableOpacity, Keyboard } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { COLORS, FONTS, SIZES, icons } from "../constants";
import IconButton from "./iconButton";
import { searchForResults } from "../utility";

const civilArea = ["CC", "CPC", "CRP", "CRCivil"]
const civilQaArea = ["QA_PC_EXECUTIVO", "QA_PC_DECLARATIVO"]
const civilLexionarioArea = ["TGDC_LEX"]
const civilIndiceArea = ["CC_INDICE", "CPC_INDICE"]
const penalArea = ["CP", "CPP", "RGIT"]
const administrativoArea = ["CPA", "CPTA"]
const trabalhoArea = ["CT", "CPT"]
const comercialArea = ["CRComercial", "CSC", "NCPI", "CVM", "CIRE"]
const fiscalArea = ["LGT", "CPPT", "RGIT"]
const outrosArea = ["CE"]

const dict = {
    "CC": "Código Civil",
    "CPC": "Código de Processo Civil",
    "CRP": "Constituição da República",
    "CRCivil": "Código do Registo Civil",
    "QA_PC_EXECUTIVO": "Processo Civil Executivo",
    "QA_PC_DECLARATIVO": "Processo Civil Declarativo",
    "CP": "Código Penal",
    "CPP": "Código Processo Penal",
    "RGIT": "RGIT",
    "CPA": "CPA",
    "CPTA": "CPTA",
    "CT": "Código do Trabalho",
    "CPT": "Código do Processo de Trabalho",
    "CRComercial": "Código do Registo Comercial",
    "CSC": "Sociedades Comerciais",
    "NCPI": "NCPI",
    "CVM": "Valores Imobiliários",
    "CIRE": "CIRE",
    "LGT": "Lei Geral Tributária",
    "CPPT": "CPPT",
    "CE": "Código da Estrada",
    "TGDC_LEX": "Teoria Geral do Direito Civil"
}

const CivilResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#f5fffc", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#42C6A5"}}>Área Civil</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const CivilQaResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#f5fffc", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#42C6A5"}}>Área Civil</Text> / Q&A / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const CivilIndiceResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#f5fffc", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#42C6A5"}}>Área Civil</Text> / {dict[item.type.split("_")[0]]} / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>Indíce Temático</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const LexionarioCivilResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#f5fffc", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#42C6A5"}}>Área Civil</Text> / Lexionário / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const PenalResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#fff6ea", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#E5C184"}}>Área Penal</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const AdministrativoResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#e5e9ff", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#8998e7"}}>Administrativo</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const TrabalhoResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#e2f5ff", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#64BEE1"}}>Trabalho</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const ComercialResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#c3cfe0", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#657286"}}>Comercial</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const FiscalResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#dfe2f1", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#8c9bee"}}>Fiscal</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const OutroResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#ffe5e8", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}><Text style={{color: "#FC9BA1"}}>Outros</Text> / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const RgitResult = ({item, onPress}) => {
    return (
        <TouchableOpacity onPress={onPress} style={{backgroundColor: "#ffffff", paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray10}}>
            <Text style={{paddingLeft: SIZES.radius}}>Penal & Fiscal / Códigos / <Text style={{color: "#1e1e1e",fontWeight: "bold"}}>{dict[item.type]}</Text></Text>
            <View style={{paddingVertical: SIZES.padding}}>
                <Text style={{paddingLeft: SIZES.radius, marginTop: SIZES.radius}}>{item.title1}</Text>
                <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
            </View>
        </TouchableOpacity>
    )
}

const SearchModal = ({sharedValue, setToogleState, onArticleSelect, codesToSearch, paddingBottom, placeholder="Pesquisar..."}) => {

  const searchRef = useRef();

  const [input, setInput] = useState("")
  const [queryData, setQueryData] = useState({matches: []});

  const contentAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(sharedValue.value, [SIZES.height, 0], [0, 1]),
      transform: [ { translateY: sharedValue.value } ]
    }
  })

  function renderSearchBar() {
    return (
      <View>
        <View style={{
          height: 50,
          backgroundColor: COLORS.primary3,
        }}>
          <View style={{flexDirection: "row", marginTop: 5}}>
            <TextInput
              ref={searchRef}
              onChangeText={(text) => {
                setInput(text);
                setQueryData(searchForResults(text, codesToSearch))
              }}
              style={{height: 35, marginHorizontal: 10, flex: 1, borderRadius: 5, backgroundColor: COLORS.white, ...FONTS.body5}}
              value={input}
              placeholder={placeholder}
              placeholderTextColor={COLORS.gray20}
            />
            <IconButton
              icon={icons.close}
              iconStyle={{tintColor: COLORS.white, width: 15, height: 15}}
              containerStyle={{width: 35, height: 35, marginRight: 20, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.primary, borderRadius: 25}}
              onPress={() => {
                setToogleState(false)
                sharedValue.value = withTiming(SIZES.height, { duration: 500})
              }}
            />
          </View>
        </View>
        {queryData.execTime !== undefined &&
          (<View>
            <Text style={{color: COLORS.white, paddingVertical: 5, paddingLeft: 10, backgroundColor: COLORS.primary}}>{queryData.matches.length} resultados em {queryData.execTime.toFixed(2)} ms</Text>
          </View>)}
      </View>
    )
  }

  const renderItem = ({item, index}) => {

      const onResultPress = () => onArticleSelect(item)

    if (civilArea.includes(item.type)) {
        return <CivilResult item={item} onPress={onResultPress}/>
    } else if (civilQaArea.includes(item.type)) {
        return <CivilQaResult item={item} onPress={onResultPress}/>
    } else if (civilIndiceArea.includes(item.type)) {
        return <CivilIndiceResult item={item} onPress={onResultPress}/>
    } else if (administrativoArea.includes(item.type)) {
        return <AdministrativoResult item={item} onPress={onResultPress}/>
    } else if (civilLexionarioArea.includes(item.type)) {
        return <LexionarioCivilResult item={item} onPress={onResultPress}/>
    } else if (trabalhoArea.includes(item.type)) {
        return <TrabalhoResult item={item} onPress={onResultPress}/>
    } else if (comercialArea.includes(item.type)) {
        return <ComercialResult item={item} onPress={onResultPress}/>
    } else if (item.type === "RGIT") {
        return <RgitResult item={item} onPress={onResultPress}/>
    } else if (fiscalArea.includes(item.type)) {
        return <FiscalResult item={item} onPress={onResultPress}/>
    }  else if (penalArea.includes(item.type)) {
        return <PenalResult item={item} onPress={onResultPress}/>
    } else if (outrosArea.includes(item.type)) {
        return <OutroResult item={item} onPress={onResultPress}/>
    }

    return (
      <TouchableOpacity onPress={onResultPress} style={{backgroundColor: COLORS.white, paddingVertical: SIZES.radius, borderBottomWidth: 1, borderBottomColor: COLORS.gray90}}>
        <Text style={{paddingLeft: SIZES.radius}}>{item.type}</Text>
        <Text style={{paddingLeft: SIZES.radius}}>{item.title1}</Text>
        <Text style={{paddingLeft: SIZES.radius}}>{item.title2}</Text>
      </TouchableOpacity>
    )
  }

  return (
     <Animated.View
        style={[{
          position: "absolute",
          height: SIZES.height,
          width: SIZES.width,
          backgroundColor: COLORS.white,
            paddingBottom: paddingBottom ? paddingBottom : 0
        }, contentAnimatedStyle]}
      >
        {/* Header */}
          {renderSearchBar()}
        <FlatList onScrollBeginDrag={() => { Keyboard.dismiss() }} initialNumToRender={1} data={queryData.matches} keyExtractor={(item, index) => `SearchResults-${item.id}-${index}`} renderItem={renderItem}/>
   </Animated.View>
  )
}

export default SearchModal;

