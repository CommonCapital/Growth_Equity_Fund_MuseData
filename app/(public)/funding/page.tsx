"use client";
import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react";
import Link from "next/link";
import { FileUpload } from "../jobs/components/ui/file-upload-component";
import {
  User, Mail, Phone, Building2, Globe, MapPin, Briefcase, Target,
  TrendingUp, Users, DollarSign, Lightbulb, Code, BarChart3, Rocket,
  CheckCircle, AlertCircle, FileText, Linkedin, ArrowRight
} from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { LOGO_B64 } from "@/components/UnifiedNavbar/UnifiedNavbar";

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

interface StartupFormData {
  // Founder Information
  founderName: string;
  founderEmail: string;
  founderPhone: string;
  founderLinkedin: string;
  coFounders: string;
  // Company Information
  companyName: string;
  companyWebsite: string;
  companyLocation: string;
  incorporationStatus: "incorporated" | "in_progress" | "not_yet" | "";
  incorporationCountry: string;
  foundedDate: string;
  // Business Details
  industry: string;
  stage: "idea" | "prototype" | "mvp" | "early_revenue" | "growth" | "";
  businessModel: string;
  problemStatement: string;
  solution: string;
  uniqueValueProposition: string;
  targetMarket: string;
  marketSize: string;
  competitors: string;
  competitiveAdvantage: string;
  // Traction & Metrics
  currentRevenue: string;
  revenueGrowth: string;
  numberOfCustomers: string;
  userMetrics: string;
  keyMilestones: string;
  // Funding
  fundingStage: "pre_seed" | "seed" | "series_a" | "series_b" | "series_c_plus" | "";
  fundingAmount: string;
  previousFunding: string;
  currentInvestors: string;
  useOfFunds: string;
  valuation: string;
  // Team
  teamSize: string;
  keyTeamMembers: string;
  advisors: string;
  hiringPlans: string;
  // Product & Technology
  productDescription: string;
  technologyStack: string;
  intellectualProperty: string;
  productRoadmap: string;
  // Go-to-Market
  customerAcquisition: string;
  salesStrategy: string;
  marketingStrategy: string;
  partnershipStrategy: string;
  // Financial Projections
  projectedRevenue: string;
  burnRate: string;
  runway: string;
  breakEvenTimeline: string;
  // Documents
  pitchDeck: File | null;
  financialModel: File | null;
  businessPlan: File | null;
  productDemo: File | null;
  // Additional
  whyUs: string;
  referralSource: string;
  exitStrategy: string;
  challenges: string;
  terms: boolean;
}

