"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";
import Link from "next/link";

type FormData = {
  fullName: string; email: string; institution: string;
  programYear: string; areaOfFocus: string;
  backgrounds: string[]; skills: string; executionStyle: string;
  hasPriorWork: string; projectSnapshot: string; primaryRole: string;
  outcomes: string[]; linkedinUrl: string; portfolioUrl: string; proofLinks: string;
  availWindow: string; timeCommitment: string; locationPref: string; commitSignal: string;
  teamPreference: string; collabStyle: string; interests: string[];
  postSprintIntent: string; openToSponsor: string; motivation: string;
};
type Errors = Partial<Record<keyof FormData, string>>;

const TOTAL_STEPS = 6;
const SECTIONS = [
  { label: "01", name: "About you" },
  { label: "02", name: "Skills & capabilities" },
  { label: "03", name: "Experience & build history" },
  { label: "04", name: "Availability & participation" },
  { label: "05", name: "Teaming & opportunities" },
  { label: "06", name: "Your interest" },
];
const initialForm: FormData = {
  fullName: "", email: "", institution: "", programYear: "", areaOfFocus: "",
  backgrounds: [], skills: "", executionStyle: "",
  hasPriorWork: "", projectSnapshot: "", primaryRole: "", outcomes: [],
  linkedinUrl: "", portfolioUrl: "", proofLinks: "",
  availWindow: "", timeCommitment: "", locationPref: "", commitSignal: "",
  teamPreference: "", collabStyle: "", interests: [], postSprintIntent: "",
  openToSponsor: "", motivation: "",
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const inputBase: React.CSSProperties = {
  width: "100%", padding: ".75rem 1rem",
  background: "var(--section-white)", border: "1px solid var(--divider)",
  color: "var(--h2-color)", fontSize: ".875rem", outline: "none",
  fontFamily: "inherit", transition: "border-color .15s",
};

function Field({ label, optional, hint, error, children }: {
  label: string; optional?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={{ display: "block", fontSize: ".7rem", fontWeight: 600, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--label-color)", marginBottom: ".55rem" }}>
        {label}{optional && <span style={{ marginLeft: ".5rem", fontWeight: 400, color: "var(--body-color)", textTransform: "none", letterSpacing: 0 }}>(optional)</span>}
      </label>
      {hint && <p style={{ fontSize: ".8125rem", color: "var(--body-color)", marginBottom: ".55rem", lineHeight: 1.6 }}>{hint}</p>}
      {children}
      {error && <p style={{ fontSize: ".7rem", color: "#c84b4b", marginTop: ".35rem", fontFamily: "monospace" }}>{error}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = "text" }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <input type={type} value={value} placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      style={inputBase}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--cta-accent)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--divider)")}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} placeholder={placeholder} rows={rows}
      onChange={e => onChange(e.target.value)}
      style={{ ...inputBase, resize: "vertical", lineHeight: 1.65 }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--cta-accent)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--divider)")}
    />
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ ...inputBase, padding: ".75rem 2.5rem .75rem 1rem", appearance: "none", cursor: "pointer", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 10 10'%3E%3Cpath fill='%237a9daa' d='M5 7L0 2h10z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 1rem center" }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--cta-accent)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--divider)")}
    >
      <option value="" disabled>Select…</option>
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

function RadioGroup({ name, value, onChange, options }: {
  name: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
      {options.map(opt => {
        const on = value === opt.value;
        return (
          <label key={opt.value} style={{ display: "flex", alignItems: "flex-start", gap: ".875rem", padding: ".875rem 1rem", border: `1px solid ${on ? "var(--card-border)" : "var(--divider)"}`, borderLeft: `3px solid ${on ? "var(--cta-accent)" : "transparent"}`, background: on ? "var(--section-bg)" : "var(--section-white)", cursor: "pointer", transition: "all .15s" }}>
            <input type="radio" name={name} value={opt.value} checked={on} onChange={() => onChange(opt.value)}
              style={{ marginTop: ".2rem", accentColor: "var(--cta-accent)", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontSize: ".875rem", color: on ? "var(--h2-color)" : "var(--body-color)", fontWeight: on ? 500 : 400, lineHeight: 1.5 }}>{opt.label}</span>
          </label>
        );
      })}
    </div>
  );
}

