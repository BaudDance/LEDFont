
/**
 * 对字模字节数据进行水平/垂直对称反转
 * @param {number[]} data - 字节数据
 * @param {number} w - 宽度(像素)
 * @param {number} h - 高度(像素)
 * @param {string} mode - 取模方式 (列行式/行列式/逐列式/逐行式)
 * @param {boolean} hFlip - 水平反转 (左右镜像)
 * @param {boolean} vFlip - 垂直反转 (上下镜像)
 * @returns {number[]} 反转后的数据副本
 */
export function flipGlyphData(data, w, h, mode, hFlip, vFlip) {
  if (!hFlip && !vFlip) return [...data]

  let result = [...data]

  if (mode === '列行式') {
    const page = Math.ceil(h / 8)
    const ps = w  // 每页字节数

    if (hFlip) {
      // 水平：每页内反转列顺序
      for (let p = 0; p < page; p++) {
        const base = p * ps
        for (let c = 0; c < w / 2; c++) {
          const a = base + c
          const b = base + (w - 1 - c)
            ;[result[a], result[b]] = [result[b], result[a]]
        }
      }
    }

    if (vFlip) {
      // 垂直：反转页顺序 + 每字节内位反转
      const temp = [...result]
      for (let p = 0; p < page; p++) {
        const srcP = page - 1 - p
        for (let c = 0; c < w; c++) {
          let byte = temp[srcP * ps + c]
          byte = reverseBits(byte)
          result[p * ps + c] = byte
        }
      }
    }

  } else if (mode === '逐列式') {
    const page = Math.ceil(h / 8)

    if (hFlip) {
      // 水平：反转列顺序
      for (let c = 0; c < w / 2; c++) {
        const a = c * page
        const b = (w - 1 - c) * page
        for (let i = 0; i < page; i++) {
          ;[result[a + i], result[b + i]] = [result[b + i], result[a + i]]
        }
      }
    }

    if (vFlip) {
      // 垂直：每列内反转页顺序 + 位反转
      const temp = [...result]
      for (let c = 0; c < w; c++) {
        const base = c * page
        for (let p = 0; p < page; p++) {
          const srcP = page - 1 - p
          let byte = temp[base + srcP]
          byte = reverseBits(byte)
          result[base + p] = byte
        }
      }
    }

  } else if (mode === '行列式') {
    const page = Math.ceil(w / 8)
    const ps = h  // 每水平页字节数

    if (hFlip) {
      // 水平：反转水平页顺序 + 位反转
      const temp = [...result]
      for (let p = 0; p < page; p++) {
        const srcP = page - 1 - p
        for (let r = 0; r < h; r++) {
          let byte = temp[srcP * ps + r]
          byte = reverseBits(byte)
          result[p * ps + r] = byte
        }
      }
    }

    if (vFlip) {
      // 垂直：每水平页内反转行顺序
      for (let p = 0; p < page; p++) {
        const base = p * ps
        for (let r = 0; r < h / 2; r++) {
          const a = base + r
          const b = base + (h - 1 - r)
            ;[result[a], result[b]] = [result[b], result[a]]
        }
      }
    }

  } else if (mode === '逐行式') {
    const page = Math.ceil(w / 8)

    if (hFlip) {
      // 水平：每行内反转水平页顺序 + 位反转
      const temp = [...result]
      for (let r = 0; r < h; r++) {
        const base = r * page
        for (let p = 0; p < page; p++) {
          const srcP = page - 1 - p
          let byte = temp[base + srcP]
          byte = reverseBits(byte)
          result[base + p] = byte
        }
      }
    }

    if (vFlip) {
      // 垂直：反转行顺序
      for (let r = 0; r < h / 2; r++) {
        const a = r * page
        const b = (h - 1 - r) * page
        for (let i = 0; i < page; i++) {
          ;[result[a + i], result[b + i]] = [result[b + i], result[a + i]]
        }
      }
    }
  }

  return result
}

//页内字节反转
function reverseBits(b) {
  b = ((b & 0xF0) >> 4) | ((b & 0x0F) << 4)
  b = ((b & 0xCC) >> 2) | ((b & 0x33) << 2)
  b = ((b & 0xAA) >> 1) | ((b & 0x55) << 1)
  return b
}
