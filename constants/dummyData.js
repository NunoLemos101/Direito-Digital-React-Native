import CC from "../data/CC";
import CP from "../data/CP";
import CT from "../data/CT";
import CPC from "../data/CPC";
import CRP from "../data/CRP";
import CPP from "../data/CPP";
import CPA from "../data/CPA";
import CPT from "../data/CPT";
import CPPT from "../data/CPPT";
import CPTA from "../data/CPTA";
import CSC from "../data/CSC";
import CRComercial from "../data/CRComercial";
import LGT from "../data/LGT";
import RGIT from "../data/RGIT";
import CRCivil from "../data/CRCivil";
import CE from "../data/CE";
import NCPI from "../data/NCPI";
import CVM from "../data/CVM";

const cc = {
    id: 1,
    code: "CC",
    rows: CC.rows,
    articles: CC.articles,
    indice: CC.indice,
    title: "Código Civil",
    article_count: "2381 Artigos",
    last_edited: "10 de Janeiro de 2022",
    thumbnail: require("../assets/images/books-2.jpg")
}

const cpc = {
    id: 2,
    code: "CPC",
    rows: CPC.rows,
    articles: CPC.articles,
    indice: CC.indice,
    title: "Código Processo Civil",
    article_count: "1144 Artigos",
    last_edited: "13 de Setembro de 2021",
    thumbnail: require("../assets/images/books.jpeg")
}

const crp = {
    id: 3,
    code: "CRP",
    rows: CRP.rows,
    articles: CRP.articles,
    indice: CC.indice,
    title: "Constituição",
    article_count: "296 Artigos",
    last_edited: "12 de Agosto de 2005",
    thumbnail: require("../assets/images/books3.jpg")
}

const cp = {
    id: 4,
    code: "CP",
    rows: CP.rows,
    articles: CP.articles,
    indice: CC.indice,
    title: "Código Penal",
    article_count: "389 Artigos",
    last_edited: "21 de Dezembro de 2021",
    thumbnail: require("../assets/images/law-2.jpeg")
}

const cpp = {
    id: 5,
    code: "CPP",
    rows: CPP.rows,
    articles: CPP.articles,
    indice: CC.indice,
    title: "Código Processo Penal",
    article_count: "548 Artigos",
    last_edited: "21 de Dezembro de 2021",
    thumbnail: require("../assets/images/law.jpeg")
}

const ct = {
    id: 6,
    code: "CT",
    rows: CT.rows,
    articles: CT.articles,
    indice: CC.indice,
    title: "Código do Trabalho",
    article_count: "566 Artigos",
    last_edited: "3 de Janeiro de 2022",
    thumbnail: require("../assets/images/books.jpeg")
}

const cpt = {
    id: 7,
    code: "CPT",
    rows: CPT.rows,
    articles: CPT.articles,
    indice: CC.indice,
    title: "Código de Processo do Trabalho",
    article_count: "249 Artigos",
    last_edited: "9 de Setembro de 2019",
    thumbnail: require("../assets/images/books.jpeg")
}

const cpa = {
    id: 8,
    code: "CPA",
    rows: CPA.rows,
    articles: CPA.articles,
    indice: CC.indice,
    title: "CPA",
    article_count: "203 Artigos",
    last_edited: "16 de Novembro de 2020",
    thumbnail: require("../assets/images/books-2.jpg")
}

const cpta = {
    id: 9,
    code: "CPTA",
    rows: CPTA.rows,
    articles: CPTA.articles,
    indice: CC.indice,
    title: "CPTA",
    article_count: "210 Artigos",
    last_edited: "16 de Agosto de 2021",
    thumbnail: require("../assets/images/books-2.jpg")
}

const csc = {
    id: 10,
    code: "CSC",
    rows: CSC.rows,
    articles: CSC.articles,
    indice: CC.indice,
    title: "Sociedades Comerciais",
    article_count: "617 Artigos",
    last_edited: "11 de Janeiro de 2021",
    thumbnail: require("../assets/images/books-2.jpg")
}

const crcomercial = {
    id: 11,
    code: "CRComercial",
    rows: CRComercial.rows,
    articles: CRComercial.articles,
    indice: CC.indice,
    title: "Registo Comercial",
    article_count: "155 Artigos",
    last_edited: "11 de Janeiro de 2021",
    thumbnail: require("../assets/images/books-2.jpg")
}

const lgt = {
    id: 12,
    code: "LGT",
    rows: LGT.rows,
    articles: LGT.articles,
    indice: CC.indice,
    title: "Lei Geral Tributária",
    article_count: "134 Artigos",
    last_edited: "26 de Fevereiro de 2021",
    thumbnail: require("../assets/images/books-2.jpg")
}

const cppt = {
    id: 13,
    code: "CPPT",
    rows: CPPT.rows,
    articles: CPPT.articles,
    indice: CC.indice,
    title: "CPPT",
    article_count: "316 Artigos",
    last_edited: "16 de Agosto de 2021",
    thumbnail: require("../assets/images/books-2.jpg")
}

