import handlebars from "handlebars";
import fs from "fs";

handlebars.registerHelper("eq", function (a, b) {
  return a == b;
});

handlebars.registerHelper("signedNumber", function (value) {
  if (typeof value === "string") {
    value = Number(value);
  }

  if (value < 0) {
    return String(value);
  } else {
    return `+${value}`;
  }
});

handlebars.registerHelper("firstChar", function (value) {
  if (typeof value === "string" && value.length > 0) {
    return value.charAt(0);
  } else {
    return "";
  }
});

/**
 * Get a handlebars template from a filename
 * Also automatically registers helper functions
 * @param filename the name of the template file
 */
export default function getTemplateFromFile(filename: string) {
  const templateSource = fs.readFileSync(filename, "utf8");
  const template = handlebars.compile(templateSource);
  return template;
}
