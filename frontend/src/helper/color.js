const ILLICIT = "rgb(184, 67, 4)"
const LICIT =   "rgb(255, 165, 0)"
const UNKNOWN = "rgb(60, 60, 250)"

const getColor = (group) => {
    if (group == "1") return ILLICIT;
    if (group == "2") return LICIT;
    if (group == "3") return UNKNOWN;
    return "rgb(255, 0, 255)"
}

export default getColor;