const rgit = {
    id: 14,
    code: "RGIT",
    rows: RGIT.rows,
    articles: RGIT.articles,
    indice: CC.indice,
    title: "RGIT",
    article_count: "140 Artigos",
    last_edited: "26 de Fevereiro de 2021",
    thumbnail: require("../assets/images/law.jpeg")
}

const crcivil = {
    id: 15,
    code: "CRCivil",
    rows: CRCivil.rows,
    articles: CRCivil.articles,
    indice: CC.indice,
    title: "Registo Civil",
    article_count: "347 Artigos",
    last_edited: "14 de Agosto de 2018",
    thumbnail: require("../assets/images/law.jpeg")
}

const ce = {
    id: 16,
    code: "CE",
    rows: CE.rows,
    articles: CE.articles,
    indice: CC.indice,
    title: "Código da Estrada",
    article_count: "199 Artigos",
    last_edited: "24 de Agosto de 2021",
    thumbnail: require("../assets/images/law.jpeg")
}

const ncpi = {
    id: 17,
    code: "NCPI",
    rows: NCPI.rows,
    articles: NCPI.articles,
    indice: CC.indice,
    title: "NCPI",
    article_count: "375 Artigos",
    last_edited: "29 de Janeiro de 2021",
    thumbnail: require("../assets/images/law.jpeg")
}

const cvm = {
    id: 18,
    code: "CVM",
    rows: CVM.rows,
    articles: CVM.articles,
    indice: CC.indice,
    title: "CVM",
    article_count: "655 Artigos",
    last_edited: "31 de Dezembro de 2021",
    thumbnail: require("../assets/images/law.jpeg")
}

const codigos = [
    CC.object,
    cpc,
    crp,
    crcivil,
    cp,
    cpp,
    ct,
    cpt,
    cpa,
    cpta,
    csc,
    crcomercial,
    lgt,
    cppt,
    rgit,
    ce,
    ncpi,
    cvm
]

const codigos_dict = {
    cc: cc,
    cpc: cpc,
    crp: crp,
    crcivil: crcivil,
    cp: cp,
    cpp: cpp,
    ct: ct,
    cpt: cpt,
    cpa: cpa,
    cpta: cpta,
    csc: csc,
    crcomercial: crcomercial,
    lgt: lgt,
    cppt: cppt,
    rgit: rgit,
    ce: ce,
    ncpi: ncpi,
    cvm: cvm
}

const categories_thumbnails = {
    "BG_1": require("../assets/images/bg_1.png"),
    "BG_2": require("../assets/images/bg_2.png"),
    "BG_3": require("../assets/images/bg_3.png"),
    "BG_4": require("../assets/images/bg_4.png"),
    "BG_5": require("../assets/images/bg_5.png"),
    "BG_6": require("../assets/images/bg_6.png"),
}

const categories = [
    {
        id: 0,
        key: "extra_0",
        title: "Área Civil",
        themeColor: "#42C6A5",
        codigos: [cc, cpc, crp, crcivil],
        thumbnail: require("../assets/images/bg_1.png")
    },
    {
        id: 1,
        key: "extra_1",
        title: "Área Penal",
        themeColor: "#E5C184",
        codigos: [cp, cpp, rgit],
        thumbnail: require("../assets/images/bg_2.png")
    },
    {
        id: 2,
        key: "extra_2",
        title: "Administrativo",
        themeColor: "#98A6EF",
        codigos: [cpa, cpta],
        thumbnail: require("../assets/images/bg_3.png")
    },
    {
        id: 3,
        key: "extra_3",
        title: "Trabalho",
        codigos: [ct, cpt],
        themeColor: "#64BEE1",
        thumbnail: require("../assets/images/bg_4.png")
    },
    {
        id: 4,
        key: "extra_4",
        title: "Comercial",
        themeColor: "#657286",
        codigos: [csc, crcomercial, ncpi, cvm],
        thumbnail: require("../assets/images/bg_6.png")
    },
    {
        id: 5,
        key: "extra_5",
        title: "Fiscal",
        themeColor: "#98A6EF",
        codigos: [lgt, cppt, rgit],
        thumbnail: require("../assets/images/bg_3.png")
    },
    {
        id: 6,
        key: "extra_6",
        title: "Outros",
        themeColor: "#FC9BA1",
        codigos: [ce],
        thumbnail: require("../assets/images/bg_5.png")
    },
]

const top_searches = [
    {
        id: 0,
        label: "Mandato"
    },
    {
        id: 1,
        label: "Dívorcio"
    },
    {
        id: 2,
        label: "Benfeitorias"
    },
    {
        id: 3,
        label: "Erro"
    },
]


export default { categories, top_searches, codigos, codigos_dict, categories_thumbnails };
