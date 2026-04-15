"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter, useParams } from "next/navigation";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";
import Link from "next/link";

export default function JoinTeamPage() {
  const { inviteCode } = useParams() as { inviteCode: string };
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const regStatus = useQuery(api.sprintJudging.getRegistrationStatus, 
    userEmail ? { email: userEmail } : "skip"
  );

  const joinTeam = useMutation(api.sprintTeams.joinTeamByInvite);

  useEffect(() => {
    async function performJoin() {
      if (!isLoaded || regStatus === undefined) return;

      if (!regStatus || regStatus.type !== "participant") {
        setError("Only registered participants can join teams. Please register for the sprint first.");
        return;
      }

      try {
        const participantId = regStatus.data._id;
        const teamId = await joinTeam({
          inviteCode,
          participantId: participantId as any,
        });
        setSuccess(true);
        setTimeout(() => {
          router.push(`/harvard/team-room/${teamId}`);
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to join team");
      }
    }

    performJoin();
  }, [isLoaded, regStatus, inviteCode, joinTeam, router]);

  return (
    <>
      <style>{`
        .join-body { background: #092e42; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; color: #fff; }
        .join-card { max-width: 500px; width: 100%; background: #fff; color: #3a5a6a; padding: 4rem 3rem; text-align: center; border-top: 4px solid #39a2ca; }
        .icon { font-size: 3rem; margin-bottom: 2rem; }
        .h2 { font-family: 'Inter', sans-serif; font-size: 1.5rem; color: #092e42; margin-bottom: 1rem; }
        .p { line-height: 1.6; margin-bottom: 2rem; }
        .btn { display: inline-block; background: #39a2ca; color: #fff; padding: 1rem 2rem; text-decoration: none; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
      `}</style>
      <UnifiedNavbar />
      <div className="join-body">
        <div className="join-card">
          {success ? (
            <>
              <div className="icon">🎉</div>
              <h2 className="h2">Success!</h2>
              <p className="p">You have joined the team. Redirecting you to the Team Room...</p>
            </>
          ) : error ? (
            <>
              <div className="icon">⚠️</div>
              <h2 className="h2">Membership Error</h2>
              <p className="p">{error}</p>
              {error.includes("register") ? (
                <Link href="/harvard/student-reg" className="btn">Register Now</Link>
              ) : (
                <Link href="/harvard" className="btn">Back to Dashboard</Link>
              )}
            </>
          ) : (
            <>
              <div className="icon">⏳</div>
              <h2 className="h2">Validating Invite</h2>
              <p className="p">Please wait while we confirm your registration and the team details...</p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
