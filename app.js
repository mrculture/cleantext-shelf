const inputText = document.querySelector("#inputText");
const outputText = document.querySelector("#outputText");
const preview = document.querySelector("#preview");
const statusMessage = document.querySelector("#statusMessage");
const charCount = document.querySelector("#charCount");
const wordCount = document.querySelector("#wordCount");
const hiddenCount = document.querySelector("#hiddenCount");

const options = {
  removeInvisible: document.querySelector("#removeInvisible"),
  normalizeWhitespace: document.querySelector("#normalizeWhitespace"),
  smartQuotes: document.querySelector("#smartQuotes"),
  plainDashes: document.querySelector("#plainDashes"),
  removeTracking: document.querySelector("#removeTracking"),
  redactPersonal: document.querySelector("#redactPersonal"),
};

const hiddenCharacters = new Map([
  ["\u200B", "ZWSP"],
  ["\u200C", "ZWNJ"],
  ["\u200D", "ZWJ"],
  ["\u2060", "WJ"],
  ["\uFEFF", "BOM"],
  ["\u00AD", "SHY"],
  ["\u200E", "LRM"],
  ["\u200F", "RLM"],
  ["\u202A", "LRE"],
  ["\u202B", "RLE"],
  ["\u202C", "PDF"],
  ["\u202D", "LRO"],
  ["\u202E", "RLO"],
  ["\u00A0", "NBSP"],
]);

const SOFT_LIMIT = 100000;
const WARNING_LIMIT = 250000;
const HARD_LIMIT = 500000;
const PREVIEW_LIMIT = 100000;

const hiddenPattern = /[\u200B\u200C\u200D\u2060\uFEFF\u00AD\u200E\u200F\u202A-\u202E\u00A0]/g;
const trackingParameters = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "utm_id",
  "fbclid",
  "gclid",
  "dclid",
  "msclkid",
  "mc_cid",
  "mc_eid",
  "igshid",
]);

const sampleText =
  "Here \u200Bis a messy pasted paragraph with a hidden zero-width space, a non-breaking\u00A0space, smart quotes “like this”, and a tracked link: https://example.com/page?utm_source=facebook&utm_medium=social&fbclid=abc123&keep=this\n\n\nContact me at alex@example.com or +44 7700 900123.";

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function countHidden(value) {
  return (value.match(hiddenPattern) || []).length;
}

function updateStats() {
  const value = inputText.value;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  charCount.textContent = value.length.toLocaleString();
  wordCount.textContent = words.toLocaleString();
  hiddenCount.textContent = countHidden(value).toLocaleString();

  statusMessage.classList.toggle("warning", value.length > WARNING_LIMIT);
  if (value.length > WARNING_LIMIT) {
    statusMessage.textContent = `Large paste detected. Cleaning is allowed up to ${HARD_LIMIT.toLocaleString()} characters, but preview is limited.`;
  } else if (value.length > SOFT_LIMIT) {
    statusMessage.textContent = "Large text may take a moment. Preview is limited if needed.";
  }
}

function renderPreview() {
  const value = inputText.value;

  if (!value) {
    preview.innerHTML = "Paste text to inspect hidden characters.";
    return;
  }

  const visibleValue = value.slice(0, PREVIEW_LIMIT);
  const html = escapeHtml(visibleValue).replace(hiddenPattern, (character) => {
    const label = hiddenCharacters.get(character) || "HIDDEN";
    return `<span class="marker">${label}</span>`;
  });

  const suffix =
    value.length > PREVIEW_LIMIT
      ? `\n\n[Preview limited to ${PREVIEW_LIMIT.toLocaleString()} of ${value.length.toLocaleString()} characters.]`
      : "";

  preview.innerHTML = `${html}${escapeHtml(suffix)}` || "No preview available.";
}

function cleanTrackingLinks(text) {
  return text.replace(/https?:\/\/[^\s<>"')]+/g, (rawUrl) => {
    try {
      const url = new URL(rawUrl);
      [...url.searchParams.keys()].forEach((key) => {
        if (trackingParameters.has(key.toLowerCase())) {
          url.searchParams.delete(key);
        }
      });
      return url.toString();
    } catch {
      return rawUrl;
    }
  });
}

function cleanText() {
  let value = inputText.value;
  statusMessage.classList.remove("warning");

  if (value.length > HARD_LIMIT) {
    outputText.value = "";
    statusMessage.classList.add("warning");
    statusMessage.textContent = `This text is over the ${HARD_LIMIT.toLocaleString()} character limit. Please clean it in smaller chunks.`;
    return;
  }

  if (options.removeInvisible.checked) {
    value = value.replace(hiddenPattern, (character) => (character === "\u00A0" ? " " : ""));
  }

  if (options.smartQuotes.checked) {
    value = value
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/…/g, "...");
  }

  if (options.plainDashes.checked) {
    value = value.replace(/[–—]/g, "-");
  }

  if (options.normalizeWhitespace.checked) {
    value = value
      .replace(/[ \t]+/g, " ")
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  if (options.removeTracking.checked) {
    value = cleanTrackingLinks(value);
  }

  if (options.redactPersonal.checked) {
    value = value
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[email redacted]")
      .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, "[phone redacted]");
  }

  outputText.value = value;
  statusMessage.textContent = "Cleaned text is ready.";
}

async function copyOutput() {
  if (!outputText.value) {
    statusMessage.textContent = "Nothing to copy yet.";
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    statusMessage.textContent = "Copied to clipboard.";
  } catch {
    outputText.select();
    document.execCommand("copy");
    statusMessage.textContent = "Copied using browser fallback.";
  }
}

function clearAll() {
  inputText.value = "";
  outputText.value = "";
  statusMessage.textContent = "";
  updateStats();
  renderPreview();
}

document.querySelector("#cleanButton").addEventListener("click", cleanText);
document.querySelector("#copyButton").addEventListener("click", copyOutput);
document.querySelector("#clearButton").addEventListener("click", clearAll);
document.querySelector("#sampleButton").addEventListener("click", () => {
  inputText.value = sampleText;
  statusMessage.textContent = "Sample loaded.";
  updateStats();
  renderPreview();
});

inputText.addEventListener("input", () => {
  statusMessage.textContent = "";
  statusMessage.classList.remove("warning");
  updateStats();
  renderPreview();
});

Object.values(options).forEach((option) => {
  option.addEventListener("change", () => {
    if (inputText.value) {
      cleanText();
    }
  });
});

updateStats();
renderPreview();
