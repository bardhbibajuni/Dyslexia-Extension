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


function getFontFamily(fontLabel) {
    switch (fontLabel) {
        case "OpenDyslexic":
            return '"OpenDyslexic", sans-serif';
        case "Lexend":
            return '"Lexend", sans-serif';
        case "Comic Sans":
            return '"Comic Sans MS", "Comic Sans", cursive';
        case "Arial":
            return "Arial, Helvetica, sans-serif";
        default:
            return "inherit";
    }
}

function updateToggleUI() {
    if (currentSettings.enabled) {
        toggleEl.classList.add("active");
    } else {
        toggleEl.classList.remove("active");
    }
}

function updateFontUI() {
    const options = Array.from(fontSelectEl.options);
    const index = options.findIndex(
        opt => opt.text.trim() === currentSettings.font
    );

    if (index >= 0) {
        fontSelectEl.selectedIndex = index;
    }

    fontPreviewText.style.fontFamily = getFontFamily(currentSettings.font);
}

function updateLetterPreview() {
    letterPreviewText.style.letterSpacing = `${currentSettings.letterSpacing}px`;
}

function updateWordPreview() {
    wordPreviewText.style.wordSpacing = `${currentSettings.wordSpacing}px`;
}

function updateBgUI() {
    colorOptions.forEach(btn => {
        const label = btn.textContent.trim();
        const color = BG_COLORS[label] || "#ffffff";

        if (currentSettings.bgEnabled && currentSettings.bgColor === color) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

function applySettingsToUI() {
    updateToggleUI();
    updateFontUI();

    if (letterSliderCtrl) {
        letterSliderCtrl.setValue(currentSettings.letterSpacing);
    }

    if (wordSliderCtrl) {
        wordSliderCtrl.setValue(currentSettings.wordSpacing);
    }

    updateLetterPreview();
    updateWordPreview();
    updateBgUI();
}
