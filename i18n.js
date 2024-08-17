// Copyright ZaptoInc, 2023

const fs = require("fs");
const path = require("path");

const complexLangCodes = {
  id: ["id"],
  en: ["en-US", "en-GB"],
  bg: ["bg"],
  zh: ["zh-CN", "zh-TW"],
  hr: ["hr"],
  cs: ["cs"],
  da: ["da"],
  nl: ["nl"],
  fi: ["fi"],
  fr: ["fr"],
  de: ["de"],
  el: ["el"],
  hi: ["hi"],
  hu: ["hu"],
  it: ["it"],
  ja: ["ja"],
  ko: ["ko"],
  lt: ["lt"],
  no: ["no"],
  pl: ["pl"],
  pt: ["pt-BR"],
  ro: ["ro"],
  ru: ["ru"],
  es: ["es-ES"],
  sv: ["sv-SE"],
  th: ["th"],
  tr: ["tr"],
  uk: ["uk"],
  vi: ["vi"],
};

let languages = {};

function load() {
  const foldersPath = path.join(__dirname, "languages");

  const langFolders = fs.readdirSync(foldersPath);

  for (const folder of langFolders) {
    const langFolderPath = path.join(foldersPath, folder);
    const langCode = simplifyLangCode(folder);
    const langFiles = fs
      .readdirSync(langFolderPath)
      .filter((file) => file.endsWith(".json"));

    for (const file of langFiles) {
      const filePath = path.join(langFolderPath, file);
      const fileCode = simplifyLangCode(file.replace(".json", ""));
      const lang = require(filePath);
      if (!languages[langCode]) {
        languages[langCode] = {};
      }

      Object.keys(lang).forEach((translationKey) => {
        languages[langCode][fileCode + "." + translationKey] =
          lang[translationKey];
      });
    }
  }
}

function translate(
  langCode,
  path,
  arguments,
  originalLangCode = langCode,
  sendPlaceholderValue = true
) {
  const simplifiedLangCode = simplifyLangCode(langCode);

  const defaultValue = `${simplifyLangCode(originalLangCode)}.${path}`;
  if (languages[simplifiedLangCode]) {
    if (languages[simplifiedLangCode][path]) {
      let translation = languages[simplifiedLangCode][path];
      let argumentsFilledTranslation = translation;

      if (arguments) {
        for (const [key, value] of Object.entries(arguments)) {
          argumentsFilledTranslation = argumentsFilledTranslation.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, "g"),
            value
          );
        }
      }

      return argumentsFilledTranslation;
    } else {
      if (sendPlaceholderValue) {
        if (simplifiedLangCode == "en") {
          return defaultValue;
        } else {
          return translate("en", path, arguments, langCode);
        }
      } else {
        return null;
      }
    }
  } else {
    if (sendPlaceholderValue) {
      if (simplifiedLangCode == "en") {
        return defaultValue;
      } else {
        return translate("en", path, arguments, langCode);
      }
    } else {
      return null;
    }
  }
}

function simplifyLangCode(code) {
  let langCode = code.split("-");
  return langCode[0].toLowerCase();
}

function getAllTranslations(path, arguments) {
  let result = {};

  Object.keys(languages).forEach((lang) => {
    let translation = translate(lang, path, arguments, lang, false);

    if (translation) {
      complexLangCodes[lang].forEach((langCode) => {
        result[langCode] = translation;
      });
    }
  });

  if (Object.keys(result).length > 0) {
    return result;
  } else {
    return null;
  }
}

module.exports = {
  load,
  translate,
  languages,
  simplifyLangCode,
  getAllTranslations,
  complexLangCodes,
};
