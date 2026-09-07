type FaceBox = { boundingBox: { x: number; y: number; width: number; height: number } };

type FaceDetectorCtor = new (options?: { fastMode?: boolean; maxDetectedFaces?: number }) => {
  detect(image: ImageBitmapSource): Promise<FaceBox[]>;
};

function skinToneScore(image: CanvasImageSource) {
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return 0;
  context.drawImage(image, 0, 0, 48, 48);
  const data = context.getImageData(0, 0, 48, 48).data;
  let skin = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const likely =
      r > 80 &&
      g > 40 &&
      b > 20 &&
      r > g &&
      r > b &&
      max - min > 15 &&
      Math.abs(r - g) > 10;
    if (likely) skin += 1;
  }
  const ratio = skin / 2304;
  if (ratio < 0.06) return 0;
  if (ratio < 0.14) return 1;
  return 2;
}

export async function countFaces(image: HTMLImageElement) {
  const Detector = (window as Window & { FaceDetector?: FaceDetectorCtor }).FaceDetector;
  if (Detector) {
    try {
      const detector = new Detector({ fastMode: true, maxDetectedFaces: 8 });
      const faces = await detector.detect(image);
      return faces.filter((face) => face.boundingBox.width * face.boundingBox.height > 80).length;
    } catch {
      return skinToneScore(image);
    }
  }
  return skinToneScore(image);
}

export function faceScore(faceCount: number) {
  if (faceCount <= 0) return 0;
  if (faceCount === 1) return 0.72;
  return Math.min(1, 0.72 + (faceCount - 1) * 0.14);
}
