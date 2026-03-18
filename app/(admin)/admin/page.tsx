"use client";

import { useUser, SignIn } from "@clerk/nextjs";
import { useQuery, useMutation, useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import {
  Users, Building2, X, Download, Mail, Phone, MapPin,
  Linkedin, Globe, Calendar, Eye, Plus, Handshake,
  Trash2, Edit3, Save, RefreshCw, Search, XCircle,
  ChevronDown, Star, TrendingUp, DollarSign, MapPinIcon, Briefcase,
} from "lucide-react";

// ─── Admin whitelist ───────────────────────────────────────────────────────────
const ADMIN_EMAILS = ["partners@musedata.ai", "collin@musedata.ai", "nursan2007@gmail.com", "noorulainmalik77@gmail.com"];

// ─── Formatters ───────────────────────────────────────────────────────────────
const fmt = (ts: number) =>
  new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
const fmtOpt = (ts?: number) => ts ? fmt(ts) : "—";

// ─── Status configs ────────────────────────────────────────────────────────────
const JOB_STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  submitted:    { label: "Submitted",    color: "text-sky-400",    bg: "bg-sky-400/10",    dot: "#38bdf8" },
  under_review: { label: "Under Review", color: "text-amber-400",  bg: "bg-amber-400/10",  dot: "#fbbf24" },
  interviewing: { label: "Interviewing", color: "text-violet-400", bg: "bg-violet-400/10", dot: "#a78bfa" },
  accepted:     { label: "Accepted",     color: "text-emerald-400",bg: "bg-emerald-400/10",dot: "#34d399" },
  rejected:     { label: "Rejected",     color: "text-rose-400",   bg: "bg-rose-400/10",   dot: "#fb7185" },
};
const STARTUP_STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  submitted:     { label: "Submitted",     color: "text-sky-400",    bg: "bg-sky-400/10",    dot: "#38bdf8" },
  under_review:  { label: "Under Review",  color: "text-amber-400",  bg: "bg-amber-400/10",  dot: "#fbbf24" },
  due_diligence: { label: "Due Diligence", color: "text-violet-400", bg: "bg-violet-400/10", dot: "#a78bfa" },
  term_sheet:    { label: "Term Sheet",    color: "text-orange-400", bg: "bg-orange-400/10", dot: "#fb923c" },
  funded:        { label: "Funded",        color: "text-emerald-400",bg: "bg-emerald-400/10",dot: "#34d399" },
  rejected:      { label: "Rejected",      color: "text-rose-400",   bg: "bg-rose-400/10",   dot: "#fb7185" },
  on_hold:       { label: "On Hold",       color: "text-zinc-400",   bg: "bg-zinc-400/10",   dot: "#a1a1aa" },
};
const LP_STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  prospect:       { label: "Prospect",    color: "text-sky-400",    bg: "bg-sky-400/10",    dot: "#38bdf8" },
  contacted:      { label: "Contacted",   color: "text-amber-400",  bg: "bg-amber-400/10",  dot: "#fbbf24" },
  interested:     { label: "Interested",  color: "text-violet-400", bg: "bg-violet-400/10", dot: "#a78bfa" },
  soft_committed: { label: "Soft Commit", color: "text-orange-400", bg: "bg-orange-400/10", dot: "#fb923c" },
  committed:      { label: "Committed",   color: "text-emerald-400",bg: "bg-emerald-400/10",dot: "#34d399" },
  closed:         { label: "Closed",      color: "text-teal-400",   bg: "bg-teal-400/10",   dot: "#2dd4bf" },
  declined:       { label: "Declined",    color: "text-rose-400",   bg: "bg-rose-400/10",   dot: "#fb7185" },
};
const LP_TYPES: Record<string, string> = {
  hnwi: "HNWI", family_office: "Family Office", endowment: "Endowment",
  pension_fund: "Pension Fund", corporate: "Corporate",
  fund_of_funds: "Fund of Funds", sovereign_wealth: "Sovereign Wealth", other: "Other",
};

// ─── Shared atoms ──────────────────────────────────────────────────────────────
function Badge({ status, cfg }: { status: string; cfg: Record<string, { label: string; color: string; bg: string; dot?: string }> }) {
  const c = cfg[status];
  if (!c) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.color} ${c.bg}`}>
      {c.dot && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot }} />}
      {c.label}
    </span>
  );
}

function Pill({ children, color = "default" }: { children: React.ReactNode; color?: "default" | "green" | "amber" | "blue" }) {
  const cls = {
    default: "bg-white/5 text-zinc-400 border-white/10",
    green:   "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    amber:   "bg-amber-400/10 text-amber-400 border-amber-400/20",
    blue:    "bg-[#4AADCF]/10 text-[#4AADCF] border-[#4AADCF]/20",
  }[color];
  return <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize ${cls}`}>{children}</span>;
}

