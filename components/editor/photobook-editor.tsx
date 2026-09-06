"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Eye,
  History,
  ImagePlus,
  Images,
  LayoutGrid,
  Mountain,
  Play,
  QrCode,
  Redo2,
  Save,
  ShoppingBag,
  Smartphone,
  Circle,
  Square,
  BookOpen,
  Sticker,
  Undo2,
  X,
} from "lucide-react";
import { getTemplateById } from "@/data/catalog";
import { PHOTO_LAYOUTS } from "@/lib/photo-layouts";
import { loadDraft, saveDraft } from "@/lib/draft";
import { PageCanvas, type FocusTarget } from "@/components/editor/page-canvas";
import { PageTray } from "@/components/editor/page-tray";
import { TemplateCoverPreview } from "@/components/editor/template-cover-preview";
import {
  applyLayout,
  createDecor,
  createDefaultBook,
  createInnerSpread,
  createSlot,
  createText,
  fillEmptySlots,
  loadBookProject,
  normalizeSpreads,
  relabelSpreads,
  saveBookProject,
  spinePage,
  styleFromText,
  uid,
  type BookPage,
  type Spread,
  type TextBlock,
} from "@/lib/editor-book";
import { appendPhotos, filesToPhotos, loadPhotos, savePhotos, type ProjectPhoto } from "@/lib/photos";
import { STICKER_CATEGORIES, stickersByCategory, type StickerCategory } from "@/lib/stickers";
import {
  cloneCoverSpread,
  deleteSavedCoverTemplate,
  loadSavedCoverTemplates,
  saveCoverTemplate,
  type SavedCoverTemplate,
} from "@/lib/saved-templates";

const TABS = [
  { id: "images", label: "تصاویر", icon: Images },
  { id: "templates", label: "قالب", icon: BookOpen },
  { id: "layouts", label: "چیدمان", icon: LayoutGrid },
  { id: "backgrounds", label: "پس‌زمینه", icon: Mountain },
  { id: "stickers", label: "استیکر", icon: Sticker },
] as const;

const BACKGROUNDS = [
  "#3ec6c9",
  "#5a6b54",
  "#6a9a96",
  "#8a7a54",
  "#e6d7be",
  "#d7e6e2",
  "#c3ddd3",
  "#c8dcb8",
  "#c5d25a",
  "#d4d88c",
  "#7db8b4",
  "#a9b39a",
  "#d9a7a1",
  "#e8c978",
  "#f4efe8",
  "#efdcd6",
  "#c45c48",
  "#174b87",
  "#5c6d7a",
  "#2c2c2c",
];
const TEXT_STYLES = [
  { role: "kicker" as const, label: "عنوان کوچک", sample: "لحظه‌ها" },
  { role: "title" as const, label: "عنوان بزرگ", sample: "داستان ما" },
  { role: "body" as const, label: "متن ساده", sample: "اینجا بنویس" },
  { role: "note" as const, label: "یادداشت", sample: "چند خط دربارهٔ این صفحه" },
];

type TabId = (typeof TABS)[number]["id"];
type Snapshot = { label: string; spreads: Spread[]; index: number };

function cloneSpreads(spreads: Spread[]) {
  return JSON.parse(JSON.stringify(spreads)) as Spread[];
}

