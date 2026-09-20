import { getTemplateById } from "@/data/catalog";
import { getCoverTemplateForSeries } from "@/lib/saved-templates";
import type { BookProject } from "@/lib/editor-book";
import type { ProjectPhoto } from "@/lib/photos";
import { analyzePhotos } from "@/lib/smart-creation/analyze";
import { assembleBook } from "@/lib/smart-creation/assemble";
import { detectDuplicates, type DuplicateReport } from "@/lib/smart-creation/duplicates";
import { filterPhotos } from "@/lib/smart-creation/filter";
import { planBook } from "@/lib/smart-creation/planner";
import { rankPhotos, type RankedPhoto } from "@/lib/smart-creation/rank";

export const SMART_STEPS = [
  "بررسی عکس‌ها",
  "انتخاب بهترین لحظه‌ها",
  "طراحی صفحات اولیه",
  "آماده‌سازی کتاب",
] as const;

export type SmartProgress = 0 | 1 | 2 | 3 | 4;

export type SmartSelectionReport = {
  reviewed: number;
  similar: number;
  dropped: number;
  selected: number;
  rankings: Array<{ photoId: string; score: number; reasons: string[] }>;
};

export type SmartBookResult = {
  project: BookProject;
  kept: ProjectPhoto[];
  dropped: number;
  report: SmartSelectionReport;
};

function byId(photos: ProjectPhoto[]) {
  return new Map(photos.map((photo) => [photo.id, photo]));
}

function orderPhotos(photos: ProjectPhoto[], ranked: RankedPhoto[]) {
  const lookup = byId(photos);
  const cover = ranked[0];
  const rest = ranked
    .slice(1)
    .slice()
    .sort((a, b) => {
      if (a.lastModified && b.lastModified) return a.lastModified - b.lastModified;
      if (a.lastModified) return -1;
      if (b.lastModified) return 1;
      return b.score - a.score;
    });
  return [cover, ...rest].map((item) => lookup.get(item.photoId)).filter((item): item is ProjectPhoto => Boolean(item));
}

function toReport(duplicates: DuplicateReport, ranked: RankedPhoto[], selected: number, reviewed: number): SmartSelectionReport {
  return {
    reviewed,
    similar: duplicates.similar,
    dropped: Math.max(0, reviewed - selected),
    selected,
    rankings: ranked.map((item) => ({
      photoId: item.photoId,
      score: item.score,
      reasons: item.reasons,
    })),
  };
}

export async function buildSmartBook(input: {
  projectId: string;
  templateId: string | null;
  photos: ProjectPhoto[];
  onProgress?: (step: SmartProgress) => void;
}): Promise<SmartBookResult> {
  async function mark(step: SmartProgress) {
    input.onProgress?.(step);
    await new Promise((resolve) => setTimeout(resolve, 320));
  }

  await mark(0);
  const analyzed = await analyzePhotos(input.photos);
  const filtered = filterPhotos(analyzed);
  const usable = filtered.length > 0 ? filtered : analyzed.filter((item) => item.ok);
  if (usable.length === 0) {
    throw new Error("هیچ عکس معتبری برای ساخت کتاب پیدا نشد.");
  }

  await mark(1);
  const duplicates = detectDuplicates(usable);
  const uniqueIds = new Set(duplicates.keptIds);
  const unique = usable.filter((item) => uniqueIds.has(item.photoId));
  const ranked = rankPhotos(unique, uniqueIds);
  const kept = orderPhotos(input.photos, ranked);
  if (kept.length === 0) {
    throw new Error("هیچ عکس معتبری برای ساخت کتاب پیدا نشد.");
  }

  await mark(2);
  const plan = planBook(ranked);
  const template = input.templateId ? getTemplateById(input.templateId) ?? null : null;
  const coverTemplate = await getCoverTemplateForSeries(input.templateId);

  await mark(3);
  const project = assembleBook({
    projectId: input.projectId,
    templateId: input.templateId,
    template,
    coverTemplate,
    photos: kept,
    analyses: ranked,
    plan,
  });

  input.onProgress?.(4);
  const extra = coverTemplate?.photos ?? [];
  const ids = new Set(kept.map((photo) => photo.id));
  const withCoverPhotos = extra.length ? [...kept, ...extra.filter((photo) => !ids.has(photo.id))] : kept;
  return {
    project,
    kept: withCoverPhotos,
    dropped: Math.max(0, input.photos.length - kept.length),
    report: toReport(duplicates, ranked, kept.length, input.photos.length),
  };
}
