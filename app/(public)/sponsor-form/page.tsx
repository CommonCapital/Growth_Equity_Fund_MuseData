"use client";

import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";
import Link from "next/link";

type FormData = {
  companyName: string; contactName: string; contactTitle: string;
  email: string; phone: string; website: string; linkedin: string;
  orgType: string; orgStage: string;
  involvementTypes: string[]; sponsorLevel: string; anchorPartner: string;
  primaryGoals: string[]; successDefinition: string;
  relevantAreas: string[]; participantEngagement: string[];
  preferredTimeframe: string; participationFormat: string; openToExpansion: string;
  isDecisionMaker: string; otherApprovers: string; decisionTimeline: string;
  additionalNotes: string; referralSource: string;
};
type Errors = Partial<Record<keyof FormData, string>>;

const TOTAL_STEPS = 9;
const SECTIONS = [
  { label: "01", name: "Organization info" },
  { label: "02", name: "Organization type" },
  { label: "03", name: "Sponsorship interest" },
  { label: "04", name: "Objectives" },
  { label: "05", name: "Event fit" },
  { label: "06", name: "Timing & format" },
  { label: "07", name: "Internal process" },
  { label: "08", name: "Additional notes" },
  { label: "09", name: "Source" },
];
const initialForm: FormData = {
  companyName: "", contactName: "", contactTitle: "", email: "", phone: "", website: "", linkedin: "",
  orgType: "", orgStage: "",
  involvementTypes: [], sponsorLevel: "", anchorPartner: "",
  primaryGoals: [], successDefinition: "",
  relevantAreas: [], participantEngagement: [],
  preferredTimeframe: "", participationFormat: "", openToExpansion: "",
  isDecisionMaker: "", otherApprovers: "", decisionTimeline: "",
  additionalNotes: "", referralSource: "",
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
    <input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)}
      style={inputBase}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--cta-accent)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--divider)")}
    />
  );
}

