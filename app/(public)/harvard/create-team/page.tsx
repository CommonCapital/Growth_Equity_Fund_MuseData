"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";

export default function CreateTeamPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const regStatus = useQuery(api.sprintJudging.getRegistrationStatus, 
    userEmail ? { email: userEmail } : "skip"
  );

  const createTeam = useMutation(api.sprintTeams.createTeam);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!regStatus || regStatus.type !== "participant") {
      alert("Only registered participants can create teams.");
      return;
    }

    const participantId = regStatus.data._id;

    setSubmitting(true);
    try {
      const teamId = await createTeam({
        name,
        description,
        videoUrl: "",
        githubUrl: "",
        leaderId: participantId as any,
      });
      router.push(`/harvard/team-room/${teamId}`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create team");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isLoaded || regStatus === undefined) return null;

  return (
    <>
      <style>{`
        .create-body { background: #f1f7fa; min-height: 100vh; padding: 140px 2rem; }
        .create-card { max-width: 600px; margin: 0 auto; background: #fff; padding: 3rem; border: 1px solid #d4e4eb; border-top: 4px solid #39a2ca; }
        .h2 { font-family: 'Inter', sans-serif; font-size: 1.75rem; font-weight: 300; color: #092e42; margin-bottom: 2rem; }
        label { display: block; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: #7a9daa; margin-bottom: 0.5rem; }
        input, textarea { width: 100%; padding: 1rem; border: 1px solid #d4e4eb; margin-bottom: 1.5rem; outline: none; font-family: inherit; }
        input:focus, textarea:focus { border-color: #39a2ca; }
        .btn { background: #39a2ca; color: #fff; border: none; padding: 1rem 2rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; }
      `}</style>
      <UnifiedNavbar />
      <div className="create-body">
        <div className="create-card">
          <h2 className="h2">Form Your Team</h2>
          <form onSubmit={handleCreate}>
            <label>Team Name *</label>
            <input 
              required 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Neural Pioneers"
            />
            
            <label>Project Vision (Initial) *</label>
            <textarea 
              required 
              rows={4} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Briefly describe what you plan to build..."
            />
            
            <button className="btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create Team & Get Invite Link"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
