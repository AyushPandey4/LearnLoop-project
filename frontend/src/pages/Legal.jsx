import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";

export function Legal() {
  const location = useLocation();
  const { user } = useAuth();
  const isPrivacy = location.pathname === "/privacy";
  const [activeSection, setActiveSection] = useState("");

  const termsSections = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "purpose", title: "2. Description of Service" },
    { id: "youtube-api", title: "3. YouTube API & Third-Party Content" },
    { id: "accounts", title: "4. User Accounts & Google Auth" },
    { id: "ip-notes", title: "5. User Notes & Ownership Guarantee" },
    { id: "acceptable-use", title: "6. Acceptable Use Policy" },
    { id: "availability", title: "7. Availability & External Dependency" },
    { id: "warranties", title: "8. Disclaimer of Warranties" },
    { id: "liability", title: "9. Limitation of Liability" },
    { id: "termination", title: "10. Account Deletion & Retention" },
    { id: "changes", title: "11. Amendments to Terms" },
    { id: "contact", title: "12. Contact Information" },
  ];

  const privacySections = [
    { id: "collect", title: "1. Information We Collect" },
    { id: "use", title: "2. How We Use Your Information" },
    { id: "youtube-privacy", title: "3. YouTube API Compliance" },
    { id: "cookies", title: "4. Cookies & Session Storage" },
    { id: "sharing", title: "5. No Selling or Commercial Sharing" },
    { id: "security", title: "6. Security & Data Protection" },
    { id: "rights", title: "7. Your Rights & Data Deletion" },
    { id: "contact-privacy", title: "8. Privacy Inquiries" },
  ];

  const sections = isPrivacy ? privacySections : termsSections;

  return (
    <Layout>
      <div style={{ maxWidth: "1080px", margin: "0 auto", paddingBottom: "60px" }}>
        
        {/* ── Breadcrumb & Top Bar ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "14px" }}>
          <Link
            to={user ? "/dashboard" : "/"}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--color-text-primary)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--color-text-secondary)"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {user ? "Back to Dashboard" : "Back to LearnLoop"}
          </Link>

          {/* Legal Switcher Pills */}
          <div style={{
            display: "inline-flex",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "3px",
            gap: "3px",
          }}>
            <Link
              to="/terms"
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "500",
                textDecoration: "none",
                borderRadius: "var(--radius-sm)",
                background: !isPrivacy ? "var(--color-surface-2)" : "transparent",
                color: !isPrivacy ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                border: !isPrivacy ? "1px solid var(--color-border)" : "1px solid transparent",
                transition: "all 0.12s",
              }}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              style={{
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "500",
                textDecoration: "none",
                borderRadius: "var(--radius-sm)",
                background: isPrivacy ? "var(--color-surface-2)" : "transparent",
                color: isPrivacy ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                border: isPrivacy ? "1px solid var(--color-border)" : "1px solid transparent",
                transition: "all 0.12s",
              }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* ── Document Header ── */}
        <div style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-xl)",
          padding: "32px",
          marginBottom: "28px",
        }}>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "3px 9px",
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-sm)",
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--color-text-muted)",
            marginBottom: "14px",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--color-accent)" }} />
            Effective Date: September 2026 · Version 2.4
          </div>

          <h1 style={{
            fontSize: "30px",
            fontWeight: "700",
            color: "var(--color-text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "10px",
          }}>
            {isPrivacy ? "Privacy Policy" : "Terms of Service"}
          </h1>

          <p style={{
            fontSize: "14px",
            color: "var(--color-text-secondary)",
            lineHeight: "1.6",
            maxWidth: "760px",
            marginBottom: "24px",
          }}>
            {isPrivacy
              ? "LearnLoop is designed with a strict privacy-first architecture. This Privacy Policy details the exact data we collect, how it is stored securely, and your absolute control over your study data."
              : "These Terms of Service govern your access to and use of LearnLoop. By signing in with your Google account or using LearnLoop, you agree to be bound by these Terms and the YouTube API Terms of Service."}
          </p>

          {/* Quick Summary Box */}
          <div style={{
            background: "var(--color-surface-2)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            padding: "18px 20px",
          }}>
            <div style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-muted)", marginBottom: "10px", fontFamily: "var(--font-mono)" }}>
              Summary of Key Commitments
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "14px",
            }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "2px" }}>
                  100% Note Ownership
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
                  All notes, timestamps, and study markdown you write remain your exclusive intellectual property.
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "2px" }}>
                  YouTube API Compliance
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
                  Public metadata is retrieved via official YouTube APIs. We never store or rip copyrighted video files.
                </div>
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--color-text-primary)", marginBottom: "2px" }}>
                  Zero Data Selling
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
                  We never sell your personal information or use your notes to train commercial AI models.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Document Body with Sidebar Table of Contents ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr",
          gap: "32px",
          alignItems: "start",
        }}>

          {/* Sticky Left TOC */}
          <aside style={{
            position: "sticky",
            top: "80px",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}>
            <div style={{
              fontSize: "11px",
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--color-text-muted)",
              marginBottom: "10px",
              fontFamily: "var(--font-mono)",
            }}>
              Table of Contents
            </div>
            {sections.map(sec => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  fontSize: "12px",
                  color: activeSection === sec.id ? "var(--color-accent)" : "var(--color-text-secondary)",
                  textDecoration: "none",
                  padding: "5px 8px",
                  borderRadius: "var(--radius-sm)",
                  background: activeSection === sec.id ? "var(--color-accent-subtle)" : "transparent",
                  transition: "all 0.12s",
                  display: "block",
                  lineHeight: "1.4",
                }}
                onMouseEnter={e => { if (activeSection !== sec.id) e.currentTarget.style.color = "var(--color-text-primary)"; }}
                onMouseLeave={e => { if (activeSection !== sec.id) e.currentTarget.style.color = "var(--color-text-secondary)"; }}
              >
                {sec.title}
              </a>
            ))}
          </aside>

          {/* Right: Legal Clauses Content */}
          <div style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-lg)",
            padding: "36px 32px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
          }}>

            {!isPrivacy ? (
              /* ── TERMS OF SERVICE CONTENT ── */
              <>
                <section id="acceptance" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    1. Acceptance of Terms
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    Welcome to LearnLoop ("we", "us", or "our"). By accessing or using the LearnLoop platform, website, and related services, you ("User" or "you") agree that you have read, understood, and accept these Terms of Service in full, along with our Privacy Policy.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    If you do not agree with any provision set forth in these Terms, you must immediately discontinue your use of LearnLoop.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="purpose" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    2. Description of Service
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    LearnLoop is an educational organization and personal productivity workspace. It allows learners to import public educational YouTube playlists, organize them into structured curricula ("Learning Paths"), track progress video-by-video, write timestamped Markdown notes while watching, and search notes across their personal library.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    LearnLoop is designed solely as an organization and study aid; we do not host, re-upload, broadcast, or store video files.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="youtube-api" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    3. YouTube API Services & Third-Party Content
                  </h2>
                  <div style={{
                    padding: "14px 16px",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "14px",
                  }}>
                    <p style={{ fontSize: "13px", color: "var(--color-text-primary)", lineHeight: "1.6", margin: 0 }}>
                      <strong>Mandatory YouTube Notice:</strong> LearnLoop utilizes YouTube Data API Services. By using LearnLoop to query or view YouTube content, you explicitly agree to be bound by the{" "}
                      <a
                        href="https://www.youtube.com/t/terms"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-accent)", textDecoration: "underline" }}
                      >
                        YouTube Terms of Service
                      </a>{" "}
                      and acknowledge the{" "}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--color-accent)", textDecoration: "underline" }}
                      >
                        Google Privacy Policy
                      </a>.
                    </p>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    All video titles, channel names, thumbnails, and audio/video media are retrieved dynamically from YouTube and remain the exclusive intellectual property and copyright of their respective creators and Google LLC.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    LearnLoop streams content strictly via YouTube's official embedded player. We do not provide mechanisms to download, rip, strip advertisements from, or circumvent YouTube's DRM or monetization controls.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="accounts" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    4. User Accounts & Google Authentication
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    Authentication on LearnLoop is handled exclusively via Google OAuth 2.0. We never request, process, or store your Google account password.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    You are responsible for maintaining the confidentiality of your Google account credentials and are fully liable for all activities occurring under your LearnLoop session. You agree to notify us immediately if you discover any unauthorized use of your account.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="ip-notes" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    5. User Notes & Ownership Guarantee
                  </h2>
                  <div style={{
                    padding: "14px 16px",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-success-border, var(--color-border))",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "14px",
                  }}>
                    <p style={{ fontSize: "13px", color: "var(--color-text-primary)", lineHeight: "1.6", margin: 0 }}>
                      <strong style={{ color: "var(--color-success)" }}>Ownership Guarantee:</strong> You retain full, unencumbered ownership and copyright of all notes, Markdown summaries, annotations, and timestamps authored by you on LearnLoop.
                    </p>
                  </div>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    You grant LearnLoop only the limited, non-exclusive, revocable license strictly necessary to store, backup, index, and retrieve your notes for display within your private account.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    We do not claim ownership of your notes, we will not publish your private notes, and we will never sell or feed your notes into third-party AI training datasets.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="acceptable-use" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    6. Acceptable Use Policy
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    When using LearnLoop, you agree that you will not:
                  </p>
                  <ul style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li>Attempt to bypass, defeat, or manipulate API rate limits or authentication cookies.</li>
                    <li>Use automated scraping bots, scripts, or crawlers to extract data without authorization.</li>
                    <li>Store or transmit malicious software, viruses, or any code designed to disrupt system operation.</li>
                    <li>Attempt to gain unauthorized access to our database, servers, or other users' private accounts.</li>
                    <li>Use LearnLoop for any illegal or copyright-infringing purpose.</li>
                  </ul>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="availability" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    7. Availability & External Dependency
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    LearnLoop depends directly on YouTube's public API and network infrastructure. If a video creator modifies, unlists, or deletes a playlist or video on YouTube, LearnLoop cannot guarantee ongoing playback of that item.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    We reserve the right to modify, patch, improve, or temporarily suspend aspects of the service for routine maintenance or upgrades.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="warranties" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    8. Disclaimer of Warranties
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    LEARNLOOP IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="liability" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    9. Limitation of Liability
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL LEARNLOOP, ITS DEVELOPERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR STUDY MATERIALS, RESULTING FROM YOUR ACCESS TO OR INABILITY TO ACCESS THE SERVICE.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="termination" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    10. Account Deletion & Data Retention
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    You have the right to delete your LearnLoop account at any time. Upon receiving an account deletion request or executing an account purge, all your learning paths, custom category tags, and video notes will be permanently erased from our operational database.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="changes" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    11. Amendments to Terms
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    We may update these Terms from time to time. When changes are published, the "Effective Date" at the top of this document will be updated. Your continued use of LearnLoop after any modifications constitutes acceptance of the new Terms.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="contact" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    12. Contact Information
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    If you have questions, inquiries, or legal concerns regarding these Terms of Service, please reach out via our GitHub repository issues.
                  </p>
                </section>
              </>
            ) : (
              /* ── PRIVACY POLICY CONTENT ── */
              <>
                <section id="collect" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    1. Information We Collect
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    We only collect data strictly necessary to provide learning organization features:
                  </p>
                  <ul style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <li><strong>Account Profile Data:</strong> Full Name, Email Address, and Google Avatar URL provided via Google OAuth 2.0.</li>
                    <li><strong>Learning Paths:</strong> URLs of public YouTube playlists you import, custom category classifications, and path titles.</li>
                    <li><strong>Progress Statuses:</strong> Video completion states (Queue, Watching, Done) for playlists in your library.</li>
                    <li><strong>Video Notes:</strong> Private Markdown notes and video timestamps typed by you during your study sessions.</li>
                  </ul>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="use" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    2. How We Use Your Information
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    Your data is used solely to authenticate your identity across browser sessions, calculate path completion metrics, auto-save your notes in real time, and enable lightning-fast full-text search across your personal notes database.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="youtube-privacy" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    3. YouTube API Compliance
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7", marginBottom: "12px" }}>
                    LearnLoop queries the official YouTube Data API v3 to read public playlist metadata. We comply fully with the Google API Services User Data Policy.
                  </p>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    Users can revoke LearnLoop's access to their Google account data at any time via the{" "}
                    <a
                      href="https://security.google.com/settings/security/permissions"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--color-accent)", textDecoration: "underline" }}
                    >
                      Google Security Settings page
                    </a>.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="cookies" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    4. Cookies & Session Storage
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    We use secure, HTTP-only authentication cookies to maintain your active login session. We do not use third-party tracking cookies, advertising pixels, or analytics trackers.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="sharing" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    5. No Selling or Commercial Sharing
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    We do not sell, rent, lease, or monetize your personal data, imported playlists, or notes. Your notes are private to your account.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="security" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    6. Security & Data Protection
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    All communication between your browser and LearnLoop servers is encrypted using Transport Layer Security (TLS/HTTPS). Database connections are secured with strict access credentials and authentication gates.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="rights" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    7. Your Rights & Data Deletion
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    You have the right to request a complete copy of your notes or request full deletion of your user account and all associated records. Requests can be submitted directly through our contact email.
                  </p>
                </section>

                <div style={{ height: "1px", background: "var(--color-border)" }} />

                <section id="contact-privacy" style={{ scrollMarginTop: "90px" }}>
                  <h2 style={{ fontSize: "17px", fontWeight: "700", color: "var(--color-text-primary)", marginBottom: "12px" }}>
                    8. Privacy Inquiries
                  </h2>
                  <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: "1.7" }}>
                    For any privacy questions or requests regarding your data, contact us at privacy@learnloop.app.
                  </p>
                </section>
              </>
            )}

          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Legal;
