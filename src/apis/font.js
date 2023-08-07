import axios from "axios";

const baseURL = import.meta.env.VITE_BACKEND_UAL;

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
