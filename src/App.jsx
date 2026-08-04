import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar
} from "recharts";

/* ============================================================
   SELF-CONTAINED ICONS
   (No external icon package dependency — avoids version-mismatch
   "Element type is invalid" errors across different sandboxes.)
   ============================================================ */
function makeIcon(paths) {
  return function Icon({ size = 16, color = "currentColor", style, ...rest }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style} {...rest}>
        {paths}
      </svg>
    );
  };
}
const LayoutDashboard = makeIcon(<><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></>);
const GanttChartSquare = makeIcon(<><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="14" y2="8"/><line x1="10" y1="12" x2="18" y2="12"/><line x1="7" y1="16" x2="15" y2="16"/></>);
const ListChecks = makeIcon(<><path d="M4 6l1.5 1.5L8 5"/><path d="M4 12l1.5 1.5L8 11"/><path d="M4 18l1.5 1.5L8 16"/><line x1="11" y1="6" x2="21" y2="6"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/></>);
const LineChartIcon = makeIcon(<><line x1="3" y1="21" x2="21" y2="21"/><line x1="3" y1="3" x2="3" y2="21"/><polyline points="6,15 10,9 14,13 20,5"/></>);
const Users = makeIcon(<><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15.5 14c2.6.3 4.5 2.4 4.5 5"/></>);
const ShieldAlert = makeIcon(<><path d="M12 3l8 3.5v5c0 5-3.4 8.4-8 9.5-4.6-1.1-8-4.5-8-9.5v-5L12 3z"/><line x1="12" y1="9" x2="12" y2="13.5"/><circle cx="12" cy="16.3" r="0.6" fill={"currentColor"}/></>);
const History = makeIcon(<><circle cx="12" cy="13" r="8"/><polyline points="12,9 12,13 15,15"/><path d="M5 3L3 6"/><path d="M19 3l2 3"/></>);
const SettingsIcon = makeIcon(<><circle cx="12" cy="12" r="3"/><path d="M19.4 13a7.9 7.9 0 000-2l2-1.6-2-3.4-2.4.6a8 8 0 00-1.7-1L15 3h-6l-.3 2.6a8 8 0 00-1.7 1l-2.4-.6-2 3.4L4.6 11a7.9 7.9 0 000 2l-2 1.6 2 3.4 2.4-.6a8 8 0 001.7 1L9 21h6l.3-2.6a8 8 0 001.7-1l2.4.6 2-3.4-2-1.6z"/></>);
const Plus = makeIcon(<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>);
const X = makeIcon(<><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></>);
const Search = makeIcon(<><circle cx="10.5" cy="10.5" r="6.5"/><line x1="20" y1="20" x2="15.3" y2="15.3"/></>);
const Download = makeIcon(<><path d="M12 3v12"/><polyline points="7,10 12,15 17,10"/><line x1="4" y1="20" x2="20" y2="20"/></>);
const Upload = makeIcon(<><path d="M12 15V3"/><polyline points="7,8 12,3 17,8"/><line x1="4" y1="20" x2="20" y2="20"/></>);
const Save = makeIcon(<><path d="M5 3h11l3 3v15H5z"/><rect x="8" y="3" width="7" height="5"/><rect x="7" y="13" width="10" height="7"/></>);
const ChevronDown = makeIcon(<polyline points="6,9 12,15 18,9"/>);
const ChevronRight = makeIcon(<polyline points="9,6 15,12 9,18"/>);
const ChevronUp = makeIcon(<polyline points="6,15 12,9 18,15"/>);
const GripVertical = makeIcon(<><circle cx="9" cy="6" r="1" fill="currentColor"/><circle cx="9" cy="12" r="1" fill="currentColor"/><circle cx="9" cy="18" r="1" fill="currentColor"/><circle cx="15" cy="6" r="1" fill="currentColor"/><circle cx="15" cy="12" r="1" fill="currentColor"/><circle cx="15" cy="18" r="1" fill="currentColor"/></>);
const Trash2 = makeIcon(<><line x1="4" y1="7" x2="20" y2="7"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>);
const Copy = makeIcon(<><rect x="9" y="9" width="12" height="12" rx="1.5"/><path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1"/></>);
const Archive = makeIcon(<><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8"/><line x1="10" y1="12" x2="14" y2="12"/></>);
const RotateCcw = makeIcon(<><path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8"/><polyline points="3,3 3,8 8,8"/></>);
const AlertTriangle = makeIcon(<><path d="M12 3.5l9.5 16.5H2.5z"/><line x1="12" y1="9.5" x2="12" y2="14"/><circle cx="12" cy="17" r="0.6" fill="currentColor"/></>);
const CheckCircle2 = makeIcon(<><circle cx="12" cy="12" r="9"/><polyline points="8,12.5 11,15.5 16,9"/></>);
const Clock = makeIcon(<><circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 16,14"/></>);
const Flag = makeIcon(<><path d="M5 21V4"/><path d="M5 4h13l-3 4.5L18 13H5"/></>);
const Link2 = makeIcon(<><path d="M9 15l6-6"/><path d="M14 5h3a4 4 0 010 8h-2"/><path d="M10 19H7a4 4 0 010-8h2"/></>);
const Filter = makeIcon(<path d="M4 5h16l-6 8v5l-4 2v-7z"/>);
const Printer = makeIcon(<><rect x="6" y="3" width="12" height="6"/><path d="M6 9H4a2 2 0 00-2 2v6a2 2 0 002 2h2"/><path d="M18 9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="7"/></>);
const ArrowLeft = makeIcon(<><line x1="20" y1="12" x2="4" y2="12"/><polyline points="10,6 4,12 10,18"/></>);
const TrendingUp = makeIcon(<><polyline points="3,17 9,11 13,15 21,6"/><polyline points="15,6 21,6 21,12"/></>);
const TrendingDown = makeIcon(<><polyline points="3,7 9,13 13,9 21,18"/><polyline points="15,18 21,18 21,12"/></>);
const Minus = makeIcon(<line x1="5" y1="12" x2="19" y2="12"/>);
function Circle({ size = 16, color = "currentColor", fill, style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...rest}>
      <circle cx="12" cy="12" r="9" fill={fill || "none"} stroke={fill ? "none" : color} strokeWidth="2" />
    </svg>
  );
}

/* ============================================================
   CONSTANTS & INITIAL DATA (authoritative: BA Dept Strategy PDF
   + OBJECTIVE 5 worksheet of BA Initiative Plan)
   ============================================================ */

const STORAGE_KEY = "ba-strategy-objective-5-v1";

// VIEW-ONLY BY DEFAULT.
// The site's purpose is for the Lead & Manager to view plan progress, not edit it,
// so the app opens in read-only mode for everyone. All add/edit/delete/drag/reorder
// controls are hidden and fields are locked; data is never modified.
//
// To edit the plan yourself, append ?edit=1 to the URL, e.g.
//   https://your-site/?edit=1
// Share the plain link (without ?edit=1) with the Lead and Manager for view-only access.
const READ_ONLY = (() => {
  try {
    if (typeof window === "undefined") return true;
    const p = new URLSearchParams(window.location.search);
    const editRequested =
      p.get("edit") === "1" ||
      p.get("edit") === "true" ||
      (window.location.hash || "").toLowerCase().includes("edit");
    return !editRequested; // read-only unless edit mode is explicitly requested
  } catch (e) {
    return true;
  }
})();

const STATUS_VALUES = ["Not Started","Planned","In Progress","Under Review","Blocked","At Risk","Delayed","Completed","On Hold","Cancelled"];
const PRIORITY_VALUES = ["Critical","High","Medium","Low"];
const CONFIDENCE_VALUES = ["High","Medium-High","Medium","Medium-Low","Low"];
const DELIVERABLE_CATEGORIES = ["Discovery Output","BRD","User Stories","Process Model","Requirements Traceability Matrix","UAT Support Package","Change Request Analysis","Business Case","Product Requirement","Other"];
const REVIEW_RESULTS = ["Accepted","Accepted with Minor Comments","Major Rework Required","Rejected","Pending Review"];
const MEETING_STATUSES = ["Not Scheduled","Scheduled","Completed","Rescheduled","Cancelled"];
const ACTION_STATUSES = ["Open","In Progress","Blocked","Completed","Overdue"];
const RAID_TYPES = ["Risk","Issue","Assumption","Dependency","Decision"];
const PROB_IMPACT = ["Very Low","Low","Medium","High","Very High"];
const PI_SCALE = { "Very Low":1, "Low":2, "Medium":3, "High":4, "Very High":5 };
const QUARTERS_2026 = ["Q1 2026","Q2 2026","Q3 2026","Q4 2026"];

// Internal rollout quarters for the Objective 5 initiative timeline (13-week cycles,
// starting Sun 26 Jul 2026, Sun–Thu working week, KSA public holidays excluded).
// Kept separate from QUARTERS_2026 (used for calendar-year KPI measurement periods).
const OBJECTIVE5_QUARTERS = [
  { label: "Q1", range: "6 Jul – 2 Oct 2026", start: "2026-07-06", end: "2026-10-02" },
  { label: "Q2", range: "5 Oct 2026 – 1 Jan 2027", start: "2026-10-05", end: "2027-01-01" },
  { label: "Q3", range: "4 Jan – 2 Apr 2027", start: "2027-01-04", end: "2027-04-02" },
  { label: "Q4", range: "5 Apr – 2 Jul 2027", start: "2027-04-05", end: "2027-07-02" },
];

function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}
function todayISO() { return new Date().toISOString().slice(0,10); }
function fmtDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"}) + " " + d.toLocaleTimeString(undefined,{hour:"2-digit",minute:"2-digit"});
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined,{month:"short",day:"numeric",year:"numeric"});
}
function clampProgress(n){ return Math.max(0, Math.min(100, Number(n)||0)); }
function daysBetween(a,b){
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

const INITIAL_INITIATIVES = [
  {
    id: "RELEASE 1",
    name: "Delivery Excellence Pilot",
    objective: "Objective 5 — Delivery Excellence",
    description: "Q1 — Build a working Delivery Excellence Pilot on ONE project so measurable business value is delivered by the end of the quarter. Starts with a short preparation phase (6 Jul – 9 Aug 2026), then implementation from 9 Aug: define the delivery measurement framework, configure Jira for measurement, create the BA quality checklist, select and prepare the pilot, run the pilot and collect KPI data, measure and analyse results, then define improvements for Q2.",
    owner: "Mashael",
    support: ["BA Leads","Head of BA","Jira Admin"],
    plannedStart: "2026-07-06",
    plannedEnd: "2026-10-01",
    actualStart: "",
    actualEnd: "",
    deadline: "Q1 (6 Jul – 2 Oct 2026)",
    status: "Planned",
    priority: "Critical",
    confidence: "High",
    progress: 0,
    servesKpi: ["Delivery Excellence Index","5.1 On-Time Delivery Rate","5.2 First-Review Acceptance Rate"],
    deliverables: ["Transformation Roadmap and Executive Timeline","Delivery Measurement Framework","Jira Measurement Configuration","BA Quality Checklist","Delivery Excellence Pilot","Initial Baseline","Improvement Backlog"],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate: "Pilot roadmap loaded: Preparation → Framework → Jira Setup → Checklist → Pilot → Measurement → Improvements. Pilot Live milestone lands 22 Sep 2026, before the end of Q1.",
    notes: "Pilot-first delivery strategy — each quarter delivers usable business value. Preparation phase 6 Jul – 9 Aug 2026 (no KPI implementation); implementation starts 9 Aug 2026. All dates fall on Sun–Thu working days; Saudi National Day (23 Sep 2026) excluded.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 0,
  },
  {
    id: "RELEASE 2",
    name: "Pilot Expansion",
    objective: "Objective 5 — Delivery Excellence",
    description: "Q2 — Improve the Pilot and expand it beyond the single project. Enhance the estimation and dependency framework, strengthen quality controls (structured feedback record and improved BA checklist), optimise the Jira workflow, expand the pilot to multiple projects, then measure and compare performance against the Q1 baseline and plan the next improvements.",
    owner: "BA Leads",
    support: ["Mashael","Portfolio Managers"],
    plannedStart: "2026-10-05",
    plannedEnd: "2026-12-20",
    actualStart: "",
    actualEnd: "",
    deadline: "Q2 (5 Oct 2026 – 1 Jan 2027)",
    status: "Planned",
    priority: "High",
    confidence: "Medium",
    progress: 0,
    servesKpi: ["Delivery Excellence Index","5.1 On-Time Delivery Rate","5.2 First-Review Acceptance Rate"],
    deliverables: ["Enhanced Estimation & Dependency Framework","Structured Feedback & Sign-Off Record","Expanded Pilot Results","KPI Dashboard"],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate: "Not yet started — depends on the Q1 Pilot being live and the initial baseline being approved.",
    notes: "Q2 expands the Pilot to multiple projects (projects 2–4) and measures each one. Sun–Thu working week, KSA holidays excluded. Roll-out completes 24 Nov 2026; per-project measurement milestones land 6–10 Dec 2026.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 1,
  },
  {
    id: "RELEASE 3",
    name: "Department Rollout",
    objective: "Objective 5 — Delivery Excellence",
    description: "Q3 — Deploy the proven Delivery Excellence framework across the BA Department and establish governance and continuous KPI monitoring. Roll out to all projects and onboard the BA teams, standardise the BA process, templates and Jira usage, enable a governance model with named owners and reviews, monitor department-level KPIs, then close the quarter with a review and lessons learned.",
    owner: "Mashael",
    support: ["BA Leads","Business Owners","Objective 6 Owner"],
    plannedStart: "2027-01-04",
    plannedEnd: "2027-03-18",
    actualStart: "",
    actualEnd: "",
    deadline: "Q3 (4 Jan – 2 Apr 2027)",
    status: "Planned",
    priority: "High",
    confidence: "Medium",
    progress: 0,
    servesKpi: ["Delivery Excellence Index","5.1 On-Time Delivery Rate","5.2 First-Review Acceptance Rate"],
    deliverables: ["Department-wide Adoption","Standardized Delivery Process","Governance Framework","Department KPI Dashboard"],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate: "Not yet started — depends on the Q2 expanded pilot results. Department Rollout Completed milestone lands 18 Mar 2027.",
    notes: "Department-wide rollout with governance. Sun–Thu working week; Founding Day (22 Feb 2027) and the Eid al-Fitr window (7–11 Mar 2027, SAMA reference) excluded — verify Eid dates against your company's approved holiday calendar.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 2,
  },
  {
    id: "RELEASE 4",
    name: "Optimization",
    objective: "Objective 5 — Delivery Excellence",
    description: "Q4 — Optimise the Delivery Excellence framework, automate where possible, and establish a culture of continuous improvement. Optimise the delivery process and approvals, enhance KPI reporting for executives, automate KPI calculations and reporting, institutionalise a continuous improvement backlog with its own governance, and close the year with an annual performance review and a Year 2 roadmap.",
    owner: "Mashael",
    support: ["BA Leads"],
    plannedStart: "2027-04-05",
    plannedEnd: "2027-06-29",
    actualStart: "",
    actualEnd: "",
    deadline: "Q4 (5 Apr – 30 Jun 2027)",
    status: "Planned",
    priority: "Medium",
    confidence: "Medium",
    progress: 0,
    servesKpi: ["Delivery Excellence Index","5.1 On-Time Delivery Rate","5.2 First-Review Acceptance Rate"],
    deliverables: ["Optimized Delivery Process","Executive KPI Dashboard","Automated KPI Monitoring","Continuous Improvement Framework","Annual Delivery Excellence Report","Roadmap for Year 2"],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate: "Not yet started — final release. Delivery Excellence Successfully Institutionalized milestone lands 29 Jun 2027.",
    notes: "Final optimisation release, ending before the 30 Jun 2027 project end. Sun–Thu working week. NOTE: Eid al-Adha 2027 falls inside this window but its exact dates were not confirmed — verify against your company holiday calendar and shift the affected activities.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 3,
  },
];

// Activities per initiative (planned dates are proposed sample dates within 2026)
function initialActivities() {
  const task = (overrides) => ({
    id: uid("ACT"),
    initiativeId: overrides.initiativeId,
    name: overrides.name,
    description: overrides.description || "",
    owner: overrides.owner || "Mashael",
    support: overrides.support || [],
    plannedStart: overrides.plannedStart,
    plannedEnd: overrides.plannedEnd,
    actualStart: overrides.actualStart || "",
    actualEnd: overrides.actualEnd || "",
    status: overrides.status || (overrides.milestone ? "Not Started" : "Planned"),
    priority: overrides.priority || "Medium",
    progress: overrides.progress ?? 0,
    dependencyType: "Finish-to-Start",
    predecessors: [],
    deliverable: overrides.deliverable || "",
    milestone: !!overrides.milestone,
    recurring: !!overrides.recurring,
    recurrenceFrequency: overrides.recurrenceFrequency || "",
    blocker: "",
    risk: "",
    notes: overrides.notes || "",
    evidence: "",
    lastUpdate: "",
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    order: overrides.order || 0,
    parentActivityId: overrides.parentActivityId || null,
    // KPI percentages captured on a milestone (0–100, numeric). Aggregated per
    // quarter once the milestone is Completed — see aggregateKpi().
    deliveryIndex: overrides.deliveryIndex ?? null,
    onTimeDelivery: overrides.onTimeDelivery ?? null,
    firstReviewAcceptance: overrides.firstReviewAcceptance ?? null,
  });

  // Primary tasks + sub-tasks per the approved KSA-calendar-adjusted delivery plan.
  // Assumptions: plan starts Sun 26 Jul 2026; working week Sun–Thu; weekend Fri–Sat;
  // Saudi National Day (23 Sep 2026) and Founding Day (22 Feb 2027) excluded;
  // Eid al-Fitr (7–11 Mar 2027, per SAMA reference schedule) left open — verify against your company calendar.
  const PLAN = {
    "RELEASE 1": [
      { name: "0. Project Preparation & Mobilization", start: "2026-07-06", end: "2026-08-09", deliverable: "Transformation Roadmap and Executive Timeline",
        notes: "Preparation only — no KPI implementation in this phase. Implementation starts 9 Aug 2026. Dates and progress below reflect the update saved on 3 Aug 2026.",
        subtasks: [
          ["Kick-off Meeting", "2026-07-15", "2026-07-15", { status: "Completed", progress: 100, actualStart: "2026-08-15", actualEnd: "2026-08-15" }],
          ["Identify Stakeholders", "2026-07-16", "2026-07-16", { status: "Completed", progress: 100, actualStart: "2026-08-17", actualEnd: "2026-08-18" }],
          ["Confirm Objectives", "2026-07-19", "2026-07-21", { status: "Completed", progress: 100, actualStart: "2026-08-23", actualEnd: "2026-08-24" }],
          ["Define Scope", "2026-07-27", "2026-07-27", { status: "Completed", progress: 100, actualStart: "2026-07-27", actualEnd: "2026-07-28" }],
          ["Prepare Transformation Roadmap", "2026-07-30", "2026-07-30", { status: "Completed", progress: 100, actualStart: "2026-07-30", actualEnd: "2026-08-30" }],
          ["Prepare Executive Timeline", "2026-07-30", "2026-07-30", { status: "Completed", progress: 0, actualStart: "2026-07-30", actualEnd: "2026-08-30" }],
          ["Validate Timeline with leen", "2026-08-04", "2026-08-04"],
        ]},
      { name: "1. Define Delivery Measurement Framework", start: "2026-08-09", end: "2026-08-20", deliverable: "Delivery Measurement Framework",
        subtasks: [
          ["Define Deliverable Categories", "2026-08-09", "2026-08-11"],
          ["Define Measurement Rules", "2026-08-12", "2026-08-16"],
          ["Define On-Time Delivery Rules", "2026-08-17", "2026-08-18"],
          ["Define First Review Acceptance Rules", "2026-08-19", "2026-08-20"],
        ]},
      { name: "2. Configure Jira Measurement Setup", start: "2026-08-23", end: "2026-08-30", deliverable: "Jira Measurement Configuration", owner: "Jira Admin",
        subtasks: [
          ["Configure Jira Measurement Fields", "2026-08-23", "2026-08-26"],
          ["Configure Jira for Pilot", "2026-08-27", "2026-08-30"],
        ]},
      { name: "3. Create BA Quality Checklist", start: "2026-08-31", end: "2026-09-06", deliverable: "BA Quality Checklist",
        subtasks: [
          ["Create BA Pre-Submission Checklist", "2026-08-31", "2026-09-06"],
        ]},
      { name: "4. Select & Prepare Pilot Project", start: "2026-09-07", end: "2026-09-10",
        subtasks: [
          ["Select One Pilot Project", "2026-09-07", "2026-09-08"],
          ["Train Pilot Team", "2026-09-09", "2026-09-10"],
        ]},
      { name: "5. Run Pilot & Collect Data", start: "2026-09-13", end: "2026-09-22", deliverable: "Delivery Excellence Pilot",
        subtasks: [
          ["Run Pilot", "2026-09-13", "2026-09-22"],
          ["Collect KPI Data", "2026-09-17", "2026-09-22"],
        ]},
      { name: "6. Measure & Analyze Results", start: "2026-09-24", end: "2026-09-29", deliverable: "Initial Baseline",
        milestones: [["Pilot Live and measured", "2026-09-30"]],
        subtasks: [
          ["Measure", "2026-09-24", "2026-09-27"],
          ["Analyze Results", "2026-09-28", "2026-09-29"],
        ]},
      { name: "7. Define Improvements & Next Steps", start: "2026-09-30", end: "2026-10-01", deliverable: "Improvement Backlog",
        subtasks: [
          ["Identify Improvements", "2026-09-30", "2026-10-01"],
        ]},
    ],
    "RELEASE 2": [
      { name: "1. Enhance Delivery Framework", start: "2026-10-05", end: "2026-10-19", deliverable: "Enhanced Estimation & Dependency Framework", owner: "BA Leads",
        subtasks: [
          ["Improve Estimation Framework", "2026-10-05", "2026-10-12"],
          ["Implement Dependency Management", "2026-10-13", "2026-10-19"],
        ]},
      { name: "2. Strengthen Quality Controls", start: "2026-10-20", end: "2026-11-01", deliverable: "Structured Feedback & Sign-Off Record",
        subtasks: [
          ["Structured Feedback Record", "2026-10-20", "2026-10-26"],
          ["Improve BA Checklist", "2026-10-27", "2026-11-01"],
        ]},
      { name: "3. Optimize Jira Workflow", start: "2026-11-02", end: "2026-11-08", owner: "Jira Admin",
        subtasks: [
          ["Improve Jira Workflow", "2026-11-02", "2026-11-08"],
        ]},
      { name: "4. Expand Pilot to Multiple Projects", start: "2026-11-09", end: "2026-11-24", deliverable: "Expanded Pilot Results", owner: "BA Leads",
        notes: "Roll-out to projects 2, 3 and 4 runs in parallel (separate project teams).",
        subtasks: [
          ["Select 3 Additional Projects", "2026-11-09", "2026-11-11"],
          ["Onboard Project Teams", "2026-11-12", "2026-11-17"],
          ["Roll Out Standard Process in project 2", "2026-11-18", "2026-11-24"],
          ["Roll Out Standard Process in project 3", "2026-11-18", "2026-11-24"],
          ["Roll Out Standard Process in project 4", "2026-11-18", "2026-11-24"],
        ]},
      { name: "5. Measure & Compare Performance", start: "2026-11-25", end: "2026-12-10", deliverable: "KPI Dashboard",
        milestones: [["Project 2 measured", "2026-12-06"], ["Project 3 measured", "2026-12-10"], ["Project 4 measured", "2026-12-10"]],
        subtasks: [
          ["Collect and analyze KPI Results for project 1", "2026-11-25", "2026-12-01"],
          ["Collect and analyze KPI Results for project 2", "2026-12-02", "2026-12-06"],
          ["Collect and analyze KPI Results for project 3", "2026-12-07", "2026-12-10"],
        ]},
      { name: "6. Quarterly Review & Improvement Planning", start: "2026-12-13", end: "2026-12-20",
        subtasks: [
          ["Quarterly Review", "2026-12-13", "2026-12-15"],
          ["Define Improvement Actions", "2026-12-16", "2026-12-20"],
        ]},
    ],
    "RELEASE 3": [
      { name: "1. Roll Out Across BA Department", start: "2027-01-04", end: "2027-01-17", deliverable: "Department-wide Adoption", owner: "BA Leads",
        subtasks: [
          ["Roll Out to All Projects", "2027-01-04", "2027-01-17"],
          ["Onboard BA Teams", "2027-01-10", "2027-01-17"],
        ]},
      { name: "2. Standardize Delivery Practices", start: "2027-01-18", end: "2027-02-03", deliverable: "Standardized Delivery Process",
        subtasks: [
          ["Standardize BA Process", "2027-01-18", "2027-01-24"],
          ["Standardize Templates", "2027-01-25", "2027-01-28"],
          ["Standardize Jira Usage", "2027-01-31", "2027-02-03"],
        ]},
      { name: "3. Enable Governance", start: "2027-02-04", end: "2027-02-16", deliverable: "Governance Framework",
        subtasks: [
          ["Define Governance Model", "2027-02-04", "2027-02-09"],
          ["Assign Governance Owners", "2027-02-10", "2027-02-11"],
          ["Launch Governance Reviews", "2027-02-14", "2027-02-16"],
        ]},
      { name: "4. Monitor Department KPIs", start: "2027-02-17", end: "2027-03-03", deliverable: "Department KPI Dashboard",
        subtasks: [
          ["Collect KPI Results", "2027-02-17", "2027-02-23"],
          ["Monitor KPI Trends", "2027-02-24", "2027-02-28"],
          ["Validate Data Quality", "2027-03-01", "2027-03-03"],
        ]},
      { name: "5. Conduct Quarterly Review", start: "2027-03-04", end: "2027-03-18",
        milestones: [["Department Rollout Completed", "2027-03-18"]],
        subtasks: [
          ["Quarterly Review", "2027-03-04", "2027-03-14"],
          ["Lessons Learned", "2027-03-15", "2027-03-16"],
          ["Update Improvement Backlog", "2027-03-17", "2027-03-18"],
        ]},
    ],
    "RELEASE 4": [
      { name: "1. Optimize Delivery Process", start: "2027-04-05", end: "2027-04-20", deliverable: "Optimized Delivery Process",
        subtasks: [
          ["Review Delivery Process", "2027-04-05", "2027-04-08"],
          ["Simplify Workflow", "2027-04-11", "2027-04-14"],
          ["Optimize Approval Process", "2027-04-15", "2027-04-20"],
        ]},
      { name: "2. Enhance KPI Reporting", start: "2027-04-21", end: "2027-05-06", deliverable: "Executive KPI Dashboard",
        subtasks: [
          ["Enhance KPI Dashboard", "2027-04-21", "2027-04-27"],
          ["Improve Executive Reports", "2027-04-28", "2027-05-03"],
          ["Define KPI Insights", "2027-05-04", "2027-05-06"],
        ]},
      { name: "3. Automate Delivery Monitoring", start: "2027-05-09", end: "2027-06-02", deliverable: "Automated KPI Monitoring", owner: "Jira Admin",
        notes: "Eid al-Adha planning gap (approx. 16–20 May 2027) excluded — verify exact dates against your company holiday calendar.",
        subtasks: [
          ["Identify Automation Opportunities", "2027-05-09", "2027-05-11"],
          ["Automate KPI Calculations", "2027-05-12", "2027-05-26"],
          ["Automate Reports & Notifications", "2027-05-27", "2027-06-02"],
        ]},
      { name: "4. Institutionalize Continuous Improvement", start: "2027-06-03", end: "2027-06-14", deliverable: "Continuous Improvement Framework",
        subtasks: [
          ["Build Continuous Improvement Backlog", "2027-06-03", "2027-06-07"],
          ["Prioritize Improvements", "2027-06-08", "2027-06-09"],
          ["Define Improvement Governance", "2027-06-10", "2027-06-14"],
        ]},
      { name: "5. Annual Performance Review", start: "2027-06-15", end: "2027-06-29", deliverable: "Annual Delivery Excellence Report",
        milestones: [["Delivery Excellence Successfully Institutionalized", "2027-06-29"]],
        subtasks: [
          ["Annual KPI Review", "2027-06-15", "2027-06-17"],
          ["Measure Business Value", "2027-06-20", "2027-06-22"],
          ["Capture Lessons Learned", "2027-06-23", "2027-06-24"],
          ["Define Next-Year Roadmap", "2027-06-27", "2027-06-29"],
        ]},
    ],
  };

  let activities = [];
  // Sequential chain: Initiatives 1 → 2 → 3 run back-to-back, so Major Activities are
  // linked Finish-to-Start in order (across initiative boundaries too). Initiative 4 is
  // handled separately (parallel, per-cycle chaining) further below.
  let prevPrimaryId = null;
  Object.entries(PLAN).forEach(([initiativeId, primaries]) => {
    primaries.forEach((p, pIdx) => {
      const primaryTask = task({
        initiativeId, name: p.name, plannedStart: p.start, plannedEnd: p.end,
        deliverable: p.deliverable, owner: p.owner, notes: p.notes, order: pIdx,
      });
      // Auto Finish-to-Start dependency on the preceding Major Activity.
      if (prevPrimaryId) {
        primaryTask.predecessors = [prevPrimaryId];
        primaryTask.dependencyType = "Finish-to-Start";
      }
      prevPrimaryId = primaryTask.id;
      activities.push(primaryTask);
      // Sub-task format: [name, start, end] or [name, start, end, { status, progress, actualStart, actualEnd }]
      (p.subtasks || []).forEach(([name, start, end, opts], sIdx) => {
        activities.push(task({
          initiativeId, name, plannedStart: start, plannedEnd: end,
          parentActivityId: primaryTask.id, order: sIdx, ...(opts || {}),
        }));
      });
      if (p.milestone) {
        activities.push(task({
          initiativeId, name: `Milestone: ${p.milestone}`, plannedStart: p.end, plannedEnd: p.end,
          milestone: true, order: primaries.length + pIdx,
        }));
      }
      // Additional dated milestones for this Major Activity: [name, date]
      (p.milestones || []).forEach(([mName, mDate], mIdx) => {
        activities.push(task({
          initiativeId, name: `Milestone: ${mName}`, plannedStart: mDate, plannedEnd: mDate,
          milestone: true, order: primaries.length + pIdx + (mIdx + 1) * 0.1,
        }));
      });
    });
  });

  // RELEASE 4 is now an Optimization release defined in PLAN above
  // (the previous recurring quarterly-review cycles were replaced).

  return activities;
}

/* ============================================================
   RELEASE SUCCESS MODEL (drives the Delivery Performance page)
   Each criterion / value item points at a real activity or milestone
   name in the plan, so "done" is derived from actual delivery status
   rather than typed in by hand — it self-updates as work completes.
   ============================================================ */
const RELEASE_META = {
  "RELEASE 1": {
    quarter: "Q1",
    quarterTargets: ["Pilot Live and measured", "Pilot Completed", "Initial Baseline Established"],
    successCriteria: [
      { label: "Pilot running", link: "Milestone: Pilot Live and measured" },
      { label: "Jira configured", link: "Configure Jira for Pilot" },
      { label: "Pilot started", link: "Run Pilot" },
      { label: "First KPI collected", link: "Collect KPI Data" },
      { label: "Dashboard available", link: "Analyze Results" },
    ],
    businessValue: [
      { label: "Pilot deployed", link: "Milestone: Pilot Live and measured" },
      { label: "1 Pilot Project", link: "Run Pilot" },
      { label: "Dashboard Ready", link: "Analyze Results" },
      { label: "First Baseline", link: "Measure" },
      { label: "Improvement Backlog", link: "Identify Improvements" },
    ],
    pilotCoveragePlanned: 1,
    // Q1 establishes the baseline, so there is no improvement target yet.
    kpiTargets: { deliveryIndex: null, onTimeDelivery: null, firstReviewAcceptance: null },
    valueHeadline: "Pilot Live and measured",
    valueMilestone: "Milestone: Pilot Live and measured",
  },
  "RELEASE 2": {
    quarter: "Q2",
    quarterTargets: ["Pilot Successfully Expanded", "KPI Dashboard Live", "Q1 vs Q2 Comparison Complete"],
    successCriteria: [
      { label: "Estimation framework improved", link: "Improve Estimation Framework" },
      { label: "Dependency management in use", link: "Implement Dependency Management" },
      { label: "Feedback record live", link: "Structured Feedback Record" },
      { label: "Pilot expanded", link: "Roll Out Standard Process in project 4" },
      { label: "Performance compared to Q1", link: "Quarterly Review" },
    ],
    businessValue: [
      { label: "Multiple projects covered", link: "Roll Out Standard Process in project 4" },
      { label: "Improved BA checklist", link: "Improve BA Checklist" },
      { label: "Optimised Jira workflow", link: "Improve Jira Workflow" },
      { label: "KPI Dashboard", link: "Collect and analyze KPI Results for project 1" },
      { label: "Improvement actions defined", link: "Define Improvement Actions" },
    ],
    pilotCoveragePlanned: 4,
    kpiTargets: { deliveryIndex: 55, onTimeDelivery: 80, firstReviewAcceptance: 65 },
    valueHeadline: "Expanded to 4 Projects",
    valueMilestone: "Milestone: Project 4 measured",
  },
  "RELEASE 3": {
    quarter: "Q3",
    quarterTargets: ["Department Rollout Completed", "Governance Live", "Department KPI Dashboard Live"],
    successCriteria: [
      { label: "Rolled out to all projects", link: "Roll Out to All Projects" },
      { label: "BA teams onboarded", link: "Onboard BA Teams" },
      { label: "Practices standardised", link: "Standardize BA Process" },
      { label: "Governance launched", link: "Launch Governance Reviews" },
      { label: "Department KPIs monitored", link: "Monitor KPI Trends" },
    ],
    businessValue: [
      { label: "Department-wide adoption", link: "Milestone: Department Rollout Completed" },
      { label: "Standardised delivery process", link: "Standardize Templates" },
      { label: "Governance framework", link: "Define Governance Model" },
      { label: "Department KPI dashboard", link: "Collect KPI Results" },
      { label: "Lessons captured", link: "Lessons Learned" },
    ],
    pilotCoveragePlanned: 10,
    kpiTargets: { deliveryIndex: 70, onTimeDelivery: 88, firstReviewAcceptance: 78 },
    valueHeadline: "Department Rollout Completed",
    valueMilestone: "Milestone: Department Rollout Completed",
  },
  "RELEASE 4": {
    quarter: "Q4",
    quarterTargets: ["Delivery Excellence Institutionalized", "KPI Reporting Automated", "Year-2 Roadmap Approved"],
    successCriteria: [
      { label: "Delivery process optimised", link: "Simplify Workflow" },
      { label: "Executive reporting enhanced", link: "Improve Executive Reports" },
      { label: "KPI calculations automated", link: "Automate KPI Calculations" },
      { label: "Continuous improvement governed", link: "Define Improvement Governance" },
      { label: "Annual review completed", link: "Annual KPI Review" },
    ],
    businessValue: [
      { label: "Optimised Delivery Process", link: "Optimize Approval Process" },
      { label: "Executive KPI Dashboard", link: "Enhance KPI Dashboard" },
      { label: "Automated KPI Monitoring", link: "Automate Reports & Notifications" },
      { label: "Continuous Improvement Framework", link: "Build Continuous Improvement Backlog" },
      { label: "Annual Delivery Excellence Report", link: "Measure Business Value" },
      { label: "Roadmap for Year 2", link: "Define Next-Year Roadmap" },
    ],
    pilotCoveragePlanned: 10,
    kpiTargets: { deliveryIndex: 80, onTimeDelivery: 95, firstReviewAcceptance: 85 },
    valueHeadline: "Continuous Improvement",
    valueMilestone: "Milestone: Delivery Excellence Successfully Institutionalized",
  },
};

const INITIAL_RELEASE_REVIEWS = ["RELEASE 1","RELEASE 2","RELEASE 3","RELEASE 4"].map(rid => ({
  id: uid("REV"),
  releaseId: rid,
  quarter: RELEASE_META[rid].quarter,
  businessValue: "",
  lessonsLearned: "",
  actions: "",
  owner: "Mashael",
  approval: "Pending",
  reviewDate: "",
  notes: "",
}));

const INITIAL_KPI_DEFS = {
  "Delivery Excellence Index": {
    baseline: "To be established in Q1 2026",
    baselineExplanation: "A reliable baseline does not currently exist because both sub-metrics and common deliverable classifications must first be measured consistently.",
    targets: { "Q2 2026": 55, "Q3 2026": 70, "Q4 2026": 80 },
    formula: "Deliverables meeting both 5.1 and 5.2 ÷ Total measured deliverables × 100",
    frequency: "Quarterly (using monthly sub-metric data)",
  },
  "5.1 On-Time Delivery Rate": {
    baseline: "To be established in Q1 2026",
    baselineExplanation: "Committed-date tracking in Jira currently varies by team and project, and no consolidated portfolio-level rate exists.",
    targets: { "Q2 2026": 80, "Q3 2026": 88, "Q4 2026": 95 },
    formula: "Deliverables delivered on or before committed date ÷ Total measured deliverables × 100",
    frequency: "Monthly",
  },
  "5.2 First-Review Acceptance Rate": {
    baseline: "To be established in Q1 2026",
    baselineExplanation: "Sign-off and review feedback currently exist in scattered emails, and major versus minor rework is not consistently classified.",
    targets: { "Q2 2026": 65, "Q3 2026": 78, "Q4 2026": 85 },
    formula: "Deliverables accepted on first review without major or structural rework ÷ Total reviewed deliverables × 100",
    frequency: "Monthly",
  },
};

const INITIAL_ALIGNMENTS = [
  { id: uid("ALN"), counterpart:"Head of BA — Fatima Alghannam", topic:"Deliverable categories, KPI targets, measurement approach, baseline approval, recalibrating improvement targets after Q1", requiredDecision:"Approve deliverable categories & Q1 baseline", meetingDate:"", meetingStatus:"Not Scheduled", owner:"Mashael", attendees:["Fatima Alghannam","Mashael"], notes:"", agreedActions:"", actionOwner:"Mashael", dueDate:"", decision:"", evidence:"", followUpDate:"", completionStatus:"Open" },
  { id: uid("ALN"), counterpart:"BA Leads by portfolio", topic:"Estimation basis, dependency tracking, date renegotiation protocol, consistent acceptance capture, initiative adoption", requiredDecision:"Agree on-time delivery discipline rollout", meetingDate:"", meetingStatus:"Not Scheduled", owner:"Mashael", attendees:["BA Leads"], notes:"", agreedActions:"", actionOwner:"BA Leads", dueDate:"", decision:"", evidence:"", followUpDate:"", completionStatus:"Open" },
  { id: uid("ALN"), counterpart:"Portfolio Managers", topic:"Capacity coordination, cross-portfolio dependencies, delivery commitments, escalation of portfolio constraints", requiredDecision:"Confirm capacity constraints process", meetingDate:"", meetingStatus:"Not Scheduled", owner:"Mashael", attendees:["Portfolio Managers"], notes:"", agreedActions:"", actionOwner:"Portfolio Managers", dueDate:"", decision:"", evidence:"", followUpDate:"", completionStatus:"Open" },
  { id: uid("ALN"), counterpart:"Business Owners", topic:"Structured first-review feedback, acceptance criteria, major versus minor rework, sign-off records", requiredDecision:"Agree acceptance criteria definitions", meetingDate:"", meetingStatus:"Not Scheduled", owner:"Mashael", attendees:["Business Owners"], notes:"", agreedActions:"", actionOwner:"Business Owners", dueDate:"", decision:"", evidence:"", followUpDate:"", completionStatus:"Open" },
  { id: uid("ALN"), counterpart:"Jira Admin", topic:"Committed-date fields, acceptance flags, rework classifications, delivery reporting, data availability", requiredDecision:"Confirm Jira field configuration plan", meetingDate:"", meetingStatus:"Not Scheduled", owner:"Mashael", attendees:["Jira Admin"], notes:"", agreedActions:"", actionOwner:"Jira Admin", dueDate:"", decision:"", evidence:"", followUpDate:"", completionStatus:"Open" },
  { id: uid("ALN"), counterpart:"Baghdady — Objective 6 Owner", topic:"Pre-submission standards, checklist alignment, standards compliance, reducing client rework", requiredDecision:"Align checklist with Objective 6 AZM standards", meetingDate:"", meetingStatus:"Not Scheduled", owner:"Mashael", attendees:["Baghdady"], notes:"", agreedActions:"", actionOwner:"Baghdady", dueDate:"", decision:"", evidence:"", followUpDate:"", completionStatus:"Open" },
];

const INITIAL_RISKS = [
  { title:"Inconsistent Jira committed-date usage", type:"Risk", probability:"High", impact:"High" },
  { title:"Lack of agreed deliverable categories", type:"Risk", probability:"Medium", impact:"High" },
  { title:"Stakeholders continue using email for acceptance", type:"Risk", probability:"High", impact:"Medium" },
  { title:"Major and minor rework remain subjective", type:"Risk", probability:"Medium", impact:"High" },
  { title:"BA Leads do not adopt the date renegotiation protocol", type:"Risk", probability:"Medium", impact:"Medium" },
  { title:"Objective 6 standards are delayed", type:"Dependency", probability:"Medium", impact:"High" },
  { title:"Missing baseline data delays target confirmation", type:"Risk", probability:"Medium", impact:"High" },
  { title:"Portfolio capacity constraints affect committed dates", type:"Risk", probability:"High", impact:"Medium" },
  { title:"Analysts do not consistently use the checklist", type:"Risk", probability:"Medium", impact:"Medium" },
  { title:"Client review delays distort acceptance measurements", type:"Risk", probability:"Medium", impact:"Medium" },
].map((r,i) => ({
  id: uid("RAID"),
  type: r.type,
  title: r.title,
  description: "",
  relatedInitiative: "",
  relatedActivity: "",
  owner: "Mashael",
  raisedDate: "2026-01-02",
  dueDate: "",
  probability: r.probability,
  impact: r.impact,
  status: "Open",
  mitigation: "",
  contingency: "",
  dependencyOwner: "",
  escalationRequired: false,
  decisionRequired: "",
  resolution: "",
  closedDate: "",
  notes: "",
}));

const DEFAULT_SETTINGS = {
  objectiveOwner: "Mashael",
  supportingUsers: ["BA Leads","Head of BA","Jira Admin","Portfolio Managers","Business Owners","Objective 6 Owner"],
  statusValues: STATUS_VALUES,
  priorityValues: PRIORITY_VALUES,
  confidenceValues: CONFIDENCE_VALUES,
  deliverableCategories: DELIVERABLE_CATEGORIES,
  reviewResults: REVIEW_RESULTS,
  kpiDataSource: "Hybrid",
  performanceThresholds: { aboveTarget: 5, slightlyBelow: 5 },
  riskThresholds: { low:4, medium:9, high:16 },
  workingDays: "Sun–Thu",
  defaultTimelineView: "Quarterly",
  weekStartDay: "Sunday",
  dateFormat: "MMM D, YYYY",
  userDisplayName: "BA Department User",
  autosaveEnabled: true,
  autosaveDelayMs: 1200,
  confirmBeforeDeletion: true,
  appDataVersion: "1.0.0",
};

function defaultData() {
  return {
    version: 1,
    initiatives: INITIAL_INITIATIVES,
    activities: initialActivities(),
    kpiDefs: INITIAL_KPI_DEFS,
    releaseReviews: INITIAL_RELEASE_REVIEWS,
    improvementActions: [],
    pilotCoverageActual: { "RELEASE 1": 0, "RELEASE 2": 0, "RELEASE 3": 0, "RELEASE 4": 0 },
    kpiResults: [],
    deliverables: [],
    alignments: INITIAL_ALIGNMENTS,
    risks: INITIAL_RISKS,
    activityLog: [
      {
        id: uid("LOG"),
        date: new Date().toISOString(),
        user: "System",
        action: "Initialized",
        recordType: "Application",
        recordName: "Objective 5 Delivery Timeline",
        previousValue: "",
        newValue: "Sample data loaded",
        reason: "First load",
      },
    ],
    settings: DEFAULT_SETTINGS,
    savedViews: [
      { id: uid("VIEW"), name: "Delayed activities", filter: { status: "Delayed" } },
      { id: uid("VIEW"), name: "Milestones only", filter: { milestonesOnly: true } },
      { id: uid("VIEW"), name: "Mashael's open actions", filter: { owner: "Mashael" } },
    ],
    ui: { activeTab: "overview", timelineView: "Quarterly" },
    lastSaved: null,
  };
}

/* ============================================================
   PERSISTENCE
   ============================================================ */
async function loadPersisted() {
  try {
    if (typeof window !== "undefined" && window.storage) {
      const res = await window.storage.get(STORAGE_KEY, false);
      if (res && res.value) return JSON.parse(res.value);
    }
  } catch (e) { /* fall through to localStorage */ }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return null;
}
async function savePersisted(data) {
  if (READ_ONLY) return true; // view mode never writes
  const payload = JSON.stringify(data);
  let ok = false;
  try {
    if (typeof window !== "undefined" && window.storage) {
      const res = await window.storage.set(STORAGE_KEY, payload, false);
      ok = !!res;
    }
  } catch (e) { ok = false; }
  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
    ok = true;
  } catch (e) { /* ignore */ }
  return ok;
}

/* ============================================================
   DERIVED CALCULATIONS
   ============================================================ */
function isOverdue(item) {
  if (!item.plannedEnd) return false;
  if (item.status === "Completed" || item.status === "Cancelled") return false;
  return new Date(item.plannedEnd) < new Date(todayISO());
}
function riskScore(r) {
  return (PI_SCALE[r.probability]||0) * (PI_SCALE[r.impact]||0);
}
function riskLevel(score, thresholds) {
  if (score <= thresholds.low) return "Low";
  if (score <= thresholds.medium) return "Medium";
  if (score <= thresholds.high) return "High";
  return "Critical";
}
/**
 * Leaf activities of a release: sub-tasks, plus primary tasks that have no
 * sub-tasks. Parents are excluded so their (empty) progress never dilutes the
 * roll-up. Milestones are excluded — they are events, not effort.
 */
function leafActivities(activities, releaseId) {
  const scoped = activities.filter(a => !releaseId || a.initiativeId === releaseId);
  const parentIds = new Set(scoped.map(a => a.parentActivityId).filter(Boolean));
  return scoped.filter(a => !a.milestone && !parentIds.has(a.id));
}
/** Progress of one activity: rolled up from its sub-tasks when it has any. */
function activityProgress(activities, act) {
  const kids = activities.filter(a => a.parentActivityId === act.id);
  if (!kids.length) return clampProgress(act.progress);
  return Math.round(kids.reduce((t, k) => t + clampProgress(k.progress), 0) / kids.length);
}
/** Release progress derived from its leaf activities (never from a stored field). */
function releaseProgress(data, releaseId) {
  const leaves = leafActivities(data.activities, releaseId);
  if (!leaves.length) return { total: 0, completed: 0, pct: 0 };
  const completed = leaves.filter(a => a.status === "Completed").length;
  const pct = Math.round(leaves.reduce((t, a) => t + clampProgress(a.progress), 0) / leaves.length);
  return { total: leaves.length, completed, pct };
}
/** Whole-objective progress = every leaf activity across all releases. */
function objectiveProgressOf(data) {
  const leaves = leafActivities(data.activities);
  if (!leaves.length) return 0;
  return Math.round(leaves.reduce((t, a) => t + clampProgress(a.progress), 0) / leaves.length);
}

/**
 * Objective health, derived from the plan itself.
 * Registered risks describe what *might* happen, so they never mark the
 * objective "Delayed" on their own — only real schedule slippage does.
 * Open Critical risks raise "Attention Required" instead.
 */
function computeObjectiveHealth(data) {
  const thresholds = data.settings.riskThresholds;
  const active = data.initiatives.filter(i => !i.archived);
  if (!active.length) return "No Data";

  const overdueActs = data.activities.filter(isOverdue).length;
  const delayedReleases = active.filter(i => i.status === "Delayed").length;
  const atRiskReleases = active.filter(i => i.status === "At Risk").length;
  const criticalRisks = data.risks.filter(r => {
    const lvl = riskLevel(riskScore(r), thresholds);
    return lvl === "Critical" && !["Completed", "Closed", "Mitigated"].includes(r.status);
  }).length;

  // Completed only when every release has finished all of its work.
  const allDone = active.every(i => {
    const p = releaseProgress(data, i.id);
    return p.total > 0 && p.completed === p.total;
  });
  if (allDone) return "Completed";

  if (delayedReleases > 0 || overdueActs > 5) return "Delayed";
  if (atRiskReleases > 0 || overdueActs > 0) return "At Risk";
  if (criticalRisks > 0) return "Attention Required";
  return "On Track";
}
function healthColor(h) {
  return {
    "On Track": "#1a7f4b",
    "Attention Required": "#b8860b",
    "At Risk": "#c2410c",
    "Delayed": "#b91c1c",
    "Completed": "#0f2a52",
    "No Data": "#8592a3",
  }[h] || "#334155";
}

function calcKpiResult(numerator, denominator, target, thresholds) {
  if (denominator === "" || denominator === null || denominator === undefined || numerator === "" || numerator === null || numerator === undefined) {
    return { pct: null, status: "No Data", variance: null };
  }
  const num = Number(numerator), den = Number(denominator);
  if (den <= 0) return { pct: null, status: "No Data", variance: null };
  const pct = Math.max(0, Math.min(100, (num / den) * 100));
  const variance = target != null ? Number((pct - target).toFixed(1)) : null;
  let status = "No Data";
  if (target != null) {
    if (pct >= target + thresholds.aboveTarget) status = "Above Target";
    else if (pct >= target) status = "On Target";
    else if (pct >= target - thresholds.slightlyBelow) status = "Slightly Below Target";
    else status = "Significantly Below Target";
  }
  return { pct: Number(pct.toFixed(1)), status, variance };
}

/* ============================================================
   SMALL UI PRIMITIVES
   ============================================================ */
const Badge = ({ children, tone = "neutral" }) => {
  const tones = {
    neutral: { bg: "#eef1f5", fg: "#334155", bd: "#d7dde5" },
    navy: { bg: "#e9edf5", fg: "#0f2a52", bd: "#c7d2e2" },
    green: { bg: "#e7f5ec", fg: "#1a7f4b", bd: "#bfe3cd" },
    amber: { bg: "#fdf3e0", fg: "#8a5a00", bd: "#f0dba8" },
    red: { bg: "#fbe9e7", fg: "#a3271f", bd: "#f2c2bc" },
    purple: { bg: "#f0edf9", fg: "#4c2f8a", bd: "#d6cdef" },
  };
  const t = tones[tone] || tones.neutral;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600,
      padding: "2px 8px", borderRadius: 999, background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      whiteSpace: "nowrap",
    }}>{children}</span>
  );
};

