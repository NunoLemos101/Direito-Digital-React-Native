import CC from "./CC";
import CPC from "./CPC";
import CP from "./CP";
import CRP from "./CRP";
import CE from "./CE";
import CPA from "./CPA";
import CPTA from "./CPTA";
import CPP from "./CPP";
import RGIT from "./RGIT";
import CPPT from "./CPPT";
import CPT from "./CPT";
import CRCivil from "./CRCivil";
import CRComercial from "./CRComercial";
import CSC from "./CSC";
import CT from "./CT";
import CVM from "./CVM";
import LGT from "./LGT";
import NCPI from "./NCPI";
import CIRE from "./CIRE";
import QA_PC_EXECUTIVO from "./questionsAndAnswers/QA_PC_EXECUTIVO";
import QA_PC_DECLARATIVO from "./questionsAndAnswers/QA_PC_DECLARATIVO";
import TGDC_LEX from "./lexionario/TGDC_LEX";


const removeCharacters = (word, array) => {
    array.map((c) => word = word.replace(c, ''))
    return word;
}

export const generateQuery = () => {

    const unwantedWords = ['a', 'e', 'o', 'da', 'de', 'do', 'em', ' que', 'no', 'nos', 'das', 'dos', 'ao', 'ou', 'à', '', ' ']
    const unwantedCharacters = ['(', ')', '[', ']', '-', '–', ',', '/']
    const query = {words: [], articles: {}}

    const datasets = [
        {'data': CC.articles, length: 24, type: "CC"},
        {'data': CPC.articles, length: 12, type: "CPC"},
        {'data': CP.articles, length: 4, type: "CP"},
        {'data': CRP.articles, length: 3, type: "CRP"},
        {'data': CE.articles, length: 2, type: "CE"},
        {'data': CPA.articles, length: 2, type: "CPA"},
        {'data': CPTA.articles, length: 2, type: "CPTA"},
        {'data': CPP.articles, length: 6, type: "CPP"},
        {'data': RGIT.articles, length: 1, type: "RGIT"},
        {'data': CPPT.articles, length: 3, type: "CPPT"},
        {'data': CPT.articles, length: 2, type: "CPT"},
        {'data': CRCivil.articles, length: 3, type: "CRCivil"},
        {'data': CRComercial.articles, length: 1, type: "CRComercial"},
        {'data': CSC.articles, length: 6, type: "CSC"},
        {'data': CT.articles, length: 6, type: "CT"},
        {'data': CVM.articles, length: 4, type: "CVM"},
        {'data': LGT.articles, length: 1, type: "LGT"},
        {'data': NCPI.articles, length: 4, type: "NCPI"},
        {'data': CIRE.articles, length: 3, type: "CIRE"}
    ]

    const qa_datasets = [
        {data: TGDC_LEX.articles, type: "TGDC_LEX"},
        {data: QA_PC_EXECUTIVO.questionsAndAnswers, type: "QA_PC_EXECUTIVO"},
        {data: QA_PC_DECLARATIVO.questionsAndAnswers, type: "QA_PC_DECLARATIVO"}
    ]

    const indice_datasets = [
        {data: CC.indice, type: "CC_INDICE"},
        {data: CPC.indice, type: "CPC_INDICE"}
    ]

    datasets.map((dataset) => {
        if (dataset.length) {
            for (let i = 0; i < dataset.length; i++) {
                dataset.data[i].map((article) => {
                    article["type"] = dataset.type
                    if (article.title2) {
                        const article_splited = article.title2.split(' ')
                        article_splited.map((word) => {
                            word = removeCharacters(word, unwantedCharacters)
                            if (!unwantedWords.includes(word) && word !== '') {
                                if (!query.words.includes(word)) {
                                    query.words.push(word)
                                }
                                if (query.articles[word]) {
                                    query.articles[word].push(article)
                                } else {
                                    query.articles[word] = [article]
                                }
                            }
                        })
                    }
                })
            }
        }
    })

    qa_datasets.map((dataset) => {
        dataset.data.map((article) => {
            article["type"] = dataset.type
            if (article.title) {
                const article_splited = article.title.split(' ')
                article_splited.map((word) => {
                    word = removeCharacters(word, unwantedCharacters)
                    if (!unwantedWords.includes(word) && word !== '') {
                        if (!query.words.includes(word)) {
                            query.words.push(word)
                        }
                        if (query.articles[word]) {
                            query.articles[word].push(article)
                        } else {
                            query.articles[word] = [article]
                        }
                    }
                })
            }
        })
    })

    indice_datasets.map((dataset) => {
        dataset.data.map(item => {
            if (item.artigos) {
                item.artigos.map((article) => {
                    article["type"] = dataset.type
                    if (article.title2) {
                        const article_splited = article.title2.split(' ')
                        article_splited.map((word) => {
                            word = removeCharacters(word, unwantedCharacters)
                            if (!unwantedWords.includes(word) && word !== '') {
                                if (!query.words.includes(word)) {
                                    query.words.push(word)
                                }
                                if (query.articles[word]) {
                                    query.articles[word].push(article)
                                } else {
                                    query.articles[word] = [article]
                                }
                            }
                        })
                    }
                })
            }
        })
    })

    return query
}