function Spinner() {
  return <div className="w-7 h-7 border-2 border-[#4AADCF] border-t-transparent rounded-full animate-spin mx-auto" />;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">{title}</p>
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
      <p className="text-[10px] text-zinc-500 mb-0.5">{label}</p>
      {long
        ? <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{value}</p>
        : <p className="text-sm font-medium text-white">{value}</p>}
    </div>
  );
}
function Tag({ children, color = "zinc" }: { children: React.ReactNode; color?: string }) {
  const cls: Record<string, string> = {
    zinc:    "bg-white/5 text-zinc-400 border-white/10",
    emerald: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    amber:   "bg-amber-400/10 text-amber-400 border-amber-400/20",
    violet:  "bg-violet-400/10 text-violet-400 border-violet-400/20",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${cls[color] ?? cls.zinc}`}>
      {children}
    </span>
  );
}

// ─── Form atoms ────────────────────────────────────────────────────────────────
function FInput({ label, value, onChange, placeholder, required, type = "text", hint }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string; hint?: string }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-2 transition-colors"
        style={{ color: focused ? "#4AADCF" : filled ? "#a1a1aa" : "#71717a" }}>
        {label}{required && <span className="text-rose-400 text-[10px]">✱</span>}
      </label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none transition-all border"
        style={{
          background: focused ? "rgba(74,173,207,0.06)" : "rgba(255,255,255,0.04)",
          borderColor: focused ? "rgba(74,173,207,0.45)" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(74,173,207,0.08)" : "none",
        }} />
      {hint && <p className="text-[10px] text-zinc-600 mt-1.5 ml-0.5">{hint}</p>}
    </div>
  );
}
function FSelect({ label, value, onChange, options, required }:
  { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; required?: boolean }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-2 transition-colors"
        style={{ color: focused ? "#4AADCF" : filled ? "#a1a1aa" : "#71717a" }}>
        {label}{required && <span className="text-rose-400 text-[10px]">✱</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full appearance-none rounded-lg px-4 py-2.5 pr-9 text-sm focus:outline-none transition-all border"
          style={{
            background: focused ? "rgba(74,173,207,0.06)" : "rgba(255,255,255,0.04)",
            borderColor: focused ? "rgba(74,173,207,0.45)" : "rgba(255,255,255,0.08)",
            boxShadow: focused ? "0 0 0 3px rgba(74,173,207,0.08)" : "none",
            color: value ? "#ffffff" : "#52525b",
          }}>
          <option value="" style={{ background: "#0d1117", color: "#71717a" }}>Select…</option>
          {options.map(o => <option key={o.value} value={o.value} style={{ background: "#0d1117", color: "#fff" }}>{o.label}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
          style={{ color: focused ? "#4AADCF" : "#52525b" }} />
      </div>
    </div>
  );
}
function FTextarea({ label, value, onChange, placeholder, rows = 3, hint }:
  { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number; hint?: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium mb-2 transition-colors"
        style={{ color: focused ? "#4AADCF" : value.length > 0 ? "#a1a1aa" : "#71717a" }}>
        {label}
      </label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none resize-none transition-all border"
        style={{
          background: focused ? "rgba(74,173,207,0.06)" : "rgba(255,255,255,0.04)",
          borderColor: focused ? "rgba(74,173,207,0.45)" : "rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(74,173,207,0.08)" : "none",
        }} />
      {hint && <p className="text-[10px] text-zinc-600 mt-1.5 ml-0.5">{hint}</p>}
    </div>
  );
}
function RatingPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const n = Number(value);
  const getColor = (num: number) => {
    if (num <= 3) return { active: "bg-rose-500 text-white border-rose-500", hover: "hover:border-rose-500/40 hover:text-rose-400" };
    if (num <= 6) return { active: "bg-amber-500 text-white border-amber-500", hover: "hover:border-amber-500/40 hover:text-amber-400" };
    return { active: "bg-emerald-500 text-white border-emerald-500", hover: "hover:border-emerald-500/40 hover:text-emerald-400" };
  };
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-zinc-500">Internal Rating</label>
        {value && <span className={`text-xs font-bold ${n <= 3 ? "text-rose-400" : n <= 6 ? "text-amber-400" : "text-emerald-400"}`}>{n}/10 · {n <= 3 ? "Low" : n <= 6 ? "Medium" : "High"}</span>}
      </div>
      <div className="flex gap-1.5">
        {[1,2,3,4,5,6,7,8,9,10].map(num => {
          const c = getColor(num);
          const isActive = value === String(num);
          return (
            <button key={num} type="button" onClick={() => onChange(String(num))}
              className={`flex-1 h-8 rounded-md text-xs font-bold border transition-all duration-150 ${isActive ? c.active : `bg-white/[0.03] border-white/[0.08] text-zinc-600 ${c.hover}`}`}>
              {num}
            </button>
          );
        })}
      </div>
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
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#4AADCF]/50 text-sm text-zinc-300 hover:text-white transition-all group">
      <Download className="w-4 h-4 text-[#4AADCF] group-hover:scale-110 transition-transform" />
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
      <div className="fixed inset-0 z-[45] bg-black/60 backdrop-blur-sm" style={{ top: "56px" }} onClick={onClose} />
      <div className="fixed right-0 bottom-0 z-[46] flex flex-col"
        style={{ top: "56px", width: "min(100vw, 640px)", background: "#0d1117", borderLeft: "1px solid rgba(255,255,255,0.08)", boxShadow: "-16px 0 48px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center justify-between px-5 sm:px-7 pt-5 pb-4 flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{title ?? "Detail"}</span>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
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
      <div className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm" style={{ top: "56px" }} onClick={onClose} />
      <div className="fixed right-0 bottom-0 z-[56] flex flex-col"
        style={{ top: "56px", width: "min(100vw, 520px)", background: "#09111f", borderLeft: "1px solid rgba(255,255,255,0.07)", boxShadow: "-20px 0 60px rgba(0,0,0,0.6)" }}>
        <div className="relative flex-shrink-0 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#4AADCF]/50 to-transparent" />
          <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              {icon && (
                <div className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                  style={{ background: "rgba(74,173,207,0.1)", border: "1px solid rgba(74,173,207,0.2)" }}>
                  {icon}
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white truncate">{title}</h2>
                {subtitle && <p className="text-xs text-zinc-500 mt-0.5 truncate">{subtitle}</p>}
              </div>
            </div>
            <button onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="h-px mx-5" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>
        <div className="overflow-y-auto flex-1 px-5 pb-4">
          <div className="space-y-7 py-4">{children}</div>
        </div>
        <div className="flex-shrink-0 px-5 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "rgba(6,13,24,0.9)" }}>
          <button onClick={onClose} className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">Cancel</button>
          <button onClick={onSave} disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: saving ? "#2a7a94" : "linear-gradient(135deg, #4AADCF 0%, #2e8aac 100%)", boxShadow: saving ? "none" : "0 4px 20px rgba(74,173,207,0.3)" }}>
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
        <div className="w-6 h-6 rounded-full bg-[#4AADCF]/10 border border-[#4AADCF]/25 flex items-center justify-center flex-shrink-0">
          <span className="text-[10px] font-bold text-[#4AADCF]">{step}</span>
        </div>
        <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">{title}</span>
        <div className="flex-1 h-px bg-white/[0.05]" />
      </div>
      <div className="space-y-4 pl-9">{children}</div>
    </div>
  );
}

function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-sm text-zinc-400">Delete this record?</span>
      <button onClick={onConfirm}
        className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-all">Yes, Delete</button>
      <button onClick={onCancel}
        className="px-4 py-1.5 rounded-lg text-sm font-medium text-zinc-400 border border-white/10 hover:text-white transition-all">Cancel</button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// JOB APPLICATION MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const JOB_POSITIONS = ["Software Engineer","Frontend Engineer","Backend Engineer","Full-Stack Engineer","Data Scientist","Data Analyst","ML Engineer","Product Manager","Designer","Marketing","Sales","Operations","Finance","Other"];
const JOB_EXPERIENCES = ["0–1","1–3","3–5","5–10","10+"];
const JOB_STATUSES = Object.entries(JOB_STATUS).map(([v, c]) => ({ value: v, label: c.label }));

type JobForm = { fullName: string; email: string; phone: string; location: string; currentRole: string; experience: string; linkedin: string; portfolio: string; position: string; motivation: string; skills: string; status: string; };
const EMPTY_JOB: JobForm = { fullName: "", email: "", phone: "", location: "", currentRole: "", experience: "", linkedin: "", portfolio: "", position: "", motivation: "", skills: "", status: "submitted" };

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
    <ModalShell title={jobId ? "Edit Job Application" : "Add Job Application"} subtitle="Manually enter applicant details" onClose={onClose} onSave={save} saving={saving} saveLabel={jobId ? "Save Changes" : "Add Applicant"} icon={<Users className="w-4 h-4 text-[#4AADCF]" />}>
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
      {error && <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/20"><XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-rose-300">{error}</p></div>}
    </ModalShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STARTUP MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const INDUSTRIES = ["FinTech","HealthTech","EdTech","SaaS","E-commerce","AI/ML","Web3/Crypto","CleanTech","Logistics","Real Estate","Consumer","B2B","DeepTech","Other"];
const INCORP_STATUSES = [{ value:"incorporated",label:"Incorporated" },{ value:"in_progress",label:"In Progress" },{ value:"not_yet",label:"Not Yet" }];
const STAGES = [{ value:"idea",label:"Idea" },{ value:"prototype",label:"Prototype" },{ value:"mvp",label:"MVP" },{ value:"early_revenue",label:"Early Revenue" },{ value:"growth",label:"Growth" }];
const FUNDING_STAGES = [{ value:"pre_seed",label:"Pre-Seed" },{ value:"seed",label:"Seed" },{ value:"series_a",label:"Series A" },{ value:"series_b",label:"Series B" },{ value:"series_c_plus",label:"Series C+" }];
const STARTUP_STATUSES = Object.entries(STARTUP_STATUS).map(([v, c]) => ({ value: v, label: c.label }));

type StartupForm = { founderName: string; founderEmail: string; founderPhone: string; founderLinkedin: string; coFounders: string; companyName: string; companyWebsite: string; companyLocation: string; incorporationStatus: string; industry: string; stage: string; businessModel: string; problemStatement: string; solution: string; uniqueValueProposition: string; targetMarket: string; marketSize: string; competitors: string; competitiveAdvantage: string; currentRevenue: string; revenueGrowth: string; numberOfCustomers: string; keyMilestones: string; fundingStage: string; fundingAmount: string; previousFunding: string; currentInvestors: string; useOfFunds: string; valuation: string; teamSize: string; keyTeamMembers: string; advisors: string; productDescription: string; technologyStack: string; customerAcquisition: string; salesStrategy: string; marketingStrategy: string; burnRate: string; runway: string; whyUs: string; referralSource: string; exitStrategy: string; challenges: string; status: string; internalRating: string; };
const EMPTY_STARTUP: StartupForm = { founderName:"",founderEmail:"",founderPhone:"",founderLinkedin:"",coFounders:"",companyName:"",companyWebsite:"",companyLocation:"",incorporationStatus:"",industry:"",stage:"",businessModel:"",problemStatement:"",solution:"",uniqueValueProposition:"",targetMarket:"",marketSize:"",competitors:"",competitiveAdvantage:"",currentRevenue:"",revenueGrowth:"",numberOfCustomers:"",keyMilestones:"",fundingStage:"",fundingAmount:"",previousFunding:"",currentInvestors:"",useOfFunds:"",valuation:"",teamSize:"",keyTeamMembers:"",advisors:"",productDescription:"",technologyStack:"",customerAcquisition:"",salesStrategy:"",marketingStrategy:"",burnRate:"",runway:"",whyUs:"",referralSource:"",exitStrategy:"",challenges:"",status:"submitted",internalRating:"" };

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
      await create({ founderName: form.founderName, founderEmail: form.founderEmail, founderPhone: form.founderPhone || undefined, founderLinkedin: form.founderLinkedin || undefined, coFounders: form.coFounders || undefined, companyName: form.companyName, companyWebsite: form.companyWebsite || undefined, companyLocation: form.companyLocation, incorporationStatus: form.incorporationStatus as any, industry: form.industry, stage: form.stage as any, businessModel: form.businessModel, problemStatement: form.problemStatement, solution: form.solution, uniqueValueProposition: form.uniqueValueProposition, targetMarket: form.targetMarket, marketSize: form.marketSize || undefined, competitors: form.competitors || undefined, competitiveAdvantage: form.competitiveAdvantage || undefined, currentRevenue: form.currentRevenue || undefined, revenueGrowth: form.revenueGrowth || undefined, numberOfCustomers: form.numberOfCustomers || undefined, keyMilestones: form.keyMilestones, fundingStage: form.fundingStage as any, fundingAmount: form.fundingAmount, previousFunding: form.previousFunding || undefined, currentInvestors: form.currentInvestors || undefined, useOfFunds: form.useOfFunds, valuation: form.valuation || undefined, teamSize: form.teamSize, keyTeamMembers: form.keyTeamMembers, advisors: form.advisors || undefined, productDescription: form.productDescription, technologyStack: form.technologyStack || undefined, customerAcquisition: form.customerAcquisition, salesStrategy: form.salesStrategy, marketingStrategy: form.marketingStrategy || undefined, burnRate: form.burnRate || undefined, runway: form.runway || undefined, whyUs: form.whyUs, referralSource: form.referralSource || undefined, exitStrategy: form.exitStrategy || undefined, challenges: form.challenges || undefined, status: form.status as any, internalRating: form.internalRating ? Number(form.internalRating) : undefined });
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };
  const G2 = ({ children }: { children: React.ReactNode }) => <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>;
  return (
    <ModalShell title={startupId ? "Edit Startup" : "Add Startup Application"} subtitle="Manually enter startup details" onClose={onClose} onSave={save} saving={saving} saveLabel={startupId ? "Save Changes" : "Add Startup"} icon={<Building2 className="w-4 h-4 text-[#4AADCF]" />}>
      <FormSection step={1} title="Founder"><G2><FInput label="Founder Name" value={form.founderName} onChange={set("founderName")} placeholder="John Doe" required /><FInput label="Founder Email" value={form.founderEmail} onChange={set("founderEmail")} placeholder="john@startup.com" required type="email" /><FInput label="Phone" value={form.founderPhone} onChange={set("founderPhone")} placeholder="+1 555 000 0000" /><FInput label="LinkedIn" value={form.founderLinkedin} onChange={set("founderLinkedin")} placeholder="https://linkedin.com/in/…" /></G2><FInput label="Co-Founders" value={form.coFounders} onChange={set("coFounders")} placeholder="Alice (CTO), Bob (COO)" /></FormSection>
      <FormSection step={2} title="Company"><G2><FInput label="Company Name" value={form.companyName} onChange={set("companyName")} placeholder="Acme Inc." required /><FInput label="Website" value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="https://…" /><FInput label="Location" value={form.companyLocation} onChange={set("companyLocation")} placeholder="San Francisco, CA" required /><FSelect label="Incorporation" value={form.incorporationStatus} onChange={set("incorporationStatus")} options={INCORP_STATUSES} required /><FSelect label="Industry" value={form.industry} onChange={set("industry")} options={INDUSTRIES.map(v => ({ value: v, label: v }))} required /><FSelect label="Stage" value={form.stage} onChange={set("stage")} options={STAGES} required /></G2></FormSection>
      <FormSection step={3} title="Business"><FTextarea label="Problem Statement" value={form.problemStatement} onChange={set("problemStatement")} placeholder="What problem are you solving?" rows={2} /><FTextarea label="Solution" value={form.solution} onChange={set("solution")} placeholder="How do you solve it?" rows={2} /><FTextarea label="Unique Value Proposition" value={form.uniqueValueProposition} onChange={set("uniqueValueProposition")} placeholder="What makes you different?" rows={2} /><FTextarea label="Business Model" value={form.businessModel} onChange={set("businessModel")} placeholder="How do you make money?" rows={2} /><FTextarea label="Target Market" value={form.targetMarket} onChange={set("targetMarket")} placeholder="Who are your customers?" rows={2} /><G2><FInput label="Market Size" value={form.marketSize} onChange={set("marketSize")} placeholder="$10B TAM" hint="TAM / SAM / SOM" /><FInput label="Key Competitors" value={form.competitors} onChange={set("competitors")} placeholder="Stripe, Square…" /></G2></FormSection>
      <FormSection step={4} title="Traction"><G2><FInput label="Current Revenue" value={form.currentRevenue} onChange={set("currentRevenue")} placeholder="$50K MRR" /><FInput label="Revenue Growth" value={form.revenueGrowth} onChange={set("revenueGrowth")} placeholder="20% MoM" /><FInput label="Customers" value={form.numberOfCustomers} onChange={set("numberOfCustomers")} placeholder="500" /><FInput label="Burn Rate" value={form.burnRate} onChange={set("burnRate")} placeholder="$80K/mo" /><FInput label="Runway" value={form.runway} onChange={set("runway")} placeholder="18 months" /></G2><FTextarea label="Key Milestones" value={form.keyMilestones} onChange={set("keyMilestones")} placeholder="Launched MVP · 500 users · $100K ARR…" rows={2} /></FormSection>
      <FormSection step={5} title="Funding"><G2><FSelect label="Funding Stage" value={form.fundingStage} onChange={set("fundingStage")} options={FUNDING_STAGES} required /><FInput label="Amount Seeking" value={form.fundingAmount} onChange={set("fundingAmount")} placeholder="$2M" required /><FInput label="Valuation" value={form.valuation} onChange={set("valuation")} placeholder="$10M pre-money" /><FInput label="Previous Funding" value={form.previousFunding} onChange={set("previousFunding")} placeholder="$500K angel" /><FInput label="Current Investors" value={form.currentInvestors} onChange={set("currentInvestors")} placeholder="Y Combinator…" /></G2><FTextarea label="Use of Funds" value={form.useOfFunds} onChange={set("useOfFunds")} placeholder="50% engineering, 30% sales…" rows={2} /></FormSection>
      <FormSection step={6} title="Team & Product"><G2><FInput label="Team Size" value={form.teamSize} onChange={set("teamSize")} placeholder="8" required /><FInput label="Tech Stack" value={form.technologyStack} onChange={set("technologyStack")} placeholder="React, Node.js, Postgres…" /></G2><FTextarea label="Key Team Members" value={form.keyTeamMembers} onChange={set("keyTeamMembers")} placeholder="John (CEO, ex-Google) · Alice (CTO, PhD MIT)…" rows={2} /><FTextarea label="Product Description" value={form.productDescription} onChange={set("productDescription")} placeholder="What does the product do?" rows={2} /></FormSection>
      <FormSection step={7} title="Go-to-Market"><FTextarea label="Customer Acquisition" value={form.customerAcquisition} onChange={set("customerAcquisition")} placeholder="How do you get customers?" rows={2} /><FTextarea label="Sales Strategy" value={form.salesStrategy} onChange={set("salesStrategy")} placeholder="Direct sales, PLG, partnerships…" rows={2} /><FTextarea label="Marketing Strategy" value={form.marketingStrategy} onChange={set("marketingStrategy")} placeholder="Content, paid, referral…" rows={2} /></FormSection>
      <FormSection step={8} title="Admin & Review"><G2><FSelect label="Initial Status" value={form.status} onChange={set("status")} options={STARTUP_STATUSES} required /><FInput label="Referral Source" value={form.referralSource} onChange={set("referralSource")} placeholder="Conference, LinkedIn…" /></G2><RatingPicker value={form.internalRating} onChange={set("internalRating")} /><FTextarea label="Why MUSEDATA?" value={form.whyUs} onChange={set("whyUs")} placeholder="Why are they approaching us?" rows={2} /><FTextarea label="Challenges / Risks" value={form.challenges} onChange={set("challenges")} placeholder="Key risks to be aware of…" rows={2} /></FormSection>
      {error && <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/20 ml-9"><XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-rose-300">{error}</p></div>}
    </ModalShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// LP MODAL
// ═══════════════════════════════════════════════════════════════════════════════
const LP_TYPE_OPTIONS = Object.entries(LP_TYPES).map(([v, l]) => ({ value: v, label: l }));
const LP_STATUS_OPTIONS = Object.entries(LP_STATUS).map(([v, c]) => ({ value: v, label: c.label }));

type LPForm = { fullName: string; organization: string; title: string; email: string; phone: string; location: string; linkedin: string; website: string; investorType: string; commitmentAmount: string; checkSizeRange: string; totalAUM: string; geographicFocus: string; sectorPreferences: string; status: string; lastContactDate: string; nextFollowUpDate: string; meetingCount: string; source: string; referredBy: string; internalRating: string; notes: string; };
const EMPTY_LP: LPForm = { fullName:"",organization:"",title:"",email:"",phone:"",location:"",linkedin:"",website:"",investorType:"hnwi",commitmentAmount:"",checkSizeRange:"",totalAUM:"",geographicFocus:"",sectorPreferences:"",status:"prospect",lastContactDate:"",nextFollowUpDate:"",meetingCount:"",source:"",referredBy:"",internalRating:"",notes:"" };

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
      const p = { fullName: form.fullName, organization: form.organization || undefined, title: form.title || undefined, email: form.email, phone: form.phone || undefined, location: form.location || undefined, linkedin: form.linkedin || undefined, website: form.website || undefined, investorType: form.investorType as any, commitmentAmount: form.commitmentAmount || undefined, checkSizeRange: form.checkSizeRange || undefined, totalAUM: form.totalAUM || undefined, geographicFocus: form.geographicFocus || undefined, sectorPreferences: form.sectorPreferences || undefined, status: form.status as any, lastContactDate: form.lastContactDate ? new Date(form.lastContactDate).getTime() : undefined, nextFollowUpDate: form.nextFollowUpDate ? new Date(form.nextFollowUpDate).getTime() : undefined, meetingCount: form.meetingCount ? Number(form.meetingCount) : undefined, source: form.source || undefined, referredBy: form.referredBy || undefined, internalRating: form.internalRating ? Number(form.internalRating) : undefined, notes: form.notes || undefined };
      if (lpId) await update({ lpId, ...p });
      else await create(p);
      onClose();
    } catch (e: any) { setError(e.message ?? "Failed to save."); }
    finally { setSaving(false); }
  };
  return (
    <ModalShell title={lpId ? "Edit LP" : "Add Limited Partner"} subtitle="Enter LP contact and investment details" onClose={onClose} onSave={save} saving={saving} saveLabel={lpId ? "Save Changes" : "Add LP"} icon={<Handshake className="w-4 h-4 text-[#4AADCF]" />}>
      <FormSection step={1} title="Identity"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FInput label="Full Name" value={form.fullName} onChange={set("fullName")} placeholder="Jane Smith" required /><FInput label="Organization / Firm" value={form.organization} onChange={set("organization")} placeholder="Smith Family Office" /><FInput label="Title" value={form.title} onChange={set("title")} placeholder="Managing Director" /><FSelect label="Investor Type" value={form.investorType} onChange={set("investorType")} options={LP_TYPE_OPTIONS} required /></div></FormSection>
      <FormSection step={2} title="Contact"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FInput label="Email" value={form.email} onChange={set("email")} placeholder="jane@example.com" required type="email" /><FInput label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" /><FInput label="Location" value={form.location} onChange={set("location")} placeholder="New York, NY" /><FInput label="LinkedIn" value={form.linkedin} onChange={set("linkedin")} placeholder="https://linkedin.com/in/…" /><FInput label="Website" value={form.website} onChange={set("website")} placeholder="https://…" /></div></FormSection>
      <FormSection step={3} title="Investment Profile"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FInput label="Commitment Amount" value={form.commitmentAmount} onChange={set("commitmentAmount")} placeholder="$500K" /><FInput label="Check Size Range" value={form.checkSizeRange} onChange={set("checkSizeRange")} placeholder="$250K–$1M" /><FInput label="Total AUM" value={form.totalAUM} onChange={set("totalAUM")} placeholder="$50M" /><FInput label="Geographic Focus" value={form.geographicFocus} onChange={set("geographicFocus")} placeholder="North America, Europe" /></div><FTextarea label="Sector Preferences" value={form.sectorPreferences} onChange={set("sectorPreferences")} placeholder="FinTech, HealthTech, AI/ML…" rows={2} /></FormSection>
      <FormSection step={4} title="Relationship"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><FSelect label="Pipeline Status" value={form.status} onChange={set("status")} options={LP_STATUS_OPTIONS} required /><FInput label="Meeting Count" value={form.meetingCount} onChange={set("meetingCount")} placeholder="3" type="number" /><FInput label="Last Contact" value={form.lastContactDate} onChange={set("lastContactDate")} type="date" /><FInput label="Next Follow-Up" value={form.nextFollowUpDate} onChange={set("nextFollowUpDate")} type="date" /><FInput label="Source" value={form.source} onChange={set("source")} placeholder="Conference / Referral / Cold" /><FInput label="Referred By" value={form.referredBy} onChange={set("referredBy")} placeholder="John Doe" /></div></FormSection>
      <FormSection step={5} title="Internal Notes"><RatingPicker value={form.internalRating} onChange={set("internalRating")} /><FTextarea label="Notes" value={form.notes} onChange={set("notes")} placeholder="Investment thesis, relationship context, key concerns…" rows={3} /></FormSection>
      {error && <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/5 border border-rose-500/20 ml-9"><XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" /><p className="text-sm text-rose-300">{error}</p></div>}
    </ModalShell>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// DETAIL DRAWERS (unchanged logic, same as before)
// ═══════════════════════════════════════════════════════════════════════════════
function JobDrawer({ id, onClose }: { id: Id<"jobApplications">; onClose: () => void }) {
  const app = useQuery(api.admin.getJobApplication, { applicationId: id });
  const updateStatus = useMutation(api.admin.updateJobStatus);
  const deleteJob = useMutation(api.admin.deleteJobApplication);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const save = async (status: string) => { setSaving(true); await updateStatus({ applicationId: id, status: status as any, reviewNotes: notes || undefined }); setSaving(false); };
  if (!app) return <DrawerShell onClose={onClose} title="Job Application"><div className="flex-1 flex items-center justify-center"><Spinner /></div></DrawerShell>;
  return (
    <>
      <DrawerShell onClose={onClose} title="Job Application">
        <div className="px-5 sm:px-8 pt-5 pb-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><div className="flex items-center gap-2 flex-wrap"><h2 className="text-xl font-bold text-white">{app.fullName}</h2>{app.manuallyAdded && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20 font-semibold">Manual</span>}</div><p className="text-zinc-400 text-sm mt-0.5">{app.currentRole}</p></div>
            <div className="flex items-center gap-2 flex-shrink-0"><Badge status={app.status} cfg={JOB_STATUS} /><button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{app.email}</span>
            {app.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{app.phone}</span>}
            <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{app.location}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmt(app.submittedAt)}</span>
          </div>
          {(app.linkedin || app.portfolio) && <div className="flex gap-3 mt-3">{app.linkedin && <a href={app.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>}{app.portfolio && <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" /> Portfolio</a>}</div>}
        </div>
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          {(app.resumeStorageId || app.coverLetterStorageId) && <Section title="Documents"><div className="flex flex-wrap gap-3">{app.resumeStorageId && <DocButton storageId={app.resumeStorageId} label="Resume / CV" />}{app.coverLetterStorageId && <DocButton storageId={app.coverLetterStorageId} label="Cover Letter" />}</div></Section>}
          <Section title="Role"><Grid2><Field label="Position" value={app.position} /><Field label="Experience" value={app.experience + " years"} /></Grid2></Section>
          <Section title="Why MUSEDATA"><p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{app.motivation}</p></Section>
          <Section title="Skills"><p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{app.skills}</p></Section>
          <Section title="Review Note"><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Internal notes…" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/60 resize-none min-h-[90px]" />{app.reviewNotes && <p className="text-xs text-zinc-500 mt-1">Previous: {app.reviewNotes}</p>}</Section>
          <Section title="Update Status"><div className="flex flex-wrap gap-2">{(["under_review","interviewing","accepted","rejected"] as const).map(s => (<button key={s} onClick={() => save(s)} disabled={saving || app.status === s} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all ${app.status === s ? "border-[#4AADCF] text-[#4AADCF] bg-[#4AADCF]/10 cursor-default" : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-white/5"}`}>{JOB_STATUS[s].label}</button>))}</div></Section>
          <Section title="Danger Zone">{!confirmDel ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-rose-400 border border-rose-400/20 bg-rose-400/5 hover:bg-rose-400/10 transition-all"><Trash2 className="w-4 h-4" /> Delete Record</button> : <DeleteConfirm onConfirm={async () => { await deleteJob({ applicationId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}</Section>
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
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const save = async (status: string) => { setSaving(true); await updateStatus({ applicationId: id, status: status as any, reviewNotes: notes || undefined, internalRating: rating || undefined }); setSaving(false); };
  if (!app) return <DrawerShell onClose={onClose} title="Startup Application"><div className="flex-1 flex items-center justify-center"><Spinner /></div></DrawerShell>;
  return (
    <>
      <DrawerShell onClose={onClose} title="Startup Application">
        <div className="px-5 sm:px-8 pt-5 pb-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><div className="flex items-center gap-2 flex-wrap"><h2 className="text-xl font-bold text-white">{app.companyName}</h2>{app.manuallyAdded && <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20 font-semibold">Manual</span>}</div><p className="text-zinc-400 text-sm mt-0.5">Founded by {app.founderName}</p></div>
            <div className="flex items-center gap-2 flex-shrink-0"><Badge status={app.status} cfg={STARTUP_STATUS} /><button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400 mb-3"><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{app.founderEmail}</span><span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{app.companyLocation}</span><span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{fmt(app.submittedAt)}</span></div>
          <div className="flex flex-wrap gap-2"><Tag>{app.industry}</Tag><Tag>{app.stage.replace("_"," ")}</Tag><Tag>{app.fundingStage.replace(/_/g," ")}</Tag><Tag color="emerald">{app.fundingAmount}</Tag>{app.internalRating && <Tag color="amber">★ {app.internalRating}/10</Tag>}</div>
        </div>
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          {(app.pitchDeckStorageId || app.financialModelStorageId) && <Section title="Documents"><div className="flex flex-wrap gap-3">{app.pitchDeckStorageId && <DocButton storageId={app.pitchDeckStorageId} label="Pitch Deck" />}{app.financialModelStorageId && <DocButton storageId={app.financialModelStorageId} label="Financial Model" />}{app.businessPlanStorageId && <DocButton storageId={app.businessPlanStorageId} label="Business Plan" />}{app.productDemoStorageId && <DocButton storageId={app.productDemoStorageId} label="Product Demo" />}</div></Section>}
          <Section title="Business"><Field label="Problem" value={app.problemStatement} long /><Field label="Solution" value={app.solution} long /><Field label="Value Proposition" value={app.uniqueValueProposition} long /><Field label="Business Model" value={app.businessModel} long /><Field label="Target Market" value={app.targetMarket} long /></Section>
          <Section title="Traction"><Grid2>{app.currentRevenue && <Field label="Revenue" value={app.currentRevenue} />}{app.revenueGrowth && <Field label="Growth" value={app.revenueGrowth} />}{app.numberOfCustomers && <Field label="Customers" value={app.numberOfCustomers} />}{app.burnRate && <Field label="Burn Rate" value={app.burnRate} />}{app.runway && <Field label="Runway" value={app.runway} />}</Grid2><Field label="Key Milestones" value={app.keyMilestones} long /></Section>
          <Section title="Funding"><Grid2><Field label="Asking" value={app.fundingAmount} />{app.valuation && <Field label="Valuation" value={app.valuation} />}{app.previousFunding && <Field label="Previous" value={app.previousFunding} />}{app.currentInvestors && <Field label="Investors" value={app.currentInvestors} />}</Grid2><Field label="Use of Funds" value={app.useOfFunds} long /></Section>
          <Section title="Team"><Grid2><Field label="Team Size" value={app.teamSize} /><Field label="Incorporation" value={app.incorporationStatus.replace("_"," ")} /></Grid2><Field label="Key Members" value={app.keyTeamMembers} long /></Section>
          <Section title="Internal Review"><div className="space-y-3"><RatingPicker value={String(rating || app.internalRating || "")} onChange={v => setRating(Number(v))} /><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Investment thesis, concerns, next steps…" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/60 resize-none min-h-[90px]" />{app.reviewNotes && <p className="text-xs text-zinc-500">Previous: {app.reviewNotes}</p>}</div></Section>
          <Section title="Move to Stage"><div className="flex flex-wrap gap-2">{(["under_review","due_diligence","term_sheet","funded","rejected","on_hold"] as const).map(s => (<button key={s} onClick={() => save(s)} disabled={saving || app.status === s} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all ${app.status === s ? "border-[#4AADCF] text-[#4AADCF] bg-[#4AADCF]/10 cursor-default" : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-white/5"}`}>{STARTUP_STATUS[s].label}</button>))}</div></Section>
          <Section title="Danger Zone">{!confirmDel ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-rose-400 border border-rose-400/20 bg-rose-400/5 hover:bg-rose-400/10 transition-all"><Trash2 className="w-4 h-4" /> Delete Record</button> : <DeleteConfirm onConfirm={async () => { await deleteStartup({ applicationId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}</Section>
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
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);
  const saveStatus = async (status: string) => { setSaving(true); await update({ lpId: id, status: status as any, reviewNotes: notes || undefined }); setSaving(false); };
  if (!lp) return <DrawerShell onClose={onClose} title="Limited Partner"><div className="flex-1 flex items-center justify-center"><Spinner /></div></DrawerShell>;
  return (
    <>
      <DrawerShell onClose={onClose} title="Limited Partner">
        <div className="px-5 sm:px-8 pt-5 pb-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div><h2 className="text-xl font-bold text-white">{lp.fullName}</h2>{lp.organization && <p className="text-zinc-400 text-sm mt-0.5">{lp.title ? `${lp.title} · ` : ""}{lp.organization}</p>}</div>
            <div className="flex items-center gap-2 flex-shrink-0"><Badge status={lp.status} cfg={LP_STATUS} /><button onClick={() => setShowEdit(true)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"><Edit3 className="w-3.5 h-3.5" /></button></div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400 mb-3"><span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{lp.email}</span>{lp.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{lp.phone}</span>}{lp.location && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{lp.location}</span>}</div>
          <div className="flex flex-wrap gap-2"><Tag color="violet">{LP_TYPES[lp.investorType] ?? lp.investorType}</Tag>{lp.commitmentAmount && <Tag color="emerald">{lp.commitmentAmount}</Tag>}{lp.internalRating && <Tag color="amber">★ {lp.internalRating}/10</Tag>}</div>
          {(lp.linkedin || lp.website) && <div className="flex gap-3 mt-3">{lp.linkedin && <a href={lp.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors"><Linkedin className="w-3.5 h-3.5" /> LinkedIn</a>}{lp.website && <a href={lp.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-[#4AADCF] hover:text-white transition-colors"><Globe className="w-3.5 h-3.5" /> Website</a>}</div>}
        </div>
        <div className="px-5 sm:px-8 py-6 space-y-6 overflow-y-auto flex-1">
          <Section title="Investment Profile"><Grid2>{lp.commitmentAmount && <Field label="Commitment" value={lp.commitmentAmount} />}{lp.checkSizeRange && <Field label="Check Size" value={lp.checkSizeRange} />}{lp.totalAUM && <Field label="Total AUM" value={lp.totalAUM} />}{lp.geographicFocus && <Field label="Geographic Focus" value={lp.geographicFocus} />}</Grid2>{lp.sectorPreferences && <Field label="Sectors" value={lp.sectorPreferences} long />}</Section>
          <Section title="Relationship"><Grid2><Field label="Last Contact" value={fmtOpt(lp.lastContactDate)} /><Field label="Next Follow-Up" value={fmtOpt(lp.nextFollowUpDate)} />{lp.meetingCount != null && <Field label="Meetings" value={String(lp.meetingCount)} />}{lp.source && <Field label="Source" value={lp.source} />}{lp.referredBy && <Field label="Referred By" value={lp.referredBy} />}</Grid2></Section>
          {lp.notes && <Section title="Notes"><p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{lp.notes}</p></Section>}
          <Section title="Record Info"><Grid2><Field label="Added By" value={lp.addedBy} /><Field label="Added On" value={fmtOpt(lp.addedAt)} /></Grid2></Section>
          <Section title="Review Note"><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Add a note before updating status…" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-[#4AADCF]/60 resize-none min-h-[90px]" />{lp.reviewNotes && <p className="text-xs text-zinc-500 mt-1">Previous: {lp.reviewNotes}</p>}</Section>
          <Section title="Move Pipeline Stage"><div className="flex flex-wrap gap-2">{(["prospect","contacted","interested","soft_committed","committed","closed","declined"] as const).map(s => (<button key={s} onClick={() => saveStatus(s)} disabled={saving || lp.status === s} className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all ${lp.status === s ? "border-[#4AADCF] text-[#4AADCF] bg-[#4AADCF]/10 cursor-default" : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white bg-white/5"}`}>{LP_STATUS[s].label}</button>))}</div></Section>
          <Section title="Danger Zone">{!confirmDel ? <button onClick={() => setConfirmDel(true)} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-rose-400 border border-rose-400/20 bg-rose-400/5 hover:bg-rose-400/10 transition-all"><Trash2 className="w-4 h-4" /> Delete Record</button> : <DeleteConfirm onConfirm={async () => { await del({ lpId: id }); onClose(); }} onCancel={() => setConfirmDel(false)} />}</Section>
        </div>
      </DrawerShell>
      {showEdit && <LPModal lpId={id} onClose={() => setShowEdit(false)} initial={{ fullName: lp.fullName, organization: lp.organization, title: lp.title, email: lp.email, phone: lp.phone, location: lp.location, linkedin: lp.linkedin, website: lp.website, investorType: lp.investorType, commitmentAmount: lp.commitmentAmount, checkSizeRange: lp.checkSizeRange, totalAUM: lp.totalAUM, geographicFocus: lp.geographicFocus, sectorPreferences: lp.sectorPreferences, status: lp.status, lastContactDate: lp.lastContactDate ? new Date(lp.lastContactDate).toISOString().split("T")[0] : "", nextFollowUpDate: lp.nextFollowUpDate ? new Date(lp.nextFollowUpDate).toISOString().split("T")[0] : "", meetingCount: lp.meetingCount != null ? String(lp.meetingCount) : "", source: lp.source, referredBy: lp.referredBy, internalRating: lp.internalRating != null ? String(lp.internalRating) : "", notes: lp.notes }} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STATUS FILTER TABS — tracker-style pill tabs
// ═══════════════════════════════════════════════════════════════════════════════
function StatusTabs({ byStatus, cfg, filter, setFilter }: {
  byStatus: Record<string, number>;
  cfg: Record<string, { label: string; color: string; bg: string; dot: string }>;
  filter: string;
  setFilter: (s: string) => void;
}) {
  const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
      {/* All pill */}
      <button
        onClick={() => setFilter("")}
        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
          filter === ""
            ? "bg-[#4AADCF] text-white border-[#4AADCF] shadow-lg shadow-[#4AADCF]/20"
            : "bg-white/[0.04] text-zinc-400 border-white/10 hover:bg-white/[0.07] hover:text-zinc-200"
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
        All
        <span className={`text-[10px] font-bold opacity-70`}>{total}</span>
      </button>
      {Object.entries(byStatus).map(([s, n]) => {
        const c = cfg[s];
        if (!c) return null;
        const isActive = filter === s;
        return (
          <button
            key={s}
            onClick={() => setFilter(filter === s ? "" : s)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              isActive
                ? `${c.color} ${c.bg} border-current/30`
                : "bg-white/[0.04] text-zinc-500 border-white/10 hover:bg-white/[0.07] hover:text-zinc-300"
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: c.dot, opacity: isActive ? 1 : 0.5 }} />
            {c.label}
            <span className="text-[10px] font-bold opacity-60">{n}</span>
          </button>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARD COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function StartupCard({ app, onClick }: { app: any; onClick: () => void }) {
  const sc = STARTUP_STATUS[app.status];
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0d1117] border border-white/[0.07] rounded-2xl p-5 cursor-pointer hover:border-[#4AADCF]/40 hover:bg-[#111922] transition-all duration-200"
    >
      {/* Top accent line on hover */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#4AADCF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-white group-hover:text-[#4AADCF] transition-colors truncate">
              {app.companyName}
            </h3>
            {app.manuallyAdded && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20 font-semibold flex-shrink-0">M</span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{app.founderName} · {app.companyLocation}</p>
        </div>
        <Badge status={app.status} cfg={STARTUP_STATUS} />
      </div>

      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Industry</p>
          <p className="text-xs font-medium text-zinc-300">{app.industry}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Asking</p>
          <p className="text-xs font-medium text-emerald-400">{app.fundingAmount}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Stage</p>
          <p className="text-xs font-medium text-zinc-300">{app.stage.replace(/_/g, " ")}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Funding</p>
          <p className="text-xs font-medium text-zinc-300">{app.fundingStage.replace(/_/g, " ")}</p>
        </div>
      </div>

      {/* Pills */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {app.internalRating && (
          <Pill color="amber">★ {app.internalRating}/10</Pill>
        )}
        {app.currentRevenue && <Pill color="green">{app.currentRevenue}</Pill>}
        {app.technologyStack && <Pill>{app.technologyStack.split(",")[0].trim()}</Pill>}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <span className="text-[10px] text-zinc-600">{fmt(app.submittedAt)}</span>
        <Eye className="w-3.5 h-3.5 text-zinc-700 group-hover:text-[#4AADCF] transition-colors" />
      </div>
    </div>
  );
}

function JobCard({ app, onClick }: { app: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-[#0d1117] border border-white/[0.07] rounded-2xl p-5 cursor-pointer hover:border-[#4AADCF]/40 hover:bg-[#111922] transition-all duration-200"
    >
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#4AADCF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white group-hover:text-[#4AADCF] transition-colors truncate">{app.fullName}</h3>
            {app.manuallyAdded && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-400/10 text-violet-400 border border-violet-400/20 font-semibold flex-shrink-0">M</span>}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{app.currentRole}</p>
        </div>
        <Badge status={app.status} cfg={JOB_STATUS} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Position</p>
          <p className="text-xs font-medium text-zinc-300 capitalize">{app.position}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Experience</p>
          <p className="text-xs font-medium text-zinc-300">{app.experience} yrs</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Location</p>
          <p className="text-xs font-medium text-zinc-300">{app.location}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <span className="text-[10px] text-zinc-600">{fmt(app.submittedAt)}</span>
        <Eye className="w-3.5 h-3.5 text-zinc-700 group-hover:text-[#4AADCF] transition-colors" />
      </div>
    </div>
  );
}

function LPCard({ lp, onClick }: { lp: any; onClick: () => void }) {
  const isOverdue = lp.nextFollowUpDate && lp.nextFollowUpDate < Date.now();
  return (
    <div
      onClick={onClick}
      className={`group relative bg-[#0d1117] border rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:bg-[#111922] ${
        isOverdue ? "border-rose-400/30 hover:border-rose-400/50" : "border-white/[0.07] hover:border-[#4AADCF]/40"
      }`}
    >
      <div className={`absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity ${isOverdue ? "bg-gradient-to-r from-transparent via-rose-400 to-transparent" : "bg-gradient-to-r from-transparent via-[#4AADCF] to-transparent"}`} />

      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#4AADCF] transition-colors truncate">{lp.fullName}</h3>
          <p className="text-xs text-zinc-500 mt-0.5">{lp.organization ?? lp.email}</p>
        </div>
        <Badge status={lp.status} cfg={LP_STATUS} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-4">
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Type</p>
          <p className="text-xs font-medium text-zinc-300">{LP_TYPES[lp.investorType] ?? lp.investorType}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Commitment</p>
          <p className="text-xs font-medium text-emerald-400">{lp.commitmentAmount ?? "—"}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Last Contact</p>
          <p className="text-xs font-medium text-zinc-300">{fmtOpt(lp.lastContactDate)}</p>
        </div>
        <div>
          <p className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Follow-Up</p>
          <p className={`text-xs font-medium ${isOverdue ? "text-rose-400" : "text-zinc-300"}`}>{fmtOpt(lp.nextFollowUpDate)}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {lp.internalRating && <Pill color="amber">★ {lp.internalRating}/10</Pill>}
        {isOverdue && <Pill color="default">⚠ Overdue</Pill>}
        {lp.meetingCount != null && <Pill>{lp.meetingCount} meeting{lp.meetingCount !== 1 ? "s" : ""}</Pill>}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
        <span className="text-[10px] text-zinc-600">{fmtOpt(lp.addedAt)}</span>
        <Eye className="w-3.5 h-3.5 text-zinc-700 group-hover:text-[#4AADCF] transition-colors" />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW SHELL — tracker-inspired toolbar + card grid
// ═══════════════════════════════════════════════════════════════════════════════
function ViewShell({ title, subtitle, stats, statConfig, statusFilter, setStatusFilter, search, setSearch, searchPlaceholder, onAdd, addLabel, children }: {
  title: string; subtitle: string;
  stats?: Record<string, number>;
  statConfig: Record<string, any>;
  statusFilter: string; setStatusFilter: (s: string) => void;
  search: string; setSearch: (s: string) => void;
  searchPlaceholder: string;
  onAdd: () => void; addLabel: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Panel header */}
      <div className="px-4 sm:px-6 pt-5 pb-4 border-b border-white/[0.06] flex-shrink-0 space-y-4">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-white truncate">{title}</h1>
            <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>
          </div>
          <button
            onClick={onAdd}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{ background: "linear-gradient(135deg, #4AADCF 0%, #2e8aac 100%)", boxShadow: "0 4px 16px rgba(74,173,207,0.25)" }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{addLabel}</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Status filter tabs */}
        {stats && (
          <StatusTabs byStatus={stats} cfg={statConfig} filter={statusFilter} setFilter={setStatusFilter} />
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none transition-all border"
            style={{ background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)" }}
            onFocus={e => { e.target.style.borderColor = "rgba(74,173,207,0.45)"; e.target.style.boxShadow = "0 0 0 3px rgba(74,173,207,0.08)"; }}
            onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; e.target.style.boxShadow = "none"; }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card grid area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// VIEW COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════════
function StartupsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"startupApplications">) => void }) {
  const apps = useQuery(api.admin.listStartupApplications, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (apps ?? []).filter(a => !search ||
    a.companyName.toLowerCase().includes(search.toLowerCase()) ||
    a.founderName.toLowerCase().includes(search.toLowerCase()) ||
    a.founderEmail.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <ViewShell
        title="Startups" subtitle={`${stats?.startups.total ?? "—"} total · ${stats?.startups.recent ?? "—"} this week`}
        stats={stats?.startups.byStatus} statConfig={STARTUP_STATUS}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        search={search} setSearch={setSearch} searchPlaceholder="Search company, founder, email…"
        onAdd={() => setShowAdd(true)} addLabel="Add Startup"
      >
        {!apps && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {apps && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Building2 className="w-10 h-10 text-zinc-800" />
            <p className="text-zinc-600 text-sm">No startups found</p>
          </div>
        )}
        {apps && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(a => <StartupCard key={a._id} app={a} onClick={() => onSelect(a._id)} />)}
          </div>
        )}
      </ViewShell>
      {showAdd && <StartupModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function JobsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"jobApplications">) => void }) {
  const apps = useQuery(api.admin.listJobApplications, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (apps ?? []).filter(a => !search ||
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.position.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <ViewShell
        title="Job Applications" subtitle={`${stats?.jobs.total ?? "—"} total · ${stats?.jobs.recent ?? "—"} this week`}
        stats={stats?.jobs.byStatus} statConfig={JOB_STATUS}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        search={search} setSearch={setSearch} searchPlaceholder="Search name, email, position…"
        onAdd={() => setShowAdd(true)} addLabel="Add Applicant"
      >
        {!apps && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {apps && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Users className="w-10 h-10 text-zinc-800" />
            <p className="text-zinc-600 text-sm">No applicants found</p>
          </div>
        )}
        {apps && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(a => <JobCard key={a._id} app={a} onClick={() => onSelect(a._id)} />)}
          </div>
        )}
      </ViewShell>
      {showAdd && <JobModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

function LPsView({ statusFilter, setStatusFilter, search, setSearch, onSelect }: { statusFilter: string; setStatusFilter: (s: string) => void; search: string; setSearch: (s: string) => void; onSelect: (id: Id<"limitedPartners">) => void }) {
  const lps = useQuery(api.admin.listLimitedPartners, statusFilter ? { status: statusFilter as any } : {});
  const stats = useQuery(api.admin.getDashboardStats);
  const [showAdd, setShowAdd] = useState(false);
  const filtered = (lps ?? []).filter(a => !search ||
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    (a.organization ?? "").toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <ViewShell
        title="Limited Partners" subtitle={`${stats?.lps.total ?? "—"} total · ${stats?.lps.committed ?? "—"} committed+`}
        stats={stats?.lps.byStatus} statConfig={LP_STATUS}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        search={search} setSearch={setSearch} searchPlaceholder="Search name, org, email…"
        onAdd={() => setShowAdd(true)} addLabel="Add LP"
      >
        {!lps && <div className="flex items-center justify-center py-20"><Spinner /></div>}
        {lps && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Handshake className="w-10 h-10 text-zinc-800" />
            <p className="text-zinc-600 text-sm">No LPs yet — click <span className="text-[#4AADCF]">Add LP</span> to get started.</p>
          </div>
        )}
        {lps && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(a => <LPCard key={a._id} lp={a} onClick={() => onSelect(a._id)} />)}
          </div>
        )}
      </ViewShell>
      {showAdd && <LPModal onClose={() => setShowAdd(false)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
type Tab = "startups" | "lps" | "jobs";

const TABS: { key: Tab; icon: any; label: string; short: string; dot: string }[] = [
  { key: "startups", icon: Building2, label: "Startups",         short: "Startups", dot: "#4AADCF" },
  { key: "lps",      icon: Handshake, label: "Limited Partners", short: "LPs",      dot: "#34d399" },
  { key: "jobs",     icon: Users,     label: "Job Applications", short: "Jobs",     dot: "#a78bfa" },
];

export default function AdminPage() {
  const { user, isLoaded } = useUser();
  const [tab, setTab] = useState<Tab>("startups");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedJob, setSelectedJob] = useState<Id<"jobApplications"> | null>(null);
  const [selectedStartup, setSelectedStartup] = useState<Id<"startupApplications"> | null>(null);
  const [selectedLP, setSelectedLP] = useState<Id<"limitedPartners"> | null>(null);

  const switchTab = (t: Tab) => { setTab(t); setStatusFilter(""); setSearch(""); };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#4AADCF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#4AADCF]/10 border border-[#4AADCF]/20 flex items-center justify-center mx-auto mb-4">
              <div className="w-5 h-5 rounded-md bg-[#4AADCF]" />
            </div>
            <p className="text-xl font-bold text-white mb-1">MUSEDATA</p>
            <p className="text-zinc-500 text-sm">Admin Portal — sign in to continue</p>
          </div>
          <SignIn routing="hash" />
        </div>
      </div>
    );
  }

  const userEmail = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  if (!ADMIN_EMAILS.includes(userEmail)) {
    return (
      <div className="min-h-screen bg-[#080c10] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="text-zinc-500 text-sm max-w-sm"><span className="text-zinc-300">{userEmail}</span> is not authorized.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080c10] text-white flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── HEADER ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex-shrink-0" style={{ background: "rgba(8,12,16,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(74,173,207,0.15)", border: "1px solid rgba(74,173,207,0.3)" }}>
              <div className="w-3 h-3 rounded-sm bg-[#4AADCF]" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">MUSEDATA</span>
            <span className="text-xs text-zinc-600 hidden sm:inline">/ Admin</span>
          </div>

          {/* Tablet nav in header */}
          <nav className="hidden md:flex xl:hidden items-center gap-1 flex-1 justify-center">
            {TABS.map(({ key, icon: Icon, short, dot }) => (
              <button key={key} onClick={() => switchTab(key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                  tab === key ? "text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                }`}
                style={tab === key ? { background: "rgba(74,173,207,0.1)", border: "1px solid rgba(74,173,207,0.2)" } : { border: "1px solid transparent" }}
              >
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: tab === key ? dot : "rgba(255,255,255,0.2)" }} />
                <Icon className="w-3.5 h-3.5" />
                {short}
              </button>
            ))}
          </nav>

          {/* User info */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-zinc-300 leading-none">{user.firstName ?? "Admin"}</p>
              <p className="text-[10px] text-zinc-600 mt-0.5 truncate max-w-[140px]">{userEmail}</p>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#4AADCF]"
              style={{ background: "rgba(74,173,207,0.12)", border: "1px solid rgba(74,173,207,0.25)" }}>
              {user.firstName?.[0] ?? userEmail[0].toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* ── BODY ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">

        {/* Desktop sidebar */}
        <aside className="hidden xl:flex w-52 flex-col flex-shrink-0" style={{ background: "#0a0e14", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="px-3 py-5">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-3 mb-3">Navigation</p>
            <nav className="space-y-1">
              {TABS.map(({ key, icon: Icon, label, dot }) => (
                <button key={key} onClick={() => switchTab(key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    tab === key ? "text-white" : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
                  }`}
                  style={tab === key ? { background: "rgba(74,173,207,0.1)", border: "1px solid rgba(74,173,207,0.18)" } : { border: "1px solid transparent" }}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0 transition-all" style={{ background: tab === key ? dot : "rgba(255,255,255,0.15)" }} />
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden pb-16 md:pb-0">
          {tab === "startups" && <StartupsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedStartup} />}
          {tab === "lps" && <LPsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedLP} />}
          {tab === "jobs" && <JobsView statusFilter={statusFilter} setStatusFilter={setStatusFilter} search={search} setSearch={setSearch} onSelect={setSelectedJob} />}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex"
        style={{ background: "rgba(8,12,16,0.95)", backdropFilter: "blur(16px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {TABS.map(({ key, icon: Icon, short, dot }) => (
          <button key={key} onClick={() => switchTab(key)}
            className={`flex-1 flex flex-col items-center justify-center gap-1.5 py-3 transition-all ${tab === key ? "text-white" : "text-zinc-600"}`}>
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
    </div>
  );
}