function statusTone(status) {
  if (["Completed"].includes(status)) return "green";
  if (["Delayed","Blocked","Cancelled"].includes(status)) return "red";
  if (["At Risk","On Hold"].includes(status)) return "amber";
  if (["In Progress","Under Review"].includes(status)) return "navy";
  return "neutral";
}
function priorityTone(p) {
  if (p === "Critical") return "red";
  if (p === "High") return "amber";
  if (p === "Medium") return "navy";
  return "neutral";
}

const EDIT_ICONS = new Set([Plus, Trash2, Copy, Archive, RotateCcw, Save, Upload]);
const IconBtn = ({ icon: Icon, label, onClick, tone = "default", size = 16, disabled }) => {
  if (READ_ONLY && EDIT_ICONS.has(Icon)) return null;
  const colors = {
    default: { fg: "#334155", bg: "transparent", hover: "#eef1f5" },
    danger: { fg: "#a3271f", bg: "transparent", hover: "#fbe9e7" },
    primary: { fg: "#0f2a52", bg: "transparent", hover: "#e9edf5" },
  };
  const c = colors[tone];
  return (
    <button
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 30, height: 30, borderRadius: 6, border: "1px solid transparent",
        background: c.bg, color: c.fg, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={e => !disabled && (e.currentTarget.style.background = c.hover)}
      onMouseLeave={e => (e.currentTarget.style.background = c.bg)}
    >
      <Icon size={size} />
    </button>
  );
};

