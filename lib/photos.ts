export type ProjectPhoto = {
  id: string;
  name: string;
  dataUrl: string;
};

function storageKey(projectId: string) {
  return `akstory.photos.${projectId}`;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = URL.createObjectURL(file);
    image.onload = () => {
      const max = 1400;
      const scale = Math.min(1, max / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.width * scale));
      canvas.height = Math.max(1, Math.round(image.height * scale));
      const context = canvas.getContext("2d");
      if (!context) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("canvas"));
        return;
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(objectUrl);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("image"));
    };
    image.src = objectUrl;
  });
}

export async function filesToPhotos(files: FileList | File[] | null): Promise<ProjectPhoto[]> {
  if (!files || files.length === 0) return [];
  const images = Array.from(files).filter((file) => file.type.startsWith("image/")).slice(0, 60);
  const photos: ProjectPhoto[] = [];
  for (const file of images) {
    try {
      photos.push({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2, 6)}`,
        name: file.name,
        dataUrl: await fileToDataUrl(file),
      });
    } catch {
      // skip unreadable files
    }
  }
  return photos;
}

export function savePhotos(projectId: string, photos: ProjectPhoto[]) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(storageKey(projectId), JSON.stringify(photos));
  } catch {
    sessionStorage.setItem(storageKey(projectId), JSON.stringify(photos.slice(0, 8)));
  }
}

export function loadPhotos(projectId: string): ProjectPhoto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(storageKey(projectId));
    if (!raw) return [];
    return JSON.parse(raw) as ProjectPhoto[];
  } catch {
    return [];
  }
}

export function appendPhotos(projectId: string, photos: ProjectPhoto[]) {
  const next = [...loadPhotos(projectId), ...photos];
  savePhotos(projectId, next);
  return next;
}