function CheckGroup({ name, value, onChange, options }: {
  name: string; value: string[]; onChange: (v: string[]) => void; options: string[];
}) {
  const toggle = (opt: string) => onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt]);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: ".375rem" }}>
      {options.map(opt => {
        const on = value.includes(opt);
        return (
          <label key={opt} style={{ display: "flex", alignItems: "flex-start", gap: ".875rem", padding: ".875rem 1rem", border: `1px solid ${on ? "var(--card-border)" : "var(--divider)"}`, borderLeft: `3px solid ${on ? "var(--cta-accent)" : "transparent"}`, background: on ? "var(--section-bg)" : "var(--section-white)", cursor: "pointer", transition: "all .15s" }}>
            <input type="checkbox" name={name} checked={on} onChange={() => toggle(opt)}
              style={{ marginTop: ".2rem", accentColor: "var(--cta-accent)", cursor: "pointer", flexShrink: 0 }} />
            <span style={{ fontSize: ".875rem", color: on ? "var(--h2-color)" : "var(--body-color)", fontWeight: on ? 500 : 400, lineHeight: 1.5 }}>{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentRegistrationPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitParticipant = useMutation(api.sprintParticipants.submitParticipant);

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }, []);

  function validate() {
    const e: Errors = {};
    if (step === 0) {
      if (!form.fullName.trim()) e.fullName = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.institution.trim()) e.institution = "Required";
      if (!form.programYear) e.programYear = "Required";
      if (!form.areaOfFocus.trim()) e.areaOfFocus = "Required";
    } else if (step === 1) {
      if (!form.backgrounds.length) e.backgrounds = "Select at least one";
      if (!form.skills.trim()) e.skills = "Required";
      if (!form.executionStyle) e.executionStyle = "Select one";
    } else if (step === 2) {
      if (!form.hasPriorWork) e.hasPriorWork = "Select one";
      if (!form.projectSnapshot.trim()) e.projectSnapshot = "Required";
      if (!form.primaryRole) e.primaryRole = "Select one";
    } else if (step === 3) {
      if (!form.availWindow) e.availWindow = "Select one";
      if (!form.timeCommitment) e.timeCommitment = "Select one";
      if (!form.commitSignal) e.commitSignal = "Select one";
    } else if (step === 4) {
      if (!form.teamPreference) e.teamPreference = "Select one";
      if (!form.collabStyle) e.collabStyle = "Select one";
      if (!form.interests.length) e.interests = "Select at least one";
      if (!form.postSprintIntent) e.postSprintIntent = "Select one";
    } else if (step === 5) {
      if (!form.motivation.trim()) e.motivation = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() { if (validate()) { setStep(s => s + 1); window.scrollTo({ top: 0, behavior: "smooth" }); } }
  function prev() { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }

  async function handleSubmit() {
    if (!validate()) return;
    setSubmitting(true); setSubmitError("");
    try {
      await submitParticipant({
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
        motivation: form.motivation,
      });
      setSubmitted(true);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally { setSubmitting(false); }
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  return (
    <>
      <style>{`
        :root{
          --nav-h:82px;--deep:#092e42;--bright:#39a2ca;--white:#ffffff;
          --ff:'Inter',-apple-system,sans-serif;
          --hero-bg:#092e42;--hero-label:#5997b0;
          --section-bg:#f1f7fa;--section-white:#ffffff;
          --card-border:#5e96aa;--label-color:#7a9daa;
          --h2-color:#0d2b3a;--body-color:#3a5a6a;
          --divider:#d4e4eb;--cta-accent:#39a2ca;
        }
        .page-header{background:var(--deep);padding:calc(var(--nav-h) + 5rem) 3rem 5rem;position:relative;overflow:hidden;}
        .page-header::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 85% 20%,rgba(59,163,203,.1),transparent 55%),radial-gradient(ellipse 50% 70% at 10% 80%,rgba(42,127,160,.07),transparent 55%);pointer-events:none;}
        .page-header-inner{max-width:1440px;margin:0 auto;position:relative;z-index:1;}
        .ph-tag{font-family:'Inter',sans-serif;font-size:.7rem;font-weight:500;letter-spacing:.22em;text-transform:uppercase;color:var(--bright);display:inline-flex;align-items:center;gap:.8rem;margin-bottom:1.6rem;opacity:0;animation:rise .6s .1s ease forwards;}
        .ph-tag::before{content:'';width:28px;height:1px;background:var(--bright);}
        .ph-h{font-family:'Inter',sans-serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:300;color:var(--white);line-height:1.12;letter-spacing:-.03em;opacity:0;animation:rise .8s .2s ease forwards;max-width:820px;}
        .ph-h em{font-style:normal;font-weight:700;color:var(--bright);}
        .ph-sub{margin-top:1.8rem;font-family:'Inter',sans-serif;font-size:.9375rem;font-weight:400;line-height:1.75;color:rgba(255,255,255,.45);max-width:480px;opacity:0;animation:rise .8s .35s ease forwards;}
        .ph-pills{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:2rem;opacity:0;animation:rise .8s .45s ease forwards;}
        .ph-pill{font-size:.633rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.5);border:1px solid rgba(255,255,255,.12);padding:.4rem .9rem;}
        @keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}

        .sreg-body{max-width:860px;margin:0 auto;padding:4rem 3rem 6rem;}
        @media(max-width:900px){.page-header{padding:calc(var(--nav-h) + 3rem) 2rem 3rem;}.sreg-body{padding:2.5rem 1.5rem 4rem;}}
        @media(max-width:560px){.page-header{padding:calc(var(--nav-h) + 2rem) 1.25rem 2.5rem;}.sreg-body{padding:2rem 1rem 3rem;}.grid2{grid-template-columns:1fr!important;}}

        .step-rail{display:grid;grid-template-columns:repeat(6,1fr);gap:0;margin-bottom:2.5rem;}
        .step-rail-item{padding:.6rem .25rem;text-align:center;font-size:.567rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--label-color);border:1px solid var(--divider);border-right:none;background:var(--section-white);transition:background .2s,color .2s,border-color .2s;}
        .step-rail-item:last-child{border-right:1px solid var(--divider);}
        .step-rail-item.active{background:var(--deep);color:#fff;border-color:var(--deep);}
        .step-rail-item.done{background:var(--section-bg);color:var(--card-border);border-color:var(--divider);}

        .prog-wrap{margin-bottom:2rem;}
        .prog-bar{height:1px;background:var(--divider);position:relative;}
        .prog-fill{height:100%;background:var(--cta-accent);transition:width .5s cubic-bezier(.16,1,.3,1);position:relative;}
        .prog-fill::after{content:'';position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:50%;background:var(--cta-accent);}
        .prog-meta{display:flex;justify-content:space-between;align-items:center;margin-top:.75rem;}
        .prog-step{font-size:.633rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--cta-accent);}
        .prog-name{font-size:.633rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--label-color);}

        .form-card{background:var(--section-white);border:1px solid var(--divider);border-top:3px solid var(--cta-accent);padding:2.5rem;}
        @media(max-width:560px){.form-card{padding:1.5rem;}}

        .sec-h{font-family:'Inter',sans-serif;font-size:1.1rem;font-weight:400;color:var(--h2-color);margin:0 0 2rem;letter-spacing:-.02em;display:flex;align-items:center;gap:.875rem;}
        .sec-h::before{content:'';display:block;width:3px;height:1.1em;background:var(--cta-accent);flex-shrink:0;}

        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}
        .link-stack{display:flex;flex-direction:column;gap:.5rem;}

        .divider-label{display:flex;align-items:center;gap:1rem;margin:2rem 0 1.5rem;}
        .divider-label::before,.divider-label::after{content:'';flex:1;height:1px;background:var(--divider);}
        .divider-label span{font-size:.6rem;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--label-color);white-space:nowrap;}

        .form-nav{display:flex;justify-content:space-between;align-items:center;margin-top:2.5rem;padding-top:2rem;border-top:1px solid var(--divider);}
        .btn-back{display:inline-flex;align-items:center;gap:.5rem;font-size:.7rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--body-color);background:none;border:1px solid var(--divider);padding:.75rem 1.25rem;cursor:pointer;font-family:inherit;transition:border-color .15s,color .15s;}
        .btn-back:hover{border-color:var(--card-border);color:var(--h2-color);}
        .btn-next{display:inline-flex;align-items:center;gap:.875rem;font-size:.7rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:#fff;background:var(--cta-accent);border:none;padding:.875rem 2rem;cursor:pointer;font-family:inherit;transition:background .2s,gap .2s;}
        .btn-next:hover:not(:disabled){background:#2b8fb5;gap:1.25rem;}
        .btn-next:disabled{opacity:.4;cursor:not-allowed;}
        .arr{display:inline-block;width:14px;height:1px;background:currentColor;position:relative;flex-shrink:0;}
        .arr::after{content:'';position:absolute;right:-1px;top:-3px;border:3px solid transparent;border-left:5px solid currentColor;}

        .err-box{padding:.875rem 1rem;background:#fef2f2;border:1px solid #fca5a5;border-left:3px solid #e05252;color:#991b1b;font-size:.8125rem;margin-bottom:1.5rem;}
        .crosslink{text-align:center;margin-top:2rem;font-size:.8125rem;color:var(--label-color);}
        .crosslink a{color:var(--cta-accent);text-decoration:none;font-weight:500;}
        .crosslink a:hover{text-decoration:underline;}

        /* success */
        .success-wrap{min-height:100vh;background:var(--section-bg);display:flex;align-items:center;justify-content:center;padding:2rem;}
        .success-card{max-width:520px;width:100%;background:var(--section-white);border:1px solid var(--divider);border-top:3px solid var(--cta-accent);padding:4rem 3rem;text-align:center;}
        .success-icon{width:52px;height:52px;border-radius:50%;background:var(--section-bg);border:1px solid var(--divider);display:flex;align-items:center;justify-content:center;margin:0 auto 2rem;color:var(--cta-accent);font-size:1.2rem;}
        .success-tag{font-size:.633rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--hero-label);margin-bottom:1rem;}
        .success-h{font-family:'Inter',sans-serif;font-size:1.6rem;font-weight:300;color:var(--h2-color);margin-bottom:1rem;letter-spacing:-.02em;}
        .success-p{font-size:.875rem;color:var(--body-color);line-height:1.75;margin-bottom:2rem;}
        .success-link{display:inline-flex;align-items:center;gap:.75rem;font-size:.7rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--hero-label);text-decoration:none;}
      `}</style>

      <UnifiedNavbar />

      {submitted ? (
        <div className="success-wrap">
          <div className="success-card">
            <div className="success-icon">✓</div>
            <div className="success-tag">Application received</div>
            <h2 className="success-h">Thanks for applying.</h2>
            <p className="success-p">We've received your application for the Harvard AI Build Sprint. If you're a strong fit, we'll be in touch with next steps shortly.</p>
            <Link href="/" className="success-link">← Back to home</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="page-header">
            <div className="page-header-inner">
              <div className="ph-tag">Harvard AI Build Sprint</div>
              <h1 className="ph-h">Apply as a <em>Participant</em></h1>
              <p className="ph-sub">Join a highly selective cohort building real AI products in a 24-hour sprint. Execution over ideas. ~5% acceptance rate.</p>
              <div className="ph-pills">
                {["Remote", "24 hours", "~5% acceptance", "AI & Enterprise", "May–June 2025"].map(p => (
                  <span key={p} className="ph-pill">{p}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "var(--section-bg)" }}>
            <div className="sreg-body">

              <div className="step-rail">
                {SECTIONS.map((s, i) => (
                  <div key={s.label} className={`step-rail-item ${i === step ? "active" : i < step ? "done" : ""}`}>
                    {s.label}
                  </div>
                ))}
              </div>

              <div className="prog-wrap">
                <div className="prog-bar">
                  <div className="prog-fill" style={{ width: `${progress}%` }} />
                </div>
                <div className="prog-meta">
                  <span className="prog-step">Step {step + 1} of {TOTAL_STEPS}</span>
                  <span className="prog-name">{SECTIONS[step].name}</span>
                </div>
              </div>

              <div className="form-card">

                {step === 0 && (
                  <div>
                    <h2 className="sec-h">Tell us about yourself</h2>
                    <Field label="Full name *" error={errors.fullName}>
                      <Input value={form.fullName} onChange={v => set("fullName", v)} placeholder="Your full name" />
                    </Field>
                    <Field label="Email address *" hint="All decisions will be sent here. Use one you check regularly." error={errors.email}>
                      <Input value={form.email} onChange={v => set("email", v)} placeholder="you@example.com" type="email" />
                    </Field>
                    <Field label="Current institution *" error={errors.institution}>
                      <Input value={form.institution} onChange={v => set("institution", v)} placeholder="University or organization you're affiliated with" />
                    </Field>
                    <div className="grid2">
                      <Field label="Program & year *" error={errors.programYear}>
                        <Select value={form.programYear} onChange={v => set("programYear", v)} options={["Undergraduate, Freshman","Undergraduate, Sophomore","Undergraduate, Junior","Undergraduate, Senior","Graduate (Master's / PhD)","Not currently enrolled"]} />
                      </Field>
                      <Field label="Area of focus *" error={errors.areaOfFocus}>
                        <Input value={form.areaOfFocus} onChange={v => set("areaOfFocus", v)} placeholder="e.g. CS, Economics, Design" />
                      </Field>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="sec-h">Skills & capabilities</h2>
                    <Field label="Primary background *" hint="Select all that apply" error={errors.backgrounds}>
                      <CheckGroup name="bg" value={form.backgrounds} onChange={v => set("backgrounds", v)} options={["Engineering / Computer Science","Product Management","Design (UI/UX, Visual, Interaction)","Business & Strategy","Research (AI, Data, Academic)","Other"]} />
                    </Field>
                    <Field label="Core strengths & technical depth *" hint="Tools, technologies, or domains you have meaningful experience in" error={errors.skills}>
                      <Textarea value={form.skills} onChange={v => set("skills", v)} placeholder="e.g. Python, React, LLMs, APIs, Figma, data modeling, GTM strategy…" />
                    </Field>
                    <Field label="Execution readiness *" hint="Which best describes your approach in a fast-paced build?" error={errors.executionStyle}>
                      <RadioGroup name="exec" value={form.executionStyle} onChange={v => set("executionStyle", v)} options={[
                        {value:"I can independently build and ship end-to-end",label:"I can independently build and ship end-to-end"},
                        {value:"I specialize deeply in one area",label:"I specialize deeply in one area (engineering, design, product, etc.)"},
                        {value:"I thrive in collaborative, cross-functional teams",label:"I thrive in collaborative, cross-functional teams"},
                        {value:"I'm early but highly motivated and fast-learning",label:"I'm early but highly motivated and fast-learning"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="sec-h">Experience & build history</h2>
                    <Field label="Have you previously worked on a project, startup, or hackathon? *" error={errors.hasPriorWork}>
                      <RadioGroup name="prior" value={form.hasPriorWork} onChange={v => set("hasPriorWork", v)} options={[{value:"Yes",label:"Yes"},{value:"No",label:"No"}]} />
                    </Field>
                    <Field label="Project snapshot *" hint="What did you build, your role, and the outcome?" error={errors.projectSnapshot}>
                      <Textarea value={form.projectSnapshot} onChange={v => set("projectSnapshot", v)} placeholder="e.g. Built a React + OpenAI app that summarizes legal docs, led engineering, shipped MVP in 2 weeks with 50 beta users" rows={4} />
                    </Field>
                    <Field label="Your primary contribution *" error={errors.primaryRole}>
                      <RadioGroup name="role" value={form.primaryRole} onChange={v => set("primaryRole", v)} options={[
                        {value:"Built core product / engineering",label:"Built core product / engineering"},
                        {value:"Designed user experience / interface",label:"Designed user experience / interface"},
                        {value:"Led product / strategy",label:"Led product / strategy"},
                        {value:"Worked on data / AI / research",label:"Worked on data / AI / research"},
                        {value:"Contributed across multiple areas",label:"Contributed across multiple areas"},
                      ]} />
                    </Field>
                    <Field label="Outcome & traction" optional hint="Select all that apply">
                      <CheckGroup name="outcome" value={form.outcomes} onChange={v => set("outcomes", v)} options={["Shipped a working product / prototype","Acquired users or early traction","Generated revenue","Won or placed in a hackathon","Continued beyond initial build phase","Open-sourced or publicly shared","None yet"]} />
                    </Field>
                    <div className="divider-label"><span>Links & proof of work (optional but encouraged)</span></div>
                    <div className="link-stack">
                      <Input value={form.linkedinUrl} onChange={v => set("linkedinUrl", v)} placeholder="LinkedIn profile URL" />
                      <Input value={form.portfolioUrl} onChange={v => set("portfolioUrl", v)} placeholder="GitHub / Portfolio / Personal website" />
                      <Input value={form.proofLinks} onChange={v => set("proofLinks", v)} placeholder="Other links — demo, deck, etc." />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="sec-h">Availability & participation</h2>
                    <Field label="Availability window *" hint="Which general timeframe works best?" error={errors.availWindow}>
                      <RadioGroup name="avail" value={form.availWindow} onChange={v => set("availWindow", v)} options={[
                        {value:"Early May",label:"Early May"},{value:"Mid May",label:"Mid May"},
                        {value:"Late May",label:"Late May"},{value:"June",label:"June"},
                        {value:"July or later",label:"July or later"},{value:"Flexible",label:"Flexible"},
                      ]} />
                    </Field>
                    <Field label="Time commitment *" error={errors.timeCommitment}>
                      <RadioGroup name="commitment" value={form.timeCommitment} onChange={v => set("timeCommitment", v)} options={[
                        {value:"Fully available",label:"Fully available — can prioritize this as primary focus"},
                        {value:"Partially available",label:"Partially available — balancing with other commitments"},
                        {value:"Limited availability",label:"Limited availability"},
                      ]} />
                    </Field>
                    <Field label="Location" optional hint="Are you local or able to attend in person?">
                      <RadioGroup name="location" value={form.locationPref} onChange={v => set("locationPref", v)} options={[
                        {value:"Yes, based locally",label:"Yes, based locally"},
                        {value:"Yes, willing to travel",label:"Yes, willing to travel"},
                        {value:"No",label:"No"},
                      ]} />
                    </Field>
                    <Field label="Commitment signal *" hint="If selected, how likely are you to fully participate?" error={errors.commitSignal}>
                      <RadioGroup name="commit_signal" value={form.commitSignal} onChange={v => set("commitSignal", v)} options={[
                        {value:"Fully committed",label:"Fully committed — I will prioritize and complete the sprint"},
                        {value:"Likely",label:"Likely, barring unforeseen conflicts"},
                        {value:"Unsure",label:"Unsure"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="sec-h">Teaming & opportunities</h2>
                    <Field label="Team preference *" error={errors.teamPreference}>
                      <RadioGroup name="team_pref" value={form.teamPreference} onChange={v => set("teamPreference", v)} options={[
                        {value:"Solo",label:"Solo"},{value:"With an existing team",label:"With an existing team"},
                        {value:"Open to joining a team",label:"Open to joining a team"},
                      ]} />
                    </Field>
                    <Field label="Collaboration style *" error={errors.collabStyle}>
                      <RadioGroup name="collab" value={form.collabStyle} onChange={v => set("collabStyle", v)} options={[
                        {value:"I lead and drive execution",label:"I lead and drive execution"},
                        {value:"I contribute deeply in a specific role",label:"I contribute deeply in a specific role"},
                        {value:"I'm flexible and adapt based on team needs",label:"I'm flexible and adapt based on team needs"},
                      ]} />
                    </Field>
                    <Field label="What are you most interested in gaining? *" hint="Select all that apply" error={errors.interests}>
                      <CheckGroup name="interests" value={form.interests} onChange={v => set("interests", v)} options={["Building and launching a working product","Collaborating with high-quality peers","Networking with founders, engineers, and sponsors","Exploring recruiting or job opportunities","Access to mentorship, APIs, and technical resources"]} />
                    </Field>
                    <Field label="Post-sprint intent *" hint="If you build something promising, what would you want to do next?" error={errors.postSprintIntent}>
                      <RadioGroup name="post_sprint" value={form.postSprintIntent} onChange={v => set("postSprintIntent", v)} options={[
                        {value:"Continue building it into a startup",label:"Continue building it into a startup"},
                        {value:"Further develop it as a side project",label:"Further develop it as a side project"},
                        {value:"Open-source or share publicly",label:"Open-source or share publicly"},
                        {value:"Transition into other opportunities",label:"Transition into other opportunities"},
                        {value:"Not sure yet",label:"Not sure yet"},
                      ]} />
                    </Field>
                    <Field label="Open to sponsor engagement?" optional>
                      <RadioGroup name="sponsor" value={form.openToSponsor} onChange={v => set("openToSponsor", v)} options={[
                        {value:"Yes",label:"Yes"},{value:"No",label:"No"},{value:"Depends",label:"Depends"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="sec-h">Your interest</h2>
                    <Field label="What draws you to this sprint? *" hint="Tell us what you hope to build, learn, or achieve. Be specific — what would success look like?" error={errors.motivation}>
                      <Textarea value={form.motivation} onChange={v => set("motivation", v)} placeholder="What excites you about this? What would you build? What does success look like for you?" rows={9} />
                    </Field>
                    {submitError && <div className="err-box">{submitError}</div>}
                  </div>
                )}

              </div>

              <div className="form-nav">
                {step > 0
                  ? <button className="btn-back" onClick={prev}>← Back</button>
                  : <span />}
                {step < TOTAL_STEPS - 1
                  ? <button className="btn-next" onClick={next}>Continue <span className="arr" /></button>
                  : <button className="btn-next" onClick={handleSubmit} disabled={submitting}>
                      {submitting ? "Submitting…" : <><span>Submit application</span><span className="arr" /></>}
                    </button>}
              </div>

              <p className="crosslink">
                Are you an organization?{" "}
                <Link href="/sponsor-form">Apply as a sponsor instead →</Link>
              </p>

            </div>
          </div>
        </>
      )}
    </>
  );
}