const Button = ({ children, onClick, variant = "primary", icon: Icon, style, disabled, type="button" }) => {
  // In read-only mode, hide mutating buttons. Keep Export/Print (Download/Printer)
  // and plain navigation buttons (e.g. Cancel, Clear search) which have no edit icon.
  if (READ_ONLY && Icon && EDIT_ICONS.has(Icon)) return null;
  const variants = {
    primary: { bg: "#0f2a52", fg: "#fff", bd: "#0f2a52" },
    secondary: { bg: "#fff", fg: "#0f2a52", bd: "#c7d2e2" },
    ghost: { bg: "transparent", fg: "#334155", bd: "transparent" },
    danger: { bg: "#a3271f", fg: "#fff", bd: "#a3271f" },
  };
  const v = variants[variant];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13.5, fontWeight: 600,
        padding: "8px 14px", borderRadius: 8, border: `1px solid ${v.bd}`, background: v.bg, color: v.fg,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1, whiteSpace: "nowrap",
        ...style,
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
};

const Field = ({ label, children, hint, error }) => (
  <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}>
    <span style={{ fontWeight: 600, color: "#334155" }}>{label}</span>
    {children}
    {hint && !error && <span style={{ color: "#8592a3", fontSize: 11.5 }}>{hint}</span>}
    {error && <span style={{ color: "#a3271f", fontSize: 11.5 }}>{error}</span>}
  </label>
);

const inputStyle = {
  padding: "8px 10px", borderRadius: 7, border: "1px solid #d7dde5", fontSize: 13.5,
  fontFamily: "inherit", background: "#fff", color: "#1c2733", width: "100%", boxSizing: "border-box",
};
const Input = (props) => <input {...props} disabled={props.disabled || READ_ONLY} style={{ ...inputStyle, ...(props.style||{}) }} />;
const TextArea = (props) => <textarea {...props} disabled={props.disabled || READ_ONLY} style={{ ...inputStyle, resize: "vertical", minHeight: 60, ...(props.style||{}) }} />;
const Select = ({ children, ...props }) => <select {...props} disabled={props.disabled || READ_ONLY} style={{ ...inputStyle, ...(props.style||{}) }}>{children}</select>;

function Modal({ open, onClose, title, children, width = 640, footer }) {
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "40px 16px", overflowY: "auto" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ background: "#fff", borderRadius: 12, width: "100%", maxWidth: width, boxShadow: "0 20px 60px rgba(15,23,42,0.25)", border: "1px solid #e2e7ee" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #edf0f4" }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#0f2a52" }}>{title}</h2>
          <IconBtn icon={X} label="Close" onClick={onClose} />
        </div>
        <div style={{ padding: 20, maxHeight: "70vh", overflowY: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "14px 20px", borderTop: "1px solid #edf0f4", display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>}
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = "Delete", danger = true }) {
  return (
    <Modal open={open} onClose={onCancel} title={title} width={420}
      footer={<>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button>
      </>}>
      <p style={{ margin: 0, color: "#334155", fontSize: 14, lineHeight: 1.5 }}>{message}</p>
    </Modal>
  );
}

let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, tone = "success") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, message, tone }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);
  const ToastHost = () => (
    <div aria-live="polite" style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 2000 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.tone === "error" ? "#a3271f" : t.tone === "info" ? "#0f2a52" : "#1a7f4b",
          color: "#fff", padding: "10px 16px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.18)", maxWidth: 340,
        }}>{t.message}</div>
      ))}
    </div>
  );
  return { push, ToastHost };
}

/* ============================================================
   KPI CARD
   ============================================================ */
const KPICard = ({ label, value, sub, tone = "navy", icon: Icon }) => (
  <div style={{
    background: "#fff", border: "1px solid #e2e7ee", borderRadius: 10, padding: "14px 16px",
    display: "flex", flexDirection: "column", gap: 6, minWidth: 0,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
      {Icon && <Icon size={14} />} {label}
    </div>
    <div style={{ fontSize: 24, fontWeight: 800, color: "#0f2a52", lineHeight: 1.1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: "#8592a3" }}>{sub}</div>}
  </div>
);

/* ============================================================
   MAIN APP
   ============================================================ */
export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [search, setSearch] = useState("");
  const [drawer, setDrawer] = useState(null); // { type, id }
  const [confirmState, setConfirmState] = useState(null);
  const [importState, setImportState] = useState(null);
  const saveTimer = useRef(null);
  const { push, ToastHost } = useToasts();
  const fileInputRef = useRef(null);

  useEffect(() => {
    (async () => {
      const loaded = await loadPersisted();
      if (loaded && loaded.initiatives) {
        setData({ ...defaultData(), ...loaded, settings: { ...DEFAULT_SETTINGS, ...(loaded.settings||{}) } });
      } else {
        setData(defaultData());
      }
      setLoading(false);
    })();
  }, []);

  // autosave
  useEffect(() => {
    if (!data || loading) return;
    if (!data.settings.autosaveEnabled) return;
    setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => { doSave(); }, data.settings.autosaveDelayMs || 1200);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); doSave(true); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); document.getElementById("global-search-input")?.focus(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const doSave = useCallback(async (manual=false) => {
    setSaving(true);
    setData(prev => {
      const next = { ...prev, lastSaved: new Date().toISOString() };
      savePersisted(next).then(ok => {
        setSaving(false);
        setDirty(false);
        if (manual) push(ok ? "Saved successfully" : "Save failed — check storage", ok ? "success" : "error");
      });
      return next;
    });
  }, [push]);

  const update = useCallback((mutator) => {
    setData(prev => {
      const next = typeof mutator === "function" ? mutator(prev) : mutator;
      return next;
    });
  }, []);

  const log = useCallback((entry) => {
    update(prev => ({
      ...prev,
      activityLog: [{ id: uid("LOG"), date: new Date().toISOString(), user: prev.settings.userDisplayName, ...entry }, ...prev.activityLog].slice(0, 500),
    }));
  }, [update]);

  if (loading || !data) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, system-ui, sans-serif", color: "#64748b" }}>
        Loading Objective 5 workspace…
      </div>
    );
  }

  return (
    <AppShell
      data={data} update={update} log={log}
      dirty={dirty} saving={saving} onSave={() => doSave(true)}
      search={search} setSearch={setSearch}
      drawer={drawer} setDrawer={setDrawer}
      confirmState={confirmState} setConfirmState={setConfirmState}
      importState={importState} setImportState={setImportState}
      fileInputRef={fileInputRef} push={push}
    >
      <ToastHost />
    </AppShell>
  );
}

/* ============================================================
   APP SHELL
   ============================================================ */
const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "timeline", label: "Timeline", icon: GanttChartSquare },
  { id: "initiatives", label: "Releases", icon: ListChecks },
  { id: "kpi", label: "Delivery Performance", icon: LineChartIcon },
  { id: "reviews", label: "Release Reviews", icon: CheckCircle2 },
  { id: "alignments", label: "Alignments", icon: Users },
  { id: "risks", label: "Risks & Dependencies", icon: ShieldAlert },
  { id: "log", label: "Activity Log", icon: History },
  { id: "settings", label: "Settings & Data", icon: SettingsIcon },
];

