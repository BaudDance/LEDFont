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

export async function getU8g2Fonts() {
  return await axios.get(`${baseURL}/u8g2/fonts`);
}

export async function generateU8g2Font(payload, signal) {
  return await axios.post(`${baseURL}/u8g2/font`, payload, { signal });
}
