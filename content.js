


(() => {
    // ky kod lejon perdorimin e fontave te programit nga cdo device
    if (document.getElementById("dyslexia-fontfaces")) return;

    const dyslexicUrl = chrome.runtime.getURL("fonts/OpenDyslexic-Regular.otf");
    const lexendUrl = chrome.runtime.getURL("fonts/Lexend-Regular.ttf");

    const css = `
@font-face {
  font-family: "OpenDyslexic";
  src: url("${dyslexicUrl}") format("opentype");
  font-weight: normal;
  font-style: normal;
}
@font-face {
  font-family: "Lexend";
  src: url("${lexendUrl}") format("truetype");
  font-weight: normal;
  font-style: normal;
}
  `.trim();

    const style = document.createElement("style");
    style.id = "dyslexia-fontfaces";
    style.textContent = css;
    document.documentElement.appendChild(style);
})();










const DEFAULT_SETTINGS = {
    enabled: false,
    font: "Original Font",
    letterSpacing: 0,
    wordSpacing: 0,
    bgEnabled: false,
    bgColor: "#ffffff"
};

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

function applySettings(settings) {
    const merged = { ...DEFAULT_SETTINGS, ...settings };
    const root = document.documentElement;
    const body = document.body;

    if (!root || !body) return;

    if (merged.enabled) {
        root.classList.add("dyslexia-helper-active");

        root.style.setProperty("--dys-font-family", getFontFamily(merged.font));
        root.style.setProperty("--dys-letter-spacing", `${merged.letterSpacing}px`);
        root.style.setProperty("--dys-word-spacing", `${merged.wordSpacing}px`);
        root.style.setProperty("--dys-bg-color", merged.bgColor || "#fff9b0");

        if (merged.bgEnabled) {
            body.classList.add("dyslexia-helper-bg");
            body.style.backgroundColor = merged.bgColor || "#fff9b0";
        } else {
            body.classList.remove("dyslexia-helper-bg");
            body.style.backgroundColor = "";
        }
    } else {
        root.classList.remove("dyslexia-helper-active");
        body.classList.remove("dyslexia-helper-bg");

        root.style.removeProperty("--dys-font-family");
        root.style.removeProperty("--dys-letter-spacing");
        root.style.removeProperty("--dys-word-spacing");
        root.style.removeProperty("--dys-bg-color");

        body.style.backgroundColor = "";
    }
}

function initFromStorage() {
    chrome.storage.sync.get(DEFAULT_SETTINGS, stored => {
        applySettings(stored);
    });
}

chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "sync") return;

    chrome.storage.sync.get(DEFAULT_SETTINGS, current => {
        const merged = { ...current };

        if (changes.enabled) merged.enabled = changes.enabled.newValue;
        if (changes.font) merged.font = changes.font.newValue;
        if (changes.letterSpacing) merged.letterSpacing = changes.letterSpacing.newValue;
        if (changes.wordSpacing) merged.wordSpacing = changes.wordSpacing.newValue;
        if (changes.bgEnabled) merged.bgEnabled = changes.bgEnabled.newValue;
        if (changes.bgColor) merged.bgColor = changes.bgColor.newValue;

        applySettings(merged);
    });
});

initFromStorage();

