export type CreateDraft = {
  version: 1;
  storyTypeId: string | null;
  bookTypeId: "classic" | "premium" | null;
  templateId: string | null;
  projectId: string | null;
  photoCount: number;
  updatedAt: string;
};

const KEY = "akstory.draft.v1";

export const emptyDraft = (): CreateDraft => ({
  version: 1,
  storyTypeId: null,
  bookTypeId: null,
  templateId: null,
  projectId: null,
  photoCount: 0,
  updatedAt: new Date().toISOString(),
});

export function loadDraft(): CreateDraft {
  if (typeof window === "undefined") return emptyDraft();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDraft();
    return { ...emptyDraft(), ...JSON.parse(raw) } as CreateDraft;
  } catch {
    return emptyDraft();
  }
}

export function saveDraft(partial: Partial<CreateDraft>): CreateDraft {
  const next = { ...loadDraft(), ...partial, updatedAt: new Date().toISOString(), version: 1 as const };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function createProjectId(): string {
  return `prj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
