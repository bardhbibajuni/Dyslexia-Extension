const DEFAULT_SETTINGS = {
    enabled: false,
    font: "Original Font",
    letterSpacing: 0,
    wordSpacing: 0,
    bgEnabled: false,
    bgColor: "#ffffff"
};

const BG_COLORS = {
    White: "#ffffff",
    Beige: "#fef3c7",
    Grey: "#f3f3f3",
    Blue: "#dbeafe"
};
const DEFAULT_SETTINGS = {
    enabled: false,
    font: "Original Font",
    letterSpacing: 0,
    wordSpacing: 0,
    bgEnabled: false,
    bgColor: "#ffffff"
};

const BG_COLORS = {
    White: "#ffffff",
    Beige: "#fef3c7",
    Grey: "#f3f3f3",
    Blue: "#dbeafe"
};

let currentSettings = { ...DEFAULT_SETTINGS };

let toggleEl;
let fontSelectEl;
let letterBar;
let wordBar;
let letterCircle;
let wordCircle;
let fontPreviewText;
let letterPreviewText;
let wordPreviewText;
let colorOptions;
let resetBtn;
let saveBtn;

let letterSliderCtrl;
let wordSliderCtrl;
