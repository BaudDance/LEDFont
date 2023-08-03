import axios from "axios";

const baseURL = "http://led.baud-dance.com/api";
// baseURL = "/api";

export async function getFontGlyph(font, width, height, text, mode, color) {
  return await axios.get(`${baseURL}/glyph`, {
    params: {
      font,
      width,
      height,
      text,
      mode,
      color,
    },
  });
}
