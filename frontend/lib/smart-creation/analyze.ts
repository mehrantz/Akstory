import type { ProjectPhoto } from "@/lib/photos";
import { countFaces } from "@/lib/smart-creation/faces";
import { perceptualHash } from "@/lib/smart-creation/hash";

export type PhotoOrientation = "landscape" | "portrait" | "square" | "panorama";

export type PhotoAnalysis = {
  photoId: string;
  width: number;
  height: number;
  aspectRatio: number;
  orientation: PhotoOrientation;
  fileSize: number;
  lastModified: number;
  hash: string;
  faceCount: number;
  ok: boolean;
};

export function photoOrientation(aspectRatio: number): PhotoOrientation {
  if (!aspectRatio || aspectRatio <= 0) return "square";
  if (aspectRatio >= 2.1) return "panorama";
  if (aspectRatio >= 1.15) return "landscape";
  if (aspectRatio <= 0.87) return "portrait";
  return "square";
}

function dataUrlBytes(dataUrl: string) {
  const comma = dataUrl.indexOf(",");
  const encoded = comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
  return Math.max(0, Math.round((encoded.length * 3) / 4));
}

function loadImage(dataUrl: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = dataUrl;
  });
}

export async function analyzePhotos(photos: ProjectPhoto[]): Promise<PhotoAnalysis[]> {
  const items: PhotoAnalysis[] = [];
  for (const photo of photos) {
    const image = await loadImage(photo.dataUrl);
    const fileSize = photo.byteSize && photo.byteSize > 0 ? photo.byteSize : dataUrlBytes(photo.dataUrl);
    if (!image || !image.naturalWidth || !image.naturalHeight) {
      items.push({
        photoId: photo.id,
        width: 0,
        height: 0,
        aspectRatio: 0,
        orientation: "square",
        fileSize,
        lastModified: photo.lastModified ?? 0,
        hash: "",
        faceCount: 0,
        ok: false,
      });
      continue;
    }
    items.push({
      photoId: photo.id,
      width: image.naturalWidth,
      height: image.naturalHeight,
      aspectRatio: image.naturalWidth / image.naturalHeight,
      orientation: photoOrientation(image.naturalWidth / image.naturalHeight),
      fileSize,
      lastModified: photo.lastModified ?? 0,
      hash: perceptualHash(image),
      faceCount: await countFaces(image),
      ok: true,
    });
  }
  return items;
}
