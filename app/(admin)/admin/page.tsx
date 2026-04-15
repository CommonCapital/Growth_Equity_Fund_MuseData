"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import { useQuery, useMutation, useConvex, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import {
  Users, Building2, X, Download, Mail, Phone, MapPin,
  Linkedin, Globe, Calendar, Eye, Plus, Handshake,
  Trash2, Edit3, Save, RefreshCw, Search, XCircle,
  ChevronDown, FileText, Upload, CheckCircle2, Paperclip,
  Zap,
} from "lucide-react";

// ─── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  deep:   "#0A2F42",
  mid:    "#1B5E7B",
  slate:  "#4A6B7C",
  bright: "#3BA3CB",
  main:   "#2A7FA0",
  ghost:  "#F2F8FB",
  border: "rgba(42,127,160,0.13)",
  borderStrong: "rgba(42,127,160,0.28)",
};

const ADMIN_EMAILS = ["partners@musedata.ai", "collin@musedata.ai", "nursan2007@gmail.com", "noorulainmalik77@gmail.com"];

const fmt = (ts: number) => new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtOpt = (ts?: number) => ts ? fmt(ts) : "—";

// ─── Status configs ────────────────────────────────────────────────────────────
const JOB_STATUS: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> = {
  submitted:    { label: "Submitted",    textColor: "#0369a1", bgColor: "#e0f2fe", dot: "#0ea5e9" },
  under_review: { label: "Under Review", textColor: "#92400e", bgColor: "#fef3c7", dot: "#f59e0b" },
  interviewing: { label: "Interviewing", textColor: "#5b21b6", bgColor: "#ede9fe", dot: "#7c3aed" },
  accepted:     { label: "Accepted",     textColor: "#065f46", bgColor: "#d1fae5", dot: "#10b981" },
  rejected:     { label: "Rejected",     textColor: "#991b1b", bgColor: "#fee2e2", dot: "#ef4444" },
};
const STARTUP_STATUS: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> = {
  submitted:     { label: "Submitted",     textColor: "#0369a1", bgColor: "#e0f2fe", dot: "#0ea5e9" },
  under_review:  { label: "Under Review",  textColor: "#92400e", bgColor: "#fef3c7", dot: "#f59e0b" },
  due_diligence: { label: "Due Diligence", textColor: "#5b21b6", bgColor: "#ede9fe", dot: "#7c3aed" },
  term_sheet:    { label: "Term Sheet",    textColor: "#7c2d12", bgColor: "#ffedd5", dot: "#f97316" },
  funded:        { label: "Funded",        textColor: "#065f46", bgColor: "#d1fae5", dot: "#10b981" },
  rejected:      { label: "Rejected",      textColor: "#991b1b", bgColor: "#fee2e2", dot: "#ef4444" },
  on_hold:       { label: "On Hold",       textColor: "#374151", bgColor: "#f3f4f6", dot: "#9ca3af" },
};
const LP_STATUS: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> = {
  prospect:       { label: "Prospect",    textColor: "#0369a1", bgColor: "#e0f2fe", dot: "#0ea5e9" },
  contacted:      { label: "Contacted",   textColor: "#92400e", bgColor: "#fef3c7", dot: "#f59e0b" },
  interested:     { label: "Interested",  textColor: "#5b21b6", bgColor: "#ede9fe", dot: "#7c3aed" },
  soft_committed: { label: "Soft Commit", textColor: "#7c2d12", bgColor: "#ffedd5", dot: "#f97316" },
  committed:      { label: "Committed",   textColor: "#065f46", bgColor: "#d1fae5", dot: "#10b981" },
  closed:         { label: "Closed",      textColor: "#134e4a", bgColor: "#ccfbf1", dot: "#14b8a6" },
  declined:       { label: "Declined",    textColor: "#991b1b", bgColor: "#fee2e2", dot: "#ef4444" },
};
const LP_TYPES: Record<string, string> = {
  hnwi: "HNWI", family_office: "Family Office", endowment: "Endowment",
  pension_fund: "Pension Fund", corporate: "Corporate",
  fund_of_funds: "Fund of Funds", sovereign_wealth: "Sovereign Wealth", other: "Other",
};
const SPRINT_PARTICIPANT_STATUS: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> = {
  submitted:    { label: "Submitted",    textColor: "#0369a1", bgColor: "#e0f2fe", dot: "#0ea5e9" },
  under_review: { label: "Under Review", textColor: "#92400e", bgColor: "#fef3c7", dot: "#f59e0b" },
  accepted:     { label: "Accepted",     textColor: "#065f46", bgColor: "#d1fae5", dot: "#10b981" },
  rejected:     { label: "Rejected",     textColor: "#991b1b", bgColor: "#fee2e2", dot: "#ef4444" },
  waitlisted:   { label: "Waitlisted",   textColor: "#5b21b6", bgColor: "#ede9fe", dot: "#7c3aed" },
};
 
const SPRINT_SPONSOR_STATUS: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> = {
  submitted:    { label: "Submitted",    textColor: "#0369a1", bgColor: "#e0f2fe", dot: "#0ea5e9" },
  under_review: { label: "Under Review", textColor: "#92400e", bgColor: "#fef3c7", dot: "#f59e0b" },
  in_discussion:{ label: "In Discussion",textColor: "#5b21b6", bgColor: "#ede9fe", dot: "#7c3aed" },
  committed:    { label: "Committed",    textColor: "#065f46", bgColor: "#d1fae5", dot: "#10b981" },
  declined:     { label: "Declined",     textColor: "#991b1b", bgColor: "#fee2e2", dot: "#ef4444" },
};

// ─── Atoms ────────────────────────────────────────────────────────────────────
function Badge({ status, cfg }: { status: string; cfg: Record<string, { label: string; textColor: string; bgColor: string; dot: string }> }) {
  const c = cfg[status];
  if (!c) return null;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ color: c.textColor, background: c.bgColor }}>
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />
      {c.label}
    </span>
  );
}

function Pill({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "green" | "amber" | "navy" }) {
  const styles: Record<string, { color: string; bg: string; border: string }> = {
    default: { color: T.slate,  bg: T.ghost,          border: T.border },
    green:   { color: "#065f46",bg: "#d1fae5",         border: "#a7f3d0" },
    amber:   { color: "#92400e",bg: "#fef3c7",         border: "#fcd34d" },
    navy:    { color: T.main,   bg: "rgba(42,127,160,0.08)", border: T.border },
  };
  const s = styles[variant];
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}>
      {children}
    </span>
  );
}

function Spinner() {
  return <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: T.bright, borderTopColor: "transparent" }} />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: T.slate }}>{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>;
}
function Field({ label, value, long }: { label: string; value?: string | null; long?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] mb-0.5" style={{ color: T.slate }}>{label}</p>
      {long
        ? <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: T.deep }}>{value}</p>
        : <p className="text-sm font-medium" style={{ color: T.deep }}>{value}</p>}
    </div>
  );
}
function Tag({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "green" | "amber" | "violet" }) {
  const styles: Record<string, { color: string; bg: string; border: string }> = {
    default: { color: T.slate,  bg: T.ghost,  border: T.border },
    green:   { color: "#065f46",bg: "#d1fae5",border: "#a7f3d0" },
    amber:   { color: "#92400e",bg: "#fef3c7",border: "#fcd34d" },
    violet:  { color: "#5b21b6",bg: "#ede9fe",border: "#c4b5fd" },
  };
  const s = styles[variant];
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-semibold border capitalize"
      style={{ color: s.color, background: s.bg, borderColor: s.border }}>
      {children}
    </span>
  );
}

// ─── Form atoms ────────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  background: "#fff",
  border: `1px solid ${T.border}`,
  borderRadius: "8px",
  padding: "8px 12px",
  fontSize: "13px",
  color: T.deep,
  width: "100%",
  outline: "none",
  transition: "border-color 0.15s, box-shadow 0.15s",
  fontFamily: "inherit",
};

function FInput({ label, value, onChange, placeholder, required, type = "text", hint }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string; hint?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
        style={{ color: focused ? T.main : T.slate }}>
        {label}{required && <span className="text-red-500 text-[10px]">✱</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputBase, borderColor: focused ? T.bright : T.border, boxShadow: focused ? `0 0 0 3px rgba(42,127,160,0.10)` : "none" }}
      />
      {hint && <p className="text-[10px] mt-1.5 ml-0.5" style={{ color: T.slate }}>{hint}</p>}
    </div>
  );
}

function FSelect({ label, value, onChange, options, required }:
  { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
        style={{ color: focused ? T.main : T.slate }}>
        {label}{required && <span className="text-red-500 text-[10px]">✱</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          style={{ ...inputBase, appearance: "none", paddingRight: "32px", borderColor: focused ? T.bright : T.border, boxShadow: focused ? `0 0 0 3px rgba(42,127,160,0.10)` : "none", color: value ? T.deep : T.slate }}>
          <option value="">Select…</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: focused ? T.main : T.slate }} />
      </div>
    </div>
  );
}

function FTextarea({ label, value, onChange, placeholder, rows = 3 }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5"
        style={{ color: focused ? T.main : T.slate }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...inputBase, resize: "vertical", minHeight: `${rows * 24 + 24}px`, borderColor: focused ? T.bright : T.border, boxShadow: focused ? `0 0 0 3px rgba(42,127,160,0.10)` : "none" }}
      />
    </div>
  );
}

function RatingPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const n = Number(value);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium" style={{ color: T.slate }}>Internal Rating</label>
        {value && <span className="text-xs font-bold" style={{ color: n <= 3 ? "#ef4444" : n <= 6 ? "#f59e0b" : "#10b981" }}>{n}/10 · {n <= 3 ? "Low" : n <= 6 ? "Medium" : "High"}</span>}
      </div>
      <div className="flex gap-1.5">
        {[1,2,3,4,5,6,7,8,9,10].map(num => {
          const isActive = value === String(num);
          const col = num <= 3 ? "#ef4444" : num <= 6 ? "#f59e0b" : "#10b981";
          return (
            <button key={num} type="button" onClick={() => onChange(String(num))}
              className="flex-1 h-8 rounded-md text-xs font-bold border transition-all"
              style={{ background: isActive ? col : "#fff", color: isActive ? "#fff" : T.slate, borderColor: isActive ? col : T.border }}>
              {num}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function FCheckboxGroup({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-2" style={{ color: T.slate }}>{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => {
          const active = value.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
              style={active
                ? { background: "rgba(42,127,160,0.12)", color: T.main, borderColor: T.main }
                : { background: "#fff", color: T.slate, borderColor: T.border }}>
              {active && <span className="mr-1 text-[10px]">✓</span>}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
// ─── PDF Upload Component ─────────────────────────────────────────────────────
function FPdfUpload({ label, storageId, onUploaded, hint }:
  { label: string; storageId: string; onUploaded: (id: string) => void; hint?: string }) {
  const generateUploadUrl = useMutation(api.admin.generateUploadUrl);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Only PDF files are accepted."); return; }
    if (file.size > 20 * 1024 * 1024) { setError("File must be under 20 MB."); return; }
    setError(""); setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();
      const res = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId: newId } = await res.json();
      onUploaded(newId);
      setFileName(file.name);
    } catch (e: any) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const done = !!storageId;

  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-1.5" style={{ color: T.slate }}>
        <FileText className="w-3.5 h-3.5" style={{ color: T.main }} />
        {label}
      </label>
      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => !uploading && inputRef.current?.click()}
        className="relative flex items-center gap-3 px-4 py-3.5 rounded-xl border cursor-pointer transition-all select-none"
        style={{
          border: done ? `1.5px solid #10b981` : `1.5px dashed ${T.borderStrong}`,
          background: done ? "#f0fdf4" : T.ghost,
        }}
      >
        <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

        {uploading ? (
          <>
            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin flex-shrink-0"
              style={{ borderColor: T.main, borderTopColor: "transparent" }} />
            <span className="text-sm" style={{ color: T.slate }}>Uploading…</span>
          </>
        ) : done ? (
          <>
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#10b981" }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "#065f46" }}>
                {fileName || "File uploaded"}
              </p>
              <p className="text-[11px]" style={{ color: "#059669" }}>PDF attached · click to replace</p>
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); onUploaded(""); setFileName(""); }}
              className="flex-shrink-0 p-1 rounded-md hover:bg-red-50 transition-colors">
              <X className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
            </button>
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 flex-shrink-0" style={{ color: T.main }} />
            <div>
              <p className="text-sm font-medium" style={{ color: T.deep }}>Drop PDF here or click to browse</p>
              <p className="text-[11px]" style={{ color: T.slate }}>{hint ?? "PDF only · max 20 MB"}</p>
            </div>
          </>
        )}
      </div>
      {error && <p className="text-[11px] mt-1.5 text-red-500">{error}</p>}
    </div>
  );
}

// ─── Download button ───────────────────────────────────────────────────────────
function DocButton({ storageId, label }: { storageId: Id<"_storage">; label: string }) {
  const convex = useConvex();
  const [loading, setLoading] = useState(false);
  const download = async () => {
    setLoading(true);
    try {
      const url = await convex.query(api.admin.getFileUrl, { storageId });
      if (!url) return;
      const blob = await (await fetch(url)).blob();
      const a = document.createElement("a");
      a.href = window.URL.createObjectURL(blob);
      a.download = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } finally { setLoading(false); }
  };
  return (
    <button onClick={download} disabled={loading}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
      style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.main }}>
      <Download className="w-4 h-4" />
      {loading ? "Downloading…" : label}
    </button>
  );
}

// ─── Drawer shell ──────────────────────────────────────────────────────────────
function DrawerShell({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title?: string }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <>
      <div className="fixed inset-0 z-[45] bg-black/25 backdrop-blur-sm" style={{ top: "56px" }} onClick={onClose} />
      <div className="fixed right-0 bottom-0 z-[46] flex flex-col shadow-2xl"
        style={{ top: "56px", width: "min(100vw, 640px)", background: "#fff", borderLeft: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: T.slate }}>{title ?? "Detail"}</span>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
            style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">{children}</div>
      </div>
    </>
  );
}

