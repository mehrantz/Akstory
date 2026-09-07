function grayAt(data: Uint8ClampedArray, index: number) {
  const i = index * 4;
  return data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
}

export function perceptualHash(image: CanvasImageSource) {
  const canvas = document.createElement("canvas");
  canvas.width = 8;
  canvas.height = 8;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return "";
  context.drawImage(image, 0, 0, 8, 8);
  const pixels = context.getImageData(0, 0, 8, 8).data;
  const tones = Array.from({ length: 64 }, (_, index) => grayAt(pixels, index));
  const average = tones.reduce((sum, value) => sum + value, 0) / 64;
  let bits = 0n;
  tones.forEach((tone, index) => {
    if (tone >= average) bits |= 1n << BigInt(index);
  });
  return bits.toString(16).padStart(16, "0");
}

export function hammingDistance(left: string, right: string) {
  if (!left || !right || left.length !== right.length) return 64;
  let xor = BigInt(`0x${left}`) ^ BigInt(`0x${right}`);
  let count = 0;
  while (xor) {
    xor &= xor - 1n;
    count += 1;
  }
  return count;
}
