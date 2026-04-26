"use client";

import type { ReactNode, RefObject } from "react";
import { FormEvent, useEffect, useId, useRef, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const difficulties = ["beginner", "intermediate", "advanced"] as const;

const BUCKET_IMAGES = "toy-images";
const BUCKET_VIDEOS = "toy-videos";
const BUCKET_FILES = "toy-files";

const tealFocus =
  "focus:border-[#4AA89A] focus:bg-white focus:ring-2 focus:ring-[#4AA89A]/25";

function safeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 180) || "file";
}

async function uploadToBucket(
  supabase: SupabaseClient,
  bucket: string,
  userId: string,
  file: File
): Promise<string> {
  const path = `${userId}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (upErr) {
    throw new Error(upErr.message);
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function SectionShell({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200/80 bg-white shadow-[0_1px_2px_rgba(63,58,54,0.04)]">
      <div className="flex items-start gap-4 border-b border-zinc-100 px-6 py-5 md:gap-5 md:px-8 md:py-6">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-semibold text-white md:h-10 md:w-10 md:text-sm"
          style={{ background: "linear-gradient(135deg, #5DBAAB 0%, #4AA89A 100%)" }}
          aria-hidden
        >
          {step}
        </span>
        <div className="min-w-0 pt-0.5">
          <h2 className="text-base font-semibold tracking-tight text-[#3F3A36] md:text-[17px]">{title}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">{description}</p>
        </div>
      </div>
      <div className="p-6 md:p-8 lg:p-10">{children}</div>
    </section>
  );
}

function UploadDropZone({
  inputId,
  inputRef,
  accept,
  title,
  hint,
  badge,
  file,
  onPick,
  onClear,
  children,
}: {
  inputId: string;
  inputRef: RefObject<HTMLInputElement | null>;
  accept: string;
  title: string;
  hint: string;
  badge: string;
  file: File | null;
  onPick: (f: File | null) => void;
  onClear: () => void;
  children?: ReactNode;
}) {
  const hasFile = !!file;

  return (
    <div className="space-y-4 md:space-y-5">
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onPick(e.target.files?.[0] ?? null)}
      />
      <label
        htmlFor={inputId}
        className={`group relative flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-10 text-center transition md:min-h-[220px] md:px-6 md:py-12 ${
          hasFile
            ? "border-[#4AA89A] bg-[#f0faf8]"
            : "border-zinc-300 bg-zinc-50/80 hover:border-[#4AA89A] hover:bg-[#eef8f7]"
        }`}
      >
        <span className="rounded-full border border-zinc-200/90 bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">
          {badge}
        </span>
        <span className="mt-5 text-zinc-300 md:mt-6" aria-hidden>
          {badge === "Image" ? (
            <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3A1.5 1.5 0 001.5 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25z"
              />
            </svg>
          ) : badge === "Video" ? (
            <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25z"
              />
            </svg>
          ) : (
            <svg className="mx-auto h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.375 12.739h-7.5a.375.375 0 0 0-.375.375v7.5a.375.375 0 0 0 .375.375h7.5a.375.375 0 0 0 .375-.375v-7.5a.375.375 0 0 0-.375-.375zm-6.375 0V9.109a4.5 4.5 0 0 1 9 0v3.63M6.75 21h7.5a.375.375 0 0 0 .375-.375v-7.5a.375.375 0 0 0-.375-.375h-7.5a.375.375 0 0 0-.375.375v7.5a.375.375 0 0 0 .375.375zm-3-12V9.109a7.5 7.5 0 0 1 15 0v.891"
              />
            </svg>
          )}
        </span>
        <span className="mt-4 text-sm font-medium text-[#3F3A36] md:text-base">{title}</span>
        <span className="mt-2 max-w-[260px] text-xs leading-relaxed text-zinc-500 md:text-sm">
          {hint}
        </span>
        <span
          className="mt-6 inline-flex items-center rounded-full border border-[#e85a3d] bg-[#FF6B4A] px-5 py-2.5 text-xs font-medium text-white transition group-hover:bg-[#FF5738] md:mt-8 md:px-6 md:text-sm"
          style={{ pointerEvents: "none" }}
        >
          {hasFile ? "Replace file" : "Choose file"}
        </span>
      </label>
      {hasFile && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
          <p className="min-w-0 truncate text-sm text-zinc-700">
            <span className="font-medium text-zinc-900">{file!.name}</span>
            <span className="text-zinc-400"> · {(file!.size / 1024).toFixed(0)} KB</span>
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClear();
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="shrink-0 text-sm font-semibold text-[#FF5738] underline-offset-2 hover:underline"
          >
            Remove
          </button>
        </div>
      )}
      {children ? <div className="mt-5 space-y-3 md:mt-6">{children}</div> : null}
    </div>
  );
}

const difficultyUi: Record<
  (typeof difficulties)[number],
  { label: string; sub: string }
> = {
  beginner: { label: "Beginner", sub: "Straightforward build" },
  intermediate: { label: "Intermediate", sub: "Some skill needed" },
  advanced: { label: "Advanced", sub: "Complex adaptation" },
};

export default function SubmitToyPage() {
  const baseId = useId();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const [toyName, setToyName] = useState("");
  const [difficulty, setDifficulty] =
    useState<(typeof difficulties)[number]>("beginner");
  const [materials, setMaterials] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!videoFile) {
      setVideoPreview(null);
      return;
    }
    const url = URL.createObjectURL(videoFile);
    setVideoPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [videoFile]);

  const clearFiles = () => {
    setImageFile(null);
    setVideoFile(null);
    setDocFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const supabase = createSupabaseBrowserClient();

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("You must be signed in to submit a toy.");
      }

      console.log("[submit-toy] user", user.id);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("chapter_id")
        .eq("id", user.id)
        .single();

      console.log("[submit-toy] profile", profile);
      console.log("[submit-toy] chapter_id", profile?.chapter_id ?? null);

      if (profileError || !profile?.chapter_id) {
        throw new Error(
          "Your profile is not linked to a chapter. Choose a chapter first."
        );
      }

      let image_url: string | null = null;
      let video_url: string | null = null;
      let file_url: string | null = null;

      if (imageFile) {
        image_url = await uploadToBucket(supabase, BUCKET_IMAGES, user.id, imageFile);
      }
      if (videoFile) {
        video_url = await uploadToBucket(supabase, BUCKET_VIDEOS, user.id, videoFile);
      }
      if (docFile) {
        file_url = await uploadToBucket(supabase, BUCKET_FILES, user.id, docFile);
      }

      const { error: insertError } = await supabase.from("toy_submissions").insert({
        toy_name: toyName,
        chapter_id: profile.chapter_id,
        submitted_by: user.id,
        difficulty,
        materials,
        instructions,
        status: "pending",
        image_url,
        video_url,
        file_url,
        safety_notes: null,
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setSuccess("Toy submission sent for review.");
      setToyName("");
      setMaterials("");
      setInstructions("");
      clearFiles();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 md:space-y-10 md:pb-16">
      <section
        className="rounded-2xl px-6 py-8 text-white sm:px-8 sm:py-9 md:px-10 md:py-10"
        style={{ background: "linear-gradient(145deg, #5DBAAB 0%, #4AA89A 50%, #3d9488 100%)" }}
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">Submission</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">Submit a toy</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-[15px]">
          Three steps: basics, media, then details. Use the dashed areas to attach files so reviewers can evaluate your
          adaptation.
        </p>
        <ol className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-2.5">
          <li className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/95 sm:text-xs">
            1 · Basics
          </li>
          <li className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/95 sm:text-xs">
            2 · Media
          </li>
          <li className="rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/95 sm:text-xs">
            3 · Details
          </li>
        </ol>
      </section>

      <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10 lg:space-y-12">
        <SectionShell
          step={1}
          title="Toy basics"
          description="Name your adaptation and pick how difficult the build is."
        >
          <div className="space-y-8 md:space-y-10">
            <div>
              <label
                htmlFor={`${baseId}-name`}
                className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Toy name <span className="text-red-500">*</span>
              </label>
              <input
                id={`${baseId}-name`}
                className={`mt-3 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 md:py-4 ${tealFocus}`}
                required
                placeholder="e.g. Switch-adapted bubble machine"
                value={toyName}
                onChange={(e) => setToyName(e.target.value)}
              />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Difficulty <span className="text-red-500">*</span>
              </p>
              <p className="mt-2 text-sm text-zinc-500">Tap one option</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
                {difficulties.map((d) => {
                  const sel = difficulty === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className={`rounded-2xl border-2 px-5 py-5 text-left transition md:px-6 md:py-6 ${
                        sel
                          ? "border-[#4AA89A] bg-[#eef8f7] shadow-sm ring-1 ring-[#4AA89A]/30"
                          : "border-zinc-200 bg-zinc-50/50 hover:border-zinc-300 hover:bg-white"
                      }`}
                    >
                      <span className="block text-sm font-bold text-zinc-900">
                        {difficultyUi[d].label}
                      </span>
                      <span className="mt-2 block text-xs leading-relaxed text-zinc-600 md:text-sm">
                        {difficultyUi[d].sub}
                      </span>
                      {sel && (
                        <span className="mt-3 inline-flex text-xs font-semibold text-[#3d9488]">
                          ✓ Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionShell>

        <SectionShell
          step={2}
          title="Photos, video & documents"
          description="Optional but helpful — reviewers and other chapters can see what you built."
        >
          <div className="grid gap-8 md:grid-cols-3 md:gap-8 lg:gap-10">
            <UploadDropZone
              inputId={`${baseId}-img`}
              inputRef={imageInputRef}
              accept="image/*"
              title="Toy photo"
              hint="JPG, PNG, or other images. Tap the box or the orange button."
              badge="Image"
              file={imageFile}
              onPick={setImageFile}
              onClear={() => {
                setImageFile(null);
                if (imageInputRef.current) imageInputRef.current.value = "";
              }}
            >
              {imagePreview && (
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white p-3 shadow-sm md:p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-56 w-full object-contain md:max-h-64"
                  />
                </div>
              )}
            </UploadDropZone>

            <UploadDropZone
              inputId={`${baseId}-vid`}
              inputRef={videoInputRef}
              accept="video/*"
              title="Walkthrough video"
              hint="Short clip showing the switch or adaptation in use."
              badge="Video"
              file={videoFile}
              onPick={setVideoFile}
              onClear={() => {
                setVideoFile(null);
                if (videoInputRef.current) videoInputRef.current.value = "";
              }}
            >
              {videoPreview && (
                <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-900/5 p-3 md:p-4">
                  <video
                    src={videoPreview}
                    controls
                    className="max-h-56 w-full rounded-lg md:max-h-64"
                    playsInline
                  />
                </div>
              )}
            </UploadDropZone>

            <UploadDropZone
              inputId={`${baseId}-doc`}
              inputRef={docInputRef}
              accept=".pdf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              title="PDF or handout"
              hint="Instructions sheet, wiring diagram, or BOM."
              badge="File"
              file={docFile}
              onPick={setDocFile}
              onClear={() => {
                setDocFile(null);
                if (docInputRef.current) docInputRef.current.value = "";
              }}
            />
          </div>
        </SectionShell>

        <SectionShell
          step={3}
          title="Materials & Instructions"
          description="Required — list parts and how someone else can reproduce the mod safely."
        >
          <div className="space-y-8 md:space-y-10">
            <div>
              <label
                htmlFor={`${baseId}-mat`}
                className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Materials <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`${baseId}-mat`}
                className={`mt-3 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 md:py-5 ${tealFocus}`}
                rows={5}
                required
                placeholder="Parts, tools, switches, batteries, glue — one per line or short paragraphs."
                value={materials}
                onChange={(e) => setMaterials(e.target.value)}
              />
            </div>
            <div>
              <label
                htmlFor={`${baseId}-inst`}
                className="text-xs font-semibold uppercase tracking-wide text-zinc-500"
              >
                Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                id={`${baseId}-inst`}
                className={`mt-3 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 md:py-5 ${tealFocus}`}
                rows={8}
                required
                placeholder="Step-by-step: how you opened the toy, where you soldered, how the switch connects, testing tips…"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>
        </SectionShell>

        {error && (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm leading-relaxed text-red-800 md:px-6 md:py-5"
            role="alert"
          >
            {error}
          </div>
        )}
        {success && (
          <div
            className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm leading-relaxed text-emerald-900 md:px-6 md:py-5"
            role="status"
          >
            {success}
          </div>
        )}

        <div className="flex flex-col gap-6 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:p-8 lg:p-10">
          <div className="max-w-xl text-sm leading-relaxed text-zinc-600">
            <p className="text-base font-semibold text-zinc-900">Ready to send?</p>
            <p className="mt-3 text-sm md:text-[15px]">
              Your chapter lead and CATCH admins will be able to review. You can track status under{" "}
              <strong className="text-zinc-800">My Submissions</strong> in the sidebar.
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            data-catch-primary="true"
            className="inline-flex min-h-[52px] min-w-[220px] shrink-0 items-center justify-center rounded-full px-10 py-3.5 text-sm font-semibold shadow-md transition disabled:cursor-not-allowed disabled:opacity-60 md:text-base"
          >
            {loading ? "Uploading & submitting…" : "Submit for review"}
          </button>
        </div>
      </form>
    </div>
  );
}