// ─── Modal shell ───────────────────────────────────────────────────────────────
function ModalShell({ children, onClose, title, subtitle, onSave, saving, saveLabel = "Save", icon }:
  { children: React.ReactNode; onClose: () => void; title: string; subtitle?: string;
    onSave: () => void; saving: boolean; saveLabel?: string; icon?: React.ReactNode }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  return (
    <>
      <div className="fixed inset-0 z-[55] bg-black/20 backdrop-blur-sm" style={{ top: "56px" }} onClick={onClose} />
      <div className="fixed right-0 bottom-0 z-[56] flex flex-col shadow-2xl"
        style={{ top: "56px", width: "min(100vw, 520px)", background: "#fff", borderLeft: `1px solid ${T.border}` }}>
        {/* Accent top line */}
        <div className="h-0.5 flex-shrink-0" style={{ background: `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-4 flex-shrink-0"
          style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-center gap-3 min-w-0">
            {icon && (
              <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                style={{ background: "rgba(42,127,160,0.10)", border: `1px solid ${T.border}` }}>
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <h2 className="text-sm font-semibold truncate" style={{ color: T.deep }}>{title}</h2>
              {subtitle && <p className="text-xs mt-0.5 truncate" style={{ color: T.slate }}>{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose}
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-red-50"
            style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-5 pb-4">
          <div className="space-y-7 py-4">{children}</div>
        </div>
        <div className="flex-shrink-0 px-5 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${T.border}`, background: T.ghost }}>
          <button onClick={onClose} className="text-sm font-medium transition-colors" style={{ color: T.slate }}>Cancel</button>
          <button onClick={onSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ background: saving ? T.mid : `linear-gradient(135deg, ${T.mid} 0%, ${T.main} 100%)`, boxShadow: saving ? "none" : "0 4px 14px rgba(42,127,160,0.30)" }}>
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving…" : saveLabel}
          </button>
        </div>
      </div>
    </>
  );
}

function FormSection({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(42,127,160,0.10)", border: `1px solid ${T.border}` }}>
          <span className="text-[10px] font-bold" style={{ color: T.main }}>{step}</span>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: T.slate }}>{title}</span>
        <div className="flex-1 h-px" style={{ background: T.border }} />
      </div>
      <div className="space-y-4 pl-9">{children}</div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm" style={{ color: T.slate }}>Delete this record?</span>
      <button onClick={onConfirm} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all">Yes, Delete</button>
      <button onClick={onCancel} className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
        style={{ color: T.slate, border: `1px solid ${T.border}`, background: T.ghost }}>Cancel</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOB MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const JOB_POSITIONS = ["Software Engineer","Frontend Engineer","Backend Engineer","Full-Stack Engineer","Data Scientist","Data Analyst","ML Engineer","Product Manager","Designer","Marketing","Sales","Operations","Finance","Other"];
const JOB_EXPERIENCES = ["0–1","1–3","3–5","5–10","10+"];
const JOB_STATUSES = Object.entries(JOB_STATUS).map(([v, c]) => ({ value: v, label: c.label }));

type JobForm = { fullName: string; email: string; phone: string; location: string; currentRole: string; experience: string; linkedin: string; portfolio: string; position: string; motivation: string; skills: string; status: string; };
const EMPTY_JOB: JobForm = { fullName:"", email:"", phone:"", location:"", currentRole:"", experience:"", linkedin:"", portfolio:"", position:"", motivation:"", skills:"", status:"submitted" };

