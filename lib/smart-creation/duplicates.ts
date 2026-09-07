import type { PhotoAnalysis } from "@/lib/smart-creation/analyze";
import { hammingDistance } from "@/lib/smart-creation/hash";

const SIMILARITY = 10;

export type DuplicateCluster = {
  keeper: string;
  dropped: string[];
};

export type DuplicateReport = {
  reviewed: number;
  similar: number;
  droppedIds: string[];
  keptIds: string[];
  clusters: DuplicateCluster[];
};

function prefer(left: PhotoAnalysis, right: PhotoAnalysis) {
  const leftScore = left.width * left.height + left.faceCount * 80_000 + left.fileSize * 0.05;
  const rightScore = right.width * right.height + right.faceCount * 80_000 + right.fileSize * 0.05;
  return rightScore - leftScore;
}

export function detectDuplicates(items: PhotoAnalysis[]): DuplicateReport {
  const parent = items.map((_, index) => index);

  function find(index: number): number {
    if (parent[index] !== index) parent[index] = find(parent[index]);
    return parent[index];
  }

  function join(a: number, b: number) {
    const left = find(a);
    const right = find(b);
    if (left !== right) parent[right] = left;
  }

  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      if (hammingDistance(items[i].hash, items[j].hash) <= SIMILARITY) join(i, j);
    }
  }

  const groups = new Map<number, PhotoAnalysis[]>();
  items.forEach((item, index) => {
    const root = find(index);
    const list = groups.get(root) ?? [];
    list.push(item);
    groups.set(root, list);
  });

  const clusters: DuplicateCluster[] = [];
  const keptIds: string[] = [];
  const droppedIds: string[] = [];

  for (const group of groups.values()) {
    const ordered = [...group].sort(prefer);
    const keeper = ordered[0];
    const extras = ordered.slice(1);
    keptIds.push(keeper.photoId);
    extras.forEach((item) => droppedIds.push(item.photoId));
    if (extras.length) {
      clusters.push({ keeper: keeper.photoId, dropped: extras.map((item) => item.photoId) });
    }
  }

  return {
    reviewed: items.length,
    similar: droppedIds.length,
    droppedIds,
    keptIds,
    clusters,
  };
}
