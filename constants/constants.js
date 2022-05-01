const screens = {
    home: "Home",
    search: "Search",
    profile: "Profile"
}

const bottom_tabs = [
    {
        id: 0,
        label: screens.home,
        icon: require("../assets/icons/home.png")
    },
    {
        id: 1,
        label: screens.search,
        icon: require("../assets/icons/search.png")
    },
    {
        id: 2,
        label: screens.profile,
        icon: require("../assets/icons/profile.png")
    }
]

const course_details_tabs = [
    {
        id: 0,
        label: "Páginas",
    },
    {
        id: 1,
        label: "Artigos",
    },
    {
        id: 2,
        label: "Ler",
    },
]

const indice_tabs = [
    {
        id: 0,
        label: "Indíce",
    },
    {
        id: 1,
        label: "Artigos",
    },
    {
        id: 2,
        label: "Ler",
    },
]

const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"
]

const week_days = [
    "Domingo",
    "Segunda-Feira",
    "Terça-Feira",
    "Quarta-Feira",
    "Quinta-Feira",
    "Sexta-Feira",
    "Sábado"
]

const translation_EN_PT = {
    "This field is required.": "Este campo é necessário",
    "This field may not be blank.": "Este campo não pode ficar em branco",
    "Enter a valid email address.": "Insere um endereço de e-mail valido",
    "A user is already registered with this e-mail address.": "Um utilizador já está registado com este endereço de e-mail",
}

const class_types = [
    {
        id: 0,
        label: "Negrito",
        icon: require("../assets/icons/bold.png"),
        key: "fontWeight",
        value1: "normal",
        value2: "bold"
    },
    {
        id: 1,
        label: "Itálico",
        icon: require("../assets/icons/italic-font.png"),
        key: "fontStyle",
        value1: "normal",
        value2: "italic"
    },
]

const font_families = [
    {
        id: 0,
        font: "monospace"
    },
    {
        id: 3,
        font: "Roboto-Regular"
    },
    {
        id: 5,
        font: "sans-serif-light"
    },
    {
        id: 6,
        font: "sans-serif-thin"
    },
    {
        id: 7,
        font: "sans-serif-condensed"
    },
    {
        id: 8,
        font: "sans-serif-medium"
    },
    {
        id: 9,
        font: "serif"
    },
]

const font_sizes = [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40]

export default { screens, bottom_tabs, course_details_tabs, months, week_days, translation_EN_PT, indice_tabs, class_types, font_families, font_sizes };