function JobModal({ onClose, initial, jobId }: { onClose: () => void; initial?: Partial<JobForm>; jobId?: Id<"jobApplications"> }) {
  const createJob = useMutation(api.admin.createJobApplication);
  const updateJob = useMutation(api.admin.updateJobApplication);
  const [form, setForm] = useState<JobForm>({ ...EMPTY_JOB, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof JobForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.fullName || !form.email || !form.location || !form.currentRole || !form.position) { setError("Please fill in all required fields."); return; }
    setError(""); setSaving(true);
    try {
      const p = { fullName: form.fullName, email: form.email, phone: form.phone || undefined, location: form.location, currentRole: form.currentRole, experience: form.experience || "0–1", linkedin: form.linkedin || undefined, portfolio: form.portfolio || undefined, position: form.position, motivation: form.motivation || "Manually added", skills: form.skills || "—", status: (form.status || "submitted") as any };
      if (jobId) await updateJob({ applicationId: jobId, ...p });
      else await createJob(p);
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };
  return (
    <ModalShell title={jobId ? "Edit Job Application" : "Add Job Application"} subtitle="Manually enter applicant details" onClose={onClose} onSave={save} saving={saving} saveLabel={jobId ? "Save Changes" : "Add Applicant"} icon={<Users className="w-4 h-4" style={{ color: T.main }} />}>
      <FormSection step={1} title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FInput label="Full Name" value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" required />
          <FInput label="Email" value={form.email} onChange={set("email")} placeholder="jane@email.com" required type="email" />
          <FInput label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
          <FInput label="Location" value={form.location} onChange={set("location")} placeholder="New York, NY" required />
        </div>
      </FormSection>
      <FormSection step={2} title="Professional Background">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FInput label="Current Role / Title" value={form.currentRole} onChange={set("currentRole")} placeholder="Senior Engineer" required />
          <FSelect label="Experience" value={form.experience} onChange={set("experience")} options={JOB_EXPERIENCES.map(v => ({ value: v, label: v + " years" }))} />
          <FInput label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/…" />
          <FInput label="Portfolio / Website" value={form.portfolio} onChange={set("portfolio")} placeholder="https://…" />
        </div>
      </FormSection>
      <FormSection step={3} title="Application Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Position" value={form.position} onChange={set("position")} options={JOB_POSITIONS.map(v => ({ value: v.toLowerCase(), label: v }))} required />
          <FSelect label="Status" value={form.status} onChange={set("status")} options={JOB_STATUSES} required />
        </div>
        <FTextarea label="Motivation / Why MUSEDATA" value={form.motivation} onChange={set("motivation")} placeholder="Why they want to join…" rows={3} />
        <FTextarea label="Skills & Technologies" value={form.skills} onChange={set("skills")} placeholder="React, TypeScript, Python…" rows={2} />
      </FormSection>
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </ModalShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STARTUP MODAL — with PDF uploads
// ═══════════════════════════════════════════════════════════════════════════════
const INDUSTRIES = ["FinTech","HealthTech","EdTech","SaaS","E-commerce","AI/ML","Web3/Crypto","CleanTech","Logistics","Real Estate","Consumer","B2B","DeepTech","Other"];
const INCORP_STATUSES = [{ value:"incorporated",label:"Incorporated" },{ value:"in_progress",label:"In Progress" },{ value:"not_yet",label:"Not Yet" }];
const STAGES = [{ value:"idea",label:"Idea" },{ value:"prototype",label:"Prototype" },{ value:"mvp",label:"MVP" },{ value:"early_revenue",label:"Early Revenue" },{ value:"growth",label:"Growth" }];
const FUNDING_STAGES = [{ value:"pre_seed",label:"Pre-Seed" },{ value:"seed",label:"Seed" },{ value:"series_a",label:"Series A" },{ value:"series_b",label:"Series B" },{ value:"series_c_plus",label:"Series C+" }];
const STARTUP_STATUSES = Object.entries(STARTUP_STATUS).map(([v, c]) => ({ value: v, label: c.label }));

type StartupForm = {
  founderName: string; founderEmail: string; founderPhone: string; founderLinkedin: string; coFounders: string;
  companyName: string; companyWebsite: string; companyLocation: string; incorporationStatus: string; industry: string; stage: string;
  businessModel: string; problemStatement: string; solution: string; uniqueValueProposition: string;
  targetMarket: string; marketSize: string; competitors: string; competitiveAdvantage: string;
  currentRevenue: string; revenueGrowth: string; numberOfCustomers: string;
  keyMilestones: string; fundingStage: string; fundingAmount: string; previousFunding: string;
  currentInvestors: string; useOfFunds: string; valuation: string;
  teamSize: string; keyTeamMembers: string; advisors: string;
  productDescription: string; technologyStack: string;
  customerAcquisition: string; salesStrategy: string; marketingStrategy: string;
  burnRate: string; runway: string;
  whyUs: string; referralSource: string; exitStrategy: string; challenges: string;
  status: string; internalRating: string;
  pitchDeckStorageId: string; financialModelStorageId: string;
};
const EMPTY_STARTUP: StartupForm = {
  founderName:"",founderEmail:"",founderPhone:"",founderLinkedin:"",coFounders:"",
  companyName:"",companyWebsite:"",companyLocation:"",incorporationStatus:"",industry:"",stage:"",
  businessModel:"",problemStatement:"",solution:"",uniqueValueProposition:"",
  targetMarket:"",marketSize:"",competitors:"",competitiveAdvantage:"",
  currentRevenue:"",revenueGrowth:"",numberOfCustomers:"",
  keyMilestones:"",fundingStage:"",fundingAmount:"",previousFunding:"",
  currentInvestors:"",useOfFunds:"",valuation:"",
  teamSize:"",keyTeamMembers:"",advisors:"",
  productDescription:"",technologyStack:"",
  customerAcquisition:"",salesStrategy:"",marketingStrategy:"",
  burnRate:"",runway:"",
  whyUs:"",referralSource:"",exitStrategy:"",challenges:"",
  status:"submitted",internalRating:"",
  pitchDeckStorageId:"",financialModelStorageId:"",
};

function StartupModal({ onClose, initial, startupId }: { onClose: () => void; initial?: Partial<StartupForm>; startupId?: Id<"startupApplications"> }) {
  const create = useMutation(api.admin.createStartupApplication);
  const [form, setForm] = useState<StartupForm>({ ...EMPTY_STARTUP, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof StartupForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    const req = ["founderName","founderEmail","companyName","companyLocation","incorporationStatus","industry","stage","businessModel","problemStatement","solution","uniqueValueProposition","targetMarket","keyMilestones","fundingStage","fundingAmount","useOfFunds","teamSize","keyTeamMembers","productDescription","customerAcquisition","salesStrategy","whyUs"];
    const missing = req.filter(k => !form[k as keyof StartupForm]);
    if (missing.length) { setError(`Please fill in: ${missing.slice(0,3).join(", ")}${missing.length > 3 ? "…" : ""}`); return; }
    setError(""); setSaving(true);
    try {
      await create({
        founderName: form.founderName, founderEmail: form.founderEmail, founderPhone: form.founderPhone || undefined, founderLinkedin: form.founderLinkedin || undefined, coFounders: form.coFounders || undefined,
        companyName: form.companyName, companyWebsite: form.companyWebsite || undefined, companyLocation: form.companyLocation, incorporationStatus: form.incorporationStatus as any, industry: form.industry, stage: form.stage as any,
        businessModel: form.businessModel, problemStatement: form.problemStatement, solution: form.solution, uniqueValueProposition: form.uniqueValueProposition, targetMarket: form.targetMarket, marketSize: form.marketSize || undefined, competitors: form.competitors || undefined, competitiveAdvantage: form.competitiveAdvantage || undefined,
        currentRevenue: form.currentRevenue || undefined, revenueGrowth: form.revenueGrowth || undefined, numberOfCustomers: form.numberOfCustomers || undefined,
        keyMilestones: form.keyMilestones, fundingStage: form.fundingStage as any, fundingAmount: form.fundingAmount, previousFunding: form.previousFunding || undefined, currentInvestors: form.currentInvestors || undefined, useOfFunds: form.useOfFunds, valuation: form.valuation || undefined,
        teamSize: form.teamSize, keyTeamMembers: form.keyTeamMembers, advisors: form.advisors || undefined,
        productDescription: form.productDescription, technologyStack: form.technologyStack || undefined,
        customerAcquisition: form.customerAcquisition, salesStrategy: form.salesStrategy, marketingStrategy: form.marketingStrategy || undefined,
        burnRate: form.burnRate || undefined, runway: form.runway || undefined,
        whyUs: form.whyUs, referralSource: form.referralSource || undefined, exitStrategy: form.exitStrategy || undefined, challenges: form.challenges || undefined,
        status: form.status as any, internalRating: form.internalRating ? Number(form.internalRating) : undefined,
        pitchDeckStorageId: form.pitchDeckStorageId ? (form.pitchDeckStorageId as Id<"_storage">) : undefined,
        financialModelStorageId: form.financialModelStorageId ? (form.financialModelStorageId as Id<"_storage">) : undefined,
      });
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };

  const G2 = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;

  return (
    <ModalShell title={startupId ? "Edit Startup" : "Add Startup Application"} subtitle="Manually enter startup details" onClose={onClose} onSave={save} saving={saving} saveLabel={startupId ? "Save Changes" : "Add Startup"} icon={<Building2 className="w-4 h-4" style={{ color: T.main }} />}>

      {/* ── Documents (top, most important) ── */}
      <FormSection step={1} title="Documents">
        <div className="space-y-3">
          <FPdfUpload label="Pitch Deck" storageId={form.pitchDeckStorageId} onUploaded={set("pitchDeckStorageId")} hint="Upload your investor pitch deck · PDF only · max 20 MB" />
          <FPdfUpload label="Financial Model / Projections" storageId={form.financialModelStorageId} onUploaded={set("financialModelStorageId")} hint="Revenue model, P&L, cap table · PDF only · max 20 MB" />
        </div>
      </FormSection>

      <FormSection step={2} title="Founder">
        <G2>
          <FInput label="Founder Name" value={form.founderName} onChange={set("founderName")} placeholder="John Doe" required />
          <FInput label="Founder Email" value={form.founderEmail} onChange={set("founderEmail")} placeholder="john@startup.com" required type="email" />
          <FInput label="Phone" value={form.founderPhone} onChange={set("founderPhone")} placeholder="+1 555 000 0000" />
          <FInput label="LinkedIn" value={form.founderLinkedin} onChange={set("founderLinkedin")} placeholder="https://linkedin.com/in/…" />
        </G2>
        <FInput label="Co-Founders" value={form.coFounders} onChange={set("coFounders")} placeholder="Alice (CTO), Bob (COO)" />
      </FormSection>

      <FormSection step={3} title="Company">
        <G2>
          <FInput label="Company Name" value={form.companyName} onChange={set("companyName")} placeholder="Acme Inc." required />
          <FInput label="Website" value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="https://…" />
          <FInput label="Location" value={form.companyLocation} onChange={set("companyLocation")} placeholder="San Francisco, CA" required />
          <FSelect label="Incorporation" value={form.incorporationStatus} onChange={set("incorporationStatus")} options={INCORP_STATUSES} required />
          <FSelect label="Industry" value={form.industry} onChange={set("industry")} options={INDUSTRIES.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Stage" value={form.stage} onChange={set("stage")} options={STAGES} required />
        </G2>
      </FormSection>

      <FormSection step={4} title="Business">
        <FTextarea label="Problem Statement" value={form.problemStatement} onChange={set("problemStatement")} placeholder="What problem are you solving?" rows={2} />
        <FTextarea label="Solution" value={form.solution} onChange={set("solution")} placeholder="How do you solve it?" rows={2} />
        <FTextarea label="Unique Value Proposition" value={form.uniqueValueProposition} onChange={set("uniqueValueProposition")} placeholder="What makes you different?" rows={2} />
        <FTextarea label="Business Model" value={form.businessModel} onChange={set("businessModel")} placeholder="How do you make money?" rows={2} />
        <FTextarea label="Target Market" value={form.targetMarket} onChange={set("targetMarket")} placeholder="Who are your customers?" rows={2} />
        <G2>
          <FInput label="Market Size" value={form.marketSize} onChange={set("marketSize")} placeholder="$10B TAM" hint="TAM / SAM / SOM" />
          <FInput label="Key Competitors" value={form.competitors} onChange={set("competitors")} placeholder="Stripe, Square…" />
        </G2>
      </FormSection>

      <FormSection step={5} title="Traction">
        <G2>
          <FInput label="Current Revenue" value={form.currentRevenue} onChange={set("currentRevenue")} placeholder="$50K MRR" />
          <FInput label="Revenue Growth" value={form.revenueGrowth} onChange={set("revenueGrowth")} placeholder="20% MoM" />
          <FInput label="Customers" value={form.numberOfCustomers} onChange={set("numberOfCustomers")} placeholder="500" />
          <FInput label="Burn Rate" value={form.burnRate} onChange={set("burnRate")} placeholder="$80K/mo" />
          <FInput label="Runway" value={form.runway} onChange={set("runway")} placeholder="18 months" />
        </G2>
        <FTextarea label="Key Milestones" value={form.keyMilestones} onChange={set("keyMilestones")} placeholder="Launched MVP · 500 users · $100K ARR…" rows={2} />
      </FormSection>

      <FormSection step={6} title="Funding">
        <G2>
          <FSelect label="Funding Stage" value={form.fundingStage} onChange={set("fundingStage")} options={FUNDING_STAGES} required />
          <FInput label="Amount Seeking" value={form.fundingAmount} onChange={set("fundingAmount")} placeholder="$2M" required />
          <FInput label="Valuation" value={form.valuation} onChange={set("valuation")} placeholder="$10M pre-money" />
          <FInput label="Previous Funding" value={form.previousFunding} onChange={set("previousFunding")} placeholder="$500K angel" />
          <FInput label="Current Investors" value={form.currentInvestors} onChange={set("currentInvestors")} placeholder="Y Combinator…" />
        </G2>
        <FTextarea label="Use of Funds" value={form.useOfFunds} onChange={set("useOfFunds")} placeholder="50% engineering, 30% sales…" rows={2} />
      </FormSection>

      <FormSection step={7} title="Team & Product">
        <G2>
          <FInput label="Team Size" value={form.teamSize} onChange={set("teamSize")} placeholder="8" required />
          <FInput label="Tech Stack" value={form.technologyStack} onChange={set("technologyStack")} placeholder="React, Node.js, Postgres…" />
        </G2>
        <FTextarea label="Key Team Members" value={form.keyTeamMembers} onChange={set("keyTeamMembers")} placeholder="John (CEO, ex-Google) · Alice (CTO, PhD MIT)…" rows={2} />
        <FTextarea label="Product Description" value={form.productDescription} onChange={set("productDescription")} placeholder="What does the product do?" rows={2} />
      </FormSection>

      <FormSection step={8} title="Go-to-Market">
        <FTextarea label="Customer Acquisition" value={form.customerAcquisition} onChange={set("customerAcquisition")} placeholder="How do you get customers?" rows={2} />
        <FTextarea label="Sales Strategy" value={form.salesStrategy} onChange={set("salesStrategy")} placeholder="Direct sales, PLG, partnerships…" rows={2} />
        <FTextarea label="Marketing Strategy" value={form.marketingStrategy} onChange={set("marketingStrategy")} placeholder="Content, paid, referral…" rows={2} />
      </FormSection>

      <FormSection step={9} title="Admin & Review">
        <G2>
          <FSelect label="Initial Status" value={form.status} onChange={set("status")} options={STARTUP_STATUSES} required />
          <FInput label="Referral Source" value={form.referralSource} onChange={set("referralSource")} placeholder="Conference, LinkedIn…" />
        </G2>
        <RatingPicker value={form.internalRating} onChange={set("internalRating")} />
        <FTextarea label="Why MUSEDATA?" value={form.whyUs} onChange={set("whyUs")} placeholder="Why are they approaching us?" rows={2} />
        <FTextarea label="Challenges / Risks" value={form.challenges} onChange={set("challenges")} placeholder="Key risks to be aware of…" rows={2} />
      </FormSection>

      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl ml-9" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </ModalShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LP MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const LP_TYPE_OPTIONS = Object.entries(LP_TYPES).map(([v, l]) => ({ value: v, label: l }));
const LP_STATUS_OPTIONS = Object.entries(LP_STATUS).map(([v, c]) => ({ value: v, label: c.label }));
type LPForm = { fullName: string; organization: string; title: string; email: string; phone: string; location: string; linkedin: string; website: string; investorType: string; commitmentAmount: string; checkSizeRange: string; totalAUM: string; geographicFocus: string; sectorPreferences: string; status: string; lastContactDate: string; nextFollowUpDate: string; meetingCount: string; source: string; referredBy: string; internalRating: string; notes: string;ndaStorageId: string; 
  subscriptionAgreementStorageId: string;  };
const EMPTY_LP: LPForm = { fullName:"",organization:"",title:"",email:"",phone:"",location:"",linkedin:"",website:"",investorType:"hnwi",commitmentAmount:"",checkSizeRange:"",totalAUM:"",geographicFocus:"",sectorPreferences:"",status:"prospect",lastContactDate:"",nextFollowUpDate:"",meetingCount:"",source:"",referredBy:"",internalRating:"",notes:"",   ndaStorageId: "", 
  subscriptionAgreementStorageId: ""  };

function LPModal({ onClose, initial, lpId }: { onClose: () => void; initial?: Partial<LPForm>; lpId?: Id<"limitedPartners"> }) {
  const create = useMutation(api.admin.createLimitedPartner);
  const update = useMutation(api.admin.updateLimitedPartner);
  const [form, setForm] = useState<LPForm>({ ...EMPTY_LP, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof LPForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.fullName || !form.email) { setError("Name and email are required."); return; }
    setError(""); setSaving(true);
    try {
      const p = { fullName: form.fullName, organization: form.organization || undefined, title: form.title || undefined, email: form.email, phone: form.phone || undefined, location: form.location || undefined, linkedin: form.linkedin || undefined, website: form.website || undefined, investorType: form.investorType as any, commitmentAmount: form.commitmentAmount || undefined, checkSizeRange: form.checkSizeRange || undefined, totalAUM: form.totalAUM || undefined, geographicFocus: form.geographicFocus || undefined, sectorPreferences: form.sectorPreferences || undefined, status: form.status as any, lastContactDate: form.lastContactDate ? new Date(form.lastContactDate).getTime() : undefined, nextFollowUpDate: form.nextFollowUpDate ? new Date(form.nextFollowUpDate).getTime() : undefined, meetingCount: form.meetingCount ? Number(form.meetingCount) : undefined, source: form.source || undefined, referredBy: form.referredBy || undefined, internalRating: form.internalRating ? Number(form.internalRating) : undefined, notes: form.notes || undefined, ndaStorageId: form.ndaStorageId ? (form.ndaStorageId as Id<"_storage">) : undefined,
subscriptionAgreementStorageId: form.subscriptionAgreementStorageId ? (form.subscriptionAgreementStorageId as Id<"_storage">) : undefined, };
      if (lpId) await update({ lpId, ...p });
      else await create(p);
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };
  return (
    <ModalShell title={lpId ? "Edit LP" : "Add Limited Partner"} subtitle="Enter LP contact and investment details" onClose={onClose} onSave={save} saving={saving} saveLabel={lpId ? "Save Changes" : "Add LP"} icon={<Handshake className="w-4 h-4" style={{ color: T.main }} />}>
      <FormSection step={1} title="Identity"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FInput label="Full Name" value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" required /><FInput label="Organization / Firm" value={form.organization} onChange={set("organization")} placeholder="Smith Family Office" /><FInput label="Title" value={form.title} onChange={set("title")} placeholder="Managing Director" /><FSelect label="Investor Type" value={form.investorType} onChange={set("investorType")} options={LP_TYPE_OPTIONS} required /></div></FormSection>
      <FormSection step={2} title="Contact"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FInput label="Email" value={form.email} onChange={set("email")} placeholder="jane@example.com" required type="email" /><FInput label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" /><FInput label="Location" value={form.location} onChange={set("location")} placeholder="New York, NY" /><FInput label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/…" /><FInput label="Website" value={form.website} onChange={set("website")} placeholder="https://…" /></div></FormSection>
      <FormSection step={3} title="Investment Profile"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FInput label="Commitment Amount" value={form.commitmentAmount} onChange={set("commitmentAmount")} placeholder="$500K" /><FInput label="Check Size Range" value={form.checkSizeRange} onChange={set("checkSizeRange")} placeholder="$250K–$1M" /><FInput label="Total AUM" value={form.totalAUM} onChange={set("totalAUM")} placeholder="$50M" /><FInput label="Geographic Focus" value={form.geographicFocus} onChange={set("geographicFocus")} placeholder="North America, Europe" /></div><FTextarea label="Sector Preferences" value={form.sectorPreferences} onChange={set("sectorPreferences")} placeholder="FinTech, HealthTech, AI/ML…" rows={2} /></FormSection>
      <FormSection step={4} title="Relationship"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FSelect label="Pipeline Status" value={form.status} onChange={set("status")} options={LP_STATUS_OPTIONS} required /><FInput label="Meeting Count" value={form.meetingCount} onChange={set("meetingCount")} placeholder="3" type="number" /><FInput label="Last Contact" value={form.lastContactDate} onChange={set("lastContactDate")} type="date" /><FInput label="Next Follow-Up" value={form.nextFollowUpDate} onChange={set("nextFollowUpDate")} type="date" /><FInput label="Source" value={form.source} onChange={set("source")} placeholder="Conference / Referral / Cold" /><FInput label="Referred By" value={form.referredBy} onChange={set("referredBy")} placeholder="John Doe" /></div></FormSection>
      <FormSection step={5} title="Internal Notes"><RatingPicker value={form.internalRating} onChange={set("internalRating")} /><FTextarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Investment thesis, relationship context, key concerns…" rows={3} /></FormSection>
      <FormSection step={1} title="Documents">
  <div className="space-y-3">
    <FPdfUpload 
      label="NDA / Confidentiality Agreement" 
      storageId={form.ndaStorageId} 
      onUploaded={set("ndaStorageId")} 
      hint="Signed NDA or CDA · PDF only · max 20 MB" 
    />
    <FPdfUpload 
      label="Subscription Agreement / Commitment Letter" 
      storageId={form.subscriptionAgreementStorageId} 
      onUploaded={set("subscriptionAgreementStorageId")} 
      hint="LP subscription docs · PDF only · max 20 MB" 
    />
  </div>
</FormSection>
      {error && <div className="flex items-start gap-3 px-4 py-3 rounded-xl ml-9" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}><XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" /><p className="text-sm text-red-700">{error}</p></div>}
    </ModalShell>
  );
}

const SPRINT_BACKGROUNDS = ["Computer Science","Data Science","Business/Finance","Design/UX","Engineering","Life Sciences","Social Sciences","Law","Medicine/Public Health","Other"];
const SPRINT_EXECUTION_STYLES = ["Full-stack builder","Frontend specialist","Backend / infra","Data / ML","Product","Design","Strategy / Business","Other"];
const SPRINT_ROLES = ["Technical lead","Product lead","Design lead","Business / Strategy lead","Generalist"];
const SPRINT_OUTCOMES = ["Build a portfolio piece","Explore startup ideas","Learn AI tools","Network","Win prizes","Get hired","Other"];
const SPRINT_AVAIL_WINDOWS = ["Weekdays only","Weekends only","Both weekdays and weekends","Flexible"];
const SPRINT_TIME_COMMITMENTS = ["5–10 hrs / week","10–20 hrs / week","20–30 hrs / week","30+ hrs / week"];
const SPRINT_TEAM_PREFS = ["Solo","Small team (2–3)","Larger team (4+)","No preference"];
const SPRINT_COLLAB_STYLES = ["In-person","Remote","Hybrid"];
const SPRINT_INTERESTS = ["Healthcare","Education","Finance / FinTech","Climate / CleanTech","Productivity","Entertainment","Social Impact","Enterprise / B2B","Consumer","Other"];
const SPRINT_POST_INTENTS = ["Continue building","Look for co-founders","Apply to accelerators","Open-source it","Just exploring"];
const SPRINT_COMMIT_SIGNALS = ["Fully committed","Mostly committed","Exploratory"];
const SPRINT_PARTICIPANT_STATUS_OPTIONS = Object.entries(SPRINT_PARTICIPANT_STATUS).map(([v, c]) => ({ value: v, label: c.label }));
 
type SprintParticipantForm = {
  fullName: string; email: string; institution: string; programYear: string; areaOfFocus: string;
  backgrounds: string[]; skills: string; executionStyle: string;
  hasPriorWork: string; projectSnapshot: string; primaryRole: string; outcomes: string[];
  linkedinUrl: string; portfolioUrl: string; proofLinks: string;
  availWindow: string; timeCommitment: string; locationPref: string; commitSignal: string;
  teamPreference: string; collabStyle: string; interests: string[]; postSprintIntent: string; openToSponsor: string;
  motivation: string; status: string;
};
const EMPTY_SPRINT_PARTICIPANT: SprintParticipantForm = {
  fullName:"",email:"",institution:"",programYear:"",areaOfFocus:"",
  backgrounds:[],skills:"",executionStyle:"",
  hasPriorWork:"",projectSnapshot:"",primaryRole:"",outcomes:[],
  linkedinUrl:"",portfolioUrl:"",proofLinks:"",
  availWindow:"",timeCommitment:"",locationPref:"",commitSignal:"",
  teamPreference:"",collabStyle:"",interests:[],postSprintIntent:"",openToSponsor:"",
  motivation:"",status:"submitted",
};
 
function SprintParticipantModal({ onClose, initial, participantId }: {
  onClose: () => void;
  initial?: Partial<SprintParticipantForm>;
  participantId?: Id<"sprintParticipants">;
}) {
  const create = useMutation(api.admin.createSprintParticipant);
  const [form, setForm] = useState<SprintParticipantForm>({ ...EMPTY_SPRINT_PARTICIPANT, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof SprintParticipantForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const setArr = (k: keyof SprintParticipantForm) => (v: string[]) => setForm(f => ({ ...f, [k]: v }));
 
  const save = async () => {
    const required = ["fullName","email","institution","programYear","areaOfFocus","skills","executionStyle","hasPriorWork","projectSnapshot","primaryRole","availWindow","timeCommitment","commitSignal","teamPreference","collabStyle","postSprintIntent","motivation"];
    const missing = required.filter(k => !form[k as keyof SprintParticipantForm]);
    if (missing.length) { setError(`Please fill in: ${missing.slice(0,3).join(", ")}${missing.length > 3 ? "…" : ""}`); return; }
    setError(""); setSaving(true);
    try {
      await create({
        fullName: form.fullName, email: form.email, institution: form.institution,
        programYear: form.programYear, areaOfFocus: form.areaOfFocus,
        backgrounds: form.backgrounds, skills: form.skills, executionStyle: form.executionStyle,
        hasPriorWork: form.hasPriorWork, projectSnapshot: form.projectSnapshot,
        primaryRole: form.primaryRole, outcomes: form.outcomes,
        linkedinUrl: form.linkedinUrl || undefined, portfolioUrl: form.portfolioUrl || undefined,
        proofLinks: form.proofLinks || undefined, availWindow: form.availWindow,
        timeCommitment: form.timeCommitment, locationPref: form.locationPref || undefined,
        commitSignal: form.commitSignal, teamPreference: form.teamPreference,
        collabStyle: form.collabStyle, interests: form.interests,
        postSprintIntent: form.postSprintIntent, openToSponsor: form.openToSponsor || undefined,
        motivation: form.motivation, status: form.status as any,
      });
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };
 
  return (
    <ModalShell
      title={participantId ? "Edit Participant" : "Add Sprint Participant"}
      subtitle="Harvard AI Build Sprint registration"
      onClose={onClose} onSave={save} saving={saving}
      saveLabel={participantId ? "Save Changes" : "Add Participant"}
      icon={<Users className="w-4 h-4" style={{ color: T.main }} />}
    >
      <FormSection step={1} title="About You">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FInput label="Full Name" value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" required />
          <FInput label="Email" value={form.email} onChange={set("email")} placeholder="jane@harvard.edu" type="email" required />
          <FInput label="Institution" value={form.institution} onChange={set("institution")} placeholder="Harvard University" required />
          <FInput label="Program / Year" value={form.programYear} onChange={set("programYear")} placeholder="MBA Year 2 / PhD Year 3" required />
          <div className="sm:col-span-2">
            <FInput label="Area of Focus" value={form.areaOfFocus} onChange={set("areaOfFocus")} placeholder="e.g. Computational Biology, FinTech, Climate Policy" required />
          </div>
        </div>
      </FormSection>
 
      <FormSection step={2} title="Skills & Capabilities">
        <FCheckboxGroup label="Background(s)" options={SPRINT_BACKGROUNDS} value={form.backgrounds} onChange={setArr("backgrounds")} />
        <FTextarea label="Skills & Technologies" value={form.skills} onChange={set("skills")} placeholder="React, Python, PyTorch, Figma…" rows={2} />
        <FSelect label="Execution Style" value={form.executionStyle} onChange={set("executionStyle")} options={SPRINT_EXECUTION_STYLES.map(v => ({ value: v, label: v }))} required />
      </FormSection>
 
      <FormSection step={3} title="Experience & Build History">
        <FSelect label="Prior AI / startup work?" value={form.hasPriorWork} onChange={set("hasPriorWork")} options={[{ value:"Yes",label:"Yes" },{ value:"No",label:"No" }]} required />
        <FTextarea label="Project Snapshot" value={form.projectSnapshot} onChange={set("projectSnapshot")} placeholder="Briefly describe relevant past projects or experience…" rows={3} />
        <FSelect label="Primary Role in a Team" value={form.primaryRole} onChange={set("primaryRole")} options={SPRINT_ROLES.map(v => ({ value: v, label: v }))} required />
        <FCheckboxGroup label="Desired Outcomes (optional)" options={SPRINT_OUTCOMES} value={form.outcomes} onChange={setArr("outcomes")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FInput label="LinkedIn" value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/…" />
          <FInput label="Portfolio / GitHub" value={form.portfolioUrl} onChange={set("portfolioUrl")} placeholder="https://…" />
        </div>
        <FInput label="Proof Links / Demo Links" value={form.proofLinks} onChange={set("proofLinks")} placeholder="https://demo.com, https://github.com/…" />
      </FormSection>
 
      <FormSection step={4} title="Availability & Participation">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Availability Window" value={form.availWindow} onChange={set("availWindow")} options={SPRINT_AVAIL_WINDOWS.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Time Commitment" value={form.timeCommitment} onChange={set("timeCommitment")} options={SPRINT_TIME_COMMITMENTS.map(v => ({ value: v, label: v }))} required />
          <FInput label="Location Preference (optional)" value={form.locationPref} onChange={set("locationPref")} placeholder="Cambridge MA / Remote / Flexible" />
          <FSelect label="Commitment Signal" value={form.commitSignal} onChange={set("commitSignal")} options={SPRINT_COMMIT_SIGNALS.map(v => ({ value: v, label: v }))} required />
        </div>
      </FormSection>
 
      <FormSection step={5} title="Teaming & Opportunities">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Team Preference" value={form.teamPreference} onChange={set("teamPreference")} options={SPRINT_TEAM_PREFS.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Collaboration Style" value={form.collabStyle} onChange={set("collabStyle")} options={SPRINT_COLLAB_STYLES.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Post-Sprint Intent" value={form.postSprintIntent} onChange={set("postSprintIntent")} options={SPRINT_POST_INTENTS.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Open to Sponsor Engagement?" value={form.openToSponsor} onChange={set("openToSponsor")} options={[{ value:"Yes",label:"Yes" },{ value:"No",label:"No" },{ value:"Maybe",label:"Maybe" }]} />
        </div>
        <FCheckboxGroup label="Areas of Interest" options={SPRINT_INTERESTS} value={form.interests} onChange={setArr("interests")} />
      </FormSection>
 
      <FormSection step={6} title="Motivation & Admin">
        <FTextarea label="Why this Sprint?" value={form.motivation} onChange={set("motivation")} placeholder="What are they hoping to build or learn?" rows={3} />
        <FSelect label="Status" value={form.status} onChange={set("status")} options={SPRINT_PARTICIPANT_STATUS_OPTIONS} required />
      </FormSection>
 
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl ml-9" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </ModalShell>
  );
}
 
const SPONSOR_ORG_TYPES = ["Startup (Pre-Seed / Seed)","Startup (Series A+)","Scale-up / Late-stage","Enterprise / Fortune 500","VC / Investment Fund","Family Office","Non-profit / Foundation","Government / Public Sector","University / Research Institution","Other"];
const SPONSOR_ORG_STAGES = ["Idea / Pre-product","Early traction","Growth","Established / Mature"];
const SPONSOR_INVOLVEMENT = ["Title sponsor","Workshop / session host","Mentor provider","Prize sponsor","Recruiting partner","Media / PR partner","In-kind support (tools, cloud credits)","Other"];
const SPONSOR_LEVELS = ["Platinum ($50K+)","Gold ($25K–$50K)","Silver ($10K–$25K)","Bronze ($5K–$10K)","Community Partner (in-kind)"];
const SPONSOR_GOALS = ["Brand awareness among top students","Talent recruiting","Product feedback / user testing","Research partnerships","Community building","Co-marketing","Other"];
const SPONSOR_AREAS = ["AI / ML","FinTech","HealthTech","EdTech","CleanTech / Sustainability","Web3 / Crypto","Enterprise SaaS","Consumer","Deep Tech","Other"];
const SPONSOR_ENGAGEMENT = ["Demo day judging","Office hours with teams","Host a workshop","Mentorship sessions","Resume / portfolio review","Post internships or jobs","Other"];
const SPONSOR_TIMEFRAMES = ["ASAP (within 2 weeks)","1–3 months","3–6 months","Flexible"];
const SPONSOR_FORMATS = ["In-person only","Virtual only","Hybrid","No preference"];
const SPONSOR_DECISION_TIMELINES = ["< 2 weeks","2–4 weeks","1–2 months","3+ months"];
const SPRINT_SPONSOR_STATUS_OPTIONS = Object.entries(SPRINT_SPONSOR_STATUS).map(([v, c]) => ({ value: v, label: c.label }));
 
type SprintSponsorForm = {
  companyName: string; contactName: string; contactTitle: string;
  email: string; phone: string; website: string; linkedin: string;
  orgType: string; orgStage: string;
  involvementTypes: string[]; sponsorLevel: string; anchorPartner: string;
  primaryGoals: string[]; successDefinition: string;
  relevantAreas: string[]; participantEngagement: string[];
  preferredTimeframe: string; participationFormat: string; openToExpansion: string;
  isDecisionMaker: string; otherApprovers: string; decisionTimeline: string;
  additionalNotes: string; referralSource: string;
  status: string; internalRating: string;
};
const EMPTY_SPRINT_SPONSOR: SprintSponsorForm = {
  companyName:"",contactName:"",contactTitle:"",email:"",phone:"",website:"",linkedin:"",
  orgType:"",orgStage:"",involvementTypes:[],sponsorLevel:"",anchorPartner:"",
  primaryGoals:[],successDefinition:"",relevantAreas:[],participantEngagement:[],
  preferredTimeframe:"",participationFormat:"",openToExpansion:"",
  isDecisionMaker:"",otherApprovers:"",decisionTimeline:"",
  additionalNotes:"",referralSource:"",status:"submitted",internalRating:"",
};
 
function SprintSponsorModal({ onClose, initial, sponsorId }: {
  onClose: () => void;
  initial?: Partial<SprintSponsorForm>;
  sponsorId?: Id<"sprintSponsors">;
}) {
  const create = useMutation(api.admin.createSprintSponsor);
  const [form, setForm] = useState<SprintSponsorForm>({ ...EMPTY_SPRINT_SPONSOR, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (k: keyof SprintSponsorForm) => (v: string) => setForm(f => ({ ...f, [k]: v }));
  const setArr = (k: keyof SprintSponsorForm) => (v: string[]) => setForm(f => ({ ...f, [k]: v }));
 
  const save = async () => {
    const required = ["companyName","contactName","contactTitle","email","website","orgType","orgStage","sponsorLevel","anchorPartner","successDefinition","preferredTimeframe","participationFormat","openToExpansion","isDecisionMaker","decisionTimeline","referralSource"];
    const missing = required.filter(k => !form[k as keyof SprintSponsorForm]);
    if (missing.length) { setError(`Please fill in: ${missing.slice(0,3).join(", ")}${missing.length > 3 ? "…" : ""}`); return; }
    setError(""); setSaving(true);
    try {
      await create({
        companyName: form.companyName, contactName: form.contactName,
        contactTitle: form.contactTitle, email: form.email,
        phone: form.phone || undefined, website: form.website,
        linkedin: form.linkedin || undefined, orgType: form.orgType, orgStage: form.orgStage,
        involvementTypes: form.involvementTypes, sponsorLevel: form.sponsorLevel,
        anchorPartner: form.anchorPartner, primaryGoals: form.primaryGoals,
        successDefinition: form.successDefinition, relevantAreas: form.relevantAreas,
        participantEngagement: form.participantEngagement, preferredTimeframe: form.preferredTimeframe,
        participationFormat: form.participationFormat, openToExpansion: form.openToExpansion,
        isDecisionMaker: form.isDecisionMaker, otherApprovers: form.otherApprovers || undefined,
        decisionTimeline: form.decisionTimeline, additionalNotes: form.additionalNotes || undefined,
        referralSource: form.referralSource, status: form.status as any,
        internalRating: form.internalRating ? Number(form.internalRating) : undefined,
      });
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };
 
  return (
    <ModalShell
      title={sponsorId ? "Edit Sponsor" : "Add Sprint Sponsor"}
      subtitle="Harvard AI Build Sprint sponsorship"
      onClose={onClose} onSave={save} saving={saving}
      saveLabel={sponsorId ? "Save Changes" : "Add Sponsor"}
      icon={<Handshake className="w-4 h-4" style={{ color: T.main }} />}
    >
      <FormSection step={1} title="Organization Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FInput label="Company Name" value={form.companyName} onChange={set("companyName")} placeholder="Acme Corp" required />
          <FInput label="Contact Name" value={form.contactName} onChange={set("contactName")} placeholder="Jane Smith" required />
          <FInput label="Contact Title" value={form.contactTitle} onChange={set("contactTitle")} placeholder="VP of Partnerships" required />
          <FInput label="Email" value={form.email} onChange={set("email")} placeholder="jane@acme.com" type="email" required />
          <FInput label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
          <FInput label="Website" value={form.website} onChange={set("website")} placeholder="https://acme.com" required />
          <FInput label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/company/…" />
        </div>
      </FormSection>
 
      <FormSection step={2} title="Organization Type">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Organization Type" value={form.orgType} onChange={set("orgType")} options={SPONSOR_ORG_TYPES.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Organization Stage" value={form.orgStage} onChange={set("orgStage")} options={SPONSOR_ORG_STAGES.map(v => ({ value: v, label: v }))} required />
        </div>
      </FormSection>
 
      <FormSection step={3} title="Sponsorship Interest">
        <FCheckboxGroup label="Involvement Types" options={SPONSOR_INVOLVEMENT} value={form.involvementTypes} onChange={setArr("involvementTypes")} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Sponsor Level" value={form.sponsorLevel} onChange={set("sponsorLevel")} options={SPONSOR_LEVELS.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Interested as Anchor Partner?" value={form.anchorPartner} onChange={set("anchorPartner")} options={[{ value:"Yes",label:"Yes" },{ value:"No",label:"No" },{ value:"Open to discussion",label:"Open to discussion" }]} required />
        </div>
      </FormSection>
 
      <FormSection step={4} title="Objectives">
        <FCheckboxGroup label="Primary Goals" options={SPONSOR_GOALS} value={form.primaryGoals} onChange={setArr("primaryGoals")} />
        <FTextarea label="How would you define success?" value={form.successDefinition} onChange={set("successDefinition")} placeholder="What outcomes matter most to your organization?" rows={3} />
      </FormSection>
 
      <FormSection step={5} title="Event Fit">
        <FCheckboxGroup label="Relevant Areas / Sectors" options={SPONSOR_AREAS} value={form.relevantAreas} onChange={setArr("relevantAreas")} />
        <FCheckboxGroup label="Preferred Participant Engagement" options={SPONSOR_ENGAGEMENT} value={form.participantEngagement} onChange={setArr("participantEngagement")} />
      </FormSection>
 
      <FormSection step={6} title="Timing & Format">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Preferred Timeframe" value={form.preferredTimeframe} onChange={set("preferredTimeframe")} options={SPONSOR_TIMEFRAMES.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Participation Format" value={form.participationFormat} onChange={set("participationFormat")} options={SPONSOR_FORMATS.map(v => ({ value: v, label: v }))} required />
          <FSelect label="Open to Future Expansion?" value={form.openToExpansion} onChange={set("openToExpansion")} options={[{ value:"Yes",label:"Yes" },{ value:"No",label:"No" },{ value:"Possibly",label:"Possibly" }]} required />
        </div>
      </FormSection>
 
      <FormSection step={7} title="Internal Process">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FSelect label="Are you the decision maker?" value={form.isDecisionMaker} onChange={set("isDecisionMaker")} options={[{ value:"Yes",label:"Yes — sole decision maker" },{ value:"Shared",label:"Shared with others" },{ value:"No",label:"No — need internal approval" }]} required />
          <FSelect label="Decision Timeline" value={form.decisionTimeline} onChange={set("decisionTimeline")} options={SPONSOR_DECISION_TIMELINES.map(v => ({ value: v, label: v }))} required />
          <FInput label="Other Approvers (if any)" value={form.otherApprovers} onChange={set("otherApprovers")} placeholder="CMO, Legal, CFO…" />
          <FInput label="Referral Source" value={form.referralSource} onChange={set("referralSource")} placeholder="Conference, LinkedIn, Referral…" required />
        </div>
      </FormSection>
 
      <FormSection step={8} title="Admin & Review">
        <RatingPicker value={form.internalRating} onChange={set("internalRating")} />
        <FSelect label="Status" value={form.status} onChange={set("status")} options={SPRINT_SPONSOR_STATUS_OPTIONS} required />
        <FTextarea label="Additional Notes" value={form.additionalNotes} onChange={set("additionalNotes")} placeholder="Any context, concerns, or next steps…" rows={3} />
      </FormSection>
 
      {error && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl ml-9" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </ModalShell>
  );
}
 
// ═══════════════════════════════════════════════════════════════════════════════
// DRAWERS
// ═══════════════════════════════════════════════════════════════════════════════
function JobDrawer({ id, onClose }: { id: Id<"jobApplications">; onClose: () => void }) {
  const app = useQuery(api.admin.getJobApplication, { applicationId: id });
  const updateStatus = useMutation(api.admin.updateJobStatus);
  const deleteJob = useMutation(api.admin.deleteJobApplication);
  const [notes, setNotes] = useState(""); const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false); const [confirmDel, setConfirmDel] = useState(false);
  const save = async (status: string) => { setSaving(true); await updateStatus({ applicationId: id, status: status as any, reviewNotes: notes || undefined }); setSaving(false); };
  if (!app) return <DrawerShell onClose={onClose} title="Job Application"><div className="flex-1 flex items-center justify-center"><Spinner /></div></DrawerShell>;
  return (
    <>
      <DrawerShell onClose={onClose} title="Job Application">
        <div className="h-0.5 flex-shrink-0" style={{ background: `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />
        <div className="px-5 sm:px-8 pt-5 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><div className="flex items-center gap-2 flex-wrap"><h2 className="text-xl font-bold" style={{ color: T.deep }}>{app.fullName}</h2>{app.manuallyAdded && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#ede9fe", color: "#5b21b6" }}>Manual</span>}</div><p className="text-sm mt-0.5" style={{ color: T.slate }}>{app.currentRole}</p></div>
            <div className="flex items-center gap-2 flex-shrink-0"><Badge status={app.status} cfg={JOB_STATUS} /><button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80" style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}><Edit3 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm" style={{ color: T.slate }}>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{app.email}</span>
            {app.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{app.phone}</span>}
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{app.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmt(app.submittedAt)}</span>
          </div>
          {(app.linkedin || app.portfolio) && <div className="flex gap-3 mt-3">{app.linkedin && <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: T.main }}><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>}{app.portfolio && <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm transition-colors" style={{ color: T.main }}><Globe className="w-3.5 h-3.5" /> Portfolio</a>}</div>}
        </div>
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          {(app.resumeStorageId || app.coverLetterStorageId) && <Section title="Documents"><div className="flex flex-wrap gap-3">{app.resumeStorageId && <DocButton storageId={app.resumeStorageId} label="Resume / CV" />}{app.coverLetterStorageId && <DocButton storageId={app.coverLetterStorageId} label="Cover Letter" />}</div></Section>}
          <Section title="Role"><Grid2><Field label="Position" value={app.position} /><Field label="Experience" value={app.experience + " years"} /></Grid2></Section>
          <Section title="Why MUSEDATA"><p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: T.deep }}>{app.motivation}</p></Section>
          <Section title="Skills"><p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: T.deep }}>{app.skills}</p></Section>
          <Section title="Review Note">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none min-h-[90px]"
              style={{ background: "#fff", border: `1px solid ${T.border}`, color: T.deep }} />
            {app.reviewNotes && <p className="text-xs mt-1" style={{ color: T.slate }}>Previous: {app.reviewNotes}</p>}
          </Section>
          <Section title="Update Status">
            <div className="flex flex-wrap gap-2">
              {(["under_review","interviewing","accepted","rejected"] as const).map(s => (
                <button key={s} onClick={() => save(s)} disabled={saving || app.status === s}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={app.status === s ? { background: "rgba(42,127,160,0.10)", color: T.main, borderColor: T.main } : { background: "#fff", color: T.slate, borderColor: T.border }}>
                  {JOB_STATUS[s].label}
                </button>
              ))}
            </div>
          </Section>
          <Section title="Danger Zone">{!confirmDel ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all" style={{ color: "#ef4444", border: "1px solid #fca5a5", background: "#fff5f5" }}><Trash2 className="w-4 h-4" /> Delete Record</button> : <DeleteConfirm onConfirm={async () => { await deleteJob({ applicationId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}</Section>
        </div>
      </DrawerShell>
      {showEdit && <JobModal onClose={() => setShowEdit(false)} jobId={id} initial={{ fullName: app.fullName, email: app.email, phone: app.phone, location: app.location, currentRole: app.currentRole, experience: app.experience, linkedin: app.linkedin, portfolio: app.portfolio, position: app.position, motivation: app.motivation, skills: app.skills, status: app.status }} />}
    </>
  );
}

function StartupDrawer({ id, onClose }: { id: Id<"startupApplications">; onClose: () => void }) {
  const app = useQuery(api.admin.getStartupApplication, { applicationId: id });
  const updateStatus = useMutation(api.admin.updateStartupStatus);
  const deleteStartup = useMutation(api.admin.deleteStartupApplication);
  const [notes, setNotes] = useState(""); const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false); const [showEdit, setShowEdit] = useState(false); const [confirmDel, setConfirmDel] = useState(false);
  const save = async (status: string) => { setSaving(true); await updateStatus({ applicationId: id, status: status as any, reviewNotes: notes || undefined, internalRating: rating || undefined }); setSaving(false); };
  if (!app) return <DrawerShell onClose={onClose} title="Startup Application"><div className="flex-1 flex items-center justify-center"><Spinner /></div></DrawerShell>;
  return (
    <>
      <DrawerShell onClose={onClose} title="Startup Application">
        <div className="h-0.5 flex-shrink-0" style={{ background: `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />
        <div className="px-5 sm:px-8 pt-5 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><div className="flex items-center gap-2 flex-wrap"><h2 className="text-xl font-bold" style={{ color: T.deep }}>{app.companyName}</h2>{app.manuallyAdded && <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "#ede9fe", color: "#5b21b6" }}>Manual</span>}</div><p className="text-sm mt-0.5" style={{ color: T.slate }}>Founded by {app.founderName}</p></div>
            <div className="flex items-center gap-2 flex-shrink-0"><Badge status={app.status} cfg={STARTUP_STATUS} /><button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all" style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}><Edit3 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3" style={{ color: T.slate }}><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{app.founderEmail}</span><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{app.companyLocation}</span><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmt(app.submittedAt)}</span></div>
          <div className="flex flex-wrap gap-2"><Tag>{app.industry}</Tag><Tag>{app.stage.replace("_"," ")}</Tag><Tag>{app.fundingStage.replace(/_/g," ")}</Tag><Tag variant="green">{app.fundingAmount}</Tag>{app.internalRating && <Tag variant="amber">★ {app.internalRating}/10</Tag>}</div>
        </div>
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          {(app.pitchDeckStorageId || app.financialModelStorageId || app.businessPlanStorageId || app.productDemoStorageId) && (
            <Section title="Documents">
              <div className="flex flex-wrap gap-3">
                {app.pitchDeckStorageId && <DocButton storageId={app.pitchDeckStorageId} label="Pitch Deck" />}
                {app.financialModelStorageId && <DocButton storageId={app.financialModelStorageId} label="Financial Model" />}
                {app.businessPlanStorageId && <DocButton storageId={app.businessPlanStorageId} label="Business Plan" />}
                {app.productDemoStorageId && <DocButton storageId={app.productDemoStorageId} label="Product Demo" />}
              </div>
            </Section>
          )}
          <Section title="Business"><Field label="Problem" value={app.problemStatement} long /><Field label="Solution" value={app.solution} long /><Field label="Value Proposition" value={app.uniqueValueProposition} long /><Field label="Business Model" value={app.businessModel} long /><Field label="Target Market" value={app.targetMarket} long /></Section>
          <Section title="Traction"><Grid2>{app.currentRevenue && <Field label="Revenue" value={app.currentRevenue} />}{app.revenueGrowth && <Field label="Growth" value={app.revenueGrowth} />}{app.numberOfCustomers && <Field label="Customers" value={app.numberOfCustomers} />}{app.burnRate && <Field label="Burn Rate" value={app.burnRate} />}{app.runway && <Field label="Runway" value={app.runway} />}</Grid2><Field label="Key Milestones" value={app.keyMilestones} long /></Section>
          <Section title="Funding"><Grid2><Field label="Asking" value={app.fundingAmount} />{app.valuation && <Field label="Valuation" value={app.valuation} />}{app.previousFunding && <Field label="Previous" value={app.previousFunding} />}{app.currentInvestors && <Field label="Investors" value={app.currentInvestors} />}</Grid2><Field label="Use of Funds" value={app.useOfFunds} long /></Section>
          <Section title="Team"><Grid2><Field label="Team Size" value={app.teamSize} /><Field label="Incorporation" value={app.incorporationStatus.replace("_"," ")} /></Grid2><Field label="Key Members" value={app.keyTeamMembers} long /></Section>
          <Section title="Internal Review">
            <RatingPicker value={String(rating || app.internalRating || "")} onChange={v => setRating(Number(v))} />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Investment thesis, concerns, next steps…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none min-h-[90px]"
              style={{ background: "#fff", border: `1px solid ${T.border}`, color: T.deep }} />
            {app.reviewNotes && <p className="text-xs" style={{ color: T.slate }}>Previous: {app.reviewNotes}</p>}
          </Section>
          <Section title="Move to Stage">
            <div className="flex flex-wrap gap-2">
              {(["under_review","due_diligence","term_sheet","funded","rejected","on_hold"] as const).map(s => (
                <button key={s} onClick={() => save(s)} disabled={saving || app.status === s}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={app.status === s ? { background: "rgba(42,127,160,0.10)", color: T.main, borderColor: T.main } : { background: "#fff", color: T.slate, borderColor: T.border }}>
                  {STARTUP_STATUS[s].label}
                </button>
              ))}
            </div>
          </Section>
          <Section title="Danger Zone">{!confirmDel ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all" style={{ color: "#ef4444", border: "1px solid #fca5a5", background: "#fff5f5" }}><Trash2 className="w-4 h-4" /> Delete Record</button> : <DeleteConfirm onConfirm={async () => { await deleteStartup({ applicationId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}</Section>
        </div>
      </DrawerShell>
      {showEdit && <StartupModal onClose={() => setShowEdit(false)} startupId={id} />}
    </>
  );
}

function LPDrawer({ id, onClose }: { id: Id<"limitedPartners">; onClose: () => void }) {
  const lp = useQuery(api.admin.getLimitedPartner, { lpId: id });
  const update = useMutation(api.admin.updateLimitedPartner);
  const del = useMutation(api.admin.deleteLimitedPartner);
  const [notes, setNotes] = useState(""); const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false); const [confirmDel, setConfirmDel] = useState(false);
  const saveStatus = async (status: string) => { setSaving(true); await update({ lpId: id, status: status as any, reviewNotes: notes || undefined }); setSaving(false); };
  if (!lp) return <DrawerShell onClose={onClose} title="Limited Partner"><div className="flex-1 flex items-center justify-center"><Spinner /></div></DrawerShell>;
  return (
    <>
      <DrawerShell onClose={onClose} title="Limited Partner">
        <div className="h-0.5 flex-shrink-0" style={{ background: `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />
        <div className="px-5 sm:px-8 pt-5 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><h2 className="text-xl font-bold" style={{ color: T.deep }}>{lp.fullName}</h2>{lp.organization && <p className="text-sm mt-0.5" style={{ color: T.slate }}>{lp.title ? `${lp.title} · ` : ""}{lp.organization}</p>}</div>
            <div className="flex items-center gap-2 flex-shrink-0"><Badge status={lp.status} cfg={LP_STATUS} /><button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}><Edit3 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3" style={{ color: T.slate }}><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{lp.email}</span>{lp.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{lp.phone}</span>}{lp.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{lp.location}</span>}</div>
          <div className="flex flex-wrap gap-2"><Tag variant="violet">{LP_TYPES[lp.investorType] ?? lp.investorType}</Tag>{lp.commitmentAmount && <Tag variant="green">{lp.commitmentAmount}</Tag>}{lp.internalRating && <Tag variant="amber">★ {lp.internalRating}/10</Tag>}</div>
          {(lp.linkedin || lp.website) && <div className="flex gap-3 mt-3">{lp.linkedin && <a href={lp.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: T.main }}><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>}{lp.website && <a href={lp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: T.main }}><Globe className="w-3.5 h-3.5" /> Website</a>}</div>}
        </div>
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          {(lp.ndaStorageId || lp.subscriptionAgreementStorageId) && (
  <Section title="Documents">
    <div className="flex flex-wrap gap-3">
      {lp.ndaStorageId && (
        <DocButton storageId={lp.ndaStorageId} label="NDA" />
      )}
      {lp.subscriptionAgreementStorageId && (
        <DocButton storageId={lp.subscriptionAgreementStorageId} label="Subscription Agreement" />
      )}
    </div>
  </Section>
)}
          <Section title="Investment Profile"><Grid2>{lp.commitmentAmount && <Field label="Commitment" value={lp.commitmentAmount} />}{lp.checkSizeRange && <Field label="Check Size" value={lp.checkSizeRange} />}{lp.totalAUM && <Field label="Total AUM" value={lp.totalAUM} />}{lp.geographicFocus && <Field label="Geographic Focus" value={lp.geographicFocus} />}</Grid2>{lp.sectorPreferences && <Field label="Sectors" value={lp.sectorPreferences} long />}</Section>
          <Section title="Relationship"><Grid2><Field label="Last Contact" value={fmtOpt(lp.lastContactDate)} /><Field label="Next Follow-Up" value={fmtOpt(lp.nextFollowUpDate)} />{lp.meetingCount != null && <Field label="Meetings" value={String(lp.meetingCount)} />}{lp.source && <Field label="Source" value={lp.source} />}{lp.referredBy && <Field label="Referred By" value={lp.referredBy} />}</Grid2></Section>
          {lp.notes && <Section title="Notes"><p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: T.deep }}>{lp.notes}</p></Section>}
          <Section title="Record Info"><Grid2><Field label="Added By" value={lp.addedBy} /><Field label="Added On" value={fmtOpt(lp.addedAt)} /></Grid2></Section>
          <Section title="Review Note">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note before updating status…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none min-h-[90px]"
              style={{ background: "#fff", border: `1px solid ${T.border}`, color: T.deep }} />
            {lp.reviewNotes && <p className="text-xs mt-1" style={{ color: T.slate }}>Previous: {lp.reviewNotes}</p>}
          </Section>
          <Section title="Move Pipeline Stage">
            <div className="flex flex-wrap gap-2">
              {(["prospect","contacted","interested","soft_committed","committed","closed","declined"] as const).map(s => (
                <button key={s} onClick={() => saveStatus(s)} disabled={saving || lp.status === s}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={lp.status === s ? { background: "rgba(42,127,160,0.10)", color: T.main, borderColor: T.main } : { background: "#fff", color: T.slate, borderColor: T.border }}>
                  {LP_STATUS[s].label}
                </button>
              ))}
            </div>
          </Section>
          <Section title="Danger Zone">{!confirmDel ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ color: "#ef4444", border: "1px solid #fca5a5", background: "#fff5f5" }}><Trash2 className="w-4 h-4" /> Delete Record</button> : <DeleteConfirm onConfirm={async () => { await del({ lpId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}</Section>
        </div>
      </DrawerShell>
      {showEdit && <LPModal lpId={id} onClose={() => setShowEdit(false)} initial={{ fullName: lp.fullName, organization: lp.organization, title: lp.title, email: lp.email, phone: lp.phone, location: lp.location, linkedin: lp.linkedin, website: lp.website, investorType: lp.investorType, commitmentAmount: lp.commitmentAmount, checkSizeRange: lp.checkSizeRange, totalAUM: lp.totalAUM, geographicFocus: lp.geographicFocus, sectorPreferences: lp.sectorPreferences, status: lp.status, lastContactDate: lp.lastContactDate ? new Date(lp.lastContactDate).toISOString().split("T")[0] : "", nextFollowUpDate: lp.nextFollowUpDate ? new Date(lp.nextFollowUpDate).toISOString().split("T")[0] : "", meetingCount: lp.meetingCount != null ? String(lp.meetingCount) : "", source: lp.source, referredBy: lp.referredBy, internalRating: lp.internalRating != null ? String(lp.internalRating) : "", notes: lp.notes }} />}
    </>
  );
}

function SprintParticipantDrawer({ id, onClose }: { id: Id<"sprintParticipants">; onClose: () => void }) {
  const p = useQuery(api.admin.getSprintParticipant, { participantId: id });
  const updateStatus = useMutation(api.admin.updateSprintParticipantStatus);
  const del = useMutation(api.admin.deleteSprintParticipant);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
 
  const save = async (status: string) => {
    setSaving(true);
    await updateStatus({ participantId: id, status: status as any, reviewNotes: notes || undefined });
    setSaving(false);
  };
 
  if (!p) return (
    <DrawerShell onClose={onClose} title="Sprint Participant">
      <div className="flex-1 flex items-center justify-center"><Spinner /></div>
    </DrawerShell>
  );
 
  return (
    <>
      <DrawerShell onClose={onClose} title="Sprint Participant">
        <div className="h-0.5 flex-shrink-0" style={{ background: "linear-gradient(90deg, #7c3aed, #a78bfa)" }} />
        <div className="px-5 sm:px-8 pt-5 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-bold" style={{ color: T.deep }}>{p.fullName}</h2>
              <p className="text-sm mt-0.5" style={{ color: T.slate }}>{p.institution} · {p.programYear}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge status={p.status} cfg={SPRINT_PARTICIPANT_STATUS} />
              <button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}>
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm" style={{ color: T.slate }}>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{p.email}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmt(p.submittedAt)}</span>
          </div>
          {(p.linkedinUrl || p.portfolioUrl) && (
            <div className="flex gap-3 mt-3">
              {p.linkedinUrl && <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: T.main }}><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>}
              {p.portfolioUrl && <a href={p.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: T.main }}><Globe className="w-3.5 h-3.5" /> Portfolio</a>}
            </div>
          )}
        </div>
 
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          <Section title="Profile">
            <Grid2>
              <Field label="Area of Focus" value={p.areaOfFocus} />
              <Field label="Execution Style" value={p.executionStyle} />
              <Field label="Primary Role" value={p.primaryRole} />
              <Field label="Commit Signal" value={p.commitSignal} />
            </Grid2>
          </Section>
 
          {p.backgrounds?.length > 0 && (
            <Section title="Background">
              <div className="flex flex-wrap gap-1.5">
                {p.backgrounds.map((b: string) => <Tag key={b}>{b}</Tag>)}
              </div>
            </Section>
          )}
 
          <Section title="Skills">
            <p className="text-sm leading-relaxed" style={{ color: T.deep }}>{p.skills}</p>
          </Section>
 
          <Section title="Experience">
            <Grid2>
              <Field label="Prior AI / Startup Work" value={p.hasPriorWork} />
            </Grid2>
            <Field label="Project Snapshot" value={p.projectSnapshot} long />
            {p.proofLinks && <Field label="Proof Links" value={p.proofLinks} long />}
          </Section>
 
          <Section title="Availability">
            <Grid2>
              <Field label="Window" value={p.availWindow} />
              <Field label="Time Commitment" value={p.timeCommitment} />
              <Field label="Location Pref." value={p.locationPref} />
              <Field label="Collab Style" value={p.collabStyle} />
            </Grid2>
          </Section>
 
          <Section title="Teaming">
            <Grid2>
              <Field label="Team Preference" value={p.teamPreference} />
              <Field label="Post-Sprint Intent" value={p.postSprintIntent} />
              <Field label="Open to Sponsor" value={p.openToSponsor} />
            </Grid2>
            {p.interests?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {p.interests.map((i: string) => <Tag key={i} variant="violet">{i}</Tag>)}
              </div>
            )}
            {p.outcomes?.length > 0 && (
              <div>
                <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: T.slate }}>Desired Outcomes</p>
                <div className="flex flex-wrap gap-1.5">
                  {p.outcomes.map((o: string) => <Tag key={o}>{o}</Tag>)}
                </div>
              </div>
            )}
          </Section>
 
          <Section title="Motivation">
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: T.deep }}>{p.motivation}</p>
          </Section>
 
          <Section title="Review Note">
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none min-h-[90px]"
              style={{ background: "#fff", border: `1px solid ${T.border}`, color: T.deep }} />
            {p.reviewNotes && <p className="text-xs mt-1" style={{ color: T.slate }}>Previous: {p.reviewNotes}</p>}
          </Section>
 
          <Section title="Update Status">
            <div className="flex flex-wrap gap-2">
              {(["under_review","accepted","rejected","waitlisted"] as const).map(s => (
                <button key={s} onClick={() => save(s)} disabled={saving || p.status === s}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={p.status === s ? { background: "rgba(42,127,160,0.10)", color: T.main, borderColor: T.main } : { background: "#fff", color: T.slate, borderColor: T.border }}>
                  {SPRINT_PARTICIPANT_STATUS[s].label}
                </button>
              ))}
            </div>
          </Section>
 
          <Section title="Danger Zone">
            {!confirmDel
              ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ color: "#ef4444", border: "1px solid #fca5a5", background: "#fff5f5" }}><Trash2 className="w-4 h-4" /> Delete Record</button>
              : <DeleteConfirm onConfirm={async () => { await del({ participantId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}
          </Section>
        </div>
      </DrawerShell>
      {showEdit && <SprintParticipantModal onClose={() => setShowEdit(false)} participantId={id} initial={p} />}
    </>
  );
}
 
function SprintSponsorDrawer({ id, onClose }: { id: Id<"sprintSponsors">; onClose: () => void }) {
  const s = useQuery(api.admin.getSprintSponsor, { sponsorId: id });
  const updateStatus = useMutation(api.admin.updateSprintSponsorStatus);
  const del = useMutation(api.admin.deleteSprintSponsor);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
 
  const save = async (status: string) => {
    setSaving(true);
    await updateStatus({ sponsorId: id, status: status as any, reviewNotes: notes || undefined, internalRating: rating || undefined });
    setSaving(false);
  };
 
  if (!s) return (
    <DrawerShell onClose={onClose} title="Sprint Sponsor">
      <div className="flex-1 flex items-center justify-center"><Spinner /></div>
    </DrawerShell>
  );
 
  return (
    <>
      <DrawerShell onClose={onClose} title="Sprint Sponsor">
        <div className="h-0.5 flex-shrink-0" style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }} />
        <div className="px-5 sm:px-8 pt-5 pb-5 flex-shrink-0" style={{ borderBottom: `1px solid ${T.border}` }}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-bold" style={{ color: T.deep }}>{s.companyName}</h2>
              <p className="text-sm mt-0.5" style={{ color: T.slate }}>{s.contactName} · {s.contactTitle}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge status={s.status} cfg={SPRINT_SPONSOR_STATUS} />
              <button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.slate }}>
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-3" style={{ color: T.slate }}>
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{s.email}</span>
            {s.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{s.phone}</span>}
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmt(s.submittedAt)}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Tag variant="green">{s.sponsorLevel.split("(")[0].trim()}</Tag>
            <Tag>{s.orgType.split("(")[0].trim()}</Tag>
            {s.anchorPartner === "Yes" && <Tag variant="violet">Anchor Partner</Tag>}
            {s.internalRating && <Tag variant="amber">★ {s.internalRating}/10</Tag>}
          </div>
          {(s.website || s.linkedin) && (
            <div className="flex gap-3 mt-3">
              {s.website && <a href={s.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: T.main }}><Globe className="w-3.5 h-3.5" /> Website</a>}
              {s.linkedin && <a href={s.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm" style={{ color: T.main }}><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>}
            </div>
          )}
        </div>
 
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          <Section title="Organization">
            <Grid2>
              <Field label="Type" value={s.orgType} />
              <Field label="Stage" value={s.orgStage} />
              <Field label="Format" value={s.participationFormat} />
              <Field label="Timeframe" value={s.preferredTimeframe} />
              <Field label="Decision Timeline" value={s.decisionTimeline} />
              <Field label="Decision Maker?" value={s.isDecisionMaker} />
            </Grid2>
            {s.otherApprovers && <Field label="Other Approvers" value={s.otherApprovers} />}
          </Section>
 
          {s.involvementTypes?.length > 0 && (
            <Section title="Involvement Types">
              <div className="flex flex-wrap gap-1.5">
                {s.involvementTypes.map((t: string) => <Tag key={t}>{t}</Tag>)}
              </div>
            </Section>
          )}
 
          {s.primaryGoals?.length > 0 && (
            <Section title="Primary Goals">
              <div className="flex flex-wrap gap-1.5">
                {s.primaryGoals.map((g: string) => <Tag key={g} variant="green">{g}</Tag>)}
              </div>
            </Section>
          )}
 
          <Section title="Objectives">
            <Field label="Definition of Success" value={s.successDefinition} long />
          </Section>
 
          {(s.relevantAreas?.length > 0 || s.participantEngagement?.length > 0) && (
            <Section title="Event Fit">
              {s.relevantAreas?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: T.slate }}>Relevant Areas</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.relevantAreas.map((a: string) => <Tag key={a} variant="violet">{a}</Tag>)}
                  </div>
                </div>
              )}
              {s.participantEngagement?.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider mb-1.5" style={{ color: T.slate }}>Participant Engagement</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.participantEngagement.map((e: string) => <Tag key={e}>{e}</Tag>)}
                  </div>
                </div>
              )}
            </Section>
          )}
 
          <Field label="Referral Source" value={s.referralSource} />
          {s.additionalNotes && <Section title="Additional Notes"><p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: T.deep }}>{s.additionalNotes}</p></Section>}
 
          <Section title="Internal Review">
            <RatingPicker value={String(rating || s.internalRating || "")} onChange={v => setRating(Number(v))} />
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Deal notes, concerns, next steps…"
              className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none min-h-[90px]"
              style={{ background: "#fff", border: `1px solid ${T.border}`, color: T.deep }} />
            {s.reviewNotes && <p className="text-xs" style={{ color: T.slate }}>Previous: {s.reviewNotes}</p>}
          </Section>
 
          <Section title="Move Stage">
            <div className="flex flex-wrap gap-2">
              {(["under_review","in_discussion","committed","declined"] as const).map(st => (
                <button key={st} onClick={() => save(st)} disabled={saving || s.status === st}
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all"
                  style={s.status === st ? { background: "rgba(42,127,160,0.10)", color: T.main, borderColor: T.main } : { background: "#fff", color: T.slate, borderColor: T.border }}>
                  {SPRINT_SPONSOR_STATUS[st].label}
                </button>
              ))}
            </div>
          </Section>
 
          <Section title="Danger Zone">
            {!confirmDel
              ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm" style={{ color: "#ef4444", border: "1px solid #fca5a5", background: "#fff5f5" }}><Trash2 className="w-4 h-4" /> Delete Record</button>
              : <DeleteConfirm onConfirm={async () => { await del({ sponsorId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}
          </Section>
        </div>
      </DrawerShell>
      {showEdit && (
  <SprintSponsorModal
    onClose={() => setShowEdit(false)}
    sponsorId={id}
    initial={{ ...s, internalRating: s.internalRating != null ? String(s.internalRating) : "" }}
  />
)}
    </>
  );
}
 
// ═══════════════════════════════════════════════════════════════════════════════
// STATUS TABS
// ═══════════════════════════════════════════════════════════════════════════════
function StatusTabs({ byStatus, cfg, filter, setFilter }: {
  byStatus: Record<string, number>;
  cfg: Record<string, { label: string; textColor: string; bgColor: string; dot: string }>;
  filter: string; setFilter: (s: string) => void;
}) {
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button onClick={() => setFilter("")}
        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
        style={filter === "" ? { background: T.deep, color: "#fff", borderColor: T.deep } : { background: "#fff", color: T.slate, borderColor: T.border }}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ background: filter === "" ? "#fff" : T.slate }} />
        All <span className="opacity-60 font-bold">{total}</span>
      </button>
      {Object.entries(byStatus).map(([s, n]) => {
        const c = cfg[s]; if (!c) return null;
        const isActive = filter === s;
        return (
          <button key={s} onClick={() => setFilter(filter === s ? "" : s)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
            style={isActive ? { background: c.bgColor, color: c.textColor, borderColor: c.dot } : { background: "#fff", color: T.slate, borderColor: T.border }}>
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot, opacity: isActive ? 1 : 0.4 }} />
            {c.label} <span className="opacity-60 font-bold">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARDS
// ═══════════════════════════════════════════════════════════════════════════════
function StartupCard({ app, onClick }: { app: any; onClick: () => void }) {
  const hasDocs = app.pitchDeckStorageId || app.financialModelStorageId;
  return (
    <div onClick={onClick} className="group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(10,47,66,0.06)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(42,127,160,0.14)"; (e.currentTarget as HTMLElement).style.borderColor = T.main; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(10,47,66,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = T.border; }}>
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />

      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold truncate transition-colors" style={{ color: T.deep }}>{app.companyName}</h3>
            {app.manuallyAdded && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: "#ede9fe", color: "#5b21b6" }}>M</span>}
            {hasDocs && <Paperclip className="w-3 h-3 flex-shrink-0" style={{ color: T.bright }} />}
          </div>
          <p className="text-xs mt-0.5" style={{ color: T.slate }}>{app.founderName} · {app.companyLocation}</p>
        </div>
        <Badge status={app.status} cfg={STARTUP_STATUS} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        {[{ l:"Industry",v:app.industry },{ l:"Asking",v:app.fundingAmount,green:true },{ l:"Stage",v:app.stage.replace(/_/g," ") },{ l:"Funding",v:app.fundingStage.replace(/_/g," ") }].map(({ l, v, green }) => (
          <div key={l}>
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>{l}</p>
            <p className="text-xs font-semibold" style={{ color: (green as boolean) ? "#059669" : T.deep }}>{v}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {app.internalRating && <Pill variant="amber">★ {app.internalRating}/10</Pill>}
        {app.currentRevenue && <Pill variant="green">{app.currentRevenue}</Pill>}
        {app.technologyStack && <Pill>{app.technologyStack.split(",")[0].trim()}</Pill>}
      </div>

      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <span className="text-[10px]" style={{ color: T.slate }}>{fmt(app.submittedAt)}</span>
        <Eye className="w-3.5 h-3.5 transition-colors" style={{ color: T.border }} />
      </div>
    </div>
  );
}

function JobCard({ app, onClick }: { app: any; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(10,47,66,0.06)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(42,127,160,0.14)"; (e.currentTarget as HTMLElement).style.borderColor = T.main; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(10,47,66,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = T.border; }}>
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate" style={{ color: T.deep }}>{app.fullName}</h3>
            {app.manuallyAdded && <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0" style={{ background: "#ede9fe", color: "#5b21b6" }}>M</span>}
          </div>
          <p className="text-xs mt-0.5" style={{ color: T.slate }}>{app.currentRole}</p>
        </div>
        <Badge status={app.status} cfg={JOB_STATUS} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        {[{ l:"Position",v:app.position },{ l:"Experience",v:app.experience+" yrs" },{ l:"Location",v:app.location }].map(({ l, v }) => (
          <div key={l} className={l === "Location" ? "col-span-2" : ""}>
            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>{l}</p>
            <p className="text-xs font-semibold capitalize" style={{ color: T.deep }}>{v}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <span className="text-[10px]" style={{ color: T.slate }}>{fmt(app.submittedAt)}</span>
        <Eye className="w-3.5 h-3.5" style={{ color: T.border }} />
      </div>
    </div>
  );
}
 
function SprintParticipantCard({ p, onClick }: { p: any; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(10,47,66,0.06)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(42,127,160,0.14)"; (e.currentTarget as HTMLElement).style.borderColor = T.main; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(10,47,66,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = T.border; }}>
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, #7c3aed, #a78bfa)` }} />
 
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: T.deep }}>{p.fullName}</h3>
          <p className="text-xs mt-0.5 truncate" style={{ color: T.slate }}>{p.institution} · {p.programYear}</p>
        </div>
        <Badge status={p.status} cfg={SPRINT_PARTICIPANT_STATUS} />
      </div>
 
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Role</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{p.primaryRole}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Style</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{p.executionStyle}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Time</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{p.timeCommitment}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Team</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{p.teamPreference}</p></div>
      </div>
 
      {p.interests?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {p.interests.slice(0, 3).map((i: string) => <Pill key={i} variant="navy">{i}</Pill>)}
          {p.interests.length > 3 && <Pill>+{p.interests.length - 3}</Pill>}
        </div>
      )}
 
      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <span className="text-[10px]" style={{ color: T.slate }}>{fmt(p.submittedAt)}</span>
        <Eye className="w-3.5 h-3.5" style={{ color: T.border }} />
      </div>
    </div>
  );
}
 
function SprintSponsorCard({ s, onClick }: { s: any; onClick: () => void }) {
  return (
    <div onClick={onClick} className="group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ border: `1px solid ${T.border}`, boxShadow: "0 1px 4px rgba(10,47,66,0.06)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(42,127,160,0.14)"; (e.currentTarget as HTMLElement).style.borderColor = T.main; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(10,47,66,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = T.border; }}>
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, #10b981, #34d399)` }} />
 
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: T.deep }}>{s.companyName}</h3>
          <p className="text-xs mt-0.5 truncate" style={{ color: T.slate }}>{s.contactName} · {s.contactTitle}</p>
        </div>
        <Badge status={s.status} cfg={SPRINT_SPONSOR_STATUS} />
      </div>
 
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Level</p><p className="text-xs font-semibold" style={{ color: "#059669" }}>{s.sponsorLevel.split("(")[0].trim()}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Type</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{s.orgType.split("(")[0].trim()}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Format</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{s.participationFormat}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Timeline</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{s.decisionTimeline}</p></div>
      </div>
 
      <div className="flex flex-wrap gap-1.5 mb-3">
        {s.internalRating && <Pill variant="amber">★ {s.internalRating}/10</Pill>}
        {s.anchorPartner === "Yes" && <Pill variant="green">Anchor</Pill>}
        {s.relevantAreas?.slice(0,2).map((a: string) => <Pill key={a} variant="navy">{a}</Pill>)}
      </div>
 
      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <span className="text-[10px]" style={{ color: T.slate }}>{fmt(s.submittedAt)}</span>
        <Eye className="w-3.5 h-3.5" style={{ color: T.border }} />
      </div>
    </div>
  );
}
 
function LPCard({ lp, onClick }: { lp: any; onClick: () => void }) {
  const isOverdue = lp.nextFollowUpDate && lp.nextFollowUpDate < Date.now();
  return (
    <div onClick={onClick} className="group relative bg-white rounded-2xl p-5 cursor-pointer transition-all duration-200"
      style={{ border: `1px solid ${isOverdue ? "#fca5a5" : T.border}`, boxShadow: "0 1px 4px rgba(10,47,66,0.06)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(42,127,160,0.14)"; (e.currentTarget as HTMLElement).style.borderColor = isOverdue ? "#ef4444" : T.main; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(10,47,66,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = isOverdue ? "#fca5a5" : T.border; }}>
      <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: isOverdue ? "linear-gradient(90deg,#ef4444,#f97316)" : `linear-gradient(90deg, ${T.mid}, ${T.bright})` }} />
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate" style={{ color: T.deep }}>{lp.fullName}</h3>
          <p className="text-xs mt-0.5" style={{ color: T.slate }}>{lp.organization ?? lp.email}</p>
        </div>
        <Badge status={lp.status} cfg={LP_STATUS} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Type</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{LP_TYPES[lp.investorType] ?? lp.investorType}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Commitment</p><p className="text-xs font-semibold" style={{ color: "#059669" }}>{lp.commitmentAmount ?? "—"}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Last Contact</p><p className="text-xs font-semibold" style={{ color: T.deep }}>{fmtOpt(lp.lastContactDate)}</p></div>
        <div><p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: T.slate }}>Follow-Up</p><p className="text-xs font-semibold" style={{ color: isOverdue ? "#ef4444" : T.deep }}>{fmtOpt(lp.nextFollowUpDate)}</p></div>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {lp.internalRating && <Pill variant="amber">★ {lp.internalRating}/10</Pill>}
        {isOverdue && <Pill>⚠ Overdue</Pill>}
        {lp.meetingCount != null && <Pill>{lp.meetingCount} meeting{lp.meetingCount !== 1 ? "s" : ""}</Pill>}
      </div>
      <div className="flex items-center justify-between pt-3" style={{ borderTop: `1px solid ${T.border}` }}>
        <span className="text-[10px]" style={{ color: T.slate }}>{fmtOpt(lp.addedAt)}</span>
        <Eye className="w-3.5 h-3.5" style={{ color: T.border }} />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW SHELL
// ═══════════════════════════════════════════════════════════════════════════════
function ViewShell({ title, subtitle, stats, statConfig, statusFilter, setStatusFilter, search, setSearch, searchPlaceholder, onAdd, addLabel, children }: {
  title: string; subtitle: string; stats?: Record<string, number>;
  statConfig: Record<string, any>; statusFilter: string; setStatusFilter: (s: string) => void;
  search: string; setSearch: (s: string) => void; searchPlaceholder: string;
  onAdd: () => void; addLabel: string; children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 sm:px-6 pt-5 pb-4 flex-shrink-0 space-y-4" style={{ borderBottom: `1px solid ${T.border}`, background: "#fff" }}>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate" style={{ color: T.deep }}>{title}</h1>
            <p className="text-xs mt-0.5" style={{ color: T.slate }}>{subtitle}</p>
          </div>
          <button onClick={onAdd}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: `linear-gradient(135deg, ${T.mid} 0%, ${T.main} 100%)`, boxShadow: "0 4px 14px rgba(42,127,160,0.30)" }}>
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{addLabel}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>
        {stats && <StatusTabs byStatus={stats} cfg={statConfig} filter={statusFilter} setFilter={setStatusFilter} />}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: T.slate }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder={searchPlaceholder}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
            style={{ background: T.ghost, border: `1px solid ${T.border}`, color: T.deep }}
            onFocus={e => { e.target.style.borderColor = T.bright; e.target.style.boxShadow = "0 0 0 3px rgba(42,127,160,0.10)"; e.target.style.background = "#fff"; }}
            onBlur={e => { e.target.style.borderColor = T.border; e.target.style.boxShadow = "none"; e.target.style.background = T.ghost; }}
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="w-3.5 h-3.5" style={{ color: T.slate }} /></button>}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ background: T.ghost }}>{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEWS
// ═══════════════════════════════════════════════════════════════════════════════
function StartupsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"startupApplications">) => void }) {
  const apps = useQuery(api.admin.listStartupApplications, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (apps ?? []).filter(a => !search || a.companyName.toLowerCase().includes(search.toLowerCase()) || a.founderName.toLowerCase().includes(search.toLowerCase()) || a.founderEmail.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <ViewShell title="Startups" subtitle={`${stats?.startups.total ?? "—"} total · ${stats?.startups.recent ?? "—"} this week`} stats={stats?.startups.byStatus} statConfig={STARTUP_STATUS} statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} searchPlaceholder="Search company, founder, email…" onAdd={() => setShowAdd(true)} addLabel="Add Startup">
        {!apps && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {apps && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 gap-3"><Building2 className="w-10 h-10" style={{ color: T.border }} /><p className="text-sm" style={{ color: T.slate }}>No startups found</p></div>}
        {apps && filtered.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(a => <StartupCard key={a._id} app={a} onClick={() => onSelect(a._id)} />)}</div>}
      </ViewShell>
      {showAdd && <StartupModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function JobsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"jobApplications">) => void }) {
  const apps = useQuery(api.admin.listJobApplications, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (apps ?? []).filter(a => !search || a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <ViewShell title="Job Applications" subtitle={`${stats?.jobs.total ?? "—"} total · ${stats?.jobs.recent ?? "—"} this week`} stats={stats?.jobs.byStatus} statConfig={JOB_STATUS} statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} searchPlaceholder="Search name, email, position…" onAdd={() => setShowAdd(true)} addLabel="Add Applicant">
        {!apps && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {apps && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 gap-3"><Users className="w-10 h-10" style={{ color: T.border }} /><p className="text-sm" style={{ color: T.slate }}>No applicants found</p></div>}
        {apps && filtered.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(a => <JobCard key={a._id} app={a} onClick={() => onSelect(a._id)} />)}</div>}
      </ViewShell>
      {showAdd && <JobModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function LPsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"limitedPartners">) => void }) {
  const lps = useQuery(api.admin.listLimitedPartners, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (lps ?? []).filter(a => !search || a.fullName.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || (a.organization ?? "").toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <ViewShell title="Limited Partners" subtitle={`${stats?.lps.total ?? "—"} total · ${stats?.lps.committed ?? "—"} committed+`} stats={stats?.lps.byStatus} statConfig={LP_STATUS} statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} searchPlaceholder="Search name, org, email…" onAdd={() => setShowAdd(true)} addLabel="Add LP">
        {!lps && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {lps && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 gap-3"><Handshake className="w-10 h-10" style={{ color: T.border }} /><p className="text-sm" style={{ color: T.slate }}>No LPs yet — click <span style={{ color: T.main }}>Add LP</span> to get started.</p></div>}
        {lps && filtered.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(a => <LPCard key={a._id} lp={a} onClick={() => onSelect(a._id)} />)}</div>}
      </ViewShell>
      {showAdd && <LPModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function SprintParticipantsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: {
  statusFilter: string; setStatusFilter: (s: string) => void;
  search: string; setSearch: (s: string) => void;
  onSelect: (id: Id<"sprintParticipants">) => void;
}) {
  const participants = useQuery(api.admin.listSprintParticipants, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (participants ?? []).filter(p =>
    !search ||
    p.fullName.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase()) ||
    p.institution.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <ViewShell
        title="Sprint Participants" subtitle={`${stats?.sprintParticipants.total ?? "—"} total · ${stats?.sprintParticipants.accepted ?? "—"} accepted`}
        stats={stats?.sprintParticipants.byStatus} statConfig={SPRINT_PARTICIPANT_STATUS}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        search={search} setSearch={setSearch} searchPlaceholder="Search name, email, institution…"
        onAdd={() => setShowAdd(true)} addLabel="Add Participant"
      >
        {!participants && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {participants && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 gap-3"><Users className="w-10 h-10" style={{ color: T.border }} /><p className="text-sm" style={{ color: T.slate }}>No participants found</p></div>}
        {participants && filtered.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(p => <SprintParticipantCard key={p._id} p={p} onClick={() => onSelect(p._id)} />)}</div>}
      </ViewShell>
      {showAdd && <SprintParticipantModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
 
function SprintSponsorsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: {
  statusFilter: string; setStatusFilter: (s: string) => void;
  search: string; setSearch: (s: string) => void;
  onSelect: (id: Id<"sprintSponsors">) => void;
}) {
  const sponsors = useQuery(api.admin.listSprintSponsors, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (sponsors ?? []).filter(s =>
    !search ||
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.contactName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <ViewShell
        title="Sprint Sponsors" subtitle={`${stats?.sprintSponsors.total ?? "—"} total · ${stats?.sprintSponsors.committed ?? "—"} committed`}
        stats={stats?.sprintSponsors.byStatus} statConfig={SPRINT_SPONSOR_STATUS}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        search={search} setSearch={setSearch} searchPlaceholder="Search company, contact, email…"
        onAdd={() => setShowAdd(true)} addLabel="Add Sponsor"
      >
        {!sponsors && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {sponsors && filtered.length === 0 && <div className="flex flex-col items-center justify-center py-20 gap-3"><Handshake className="w-10 h-10" style={{ color: T.border }} /><p className="text-sm" style={{ color: T.slate }}>No sponsors yet — click <span style={{ color: T.main }}>Add Sponsor</span> to get started.</p></div>}
        {sponsors && filtered.length > 0 && <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">{filtered.map(s => <SprintSponsorCard key={s._id} s={s} onClick={() => onSelect(s._id)} />)}</div>}
      </ViewShell>
      {showAdd && <SprintSponsorModal onClose={() => setShowAdd(false)} />}
    </>
  );
}
// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
type Tab = "startups" | "lps" | "jobs" | "sprint_participants" | "sprint_sponsors";
const TABS: { key: Tab; icon: any; label: string; short: string; dot: string }[] = [
  { key: "startups",          icon: Building2, label: "Startups",           short: "Startups", dot: T.main },
  { key: "lps",               icon: Handshake, label: "Limited Partners",   short: "LPs",      dot: "#10b981" },
  { key: "jobs",              icon: Users,     label: "Job Applications",   short: "Jobs",     dot: "#7c3aed" },
  { key: "sprint_participants",icon: Zap,      label: "Sprint Participants",short: "Sprint",   dot: "#f59e0b" },
  { key: "sprint_sponsors",   icon: Handshake, label: "Sprint Sponsors",    short: "Sponsors", dot: "#10b981" },
];

export default function AdminPage() {
  const { user, isLoaded: isClerkLoaded } = useUser();
  const { isAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const [tab, setTab] = useState<Tab>("startups");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<Id<"jobApplications"> | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Id<"startupApplications"> | null>(null);
  const [selectedLP, setSelectedLP] = useState<Id<"limitedPartners"> | null>(null);
   const [selectedSprintParticipant, setSelectedSprintParticipant] = useState<Id<"sprintParticipants"> | null>(null);
   const [selectedSprintSponsor, setSelectedSprintSponsor] = useState<Id<"sprintSponsors"> | null>(null);
 
  const switchTab = (t: Tab) => { setTab(t); setStatusFilter(""); setSearch(""); };

  const isLoaded = isClerkLoaded && !isConvexLoading;
  if (!isLoaded) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: T.ghost }}>
      <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: T.main, borderTopColor: "transparent" }} />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: T.ghost }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(42,127,160,0.12)", border: `1px solid ${T.border}` }}>
            <div className="w-5 h-5 rounded-md" style={{ background: T.main }} />
          </div>
          <p className="text-xl font-bold" style={{ color: T.deep }}>MUSEDATA</p>
          <p className="text-sm mt-1" style={{ color: T.slate }}>Admin Portal — sign in to continue</p>
        </div>
        <SignIn routing="hash" />
      </div>
    </div>
  );

  const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  if (!ADMIN_EMAILS.includes(userEmail) || !isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: T.ghost }}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto" style={{ background: "#fee2e2", border: "1px solid #fca5a5" }}>
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold" style={{ color: T.deep }}>Access Denied</h1>
        <p className="text-sm" style={{ color: T.slate }}><span style={{ color: T.deep }}>{userEmail}</span> is not authorized.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col" style={{ background: T.ghost, fontFamily: "'DM Sans', sans-serif", color: T.deep }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { opacity: 0.5; cursor: pointer; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex-shrink-0"
        style={{ background: T.deep, borderBottom: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-3">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div className="w-3 h-3 rounded-sm" style={{ background: T.bright }} />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">MUSEDATA</span>
            <span className="text-xs hidden sm:inline" style={{ color: "rgba(255,255,255,0.4)" }}>/ Admin</span>
          </div>

          {/* Tablet nav */}
          <nav className="hidden md:flex xl:hidden items-center gap-1 flex-1 justify-center">
            {TABS.map(({ key, icon: Icon, short, dot }) => (
              <button key={key} onClick={() => switchTab(key)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all"
                style={tab === key
                  ? { background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }
                  : { color: "rgba(255,255,255,0.5)", border: "1px solid transparent" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: tab === key ? dot : "rgba(255,255,255,0.3)" }} />
                <Icon className="w-3.5 h-3.5" />{short}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-white leading-none">{user.firstName ?? "Admin"}</p>
              <p className="text-[10px] mt-0.5 truncate max-w-[140px]" style={{ color: "rgba(255,255,255,0.4)" }}>{userEmail}</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "rgba(59,163,203,0.25)", border: "1px solid rgba(59,163,203,0.4)", color: T.bright }}>
              {user.firstName?.[0] ?? userEmail[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden xl:flex w-52 flex-col flex-shrink-0"
          style={{ background: "#fff", borderRight: `1px solid ${T.border}` }}>
          <div className="px-3 py-5">
            <p className="text-[10px] font-bold uppercase tracking-widest px-3 mb-3" style={{ color: T.slate }}>Navigation</p>
            <nav className="space-y-1">
              {TABS.map(({ key, icon: Icon, label, dot }) => (
                <button key={key} onClick={() => switchTab(key)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={tab === key
                    ? { background: "rgba(42,127,160,0.08)", color: T.main, border: `1px solid ${T.border}` }
                    : { color: T.slate, border: "1px solid transparent" }}>
                  <span className="w-2 h-2 rounded-full flex-shrink-0 transition-all" style={{ background: tab === key ? dot : T.border }} />
                  <Icon className="w-4 h-4 flex-shrink-0" />{label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden pb-16 md:pb-0">
          {tab === "startups" && <StartupsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedStartup} />}
          {tab === "lps"      && <LPsView      statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedLP} />}
          {tab === "jobs"     && <JobsView     statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedJob} />}
           {tab === "sprint_participants" && <SprintParticipantsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedSprintParticipant} />}
           {tab === "sprint_sponsors"     && <SprintSponsorsView     statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedSprintSponsor} />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: T.deep, borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        {TABS.map(({ key, icon: Icon, short, dot }) => (
          <button key={key} onClick={() => switchTab(key)}
            className="flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-all"
            style={{ color: tab === key ? "#fff" : "rgba(255,255,255,0.4)" }}>
            <div className="relative">
              <Icon className="w-5 h-5" />
              {tab === key && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" style={{ background: dot }} />}
            </div>
            <span className="text-[10px] font-semibold">{short}</span>
          </button>
        ))}
      </nav>

      {/* Drawers */}
      {selectedJob     && <JobDrawer     id={selectedJob}     onClose={() => setSelectedJob(null)} />}
      {selectedStartup && <StartupDrawer id={selectedStartup} onClose={() => setSelectedStartup(null)} />}
      {selectedLP      && <LPDrawer      id={selectedLP}      onClose={() => setSelectedLP(null)} />}
         {selectedSprintParticipant && <SprintParticipantDrawer id={selectedSprintParticipant} onClose={() => setSelectedSprintParticipant(null)} />}
          {selectedSprintSponsor      && <SprintSponsorDrawer     id={selectedSprintSponsor}     onClose={() => setSelectedSprintSponsor(null)} />}
    </div>
  );
}