function AppShell({ data, update, log, dirty, saving, onSave, search, setSearch, drawer, setDrawer, confirmState, setConfirmState, importState, setImportState, fileInputRef, push, children }) {
  const activeTab = data.ui.activeTab || "overview";
  const setActiveTab = (id) => update(p => ({ ...p, ui: { ...p.ui, activeTab: id } }));
  const [navCollapsed, setNavCollapsed] = useState(false);

  const activeInitiatives = data.initiatives.filter(i => !i.archived);
  const activeRisks = data.risks;
  const health = computeObjectiveHealth(data);

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `objective5-backup-${todayISO()}.json`; a.click();
    URL.revokeObjectURL(url);
    push("Exported JSON backup");
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif", background: "#f4f6f9", minHeight: "100vh", color: "#1c2733" }}>
      {children}
      <style>{`
        * { box-sizing: border-box; }
        button:focus-visible, input:focus-visible, select:focus-visible, textarea:focus-visible, [tabindex]:focus-visible {
          outline: 2px solid #0f2a52; outline-offset: 2px;
        }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-thumb { background: #d7dde5; border-radius: 6px; }
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
        }
        @media (max-width: 900px) {
          .app-nav-labels { display: none !important; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Sidebar */}
        <aside className="no-print" style={{
          width: navCollapsed ? 64 : 236, flexShrink: 0, background: "#0f2a52", color: "#fff",
          display: "flex", flexDirection: "column", transition: "width 0.15s ease", position: "sticky", top: 0, height: "100vh",
        }}>
          <div style={{ padding: navCollapsed ? "18px 12px" : "20px 18px", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
            {!navCollapsed && <>
              <div style={{ fontSize: 11, letterSpacing: 1, color: "#93a6c9", fontWeight: 700 }}>BA STRATEGY 2026</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>Objective 5</div>
              <div style={{ fontSize: 12, color: "#c4d0e5" }}>Delivery Excellence</div>
            </>}
            {navCollapsed && <div style={{ fontSize: 18, fontWeight: 800, textAlign: "center" }}>O5</div>}
          </div>
          <nav style={{ flex: 1, padding: "10px 8px", display: "flex", flexDirection: "column", gap: 2 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                aria-current={activeTab === t.id ? "page" : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, border: "none",
                  background: activeTab === t.id ? "rgba(255,255,255,0.14)" : "transparent",
                  color: activeTab === t.id ? "#fff" : "#c4d0e5", fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                  textAlign: "left", width: "100%",
                }}>
                <t.icon size={16} />
                <span className="app-nav-labels">{navCollapsed ? "" : t.label}</span>
              </button>
            ))}
          </nav>
          <div style={{ padding: 10 }}>
            <button onClick={() => setNavCollapsed(v => !v)} style={{
              width: "100%", padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent", color: "#c4d0e5", cursor: "pointer", fontSize: 12,
            }}>{navCollapsed ? "»" : "« Collapse"}</button>
          </div>
        </aside>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <header className="no-print" style={{
            background: "#fff", borderBottom: "1px solid #e2e7ee", padding: "14px 24px",
            display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 50,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#8592a3", letterSpacing: 0.3 }}>OBJECTIVE 5 — STREAM 1: DRIVE THE VALUE</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f2a52" }}>
                "Deliver on time and on client expectation, every time."
                <span style={{ marginLeft: 10 }}><Badge tone="navy">Owner: {data.settings.objectiveOwner}</Badge></span>
              </div>
            </div>
            <div style={{ position: "relative", width: 260 }}>
              <Search size={15} style={{ position: "absolute", left: 10, top: 9, color: "#8592a3" }} />
              <input id="global-search-input" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search everything… (Ctrl+K)"
                style={{ ...inputStyle, paddingLeft: 30, fontSize: 13 }} />
            </div>
            <Badge tone={{ "On Track":"green","Attention Required":"amber","At Risk":"amber","Delayed":"red","Completed":"green","No Data":"neutral" }[health]}>
              <Circle size={8} fill={healthColor(health)} color={healthColor(health)} /> {health}
            </Badge>
            {READ_ONLY ? (
              <Badge tone="navy">View only</Badge>
            ) : (
              <>
                <div style={{ fontSize: 11.5, color: "#8592a3", textAlign: "right", minWidth: 120 }}>
                  {saving ? "Saving…" : dirty ? "Unsaved changes" : `Saved ${data.lastSaved ? fmtDateTime(data.lastSaved) : "never"}`}
                </div>
                <Button variant="secondary" icon={Save} onClick={onSave}>Save</Button>
              </>
            )}
          </header>

          <main style={{ flex: 1, padding: "22px 26px", maxWidth: 1500, width: "100%", margin: "0 auto" }}>
            {search.trim() ? (
              <GlobalSearchResults data={data} query={search} onClear={() => setSearch("")} setDrawer={setDrawer} setActiveTab={setActiveTab} />
            ) : (
              <>
                {activeTab === "overview" && <OverviewTab data={data} update={update} log={log} health={health} setActiveTab={setActiveTab} exportJSON={exportJSON} setDrawer={setDrawer} />}
                {activeTab === "timeline" && <TimelineTab data={data} update={update} log={log} drawer={drawer} setDrawer={setDrawer} push={push} confirmState={confirmState} setConfirmState={setConfirmState} />}
                {activeTab === "initiatives" && <InitiativesTab data={data} update={update} log={log} drawer={drawer} setDrawer={setDrawer} push={push} confirmState={confirmState} setConfirmState={setConfirmState} />}
                {activeTab === "kpi" && <DeliveryPerformanceTab data={data} update={update} log={log} push={push} />}
                {activeTab === "reviews" && <ReleaseReviewsTab data={data} update={update} log={log} push={push} drawer={drawer} setDrawer={setDrawer} />}
                {activeTab === "alignments" && <AlignmentsTab data={data} update={update} log={log} drawer={drawer} setDrawer={setDrawer} push={push} />}
                {activeTab === "risks" && <RisksTab data={data} update={update} log={log} drawer={drawer} setDrawer={setDrawer} push={push} confirmState={confirmState} setConfirmState={setConfirmState} />}
                {activeTab === "log" && <ActivityLogTab data={data} />}
                {activeTab === "settings" && <SettingsTab data={data} update={update} push={push} exportJSON={exportJSON} fileInputRef={fileInputRef} importState={importState} setImportState={setImportState} log={log} />}
              </>
            )}
          </main>
        </div>
      </div>

      {confirmState && (
        <ConfirmDialog open={!!confirmState} title={confirmState.title} message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          onConfirm={() => { confirmState.onConfirm(); setConfirmState(null); }}
          onCancel={() => setConfirmState(null)} />
      )}
    </div>
  );
}

/* ============================================================
   GLOBAL SEARCH
   ============================================================ */
function GlobalSearchResults({ data, query, onClear, setDrawer, setActiveTab }) {
  const q = query.toLowerCase();
  const matches = (obj, fields) => fields.some(f => String(obj[f]||"").toLowerCase().includes(q));
  const initiatives = data.initiatives.filter(i => matches(i, ["name","description","owner","notes","latestUpdate"]));
  const activities = data.activities.filter(a => matches(a, ["name","description","owner","notes"]));
  const risks = data.risks.filter(r => matches(r, ["title","description","notes"]));
  const alignments = data.alignments.filter(a => matches(a, ["counterpart","topic","notes","agreedActions"]));

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 17, color: "#0f2a52" }}>Search results for "{query}"</h2>
        <Button variant="secondary" onClick={onClear}>Clear search</Button>
      </div>
      {[["Releases", initiatives, "initiatives"], ["Activities", activities, "timeline"], ["Risks & Dependencies", risks, "risks"], ["Alignments", alignments, "alignments"]].map(([label, list, tab]) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#64748b", marginBottom: 6, textTransform: "uppercase" }}>{label} ({list.length})</div>
          {list.length === 0 && <div style={{ fontSize: 13, color: "#94a3b8" }}>No matches.</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {list.slice(0, 10).map(item => (
              <button key={item.id} onClick={() => { setActiveTab(tab); }} style={{
                textAlign: "left", padding: "10px 12px", borderRadius: 8, border: "1px solid #e2e7ee", background: "#fff", cursor: "pointer", fontSize: 13.5, color: "#1c2733",
              }}>{item.name || item.title || item.counterpart}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   OVERVIEW TAB
   ============================================================ */
function OverviewTab({ data, update, log, health, setActiveTab, exportJSON, setDrawer }) {
  const initiatives = data.initiatives.filter(i => !i.archived);
  // Derived from the activities, so it moves as soon as work is updated.
  const overallProgress = objectiveProgressOf(data);
  const completed = initiatives.filter(i => i.status === "Completed").length;
  const delayed = initiatives.filter(i => i.status === "Delayed").length;
  const atRisk = initiatives.filter(i => i.status === "At Risk").length;
  const overdueActs = data.activities.filter(isOverdue);
  const openDeps = data.risks.filter(r => r.type === "Dependency" && r.status !== "Completed").length;
  const overdueAlignActions = data.alignments.filter(a => a.dueDate && new Date(a.dueDate) < new Date(todayISO()) && a.completionStatus !== "Completed").length;

  // KPI headlines come from completed milestones (same source as Delivery Performance)
  const dei = aggregateKpi(data, KPI_FIELDS[0]);
  const otd = aggregateKpi(data, KPI_FIELDS[1]);
  const fra = aggregateKpi(data, KPI_FIELDS[2]);
  const kpiSub = (agg) => agg ? `Average of ${agg.milestones} completed milestone${agg.milestones === 1 ? "" : "s"}` : "Not yet measured";

  const milestones = data.activities.filter(a => a.milestone).sort((a,b) => (a.plannedStart||"").localeCompare(b.plannedStart||""));
  const upcomingMilestone = milestones.find(m => m.status !== "Completed");
  const mostUrgentBlocker = data.activities.find(a => a.blocker) || data.risks.find(r => r.status === "Open" && r.type === "Issue");
  const latestUpdate = [...data.activityLog].sort((a,b)=> new Date(b.date)-new Date(a.date))[0];

  // Progress bar against the actual Objective 5 delivery plan (26 Jul 2026 – 22 Jul 2027)
  const planStart = new Date(OBJECTIVE5_QUARTERS[0].start);
  const planEnd = new Date(OBJECTIVE5_QUARTERS[OBJECTIVE5_QUARTERS.length - 1].end);
  const now = new Date();
  const planTotalDays = daysBetween(planStart, planEnd);
  const elapsedDays = Math.max(0, Math.min(planTotalDays, daysBetween(planStart, now)));
  const quarterProgressPct = now < planStart ? 0 : Math.round((elapsedDays / planTotalDays) * 100);
  const activeQ = OBJECTIVE5_QUARTERS.find(q => now >= new Date(q.start) && now <= new Date(q.end));
  const currentQuarter = now < planStart ? "Before plan start (26 Jul 2026)" : (activeQ ? `${activeQ.label} (${activeQ.range})` : "After plan end");

  const quickAction = (kind) => {
    if (kind === "activity") setActiveTab("timeline");
    if (kind === "milestone") setActiveTab("timeline");
    if (kind === "kpi") setActiveTab("kpi");
    if (kind === "risk") setActiveTab("risks");
    if (kind === "alignment") setActiveTab("alignments");
    if (kind === "export") exportJSON();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: "linear-gradient(135deg,#0f2a52,#173a6b)", borderRadius: 14, padding: "22px 26px", color: "#fff" }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5, color: "#a9bcdd" }}>OBJECTIVE STATEMENT</div>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 4 }}>"Deliver on time and on client expectation, every time."</div>
        <div style={{ fontSize: 13.5, marginTop: 8, color: "#c4d0e5" }}>"Predictable delivery means less firefighting and more trust."</div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 8, background: "rgba(255,255,255,0.18)", borderRadius: 999, overflow: "hidden" }}>
            <div style={{ width: `${quarterProgressPct}%`, height: "100%", background: "#7ea3e0" }} />
          </div>
          <span style={{ fontSize: 12, color: "#c4d0e5" }}>{currentQuarter} · Q1 → Q4 2026</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        <KPICard label="Objective Progress" value={`${overallProgress}%`} sub={`Average of ${leafActivities(data.activities).length} activities`} />
        <KPICard label="Delivery Excellence Index" value={dei ? `${dei.pct}%` : "No data"} sub={kpiSub(dei)} />
        <KPICard label="On-Time Delivery Rate" value={otd ? `${otd.pct}%` : "No data"} sub={kpiSub(otd)} />
        <KPICard label="First-Review Acceptance" value={fra ? `${fra.pct}%` : "No data"} sub={kpiSub(fra)} />
        <KPICard label="Total Releases" value={initiatives.length} />
        <KPICard label="Completed Releases" value={completed} />
        <KPICard label="Delayed Releases" value={delayed} tone="red" />
        <KPICard label="At-Risk Releases" value={atRisk} tone="amber" />
        <KPICard label="Open Dependencies" value={openDeps} />
        <KPICard label="Overdue Alignment Actions" value={overdueAlignActions} />
        <KPICard label="Overdue Activities" value={overdueActs.length} />
        <KPICard label="Last Saved" value={data.lastSaved ? fmtDateTime(data.lastSaved).split(" ").slice(0,2).join(" ") : "—"} sub={data.lastSaved ? fmtDateTime(data.lastSaved) : "Not saved yet"} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 }}>
          <div style={{ fontWeight: 700, color: "#0f2a52", marginBottom: 10 }}>Release Progress Summary</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {initiatives.map(i => {
              const rp = releaseProgress(data, i.id);
              return (
              <div key={i.id}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
                  <span style={{ fontWeight: 600 }}>{i.id} · {i.name}</span>
                  <span style={{ color: "#64748b" }}>{rp.pct}% · {rp.completed}/{rp.total} · <Badge tone={statusTone(i.status)}>{i.status}</Badge></span>
                </div>
                <div style={{ height: 8, background: "#eef1f5", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${rp.pct}%`, height: "100%", background: "#0f2a52" }} />
                </div>
              </div>
              );
            })}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ fontWeight: 700, color: "#0f2a52" }}>Snapshot</div>
          <div style={{ fontSize: 13 }}><strong>Upcoming milestone:</strong> {upcomingMilestone ? `${upcomingMilestone.name} (${fmtDate(upcomingMilestone.plannedStart)})` : "None scheduled"}</div>
          <div style={{ fontSize: 13 }}><strong>Most urgent blocker:</strong> {mostUrgentBlocker ? (mostUrgentBlocker.blocker || mostUrgentBlocker.title) : "None recorded"}</div>
          <div style={{ fontSize: 13 }}><strong>Latest update:</strong> {latestUpdate ? `${latestUpdate.action} — ${latestUpdate.recordName}` : "No activity yet"}</div>
        </div>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 }}>
        <div style={{ fontWeight: 700, color: "#0f2a52", marginBottom: 12 }}>Quick Actions</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Button variant="secondary" icon={Plus} onClick={() => quickAction("activity")}>Add activity</Button>
          <Button variant="secondary" icon={Flag} onClick={() => quickAction("milestone")}>Add milestone</Button>
          <Button variant="secondary" icon={LineChartIcon} onClick={() => quickAction("kpi")}>Record KPI result</Button>
          <Button variant="secondary" icon={ShieldAlert} onClick={() => quickAction("risk")}>Add risk</Button>
          <Button variant="secondary" icon={Users} onClick={() => quickAction("alignment")}>Add alignment meeting</Button>
          <Button variant="secondary" icon={Download} onClick={() => quickAction("export")}>Export report</Button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TIMELINE TAB (Gantt-style, quarter/month/week/list views)
   ============================================================ */
/**
 * Builds the timeline header columns for the selected zoom level.
 * Each column carries its real day-span so it can be laid out with
 * `flex: days` — that makes column widths exactly proportional to time,
 * so the gridlines line up with the bars (which are positioned by % of days).
 */
function buildTimelineColumns(view, rangeStart, rangeEnd) {
  const cols = [];
  const clampDays = (s, e) => Math.max(1, daysBetween(s < rangeStart ? rangeStart : s, e > rangeEnd ? rangeEnd : e));

  if (view === "Monthly") {
    let cur = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);
    while (cur <= rangeEnd) {
      const monthStart = new Date(cur);
      const monthEnd = new Date(cur.getFullYear(), cur.getMonth() + 1, 0);
      cols.push({
        key: `${cur.getFullYear()}-${cur.getMonth()}`,
        label: monthStart.toLocaleDateString(undefined, { month: "short" }),
        sub: String(monthStart.getFullYear()),
        days: clampDays(monthStart, monthEnd),
      });
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1);
    }
    return cols;
  }

  if (view === "Weekly") {
    // Weeks start on Sunday (matches the Sun–Thu working week).
    const first = new Date(rangeStart);
    first.setDate(first.getDate() - first.getDay());
    let cur = new Date(first);
    let n = 1;
    while (cur <= rangeEnd) {
      const wStart = new Date(cur);
      const wEnd = new Date(cur);
      wEnd.setDate(wEnd.getDate() + 6);
      cols.push({
        key: wStart.toISOString().slice(0, 10),
        label: `W${n}`,
        sub: wStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        days: clampDays(wStart, wEnd),
      });
      cur.setDate(cur.getDate() + 7);
      n++;
    }
    return cols;
  }

  // Quarterly (default)
  return OBJECTIVE5_QUARTERS.map(q => ({
    key: q.label,
    label: q.label,
    sub: q.range,
    days: clampDays(new Date(q.start), new Date(q.end)),
  }));
}

function quarterOfDate(iso) {
  const d = new Date(iso);
  const m = d.getMonth();
  return `Q${Math.floor(m/3)+1} ${d.getFullYear()}`;
}

