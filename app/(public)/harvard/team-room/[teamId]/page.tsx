"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";
import Link from "next/link";
import { LucideCopy, LucideExternalLink, LucideCheckCircle, LucideShieldCheck } from "lucide-react";

export default function TeamRoomPage() {
  const { teamId } = useParams() as { teamId: string };
  const { user, isLoaded } = useUser();
  const router = useRouter();
  
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(10);
  const [note, setNote] = useState("");
  const [submittingJudge, setSubmittingJudge] = useState(false);

  const team = useQuery(api.sprintTeams.getTeamInfo, { teamId: teamId as any });
  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const regStatus = useQuery(api.sprintJudging.getRegistrationStatus, 
    userEmail ? { email: userEmail } : "skip"
  );

  const updateProject = useMutation(api.sprintTeams.updateProject);
  const submitRating = useMutation(api.sprintJudging.submitRating);

  // Edit State
  const [editForm, setEditForm] = useState({ name: "", description: "", videoUrl: "", githubUrl: "" });

  useEffect(() => {
    if (team) {
      setEditForm({
        name: team.name,
        description: team.description,
        videoUrl: team.videoUrl,
        githubUrl: team.githubUrl
      });
    }
  }, [team]);

  const isLeader = regStatus?.type === "participant" && team?.leaderId === regStatus?.data?._id;
  const isSponsor = regStatus?.type === "sponsor";
  
  const inviteUrl = typeof window !== "undefined" ? `${window.location.origin}/harvard/join/${team?.inviteCode}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regStatus || regStatus.type !== "participant") return;
    const participantId = regStatus.data._id;
    try {
      await updateProject({
        teamId: teamId as any,
        leaderId: participantId as any,
        ...editForm
      });
      setEditing(false);
    } catch (err) {
      alert("Failed to update project");
    }
  };

  const handleJudge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regStatus || regStatus.type !== "sponsor") return;
    const sponsorId = regStatus.data._id;
    setSubmittingJudge(true);
    try {
      await submitRating({
        teamId: teamId as any,
        sponsorId: sponsorId as any,
        rating,
        note
      });
      alert("Rating submitted successfully");
      setNote("");
    } catch (err) {
      alert("Failed to submit rating");
    } finally {
      setSubmittingJudge(false);
    }
  };

  if (!isLoaded || team === undefined) return null;
  if (!team) return <div className="p-20 text-center">Team not found</div>;

  return (
    <>
      <style>{`
        .tr-body { background: #f1f7fa; min-height: 100vh; padding: 120px 2rem 5rem; color: #3a5a6a; }
        .tr-container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 1fr 340px; gap: 2rem; }
        @media(max-width: 900px) { .tr-container { grid-template-columns: 1fr; } }
        
        .section-card { background: #fff; border: 1px solid #d4e4eb; padding: 2.5rem; margin-bottom: 2rem; }
        .badge { display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #39a2ca; margin-bottom: 1rem; }
        .title { font-family: 'Inter', sans-serif; font-size: 2.5rem; font-weight: 300; color: #092e42; margin-bottom: 1.5rem; letter-spacing: -0.02em; }
        .desc { font-size: 0.9375rem; line-height: 1.8; color: #3a5a6a; margin-bottom: 2rem; white-space: pre-wrap; }
        
        .meta-row { display: flex; gap: 2rem; padding: 1.5rem 0; border-top: 1px solid #d4e4eb; border-bottom: 1px solid #d4e4eb; margin-bottom: 2rem; }
        .meta-item { display: flex; align-items: center; gap: 0.75rem; font-size: 0.8rem; text-decoration: none; color: #092e42; font-weight: 500; }
        .meta-item:hover { color: #39a2ca; }

        .sidebar-h { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #7a9daa; margin-bottom: 1.25rem; border-bottom: 1px solid #d4e4eb; padding-bottom: 0.5rem; }
        .member-item { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
        .member-avatar { width: 32px; height: 32px; background: #092e42; color: #fff; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.8rem; font-weight: 700; }
        .member-name { font-size: 0.875rem; color: #0d2b3a; font-weight: 500; }
        .member-role { font-size: 0.7rem; color: #7a9daa; }

        .invite-box { background: #092e42; color: #fff; padding: 1.5rem; border-radius: 2px; }
        .invite-url { font-family: monospace; font-size: 0.7rem; background: rgba(255,255,255,0.1); padding: 0.75rem; word-break: break-all; margin: 1rem 0; display: block; }
        .btn-copy { background: #39a2ca; color: #fff; border: none; width: 100%; padding: 0.75rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; }

        .feedback-item { padding: 1.5rem; border: 1px solid #d4e4eb; background: #f9fcfe; margin-bottom: 1rem; }
        .feedback-n { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: #39a2ca; margin-bottom: 0.5rem; }
        .feedback-mark { font-size: 1.5rem; font-weight: 300; color: #092e42; margin-bottom: 0.5rem; }
        .feedback-note { font-size: 0.875rem; color: #3a5a6a; line-height: 1.6; font-style: italic; }

        .judge-input { width: 100%; padding: 0.875rem; border: 1px solid #d4e4eb; margin-bottom: 1rem; outline: none; }
        .slider-grid { display: grid; grid-template-columns: repeat(10, 1fr); gap: 2px; margin-bottom: 1.5rem; }
        .slider-n { height: 32px; display: flex; align-items: center; justify-content: center; background: #fff; border: 1px solid #d4e4eb; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; }
        .slider-n.on { background: #39a2ca; color: #fff; border-color: #39a2ca; }
        
        .footer-cta { margin-top: 3rem; text-align: center; }
        .btn-ghost { font-size: 0.7rem; font-weight: 600; text-transform: uppercase; color: #39a2ca; text-decoration: none; padding: 0.5rem 1rem; border: 1px solid #39a2ca; transition: all 0.2s; }
        .btn-ghost:hover { background: #39a2ca; color: #fff; }

        input[type="text"], textarea { width: 100%; padding: 1rem; border: 1px solid #d4e4eb; margin-bottom: 1.5rem; outline: none; font-family: inherit; }
      `}</style>

      <UnifiedNavbar />

      <div className="tr-body">
        <div className="tr-container">
          <main>
            <div className="section-card">
              {editing ? (
                <form onSubmit={handleUpdate}>
                  <label style={{display:'block', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', color:'#7a9daa', marginBottom:'.5rem'}}>Team Name</label>
                  <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                  
                  <label style={{display:'block', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', color:'#7a9daa', marginBottom:'.5rem'}}>Description / Vision</label>
                  <textarea rows={6} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
                  
                  <label style={{display:'block', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', color:'#7a9daa', marginBottom:'.5rem'}}>Video Demo URL</label>
                  <input value={editForm.videoUrl} onChange={e => setEditForm({...editForm, videoUrl: e.target.value})} placeholder="Youtube or Google Drive link" />
                  
                  <label style={{display:'block', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', color:'#7a9daa', marginBottom:'.5rem'}}>GitHub Repository URL</label>
                  <input value={editForm.githubUrl} onChange={e => setEditForm({...editForm, githubUrl: e.target.value})} />
                  
                  <div style={{display:'flex', gap:'1rem'}}>
                    <button type="submit" className="btn-copy">Save Changes</button>
                    <button type="button" onClick={() => setEditing(false)} className="btn-copy" style={{background:'#7a9daa'}}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="badge"><LucideShieldCheck size={14} /> Registered Sprint Team</div>
                  <h1 className="title">{team.name}</h1>
                  <p className="desc">{team.description}</p>
                  
                  <div className="meta-row">
                    <a href={team.videoUrl || "#"} target="_blank" className="meta-item">
                      <LucideExternalLink size={16} /> Video Demo
                    </a>
                    <a href={team.githubUrl || "#"} target="_blank" className="meta-item">
                      <LucideExternalLink size={16} /> Source Code
                    </a>
                    {isLeader && (
                      <button onClick={() => setEditing(true)} style={{marginLeft:'auto', background:'none', border:'none', color:'#39a2ca', cursor:'pointer', fontWeight:600, fontSize:'.75rem'}}>
                        Edit Project Info
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="section-card">
              <div className="sidebar-h">Sponsor Evaluation</div>
              {team.feedback.length > 0 ? (
                team.feedback.map((f, i) => (
                  <div key={i} className="feedback-item">
                    <div className="feedback-n">{f.sponsorName}</div>
                    <div className="feedback-mark">{f.rating}/10</div>
                    <p className="feedback-note">"{f.note}"</p>
                  </div>
                ))
              ) : (
                <p style={{fontSize:'.875rem', color:'#7a9daa', fontStyle:'italic'}}>No feedback submitted yet.</p>
              )}
            </div>

            {isSponsor && (
              <div className="section-card" style={{borderTop:'4px solid #092e42'}}>
                <div className="sidebar-h">Submit Your Evaluation</div>
                <form onSubmit={handleJudge}>
                  <label style={{display:'block', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', color:'#7a9daa', marginBottom:'.75rem'}}>Rating (Institutional Grade)</label>
                  <div className="slider-grid">
                    {[1,2,3,4,5,6,7,8,9,10].map(n => (
                      <div 
                        key={n} 
                        className={`slider-n ${rating === n ? 'on' : ''}`}
                        onClick={() => setRating(n)}
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                  
                  <label style={{display:'block', fontSize:'.7rem', fontWeight:700, textTransform:'uppercase', color:'#7a9daa', marginBottom:'.75rem'}}>Evaluation Notes</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={note} 
                    onChange={e => setNote(e.target.value)}
                    placeholder="Provide specific feedback on build quality, depth of execution, and market viability..."
                  />
                  
                  <button className="btn-copy" disabled={submittingJudge} style={{background:'#092e42'}}>
                    {submittingJudge ? "Submitting..." : "Submit Mark & Note"}
                  </button>
                </form>
              </div>
            )}
          </main>

          <aside>
            <div className="section-card" style={{padding:'1.5rem'}}>
              <div className="sidebar-h">Project Members</div>
              {team.members.map((m: any) => (
                <div key={m._id} className="member-item">
                  <div className="member-avatar">{m.fullName.charAt(0)}</div>
                  <div>
                    <div className="member-name">{m.fullName}</div>
                    <div className="member-role">{m.institution}</div>
                  </div>
                </div>
              ))}
            </div>

            {isLeader && (
              <div className="invite-box">
                <div className="sidebar-h" style={{color:'#5997b0', borderColor:'rgba(255,255,255,0.1)'}}>Invite Colleagues</div>
                <p style={{fontSize:'.75rem', lineHeight:1.5, opacity:0.8}}>Share this unique link with registered students to bring them onto your team.</p>
                <span className="invite-url">{inviteUrl}</span>
                <button className="btn-copy" onClick={handleCopy}>
                  {copied ? <><LucideCheckCircle size={14}/> Copied!</> : <><LucideCopy size={14}/> Copy Link</>}
                </button>
              </div>
            )}
            
            <div className="footer-cta">
              <Link href="/harvard" className="btn-ghost">← Back to Dashboard</Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
