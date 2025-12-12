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
 function setupSlider(bar, circle, maxValue, initialValue, onChange) {
    let currentValue = initialValue || 0;

    function positionCircle() {
        const rect = bar.getBoundingClientRect();
        const knobWidth = circle.offsetWidth || 24;
        const maxX = rect.width - knobWidth;
        const ratio = maxValue ? currentValue / maxValue : 0;
        circle.style.left = `${maxX * ratio}px`;
    }

    positionCircle();

    bar.addEventListener("click", e => {
        const rect = bar.getBoundingClientRect();
        let x = e.clientX - rect.left;

        if (x < 0) x = 0;
        if (x > rect.width) x = rect.width;

        currentValue = Math.round((x / rect.width) * maxValue);
        onChange(currentValue);
        positionCircle();
    });

    return {
        setValue(value) {
            currentValue = value;
            positionCircle();
        }
    };
}

function saveSettingsToStorage() {
    chrome.storage.sync.set(currentSettings);
}

document.addEventListener("DOMContentLoaded", () => {
    toggleEl = document.querySelector(".toggle");
    fontSelectEl = document.querySelector(".dropdown");

    const sliderBars = document.querySelectorAll(".slider-bar");
    const sliderCircles = document.querySelectorAll(".slider-circle");

    letterBar = sliderBars[0];
    wordBar = sliderBars[1];
    letterCircle = sliderCircles[0];
    wordCircle = sliderCircles[1];

    fontPreviewText = document.getElementById("fontPreviewText");
    letterPreviewText = document.getElementById("letterSpacingPreview");
    wordPreviewText = document.getElementById("wordSpacingPreview");

    colorOptions = document.querySelectorAll(".color-option");

    resetBtn = document.querySelector(".btn-reset");
    saveBtn = document.querySelector(".btn-save");

    chrome.storage.sync.get(DEFAULT_SETTINGS, stored => {
        currentSettings = { ...DEFAULT_SETTINGS, ...stored };

        letterSliderCtrl = setupSlider(
            letterBar,
            letterCircle,
            10,
            currentSettings.letterSpacing,
            value => {
                currentSettings.letterSpacing = value;
                updateLetterPreview();
            }
        );

        wordSliderCtrl = setupSlider(
            wordBar,
            wordCircle,
            30,
            currentSettings.wordSpacing,
            value => {
                currentSettings.wordSpacing = value;
                updateWordPreview();
            }
        );

        applySettingsToUI();
    });

    toggleEl.addEventListener("click", () => {
        currentSettings.enabled = !currentSettings.enabled;
        updateToggleUI();
        saveSettingsToStorage();
    });

    fontSelectEl.addEventListener("change", () => {
        currentSettings.font =
            fontSelectEl.options[fontSelectEl.selectedIndex].text.trim();
        updateFontUI();
        saveSettingsToStorage();
    });

    colorOptions.forEach(btn => {
        btn.addEventListener("click", () => {
            const label = btn.textContent.trim();
            currentSettings.bgColor = BG_COLORS[label] || "#ffffff";
            currentSettings.bgEnabled = label !== "White";
            updateBgUI();
            saveSettingsToStorage();
        });
    });

    resetBtn.addEventListener("click", () => {
        currentSettings = { ...DEFAULT_SETTINGS };
        applySettingsToUI();
        saveSettingsToStorage();
    });

    saveBtn.addEventListener("click", () => {
        saveSettingsToStorage();
    });
});