function TimelineTab({ data, update, log, drawer, setDrawer, push, confirmState, setConfirmState }) {
  const [view, setView] = useState(data.ui.timelineView || "Quarterly");
  const [collapsed, setCollapsed] = useState({});
  const [dragState, setDragState] = useState(null);
  const [rowDragId, setRowDragId] = useState(null);
  const [rowDragOverId, setRowDragOverId] = useState(null);
  const containerRef = useRef(null);

  const rangeStart = new Date(OBJECTIVE5_QUARTERS[0].start);
  const rangeEnd = new Date(OBJECTIVE5_QUARTERS[OBJECTIVE5_QUARTERS.length - 1].end);
  const totalDays = daysBetween(rangeStart, rangeEnd);

  const setTimelineView = (v) => { setView(v); update(p => ({ ...p, ui: { ...p.ui, timelineView: v } })); };

  const initiatives = data.initiatives.filter(i => !i.archived).sort((a,b)=>a.order-b.order);

  const dayToPct = (iso) => {
    if (!iso) return 0;
    const d = new Date(iso);
    return Math.max(0, Math.min(100, (daysBetween(rangeStart, d) / totalDays) * 100));
  };

  // ---- Reordering (up/down arrows + drag-and-drop) within same initiative + same parent group ----
  const siblingsOf = (act) => data.activities
    .filter(a => a.initiativeId === act.initiativeId && (a.parentActivityId||null) === (act.parentActivityId||null))
    .sort((a,b)=>a.order-b.order);

  const applyOrder = (act, orderedIds) => {
    const orderMap = new Map(orderedIds.map((id,i)=>[id,i]));
    update(p => ({
      ...p,
      activities: p.activities.map(a => (
        a.initiativeId === act.initiativeId && (a.parentActivityId||null) === (act.parentActivityId||null) && orderMap.has(a.id)
      ) ? { ...a, order: orderMap.get(a.id) } : a),
    }));
    log({ action: "Edited", recordType: "Activity", recordName: act.name, previousValue: "", newValue: "Reordered" });
  };

  const moveActivity = (act, direction) => {
    const ids = siblingsOf(act).map(s => s.id);
    const idx = ids.indexOf(act.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= ids.length) return;
    [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
    applyOrder(act, ids);
  };

  const dropReorder = (draggedId, targetAct) => {
    if (!draggedId || draggedId === targetAct.id) return;
    const dragged = data.activities.find(a => a.id === draggedId);
    if (!dragged) return;
    if (dragged.initiativeId !== targetAct.initiativeId || (dragged.parentActivityId||null) !== (targetAct.parentActivityId||null)) {
      push("You can only reorder within the same release and task level.", "error");
      return;
    }
    let ids = siblingsOf(targetAct).map(s => s.id).filter(id => id !== draggedId);
    const targetIdx = ids.indexOf(targetAct.id);
    ids.splice(targetIdx, 0, draggedId);
    applyOrder(targetAct, ids);
  };

  const saveActivity = (updated) => {
    update(p => ({ ...p, activities: p.activities.map(a => a.id === updated.id ? updated : a) }));
    log({ action: "Edited", recordType: "Activity", recordName: updated.name, previousValue: "", newValue: "Dates/details updated" });
  };

  const onMouseDownDrag = (e, activity, mode) => {
    if (READ_ONLY) return; // no rescheduling in view mode
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setDragState({ id: activity.id, mode, startX: e.clientX, origStart: activity.plannedStart, origEnd: activity.plannedEnd, containerWidth: rect.width });
  };

  useEffect(() => {
    if (!dragState) return;
    const onMove = (e) => {
      const deltaPx = e.clientX - dragState.startX;
      const deltaDays = Math.round((deltaPx / dragState.containerWidth) * totalDays);
      update(p => ({
        ...p,
        activities: p.activities.map(a => {
          if (a.id !== dragState.id) return a;
          let ns = new Date(dragState.origStart), ne = new Date(dragState.origEnd);
          if (dragState.mode === "move") {
            ns.setDate(ns.getDate() + deltaDays); ne.setDate(ne.getDate() + deltaDays);
          } else if (dragState.mode === "resize-left") {
            ns.setDate(ns.getDate() + deltaDays);
            if (ns >= ne) return a;
          } else if (dragState.mode === "resize-right") {
            ne.setDate(ne.getDate() + deltaDays);
            if (ne <= ns) return a;
          }
          return { ...a, plannedStart: ns.toISOString().slice(0,10), plannedEnd: ne.toISOString().slice(0,10) };
        }),
      }));
    };
    const onUp = () => {
      setDragState(null);
      update(p => ({ ...p }));
      log({ action: "Edited", recordType: "Activity", recordName: "Timeline reschedule", previousValue: "", newValue: "Dates changed via drag" });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragState]);

  // Header columns + horizontal zoom width for the selected view.
  const columns = useMemo(
    () => buildTimelineColumns(view, rangeStart, rangeEnd),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [view]
  );
  const LABEL_W = 300;
  // Quarterly fits the screen; Monthly/Weekly zoom in and scroll horizontally.
  const chartMinWidth =
    view === "Monthly" ? columns.length * 90 :
    view === "Weekly"  ? columns.length * 46 : 0;
  const innerMinWidth = chartMinWidth ? LABEL_W + chartMinWidth : undefined;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", gap: 6 }}>
          {["Quarterly","Monthly","Weekly","List"].map(v => (
            <button key={v} onClick={() => setTimelineView(v)} style={{
              padding: "7px 14px", borderRadius: 8, border: "1px solid #d7dde5", cursor: "pointer", fontSize: 13, fontWeight: 600,
              background: view === v ? "#0f2a52" : "#fff", color: view === v ? "#fff" : "#334155",
            }}>{v}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="secondary" icon={Flag} onClick={() => setDrawer({ type: "activity-new", initiativeId: initiatives[0]?.id, milestone: true })}>Add milestone</Button>
          <Button variant="primary" icon={Plus} onClick={() => setDrawer({ type: "activity-new", initiativeId: initiatives[0]?.id })}>Add activity</Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 14, fontSize: 12, color: "#64748b", marginBottom: 10, flexWrap: "wrap" }}>
        <LegendDot color="#0f2a52" label="Planned" />
        <LegendDot color="#1a7f4b" label="Completed" />
        <LegendDot color="#a3271f" label="Delayed / At risk" />
        <LegendDot color="#8a5a00" label="Actual range (hatched)" />
        <LegendDot color="#4c2f8a" label="Recurring" shape="diamond" />
        <LegendDot color="#0f2a52" label="Milestone ◆" shape="diamond" />
      </div>

      {view === "List" ? (
        <ListView data={data} update={update} log={log} setDrawer={setDrawer} />
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, overflowX: "auto", overflowY: "hidden" }}>
         <div style={{ minWidth: innerMinWidth }}>
          <div style={{ display: "flex", borderBottom: "1px solid #e2e7ee", background: "#f7f8fa" }}>
            <div style={{ width: LABEL_W, flexShrink: 0, padding: "10px 14px", fontWeight: 700, fontSize: 12, color: "#64748b", position: "sticky", left: 0, zIndex: 2, background: "#f7f8fa" }}>RELEASE / ACTIVITY</div>
            <div ref={containerRef} style={{ flex: 1, position: "relative", padding: "10px 0", display: "flex" }}>
              {columns.map(c => (
                <div key={c.key} title={c.sub}
                  style={{ flex: c.days, minWidth: 0, textAlign: "center", fontSize: view === "Weekly" ? 10.5 : 12, fontWeight: 700, color: "#64748b", borderLeft: "1px solid #e2e7ee", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {c.label}
                  <div style={{ fontSize: view === "Quarterly" ? 10 : 9.5, fontWeight: 500, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis" }}>{c.sub}</div>
                </div>
              ))}
            </div>
          </div>
          {initiatives.map(init => {
            const acts = data.activities.filter(a => a.initiativeId === init.id && !a.parentActivityId).sort((a,b)=>a.order-b.order);
            const isCollapsed = collapsed[init.id];
            return (
              <div key={init.id}>
                <div style={{ display: "flex", alignItems: "center", background: "#eef1f5", borderBottom: "1px solid #e2e7ee" }}>
                  <button onClick={() => setCollapsed(c => ({ ...c, [init.id]: !c[init.id] }))}
                    style={{ width: LABEL_W, flexShrink: 0, display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", border: "none", background: "#eef1f5", cursor: "pointer", fontWeight: 700, fontSize: 13, color: "#0f2a52", textAlign: "left", position: "sticky", left: 0, zIndex: 2 }}>
                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />} {init.id} · {init.name}
                  </button>
                  <div style={{ flex: 1, padding: "9px 14px", fontSize: 12, color: "#64748b" }}>
                    {init.owner} · {releaseProgress(data, init.id).pct}% complete ({releaseProgress(data, init.id).completed}/{releaseProgress(data, init.id).total})
                  </div>
                </div>
                {!isCollapsed && acts.map((act, actIdx) => {
                  const subtasks = data.activities.filter(a => a.parentActivityId === act.id).sort((a,b)=>a.order-b.order);
                  const rowKey = "row-" + act.id;
                  const subCollapsed = collapsed[rowKey];
                  return (
                    <div key={act.id}>
                      <TimelineRow activity={act} dayToPct={dayToPct} onMouseDownDrag={onMouseDownDrag}
                        displayProgress={activityProgress(data.activities, act)}
                        onClick={() => setDrawer({ type: "activity", id: act.id })}
                        isPrimary hasSubtasks={subtasks.length > 0} subCollapsed={subCollapsed}
                        onToggleSub={() => setCollapsed(c => ({ ...c, [rowKey]: !c[rowKey] }))}
                        onAddSubtask={() => setDrawer({ type: "activity-new", initiativeId: init.id, parentActivityId: act.id })}
                        canMoveUp={actIdx > 0} canMoveDown={actIdx < acts.length - 1}
                        onMoveUp={() => moveActivity(act, "up")} onMoveDown={() => moveActivity(act, "down")}
                        isRowDragging={rowDragId === act.id} isRowDragOver={rowDragOverId === act.id}
                        onRowDragStart={() => setRowDragId(act.id)}
                        onRowDragOver={(e) => { e.preventDefault(); setRowDragOverId(act.id); }}
                        onRowDrop={() => { dropReorder(rowDragId, act); setRowDragId(null); setRowDragOverId(null); }}
                        onRowDragEnd={() => { setRowDragId(null); setRowDragOverId(null); }}
                      />
                      {!subCollapsed && subtasks.map((st, stIdx) => (
                        <TimelineRow key={st.id} activity={st} dayToPct={dayToPct} onMouseDownDrag={onMouseDownDrag}
                          onClick={() => setDrawer({ type: "activity", id: st.id })} indent
                          canMoveUp={stIdx > 0} canMoveDown={stIdx < subtasks.length - 1}
                          onMoveUp={() => moveActivity(st, "up")} onMoveDown={() => moveActivity(st, "down")}
                          isRowDragging={rowDragId === st.id} isRowDragOver={rowDragOverId === st.id}
                          onRowDragStart={() => setRowDragId(st.id)}
                          onRowDragOver={(e) => { e.preventDefault(); setRowDragOverId(st.id); }}
                          onRowDrop={() => { dropReorder(rowDragId, st); setRowDragId(null); setRowDragOverId(null); }}
                          onRowDragEnd={() => { setRowDragId(null); setRowDragOverId(null); }}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
         </div>
        </div>
      )}

      {drawer && drawer.type === "activity" && (
        <ActivityDrawer data={data} update={update} log={log} activityId={drawer.id} onClose={() => setDrawer(null)} push={push} confirmState={confirmState} setConfirmState={setConfirmState} setDrawer={setDrawer} />
      )}
      {drawer && drawer.type === "activity-new" && (
        <ActivityDrawer data={data} update={update} log={log} isNew initiativeId={drawer.initiativeId} milestone={drawer.milestone} parentActivityId={drawer.parentActivityId} onClose={() => setDrawer(null)} push={push} setDrawer={setDrawer} />
      )}
    </div>
  );
}

const LegendDot = ({ color, label, shape }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
    <span style={{
      width: 10, height: 10, background: color,
      borderRadius: shape === "diamond" ? 2 : 999, transform: shape === "diamond" ? "rotate(45deg)" : "none",
    }} />
    {label}
  </span>
);

function TimelineRow({ activity, dayToPct, onMouseDownDrag, onClick, displayProgress, isPrimary, hasSubtasks, subCollapsed, onToggleSub, onAddSubtask, indent, canMoveUp, canMoveDown, onMoveUp, onMoveDown, isRowDragging, isRowDragOver, onRowDragStart, onRowDragOver, onRowDrop, onRowDragEnd }) {
  const left = dayToPct(activity.plannedStart);
  const right = dayToPct(activity.plannedEnd);
  const width = Math.max(right - left, activity.milestone ? 0 : 1);
  const overdue = isOverdue(activity);
  let color = "#0f2a52";
  if (activity.status === "Completed") color = "#1a7f4b";
  else if (overdue || activity.status === "Delayed" || activity.status === "At Risk") color = "#a3271f";
  else if (activity.recurring) color = "#4c2f8a";
  const reorderable = !READ_ONLY && !!(onMoveUp || onMoveDown);

  return (
    <div
      draggable={reorderable}
      onDragStart={reorderable ? onRowDragStart : undefined}
      onDragOver={reorderable ? onRowDragOver : undefined}
      onDrop={reorderable ? (e) => { e.preventDefault(); onRowDrop && onRowDrop(); } : undefined}
      onDragEnd={reorderable ? onRowDragEnd : undefined}
      style={{
        display: "flex", alignItems: "center", borderBottom: "1px solid #f0f2f5",
        background: isRowDragOver ? "#e9edf5" : (indent ? "#fafbfc" : "transparent"),
        opacity: isRowDragging ? 0.4 : 1,
        borderTop: isRowDragOver ? "2px solid #0f2a52" : "1px solid transparent",
      }}
    >
      <div style={{
        width: 300, flexShrink: 0, display: "flex", alignItems: "center",
        position: "sticky", left: 0, zIndex: 1,
        background: isRowDragOver ? "#e9edf5" : (indent ? "#fafbfc" : "#fff"),
      }}>
        {reorderable && (
          <span title="Drag to reorder" style={{ cursor: "grab", color: "#b7c1cf", display: "flex", padding: "8px 0 8px 6px" }}>
            <GripVertical size={13} />
          </span>
        )}
        {reorderable && (
          <span style={{ display: "flex", flexDirection: "column" }}>
            <button onClick={onMoveUp} disabled={!canMoveUp} aria-label="Move up" title="Move up"
              style={{ border: "none", background: "transparent", cursor: canMoveUp ? "pointer" : "not-allowed", color: canMoveUp ? "#64748b" : "#d7dde5", padding: "0 2px", lineHeight: 0 }}>
              <ChevronUp size={12} />
            </button>
            <button onClick={onMoveDown} disabled={!canMoveDown} aria-label="Move down" title="Move down"
              style={{ border: "none", background: "transparent", cursor: canMoveDown ? "pointer" : "not-allowed", color: canMoveDown ? "#64748b" : "#d7dde5", padding: "0 2px", lineHeight: 0 }}>
              <ChevronDown size={12} />
            </button>
          </span>
        )}
        {hasSubtasks && (
          <button onClick={onToggleSub} aria-label={subCollapsed ? "Expand sub-tasks" : "Collapse sub-tasks"}
            style={{ border: "none", background: "transparent", cursor: "pointer", padding: "8px 0 8px 6px", color: "#64748b" }}>
            {subCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
          </button>
        )}
        <button onClick={onClick} style={{
          flex: 1, textAlign: "left", padding: `8px 8px 8px ${indent ? 24 : (hasSubtasks ? 4 : 10)}px`, border: "none", background: "transparent",
          cursor: "pointer", fontSize: indent ? 12 : 12.5, color: indent ? "#64748b" : "#334155", display: "flex", alignItems: "center", gap: 6,
          fontWeight: isPrimary ? 600 : 400,
        }}>
          {activity.milestone ? <Flag size={12} color="#0f2a52" /> : <Circle size={6} fill={color} color={color} />}
          <span style={{ textDecoration: activity.status === "Completed" ? "line-through" : "none" }}>{activity.name}</span>
          {overdue && <AlertTriangle size={12} color="#a3271f" aria-label="Overdue" />}
        </button>
        {!READ_ONLY && isPrimary && onAddSubtask && !activity.milestone && (
          <button onClick={onAddSubtask} aria-label="Add sub-task" title="Add sub-task"
            style={{ border: "none", background: "transparent", cursor: "pointer", color: "#8592a3", padding: "8px 8px 8px 0" }}>
            <Plus size={13} />
          </button>
        )}
      </div>
      <div style={{ flex: 1, position: "relative", height: 30 }}>
        {activity.milestone ? (
          <div title={`${activity.name} — ${fmtDate(activity.plannedStart)}`}
            style={{ position: "absolute", left: `${left}%`, top: "50%", transform: "translate(-50%,-50%) rotate(45deg)", width: 12, height: 12, background: color, cursor: "pointer" }}
            onClick={onClick} />
        ) : (
          <div
            title={`${activity.name}\nPlanned: ${fmtDate(activity.plannedStart)} → ${fmtDate(activity.plannedEnd)}\nStatus: ${activity.status} · ${displayProgress ?? activity.progress}%`}
            style={{
              position: "absolute", left: `${left}%`, width: `${width}%`, top: "50%", transform: "translateY(-50%)",
              height: indent ? 14 : 18, borderRadius: 5, background: color, opacity: indent ? 0.7 : 0.85, cursor: "grab", display: "flex", alignItems: "center",
            }}
            onMouseDown={(e) => onMouseDownDrag(e, activity, "move")}
            onClick={onClick}
          >
            <div style={{ width: `${clampProgress(displayProgress ?? activity.progress)}%`, height: "100%", background: "rgba(255,255,255,0.35)", borderRadius: 5 }} />
            <div onMouseDown={(e)=>onMouseDownDrag(e, activity, "resize-left")} style={{ position: "absolute", left: -3, top: 0, bottom: 0, width: 6, cursor: "ew-resize" }} />
            <div onMouseDown={(e)=>onMouseDownDrag(e, activity, "resize-right")} style={{ position: "absolute", right: -3, top: 0, bottom: 0, width: 6, cursor: "ew-resize" }} />
          </div>
        )}
      </div>
    </div>
  );
}

function ListView({ data, update, log, setDrawer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.activities.slice().sort((a,b)=>(a.plannedStart||"").localeCompare(b.plannedStart||"")).map(a => (
        <button key={a.id} onClick={() => setDrawer({ type: "activity", id: a.id })} style={{
          textAlign: "left", background: "#fff", border: "1px solid #e2e7ee", borderRadius: 10, padding: 14, cursor: "pointer",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 13.5, color: "#0f2a52" }}>{a.milestone ? "◆ " : ""}{a.name}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <Badge tone={statusTone(a.status)}>{a.status}</Badge>
              {isOverdue(a) && <Badge tone="red">Overdue</Badge>}
            </div>
          </div>
          <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4 }}>
            {fmtDate(a.plannedStart)} → {fmtDate(a.plannedEnd)} · Owner: {a.owner} · Progress: {a.progress}%
          </div>
        </button>
      ))}
    </div>
  );
}

function ActivityDrawer({ data, update, log, activityId, isNew, initiativeId, milestone, parentActivityId, onClose, push, confirmState, setConfirmState, setDrawer }) {
  const existing = !isNew ? data.activities.find(a => a.id === activityId) : null;
  const [form, setForm] = useState(existing || {
    id: uid("ACT"), initiativeId: initiativeId || data.initiatives[0]?.id, name: "", description: "",
    owner: data.settings.objectiveOwner, support: [], plannedStart: todayISO(), plannedEnd: todayISO(),
    actualStart: "", actualEnd: "", status: "Not Started", priority: "Medium", progress: 0,
    dependencyType: "Finish-to-Start", predecessors: [], deliverable: "", milestone: !!milestone,
    recurring: false, recurrenceFrequency: "", blocker: "", risk: "", notes: "", evidence: "",
    lastUpdate: "", createdDate: todayISO(), updatedDate: todayISO(), order: data.activities.length,
    parentActivityId: parentActivityId || null,
  });
  const [error, setError] = useState("");

  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const primaryTasksInInitiative = data.activities.filter(a => a.initiativeId === form.initiativeId && !a.parentActivityId && a.id !== form.id && !a.milestone);
  const subtasksOfThis = !isNew ? data.activities.filter(a => a.parentActivityId === form.id) : [];

  const validate = () => {
    if (!form.name.trim()) return "Activity name is required.";
    if (!form.initiativeId) return "Release is required.";
    if (new Date(form.plannedEnd) < new Date(form.plannedStart)) return "Planned end cannot precede planned start.";
    if (form.actualStart && form.actualEnd && new Date(form.actualEnd) < new Date(form.actualStart)) return "Actual end cannot precede actual start.";
    if (form.progress < 0 || form.progress > 100) return "Progress must be between 0 and 100.";
    if (form.recurring && !form.recurrenceFrequency) return "Recurring activities require a recurrence frequency.";
    if (form.predecessors.includes(form.id)) return "An activity cannot depend on itself.";
    if (form.parentActivityId === form.id) return "A task cannot be its own parent.";
    if (form.parentActivityId) {
      const parent = data.activities.find(a => a.id === form.parentActivityId);
      if (parent && parent.parentActivityId) return "A sub-task's parent must be a primary task (no nested sub-tasks).";
    }
    if (form.milestone) {
      for (const f of KPI_FIELDS) {
        const raw = form[f.key];
        const filled = raw !== null && raw !== undefined && raw !== "";
        if (filled) {
          const n = Number(raw);
          if (isNaN(n)) return `${f.short}: enter a number between 0 and 100.`;
          if (n < 0 || n > 100) return `${f.short}: percentage must be between 0 and 100.`;
        }
        // Completed milestones feed the quarter average, so their KPIs are required.
        if (!filled && form.status === "Completed") {
          return `${f.short} is required before this milestone can be marked Completed.`;
        }
      }
    }
    return "";
  };

  const save = () => {
    const err = validate();
    if (err) { setError(err); return; }
    const updated = { ...form, updatedDate: todayISO() };
    // Percentages are persisted as numbers (or null when left blank)
    if (updated.milestone) {
      for (const f of KPI_FIELDS) {
        const raw = updated[f.key];
        updated[f.key] = (raw === null || raw === undefined || raw === "") ? null : Number(raw);
      }
    }
    update(p => {
      const exists = p.activities.some(a => a.id === updated.id);
      return { ...p, activities: exists ? p.activities.map(a => a.id === updated.id ? updated : a) : [...p.activities, updated] };
    });
    log({ action: isNew ? "Added" : "Edited", recordType: "Activity", recordName: updated.name, previousValue: "", newValue: isNew ? "Created" : "Updated" });
    push(isNew ? "Activity added" : "Activity updated");
    onClose();
  };

  const remove = () => {
    setConfirmState({
      title: "Delete activity?", message: `This will permanently remove "${form.name}".`,
      confirmLabel: "Delete",
      onConfirm: () => {
        update(p => ({ ...p, activities: p.activities.filter(a => a.id !== form.id) }));
        log({ action: "Deleted", recordType: "Activity", recordName: form.name, previousValue: "Existed", newValue: "Removed" });
        push("Activity deleted");
        onClose();
      },
    });
  };

  return (
    <Modal open onClose={onClose} title={isNew ? (parentActivityId ? "Add Sub-task" : "Add Activity") : (form.parentActivityId ? `Sub-task · ${form.name || ""}` : "Activity Details")} width={620}
      footer={<>
        {!isNew && !form.milestone && !form.parentActivityId && (
          <Button variant="secondary" icon={Plus} onClick={() => { onClose(); setDrawer({ type: "activity-new", initiativeId: form.initiativeId, parentActivityId: form.id }); }}>Add sub-task</Button>
        )}
        {!isNew && <Button variant="danger" icon={Trash2} onClick={remove}>Delete</Button>}
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon={Save} onClick={save}>{isNew ? "Add" : "Save Changes"}</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && <div style={{ background: "#fbe9e7", color: "#a3271f", padding: "8px 12px", borderRadius: 8, fontSize: 13 }}>{error}</div>}
        <Field label="Activity name *"><Input value={form.name} onChange={e=>set("name", e.target.value)} /></Field>
        <Field label="Description"><TextArea value={form.description} onChange={e=>set("description", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Release">
            <Select value={form.initiativeId} onChange={e=>set("initiativeId", e.target.value)}>
              {data.initiatives.map(i => <option key={i.id} value={i.id}>{i.id} · {i.name}</option>)}
            </Select>
          </Field>
          <Field label="Parent task (optional — makes this a sub-task)">
            <Select value={form.parentActivityId || ""} onChange={e=>set("parentActivityId", e.target.value || null)}>
              <option value="">None — primary task</option>
              {primaryTasksInInitiative.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
            </Select>
          </Field>
          <Field label="Owner"><Input value={form.owner} onChange={e=>set("owner", e.target.value)} /></Field>
          <Field label="Planned start"><Input type="date" value={form.plannedStart} onChange={e=>set("plannedStart", e.target.value)} /></Field>
          <Field label="Planned end"><Input type="date" value={form.plannedEnd} onChange={e=>set("plannedEnd", e.target.value)} /></Field>
          <Field label="Actual start"><Input type="date" value={form.actualStart} onChange={e=>set("actualStart", e.target.value)} /></Field>
          <Field label="Actual end"><Input type="date" value={form.actualEnd} onChange={e=>set("actualEnd", e.target.value)} /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={e=>set("status", e.target.value)}>{data.settings.statusValues.map(s=><option key={s}>{s}</option>)}</Select>
          </Field>
          <Field label="Priority">
            <Select value={form.priority} onChange={e=>set("priority", e.target.value)}>{data.settings.priorityValues.map(s=><option key={s}>{s}</option>)}</Select>
          </Field>
          <Field label="Progress (%)"><Input type="number" min={0} max={100} value={form.progress} onChange={e=>set("progress", clampProgress(e.target.value))} /></Field>
          <Field label="Dependency type">
            <Select value={form.dependencyType} onChange={e=>set("dependencyType", e.target.value)}>
              {["Finish-to-Start","Start-to-Start","Finish-to-Finish","Start-to-Finish"].map(s=><option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Predecessors">
          <Select multiple value={form.predecessors} onChange={e=>set("predecessors", Array.from(e.target.selectedOptions).map(o=>o.value))} style={{ height: 90 }}>
            {data.activities.filter(a=>a.id!==form.id).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </Select>
        </Field>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <input type="checkbox" checked={form.milestone} onChange={e=>set("milestone", e.target.checked)} /> Milestone
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <input type="checkbox" checked={form.recurring} onChange={e=>set("recurring", e.target.checked)} /> Recurring
          </label>
          {form.recurring && (
            <Select value={form.recurrenceFrequency} onChange={e=>set("recurrenceFrequency", e.target.value)} style={{ width: 160 }}>
              <option value="">Select frequency</option>
              {["Weekly","Monthly","Quarterly"].map(f=><option key={f}>{f}</option>)}
            </Select>
          )}
        </div>
        <Field label="Deliverable"><Input value={form.deliverable} onChange={e=>set("deliverable", e.target.value)} /></Field>

        {/* ---- KPI measurement (milestones only) ---- */}
        {form.milestone && (
          <div style={{ border: "1px solid #c7d2e2", background: "#f7f8fa", borderRadius: 10, padding: 14 }}>
            <div style={{ fontWeight: 700, color: "#0f2a52", fontSize: 13.5 }}>KPI Measurement at this milestone</div>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 4, marginBottom: 10 }}>
              Enter each KPI as a percentage (0–100). Once this milestone is marked
              <strong> Completed</strong>, these values are averaged into its quarter on the
              Delivery Performance page — no manual KPI entry needed. Required to complete the milestone.
            </div>
            {KPI_FIELDS.map(f => {
              const target = ((RELEASE_META[form.initiativeId] || {}).kpiTargets || {})[f.key];
              const raw = form[f.key];
              const n = raw === "" || raw === null || raw === undefined ? null : Number(raw);
              const bad = n !== null && (isNaN(n) || n < 0 || n > 100);
              return (
                <div key={f.key} style={{ marginBottom: 10 }}>
                  <Field label={`${f.short} (%) *`}
                    error={bad ? "Enter a percentage between 0 and 100" : undefined}
                    hint={!bad ? (target == null ? "Baseline quarter — no target set" : `Target ${target}%`) : undefined}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Input type="number" min={0} max={100} step="0.1"
                        value={raw ?? ""} placeholder="0–100"
                        onChange={e => set(f.key, e.target.value)}
                        aria-label={`${f.short} percentage`} style={{ maxWidth: 140 }} />
                      <span aria-hidden style={{ fontSize: 15, fontWeight: 700, color: "#64748b" }}>%</span>
                      {n !== null && !bad && target != null && (
                        <Badge tone={n >= target ? "green" : "amber"}>
                          {n >= target ? "Meets target" : `${(n - target).toFixed(1)} pts vs target`}
                        </Badge>
                      )}
                    </div>
                  </Field>
                </div>
              );
            })}
          </div>
        )}

        <Field label="Blocker"><Input value={form.blocker} onChange={e=>set("blocker", e.target.value)} /></Field>
        <Field label="Notes"><TextArea value={form.notes} onChange={e=>set("notes", e.target.value)} /></Field>
        <Field label="Evidence link"><Input value={form.evidence} onChange={e=>set("evidence", e.target.value)} placeholder="https://…" /></Field>
        {!isNew && subtasksOfThis.length > 0 && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f2a52", marginTop: 4, marginBottom: 6 }}>Sub-tasks ({subtasksOfThis.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {subtasksOfThis.map(st => (
                <button key={st.id} onClick={() => setDrawer({ type: "activity", id: st.id })} style={{
                  display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 10px", background: "#f7f8fa",
                  borderRadius: 6, border: "none", cursor: "pointer", textAlign: "left", width: "100%",
                }}>
                  <span>{st.name}</span>
                  <Badge tone={statusTone(st.status)}>{st.status}</Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ============================================================
   INITIATIVES TAB
   ============================================================ */
function InitiativesTab({ data, update, log, drawer, setDrawer, push, confirmState, setConfirmState }) {
  const [viewMode, setViewMode] = useState("card");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const list = data.initiatives.filter(i => (showArchived ? i.archived : !i.archived))
    .filter(i => !filterOwner || i.owner === filterOwner)
    .filter(i => !filterStatus || i.status === filterStatus)
    .sort((a,b) => a.order - b.order);

  const owners = [...new Set(data.initiatives.map(i => i.owner))];

  const openNew = () => setDrawer({ type: "initiative-new" });
  const openEdit = (id) => setDrawer({ type: "initiative", id });

  const duplicate = (init) => {
    const copy = { ...init, id: uid("RELEASE"), name: init.name + " (Copy)", createdDate: todayISO(), updatedDate: todayISO(), order: data.initiatives.length };
    update(p => ({ ...p, initiatives: [...p.initiatives, copy] }));
    log({ action: "Added", recordType: "Release", recordName: copy.name, previousValue: "", newValue: `Duplicated from ${init.id}` });
    push("Release duplicated");
  };
  const archive = (init) => {
    update(p => ({ ...p, initiatives: p.initiatives.map(i => i.id === init.id ? { ...i, archived: true } : i) }));
    log({ action: "Archived", recordType: "Release", recordName: init.name, previousValue: "Active", newValue: "Archived" });
    push("Release archived");
  };
  const restore = (init) => {
    update(p => ({ ...p, initiatives: p.initiatives.map(i => i.id === init.id ? { ...i, archived: false } : i) }));
    log({ action: "Restored", recordType: "Release", recordName: init.name, previousValue: "Archived", newValue: "Active" });
    push("Release restored");
  };
  const remove = (init) => {
    setConfirmState({
      title: "Delete release?", message: `Permanently delete "${init.name}" and unlink its activities? This cannot be undone.`,
      onConfirm: () => {
        update(p => ({ ...p, initiatives: p.initiatives.filter(i => i.id !== init.id) }));
        log({ action: "Deleted", recordType: "Release", recordName: init.name, previousValue: "Existed", newValue: "Removed" });
        push("Release deleted");
      },
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <Select value={filterOwner} onChange={e=>setFilterOwner(e.target.value)} style={{ width: 160 }}>
            <option value="">All owners</option>
            {owners.map(o => <option key={o}>{o}</option>)}
          </Select>
          <Select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ width: 160 }}>
            <option value="">All statuses</option>
            {STATUS_VALUES.map(s => <option key={s}>{s}</option>)}
          </Select>
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
            <input type="checkbox" checked={showArchived} onChange={e=>setShowArchived(e.target.checked)} /> Show archived
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={()=>setViewMode("card")} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #d7dde5", background: viewMode==="card"?"#0f2a52":"#fff", color: viewMode==="card"?"#fff":"#334155", cursor:"pointer", fontSize: 13, fontWeight: 600 }}>Card view</button>
          <button onClick={()=>setViewMode("table")} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #d7dde5", background: viewMode==="table"?"#0f2a52":"#fff", color: viewMode==="table"?"#fff":"#334155", cursor:"pointer", fontSize: 13, fontWeight: 600 }}>Table view</button>
          <Button variant="primary" icon={Plus} onClick={openNew}>Add release</Button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 16 }}>
          {list.map(init => (
            <div key={init.id} style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11, color: "#8592a3", fontWeight: 700 }}>{init.id}</div>
                  <button onClick={()=>openEdit(init.id)} style={{ background: "none", border: "none", padding: 0, textAlign: "left", cursor: "pointer", fontSize: 14.5, fontWeight: 700, color: "#0f2a52" }}>{init.name}</button>
                </div>
                <Badge tone={priorityTone(init.priority)}>{init.priority}</Badge>
              </div>
              <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{init.description}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge tone={statusTone(init.status)}>{init.status}</Badge>
                <Badge>{init.confidence} confidence</Badge>
                <Badge>{init.deadline}</Badge>
              </div>
              <div>
                <div style={{ height: 7, background: "#eef1f5", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ width: `${releaseProgress(data, init.id).pct}%`, height: "100%", background: "#0f2a52" }} />
                </div>
                <div style={{ fontSize: 11.5, color: "#8592a3", marginTop: 3 }}>
                  {releaseProgress(data, init.id).pct}% complete · {releaseProgress(data, init.id).completed}/{releaseProgress(data, init.id).total} activities · Owner: {init.owner}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, marginTop: 4, borderTop: "1px solid #f0f2f5", paddingTop: 8 }}>
                <IconBtn icon={ChevronRight} label="Open" onClick={()=>openEdit(init.id)} />
                <IconBtn icon={Copy} label="Duplicate" onClick={()=>duplicate(init)} />
                {init.archived
                  ? <IconBtn icon={RotateCcw} label="Restore" onClick={()=>restore(init)} />
                  : <IconBtn icon={Archive} label="Archive" onClick={()=>archive(init)} />}
                <IconBtn icon={Trash2} label="Delete" tone="danger" onClick={()=>remove(init)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f7f8fa", textAlign: "left" }}>
                {["ID","Name","Owner","Status","Priority","Confidence","Progress","Deadline","Actions"].map(h => (
                  <th key={h} style={{ padding: "10px 12px", fontWeight: 700, color: "#64748b", fontSize: 11.5, textTransform: "uppercase", borderBottom: "1px solid #e2e7ee" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map(init => (
                <tr key={init.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>{init.id}</td>
                  <td style={{ padding: "10px 12px" }}><button onClick={()=>openEdit(init.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 700, color: "#0f2a52" }}>{init.name}</button></td>
                  <td style={{ padding: "10px 12px" }}>{init.owner}</td>
                  <td style={{ padding: "10px 12px" }}><Badge tone={statusTone(init.status)}>{init.status}</Badge></td>
                  <td style={{ padding: "10px 12px" }}><Badge tone={priorityTone(init.priority)}>{init.priority}</Badge></td>
                  <td style={{ padding: "10px 12px" }}>{init.confidence}</td>
                  <td style={{ padding: "10px 12px" }}>{releaseProgress(data, init.id).pct}%</td>
                  <td style={{ padding: "10px 12px" }}>{init.deadline}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      <IconBtn icon={ChevronRight} label="Open" onClick={()=>openEdit(init.id)} />
                      <IconBtn icon={Copy} label="Duplicate" onClick={()=>duplicate(init)} />
                      <IconBtn icon={Trash2} label="Delete" tone="danger" onClick={()=>remove(init)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {drawer && drawer.type === "initiative" && (
        <InitiativeDrawer data={data} update={update} log={log} initiativeId={drawer.id} onClose={()=>setDrawer(null)} push={push} setConfirmState={setConfirmState} />
      )}
      {drawer && drawer.type === "initiative-new" && (
        <InitiativeDrawer data={data} update={update} log={log} isNew onClose={()=>setDrawer(null)} push={push} />
      )}
    </div>
  );
}

function InitiativeDrawer({ data, update, log, initiativeId, isNew, onClose, push, setConfirmState }) {
  const existing = !isNew ? data.initiatives.find(i => i.id === initiativeId) : null;
  const [form, setForm] = useState(existing || {
    id: uid("RELEASE"), name: "", objective: "Objective 5 — Delivery Excellence", description: "",
    owner: data.settings.objectiveOwner, support: [], plannedStart: "2025-12-12", plannedEnd: "2026-12-11",
    actualStart: "", actualEnd: "", deadline: "Q1 2026", status: "Not Started", priority: "Medium",
    confidence: "Medium", progress: 0, servesKpi: [], deliverables: [], milestoneIds: [], dependencies: [],
    risks: [], latestUpdate: "", notes: "", evidenceLinks: [], createdDate: todayISO(), updatedDate: todayISO(),
    archived: false, order: data.initiatives.length,
  });
  const [error, setError] = useState("");
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const activities = data.activities.filter(a => a.initiativeId === form.id);

  const derivedProgress = releaseProgress(data, form.id);
  const validate = () => {
    if (!form.name.trim()) return "Release name is required.";
    // Progress is derived from the activities, so it is not validated as an input here.
    if (form.status === "Completed" && derivedProgress.total > 0 && derivedProgress.completed !== derivedProgress.total) {
      return `Cannot mark this release Completed — ${derivedProgress.total - derivedProgress.completed} of ${derivedProgress.total} activities are still open.`;
    }
    return "";
  };

  const save = () => {
    const err = validate();
    if (err) { setError(err); return; }
    const updated = { ...form, updatedDate: todayISO() };
    update(p => {
      const exists = p.initiatives.some(i => i.id === updated.id);
      return { ...p, initiatives: exists ? p.initiatives.map(i => i.id === updated.id ? updated : i) : [...p.initiatives, updated] };
    });
    log({ action: isNew ? "Added" : "Edited", recordType: "Release", recordName: updated.name, previousValue: "", newValue: isNew ? "Created" : "Updated" });
    push(isNew ? "Release added" : "Release saved");
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "Add Release" : `${form.id} · ${form.name || "Release"}`} width={680}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon={Save} onClick={save}>{isNew ? "Add Release" : "Save Changes"}</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && <div style={{ background: "#fbe9e7", color: "#a3271f", padding: "8px 12px", borderRadius: 8, fontSize: 13 }}>{error}</div>}
        <Field label="Name *"><Input value={form.name} onChange={e=>set("name", e.target.value)} /></Field>
        <Field label="Description"><TextArea value={form.description} onChange={e=>set("description", e.target.value)} style={{ minHeight: 90 }} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Owner"><Input value={form.owner} onChange={e=>set("owner", e.target.value)} /></Field>
          <Field label="Support (comma-separated)"><Input value={form.support.join(", ")} onChange={e=>set("support", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} /></Field>
          <Field label="Deadline"><Input value={form.deadline} onChange={e=>set("deadline", e.target.value)} /></Field>
          <Field label="Status"><Select value={form.status} onChange={e=>set("status", e.target.value)}>{data.settings.statusValues.map(s=><option key={s}>{s}</option>)}</Select></Field>
          <Field label="Priority"><Select value={form.priority} onChange={e=>set("priority", e.target.value)}>{data.settings.priorityValues.map(s=><option key={s}>{s}</option>)}</Select></Field>
          <Field label="Confidence"><Select value={form.confidence} onChange={e=>set("confidence", e.target.value)}>{data.settings.confidenceValues.map(s=><option key={s}>{s}</option>)}</Select></Field>
          <Field label="Progress (%)" hint="Calculated from this release's activities — not entered by hand">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#0f2a52", minWidth: 52 }}>{derivedProgress.pct}%</span>
              <div style={{ flex: 1, height: 8, background: "#eef1f5", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ width: `${derivedProgress.pct}%`, height: "100%", background: "#0f2a52" }} />
              </div>
              <span style={{ fontSize: 11.5, color: "#8592a3", whiteSpace: "nowrap" }}>{derivedProgress.completed}/{derivedProgress.total} done</span>
            </div>
          </Field>
          <Field label="Serves KPI (comma-separated)"><Input value={form.servesKpi.join(", ")} onChange={e=>set("servesKpi", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} /></Field>
        </div>
        <Field label="Latest update"><TextArea value={form.latestUpdate} onChange={e=>set("latestUpdate", e.target.value)} /></Field>
        <Field label="Notes"><TextArea value={form.notes} onChange={e=>set("notes", e.target.value)} /></Field>
        <Field label="Evidence links (comma-separated URLs)"><Input value={(form.evidenceLinks||[]).join(", ")} onChange={e=>set("evidenceLinks", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} /></Field>
        {!isNew && (
          <div>
            <div style={{ fontWeight: 700, fontSize: 13, color: "#0f2a52", marginTop: 6, marginBottom: 6 }}>Activities under this release ({activities.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
              {activities.map(a => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 10px", background: "#f7f8fa", borderRadius: 6 }}>
                  <span>{a.milestone ? "◆ " : ""}{a.name}</span>
                  <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ============================================================
   DELIVERY PERFORMANCE TAB (executive view: release value + KPIs)
   ============================================================ */
/* ============================================================
   KPI AGGREGATION FROM COMPLETED MILESTONES
   A milestone carries three KPI percentages. Once its status is
   "Completed" its values join the quarter average. Milestones that are
   Planned / Not Started / In Progress / Delayed / Cancelled are ignored,
   as are completed milestones with no values entered.
   ============================================================ */
const KPI_FIELDS = [
  { key: "deliveryIndex",         metric: "Delivery Excellence Index",        short: "Delivery Excellence" },
  { key: "onTimeDelivery",        metric: "5.1 On-Time Delivery Rate",        short: "On-Time" },
  { key: "firstReviewAcceptance", metric: "5.2 First-Review Acceptance Rate", short: "First Review" },
];

function isKpiSource(a) {
  return !!a.milestone && a.status === "Completed";
}
function hasKpiValue(a, key) {
  const v = a[key];
  return v !== null && v !== undefined && v !== "" && !isNaN(Number(v));
}
/** Completed milestones contributing KPI values, optionally limited to one release. */
function kpiMilestonesFor(data, releaseId) {
  return data.activities.filter(a => isKpiSource(a) && (!releaseId || a.initiativeId === releaseId));
}
/**
 * Average of a KPI across completed milestones.
 * releaseId omitted ⇒ TOTAL across every release.
 */
function aggregateKpi(data, field, releaseId) {
  const rows = kpiMilestonesFor(data, releaseId).filter(a => hasKpiValue(a, field.key));
  if (!rows.length) return null;
  const avg = rows.reduce((s, a) => s + Number(a[field.key]), 0) / rows.length;
  const target = releaseId ? ((RELEASE_META[releaseId] || {}).kpiTargets || {})[field.key] : null;
  const thresholds = (data.settings && data.settings.performanceThresholds) || { aboveTarget: 5, slightlyBelow: 5 };
  const pct = Number(avg.toFixed(1));
  // No target ⇒ Q1 is the baseline quarter; TOTAL spans quarters so has no single target.
  let status = releaseId ? "Baseline" : "Aggregate", variance = null;
  if (target != null) {
    variance = Number((pct - target).toFixed(1));
    if (pct >= target + thresholds.aboveTarget) status = "Above Target";
    else if (pct >= target) status = "On Target";
    else if (pct >= target - thresholds.slightlyBelow) status = "Slightly Below Target";
    else status = "Significantly Below Target";
  }
  return { pct, target, variance, status, milestones: rows.length, sources: rows.map(a => a.name.replace("Milestone: ", "")) };
}

/* ---- Derived release metrics (all computed from real plan data) ---- */
function resolveChecklist(data, releaseId, items) {
  const acts = data.activities.filter(a => a.initiativeId === releaseId);
  return (items || []).map(it => {
    const hit = acts.find(a => a.name === it.link || a.name.endsWith(it.link));
    return { label: it.label, done: !!hit && hit.status === "Completed", missing: !hit };
  });
}
function currentReleaseId(data) {
  const today = todayISO();
  const active = data.initiatives.filter(i => !i.archived).sort((a, b) => a.order - b.order);
  const inWindow = active.find(i => i.plannedStart <= today && today <= i.plannedEnd);
  if (inWindow) return inWindow.id;
  const next = active.find(i => i.status !== "Completed");
  return (next || active[0] || {}).id;
}
function releaseHealth(data, releaseId) {
  const init = data.initiatives.find(i => i.id === releaseId);
  if (!init) return { label: "No Data", tone: "neutral", color: "#334155" };
  if (init.status === "Completed") return { label: "Completed", tone: "green", color: "#0f2a52" };
  const overdue = data.activities.filter(a => a.initiativeId === releaseId && isOverdue(a)).length;
  if (init.status === "Delayed" || overdue > 3) return { label: "Delayed", tone: "red", color: "#b91c1c" };
  if (init.status === "At Risk" || overdue > 0) return { label: "At Risk", tone: "amber", color: "#c2410c" };
  return { label: "On Track", tone: "green", color: "#1a7f4b" };
}
const KPI_SHORT = {
  "Delivery Excellence Index": "Delivery Excellence",
  "5.1 On-Time Delivery Rate": "On-Time",
  "5.2 First-Review Acceptance Rate": "First Review",
};

const ChecklistRow = ({ label, done, missing }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "3px 0", color: done ? "#1c2733" : "#64748b" }}>
    <span aria-hidden style={{ color: done ? "#1a7f4b" : "#c7d2e2", fontWeight: 700 }}>{done ? "✔" : "○"}</span>
    <span style={{ textDecoration: done ? "none" : "none" }}>{label}</span>
    {missing && <span title="No matching activity found in the plan" style={{ fontSize: 10.5, color: "#b8860b" }}>(unlinked)</span>}
    <span style={{ position: "absolute", left: -9999 }}>{done ? "completed" : "not completed"}</span>
  </div>
);

function DeliveryPerformanceTab({ data, update, log, push }) {
  const [scope, setScope] = useState("Total");            // Total | Q1..Q4
  const [actionDrawer, setActionDrawer] = useState(null);

  const releases = data.initiatives.filter(i => !i.archived).sort((a, b) => a.order - b.order);
  const quarters = releases.map(r => ({ q: (RELEASE_META[r.id] || {}).quarter, id: r.id })).filter(x => x.q);
  const isTotal = scope === "Total";
  const scopeRel = isTotal ? null : releases.find(r => (RELEASE_META[r.id] || {}).quarter === scope);
  const scopeRelId = scopeRel ? scopeRel.id : "";
  const coverage = data.pilotCoverageActual || {};

  const metaOf = id => RELEASE_META[id] || { quarter: "—", quarterTargets: [], successCriteria: [], businessValue: [], pilotCoveragePlanned: 0, valueHeadline: "—", valueMilestone: "" };

  /* ---- derived numbers ---- */
  const objectiveProgress = (() => {
    const acts = data.activities.filter(a => !a.milestone);
    return acts.length ? Math.round(acts.reduce((s, a) => s + clampProgress(a.progress), 0) / acts.length) : 0;
  })();
  const curRelId = currentReleaseId(data);
  const curRel = releases.find(r => r.id === curRelId);

  const valueAchieved = (rid) => {
    const m = metaOf(rid).valueMilestone;
    const hit = data.activities.find(a => a.initiativeId === rid && a.name === m);
    return !!hit && hit.status === "Completed";
  };

  // Coverage growth series (Q1 → Q4)
  const coverageSeries = quarters.map(({ q, id }) => ({
    q, id,
    planned: metaOf(id).pilotCoveragePlanned || 0,
    actual: Number(coverage[id] ?? 0),
  }));
  const maxPlanned = Math.max(1, ...coverageSeries.map(c => c.planned));
  const totalCoverage = coverageSeries.reduce((best, c) => (c.actual >= best.actual ? c : best), { actual: 0, planned: maxPlanned });

  /* ---- KPI selection honouring the filter ---- */
  /* ---- KPI source: completed milestones (no manual entry needed) ---- */
  const aggFor = (field, quarterScope) => {
    if (quarterScope === "Total") return aggregateKpi(data, field);           // all releases
    const rid = (quarters.find(q => q.q === quarterScope) || {}).id;
    return rid ? aggregateKpi(data, field, rid) : null;
  };
  // Recomputed whenever any activity changes ⇒ the page refreshes in real time.
  const kpiFigures = useMemo(
    () => KPI_FIELDS.map(f => ({ field: f, agg: aggFor(f, scope) })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.activities, data.settings, scope]
  );

  // Trend: one point per quarter (Total) or the contributing milestones (single quarter)
  const trendData = useMemo(() => {
    if (isTotal) {
      return quarters.map(({ q }) => {
        const row = { label: q };
        for (const f of KPI_FIELDS) {
          const a = aggFor(f, q);
          if (a) row[f.short] = a.pct;
        }
        return row;
      });
    }
    const rid = scopeRelId;
    const ms = kpiMilestonesFor(data, rid)
      .slice().sort((a, b) => String(a.plannedEnd).localeCompare(String(b.plannedEnd)));
    return ms.map(m => {
      const row = { label: m.name.replace("Milestone: ", "") };
      for (const f of KPI_FIELDS) if (hasKpiValue(m, f.key)) row[f.short] = Number(m[f.key]);
      return row;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.activities, data.settings, scope]);
  const hasTrend = trendData.some(r => Object.keys(r).length > 1);

  // Table: one row per quarter × KPI, built from the aggregation
  const kpiRows = useMemo(() => {
    const scopes = isTotal ? quarters.map(q => q.q) : [scope];
    const rows = [];
    for (const sc of scopes) {
      const rid = (quarters.find(q => q.q === sc) || {}).id;
      for (const f of KPI_FIELDS) {
        const a = rid ? aggregateKpi(data, f, rid) : null;
        if (!a) continue;
        rows.push({
          id: sc + "::" + f.key, quarterLabel: sc,
          relName: (data.initiatives.find(i => i.id === rid) || {}).name || "—",
          short: f.short, target: a.target, pct: a.pct, status: a.status,
          milestones: a.milestones, sources: a.sources,
          projects: Number((data.pilotCoverageActual || {})[rid] ?? 0),
        });
      }
    }
    return rows;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.activities, data.initiatives, data.settings, data.pilotCoverageActual, scope]);

  // Improvement actions shown for the selected Measurement Period
  const actions = useMemo(
    () => (data.improvementActions || [])
      .filter(a => isTotal || a.releaseId === scopeRelId)
      .slice()
      .sort((a, b) => String(a.dueDate || "9999").localeCompare(String(b.dueDate || "9999"))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.improvementActions, scope, scopeRelId]
  );

  const setCoverage = (rid, v) => {
    const planned = metaOf(rid).pilotCoveragePlanned || 0;
    const n = Math.max(0, Math.min(planned, Number(v) || 0));
    update(p => ({ ...p, pilotCoverageActual: { ...(p.pilotCoverageActual || {}), [rid]: n } }));
  };

  const panel = { background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 };
  const title = { fontWeight: 700, color: "#0f2a52", fontSize: 14, marginBottom: 10 };
  const capLabel = { fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 };
  const bigNum = { fontSize: 26, fontWeight: 800, color: "#0f2a52", lineHeight: 1.15, marginTop: 4 };

  const scopeProg = scopeRelId ? releaseProgress(data, scopeRelId) : null;
  const scopeHealth = scopeRelId ? releaseHealth(data, scopeRelId) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* ---------- FILTER ---------- */}
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }} role="group" aria-label="Measurement Period">
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4 }}>Measurement Period</span>
          {["Total", ...quarters.map(q => q.q)].map(s => {
            const on = scope === s;
            const rid = s === "Total" ? "" : (quarters.find(q => q.q === s) || {}).id;
            return (
              <button key={s} onClick={() => setScope(s)} aria-pressed={on}
                title={rid ? `${rid} — ${(releases.find(r => r.id === rid) || {}).name}` : "All quarters"}
                style={{ padding: "7px 14px", borderRadius: 8, border: "1px solid #d7dde5", cursor: "pointer", fontSize: 13, fontWeight: 700,
                  background: on ? "#0f2a52" : "#fff", color: on ? "#fff" : "#334155" }}>
                {s}
              </button>
            );
          })}
        </div>
        <Badge tone="navy">
          {kpiMilestonesFor(data, isTotal ? undefined : scopeRelId).length} completed milestone(s) measured
        </Badge>
      </div>
      <div style={{ fontSize: 12.5, color: "#64748b", marginTop: -8 }}>
        {isTotal
          ? "Executive view — the full Objective 5 journey across all four releases."
          : `${scope} · ${scopeRelId} — ${scopeRel ? scopeRel.name : ""}`}
      </div>

      {/* ---------- OVERVIEW CARDS ---------- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(230px,1fr))", gap: 14 }}>
        {isTotal ? (
          <>
            <div style={{ ...panel, background: "linear-gradient(135deg,#0f2a52,#173a6b)", border: "none", color: "#fff" }}>
              <div style={{ ...capLabel, color: "#a9bcdd" }}>Overall Progress</div>
              <div style={{ fontSize: 13, color: "#c4d0e5", marginTop: 4 }}>Objective 5</div>
              <div style={{ fontSize: 30, fontWeight: 800, lineHeight: 1.1 }}>{objectiveProgress}%</div>
              <div style={{ height: 8, background: "rgba(255,255,255,0.18)", borderRadius: 999, overflow: "hidden", marginTop: 10 }}>
                <div style={{ width: `${objectiveProgress}%`, height: "100%", background: "#7ea3e0" }} />
              </div>
            </div>
            <div style={panel}>
              <div style={capLabel}>Projects Covered</div>
              <div style={bigNum}>{totalCoverage.actual} / {maxPlanned}</div>
              <div style={{ fontSize: 12, color: "#8592a3", marginTop: 4 }}>Peak adoption reached so far</div>
            </div>
            <div style={panel}>
              <div style={capLabel}>Current Phase</div>
              <div style={{ fontSize: 17, fontWeight: 800, color: "#0f2a52", marginTop: 6 }}>{curRel ? curRel.name : "—"}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                <Badge tone="navy">{metaOf(curRelId).quarter}</Badge>
                {curRelId && <Badge tone={releaseHealth(data, curRelId).tone}>{releaseHealth(data, curRelId).label}</Badge>}
              </div>
            </div>
            <div style={panel}>
              <div style={capLabel}>Business Value Delivered</div>
              <div style={{ marginTop: 6 }}>
                {releases.map(r => (
                  <ChecklistRow key={r.id} label={`${metaOf(r.id).quarter} · ${metaOf(r.id).valueHeadline}`} done={valueAchieved(r.id)} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={panel}>
              <div style={capLabel}>Projects Covered</div>
              <div style={bigNum}>{Number(coverage[scopeRelId] ?? 0)} / {metaOf(scopeRelId).pilotCoveragePlanned}</div>
              <div style={{ height: 7, background: "#eef1f5", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${metaOf(scopeRelId).pilotCoveragePlanned ? Math.round((Number(coverage[scopeRelId] ?? 0) / metaOf(scopeRelId).pilotCoveragePlanned) * 100) : 0}%`, height: "100%", background: "#0f2a52" }} />
              </div>
              {!READ_ONLY && (
                <div style={{ marginTop: 10 }}>
                  <Input type="number" min={0} max={metaOf(scopeRelId).pilotCoveragePlanned}
                    value={Number(coverage[scopeRelId] ?? 0)} onChange={e => setCoverage(scopeRelId, e.target.value)}
                    aria-label="Projects onboarded" style={{ width: 110 }} />
                </div>
              )}
            </div>
            <div style={{ ...panel, background: "linear-gradient(135deg,#0f2a52,#173a6b)", border: "none", color: "#fff" }}>
              <div style={{ ...capLabel, color: "#a9bcdd" }}>Current Release</div>
              <div style={{ fontSize: 17, fontWeight: 800, marginTop: 6 }}>{scopeRel ? scopeRel.name : "—"}</div>
              <div style={{ fontSize: 12, color: "#c4d0e5", marginTop: 4 }}>{scopeRel ? `${scopeRel.plannedStart} → ${scopeRel.plannedEnd}` : ""}</div>
              {scopeHealth && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.16)", padding: "3px 10px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, marginTop: 10 }}>
                  <Circle size={9} fill={scopeHealth.color} color={scopeHealth.color} /> {scopeHealth.label}
                </span>
              )}
            </div>
            <div style={panel}>
              <div style={capLabel}>Release Progress</div>
              <div style={bigNum}>{scopeProg ? scopeProg.pct : 0}%</div>
              <div style={{ fontSize: 12, color: "#8592a3", marginTop: 4 }}>
                {scopeProg ? `${scopeProg.completed} / ${scopeProg.total} activities completed` : "—"}
              </div>
              <div style={{ height: 7, background: "#eef1f5", borderRadius: 999, overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${scopeProg ? scopeProg.pct : 0}%`, height: "100%", background: "#1a7f4b" }} />
              </div>
            </div>
            <div style={panel}>
              <div style={capLabel}>Business Value</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: valueAchieved(scopeRelId) ? "#1a7f4b" : "#0f2a52", marginTop: 6 }}>
                {metaOf(scopeRelId).valueHeadline}
              </div>
              <div style={{ marginTop: 6 }}>
                <Badge tone={valueAchieved(scopeRelId) ? "green" : "neutral"}>
                  {valueAchieved(scopeRelId) ? "Achieved" : "Not yet achieved"}
                </Badge>
              </div>
              <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid #f0f2f5" }}>
                {resolveChecklist(data, scopeRelId, metaOf(scopeRelId).businessValue).slice(0, 5).map(v => (
                  <ChecklistRow key={v.label} {...v} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ---------- KPI CARDS (with sample size) ---------- */}
      <div>
        <div style={title}>KPIs {isTotal ? "· Total (all completed milestones)" : `· ${scope}`}</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {kpiFigures.map(({ field, agg }) => {
            const tone = agg ? { "Above Target":"green","On Target":"green","Slightly Below Target":"amber","Significantly Below Target":"red","Baseline":"navy","Aggregate":"neutral" }[agg.status] : "neutral";
            const projects = isTotal
              ? Math.max(0, ...Object.values(data.pilotCoverageActual || {}).map(Number))
              : Number((data.pilotCoverageActual || {})[scopeRelId] ?? 0);
            return (
              <div key={field.key} style={panel}>
                <div style={capLabel}>{field.short}</div>
                <div style={bigNum}>{agg ? `${agg.pct}%` : "No data"}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                  {agg && <Badge tone={tone}>{agg.status}</Badge>}
                  {agg && agg.target != null && <Badge>Target {agg.target}%</Badge>}
                  {agg && agg.variance != null && <Badge tone={agg.variance >= 0 ? "green" : "red"}>{agg.variance > 0 ? "+" : ""}{agg.variance} pts</Badge>}
                  {!agg && <Badge>Not yet measured</Badge>}
                </div>
                {/* Sample size — so percentages are never read out of context */}
                <div style={{ fontSize: 11.5, color: "#8592a3", marginTop: 8, lineHeight: 1.5 }}>
                  {agg
                    ? `Average of ${agg.milestones} completed milestone${agg.milestones === 1 ? "" : "s"} · ${projects} project${projects === 1 ? "" : "s"}`
                    : "Complete a milestone and enter its KPI values"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- TREND ---------- */}
      <div style={panel}>
        <div style={title}>{isTotal ? "Quarterly Trend" : `Milestone measurements within ${scope}`}</div>
        {!hasTrend ? (
          <EmptyState message={isTotal
            ? "No completed milestones carry KPI values yet. Mark a milestone Completed and fill its three KPI percentages to build the Q1 → Q4 trend."
            : `No completed milestones with KPI values in ${scope} yet.`} />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
              <XAxis dataKey="label" fontSize={12} />
              <YAxis domain={[0, 100]} fontSize={12} unit="%" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Delivery Excellence" stroke="#0f2a52" strokeWidth={2} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="On-Time" stroke="#1a7f4b" strokeWidth={2} dot={{ r: 4 }} connectNulls />
              <Line type="monotone" dataKey="First Review" stroke="#c2410c" strokeWidth={2} dot={{ r: 4 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ---------- COVERAGE GROWTH + BUSINESS VALUE TIMELINE ---------- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 16 }}>
        <div style={panel}>
          <div style={title}>Coverage Growth</div>
          <div style={{ fontSize: 12, color: "#8592a3", marginBottom: 10 }}>Projects using the framework, quarter by quarter</div>
          {coverageSeries.map(c => {
            const pct = Math.round((c.planned / maxPlanned) * 100);
            const donePct = c.planned ? Math.round((c.actual / c.planned) * 100) : 0;
            const on = !isTotal && c.q === scope;
            return (
              <div key={c.q} style={{ marginBottom: 10, padding: on ? "6px 8px" : 0, background: on ? "#f4f6f9" : "transparent", borderRadius: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: "#0f2a52" }}>{c.q}</span>
                  <span style={{ color: "#64748b" }}><strong style={{ color: "#1c2733" }}>{c.actual}</strong> / {c.planned} projects</span>
                </div>
                <div style={{ height: 12, background: "#eef1f5", borderRadius: 4, overflow: "hidden", width: `${Math.max(12, pct)}%`, position: "relative" }}
                  title={`${c.q}: target ${c.planned} projects, onboarded ${c.actual}`}>
                  <div style={{ width: `${donePct}%`, height: "100%", background: "#0f2a52" }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={panel}>
          <div style={title}>Business Value Timeline</div>
          <div style={{ fontSize: 12, color: "#8592a3", marginBottom: 10 }}>Value released at the end of each quarter</div>
          {coverageSeries.map((c, i) => {
            const done = valueAchieved(c.id);
            const on = !isTotal && c.q === scope;
            return (
              <div key={c.q}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: on ? "6px 8px" : "2px 0", background: on ? "#f4f6f9" : "transparent", borderRadius: 8 }}>
                  <span aria-hidden style={{
                    width: 22, height: 22, borderRadius: 999, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "#1a7f4b" : "#eef1f5", color: done ? "#fff" : "#94a3b8", fontSize: 12, fontWeight: 700,
                  }}>{done ? "✔" : i + 1}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>{c.q}</div>
                    <div style={{ fontSize: 13.5, fontWeight: done ? 700 : 500, color: done ? "#1a7f4b" : "#334155" }}>
                      {metaOf(c.id).valueHeadline}
                    </div>
                    <span style={{ position: "absolute", left: -9999 }}>{done ? "delivered" : "not delivered"}</span>
                  </div>
                </div>
                {i < coverageSeries.length - 1 && (
                  <div aria-hidden style={{ width: 2, height: 14, background: "#e2e7ee", marginLeft: 10 }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- DELIVERABLES MEASURED / KPI RESULTS ---------- */}
      <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, overflowX: "auto" }}>
        <div style={{ padding: "14px 18px 0", fontWeight: 700, color: "#0f2a52", fontSize: 14 }}>
          Deliverables Measured &amp; KPI Results {isTotal ? "" : `· ${scope}`}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}>
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {["Quarter","Release","KPI","Target","Actual","Sample Size","Status"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #e2e7ee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {kpiRows.map(r => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0f2a52" }}>{r.quarterLabel}</td>
                <td style={{ padding: "9px 12px" }}>{r.relName}</td>
                <td style={{ padding: "9px 12px" }}>{r.short}</td>
                <td style={{ padding: "9px 12px" }}>{r.target != null ? `${r.target}%` : "—"}</td>
                <td style={{ padding: "9px 12px", fontWeight: 700 }}>{r.pct}%</td>
                <td style={{ padding: "9px 12px", color: "#64748b" }} title={r.sources.join(", ")}>
                  {r.milestones} milestone{r.milestones === 1 ? "" : "s"} · {r.projects} project{r.projects === 1 ? "" : "s"}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <Badge tone={{ "Above Target":"green","On Target":"green","Slightly Below Target":"amber","Significantly Below Target":"red","Baseline":"navy","Aggregate":"neutral" }[r.status]}>
                    {r.status}
                  </Badge>
                </td>
              </tr>
            ))}
            {kpiRows.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}>
                No completed milestones with KPI values{isTotal ? "" : ` in ${scope}`} yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ---------- IMPROVEMENT ACTIONS ---------- */}
      <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, overflowX: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 0", flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontWeight: 700, color: "#0f2a52", fontSize: 14 }}>Improvement Actions {isTotal ? "" : `· ${scope}`}</div>
          <Button variant="secondary" icon={Plus}
            onClick={() => setActionDrawer({ isNew: true, form: { id: uid("IMP"), releaseId: scopeRelId || releases[0]?.id || "", action: "", owner: data.settings.objectiveOwner, status: "Open", dueDate: "", notes: "" } })}>
            Add action
          </Button>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, marginTop: 10 }}>
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {["Quarter","Action","Owner","Due","Status",""].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #e2e7ee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {actions.map(a => {
              const overdueAct = a.dueDate && a.dueDate < todayISO() && a.status !== "Completed";
              return (
                <tr key={a.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <td style={{ padding: "9px 12px", fontWeight: 700, color: "#0f2a52" }}>{metaOf(a.releaseId).quarter}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <button onClick={() => setActionDrawer({ isNew: false, form: { ...a } })}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#0f2a52", fontWeight: 600, textAlign: "left" }}>
                      {a.action || "(untitled)"}
                    </button>
                  </td>
                  <td style={{ padding: "9px 12px" }}>{a.owner || "—"}</td>
                  <td style={{ padding: "9px 12px", color: overdueAct ? "#a3271f" : "#334155" }}>
                    {a.dueDate ? fmtDate(a.dueDate) : "—"}{overdueAct ? " (overdue)" : ""}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <Badge tone={{ "Open":"amber","In Progress":"navy","Blocked":"red","Completed":"green" }[a.status]}>{a.status}</Badge>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <IconBtn icon={Trash2} label="Delete action" tone="danger"
                      onClick={() => { update(p => ({ ...p, improvementActions: (p.improvementActions || []).filter(x => x.id !== a.id) })); push("Action deleted"); }} />
                  </td>
                </tr>
              );
            })}
            {actions.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}>
                No improvement actions{isTotal ? "" : ` for ${scope}`} yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {actionDrawer && (
        <ImprovementActionDrawer data={data} update={update} log={log} push={push}
          state={actionDrawer} onClose={() => setActionDrawer(null)} />
      )}
    </div>
  );
}

function ImprovementActionDrawer({ data, update, log, push, state, onClose }) {
  const [form, setForm] = useState(state.form);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.action.trim()) { push("Action description is required", "error"); return; }
    update(p => {
      const list = p.improvementActions || [];
      const exists = list.some(x => x.id === form.id);
      return { ...p, improvementActions: exists ? list.map(x => x.id === form.id ? form : x) : [...list, form] };
    });
    log({ action: state.isNew ? "Added" : "Edited", recordType: "Improvement Action", recordName: form.action, previousValue: "", newValue: form.status });
    push("Improvement action saved");
    onClose();
  };
  return (
    <Modal open onClose={onClose} width={560} title={state.isNew ? "Add Improvement Action" : "Improvement Action"}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon={Save} onClick={save}>Save</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Action *"><TextArea value={form.action} onChange={e => set("action", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Release / Quarter">
            <Select value={form.releaseId} onChange={e => set("releaseId", e.target.value)}>
              {data.initiatives.filter(i => !i.archived).map(i => (
                <option key={i.id} value={i.id}>{(RELEASE_META[i.id] || {}).quarter} · {i.name}</option>
              ))}
            </Select>
          </Field>
          <Field label="Owner"><Input value={form.owner} onChange={e => set("owner", e.target.value)} /></Field>
          <Field label="Due date"><Input type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} /></Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => set("status", e.target.value)}>
              {["Open","In Progress","Blocked","Completed"].map(s => <option key={s}>{s}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Notes"><TextArea value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

/* Manual KPI entry (KPIEntryModal) was removed: quarterly KPI figures now come
   from completed milestones via aggregateKpi(). data.kpiResults is retained in the
   data model for backward compatibility with older saved backups. */

function ReleaseReviewsTab({ data, update, log, push, drawer, setDrawer }) {
  const reviews = (data.releaseReviews || []).slice()
    .sort((a, b) => String(a.quarter).localeCompare(String(b.quarter)));
  const approvalTone = { "Approved": "green", "Pending": "amber", "Rejected": "red", "In Review": "navy" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14, alignItems: "center" }}>
        <div style={{ fontSize: 13, color: "#64748b" }}>
          One review per release — captures the value delivered, lessons learned and the actions carried forward.
        </div>
        <Badge tone={reviews.every(r => r.approval === "Approved") && reviews.length ? "green" : "neutral"}>
          {reviews.filter(r => r.approval === "Approved").length} / {reviews.length} approved
        </Badge>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reviews.map(rv => {
          const rel = data.initiatives.find(i => i.id === rv.releaseId);
          const prog = releaseProgress(data, rv.releaseId);
          const vItems = resolveChecklist(data, rv.releaseId, (RELEASE_META[rv.releaseId] || {}).businessValue);
          const vDone = vItems.filter(x => x.done).length;
          return (
            <div key={rv.id} style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: 11.5, color: "#8592a3", fontWeight: 700 }}>{rv.quarter} · {rv.releaseId}</div>
                  <button onClick={() => setDrawer({ type: "review", id: rv.id })}
                    style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontSize: 14.5, fontWeight: 700, color: "#0f2a52", textAlign: "left" }}>
                    {rel ? rel.name : rv.releaseId}
                  </button>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge>{prog.completed} / {prog.total} activities</Badge>
                  <Badge tone={vDone === vItems.length && vItems.length ? "green" : "neutral"}>{vDone} / {vItems.length} value items</Badge>
                  <Badge tone={approvalTone[rv.approval] || "neutral"}>{rv.approval}</Badge>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12, marginTop: 12 }}>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Business Value</div>
                  <div style={{ fontSize: 12.5, color: rv.businessValue ? "#1c2733" : "#94a3b8" }}>{rv.businessValue || "Not recorded yet"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Lessons Learned</div>
                  <div style={{ fontSize: 12.5, color: rv.lessonsLearned ? "#1c2733" : "#94a3b8" }}>{rv.lessonsLearned || "Not recorded yet"}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>Actions</div>
                  <div style={{ fontSize: 12.5, color: rv.actions ? "#1c2733" : "#94a3b8" }}>{rv.actions || "Not recorded yet"}</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", fontSize: 11.5, color: "#8592a3", marginTop: 10, paddingTop: 8, borderTop: "1px solid #f0f2f5" }}>
                <span>Owner: <strong style={{ color: "#334155" }}>{rv.owner || "—"}</strong></span>
                <span>Review date: <strong style={{ color: "#334155" }}>{rv.reviewDate ? fmtDate(rv.reviewDate) : "TBD"}</strong></span>
              </div>
            </div>
          );
        })}
        {reviews.length === 0 && <EmptyState message="No release reviews yet." />}
      </div>

      {drawer && drawer.type === "review" && (
        <ReleaseReviewDrawer data={data} update={update} log={log} push={push}
          reviewId={drawer.id} onClose={() => setDrawer(null)} />
      )}
    </div>
  );
}

function ReleaseReviewDrawer({ data, update, log, push, reviewId, onClose }) {
  const existing = (data.releaseReviews || []).find(r => r.id === reviewId);
  const [form, setForm] = useState(existing || null);
  if (!form) return null;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const rel = data.initiatives.find(i => i.id === form.releaseId);

  const save = () => {
    update(p => ({ ...p, releaseReviews: (p.releaseReviews || []).map(r => r.id === form.id ? form : r) }));
    log({ action: "Edited", recordType: "Release Review", recordName: `${form.quarter} · ${form.releaseId}`, previousValue: "", newValue: `Approval: ${form.approval}` });
    push("Release review saved");
    onClose();
  };

  return (
    <Modal open onClose={onClose} width={620}
      title={`${form.quarter} · ${rel ? rel.name : form.releaseId} — Review`}
      footer={<>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
        <Button variant="primary" icon={Save} onClick={save}>Save Review</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Business Value delivered" hint="What measurable value did this release put in the hands of the business?">
          <TextArea value={form.businessValue} onChange={e => set("businessValue", e.target.value)} />
        </Field>
        <Field label="Lessons Learned">
          <TextArea value={form.lessonsLearned} onChange={e => set("lessonsLearned", e.target.value)} />
        </Field>
        <Field label="Actions carried forward">
          <TextArea value={form.actions} onChange={e => set("actions", e.target.value)} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Owner"><Input value={form.owner} onChange={e => set("owner", e.target.value)} /></Field>
          <Field label="Review date"><Input type="date" value={form.reviewDate} onChange={e => set("reviewDate", e.target.value)} /></Field>
          <Field label="Approval">
            <Select value={form.approval} onChange={e => set("approval", e.target.value)}>
              {["Pending", "In Review", "Approved", "Rejected"].map(x => <option key={x}>{x}</option>)}
            </Select>
          </Field>
        </div>
        <Field label="Notes"><TextArea value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function EmptyState({ message }) {
  return <div style={{ padding: "30px 16px", textAlign: "center", color: "#94a3b8", fontSize: 13.5, border: "1px dashed #d7dde5", borderRadius: 10 }}>{message}</div>;
}

/* ============================================================
   ALIGNMENTS TAB
   ============================================================ */
function AlignmentsTab({ data, update, log, drawer, setDrawer, push }) {
  const overdueCount = data.alignments.filter(a => a.dueDate && new Date(a.dueDate) < new Date(todayISO()) && a.completionStatus !== "Completed").length;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <Badge tone={overdueCount ? "red" : "green"}>{overdueCount} overdue alignment action(s)</Badge>
        <Button variant="primary" icon={Plus} onClick={()=>setDrawer({ type: "alignment-new" })}>Add alignment meeting</Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.alignments.map(a => (
          <div key={a.id} style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <button onClick={()=>setDrawer({ type: "alignment", id: a.id })} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 700, fontSize: 14.5, color: "#0f2a52", textAlign: "left" }}>{a.counterpart}</button>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge tone={{"Not Scheduled":"neutral","Scheduled":"navy","Completed":"green","Rescheduled":"amber","Cancelled":"red"}[a.meetingStatus]}>{a.meetingStatus}</Badge>
                <Badge tone={{"Open":"amber","In Progress":"navy","Blocked":"red","Completed":"green","Overdue":"red"}[a.completionStatus]}>{a.completionStatus}</Badge>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 6 }}>{a.topic}</div>
            {a.agreedActions && <div style={{ fontSize: 12.5, marginTop: 6 }}><strong>Agreed actions:</strong> {a.agreedActions}</div>}
            <div style={{ fontSize: 11.5, color: "#8592a3", marginTop: 6 }}>Meeting: {a.meetingDate ? fmtDate(a.meetingDate) : "TBD"} · Due: {a.dueDate ? fmtDate(a.dueDate) : "TBD"} · Owner: {a.owner}</div>
          </div>
        ))}
      </div>

      {drawer && (drawer.type === "alignment" || drawer.type === "alignment-new") && (
        <AlignmentDrawer data={data} update={update} log={log} alignmentId={drawer.id} isNew={drawer.type==="alignment-new"} onClose={()=>setDrawer(null)} push={push} />
      )}
    </div>
  );
}

function AlignmentDrawer({ data, update, log, alignmentId, isNew, onClose, push }) {
  const existing = !isNew ? data.alignments.find(a => a.id === alignmentId) : null;
  const [form, setForm] = useState(existing || {
    id: uid("ALN"), counterpart: "", topic: "", requiredDecision: "", meetingDate: "", meetingStatus: "Not Scheduled",
    owner: data.settings.objectiveOwner, attendees: [], notes: "", agreedActions: "", actionOwner: "", dueDate: "",
    decision: "", evidence: "", followUpDate: "", completionStatus: "Open",
  });
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.counterpart.trim()) return;
    update(p => {
      const exists = p.alignments.some(a => a.id === form.id);
      return { ...p, alignments: exists ? p.alignments.map(a => a.id === form.id ? form : a) : [...p.alignments, form] };
    });
    log({ action: isNew ? "Added" : "Edited", recordType: "Alignment", recordName: form.counterpart, previousValue: "", newValue: isNew ? "Created" : "Updated" });
    push("Alignment saved");
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "Add Alignment" : form.counterpart} width={600}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" icon={Save} onClick={save}>Save</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Counterpart *"><Input value={form.counterpart} onChange={e=>set("counterpart", e.target.value)} /></Field>
        <Field label="Topic"><TextArea value={form.topic} onChange={e=>set("topic", e.target.value)} /></Field>
        <Field label="Required decision"><Input value={form.requiredDecision} onChange={e=>set("requiredDecision", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Meeting date"><Input type="date" value={form.meetingDate} onChange={e=>set("meetingDate", e.target.value)} /></Field>
          <Field label="Meeting status"><Select value={form.meetingStatus} onChange={e=>set("meetingStatus", e.target.value)}>{MEETING_STATUSES.map(s=><option key={s}>{s}</option>)}</Select></Field>
          <Field label="Owner"><Input value={form.owner} onChange={e=>set("owner", e.target.value)} /></Field>
          <Field label="Action owner"><Input value={form.actionOwner} onChange={e=>set("actionOwner", e.target.value)} /></Field>
          <Field label="Due date"><Input type="date" value={form.dueDate} onChange={e=>set("dueDate", e.target.value)} /></Field>
          <Field label="Follow-up date"><Input type="date" value={form.followUpDate} onChange={e=>set("followUpDate", e.target.value)} /></Field>
          <Field label="Completion status"><Select value={form.completionStatus} onChange={e=>set("completionStatus", e.target.value)}>{ACTION_STATUSES.map(s=><option key={s}>{s}</option>)}</Select></Field>
        </div>
        <Field label="Attendees (comma-separated)"><Input value={form.attendees.join(", ")} onChange={e=>set("attendees", e.target.value.split(",").map(s=>s.trim()).filter(Boolean))} /></Field>
        <Field label="Agreed actions"><TextArea value={form.agreedActions} onChange={e=>set("agreedActions", e.target.value)} /></Field>
        <Field label="Decision"><TextArea value={form.decision} onChange={e=>set("decision", e.target.value)} /></Field>
        <Field label="Notes"><TextArea value={form.notes} onChange={e=>set("notes", e.target.value)} /></Field>
        <Field label="Evidence"><Input value={form.evidence} onChange={e=>set("evidence", e.target.value)} placeholder="https://…" /></Field>
      </div>
    </Modal>
  );
}

/* ============================================================
   RISKS & DEPENDENCIES TAB (RAID)
   ============================================================ */
function RisksTab({ data, update, log, drawer, setDrawer, push, confirmState, setConfirmState }) {
  const [typeFilter, setTypeFilter] = useState("");
  const thresholds = data.settings.riskThresholds;

  const list = data.risks.filter(r => !typeFilter || r.type === typeFilter)
    .slice().sort((a,b) => riskScore(b) - riskScore(a));

  const remove = (r) => {
    setConfirmState({
      title: "Delete RAID record?", message: `Permanently remove "${r.title}"?`,
      onConfirm: () => {
        update(p => ({ ...p, risks: p.risks.filter(x => x.id !== r.id) }));
        log({ action: "Deleted", recordType: "Risk/Dependency", recordName: r.title, previousValue: "Existed", newValue: "Removed" });
        push("Record deleted");
      },
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
        <Select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} style={{ width: 200 }}>
          <option value="">All types</option>
          {RAID_TYPES.map(t=><option key={t}>{t}</option>)}
        </Select>
        <Button variant="primary" icon={Plus} onClick={()=>setDrawer({ type: "risk-new" })}>Add risk / dependency</Button>
      </div>

      <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {["Type","Title","Probability","Impact","Score","Level","Status","Owner",""].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #e2e7ee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(r => {
              const score = riskScore(r);
              const level = riskLevel(score, thresholds);
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <td style={{ padding: "9px 12px" }}><Badge>{r.type}</Badge></td>
                  <td style={{ padding: "9px 12px" }}><button onClick={()=>setDrawer({ type: "risk", id: r.id })} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", fontWeight: 600, color: "#0f2a52", textAlign: "left" }}>{r.title}</button></td>
                  <td style={{ padding: "9px 12px" }}>{r.probability}</td>
                  <td style={{ padding: "9px 12px" }}>{r.impact}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700 }}>{score}</td>
                  <td style={{ padding: "9px 12px" }}><Badge tone={{"Low":"green","Medium":"navy","High":"amber","Critical":"red"}[level]}>{level}</Badge></td>
                  <td style={{ padding: "9px 12px" }}><Badge tone={r.status==="Completed"?"green":"neutral"}>{r.status}</Badge></td>
                  <td style={{ padding: "9px 12px" }}>{r.owner}</td>
                  <td style={{ padding: "9px 12px" }}><IconBtn icon={Trash2} label="Delete" tone="danger" onClick={()=>remove(r)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {drawer && (drawer.type === "risk" || drawer.type === "risk-new") && (
        <RiskDrawer data={data} update={update} log={log} riskId={drawer.id} isNew={drawer.type==="risk-new"} onClose={()=>setDrawer(null)} push={push} />
      )}
    </div>
  );
}

function RiskDrawer({ data, update, log, riskId, isNew, onClose, push }) {
  const existing = !isNew ? data.risks.find(r => r.id === riskId) : null;
  const [form, setForm] = useState(existing || {
    id: uid("RAID"), type: "Risk", title: "", description: "", relatedInitiative: "", relatedActivity: "",
    owner: data.settings.objectiveOwner, raisedDate: todayISO(), dueDate: "", probability: "Medium", impact: "Medium",
    status: "Open", mitigation: "", contingency: "", dependencyOwner: "", escalationRequired: false,
    decisionRequired: "", resolution: "", closedDate: "", notes: "",
  });
  const set = (k,v) => setForm(f => ({ ...f, [k]: v }));
  const score = riskScore(form);
  const level = riskLevel(score, data.settings.riskThresholds);

  const save = () => {
    if (!form.title.trim()) return;
    update(p => {
      const exists = p.risks.some(r => r.id === form.id);
      return { ...p, risks: exists ? p.risks.map(r => r.id === form.id ? form : r) : [...p.risks, form] };
    });
    log({ action: isNew ? "Added" : "Edited", recordType: "Risk/Dependency", recordName: form.title, previousValue: "", newValue: isNew ? "Created" : "Updated" });
    push("Saved");
    onClose();
  };

  return (
    <Modal open onClose={onClose} title={isNew ? "Add Risk / Dependency" : form.title} width={620}
      footer={<><Button variant="secondary" onClick={onClose}>Cancel</Button><Button variant="primary" icon={Save} onClick={save}>Save</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Type"><Select value={form.type} onChange={e=>set("type", e.target.value)}>{RAID_TYPES.map(t=><option key={t}>{t}</option>)}</Select></Field>
          <Field label="Title *"><Input value={form.title} onChange={e=>set("title", e.target.value)} /></Field>
        </div>
        <Field label="Description"><TextArea value={form.description} onChange={e=>set("description", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <Field label="Related release">
            <Select value={form.relatedInitiative} onChange={e=>set("relatedInitiative", e.target.value)}>
              <option value="">None</option>{data.initiatives.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
            </Select>
          </Field>
          <Field label="Owner"><Input value={form.owner} onChange={e=>set("owner", e.target.value)} /></Field>
          <Field label="Probability"><Select value={form.probability} onChange={e=>set("probability", e.target.value)}>{PROB_IMPACT.map(p=><option key={p}>{p}</option>)}</Select></Field>
          <Field label="Impact"><Select value={form.impact} onChange={e=>set("impact", e.target.value)}>{PROB_IMPACT.map(p=><option key={p}>{p}</option>)}</Select></Field>
          <Field label="Due date"><Input type="date" value={form.dueDate} onChange={e=>set("dueDate", e.target.value)} /></Field>
          <Field label="Status"><Select value={form.status} onChange={e=>set("status", e.target.value)}>{["Open","In Progress","Mitigated","Closed","Completed"].map(s=><option key={s}>{s}</option>)}</Select></Field>
        </div>
        <div style={{ background: "#f7f8fa", padding: "10px 12px", borderRadius: 8, fontSize: 13 }}>
          Risk score: <strong>{score}</strong> → <Badge tone={{"Low":"green","Medium":"navy","High":"amber","Critical":"red"}[level]}>{level}</Badge>
        </div>
        <Field label="Mitigation"><TextArea value={form.mitigation} onChange={e=>set("mitigation", e.target.value)} /></Field>
        <Field label="Contingency"><TextArea value={form.contingency} onChange={e=>set("contingency", e.target.value)} /></Field>
        <Field label="Notes"><TextArea value={form.notes} onChange={e=>set("notes", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

/* ============================================================
   ACTIVITY LOG TAB
   ============================================================ */
function ActivityLogTab({ data }) {
  const [recordType, setRecordType] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const list = data.activityLog.filter(l => (!recordType || l.recordType === recordType) && (!actionFilter || l.action === actionFilter));
  const recordTypes = [...new Set(data.activityLog.map(l=>l.recordType))];
  const actions = [...new Set(data.activityLog.map(l=>l.action))];

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <Select value={recordType} onChange={e=>setRecordType(e.target.value)} style={{ width: 200 }}>
          <option value="">All record types</option>{recordTypes.map(t=><option key={t}>{t}</option>)}
        </Select>
        <Select value={actionFilter} onChange={e=>setActionFilter(e.target.value)} style={{ width: 160 }}>
          <option value="">All actions</option>{actions.map(a=><option key={a}>{a}</option>)}
        </Select>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {["Date/Time","User","Action","Record Type","Record Name","Change"].map(h => (
                <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid #e2e7ee" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>{fmtDateTime(l.date)}</td>
                <td style={{ padding: "9px 12px" }}>{l.user}</td>
                <td style={{ padding: "9px 12px" }}><Badge>{l.action}</Badge></td>
                <td style={{ padding: "9px 12px" }}>{l.recordType}</td>
                <td style={{ padding: "9px 12px" }}>{l.recordName}</td>
                <td style={{ padding: "9px 12px", color: "#64748b" }}>{l.previousValue ? `${l.previousValue} → ` : ""}{l.newValue}</td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={6} style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}>No log entries match this filter.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS & DATA TAB
   ============================================================ */
function SettingsTab({ data, update, push, exportJSON, fileInputRef, importState, setImportState, log }) {
  const s = data.settings;
  const setS = (k,v) => update(p => ({ ...p, settings: { ...p.settings, [k]: v } }));

  const exportCSV = (rows, filename, columns) => {
    const header = columns.join(",");
    const body = rows.map(r => columns.map(c => `"${String(r[c] ?? "").replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    push(`Exported ${filename}`);
  };

  const onFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (!parsed.initiatives || !Array.isArray(parsed.initiatives)) throw new Error("Invalid file structure");
        setImportState({ parsed, fileName: file.name });
      } catch (err) {
        push("Invalid JSON file — could not import.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const doImport = (mode) => {
    if (!importState) return;
    const { parsed } = importState;
    update(p => {
      const backup = { ...p };
      if (mode === "replace") {
        return { ...parsed, lastSaved: p.lastSaved };
      }
      // merge by id
      const mergeArr = (a, b) => {
        const map = new Map(a.map(x => [x.id, x]));
        b.forEach(x => map.set(x.id, x));
        return [...map.values()];
      };
      return {
        ...p,
        initiatives: mergeArr(p.initiatives, parsed.initiatives||[]),
        activities: mergeArr(p.activities, parsed.activities||[]),
        kpiResults: mergeArr(p.kpiResults, parsed.kpiResults||[]),
        alignments: mergeArr(p.alignments, parsed.alignments||[]),
        risks: mergeArr(p.risks, parsed.risks||[]),
        improvementActions: mergeArr(p.improvementActions||[], parsed.improvementActions||[]),
        releaseReviews: mergeArr(p.releaseReviews||[], parsed.releaseReviews||[]),
        deliverables: mergeArr(p.deliverables, parsed.deliverables||[]),
      };
    });
    log({ action: "Imported data", recordType: "Application", recordName: importState.fileName, previousValue: "", newValue: mode === "replace" ? "Replaced all data" : "Merged records" });
    push(`Import complete (${mode})`);
    setImportState(null);
  };

  const resetData = () => {
    update(() => defaultData());
    push("Application reset to initial sample data");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <section style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 }}>
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>General</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label="Objective owner"><Input value={s.objectiveOwner} onChange={e=>setS("objectiveOwner", e.target.value)} /></Field>
          <Field label="User display name"><Input value={s.userDisplayName} onChange={e=>setS("userDisplayName", e.target.value)} /></Field>
          <Field label="Default timeline view">
            <Select value={s.defaultTimelineView} onChange={e=>setS("defaultTimelineView", e.target.value)}>{["Quarterly","Monthly","Weekly","List"].map(v=><option key={v}>{v}</option>)}</Select>
          </Field>
          <Field label="Week start day"><Select value={s.weekStartDay} onChange={e=>setS("weekStartDay", e.target.value)}><option>Sunday</option><option>Monday</option></Select></Field>
          <Field label="Working days"><Input value={s.workingDays} onChange={e=>setS("workingDays", e.target.value)} /></Field>
          <Field label="Date format"><Input value={s.dateFormat} onChange={e=>setS("dateFormat", e.target.value)} /></Field>
          <Field label="KPI data source"><Select value={s.kpiDataSource} onChange={e=>setS("kpiDataSource", e.target.value)}><option>Calculated from Deliverable Register</option><option>Manual KPI Entry</option><option>Hybrid</option></Select></Field>
          <Field label="Application data version"><Input value={s.appDataVersion} disabled /></Field>
        </div>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 }}>
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>Autosave & Confirmation</h3>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={s.autosaveEnabled} onChange={e=>setS("autosaveEnabled", e.target.checked)} /> Autosave enabled
          </label>
          <Field label="Autosave delay (ms)"><Input type="number" value={s.autosaveDelayMs} onChange={e=>setS("autosaveDelayMs", Number(e.target.value))} style={{ width: 120 }} /></Field>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
            <input type="checkbox" checked={s.confirmBeforeDeletion} onChange={e=>setS("confirmBeforeDeletion", e.target.checked)} /> Confirm before deletion
          </label>
        </div>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 }}>
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>Thresholds</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
          <Field label="Above target (+pts)"><Input type="number" value={s.performanceThresholds.aboveTarget} onChange={e=>setS("performanceThresholds", { ...s.performanceThresholds, aboveTarget: Number(e.target.value) })} /></Field>
          <Field label="Slightly below (−pts)"><Input type="number" value={s.performanceThresholds.slightlyBelow} onChange={e=>setS("performanceThresholds", { ...s.performanceThresholds, slightlyBelow: Number(e.target.value) })} /></Field>
          <div />
          <Field label="Risk: Low max score"><Input type="number" value={s.riskThresholds.low} onChange={e=>setS("riskThresholds", { ...s.riskThresholds, low: Number(e.target.value) })} /></Field>
          <Field label="Risk: Medium max score"><Input type="number" value={s.riskThresholds.medium} onChange={e=>setS("riskThresholds", { ...s.riskThresholds, medium: Number(e.target.value) })} /></Field>
          <Field label="Risk: High max score"><Input type="number" value={s.riskThresholds.high} onChange={e=>setS("riskThresholds", { ...s.riskThresholds, high: Number(e.target.value) })} /></Field>
        </div>
      </section>

      <section style={{ background: "#fff", border: "1px solid #e2e7ee", borderRadius: 12, padding: 18 }}>
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>Import, Export & Backup</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Button variant="secondary" icon={Download} onClick={exportJSON}>Export all data (JSON)</Button>
          <Button variant="secondary" icon={Upload} onClick={()=>fileInputRef.current.click()}>Import data (JSON)</Button>
          <input ref={fileInputRef} type="file" accept="application/json" style={{ display: "none" }} onChange={onFileSelected} />
          <Button variant="secondary" icon={Download} onClick={()=>exportCSV(data.activities, "activities.csv", ["id","name","initiativeId","owner","status","priority","progress","plannedStart","plannedEnd"])}>Export activities (CSV)</Button>
          <Button variant="secondary" icon={Download} onClick={()=>exportCSV(data.initiatives, "releases.csv", ["id","name","owner","status","priority","confidence","progress","deadline"])}>Export releases (CSV)</Button>
          <Button variant="secondary" icon={Download} onClick={()=>exportCSV(data.kpiResults, "kpi-results.csv", ["metric","reportingPeriod","numerator","denominator","calculatedPct","target","performanceStatus"])}>Export KPI results (CSV)</Button>
          <Button variant="secondary" icon={Download} onClick={()=>exportCSV(data.alignments, "alignment-actions.csv", ["counterpart","topic","meetingStatus","dueDate","completionStatus"])}>Export alignments (CSV)</Button>
          <Button variant="secondary" icon={Printer} onClick={()=>window.print()}>Print executive report</Button>
        </div>
        <div style={{ marginTop: 14 }}>
          <Button variant="danger" icon={RotateCcw} onClick={()=>{
            if (window.confirm("Reset the application to initial sample data? This will overwrite all current data.")) resetData();
          }}>Reset to initial data</Button>
        </div>
      </section>

      {importState && (
        <Modal open onClose={()=>setImportState(null)} title={`Import "${importState.fileName}"`} width={480}
          footer={<>
            <Button variant="secondary" onClick={()=>setImportState(null)}>Cancel</Button>
            <Button variant="secondary" onClick={()=>doImport("merge")}>Merge</Button>
            <Button variant="danger" onClick={()=>doImport("replace")}>Replace all data</Button>
          </>}>
          <p style={{ fontSize: 13.5, color: "#334155" }}>
            This file contains {importState.parsed.initiatives?.length ?? 0} releases, {importState.parsed.activities?.length ?? 0} activities,
            {" "}{importState.parsed.kpiResults?.length ?? 0} KPI results, {importState.parsed.risks?.length ?? 0} risk records, and {importState.parsed.alignments?.length ?? 0} alignment records.
          </p>
          <p style={{ fontSize: 13, color: "#a3271f" }}>Replacing will overwrite all current data. Merging will match records by ID.</p>
        </Modal>
      )}
    </div>
  );
}
