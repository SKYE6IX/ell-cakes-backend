import * as iuliia from "iuliia";

export const getTransliterationSlug = (name: string) => {
  const transliterated = iuliia.translate(name, iuliia.WIKIPEDIA);
  return transliterated.toLowerCase().replace(/\s+/g, "-").replace(/['"]/g, "");
};