function Textarea({ value, onChange, placeholder, rows = 5 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}) {
  return (
    <textarea value={value} placeholder={placeholder} rows={rows} onChange={e => onChange(e.target.value)}
      style={{ ...inputBase, resize: "vertical", lineHeight: 1.65 }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--cta-accent)")}
      onBlur={e => (e.currentTarget.style.borderColor = "var(--divider)")}
    />
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
export default function SponsorFormPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const submitSponsor = useMutation(api.sprintSponsors.submitSponsor);

  const set = useCallback(<K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  }, []);

  function validate() {
    const e: Errors = {};
    if (step === 0) {
      if (!form.companyName.trim()) e.companyName = "Required";
      if (!form.contactName.trim()) e.contactName = "Required";
      if (!form.contactTitle.trim()) e.contactTitle = "Required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
      if (!form.website.trim()) e.website = "Required";
    } else if (step === 1) {
      if (!form.orgType) e.orgType = "Select one";
      if (!form.orgStage) e.orgStage = "Select one";
    } else if (step === 2) {
      if (!form.involvementTypes.length) e.involvementTypes = "Select at least one";
      if (!form.sponsorLevel) e.sponsorLevel = "Select one";
      if (!form.anchorPartner) e.anchorPartner = "Select one";
    } else if (step === 3) {
      if (!form.primaryGoals.length) e.primaryGoals = "Select at least one";
      if (!form.successDefinition.trim()) e.successDefinition = "Required";
    } else if (step === 4) {
      if (!form.relevantAreas.length) e.relevantAreas = "Select at least one";
      if (!form.participantEngagement.length) e.participantEngagement = "Select at least one";
    } else if (step === 5) {
      if (!form.preferredTimeframe) e.preferredTimeframe = "Select one";
      if (!form.participationFormat) e.participationFormat = "Select one";
      if (!form.openToExpansion) e.openToExpansion = "Select one";
    } else if (step === 6) {
      if (!form.isDecisionMaker) e.isDecisionMaker = "Select one";
      if (!form.decisionTimeline) e.decisionTimeline = "Select one";
    } else if (step === 8) {
      if (!form.referralSource) e.referralSource = "Select one";
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
      await submitSponsor({
        companyName: form.companyName, contactName: form.contactName, contactTitle: form.contactTitle,
        email: form.email, phone: form.phone || undefined, website: form.website,
        linkedin: form.linkedin || undefined, orgType: form.orgType, orgStage: form.orgStage,
        involvementTypes: form.involvementTypes, sponsorLevel: form.sponsorLevel, anchorPartner: form.anchorPartner,
        primaryGoals: form.primaryGoals, successDefinition: form.successDefinition,
        relevantAreas: form.relevantAreas, participantEngagement: form.participantEngagement,
        preferredTimeframe: form.preferredTimeframe, participationFormat: form.participationFormat,
        openToExpansion: form.openToExpansion, isDecisionMaker: form.isDecisionMaker,
        otherApprovers: form.otherApprovers || undefined, decisionTimeline: form.decisionTimeline,
        additionalNotes: form.additionalNotes || undefined, referralSource: form.referralSource,
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

        .spon-body{max-width:860px;margin:0 auto;padding:4rem 3rem 6rem;}
        @media(max-width:900px){.page-header{padding:calc(var(--nav-h) + 3rem) 2rem 3rem;}.spon-body{padding:2.5rem 1.5rem 4rem;}}
        @media(max-width:560px){.page-header{padding:calc(var(--nav-h) + 2rem) 1.25rem 2.5rem;}.spon-body{padding:2rem 1rem 3rem;}.grid2{grid-template-columns:1fr!important;}}

        .step-rail{display:grid;grid-template-columns:repeat(9,1fr);gap:0;margin-bottom:2.5rem;overflow:hidden;}
        .step-rail-item{padding:.6rem .15rem;text-align:center;font-size:.52rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--label-color);border:1px solid var(--divider);border-right:none;background:var(--section-white);transition:background .2s,color .2s;}
        .step-rail-item:last-child{border-right:1px solid var(--divider);}
        .step-rail-item.active{background:var(--deep);color:#fff;border-color:var(--deep);}
        .step-rail-item.done{background:var(--section-bg);color:var(--card-border);}

        .prog-wrap{margin-bottom:2rem;}
        .prog-bar{height:1px;background:var(--divider);position:relative;}
        .prog-fill{height:100%;background:var(--cta-accent);transition:width .5s cubic-bezier(.16,1,.3,1);position:relative;}
        .prog-fill::after{content:'';position:absolute;right:-3px;top:-3px;width:7px;height:7px;border-radius:50%;background:var(--cta-accent);}
        .prog-meta{display:flex;justify-content:space-between;margin-top:.75rem;}
        .prog-step{font-size:.633rem;font-weight:700;letter-spacing:.24em;text-transform:uppercase;color:var(--cta-accent);}
        .prog-name{font-size:.633rem;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:var(--label-color);}

        .form-card{background:var(--section-white);border:1px solid var(--divider);border-top:3px solid var(--cta-accent);padding:2.5rem;}
        @media(max-width:560px){.form-card{padding:1.5rem;}}

        .sec-h{font-family:'Inter',sans-serif;font-size:1.1rem;font-weight:400;color:var(--h2-color);margin:0 0 2rem;letter-spacing:-.02em;display:flex;align-items:center;gap:.875rem;}
        .sec-h::before{content:'';display:block;width:3px;height:1.1em;background:var(--cta-accent);flex-shrink:0;}

        .grid2{display:grid;grid-template-columns:1fr 1fr;gap:1rem;}

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

        .success-wrap{min-height:100vh;background:var(--section-bg);display:flex;align-items:center;justify-content:center;padding:2rem;}
        .success-card{max-width:540px;width:100%;background:var(--section-white);border:1px solid var(--divider);border-top:3px solid var(--cta-accent);padding:4rem 3rem;text-align:center;}
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
            <div className="success-tag">Inquiry received</div>
            <h2 className="success-h">Thank you for your interest.</h2>
            <p className="success-p">We've received your sponsorship inquiry for the Harvard AI Build Sprint. Our team will review your submission and follow up shortly to discuss partnership opportunities.</p>
            <Link href="/" className="success-link">← Back to home</Link>
          </div>
        </div>
      ) : (
        <>
          <div className="page-header">
            <div className="page-header-inner">
              <div className="ph-tag">Harvard AI Build Sprint</div>
              <h1 className="ph-h">Become a <em>Sponsor</em></h1>
              <p className="ph-sub">Partner with us to connect with the next generation of AI builders, founders, and technical talent — all in one high-signal environment.</p>
              <div className="ph-pills">
                {["~5% acceptance rate", "AI & Enterprise", "Recruit top talent", "Brand visibility", "May–June 2025"].map(p => (
                  <span key={p} className="ph-pill">{p}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: "var(--section-bg)" }}>
            <div className="spon-body">

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
                    <h2 className="sec-h">Organization information</h2>
                    <Field label="Company / Organization name *" error={errors.companyName}>
                      <Input value={form.companyName} onChange={v => set("companyName", v)} placeholder="Your company or organization name" />
                    </Field>
                    <div className="grid2">
                      <Field label="Primary contact name *" error={errors.contactName}>
                        <Input value={form.contactName} onChange={v => set("contactName", v)} placeholder="Full name" />
                      </Field>
                      <Field label="Title *" error={errors.contactTitle}>
                        <Input value={form.contactTitle} onChange={v => set("contactTitle", v)} placeholder="e.g. VP of Partnerships" />
                      </Field>
                    </div>
                    <Field label="Email address *" error={errors.email}>
                      <Input value={form.email} onChange={v => set("email", v)} placeholder="you@company.com" type="email" />
                    </Field>
                    <div className="grid2">
                      <Field label="Phone number" optional>
                        <Input value={form.phone} onChange={v => set("phone", v)} placeholder="+1 (555) 000-0000" type="tel" />
                      </Field>
                      <Field label="LinkedIn profile" optional>
                        <Input value={form.linkedin} onChange={v => set("linkedin", v)} placeholder="linkedin.com/in/…" />
                      </Field>
                    </div>
                    <Field label="Company website *" error={errors.website}>
                      <Input value={form.website} onChange={v => set("website", v)} placeholder="https://yourcompany.com" />
                    </Field>
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="sec-h">Organization type</h2>
                    <Field label="What best describes your organization? *" error={errors.orgType}>
                      <RadioGroup name="orgType" value={form.orgType} onChange={v => set("orgType", v)} options={[
                        {value:"AI company",label:"AI company"},
                        {value:"Enterprise software company",label:"Enterprise software company"},
                        {value:"Venture capital / investment firm",label:"Venture capital / investment firm"},
                        {value:"Infrastructure / developer tools",label:"Infrastructure / developer tools"},
                        {value:"Talent / recruiting platform",label:"Talent / recruiting platform"},
                        {value:"University / research institution",label:"University / research institution"},
                        {value:"Community / ecosystem partner",label:"Community / ecosystem partner"},
                        {value:"Other",label:"Other"},
                      ]} />
                    </Field>
                    <Field label="Which stage best describes your organization? *" error={errors.orgStage}>
                      <RadioGroup name="orgStage" value={form.orgStage} onChange={v => set("orgStage", v)} options={[
                        {value:"Startup",label:"Startup"},
                        {value:"Growth-stage company",label:"Growth-stage company"},
                        {value:"Public company",label:"Public company"},
                        {value:"Investment firm",label:"Investment firm"},
                        {value:"Nonprofit / university",label:"Nonprofit / university"},
                        {value:"Other",label:"Other"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="sec-h">Sponsorship interest</h2>
                    <Field label="Type of involvement *" hint="Select all that apply" error={errors.involvementTypes}>
                      <CheckGroup name="involvement" value={form.involvementTypes} onChange={v => set("involvementTypes", v)} options={["Financial sponsorship","Brand presence / logo placement","Technical mentorship","Judges","Recruiting / talent access","Product credits / tools for participants","Speaking / panel participation","Community partnership","Other"]} />
                    </Field>
                    <Field label="Sponsorship level *" error={errors.sponsorLevel}>
                      <RadioGroup name="sponsorLevel" value={form.sponsorLevel} onChange={v => set("sponsorLevel", v)} options={[
                        {value:"$10,000+",label:"$10,000+"},
                        {value:"$25,000+",label:"$25,000+"},
                        {value:"$50,000+",label:"$50,000+"},
                        {value:"Strategic / custom partnership",label:"Strategic / custom partnership"},
                        {value:"Still evaluating",label:"Still evaluating"},
                      ]} />
                    </Field>
                    <Field label="Open to being an anchor partner? *" error={errors.anchorPartner}>
                      <RadioGroup name="anchorPartner" value={form.anchorPartner} onChange={v => set("anchorPartner", v)} options={[
                        {value:"Yes",label:"Yes"},
                        {value:"No",label:"No"},
                        {value:"Possibly, depending on structure",label:"Possibly, depending on structure"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="sec-h">Objectives</h2>
                    <Field label="Primary goals for participating *" hint="Select all that apply" error={errors.primaryGoals}>
                      <CheckGroup name="goals" value={form.primaryGoals} onChange={v => set("primaryGoals", v)} options={["Brand visibility","Access to technical talent","Recruiting","Product adoption / developer usage","Relationship building with founders and operators","Ecosystem positioning","Supporting the AI community","Other"]} />
                    </Field>
                    <Field label="What would make this partnership successful for your team? *" error={errors.successDefinition}>
                      <Textarea value={form.successDefinition} onChange={v => set("successDefinition", v)} placeholder="Describe what a successful outcome looks like for your organization…" rows={6} />
                    </Field>
                  </div>
                )}

                {step === 4 && (
                  <div>
                    <h2 className="sec-h">Event fit</h2>
                    <Field label="Which areas are most relevant to your organization? *" hint="Select all that apply" error={errors.relevantAreas}>
                      <CheckGroup name="areas" value={form.relevantAreas} onChange={v => set("relevantAreas", v)} options={["Applied AI","Enterprise software","Workflow automation","Data infrastructure","Developer tools","Research / technical exploration","Company formation / startups","Recruiting","Other"]} />
                    </Field>
                    <Field label="How would your team engage directly with participants? *" hint="Select all that apply" error={errors.participantEngagement}>
                      <CheckGroup name="engagement" value={form.participantEngagement} onChange={v => set("participantEngagement", v)} options={["Hosting a challenge or prompt","Providing mentors","Providing judges","Meeting participants for recruiting","Offering product/API credits","Showcasing tools or demos","Not sure yet"]} />
                    </Field>
                  </div>
                )}

                {step === 5 && (
                  <div>
                    <h2 className="sec-h">Timing & format</h2>
                    <Field label="Which timeframe works best? *" error={errors.preferredTimeframe}>
                      <RadioGroup name="timeframe" value={form.preferredTimeframe} onChange={v => set("preferredTimeframe", v)} options={[
                        {value:"April 25–29",label:"April 25–29"},
                        {value:"Early May (May 1–7)",label:"Early May (May 1–7)"},
                        {value:"Mid May (May 8–15)",label:"Mid May (May 8–15)"},
                        {value:"Flexible",label:"Flexible"},
                      ]} />
                    </Field>
                    <Field label="Preferred participation format *" error={errors.participationFormat}>
                      <RadioGroup name="format" value={form.participationFormat} onChange={v => set("participationFormat", v)} options={[
                        {value:"In-person (Cambridge/Boston)",label:"In-person (Cambridge/Boston)"},
                        {value:"Remote",label:"Remote"},
                        {value:"Hybrid",label:"Hybrid"},
                        {value:"No preference",label:"No preference"},
                      ]} />
                    </Field>
                    <Field label="Open to participating if format expands beyond Harvard? *" error={errors.openToExpansion}>
                      <RadioGroup name="expansion" value={form.openToExpansion} onChange={v => set("openToExpansion", v)} options={[
                        {value:"Yes",label:"Yes"},{value:"No",label:"No"},{value:"Depends",label:"Depends"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 6 && (
                  <div>
                    <h2 className="sec-h">Internal process</h2>
                    <Field label="Are you the decision-maker for sponsorship approvals? *" error={errors.isDecisionMaker}>
                      <RadioGroup name="decisionMaker" value={form.isDecisionMaker} onChange={v => set("isDecisionMaker", v)} options={[
                        {value:"Yes",label:"Yes"},{value:"Partially",label:"Partially"},{value:"No",label:"No"},
                      ]} />
                    </Field>
                    <Field label="Who else should be included in follow-up?" optional>
                      <Input value={form.otherApprovers} onChange={v => set("otherApprovers", v)} placeholder="Name, title, or email of additional stakeholders" />
                    </Field>
                    <Field label="Expected decision timeline *" error={errors.decisionTimeline}>
                      <RadioGroup name="timeline" value={form.decisionTimeline} onChange={v => set("decisionTimeline", v)} options={[
                        {value:"This week",label:"This week"},
                        {value:"Within 2 weeks",label:"Within 2 weeks"},
                        {value:"This month",label:"This month"},
                        {value:"Still evaluating",label:"Still evaluating"},
                      ]} />
                    </Field>
                  </div>
                )}

                {step === 7 && (
                  <div>
                    <h2 className="sec-h">Additional notes</h2>
                    <Field label="Anything else we should know?" optional hint="Additional context about your team's interest, constraints, or partnership goals.">
                      <Textarea value={form.additionalNotes} onChange={v => set("additionalNotes", v)} placeholder="Additional context, questions, or anything relevant to your partnership interest…" rows={8} />
                    </Field>
                  </div>
                )}

                {step === 8 && (
                  <div>
                    <h2 className="sec-h">How did you find us?</h2>
                    <Field label="How did you hear about this opportunity? *" error={errors.referralSource}>
                      <RadioGroup name="source" value={form.referralSource} onChange={v => set("referralSource", v)} options={[
                        {value:"Direct outreach",label:"Direct outreach"},
                        {value:"Friend / referral",label:"Friend / referral"},
                        {value:"Club / organization",label:"Club / organization"},
                        {value:"Social media",label:"Social media"},
                        {value:"Website",label:"Website"},
                        {value:"Other",label:"Other"},
                      ]} />
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
                      {submitting ? "Submitting…" : <><span>Submit inquiry</span><span className="arr" /></>}
                    </button>}
              </div>

              <p className="crosslink">
                Looking to participate as a builder?{" "}
                <Link href="/student-reg">Apply as a participant instead →</Link>
              </p>

            </div>
          </div>
        </>
      )}
    </>
  );
}