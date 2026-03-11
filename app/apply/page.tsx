"use client";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { FileUpload } from "../jobs/components/ui/file-upload-component";
import { User, Mail, Phone, MapPin, Briefcase, Award, Linkedin, Globe, Target, Lightbulb, Code, CheckCircle, AlertCircle } from "lucide-react";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

/* ─── Fade/Reveal via IntersectionObserver ─── */
function Fade({
  children,
  delay = 0,
  style,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`fade ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </div>
  );
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  currentRole: string;
  experience: string;
  linkedin: string;
  portfolio: string;
  position: string;
  motivation: string;
  skills: string;
  resume: File | null;
  coverLetter: File | null;
  terms: boolean;
}

export default function ApplyPageImproved() {
  const convex = useConvex();
  const submitApplication = useMutation(api.jobApplications.submitApplication);
  const generateUploadUrl = useMutation(api.jobApplications.generateUploadUrl);
  const [scrolled, setScrolled] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    fullName: "", email: "", phone: "", location: "",
    currentRole: "", experience: "", linkedin: "", portfolio: "",
    position: "", motivation: "", skills: "",
    resume: null, coverLetter: null, terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (field: "resume" | "coverLetter", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const resetForm = () => {
    setFormData({
      fullName: "", email: "", phone: "", location: "",
      currentRole: "", experience: "", linkedin: "", portfolio: "",
      position: "", motivation: "", skills: "",
      resume: null, coverLetter: null, terms: false,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    try {
      if (!formData.resume) throw new Error("Resume is required");
      if (!formData.terms) throw new Error("You must accept the terms and conditions");

      const resumeUploadUrl = await generateUploadUrl();
      const resumeResponse = await fetch(resumeUploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.resume.type },
        body: formData.resume,
      });
      if (!resumeResponse.ok) throw new Error("Failed to upload resume");
      const { storageId: resumeStorageId } = await resumeResponse.json();

      let coverLetterStorageId: Id<"_storage"> | undefined;
      if (formData.coverLetter) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.coverLetter.type },
          body: formData.coverLetter,
        });
        if (response.ok) coverLetterStorageId = (await response.json()).storageId;
      }

      const result = await submitApplication({
        fullName: formData.fullName, email: formData.email,
        phone: formData.phone || undefined, location: formData.location,
        currentRole: formData.currentRole, experience: formData.experience,
        linkedin: formData.linkedin || undefined, portfolio: formData.portfolio || undefined,
        position: formData.position, motivation: formData.motivation, skills: formData.skills,
        resumeStorageId, coverLetterStorageId, termsAccepted: formData.terms,
      });

      setSubmitStatus("success");
      setApplicationId(result.applicationId);
      resetForm();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error: any) {
      console.error("Submission error:", error);
      setSubmitStatus("error");
      setErrorMessage(error.message || "There was an error submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const LOGO_B64 = "data:image/png;base64,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";

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; font-size: 15px; }
        :root {
          --nav-bg: #f6f8f8; --nav-text: #b5c9ce; --nav-active: #1c3342; --nav-border: #dce4e8;
          --hero-bg: #092e42; --hero-h1: #ffffff; --hero-body: rgba(255,255,255,0.55);
          --hero-label: #5997b0; --hero-line: #5997b0; --section-bg: #f1f7fa;
          --section-white: #ffffff; --card-border: #5e96aa; --label-color: #7a9daa;
          --h2-color: #0d2b3a; --body-color: #3a5a6a; --bullet-color: #5997b0;
          --list-text: #3a5464; --divider: #d4e4eb; --cta-bg: #092e42;
          --cta-accent: #39a2ca; --cta-body: rgba(255,255,255,0.65);
          --btn-bg: #39a2ca; --btn-text: #ffffff; --btn-fine: #4a6e7e;
          --footer-bg: #092e42; --footer-text: rgba(255,255,255,0.55);
          --footer-links: rgba(255,255,255,0.35);
          --input-bg: #f9fbfc; --input-border: #c4d8e2; --input-focus: #39a2ca;
          --ff: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        ::selection { background: rgba(57,162,202,0.2); }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: var(--hero-label); }
        body {
          background: var(--section-white); color: var(--h2-color);
          font-family: var(--ff); font-weight: 400; line-height: 1.65;
          -webkit-font-smoothing: antialiased; overflow-x: hidden; padding-bottom: 64px;
        }
        @media(max-width:768px){ body { padding-bottom: 120px; } }
        @media(max-width:480px){ body { padding-bottom: 140px; } }
        .w { max-width: 1200px; margin: 0 auto; padding: 0 56px; }
        @media(max-width:900px){ .w { padding: 0 32px; } }
        @media(max-width:640px){ .w { padding: 0 20px; } }
        .fade { opacity: 0; transform: translateY(22px); transition: opacity 0.85s cubic-bezier(0.16,1,0.3,1), transform 0.85s cubic-bezier(0.16,1,0.3,1); }
        .fade.in { opacity: 1; transform: none; }
        /* Header */
        #apply-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          background: var(--nav-bg); border-bottom: 1px solid var(--nav-border);
          transition: box-shadow 0.3s;
        }
        #apply-header.scrolled { box-shadow: 0 2px 24px rgba(9,46,66,0.08); }
        .header-inner {
          display: flex; align-items: center; height: 82px;
          max-width: 1200px; margin: 0 auto; padding: 0 48px;
        }
        @media(max-width:900px){ .header-inner { padding: 0 32px; } }
        .header-logo {
          display: flex; align-items: center; gap: 12px; text-decoration: none;
          flex-shrink: 0; margin-right: 52px; line-height: 1;
        }
        .header-mark { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .header-mark img { width: 40px; height: 40px; object-fit: contain; display: block; }
        .header-word { font-size: 0.933rem; font-weight: 700; letter-spacing: 0.22em; color: var(--nav-active); text-transform: uppercase; line-height: 1; white-space: nowrap; }
        .header-tag {
          font-size: 0.6rem; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase;
          color: var(--label-color); background: var(--section-bg); padding: 6px 14px; border-radius: 999px;
        }
        /* Hero */
        #apply-hero {
          min-height: 50vh; padding-top: 82px; background: var(--hero-bg);
          display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;
        }
        .hero-bg-img {
          position: absolute; inset: 0; background-image: url('/background.png');
          background-size: cover; background-position: center; opacity: 0.08; pointer-events: none;
        }
        .hero-inner { padding: 96px 56px 108px; position: relative; z-index: 1; text-align: center; max-width: 720px; margin: 0 auto; }
        .hero-label-row { display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 40px; opacity: 0; animation: up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }
        .hero-label-line { width: 32px; height: 1px; background: var(--hero-line); }
        .hero-label-text { font-size: 0.667rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--hero-label); }
        .hero-h1 {
          font-family: var(--ff); font-size: clamp(2rem,3.8vw,3rem); font-weight: 300;
          line-height: 1.2; letter-spacing: -0.01em; color: var(--hero-h1); text-align: center;
          opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.22s forwards;
        }
        .hero-h1 .accent { color: var(--cta-accent); }
        .hero-body {
          margin-top: 2rem; max-width: 580px; font-size: 0.933rem; font-weight: 400;
          line-height: 1.75; color: var(--hero-body); opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.38s forwards; margin: 2rem auto 0;
        }
        @keyframes up { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: none; } }
        /* Form Sections */
        .form-section { padding: 72px 0; border-top: 1px solid var(--divider); background: var(--section-white); }
        .form-section.alt { background: var(--section-bg); }
        .section-label {
          display: flex; align-items: center; gap: 10px; margin-bottom: 16px;
          font-size: 0.633rem; font-weight: 600; letter-spacing: 0.28em; text-transform: uppercase; color: var(--hero-label);
        }
        .section-label::before { content: ''; width: 28px; height: 1px; background: var(--hero-label); display: block; }
        .section-title {
          font-family: var(--ff); font-size: clamp(1.6rem,2.8vw,2.2rem); font-weight: 300;
          line-height: 1.15; letter-spacing: -0.01em; color: var(--h2-color); margin-bottom: 32px;
        }
        .form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 24px; }
        @media(max-width:768px){ .form-grid { grid-template-columns: 1fr; } }
        .form-field { display: flex; flex-direction: column; }
        .form-field.full { grid-column: 1 / -1; }
        .form-label {
          font-size: 0.733rem; font-weight: 500; color: var(--body-color); margin-bottom: 8px;
          display: flex; align-items: center; gap: 6px;
        }
        .form-label .required { color: #c44; margin-left: 2px; }
        .input-wrap { position: relative; }
        .input-icon {
          position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
          width: 18px; height: 18px; color: var(--label-color); pointer-events: none;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%; padding: 14px 16px; padding-left: 44px;
          background: var(--input-bg); border: 1.5px solid var(--input-border);
          border-radius: 10px; font-size: 0.867rem; color: var(--h2-color);
          font-family: var(--ff); transition: border-color 0.2s, background 0.2s;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none; border-color: var(--input-focus); background: var(--section-white);
        }
        .form-input::placeholder, .form-textarea::placeholder { color: var(--label-color); }
        .form-textarea { min-height: 110px; resize: vertical; padding-left: 16px; }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%237a9daa' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 16px center; padding-right: 40px; }
        /* File Upload Styling */
        .file-upload {
          border: 2px dashed var(--input-border); border-radius: 12px; padding: 24px;
          background: var(--section-white); transition: border-color 0.2s, background 0.2s;
          cursor: pointer; display: flex; align-items: center; gap: 14px;
        }
        .file-upload:hover { border-color: var(--hero-label); background: var(--section-bg); }
        .file-upload.has-file { border-style: solid; border-color: var(--hero-label); }
        .file-icon {
          width: 40px; height: 40px; border-radius: 10px; background: var(--section-bg);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .file-icon svg { width: 20px; height: 20px; color: var(--hero-label); }
        .file-info { flex: 1; min-width: 0; }
        .file-name { font-size: 0.8rem; font-weight: 500; color: var(--h2-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .file-meta { font-size: 0.667rem; color: var(--label-color); margin-top: 2px; }
        .file-action { font-size: 0.667rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--hero-label); }
        .file-upload input[type="file"] { display: none; }
        /* Messages */
        .msg-box {
          border-radius: 14px; padding: 20px 24px; margin-bottom: 32px;
          display: flex; align-items: flex-start; gap: 14px;
        }
        .msg-box.success { background: rgba(34,197,94,0.08); border: 1.5px solid rgba(34,197,94,0.3); }
        .msg-box.error { background: rgba(239,68,68,0.08); border: 1.5px solid rgba(239,68,68,0.3); }
        .msg-icon { width: 22px; height: 22px; flex-shrink: 0; margin-top: 2px; }
        .msg-icon.success { color: #22c55e; }
        .msg-icon.error { color: #ef4444; }
        .msg-title { font-size: 0.867rem; font-weight: 600; color: var(--h2-color); margin-bottom: 4px; }
        .msg-text { font-size: 0.8rem; color: var(--body-color); line-height: 1.6; }
        .msg-id { font-size: 0.7rem; color: var(--label-color); margin-top: 8px; font-family: monospace; }
        /* Terms & Submit */
        .terms-box {
          background: var(--section-bg); border: 1.5px solid var(--input-border);
          border-radius: 12px; padding: 18px 20px; margin-bottom: 32px;
        }
        .terms-check { display: flex; align-items: flex-start; gap: 12px; }
        .terms-check input[type="checkbox"] {
          width: 18px; height: 18px; margin-top: 2px; accent-color: var(--btn-bg); cursor: pointer;
        }
        .terms-label { font-size: 0.733rem; color: var(--body-color); line-height: 1.6; }
        .terms-label a { color: var(--hero-label); text-decoration: none; }
        .terms-label a:hover { text-decoration: underline; }
        .btn-submit {
          width: 100%; padding: 18px 32px; background: var(--btn-bg); color: var(--btn-text);
          font-size: 0.733rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
          border: none; border-radius: 12px; cursor: pointer; transition: background 0.25s, transform 0.15s;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .btn-submit:hover { background: #2b8fb5; transform: translateY(-1px); }
        .btn-submit:disabled { background: var(--label-color); cursor: not-allowed; transform: none; }
        .btn-submit .spinner {
          width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .submit-note { text-align: center; font-size: 0.7rem; color: var(--label-color); margin-top: 16px; }
        /* Footer */
         /* ── FOOTER (fixed slim) ── */
        footer {
          position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
          background: var(--footer-bg);
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .footer-slim { display: flex; align-items: center; justify-content: space-between; padding: 22px 0; gap: 24px; flex-wrap: nowrap; }
        .footer-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; }
        .footer-mark { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .footer-mark img { width: 28px; height: 28px; object-fit: contain; display: block; }
        .footer-word { font-size: 0.733rem; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(255,255,255,0.7); line-height: 1; white-space: nowrap; }
        .footer-right { display: flex; align-items: center; gap: 32px; flex-shrink: 0; }
        .footer-links-row { display: flex; align-items: center; gap: 24px; }
        .footer-links-row a { font-size: 0.633rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: rgba(255,255,255,0.35); text-decoration: none; transition: color 0.2s; white-space: nowrap; line-height: 1; }
        .footer-links-row a:hover { color: rgba(255,255,255,0.7); }
        .footer-copy { font-size: 0.633rem; color: rgba(255,255,255,0.22); letter-spacing: 0.04em; line-height: 1; white-space: nowrap; flex-shrink: 0; }

      `}</style>

      {/* Header */}
      <header id="apply-header" className={scrolled ? "scrolled" : ""}>
        <div className="header-inner">
          <a href="/" className="header-logo">
            <div className="header-mark">
              <img src={LOGO_B64} alt="MUSEDATA" />
            </div>
            <span className="header-word">MUSEDATA</span>
          </a>
          <span className="header-tag">Careers</span>
        </div>
      </header>

      {/* Hero */}
      <section id="apply-hero">
        <div className="hero-bg-img" />
        <div className="w">
          <div className="hero-inner">
            <Fade delay={0}>
              <div className="hero-label-row">
                <div className="hero-label-line" />
                <span className="hero-label-text">Join Our Team</span>
              </div>
            </Fade>
            <Fade delay={0.12}>
              <h1 className="hero-h1">
                Build the future of <span className="accent">institutional capital</span>
              </h1>
            </Fade>
            <Fade delay={0.24}>
              <p className="hero-body">
                MUSEDATA is looking for exceptional operators, investors, and builders who believe in evidence before conviction. Apply today.
              </p>
            </Fade>
          </div>
        </div>
      </section>

      {/* Main Form */}
      <main className="w" style={{ paddingTop: 48, paddingBottom: 80 }}>
        {/* Success Message */}
        {submitStatus === "success" && (
          <Fade delay={0}>
            <div className="msg-box success">
              <CheckCircle className="msg-icon success" />
              <div>
                <div className="msg-title">Application Submitted Successfully!</div>
                <p className="msg-text">
                  Thank you for applying to MUSEDATA. Our team will review your application and reach out within 5 business days.
                </p>
                <div className="msg-id">Application ID: {applicationId}</div>
              </div>
            </div>
          </Fade>
        )}

        {/* Error Message */}
        {submitStatus === "error" && (
          <Fade delay={0}>
            <div className="msg-box error">
              <AlertCircle className="msg-icon error" />
              <div>
                <div className="msg-title">Submission Error</div>
                <p className="msg-text">{errorMessage}</p>
              </div>
            </div>
          </Fade>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Fade delay={0.1} className="form-section">
            <div className="section-label">01</div>
            <h2 className="section-title">Personal Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <User className="input-icon" style={{ left: 14 }} />
                  Full Name <span className="required">*</span>
                </label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required placeholder="Jane Doe" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Mail className="input-icon" style={{ left: 14 }} />
                  Email Address <span className="required">*</span>
                </label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} required placeholder="jane@example.com" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Phone className="input-icon" style={{ left: 14 }} />
                  Phone Number
                </label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <MapPin className="input-icon" style={{ left: 14 }} />
                  Location <span className="required">*</span>
                </label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required placeholder="City, Country" className="form-input" />
              </div>
            </div>
          </Fade>

          {/* Professional Background */}
          <Fade delay={0.15} className="form-section alt">
            <div className="section-label">02</div>
            <h2 className="section-title">Professional Background</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <Briefcase className="input-icon" style={{ left: 14 }} />
                  Current Role / Title <span className="required">*</span>
                </label>
                <input type="text" name="currentRole" value={formData.currentRole} onChange={handleInputChange} required placeholder="e.g., Senior Software Engineer" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Award className="input-icon" style={{ left: 14 }} />
                  Years of Experience <span className="required">*</span>
                </label>
                <select name="experience" value={formData.experience} onChange={handleInputChange} required className="form-select">
                  <option value="">Select experience level</option>
                  <option value="0-1">0-1 years</option>
                  <option value="1-3">1-3 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Linkedin className="input-icon" style={{ left: 14 }} />
                  LinkedIn Profile
                </label>
                <input type="url" name="linkedin" value={formData.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/yourprofile" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Globe className="input-icon" style={{ left: 14 }} />
                  Portfolio / Website
                </label>
                <input type="url" name="portfolio" value={formData.portfolio} onChange={handleInputChange} placeholder="https://yourportfolio.com" className="form-input" />
              </div>
            </div>
          </Fade>

          {/* Application Details */}
          <Fade delay={0.2} className="form-section">
            <div className="section-label">03</div>
            <h2 className="section-title">Application Details</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">
                  <Target className="input-icon" style={{ left: 14 }} />
                  Position of Interest <span className="required">*</span>
                </label>
                <select name="position" value={formData.position} onChange={handleInputChange} required className="form-select">
                  <option value="">Select a position</option>
                  <option value="finance">Finance</option>
                  <option value="investment">Investment</option>
                  <option value="engineering">Engineering</option>
                  <option value="analytics">Analytics</option>
                  <option value="operations">Operations</option>
                  <option value="advisory">Advisory</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-field full">
                <label className="form-label">
                  <Lightbulb style={{ width: 16, height: 16 }} />
                  Why MUSEDATA? <span className="required">*</span>
                </label>
                <textarea name="motivation" value={formData.motivation} onChange={handleInputChange} required placeholder="Tell us what excites you about joining MUSEDATA and how you'd contribute..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">
                  <Code style={{ width: 16, height: 16 }} />
                  Key Skills & Technologies <span className="required">*</span>
                </label>
                <textarea name="skills" value={formData.skills} onChange={handleInputChange} required placeholder="List your top skills, technologies, and areas of expertise..." className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Documents */}
          <Fade delay={0.25} className="form-section alt">
            <div className="section-label">04</div>
            <h2 className="section-title">Documents</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">Resume / CV <span className="required">*</span></label>
                <FileUpload
                  name="resume"
                  label="Upload your resume (PDF or DOCX)"
                  required
                  value={formData.resume}
                  onChange={(file: any) => handleFileChange("resume", file)}
                />
              </div>
              <div className="form-field full">
                <label className="form-label">Cover Letter (Optional)</label>
                <FileUpload
                  name="coverLetter"
                  label="Upload a cover letter (PDF or DOCX)"
                  value={formData.coverLetter}
                  onChange={(file: any) => handleFileChange("coverLetter", file)}
                />
              </div>
            </div>
          </Fade>

          {/* Terms & Submit */}
          <Fade delay={0.3} className="form-section" style={{ paddingBottom: 40 }}>
            <div className="terms-box">
              <div className="terms-check">
                <input type="checkbox" name="terms" id="terms" checked={formData.terms} onChange={handleInputChange} required />
                <label htmlFor="terms" className="terms-label">
                  I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>. I understand that my application data will be stored and processed through the MUSEDATA platform. <span className="required">*</span>
                </label>
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-submit">
              {isSubmitting ? (
                <>
                  <span className="spinner" />
                  Processing Application...
                </>
              ) : (
                "Submit Application"
              )}
            </button>
            <p className="submit-note">We'll review your application and get back to you within 5 business days</p>
          </Fade>
        </form>
      </main>

      {/* Footer */}
      <footer id="apply-footer">
        <div className="w">
          <div className="footer-slim">
            <a href="/" className="footer-logo">
              <div className="footer-mark">
                <img src={LOGO_B64} alt="MUSEDATA" />
              </div>
              <span className="footer-word">MUSEDATA</span>
            </a>
            <div className="footer-right">
              <div className="footer-links-row">
                <a href="/privacy">Privacy Policy</a>
                <a href="/terms">Terms of Use</a>
                <a href="/disclosures">Disclosures</a>
                <a href="mailto:partners@musedata.ai">Contact</a>
              </div>
              <div className="footer-copy">© 2026 MUSEDATA Growth Equity. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}