export function PhotobookEditor({ projectId }: { projectId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const draft = useMemo(() => loadDraft(), []);
  const template = getTemplateById(draft.templateId ?? "") ?? null;
  const [photos, setPhotos] = useState<ProjectPhoto[]>([]);
  const [spreads, setSpreads] = useState<Spread[]>(() => createDefaultBook(template));
  const [spreadIndex, setSpreadIndex] = useState(0);
  const [pageView, setPageView] = useState<"spread" | "one">("spread");
  const [oneSide, setOneSide] = useState<0 | 1>(0);
  const [tab, setTab] = useState<TabId>("images");
  const [holdingPhoto, setHoldingPhoto] = useState<string | null>(null);
  const [selectedPage, setSelectedPage] = useState<0 | 1>(0);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [zoom, setZoom] = useState(70);
  const [pendingLayout, setPendingLayout] = useState<string | null>(null);
  const [focus, setFocus] = useState<FocusTarget | null>(null);
  const [stickerCategory, setStickerCategory] = useState<StickerCategory>("iran");
  const [savedTemplates, setSavedTemplates] = useState<SavedCoverTemplate[]>([]);
  const [templateSaved, setTemplateSaved] = useState(false);
  const [past, setPast] = useState<Snapshot[]>([]);
  const [future, setFuture] = useState<Snapshot[]>([]);

  useEffect(() => {
    const storedPhotos = loadPhotos(projectId);
    setPhotos(storedPhotos);
    const stored = loadBookProject(projectId);
    if (stored?.spreads?.length) {
      setSpreads(normalizeSpreads(stored.spreads));
      return;
    }
    const book = createDefaultBook(template);
    setSpreads(storedPhotos.length ? fillEmptySlots(book, storedPhotos) : book);
  }, [projectId, template]);

  useEffect(() => {
    setSavedTemplates(loadSavedCoverTemplates());
  }, []);

  const spread = spreads[spreadIndex] ?? spreads[0];
  const isCover = spread?.pages[0]?.kind === "cover-front";
  const leftPage = spread?.pages[0];
  const rightPage = spread?.pages[1];
  const price = template?.price ?? "۱٬۴۹۰٬۰۰۰";

  function PageToolbar({ side }: { side: 0 | 1 }) {
    return (
      <div className="ed-pagebar">
        <button type="button" onClick={() => addText("body", side)}>
          <b>A+</b>
          <small>متن</small>
        </button>
        <button type="button" onClick={() => addSlot(side)}>
          <ImagePlus size={16} />
          <small>عکس</small>
        </button>
        <button type="button" onClick={() => setPhoneOpen(true)}>
          <QrCode size={16} />
          <small>کیوآر</small>
        </button>
        <button type="button" onClick={() => { setSelectedPage(side); setTab("layouts"); setPendingLayout(null); }}>
          <LayoutGrid size={16} />
          <small>چیدمان</small>
        </button>
        <button type="button" onClick={() => addDecor("rect", side)}>
          <Square size={16} />
          <small>مستطیل</small>
        </button>
        <button type="button" onClick={() => addDecor("ellipse", side)}>
          <Circle size={16} />
          <small>دایره</small>
        </button>
      </div>
    );
  }

  const commit = useCallback(
    (label: string, next: Spread[], nextIndex = spreadIndex) => {
      setPast((current) => [...current.slice(-30), { label, spreads: cloneSpreads(spreads), index: spreadIndex }]);
      setFuture([]);
      setSpreads(next);
      setSpreadIndex(nextIndex);
      saveBookProject({ projectId, templateId: template?.id ?? null, spreads: next });
    },
    [projectId, spreadIndex, spreads, template],
  );

  function persist(nextSpreads = spreads) {
    saveBookProject({ projectId, templateId: template?.id ?? null, spreads: nextSpreads });
    saveDraft({ projectId, photoCount: photos.length, templateId: template?.id ?? draft.templateId });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function undo() {
    const last = past.at(-1);
    if (!last) return;
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [...current, { label: "redo", spreads: cloneSpreads(spreads), index: spreadIndex }]);
    setSpreads(last.spreads);
    setSpreadIndex(last.index);
  }

  function redo() {
    const next = future.at(-1);
    if (!next) return;
    setFuture((current) => current.slice(0, -1));
    setPast((current) => [...current, { label: "undo", spreads: cloneSpreads(spreads), index: spreadIndex }]);
    setSpreads(next.spreads);
    setSpreadIndex(next.index);
  }

  function changePage(side: 0 | 1, updater: (page: BookPage) => BookPage, history?: string) {
    setSpreads((current) => {
      const next = cloneSpreads(current);
      next[spreadIndex].pages[side] = updater(next[spreadIndex].pages[side]);
      if (history) {
        setPast((pastState) => [...pastState.slice(-30), { label: history, spreads: cloneSpreads(current), index: spreadIndex }]);
        setFuture([]);
      }
      saveBookProject({ projectId, templateId: template?.id ?? null, spreads: next });
      return next;
    });
  }

  function updatePage(side: 0 | 1, updater: (page: BookPage) => BookPage, history = "ویرایش صفحه") {
    changePage(side, updater, history);
  }

  async function addFiles(list: FileList | File[] | null) {
    if (!list?.length || busy) return;
    setBusy(true);
    try {
      const incoming = await filesToPhotos(list);
      if (!incoming.length) return;
      const nextPhotos = appendPhotos(projectId, incoming);
      setPhotos(nextPhotos);
      saveDraft({ photoCount: nextPhotos.length });
      const empty = spreads.some((item) => item.pages.some((page) => page.slots.some((slot) => !slot.photoId)));
      if (empty) {
        const filled = fillEmptySlots(spreads, incoming);
        commit("افزودن عکس", filled);
      }
    } finally {
      setBusy(false);
    }
  }

  function placePhoto(side: 0 | 1, slotId: string, photoId: string) {
    updatePage(side, (page) => ({
      ...page,
      slots: page.slots.map((slot) => (slot.id === slotId ? { ...slot, photoId } : slot)),
    }), "گذاشتن عکس");
    setHoldingPhoto(null);
  }

  function removeLibraryPhoto(photoId: string) {
    const nextPhotos = photos.filter((item) => item.id !== photoId);
    setPhotos(nextPhotos);
    savePhotos(projectId, nextPhotos);
    saveDraft({ photoCount: nextPhotos.length });
    if (holdingPhoto === photoId) setHoldingPhoto(null);
    const used = spreads.some((item) => item.pages.some((page) => page.slots.some((slot) => slot.photoId === photoId)));
    if (!used) return;
    commit("حذف عکس", spreads.map((item) => ({
      ...item,
      pages: item.pages.map((page) => ({
        ...page,
        slots: page.slots.map((slot) => (slot.photoId === photoId ? { ...slot, photoId: null } : slot)),
      })),
    })));
  }

  async function replaceSlotPhoto(side: 0 | 1, slotId: string, files: FileList) {
    const incoming = await filesToPhotos(files);
    if (!incoming[0]) return;
    const nextPhotos = appendPhotos(projectId, incoming);
    setPhotos(nextPhotos);
    saveDraft({ photoCount: nextPhotos.length });
    placePhoto(side, slotId, incoming[0].id);
  }

  function targetSide(side?: 0 | 1): 0 | 1 {
    return side ?? (pageView === "one" ? oneSide : selectedPage);
  }

  function addText(role: TextBlockRole, side?: 0 | 1) {
    const sideIndex = targetSide(side);
    const currentPage = spreads[spreadIndex]?.pages[sideIndex];
    const next = createText(role, role === "title" ? "عنوان جدید" : "متن جدید", currentPage?.kind ?? "inner", currentPage?.texts.length ?? 0);
    try {
      const saved = sessionStorage.getItem("akstory.textStyle");
      if (saved) Object.assign(next, styleFromText({ ...next, ...JSON.parse(saved) }));
    } catch {
      /* ignore broken bookmark */
    }
    updatePage(sideIndex, (page) => ({ ...page, texts: [...page.texts, next] }), "افزودن متن");
    setSelectedPage(sideIndex);
    setFocus({ type: "text", id: next.id });
  }

  function addSlot(side?: 0 | 1) {
    const sideIndex = targetSide(side);
    const currentPage = spreads[spreadIndex]?.pages[sideIndex];
    const slot = createSlot(currentPage?.slots.length ?? 0, currentPage?.layout === "note" || currentPage?.layout === "blank" ? "hero" : currentPage?.layout ?? "hero");
    updatePage(sideIndex, (page) => ({
      ...page,
      layout: page.layout === "blank" || page.layout === "note" ? "hero" : page.layout,
      slots: [...page.slots, slot],
    }), "افزودن عکس");
    setSelectedPage(sideIndex);
    setFocus({ type: "slot", id: slot.id });
  }

  function addDecor(kind: "rect" | "ellipse" | "sticker", side?: 0 | 1) {
    const sideIndex = targetSide(side);
    const currentPage = spreads[spreadIndex]?.pages[sideIndex];
    const decor = createDecor(kind, currentPage?.decors.length ?? 0);
    updatePage(sideIndex, (page) => ({
      ...page,
      decors: [...page.decors, decor],
    }), "افزودن شکل");
    setSelectedPage(sideIndex);
    setFocus({ type: "decor", id: decor.id });
  }

  function addStickerImage(src: string, side?: 0 | 1) {
    const sideIndex = targetSide(side);
    const currentPage = spreads[spreadIndex]?.pages[sideIndex];
    const decor = { ...createDecor("sticker", currentPage?.decors.length ?? 0), value: src, w: 18, h: 18 };
    updatePage(sideIndex, (page) => ({
      ...page,
      decors: [...page.decors, decor],
    }), "افزودن استیکر");
    setSelectedPage(sideIndex);
    setFocus({ type: "decor", id: decor.id });
  }

  function applyTextToAll(source: TextBlock) {
    const style = styleFromText(source);
    setSpreads((current) => {
      const next = current.map((spread) => ({
        ...spread,
        pages: spread.pages.map((item) => ({
          ...item,
          texts: item.texts.map((text) => ({ ...text, ...style })),
        })) as Spread["pages"],
        spineTexts: spread.spineTexts?.map((text) => ({ ...text, ...style })),
      }));
      setPast((pastState) => [...pastState.slice(-30), { label: "اعمال روی همه", spreads: cloneSpreads(current), index: spreadIndex }]);
      setFuture([]);
      saveBookProject({ projectId, templateId: template?.id ?? null, spreads: next });
      return next;
    });
  }

  function setBackground(color: string) {
    updatePage(targetSide(), (page) => ({ ...page, background: color }));
  }

  function chooseLayout(layout: string) {
    if (pendingLayout === layout) {
      setPendingLayout(null);
      return;
    }
    setPageView("spread");
    setPendingLayout(layout);
    setFocus(null);
  }

  function applyPending(side: 0 | 1) {
    if (!pendingLayout) return;
    updatePage(side, (page) => applyLayout(page, pendingLayout), "چیدمان");
    setSelectedPage(side);
    setOneSide(side);
    setPendingLayout(null);
  }

  function pickLabel(side: 0 | 1) {
    if (!pendingLayout) return null;
    if (isCover) return side === 0 ? "کلیک کن تا روی جلد رو اعمال شود" : "کلیک کن تا روی جلد پشت اعمال شود";
    return side === 0 ? "کلیک کن تا روی صفحهٔ راست اعمال شود" : "کلیک کن تا روی صفحهٔ چپ اعمال شود";
  }

  function changeSpine(updater: (page: BookPage) => BookPage, history?: string) {
    setSpreads((current) => {
      const next = cloneSpreads(current);
      const currentSpread = next[spreadIndex];
      const updated = updater(spinePage(currentSpread.spineTexts ?? []));
      next[spreadIndex] = { ...currentSpread, spineTexts: updated.texts };
      if (history) {
        setPast((pastState) => [...pastState.slice(-30), { label: history, spreads: cloneSpreads(current), index: spreadIndex }]);
        setFuture([]);
      }
      saveBookProject({ projectId, templateId: template?.id ?? null, spreads: next });
      return next;
    });
  }

  function addSpread() {
    const next = relabelSpreads([...spreads, createInnerSpread("")]);
    commit("افزودن صفحه", next, next.length - 1);
  }

  function insertSpread(at: number) {
    const next = relabelSpreads([...spreads.slice(0, at), createInnerSpread(""), ...spreads.slice(at)]);
    commit("افزودن صفحه میانی", next, at);
  }

  function duplicateSpread() {
    const copy: Spread = {
      ...cloneSpreads([spread])[0],
      id: uid("spread"),
    };
    const next = relabelSpreads([...spreads.slice(0, spreadIndex + 1), copy, ...spreads.slice(spreadIndex + 1)]);
    commit("تکثیر صفحه", next, spreadIndex + 1);
  }

  function removeSpread() {
    if (spreads.length <= 1) return;
    const next = relabelSpreads(spreads.filter((_, index) => index !== spreadIndex));
    commit("حذف صفحه", next, Math.max(0, spreadIndex - 1));
  }

  function saveCurrentCoverTemplate() {
    const cover = spreads[0];
    if (!cover || cover.pages[0]?.kind !== "cover-front") return;
    saveCoverTemplate(cover, photos);
    setSavedTemplates(loadSavedCoverTemplates());
    setTemplateSaved(true);
    setTab("templates");
    window.setTimeout(() => setTemplateSaved(false), 1800);
  }

  function applyCoverTemplate(item: SavedCoverTemplate) {
    const cover = cloneCoverSpread(item.spread);
    const next = relabelSpreads([cover, ...spreads.slice(1)]);
    const existingIds = new Set(photos.map((photo) => photo.id));
    const incoming = item.photos.filter((photo) => !existingIds.has(photo.id));
    if (incoming.length) {
      const merged = [...photos, ...incoming];
      setPhotos(merged);
      savePhotos(projectId, merged);
    }
    commit("اعمال قالب جلد", next, 0);
    setFocus(null);
    setPendingLayout(null);
  }

  function removeSavedTemplate(id: string) {
    deleteSavedCoverTemplate(id);
    setSavedTemplates(loadSavedCoverTemplates());
  }

  if (!spread || !leftPage || !rightPage) {
    return <main className="ed-shell" />;
  }

  return (
    <main className="ed-shell">
      <header className="ed-top">
        <div className="ed-top-start">
          <Link className="ed-logo" href="/">
            akstory
          </Link>
          <button type="button" disabled={!past.length} onClick={undo}>
            <Undo2 size={16} /> واگرد
          </button>
          <button type="button" disabled={!future.length} onClick={redo}>
            <Redo2 size={16} /> از نو
          </button>
          <div className="ed-menu">
            <button type="button" className={historyOpen ? "on" : ""} onClick={() => setHistoryOpen((open) => !open)}>
              <History size={16} /> تاریخچه
            </button>
            {historyOpen ? (
              <div className="ed-pop">
                {past.length === 0 ? <p>هنوز تغییری ثبت نشده.</p> : past.slice(-8).reverse().map((item, index) => <p key={`${item.label}-${index}`}>{item.label}</p>)}
              </div>
            ) : null}
          </div>
          <div className="ed-menu">
            <button type="button" className={projectOpen ? "on" : ""} onClick={() => setProjectOpen((open) => !open)}>
              پروژه
            </button>
            {projectOpen ? (
              <div className="ed-pop">
                <p>قالب پیش‌فرض: {template?.title ?? "لحظه‌ها"}</p>
                <p>شناسه: {projectId}</p>
                <Link href="/create/start">بازگشت به انتخاب مسیر</Link>
              </div>
            ) : null}
          </div>
        </div>

        <button className="ed-tutorial" type="button" onClick={() => setTutorialOpen(true)}>
          <Play size={14} /> آموزش ویدیویی
        </button>

        <div className="ed-top-end">
          <button type="button" className="ed-template-save" onClick={saveCurrentCoverTemplate}>
            <BookOpen size={16} />
            <span>{templateSaved ? "قالب ذخیره شد" : "ذخیره قالب (موقت)"}</span>
          </button>
          <button type="button" onClick={() => persist()} aria-label="ذخیره">
            <Save size={18} />
            <span>{saved ? "ذخیره شد" : "ذخیره"}</span>
          </button>
          <Link href={`/preview/${projectId}`} aria-label="پیش‌نمایش">
            <Eye size={18} />
            <span>پیش‌نمایش</span>
          </Link>
          <Link className="ed-order" href={`/preview/${projectId}`}>
            <ShoppingBag size={16} />
            ثبت سفارش {price}
          </Link>
        </div>
      </header>

      <div className="ed-body">
        <section className="ed-workspace">
          <div className="ed-book" data-view={pageView} style={{ transform: `scale(${zoom / 100})` }}>
            <PageToolbar side={pageView === "one" ? oneSide : 0} />
            <div className="ed-stage">
              <div className={`ed-face ${isCover ? "is-cover" : "is-inner"}`} style={isCover ? { background: leftPage?.background } : undefined}>
                {pageView === "one" ? (
                  <PageCanvas
                    page={spread.pages[oneSide]}
                    photos={photos}
                    selected
                    focus={focus}
                    holding={holdingPhoto}
                    onSelectPage={() => setSelectedPage(oneSide)}
                    onFocus={setFocus}
                    onChange={(updater, history) => changePage(oneSide, updater, history)}
                    onApplyAll={applyTextToAll}
                    onPlace={(slotId, photoId) => placePhoto(oneSide, slotId, photoId)}
                    onReplace={(slotId, files) => replaceSlotPhoto(oneSide, slotId, files)}
                    pickLabel={pickLabel(oneSide)}
                    onPick={() => applyPending(oneSide)}
                  />
                ) : (
                  <>
                    <PageCanvas
                      page={leftPage}
                      photos={photos}
                      selected={selectedPage === 0}
                      focus={focus}
                      holding={holdingPhoto}
                      onSelectPage={() => {
                        setSelectedPage(0);
                        setOneSide(0);
                      }}
                      onFocus={setFocus}
                      onChange={(updater, history) => changePage(0, updater, history)}
                      onApplyAll={applyTextToAll}
                      onPlace={(slotId, photoId) => placePhoto(0, slotId, photoId)}
                      onReplace={(slotId, files) => replaceSlotPhoto(0, slotId, files)}
                      pickLabel={pickLabel(0)}
                      onPick={() => applyPending(0)}
                    />
                    {isCover ? (
                      <div className="ed-spine-col">
                        <PageCanvas
                          page={spinePage(spread.spineTexts ?? [])}
                          photos={photos}
                          selected={false}
                          focus={focus}
                          holding={null}
                          onSelectPage={() => {}}
                          onFocus={setFocus}
                          onChange={changeSpine}
                          onApplyAll={applyTextToAll}
                          onPlace={() => {}}
                          onReplace={() => {}}
                        />
                      </div>
                    ) : (
                      <div className="ed-gutter" aria-hidden="true" />
                    )}
                    <PageCanvas
                      page={rightPage}
                      photos={photos}
                      selected={selectedPage === 1}
                      focus={focus}
                      holding={holdingPhoto}
                      onSelectPage={() => {
                        setSelectedPage(1);
                        setOneSide(1);
                      }}
                      onFocus={setFocus}
                      onChange={(updater, history) => changePage(1, updater, history)}
                      onApplyAll={applyTextToAll}
                      onPlace={(slotId, photoId) => placePhoto(1, slotId, photoId)}
                      onReplace={(slotId, files) => replaceSlotPhoto(1, slotId, files)}
                      pickLabel={pickLabel(1)}
                      onPick={() => applyPending(1)}
                    />
                  </>
                )}
              </div>
              {pageView === "spread" ? (
                <div className={`ed-caps${isCover ? "" : " is-inner"}`}>
                  <span>{isCover ? "جلد رو" : "صفحهٔ راست"}</span>
                  {isCover ? <i /> : null}
                  <span>{isCover ? "جلد پشت" : "صفحهٔ چپ"}</span>
                </div>
              ) : (
                <div className="ed-caps single">
                  <span>{isCover ? (oneSide === 0 ? "جلد رو" : "جلد پشت") : spread.label}</span>
                </div>
              )}
            </div>
            {pageView === "spread" ? <PageToolbar side={1} /> : null}
          </div>
        </section>

        <aside className="ed-side">
          <div className="ed-panel">
            {tab === "images" ? (
              <>
                <h3>منبع افزودن عکس را انتخاب کن</h3>
                <button className="ed-source" type="button" onClick={() => fileRef.current?.click()}>
                  <ImagePlus size={18} />
                  کامپیوتر
                </button>
                <button className="ed-source" type="button" onClick={() => setPhoneOpen(true)}>
                  <Smartphone size={18} />
                  افزودن از موبایل
                </button>
                <div
                  className="ed-drop"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => {
                    event.preventDefault();
                    addFiles(event.dataTransfer.files);
                  }}
                >
                  {busy ? "در حال بارگذاری…" : "یا بکش و اینجا رها کن"}
                </div>
                {photos.length > 0 ? (
                  <div className="ed-lib">
                    {photos.map((photo) => (
                      <div key={photo.id} className={`ed-lib-item${holdingPhoto === photo.id ? " holding" : ""}`}>
                        <button
                          type="button"
                          onClick={() => setHoldingPhoto(photo.id === holdingPhoto ? null : photo.id)}
                          draggable
                          onDragStart={(event) => event.dataTransfer.setData("text/photo-id", photo.id)}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.dataUrl} alt={photo.name} />
                        </button>
                        <button
                          type="button"
                          className="ed-lib-x"
                          aria-label="حذف عکس"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeLibraryPhoto(photo.id);
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
                {holdingPhoto ? <p className="ed-hint">حالا روی یکی از کادرهای صفحه کلیک کن.</p> : null}
              </>
            ) : null}

            {tab === "layouts" ? (
              <>
                <div className="ed-lay-head">
                  <span>چیدمان عکس</span>
                  <b>چیدمان یک صفحه</b>
                </div>
                {pendingLayout ? (
                  <p className="ed-hint">صفحه را روی بوم انتخاب کن. <button type="button" className="ed-text-link" onClick={() => setPendingLayout(null)}>انصراف</button></p>
                ) : (
                  <p className="ed-hint">یک چیدمان را انتخاب کن، بعد صفحه‌اش را مشخص کن.</p>
                )}
                <div className="ed-lay-grid">
                  {PHOTO_LAYOUTS.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className={`ed-lay-card${pendingLayout === item.id ? " on" : ""}`}
                      onClick={() => chooseLayout(item.id)}
                      aria-label="انتخاب چیدمان"
                    >
                      <span className="ed-lay-thumb">
                        {item.cells.map((cell, index) => (
                          <i key={index} style={{ left: `${cell.x}%`, top: `${cell.y}%`, width: `${cell.w}%`, height: `${cell.h}%` }} />
                        ))}
                      </span>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {tab === "backgrounds" ? (
              <>
                <div className="ed-lay-head">
                  <span>پس‌زمینه</span>
                  <b>رنگ‌های پس‌زمینه</b>
                </div>
                <p className="ed-hint">رنگ روی صفحهٔ انتخاب‌شده اعمال می‌شود.</p>
                <div className="ed-bg-grid">
                  {BACKGROUNDS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`ed-bg-card${(pageView === "one" ? spread.pages[oneSide].background : spread.pages[selectedPage].background) === color ? " on" : ""}`}
                      style={{ background: color }}
                      aria-label={color}
                      onClick={() => setBackground(color)}
                    />
                  ))}
                </div>
              </>
            ) : null}

            {tab === "templates" ? (
              <>
                <div className="ed-lay-head">
                  <span>قالب</span>
                  <b>قالب‌های ذخیره‌شده</b>
                </div>
                <p className="ed-hint">روی قالب کلیک کن تا جلد کتاب با همان طراحی جایگزین شود.</p>
                {savedTemplates.length === 0 ? (
                  <p className="ed-hint">هنوز قالبی نیست. جلد را بساز و از دکمه «ذخیره قالب (موقت)» بالای صفحه استفاده کن.</p>
                ) : (
                  <div className="ed-tpl-list">
                    {savedTemplates.map((item) => (
                      <div key={item.id} className="ed-tpl-card">
                        <button type="button" className="ed-tpl-body" onClick={() => applyCoverTemplate(item)}>
                          {item.previewImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className="ed-tpl-cover" src={item.previewImage} alt={item.title} />
                          ) : (
                            <TemplateCoverPreview spread={item.spread} photos={item.photos} />
                          )}
                          <strong>{item.title}</strong>
                        </button>
                        <button
                          type="button"
                          className="ed-tpl-x"
                          aria-label="حذف قالب"
                          onClick={(event) => {
                            event.stopPropagation();
                            removeSavedTemplate(item.id);
                          }}
                        >
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : null}

            {tab === "stickers" ? (
              <>
                <div className="ed-lay-head">
                  <span>استیکر</span>
                  <b>انتخاب استیکر</b>
                </div>
                <p className="ed-hint">روی استیکر کلیک کن تا روی صفحهٔ انتخاب‌شده اضافه شود.</p>
                <div className="ed-sticker-cats" role="tablist" aria-label="دسته‌بندی استیکر">
                  {STICKER_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      role="tab"
                      aria-selected={stickerCategory === category.id}
                      className={stickerCategory === category.id ? "on" : ""}
                      onClick={() => setStickerCategory(category.id)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
                <div className="ed-lib ed-sticker-grid">
                  {stickersByCategory(stickerCategory).map((sticker) => (
                    <div key={sticker.id} className="ed-lib-item">
                      <button type="button" onClick={() => addStickerImage(sticker.src)} aria-label={sticker.id}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={sticker.src} alt="" loading="lazy" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : null}
          </div>
          <nav className="ed-rail" aria-label="ابزار ادیتور">
            {TABS.map((item) => (
              <button key={item.id} type="button" className={tab === item.id ? "active" : ""} onClick={() => setTab(item.id)} title={item.label}>
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>

      <PageTray
        spreads={spreads}
        spreadIndex={spreadIndex}
        pageView={pageView}
        zoom={zoom}
        photos={photos}
        onView={setPageView}
        onSelect={(index) => {
          setSpreadIndex(index);
          setFocus(null);
          setPendingLayout(null);
        }}
        onPrev={() => setSpreadIndex((index) => Math.max(0, index - 1))}
        onNext={() => setSpreadIndex((index) => Math.min(spreads.length - 1, index + 1))}
        onZoom={setZoom}
        onAdd={addSpread}
        onInsert={insertSpread}
        onDuplicate={duplicateSpread}
        onRemove={removeSpread}
      />

      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(event) => addFiles(event.target.files)} />

      {phoneOpen ? (
        <div className="ed-modal" onClick={() => setPhoneOpen(false)}>
          <div className="ed-dialog" onClick={(event) => event.stopPropagation()}>
            <h3>افزودن از موبایل</h3>
            <p>این کد را با گوشی باز کن یا فعلاً از کامپیوتر عکس بگذار.</p>
            <div className="ed-qr" aria-hidden="true" />
            <b>AK-{projectId.slice(-6).toUpperCase()}</b>
            <button type="button" onClick={() => setPhoneOpen(false)}>
              فهمیدم
            </button>
          </div>
        </div>
      ) : null}

      {tutorialOpen ? (
        <div className="ed-modal" onClick={() => setTutorialOpen(false)}>
          <div className="ed-dialog" onClick={(event) => event.stopPropagation()}>
            <h3>آموزش کوتاه</h3>
            <p>عکس را از پنل راست بکش روی کادر صفحه. متن را با کلیک ویرایش کن. از پایین صفحه ورق بزن یا صفحه اضافه کن.</p>
            <Link href="/how-it-works">رفتن به راهنمای کامل</Link>
            <button type="button" onClick={() => setTutorialOpen(false)}>
              بستن
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}

type TextBlockRole = (typeof TEXT_STYLES)[number]["role"];
