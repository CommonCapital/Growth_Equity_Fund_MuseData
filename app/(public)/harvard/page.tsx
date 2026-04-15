"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import UnifiedNavbar from "@/components/UnifiedNavbar/UnifiedNavbar";
import Link from "next/link";

export default function HarvardHubPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const userEmail = user?.primaryEmailAddress?.emailAddress;
  const regStatus = useQuery(api.sprintJudging.getRegistrationStatus, 
    userEmail ? { email: userEmail } : "skip"
  );
  
  const myTeam = useQuery(api.sprintTeams.getMyTeam, 
    regStatus?.type === "participant" ? { participantId: regStatus.data._id as any } : "skip"
  );

  const teamsForJudging = useQuery(api.sprintJudging.listTeamsForJudging, 
    regStatus?.type === "sponsor" ? {} : "skip"
  );

  useEffect(() => {
    if (isLoaded && !user) {
      // Not logged in, redirect to registration which will force login if needed
      router.push("/harvard/student-reg");
    } else if (isLoaded && regStatus === null) {
      // Not registered, send to registration
      router.push("/harvard/student-reg");
    } else if (regStatus !== undefined) {
      setLoading(false);
    }
  }, [isLoaded, user, regStatus, router]);

  let displayName = "";
  if (regStatus) {
    const data = regStatus.data as any;
    displayName = regStatus.type === "participant" ? data.fullName : data.contactName;
  }

  if (loading || !isLoaded) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#092e42", color: "#fff" }}>
        <p style={{ letterSpacing: "0.2em", textTransform: "uppercase", fontSize: "0.8rem" }}>Initializing Hub...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
          --deep: #092e42;
          --bright: #39a2ca;
          --section-bg: #f1f7fa;
          --divider: #d4e4eb;
          --h2-color: #0d2b3a;
          --body-color: #3a5a6a;
          --card-bg: #ffffff;
        }
        .hub-body {
          background: var(--section-bg);
          min-height: 100vh;
          padding: 120px 2rem 5rem;
        }
        .hub-container {
          max-width: 1000px;
          margin: 0 auto;
        }
        .hub-header {
          margin-bottom: 3rem;
          border-left: 4px solid var(--bright);
          padding-left: 1.5rem;
        }
        .hub-role {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--bright);
          margin-bottom: 0.5rem;
        }
        .hub-title {
          font-family: 'Inter', sans-serif;
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--deep);
          letter-spacing: -0.02em;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .card {
          background: var(--card-bg);
          border: 1px solid var(--divider);
          padding: 2.5rem;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(9, 46, 66, 0.06);
        }
        .card-h {
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--deep);
          margin-bottom: 1rem;
        }
        .card-p {
          font-size: 0.875rem;
          color: var(--body-color);
          line-height: 1.6;
          margin-bottom: 2rem;
          flex: 1;
        }
        .btn-action {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: var(--bright);
          color: #fff;
          text-decoration: none;
          padding: 0.875rem 1.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          width: fit-content;
        }
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          border: 1px dashed var(--divider);
          background: rgba(255,255,255,0.5);
        }
      `}</style>

      <UnifiedNavbar />

      <main className="hub-body">
        <div className="hub-container">
          <header className="hub-header">
            <div className="hub-role">
              {regStatus?.type === "participant" ? "Student Participant" : "Official Sponsor"} Dashboard
            </div>
            <h1 className="hub-title">Harvard AI Build Sprint</h1>
            <p style={{ marginTop: "1rem", color: "var(--body-color)" }}>
              Welcome back, {displayName}.
            </p>
          </header>

          {regStatus?.type === "participant" ? (
            <div className="participant-view">
              {myTeam ? (
                <div className="grid">
                  <div className="card">
                    <div className="card-h">Your Team Room</div>
                    <p className="card-p">
                      <strong>{myTeam.name}</strong><br />
                      Manage your project details, demo links, and team members here.
                    </p>
                    <Link href={`/harvard/team-room/${myTeam._id}`} className="btn-action">
                      Enter Team Room →
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <h3 className="card-h">You're not in a team yet</h3>
                  <p className="card-p">Create your own team and invite collaborators, or wait for an invite link from a teammate.</p>
                  <Link href="/harvard/create-team" className="btn-action">
                    Create New Team +
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="sponsor-view">
              <h2 style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "var(--deep)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Browse Teams for Judging
              </h2>
              <div className="grid">
                {teamsForJudging?.map((team) => (
                  <div key={team._id} className="card">
                    <div className="card-h">{team.name}</div>
                    <p className="card-p">
                      {team.description.substring(0, 120)}...
                    </p>
                    <div style={{ marginBottom: "1.5rem", fontSize: "0.75rem", color: "var(--body-color)" }}>
                      <strong>{team.members.length}</strong> Members
                    </div>
                    <Link href={`/harvard/team-room/${team._id}`} className="btn-action">
                      View & Rate →
                    </Link>
                  </div>
                ))}
              </div>
              {teamsForJudging?.length === 0 && (
                <div className="empty-state">
                  <p>No teams have submitted projects yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