export default function StartupApplicationPage() {
  const submitApplication = useMutation(api.startupApplications.submitStartupApplication);
  const generateUploadUrl = useMutation(api.startupApplications.generateUploadUrl);

  const [formData, setFormData] = useState<StartupFormData>({
    founderName: "", founderEmail: "", founderPhone: "", founderLinkedin: "",
    coFounders: "", companyName: "", companyWebsite: "", companyLocation: "",
    incorporationStatus: "", incorporationCountry: "", foundedDate: "",
    industry: "", stage: "", businessModel: "", problemStatement: "",
    solution: "", uniqueValueProposition: "", targetMarket: "", marketSize: "",
    competitors: "", competitiveAdvantage: "", currentRevenue: "", revenueGrowth: "",
    numberOfCustomers: "", userMetrics: "", keyMilestones: "",
    fundingStage: "", fundingAmount: "", previousFunding: "", currentInvestors: "",
    useOfFunds: "", valuation: "", teamSize: "", keyTeamMembers: "", advisors: "",
    hiringPlans: "", productDescription: "", technologyStack: "", intellectualProperty: "",
    productRoadmap: "", customerAcquisition: "", salesStrategy: "", marketingStrategy: "",
    partnershipStrategy: "", projectedRevenue: "", burnRate: "", runway: "",
    breakEvenTimeline: "", pitchDeck: null, financialModel: null, businessPlan: null,
    productDemo: null, whyUs: "", referralSource: "", exitStrategy: "", challenges: "",
    terms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (field: "pitchDeck" | "financialModel" | "businessPlan" | "productDemo", file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const resetForm = () => {
    setFormData({
      founderName: "", founderEmail: "", founderPhone: "", founderLinkedin: "",
      coFounders: "", companyName: "", companyWebsite: "", companyLocation: "",
      incorporationStatus: "", incorporationCountry: "", foundedDate: "",
      industry: "", stage: "", businessModel: "", problemStatement: "",
      solution: "", uniqueValueProposition: "", targetMarket: "", marketSize: "",
      competitors: "", competitiveAdvantage: "", currentRevenue: "", revenueGrowth: "",
      numberOfCustomers: "", userMetrics: "", keyMilestones: "",
      fundingStage: "", fundingAmount: "", previousFunding: "", currentInvestors: "",
      useOfFunds: "", valuation: "", teamSize: "", keyTeamMembers: "", advisors: "",
      hiringPlans: "", productDescription: "", technologyStack: "", intellectualProperty: "",
      productRoadmap: "", customerAcquisition: "", salesStrategy: "", marketingStrategy: "",
      partnershipStrategy: "", projectedRevenue: "", burnRate: "", runway: "",
      breakEvenTimeline: "", pitchDeck: null, financialModel: null, businessPlan: null,
      productDemo: null, whyUs: "", referralSource: "", exitStrategy: "", challenges: "",
      terms: false,
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");
    try {
      if (!formData.pitchDeck) throw new Error("Pitch deck is required");
      if (!formData.terms) throw new Error("You must accept the terms and conditions");

      // Upload pitch deck
      const pitchDeckUploadUrl = await generateUploadUrl();
      const pitchDeckResponse = await fetch(pitchDeckUploadUrl, {
        method: "POST",
        headers: { "Content-Type": formData.pitchDeck.type },
        body: formData.pitchDeck,
      });
      if (!pitchDeckResponse.ok) throw new Error("Failed to upload pitch deck");
      const { storageId: pitchDeckStorageId } = await pitchDeckResponse.json();

      // Upload optional documents
      let financialModelStorageId: Id<"_storage"> | undefined;
      if (formData.financialModel) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.financialModel.type },
          body: formData.financialModel,
        });
        if (response.ok) financialModelStorageId = (await response.json()).storageId;
      }
      let businessPlanStorageId: Id<"_storage"> | undefined;
      if (formData.businessPlan) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.businessPlan.type },
          body: formData.businessPlan,
        });
        if (response.ok) businessPlanStorageId = (await response.json()).storageId;
      }
      let productDemoStorageId: Id<"_storage"> | undefined;
      if (formData.productDemo) {
        const url = await generateUploadUrl();
        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": formData.productDemo.type },
          body: formData.productDemo,
        });
        if (response.ok) productDemoStorageId = (await response.json()).storageId;
      }

      // Submit application
      const result = await submitApplication({
        founderName: formData.founderName,
        founderEmail: formData.founderEmail,
        founderPhone: formData.founderPhone || undefined,
        founderLinkedin: formData.founderLinkedin || undefined,
        coFounders: formData.coFounders || undefined,
        companyName: formData.companyName,
        companyWebsite: formData.companyWebsite || undefined,
        companyLocation: formData.companyLocation,
        incorporationStatus: formData.incorporationStatus as any,
        incorporationCountry: formData.incorporationCountry || undefined,
        foundedDate: formData.foundedDate || undefined,
        industry: formData.industry,
        stage: formData.stage as any,
        businessModel: formData.businessModel,
        problemStatement: formData.problemStatement,
        solution: formData.solution,
        uniqueValueProposition: formData.uniqueValueProposition,
        targetMarket: formData.targetMarket,
        marketSize: formData.marketSize || undefined,
        competitors: formData.competitors || undefined,
        competitiveAdvantage: formData.competitiveAdvantage || undefined,
        currentRevenue: formData.currentRevenue || undefined,
        revenueGrowth: formData.revenueGrowth || undefined,
        numberOfCustomers: formData.numberOfCustomers || undefined,
        userMetrics: formData.userMetrics || undefined,
        keyMilestones: formData.keyMilestones,
        fundingStage: formData.fundingStage as any,
        fundingAmount: formData.fundingAmount,
        previousFunding: formData.previousFunding || undefined,
        currentInvestors: formData.currentInvestors || undefined,
        useOfFunds: formData.useOfFunds,
        valuation: formData.valuation || undefined,
        teamSize: formData.teamSize,
        keyTeamMembers: formData.keyTeamMembers,
        advisors: formData.advisors || undefined,
        hiringPlans: formData.hiringPlans || undefined,
        productDescription: formData.productDescription,
        technologyStack: formData.technologyStack || undefined,
        intellectualProperty: formData.intellectualProperty || undefined,
        productRoadmap: formData.productRoadmap || undefined,
        customerAcquisition: formData.customerAcquisition,
        salesStrategy: formData.salesStrategy,
        marketingStrategy: formData.marketingStrategy || undefined,
        partnershipStrategy: formData.partnershipStrategy || undefined,
        projectedRevenue: formData.projectedRevenue || undefined,
        burnRate: formData.burnRate || undefined,
        runway: formData.runway || undefined,
        breakEvenTimeline: formData.breakEvenTimeline || undefined,
        pitchDeckStorageId,
        financialModelStorageId,
        businessPlanStorageId,
        productDemoStorageId,
        whyUs: formData.whyUs,
        referralSource: formData.referralSource || undefined,
        exitStrategy: formData.exitStrategy || undefined,
        challenges: formData.challenges || undefined,
        termsAccepted: formData.terms,
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
          --footer-links: rgba(255,255,255,0.35); --input-bg: #f9fbfc;
          --input-border: #c4d8e2; --input-focus: #39a2ca;
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
          min-height: 60vh; padding-top: 82px; background: var(--hero-bg);
          display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;
        }
        .hero-bg-img {
          position: absolute; inset: 0; background-image: url('/background.png');
          background-size: cover; background-position: center; opacity: 0.08; pointer-events: none;
        }
        .hero-inner { padding: 96px 56px 108px; position: relative; z-index: 1; text-align: left; max-width: 720px; }
        .hero-label-row { display: flex; align-items: center; gap: 12px; margin-bottom: 40px; opacity: 0; animation: up 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s forwards; }
        .hero-label-line { width: 32px; height: 1px; background: var(--hero-line); }
        .hero-label-text { font-size: 0.667rem; font-weight: 600; letter-spacing: 0.3em; text-transform: uppercase; color: var(--hero-label); }
        .hero-h1 {
          font-family: var(--ff); font-size: clamp(2rem,3.8vw,3rem); font-weight: 300;
          line-height: 1.2; letter-spacing: -0.01em; color: var(--hero-h1); text-align: left;
          opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.22s forwards;
        }
        .hero-h1 .accent { color: var(--cta-accent); }
        .hero-body {
          margin-top: 2rem; max-width: 580px; font-size: 0.933rem; font-weight: 400;
          line-height: 1.75; color: var(--hero-body); opacity: 0; animation: up 1s cubic-bezier(0.16,1,0.3,1) 0.38s forwards;
        }
        @keyframes up { from { opacity:0; transform: translateY(24px); } to { opacity:1; transform: none; } }
        /* Form Sections */
        .form-section {
          padding: 72px 0; border-top: 1px solid var(--divider); background: var(--section-white);
        }
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
         /* ── FOOTER (fixed slim) ── */
        /* ── FOOTER (fixed slim) ── */
        footer {
          position: static;
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

        /* Responsive */
        @media(max-width:768px){
          .hero-inner { padding: 56px 24px 72px; }
          .hero-h1 { font-size: clamp(1.7rem,5vw,2.4rem); }
          .hero-body { font-size: 0.867rem; margin-top: 1.5rem; }
          .form-section { padding: 48px 0; }
          .section-title { font-size: 1.6rem; margin-bottom: 24px; }
          .footer-slim { flex-wrap: wrap; gap: 14px; }
          .footer-right { flex-direction: column; align-items: flex-start; gap: 10px; }
          .footer-links-row { flex-wrap: wrap; gap: 14px; }
        }
        @media(max-width:480px){
          .hero-inner { padding: 44px 18px 56px; }
          .form-section { padding: 36px 0; }
          .section-title { font-size: 1.4rem; }
          .form-input, .form-select { padding: 12px 14px; padding-left: 40px; font-size: 0.833rem; }
          .form-textarea { padding-left: 14px; min-height: 100px; }
          .file-upload { padding: 18px 16px; }
          .footer-slim { flex-direction: column; align-items: flex-start; gap: 16px; padding: 20px 0; }
        }
      `}</style>

      {/* Header */}
      <header id="apply-header">
        <div className="header-inner">
          <a href="/" className="header-logo">
            <div className="header-mark">
              <img src="data:image/png;base64,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" alt="MUSEDATA" />
            </div>
            <span className="header-word">MUSEDATA</span>
          </a>
          <span className="header-tag">Startup Applications</span>
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
                <span className="hero-label-text">Apply for Funding</span>
              </div>
            </Fade>
            <Fade delay={0.12}>
              <h1 className="hero-h1">
                Partner with <span className="accent">MUSEDATA</span>
              </h1>
            </Fade>
            <Fade delay={0.24}>
              <p className="hero-body">
                We back exceptional founders building the next generation of transformative enterprise software and AI companies. Tell us about your vision.
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
                  Thank you for your application. Our investment team will review your submission and reach out within 2 weeks.
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
          {/* Founder Information */}
          <Fade delay={0.1} className="form-section">
            <div className="section-label">01</div>
            <h2 className="section-title">Founder Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <User className="input-icon" style={{ left: 14 }} />
                  Founder Name <span className="required">*</span>
                </label>
                <input type="text" name="founderName" value={formData.founderName} onChange={handleInputChange} required placeholder="Jane Doe" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Mail className="input-icon" style={{ left: 14 }} />
                  Email <span className="required">*</span>
                </label>
                <input type="email" name="founderEmail" value={formData.founderEmail} onChange={handleInputChange} required placeholder="jane@startup.com" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Phone className="input-icon" style={{ left: 14 }} />
                  Phone
                </label>
                <input type="tel" name="founderPhone" value={formData.founderPhone} onChange={handleInputChange} placeholder="+1 (555) 000-0000" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Linkedin className="input-icon" style={{ left: 14 }} />
                  LinkedIn Profile
                </label>
                <input type="url" name="founderLinkedin" value={formData.founderLinkedin} onChange={handleInputChange} placeholder="https://linkedin.com/in/profile" className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Co-Founders (if applicable)</label>
                <textarea name="coFounders" value={formData.coFounders} onChange={handleInputChange} placeholder="List co-founder names, roles, and backgrounds..." className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Company Information */}
          <Fade delay={0.15} className="form-section alt">
            <div className="section-label">02</div>
            <h2 className="section-title">Company Information</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">
                  <Building2 className="input-icon" style={{ left: 14 }} />
                  Company Name <span className="required">*</span>
                </label>
                <input type="text" name="companyName" value={formData.companyName} onChange={handleInputChange} required placeholder="Startup Inc." className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <Globe className="input-icon" style={{ left: 14 }} />
                  Website
                </label>
                <input type="url" name="companyWebsite" value={formData.companyWebsite} onChange={handleInputChange} placeholder="https://startup.com" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">
                  <MapPin className="input-icon" style={{ left: 14 }} />
                  Location <span className="required">*</span>
                </label>
                <input type="text" name="companyLocation" value={formData.companyLocation} onChange={handleInputChange} required placeholder="San Francisco, CA" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Incorporation Status <span className="required">*</span></label>
                <select name="incorporationStatus" value={formData.incorporationStatus} onChange={handleInputChange} required className="form-select">
                  <option value="">Select status</option>
                  <option value="incorporated">Incorporated</option>
                  <option value="in_progress">In Progress</option>
                  <option value="not_yet">Not Yet Incorporated</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Incorporation Country</label>
                <input type="text" name="incorporationCountry" value={formData.incorporationCountry} onChange={handleInputChange} placeholder="United States" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Founded Date</label>
                <input type="text" name="foundedDate" value={formData.foundedDate} onChange={handleInputChange} placeholder="January 2024" className="form-input" />
              </div>
            </div>
          </Fade>

          {/* Business Details */}
          <Fade delay={0.2} className="form-section">
            <div className="section-label">03</div>
            <h2 className="section-title">Business Details</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Industry <span className="required">*</span></label>
                <select name="industry" value={formData.industry} onChange={handleInputChange} required className="form-select">
                  <option value="">Select industry</option>
                  <option value="FinTech">FinTech</option>
                  <option value="HealthTech">HealthTech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="EdTech">EdTech</option>
                  <option value="CleanTech">CleanTech</option>
                  <option value="PropTech">PropTech</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Current Stage <span className="required">*</span></label>
                <select name="stage" value={formData.stage} onChange={handleInputChange} required className="form-select">
                  <option value="">Select stage</option>
                  <option value="idea">Idea</option>
                  <option value="prototype">Prototype</option>
                  <option value="mvp">MVP</option>
                  <option value="early_revenue">Early Revenue</option>
                  <option value="growth">Growth</option>
                </select>
              </div>
              <div className="form-field full">
                <label className="form-label">
                  <Lightbulb style={{ width: 16, height: 16 }} />
                  Problem Statement <span className="required">*</span>
                </label>
                <textarea name="problemStatement" value={formData.problemStatement} onChange={handleInputChange} required placeholder="What problem are you solving? Why does it matter?" className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Your Solution <span className="required">*</span></label>
                <textarea name="solution" value={formData.solution} onChange={handleInputChange} required placeholder="How does your product/service solve this problem?" className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Unique Value Proposition <span className="required">*</span></label>
                <textarea name="uniqueValueProposition" value={formData.uniqueValueProposition} onChange={handleInputChange} required placeholder="What makes you different from competitors?" className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Target Market <span className="required">*</span></label>
                <textarea name="targetMarket" value={formData.targetMarket} onChange={handleInputChange} required placeholder="Who are your customers? Demographics, psychographics, use cases..." className="form-textarea" />
              </div>
              <div className="form-field">
                <label className="form-label">Market Size (TAM/SAM/SOM)</label>
                <input type="text" name="marketSize" value={formData.marketSize} onChange={handleInputChange} placeholder="TAM: $10B, SAM: $2B" className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Competitive Advantage / Moat</label>
                <textarea name="competitiveAdvantage" value={formData.competitiveAdvantage} onChange={handleInputChange} placeholder="Network effects, proprietary data, patents, switching costs?" className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Traction & Metrics */}
          <Fade delay={0.25} className="form-section alt">
            <div className="section-label">04</div>
            <h2 className="section-title">Traction & Metrics</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Current Revenue (MRR/ARR)</label>
                <input type="text" name="currentRevenue" value={formData.currentRevenue} onChange={handleInputChange} placeholder="$50K MRR" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Revenue Growth</label>
                <input type="text" name="revenueGrowth" value={formData.revenueGrowth} onChange={handleInputChange} placeholder="20% MoM" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Number of Customers</label>
                <input type="text" name="numberOfCustomers" value={formData.numberOfCustomers} onChange={handleInputChange} placeholder="500 paying customers" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">User Metrics</label>
                <input type="text" name="userMetrics" value={formData.userMetrics} onChange={handleInputChange} placeholder="10K MAU, 70% retention" className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Key Milestones & Achievements <span className="required">*</span></label>
                <textarea name="keyMilestones" value={formData.keyMilestones} onChange={handleInputChange} required placeholder="Product launches, partnerships, awards, key hires..." className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Funding */}
          <Fade delay={0.3} className="form-section">
            <div className="section-label">05</div>
            <h2 className="section-title">Funding</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Funding Stage <span className="required">*</span></label>
                <select name="fundingStage" value={formData.fundingStage} onChange={handleInputChange} required className="form-select">
                  <option value="">Select funding stage</option>
                  <option value="pre_seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series_a">Series A</option>
                  <option value="series_b">Series B</option>
                  <option value="series_c_plus">Series C+</option>
                </select>
              </div>
              <div className="form-field">
                <label className="form-label">Funding Amount Seeking <span className="required">*</span></label>
                <input type="text" name="fundingAmount" value={formData.fundingAmount} onChange={handleInputChange} required placeholder="$2M - $5M" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Previous Funding Raised</label>
                <input type="text" name="previousFunding" value={formData.previousFunding} onChange={handleInputChange} placeholder="$500K pre-seed" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Current Investors</label>
                <input type="text" name="currentInvestors" value={formData.currentInvestors} onChange={handleInputChange} placeholder="Y Combinator, angels" className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Use of Funds <span className="required">*</span></label>
                <textarea name="useOfFunds" value={formData.useOfFunds} onChange={handleInputChange} required placeholder="Hiring, marketing, product development..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Current/Target Valuation</label>
                <input type="text" name="valuation" value={formData.valuation} onChange={handleInputChange} placeholder="$15M post-money" className="form-input" />
              </div>
            </div>
          </Fade>

          {/* Team */}
          <Fade delay={0.35} className="form-section alt">
            <div className="section-label">06</div>
            <h2 className="section-title">Team</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Team Size <span className="required">*</span></label>
                <input type="text" name="teamSize" value={formData.teamSize} onChange={handleInputChange} required placeholder="5 full-time" className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Key Team Members <span className="required">*</span></label>
                <textarea name="keyTeamMembers" value={formData.keyTeamMembers} onChange={handleInputChange} required placeholder="List key team members, roles, backgrounds..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Advisors</label>
                <textarea name="advisors" value={formData.advisors} onChange={handleInputChange} placeholder="List advisors and their expertise..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Hiring Plans</label>
                <textarea name="hiringPlans" value={formData.hiringPlans} onChange={handleInputChange} placeholder="Key hiring needs over next 12-18 months..." className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Product & Technology */}
          <Fade delay={0.4} className="form-section">
            <div className="section-label">07</div>
            <h2 className="section-title">Product & Technology</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">
                  <Code style={{ width: 16, height: 16 }} />
                  Product Description <span className="required">*</span>
                </label>
                <textarea name="productDescription" value={formData.productDescription} onChange={handleInputChange} required placeholder="Describe your product, features, how it works..." className="form-textarea" />
              </div>
              <div className="form-field">
                <label className="form-label">Technology Stack</label>
                <input type="text" name="technologyStack" value={formData.technologyStack} onChange={handleInputChange} placeholder="React, Node.js, PostgreSQL, AWS" className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Intellectual Property</label>
                <textarea name="intellectualProperty" value={formData.intellectualProperty} onChange={handleInputChange} placeholder="Patents, proprietary technology, trade secrets..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Product Roadmap</label>
                <textarea name="productRoadmap" value={formData.productRoadmap} onChange={handleInputChange} placeholder="What's planned for next 12-24 months?" className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Go-to-Market */}
          <Fade delay={0.45} className="form-section alt">
            <div className="section-label">08</div>
            <h2 className="section-title">Go-to-Market Strategy</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">
                  <BarChart3 style={{ width: 16, height: 16 }} />
                  Customer Acquisition <span className="required">*</span>
                </label>
                <textarea name="customerAcquisition" value={formData.customerAcquisition} onChange={handleInputChange} required placeholder="How do you acquire customers? CAC, channels..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Sales Strategy <span className="required">*</span></label>
                <textarea name="salesStrategy" value={formData.salesStrategy} onChange={handleInputChange} required placeholder="Direct sales, self-serve, enterprise, partner-led..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Marketing Strategy</label>
                <textarea name="marketingStrategy" value={formData.marketingStrategy} onChange={handleInputChange} placeholder="Content, paid ads, SEO, PR, events..." className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Partnership Strategy</label>
                <textarea name="partnershipStrategy" value={formData.partnershipStrategy} onChange={handleInputChange} placeholder="Strategic partnerships, distribution channels..." className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Financial Projections */}
          <Fade delay={0.5} className="form-section">
            <div className="section-label">09</div>
            <h2 className="section-title">Financial Projections</h2>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label">Projected Revenue (3 years)</label>
                <input type="text" name="projectedRevenue" value={formData.projectedRevenue} onChange={handleInputChange} placeholder="Y1: $1M, Y2: $5M" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Monthly Burn Rate</label>
                <input type="text" name="burnRate" value={formData.burnRate} onChange={handleInputChange} placeholder="$80K/month" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Current Runway</label>
                <input type="text" name="runway" value={formData.runway} onChange={handleInputChange} placeholder="18 months" className="form-input" />
              </div>
              <div className="form-field">
                <label className="form-label">Break-Even Timeline</label>
                <input type="text" name="breakEvenTimeline" value={formData.breakEvenTimeline} onChange={handleInputChange} placeholder="Q3 2026" className="form-input" />
              </div>
            </div>
          </Fade>

          {/* Documents */}
          <Fade delay={0.55} className="form-section alt">
            <div className="section-label">10</div>
            <h2 className="section-title">Documents</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">Pitch Deck <span className="required">*</span></label>
                <FileUpload
                  name="pitchDeck"
                  label="Upload pitch deck (PDF, PPT, or Keynote)"
                  required
                  value={formData.pitchDeck}
                  onChange={(file: any) => handleFileChange("pitchDeck", file)}
                />
              </div>
              <div className="form-field full">
                <label className="form-label">Financial Model (Optional)</label>
                <FileUpload
                  name="financialModel"
                  label="Upload financial model (Excel, Google Sheets, or PDF)"
                  value={formData.financialModel}
                  onChange={(file: any) => handleFileChange("financialModel", file)}
                />
              </div>
              <div className="form-field full">
                <label className="form-label">Business Plan (Optional)</label>
                <FileUpload
                  name="businessPlan"
                  label="Upload business plan or executive summary"
                  value={formData.businessPlan}
                  onChange={(file: any) => handleFileChange("businessPlan", file)}
                />
              </div>
              <div className="form-field full">
                <label className="form-label">Product Demo / Screenshots (Optional)</label>
                <FileUpload
                  name="productDemo"
                  label="Upload demo video, screenshots, or prototype link"
                  value={formData.productDemo}
                  onChange={(file: any) => handleFileChange("productDemo", file)}
                />
              </div>
            </div>
          </Fade>

          {/* Additional Information */}
          <Fade delay={0.6} className="form-section">
            <div className="section-label">11</div>
            <h2 className="section-title">Additional Information</h2>
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label">
                  <Rocket style={{ width: 16, height: 16 }} />
                  Why MUSEDATA? <span className="required">*</span>
                </label>
                <textarea name="whyUs" value={formData.whyUs} onChange={handleInputChange} required placeholder="Why do you want MUSEDATA as your investor?" className="form-textarea" />
              </div>
              <div className="form-field">
                <label className="form-label">How did you hear about us?</label>
                <input type="text" name="referralSource" value={formData.referralSource} onChange={handleInputChange} placeholder="Portfolio company, conference, referral..." className="form-input" />
              </div>
              <div className="form-field full">
                <label className="form-label">Exit Strategy / Vision</label>
                <textarea name="exitStrategy" value={formData.exitStrategy} onChange={handleInputChange} placeholder="IPO, acquisition, building for the long haul?" className="form-textarea" />
              </div>
              <div className="form-field full">
                <label className="form-label">Current Challenges / Risks</label>
                <textarea name="challenges" value={formData.challenges} onChange={handleInputChange} placeholder="What are the biggest challenges you're facing?" className="form-textarea" />
              </div>
            </div>
          </Fade>

          {/* Terms & Submit */}
          <Fade delay={0.65} className="form-section alt" style={{ paddingBottom: 40 }}>
            <div className="terms-box">
              <div className="terms-check">
                <input type="checkbox" name="terms" id="terms" checked={formData.terms} onChange={handleInputChange} required />
                <label htmlFor="terms" className="terms-label">
                  I agree to the <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>. I understand that all information provided will be kept confidential and used solely for investment evaluation purposes. <span className="required">*</span>
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
                <>
                  Submit Application <ArrowRight style={{ width: 16, height: 16 }} />
                </>
              )}
            </button>
            <p className="submit-note">Our investment team will review your application and reach out within 2 weeks</p>
          </Fade>
        </form>
      </main>

      {/* Footer */}
    <footer>
        <div className="w">
          <div className="footer-slim">
            <a href="#" className="footer-logo">
              <div className="footer-mark">
                <img src={LOGO_B64} alt="MUSEDATA logo" />
              </div>
              <span className="footer-word">MUSEDATA</span>
            </a>
            <div className="footer-right">
              <div className="footer-links-row">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Disclosures</a>
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