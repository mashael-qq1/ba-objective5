import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

/* ============================================================
   SELF-CONTAINED ICONS
   (No external icon package dependency — avoids version-mismatch
   "Element type is invalid" errors across different sandboxes.)
   ============================================================ */
function makeIcon(paths) {
  return function Icon({ size = 16, color = "currentColor", style, ...rest }) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={style}
        {...rest}
      >
        {paths}
      </svg>
    );
  };
}
const LayoutDashboard = makeIcon(
  <>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </>
);
const GanttChartSquare = makeIcon(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="7" y1="8" x2="14" y2="8" />
    <line x1="10" y1="12" x2="18" y2="12" />
    <line x1="7" y1="16" x2="15" y2="16" />
  </>
);
const ListChecks = makeIcon(
  <>
    <path d="M4 6l1.5 1.5L8 5" />
    <path d="M4 12l1.5 1.5L8 11" />
    <path d="M4 18l1.5 1.5L8 16" />
    <line x1="11" y1="6" x2="21" y2="6" />
    <line x1="11" y1="12" x2="21" y2="12" />
    <line x1="11" y1="18" x2="21" y2="18" />
  </>
);
const LineChartIcon = makeIcon(
  <>
    <line x1="3" y1="21" x2="21" y2="21" />
    <line x1="3" y1="3" x2="3" y2="21" />
    <polyline points="6,15 10,9 14,13 20,5" />
  </>
);
const Users = makeIcon(
  <>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M15.5 14c2.6.3 4.5 2.4 4.5 5" />
  </>
);
const ShieldAlert = makeIcon(
  <>
    <path d="M12 3l8 3.5v5c0 5-3.4 8.4-8 9.5-4.6-1.1-8-4.5-8-9.5v-5L12 3z" />
    <line x1="12" y1="9" x2="12" y2="13.5" />
    <circle cx="12" cy="16.3" r="0.6" fill={"currentColor"} />
  </>
);
const History = makeIcon(
  <>
    <circle cx="12" cy="13" r="8" />
    <polyline points="12,9 12,13 15,15" />
    <path d="M5 3L3 6" />
    <path d="M19 3l2 3" />
  </>
);
const SettingsIcon = makeIcon(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 13a7.9 7.9 0 000-2l2-1.6-2-3.4-2.4.6a8 8 0 00-1.7-1L15 3h-6l-.3 2.6a8 8 0 00-1.7 1l-2.4-.6-2 3.4L4.6 11a7.9 7.9 0 000 2l-2 1.6 2 3.4 2.4-.6a8 8 0 001.7 1L9 21h6l.3-2.6a8 8 0 001.7-1l2.4.6 2-3.4-2-1.6z" />
  </>
);
const Plus = makeIcon(
  <>
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </>
);
const X = makeIcon(
  <>
    <line x1="6" y1="6" x2="18" y2="18" />
    <line x1="18" y1="6" x2="6" y2="18" />
  </>
);
const Search = makeIcon(
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <line x1="20" y1="20" x2="15.3" y2="15.3" />
  </>
);
const Download = makeIcon(
  <>
    <path d="M12 3v12" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </>
);
const Upload = makeIcon(
  <>
    <path d="M12 15V3" />
    <polyline points="7,8 12,3 17,8" />
    <line x1="4" y1="20" x2="20" y2="20" />
  </>
);
const Save = makeIcon(
  <>
    <path d="M5 3h11l3 3v15H5z" />
    <rect x="8" y="3" width="7" height="5" />
    <rect x="7" y="13" width="10" height="7" />
  </>
);
const ChevronDown = makeIcon(<polyline points="6,9 12,15 18,9" />);
const ChevronRight = makeIcon(<polyline points="9,6 15,12 9,18" />);
const ChevronUp = makeIcon(<polyline points="6,15 12,9 18,15" />);
const GripVertical = makeIcon(
  <>
    <circle cx="9" cy="6" r="1" fill="currentColor" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="9" cy="18" r="1" fill="currentColor" />
    <circle cx="15" cy="6" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="18" r="1" fill="currentColor" />
  </>
);
const Trash2 = makeIcon(
  <>
    <line x1="4" y1="7" x2="20" y2="7" />
    <path d="M6 7l1 13h10l1-13" />
    <path d="M9 7V4h6v3" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>
);
const Copy = makeIcon(
  <>
    <rect x="9" y="9" width="12" height="12" rx="1.5" />
    <path d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
  </>
);
const Archive = makeIcon(
  <>
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v11a1 1 0 001 1h12a1 1 0 001-1V8" />
    <line x1="10" y1="12" x2="14" y2="12" />
  </>
);
const RotateCcw = makeIcon(
  <>
    <path d="M3 12a9 9 0 109-9 9.7 9.7 0 00-6.7 2.8L3 8" />
    <polyline points="3,3 3,8 8,8" />
  </>
);
const AlertTriangle = makeIcon(
  <>
    <path d="M12 3.5l9.5 16.5H2.5z" />
    <line x1="12" y1="9.5" x2="12" y2="14" />
    <circle cx="12" cy="17" r="0.6" fill="currentColor" />
  </>
);
const CheckCircle2 = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="8,12.5 11,15.5 16,9" />
  </>
);
const Clock = makeIcon(
  <>
    <circle cx="12" cy="12" r="9" />
    <polyline points="12,7 12,12 16,14" />
  </>
);
const Flag = makeIcon(
  <>
    <path d="M5 21V4" />
    <path d="M5 4h13l-3 4.5L18 13H5" />
  </>
);
const Link2 = makeIcon(
  <>
    <path d="M9 15l6-6" />
    <path d="M14 5h3a4 4 0 010 8h-2" />
    <path d="M10 19H7a4 4 0 010-8h2" />
  </>
);
const Filter = makeIcon(<path d="M4 5h16l-6 8v5l-4 2v-7z" />);
const Printer = makeIcon(
  <>
    <rect x="6" y="3" width="12" height="6" />
    <path d="M6 9H4a2 2 0 00-2 2v6a2 2 0 002 2h2" />
    <path d="M18 9h2a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
    <rect x="6" y="14" width="12" height="7" />
  </>
);
const ArrowLeft = makeIcon(
  <>
    <line x1="20" y1="12" x2="4" y2="12" />
    <polyline points="10,6 4,12 10,18" />
  </>
);
const TrendingUp = makeIcon(
  <>
    <polyline points="3,17 9,11 13,15 21,6" />
    <polyline points="15,6 21,6 21,12" />
  </>
);
const TrendingDown = makeIcon(
  <>
    <polyline points="3,7 9,13 13,9 21,18" />
    <polyline points="15,18 21,18 21,12" />
  </>
);
const Minus = makeIcon(<line x1="5" y1="12" x2="19" y2="12" />);
function Circle({ size = 16, color = "currentColor", fill, style, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style} {...rest}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={fill || "none"}
        stroke={fill ? "none" : color}
        strokeWidth="2"
      />
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

const STATUS_VALUES = [
  "Not Started",
  "Planned",
  "In Progress",
  "Under Review",
  "Blocked",
  "At Risk",
  "Delayed",
  "Completed",
  "On Hold",
  "Cancelled",
];
const PRIORITY_VALUES = ["Critical", "High", "Medium", "Low"];
const CONFIDENCE_VALUES = [
  "High",
  "Medium-High",
  "Medium",
  "Medium-Low",
  "Low",
];
const DELIVERABLE_CATEGORIES = [
  "Discovery Output",
  "BRD",
  "User Stories",
  "Process Model",
  "Requirements Traceability Matrix",
  "UAT Support Package",
  "Change Request Analysis",
  "Business Case",
  "Product Requirement",
  "Other",
];
const REVIEW_RESULTS = [
  "Accepted",
  "Accepted with Minor Comments",
  "Major Rework Required",
  "Rejected",
  "Pending Review",
];
const MEETING_STATUSES = [
  "Not Scheduled",
  "Scheduled",
  "Completed",
  "Rescheduled",
  "Cancelled",
];
const ACTION_STATUSES = [
  "Open",
  "In Progress",
  "Blocked",
  "Completed",
  "Overdue",
];
const RAID_TYPES = ["Risk", "Issue", "Assumption", "Dependency", "Decision"];
const PROB_IMPACT = ["Very Low", "Low", "Medium", "High", "Very High"];
const PI_SCALE = { "Very Low": 1, Low: 2, Medium: 3, High: 4, "Very High": 5 };
const QUARTERS_2026 = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];

// Internal rollout quarters for the Objective 5 initiative timeline (13-week cycles,
// starting Sun 26 Jul 2026, Sun–Thu working week, KSA public holidays excluded).
// Kept separate from QUARTERS_2026 (used for calendar-year KPI measurement periods).
const OBJECTIVE5_QUARTERS = [
  {
    label: "Q1",
    range: "6 Jul – 2 Oct 2026",
    start: "2026-07-06",
    end: "2026-10-02",
  },
  {
    label: "Q2",
    range: "5 Oct 2026 – 1 Jan 2027",
    start: "2026-10-05",
    end: "2027-01-01",
  },
  {
    label: "Q3",
    range: "4 Jan – 2 Apr 2027",
    start: "2027-01-04",
    end: "2027-04-02",
  },
  {
    label: "Q4",
    range: "5 Apr – 2 Jul 2027",
    start: "2027-04-05",
    end: "2027-07-02",
  },
];

function uid(prefix) {
  return prefix + "-" + Math.random().toString(36).slice(2, 9);
}
function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function fmtDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}
function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
function clampProgress(n) {
  return Math.max(0, Math.min(100, Number(n) || 0));
}
function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

const INITIAL_INITIATIVES = [
  {
    id: "OBJ5-INIT-01",
    name: "Delivery Baseline & Definitions",
    objective: "Objective 5 — Delivery Excellence",
    description:
      "Establish common delivery definitions, measurement fields, baseline data, and an agreed calculation approach for Objective 5. Define deliverable categories; define major (structural) vs minor rework; set up Jira committed-date fields + acceptance flags; run a pilot + baseline measurement; recalibrate the improvement-delta targets.",
    owner: "Leen",
    support: ["BA Leads", "Head of BA", "Jira Admin"],
    plannedStart: "2026-07-06",
    plannedEnd: "2026-10-02",
    actualStart: "",
    actualEnd: "",
    deadline: "Q1 (6 Jul – 2 Oct 2026)",
    status: "Planned",
    priority: "Critical",
    confidence: "High",
    progress: 0,
    servesKpi: [
      "Delivery Excellence Index",
      "5.1 On-Time Delivery Rate",
      "5.2 First-Review Acceptance Rate",
    ],
    deliverables: [
      "Initiative Plan and Measurement Plan",
      "Approved BA Deliverable Categories",
      "Objective 5 Measurement Definitions",
    ],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate:
      "Detailed 6-phase plan loaded (Initiation → Categories → Measurement Rules → Jira Fields → Pilot/Baseline → Analysis).",
    notes:
      "Dates follow the detailed rollout plan: starts Mon 6 Jul 2026 (shifted 20 days earlier from the original 26 Jul plan), Sun–Thu working week. Re-verify weekday alignment and fixed KSA public-holiday exclusions against the shifted dates.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 0,
  },
  {
    id: "OBJ5-INIT-02",
    name: "On-Time Delivery Discipline",
    objective: "Objective 5 — Delivery Excellence",
    description:
      "Improve estimation, dependency management, committed-date control, and date renegotiation practices across BA engagements. Assess current estimation practices, develop an estimation framework, establish dependency/RAID management, define committed-date governance, pilot, then roll out.",
    owner: "BA Leads",
    support: ["Leen", "Portfolio Managers"],
    plannedStart: "2026-10-05",
    plannedEnd: "2027-01-01",
    actualStart: "",
    actualEnd: "",
    deadline: "Q2 (5 Oct 2026 – 1 Jan 2027)",
    status: "Planned",
    priority: "High",
    confidence: "Medium",
    progress: 0,
    servesKpi: ["5.1 On-Time Delivery Rate"],
    deliverables: [
      "BA Deliverable Estimation Framework",
      "Committed-Date and Renegotiation Protocol",
    ],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate:
      "Not yet started — depends on Initiative 1 definitions and baseline.",
    notes:
      "Dates follow the detailed rollout plan (Sun–Thu working week, KSA holidays excluded). Update as work progresses.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 1,
  },
  {
    id: "OBJ5-INIT-03",
    name: "First-Review Acceptance Quality",
    objective: "Objective 5 — Delivery Excellence",
    description:
      "Improve the quality of BA deliverables before client submission and create a consistent record of first-review feedback, acceptance, and rework. Define acceptance rules, build a structured feedback/sign-off record, define pre-submission quality requirements, develop and pilot the BA pre-submission checklist, then roll out.",
    owner: "Leen",
    support: ["BA Leads", "Business Owners", "Objective 6 Owner"],
    plannedStart: "2027-01-04",
    plannedEnd: "2027-04-02",
    actualStart: "",
    actualEnd: "",
    deadline: "Q3 (4 Jan – 2 Apr 2027)",
    status: "Planned",
    priority: "High",
    confidence: "Medium",
    progress: 0,
    servesKpi: ["5.2 First-Review Acceptance Rate"],
    deliverables: ["Reusable BA Pre-Submission Checklist Template"],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate:
      "Not yet started — depends on Objective 6 quality standards. Eid al-Fitr planning gap (shifted with the plan) included with no tasks scheduled.",
    notes:
      "Dates follow the detailed rollout plan; Founding Day (22 Feb 2027) excluded. Verify Eid al-Fitr dates against your company's approved holiday calendar.",
    evidenceLinks: [],
    createdDate: "2026-07-20",
    updatedDate: "2026-07-20",
    archived: false,
    order: 2,
  },
  {
    id: "OBJ5-INIT-04",
    name: "Continuous Delivery Monitoring",
    objective: "Objective 5 — Delivery Excellence",
    description:
      "Review delivery performance quarterly, analyze missed targets, and feed lessons back into estimation, quality, dependency, and planning practices. Recurring 5-working-day cycle: prepare KPI results, analyze misses and root causes, define corrective actions, present and close the quarterly review.",
    owner: "Leen",
    support: ["BA Leads"],
    plannedStart: "2026-09-28",
    plannedEnd: "2027-07-02",
    actualStart: "",
    actualEnd: "",
    deadline: "Recurring quarterly",
    status: "Planned",
    priority: "Medium",
    confidence: "Medium",
    progress: 0,
    servesKpi: [
      "Delivery Excellence Index",
      "5.1 On-Time Delivery Rate",
      "5.2 First-Review Acceptance Rate",
    ],
    deliverables: [],
    milestoneIds: [],
    dependencies: [],
    risks: [],
    latestUpdate:
      "Four review cycles scheduled: Q1 (28 Sep – 2 Oct 2026), Q2 (28 Dec 2026 – 1 Jan 2027), Q3 (29 Mar – 2 Apr 2027), Q4 (28 Jun – 2 Jul 2027).",
    notes: "Recurring quarterly cadence, 5 working days per cycle (Sun–Thu).",
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
    owner: overrides.owner || "Leen",
    support: overrides.support || [],
    plannedStart: overrides.plannedStart,
    plannedEnd: overrides.plannedEnd,
    actualStart: "",
    actualEnd: "",
    status: overrides.milestone ? "Not Started" : "Planned",
    priority: overrides.priority || "Medium",
    progress: 0,
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
  });

  // Primary tasks + sub-tasks per the approved KSA-calendar-adjusted delivery plan.
  // Assumptions: plan starts Sun 26 Jul 2026; working week Sun–Thu; weekend Fri–Sat;
  // Saudi National Day (23 Sep 2026) and Founding Day (22 Feb 2027) excluded;
  // Eid al-Fitr (7–11 Mar 2027, per SAMA reference schedule) left open — verify against your company calendar.
  const PLAN = {
    "OBJ5-INIT-01": [
      {
        name: "1.1 Initiation and Measurement Planning",
        start: "2026-07-06",
        end: "2026-07-17",
        deliverable: "Initiative Plan and Measurement Plan",
        subtasks: [
          ["Kick-off Meeting", "2026-07-06", "2026-07-06"],
          ["Confirm Initiative Scope", "2026-07-07", "2026-07-08"],
          ["Identify Stakeholders", "2026-07-09", "2026-07-10"],
          ["Assess Current Measurement Process", "2026-07-13", "2026-07-15"],
          ["Prepare Measurement Plan", "2026-07-16", "2026-07-17"],
        ],
      },
      {
        name: "1.2 Define Deliverable Categories",
        start: "2026-07-20",
        end: "2026-07-31",
        deliverable: "Approved BA Deliverable Categories",
        subtasks: [
          ["Inventory Existing BA Deliverables", "2026-07-20", "2026-07-22"],
          ["Review Deliverables Across Projects", "2026-07-23", "2026-07-24"],
          ["Draft Deliverable Categories", "2026-07-27", "2026-07-28"],
          ["Review with BA Leads", "2026-07-29", "2026-07-30"],
          ["Approve Deliverable Categories", "2026-07-31", "2026-07-31"],
        ],
      },
      {
        name: "1.3 Define Measurement Rules",
        start: "2026-08-03",
        end: "2026-08-14",
        deliverable: "Objective 5 Measurement Definitions",
        subtasks: [
          ["Define Committed Date", "2026-08-03", "2026-08-04"],
          ["Define Actual Submission Date", "2026-08-05", "2026-08-05"],
          ["Define On-Time Delivery", "2026-08-06", "2026-08-07"],
          ["Define First Review Acceptance", "2026-08-10", "2026-08-10"],
          ["Define Minor Rework", "2026-08-11", "2026-08-11"],
          ["Define Major Rework", "2026-08-12", "2026-08-12"],
          ["Create Classification Examples", "2026-08-13", "2026-08-13"],
          ["Approve Measurement Rules", "2026-08-14", "2026-08-14"],
        ],
      },
      {
        name: "1.4 Configure Jira Measurement Fields",
        start: "2026-08-17",
        end: "2026-08-28",
        owner: "Jira Admin",
        subtasks: [
          ["Identify Jira Fields", "2026-08-17", "2026-08-18"],
          ["Prepare Jira Configuration", "2026-08-19", "2026-08-20"],
          ["Review with Jira Admin", "2026-08-21", "2026-08-21"],
          ["Configure Test Environment", "2026-08-24", "2026-08-25"],
          ["Validate Configuration", "2026-08-26", "2026-08-27"],
          ["Approve Configuration", "2026-08-28", "2026-08-28"],
        ],
      },
      {
        name: "1.5 Pilot and Baseline Measurement",
        start: "2026-08-31",
        end: "2026-09-25",
        notes:
          "Plan shifted to start 6 Jul 2026 — re-check fixed KSA public holidays (e.g. National Day 23 Sep) against the new dates. Original 2–3 month measurement window can extend into Q2 for a more reliable baseline.",
        subtasks: [
          ["Select Pilot Projects", "2026-08-31", "2026-09-01"],
          ["Train BA Leads", "2026-09-02", "2026-09-04"],
          ["Start Data Collection", "2026-09-07", "2026-09-07"],
          ["Week 1 Measurement", "2026-09-07", "2026-09-11"],
          ["Week 2 Measurement", "2026-09-14", "2026-09-18"],
          ["Week 3 Measurement", "2026-09-21", "2026-09-25"],
          ["Validate Data Quality", "2026-09-23", "2026-09-25"],
        ],
      },
      {
        name: "1.6 Analyze Baseline and Recalibrate Targets",
        start: "2026-09-28",
        end: "2026-10-02",
        milestone: "Initial Delivery Baseline Approved",
        subtasks: [
          ["Clean Data", "2026-09-28", "2026-09-28"],
          ["Calculate KPI 5.1", "2026-09-29", "2026-09-29"],
          ["Calculate KPI 5.2", "2026-09-29", "2026-09-29"],
          ["Calculate Delivery Excellence Index", "2026-09-30", "2026-09-30"],
          ["Gap Analysis", "2026-09-30", "2026-10-01"],
          ["Recalibrate Targets", "2026-10-01", "2026-10-01"],
          ["Approve Initial Baseline", "2026-10-02", "2026-10-02"],
        ],
      },
    ],
    "OBJ5-INIT-02": [
      {
        name: "2.1 Assess Current Estimation Practices",
        start: "2026-10-05",
        end: "2026-10-16",
        owner: "BA Leads",
        subtasks: [
          ["Collect Current Estimation Methods", "2026-10-05", "2026-10-07"],
          ["Review Project Plan Samples", "2026-10-08", "2026-10-09"],
          [
            "Interview BA Leads on Estimation Challenges",
            "2026-10-12",
            "2026-10-13",
          ],
          [
            "Analyze Causes of Inaccurate Estimates",
            "2026-10-14",
            "2026-10-15",
          ],
          ["Prepare Current-State Report", "2026-10-16", "2026-10-16"],
        ],
      },
      {
        name: "2.2 Develop the Estimation Framework",
        start: "2026-10-19",
        end: "2026-10-30",
        deliverable: "BA Deliverable Estimation Framework",
        owner: "BA Leads",
        subtasks: [
          ["Define Work-Sizing Factors", "2026-10-19", "2026-10-20"],
          ["Define Deliverable Complexity Levels", "2026-10-21", "2026-10-22"],
          ["Define Stakeholder-Count Impact", "2026-10-23", "2026-10-23"],
          [
            "Define Integrations and Dependencies Impact",
            "2026-10-26",
            "2026-10-26",
          ],
          ["Prepare Estimation Template", "2026-10-27", "2026-10-28"],
          ["Review Template with BA Leads", "2026-10-29", "2026-10-29"],
          ["Approve Estimation Framework", "2026-10-30", "2026-10-30"],
        ],
      },
      {
        name: "2.3 Establish Dependency and RAID Management",
        start: "2026-11-02",
        end: "2026-11-13",
        owner: "Leen",
        subtasks: [
          ["Define Key Dependency Types", "2026-11-02", "2026-11-03"],
          ["Design Dependency Log", "2026-11-04", "2026-11-05"],
          ["Design Unified RAID Log", "2026-11-06", "2026-11-09"],
          [
            "Define Dependency Tracking Responsibilities",
            "2026-11-10",
            "2026-11-10",
          ],
          ["Define Escalation Mechanism", "2026-11-11", "2026-11-11"],
          ["Review and Approve Templates", "2026-11-12", "2026-11-13"],
        ],
      },
      {
        name: "2.4 Define Committed-Date Governance",
        start: "2026-11-16",
        end: "2026-12-04",
        deliverable: "Committed-Date and Renegotiation Protocol",
        owner: "BA Leads",
        subtasks: [
          [
            "Define Original Date Approval Mechanism",
            "2026-11-16",
            "2026-11-17",
          ],
          ["Define Date-Change Authority", "2026-11-18", "2026-11-19"],
          ["Define Accepted Date-Change Reasons", "2026-11-20", "2026-11-23"],
          ["Prepare Date Renegotiation Protocol", "2026-11-24", "2026-11-26"],
          ["Define Scope-Change Impact on Dates", "2026-11-27", "2026-11-30"],
          ["Prepare Date-Change Request Form", "2026-12-01", "2026-12-02"],
          [
            "Review Process with Portfolio Managers",
            "2026-12-03",
            "2026-12-03",
          ],
          ["Approve Process", "2026-12-04", "2026-12-04"],
        ],
      },
      {
        name: "2.5 Pilot the Delivery Discipline",
        start: "2026-12-07",
        end: "2026-12-25",
        owner: "BA Leads",
        subtasks: [
          ["Select Pilot Projects", "2026-12-07", "2026-12-08"],
          ["Train BA Leads and Analysts", "2026-12-09", "2026-12-11"],
          ["Apply Estimation Template", "2026-12-14", "2026-12-16"],
          ["Apply Dependency and RAID Log", "2026-12-17", "2026-12-18"],
          [
            "Apply Date Commit and Change Mechanism",
            "2026-12-21",
            "2026-12-22",
          ],
          ["Collect Feedback", "2026-12-23", "2026-12-24"],
          ["Analyze Pilot Results", "2026-12-25", "2026-12-25"],
        ],
      },
      {
        name: "2.6 Finalize and Roll Out",
        start: "2026-12-28",
        end: "2027-01-01",
        owner: "Portfolio Managers",
        milestone: "Delivery Discipline Launched",
        subtasks: [
          ["Update Templates Based on Pilot", "2026-12-28", "2026-12-29"],
          ["Prepare Quick Usage Guide", "2026-12-30", "2026-12-30"],
          ["Obtain Final Approval", "2026-12-31", "2026-12-31"],
          ["Roll Out Practice Across Portfolios", "2027-01-01", "2027-01-01"],
        ],
      },
    ],
    "OBJ5-INIT-03": [
      {
        name: "3.1 Define First-Review Acceptance Rules",
        start: "2027-01-04",
        end: "2027-01-15",
        subtasks: [
          [
            "Review Deliverable Acceptance Documentation Methods",
            "2027-01-04",
            "2027-01-06",
          ],
          [
            "Catalog Acceptance and Rejection Scenarios",
            "2027-01-07",
            "2027-01-08",
          ],
          ["Define Accepted", "2027-01-11", "2027-01-11"],
          ["Define Accepted with Minor Comments", "2027-01-12", "2027-01-12"],
          ["Define Major Rework Required", "2027-01-13", "2027-01-13"],
          ["Define Rejected", "2027-01-14", "2027-01-14"],
          ["Approve First-Review Acceptance Rules", "2027-01-15", "2027-01-15"],
        ],
      },
      {
        name: "3.2 Create Structured Feedback and Sign-Off Record",
        start: "2027-01-18",
        end: "2027-01-29",
        subtasks: [
          ["Define Review Record Fields", "2027-01-18", "2027-01-19"],
          ["Design Feedback Form", "2027-01-20", "2027-01-21"],
          ["Design Sign-Off Form", "2027-01-22", "2027-01-25"],
          [
            "Add Major and Minor Rework Classification",
            "2027-01-26",
            "2027-01-26",
          ],
          ["Add Rework Reason Categories", "2027-01-27", "2027-01-27"],
          ["Review Form with Business Owners", "2027-01-28", "2027-01-28"],
          ["Approve Form", "2027-01-29", "2027-01-29"],
        ],
      },
      {
        name: "3.3 Define Pre-Submission Quality Requirements",
        start: "2027-02-01",
        end: "2027-02-12",
        notes:
          "Plan shifted to start 6 Jul 2026 — re-check the Founding Day (22 Feb) exclusion against the new dates.",
        subtasks: [
          ["Review Objective 6 Standards", "2027-02-01", "2027-02-03"],
          [
            "Define Requirements-Completeness Criteria",
            "2027-02-04",
            "2027-02-05",
          ],
          ["Define BRD Scoping Rules", "2027-02-08", "2027-02-08"],
          ["Define Document-Size Controls", "2027-02-09", "2027-02-09"],
          [
            "Define File Structure Confirmation Requirements",
            "2027-02-10",
            "2027-02-10",
          ],
          ["Define Template-Compliance Criteria", "2027-02-11", "2027-02-11"],
          ["Approve Quality Requirements", "2027-02-12", "2027-02-12"],
        ],
      },
      {
        name: "3.4 Develop the BA Pre-Submission Checklist",
        start: "2027-02-22",
        end: "2027-03-12",
        deliverable: "Reusable BA Pre-Submission Checklist Template",
        notes:
          "Eid al-Fitr gap shifted with the plan (per SAMA reference schedule) — re-verify exact Eid dates against your company holiday calendar.",
        subtasks: [
          ["Design Checklist Structure", "2027-02-22", "2027-02-23"],
          ["Add File Structure Section", "2027-02-24", "2027-02-25"],
          ["Add BRD Scope and Size Section", "2027-02-26", "2027-03-01"],
          ["Add Requirements Completeness Section", "2027-03-02", "2027-03-04"],
          ["Add Standards Compliance Section", "2027-03-05", "2027-03-08"],
          [
            "Add Dependencies and Decisions Section",
            "2027-03-09",
            "2027-03-09",
          ],
          ["Prepare Initial Template Version", "2027-03-10", "2027-03-10"],
          ["Review Template with BA Leads", "2027-03-11", "2027-03-11"],
          ["Prepare Pilot Version", "2027-03-12", "2027-03-12"],
        ],
      },
      {
        name: "3.5 Pilot the Checklist and Acceptance Record",
        start: "2027-03-15",
        end: "2027-03-26",
        subtasks: [
          ["Select Pilot Analysts and Projects", "2027-03-15", "2027-03-16"],
          ["Brief Participants on the Checklist", "2027-03-17", "2027-03-17"],
          ["Apply Checklist to Real Deliverables", "2027-03-18", "2027-03-22"],
          ["Record First-Review Results", "2027-03-23", "2027-03-23"],
          ["Collect Analyst Feedback", "2027-03-24", "2027-03-24"],
          ["Collect Business Owner Feedback", "2027-03-25", "2027-03-25"],
          ["Analyze Pilot Results", "2027-03-26", "2027-03-26"],
        ],
      },
      {
        name: "3.6 Final Approval and Rollout",
        start: "2027-03-29",
        end: "2027-04-02",
        milestone: "Pre-Submission Checklist Launched",
        subtasks: [
          [
            "Update Checklist and Acceptance Record",
            "2027-03-29",
            "2027-03-30",
          ],
          ["Prepare Usage Guide", "2027-03-31", "2027-03-31"],
          ["Obtain Final Approval", "2027-04-01", "2027-04-01"],
          [
            "Roll Out Template Across the Department",
            "2027-04-02",
            "2027-04-02",
          ],
        ],
      },
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
        initiativeId,
        name: p.name,
        plannedStart: p.start,
        plannedEnd: p.end,
        deliverable: p.deliverable,
        owner: p.owner,
        notes: p.notes,
        order: pIdx,
      });
      // Auto Finish-to-Start dependency on the preceding Major Activity.
      if (prevPrimaryId) {
        primaryTask.predecessors = [prevPrimaryId];
        primaryTask.dependencyType = "Finish-to-Start";
      }
      prevPrimaryId = primaryTask.id;
      activities.push(primaryTask);
      (p.subtasks || []).forEach(([name, start, end], sIdx) => {
        activities.push(
          task({
            initiativeId,
            name,
            plannedStart: start,
            plannedEnd: end,
            parentActivityId: primaryTask.id,
            order: sIdx,
          })
        );
      });
      if (p.milestone) {
        activities.push(
          task({
            initiativeId,
            name: `Milestone: ${p.milestone}`,
            plannedStart: p.end,
            plannedEnd: p.end,
            milestone: true,
            order: primaries.length + pIdx,
          })
        );
      }
    });
  });

  // Initiative 4 — recurring quarterly review cycles (5 working days each: Sun–Thu).
  const REVIEW_CYCLES = [
    {
      label: "Q1 Review",
      d1: "2026-09-28",
      d23s: "2026-09-29",
      d23e: "2026-09-30",
      d4: "2026-10-01",
      d5: "2026-10-02",
    },
    {
      label: "Q2 Review",
      d1: "2026-12-28",
      d23s: "2026-12-29",
      d23e: "2026-12-30",
      d4: "2026-12-31",
      d5: "2027-01-01",
    },
    {
      label: "Q3 Review",
      d1: "2027-03-29",
      d23s: "2027-03-30",
      d23e: "2027-03-31",
      d4: "2027-04-01",
      d5: "2027-04-02",
    },
    {
      label: "Q4 Review",
      d1: "2027-06-28",
      d23s: "2027-06-29",
      d23e: "2027-06-30",
      d4: "2027-07-01",
      d5: "2027-07-02",
    },
  ];
  const CYCLE_SUBTASKS = {
    "4.1 Prepare KPI Results": [
      "Extract Deliverables List",
      "Validate Date Completeness",
      "Calculate On-Time Delivery Rate",
      "Calculate First-Review Acceptance Rate",
      "Calculate Delivery Excellence Index",
      "Compare Result to Target",
    ],
    "4.2 Analyze Misses and Root Causes": [
      "Identify Late Deliverables",
      "Identify Deliverables Needing Major Rework",
      "Review Delay Causes",
      "Review Rework Causes",
      "Classify Causes",
      "Identify Recurring Causes",
      "Identify Most-Affected Projects and Portfolios",
    ],
    "4.3 Define Corrective Actions": [
      "Propose Corrective Actions",
      "Assign Action Owners",
      "Set Target Dates",
      "Flag Actions Needing Escalation",
      "Update Estimation Framework",
      "Update Dependency Log",
      "Update Pre-Submission Checklist as Needed",
    ],
    "4.4 Present and Close the Quarterly Review": [
      "Prepare Executive Summary",
      "Present Results to BA Leads",
      "Document Decisions",
      "Approve Corrective Actions",
      "Publish Quarterly Report",
      "Carry Open Actions to Next Quarter",
    ],
  };
  REVIEW_CYCLES.forEach((cycle, cIdx) => {
    const phases = [
      {
        name: `4.1 Prepare KPI Results (${cycle.label})`,
        start: cycle.d1,
        end: cycle.d1,
      },
      {
        name: `4.2 Analyze Misses and Root Causes (${cycle.label})`,
        start: cycle.d23s,
        end: cycle.d23e,
      },
      {
        name: `4.3 Define Corrective Actions (${cycle.label})`,
        start: cycle.d4,
        end: cycle.d4,
      },
      {
        name: `4.4 Present and Close the Quarterly Review (${cycle.label})`,
        start: cycle.d5,
        end: cycle.d5,
        milestone:
          cIdx === 0 || true
            ? "Quarterly Delivery Excellence Review Completed"
            : null,
      },
    ];
    let prevCyclePhaseId = null;
    phases.forEach((ph, phIdx) => {
      const baseKey = ph.name.replace(` (${cycle.label})`, "");
      const primaryTask = task({
        initiativeId: "OBJ5-INIT-04",
        name: ph.name,
        plannedStart: ph.start,
        plannedEnd: ph.end,
        recurring: true,
        recurrenceFrequency: "Quarterly",
        order: cIdx * 4 + phIdx,
      });
      // Finish-to-Start chain between phases 4.1 → 4.2 → 4.3 → 4.4 within the same cycle.
      if (prevCyclePhaseId) {
        primaryTask.predecessors = [prevCyclePhaseId];
        primaryTask.dependencyType = "Finish-to-Start";
      }
      prevCyclePhaseId = primaryTask.id;
      activities.push(primaryTask);
      (CYCLE_SUBTASKS[baseKey] || []).forEach((name, sIdx) => {
        activities.push(
          task({
            initiativeId: "OBJ5-INIT-04",
            name,
            plannedStart: ph.start,
            plannedEnd: ph.end,
            parentActivityId: primaryTask.id,
            order: sIdx,
          })
        );
      });
      if (ph.milestone) {
        activities.push(
          task({
            initiativeId: "OBJ5-INIT-04",
            name: `Milestone: ${ph.milestone} (${cycle.label})`,
            plannedStart: ph.end,
            plannedEnd: ph.end,
            milestone: true,
            order: 100 + cIdx,
          })
        );
      }
    });
  });

  return activities;
}

const INITIAL_KPI_DEFS = {
  "Delivery Excellence Index": {
    baseline: "To be established in Q1 2026",
    baselineExplanation:
      "A reliable baseline does not currently exist because both sub-metrics and common deliverable classifications must first be measured consistently.",
    targets: { "Q2 2026": 55, "Q3 2026": 70, "Q4 2026": 80 },
    formula:
      "Deliverables meeting both 5.1 and 5.2 ÷ Total measured deliverables × 100",
    frequency: "Quarterly (using monthly sub-metric data)",
  },
  "5.1 On-Time Delivery Rate": {
    baseline: "To be established in Q1 2026",
    baselineExplanation:
      "Committed-date tracking in Jira currently varies by team and project, and no consolidated portfolio-level rate exists.",
    targets: { "Q2 2026": 80, "Q3 2026": 88, "Q4 2026": 95 },
    formula:
      "Deliverables delivered on or before committed date ÷ Total measured deliverables × 100",
    frequency: "Monthly",
  },
  "5.2 First-Review Acceptance Rate": {
    baseline: "To be established in Q1 2026",
    baselineExplanation:
      "Sign-off and review feedback currently exist in scattered emails, and major versus minor rework is not consistently classified.",
    targets: { "Q2 2026": 65, "Q3 2026": 78, "Q4 2026": 85 },
    formula:
      "Deliverables accepted on first review without major or structural rework ÷ Total reviewed deliverables × 100",
    frequency: "Monthly",
  },
};

const INITIAL_ALIGNMENTS = [
  {
    id: uid("ALN"),
    counterpart: "Head of BA — Fatima Alghannam",
    topic:
      "Deliverable categories, KPI targets, measurement approach, baseline approval, recalibrating improvement targets after Q1",
    requiredDecision: "Approve deliverable categories & Q1 baseline",
    meetingDate: "",
    meetingStatus: "Not Scheduled",
    owner: "Leen",
    attendees: ["Fatima Alghannam", "Leen"],
    notes: "",
    agreedActions: "",
    actionOwner: "Leen",
    dueDate: "",
    decision: "",
    evidence: "",
    followUpDate: "",
    completionStatus: "Open",
  },
  {
    id: uid("ALN"),
    counterpart: "BA Leads by portfolio",
    topic:
      "Estimation basis, dependency tracking, date renegotiation protocol, consistent acceptance capture, initiative adoption",
    requiredDecision: "Agree on-time delivery discipline rollout",
    meetingDate: "",
    meetingStatus: "Not Scheduled",
    owner: "Leen",
    attendees: ["BA Leads"],
    notes: "",
    agreedActions: "",
    actionOwner: "BA Leads",
    dueDate: "",
    decision: "",
    evidence: "",
    followUpDate: "",
    completionStatus: "Open",
  },
  {
    id: uid("ALN"),
    counterpart: "Portfolio Managers",
    topic:
      "Capacity coordination, cross-portfolio dependencies, delivery commitments, escalation of portfolio constraints",
    requiredDecision: "Confirm capacity constraints process",
    meetingDate: "",
    meetingStatus: "Not Scheduled",
    owner: "Leen",
    attendees: ["Portfolio Managers"],
    notes: "",
    agreedActions: "",
    actionOwner: "Portfolio Managers",
    dueDate: "",
    decision: "",
    evidence: "",
    followUpDate: "",
    completionStatus: "Open",
  },
  {
    id: uid("ALN"),
    counterpart: "Business Owners",
    topic:
      "Structured first-review feedback, acceptance criteria, major versus minor rework, sign-off records",
    requiredDecision: "Agree acceptance criteria definitions",
    meetingDate: "",
    meetingStatus: "Not Scheduled",
    owner: "Leen",
    attendees: ["Business Owners"],
    notes: "",
    agreedActions: "",
    actionOwner: "Business Owners",
    dueDate: "",
    decision: "",
    evidence: "",
    followUpDate: "",
    completionStatus: "Open",
  },
  {
    id: uid("ALN"),
    counterpart: "Jira Admin",
    topic:
      "Committed-date fields, acceptance flags, rework classifications, delivery reporting, data availability",
    requiredDecision: "Confirm Jira field configuration plan",
    meetingDate: "",
    meetingStatus: "Not Scheduled",
    owner: "Leen",
    attendees: ["Jira Admin"],
    notes: "",
    agreedActions: "",
    actionOwner: "Jira Admin",
    dueDate: "",
    decision: "",
    evidence: "",
    followUpDate: "",
    completionStatus: "Open",
  },
  {
    id: uid("ALN"),
    counterpart: "Baghdady — Objective 6 Owner",
    topic:
      "Pre-submission standards, checklist alignment, standards compliance, reducing client rework",
    requiredDecision: "Align checklist with Objective 6 AZM standards",
    meetingDate: "",
    meetingStatus: "Not Scheduled",
    owner: "Leen",
    attendees: ["Baghdady"],
    notes: "",
    agreedActions: "",
    actionOwner: "Baghdady",
    dueDate: "",
    decision: "",
    evidence: "",
    followUpDate: "",
    completionStatus: "Open",
  },
];

const INITIAL_RISKS = [
  {
    title: "Inconsistent Jira committed-date usage",
    type: "Risk",
    probability: "High",
    impact: "High",
  },
  {
    title: "Lack of agreed deliverable categories",
    type: "Risk",
    probability: "Medium",
    impact: "High",
  },
  {
    title: "Stakeholders continue using email for acceptance",
    type: "Risk",
    probability: "High",
    impact: "Medium",
  },
  {
    title: "Major and minor rework remain subjective",
    type: "Risk",
    probability: "Medium",
    impact: "High",
  },
  {
    title: "BA Leads do not adopt the date renegotiation protocol",
    type: "Risk",
    probability: "Medium",
    impact: "Medium",
  },
  {
    title: "Objective 6 standards are delayed",
    type: "Dependency",
    probability: "Medium",
    impact: "High",
  },
  {
    title: "Missing baseline data delays target confirmation",
    type: "Risk",
    probability: "Medium",
    impact: "High",
  },
  {
    title: "Portfolio capacity constraints affect committed dates",
    type: "Risk",
    probability: "High",
    impact: "Medium",
  },
  {
    title: "Analysts do not consistently use the checklist",
    type: "Risk",
    probability: "Medium",
    impact: "Medium",
  },
  {
    title: "Client review delays distort acceptance measurements",
    type: "Risk",
    probability: "Medium",
    impact: "Medium",
  },
].map((r, i) => ({
  id: uid("RAID"),
  type: r.type,
  title: r.title,
  description: "",
  relatedInitiative: "",
  relatedActivity: "",
  owner: "Leen",
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
  objectiveOwner: "Leen",
  supportingUsers: [
    "BA Leads",
    "Head of BA",
    "Jira Admin",
    "Portfolio Managers",
    "Business Owners",
    "Objective 6 Owner",
  ],
  statusValues: STATUS_VALUES,
  priorityValues: PRIORITY_VALUES,
  confidenceValues: CONFIDENCE_VALUES,
  deliverableCategories: DELIVERABLE_CATEGORIES,
  reviewResults: REVIEW_RESULTS,
  kpiDataSource: "Hybrid",
  performanceThresholds: { aboveTarget: 5, slightlyBelow: 5 },
  riskThresholds: { low: 4, medium: 9, high: 16 },
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
      {
        id: uid("VIEW"),
        name: "Delayed activities",
        filter: { status: "Delayed" },
      },
      {
        id: uid("VIEW"),
        name: "Milestones only",
        filter: { milestonesOnly: true },
      },
      {
        id: uid("VIEW"),
        name: "Leen's open actions",
        filter: { owner: "Leen" },
      },
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
  } catch (e) {
    /* fall through to localStorage */
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
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
  } catch (e) {
    ok = false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, payload);
    ok = true;
  } catch (e) {
    /* ignore */
  }
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
  return (PI_SCALE[r.probability] || 0) * (PI_SCALE[r.impact] || 0);
}
function riskLevel(score, thresholds) {
  if (score <= thresholds.low) return "Low";
  if (score <= thresholds.medium) return "Medium";
  if (score <= thresholds.high) return "High";
  return "Critical";
}
function computeObjectiveHealth(
  initiatives,
  activities,
  risks,
  kpiResults,
  thresholds
) {
  const active = initiatives.filter((i) => !i.archived);
  const delayed = active.filter(
    (i) => i.status === "Delayed" || i.status === "At Risk"
  ).length;
  const overdueActs = activities.filter(isOverdue).length;
  const highRisks = risks.filter((r) => {
    const lvl = riskLevel(riskScore(r), thresholds);
    return (lvl === "High" || lvl === "Critical") && r.status !== "Completed";
  }).length;
  const completed = active.filter((i) => i.status === "Completed").length;
  if (active.length > 0 && completed === active.length) return "Completed";
  if (delayed > 0 || highRisks > 1) return "Delayed";
  if (overdueActs > 3 || highRisks > 0) return "At Risk";
  if (overdueActs > 0) return "Attention Required";
  return "On Track";
}
function healthColor(h) {
  return (
    {
      "On Track": "#1a7f4b",
      "Attention Required": "#b8860b",
      "At Risk": "#c2410c",
      Delayed: "#b91c1c",
      Completed: "#0f2a52",
    }[h] || "#334155"
  );
}

function calcKpiResult(numerator, denominator, target, thresholds) {
  if (
    denominator === "" ||
    denominator === null ||
    denominator === undefined ||
    numerator === "" ||
    numerator === null ||
    numerator === undefined
  ) {
    return { pct: null, status: "No Data", variance: null };
  }
  const num = Number(numerator),
    den = Number(denominator);
  if (den <= 0) return { pct: null, status: "No Data", variance: null };
  const pct = Math.max(0, Math.min(100, (num / den) * 100));
  const variance = target != null ? Number((pct - target).toFixed(1)) : null;
  let status = "No Data";
  if (target != null) {
    if (pct >= target + thresholds.aboveTarget) status = "Above Target";
    else if (pct >= target) status = "On Target";
    else if (pct >= target - thresholds.slightlyBelow)
      status = "Slightly Below Target";
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
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 12,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 999,
        background: t.bg,
        color: t.fg,
        border: `1px solid ${t.bd}`,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

function statusTone(status) {
  if (["Completed"].includes(status)) return "green";
  if (["Delayed", "Blocked", "Cancelled"].includes(status)) return "red";
  if (["At Risk", "On Hold"].includes(status)) return "amber";
  if (["In Progress", "Under Review"].includes(status)) return "navy";
  return "neutral";
}
function priorityTone(p) {
  if (p === "Critical") return "red";
  if (p === "High") return "amber";
  if (p === "Medium") return "navy";
  return "neutral";
}

const EDIT_ICONS = new Set([
  Plus,
  Trash2,
  Copy,
  Archive,
  RotateCcw,
  Save,
  Upload,
]);
const IconBtn = ({
  icon: Icon,
  label,
  onClick,
  tone = "default",
  size = 16,
  disabled,
}) => {
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
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 30,
        height: 30,
        borderRadius: 6,
        border: "1px solid transparent",
        background: c.bg,
        color: c.fg,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
      }}
      onMouseEnter={(e) =>
        !disabled && (e.currentTarget.style.background = c.hover)
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = c.bg)}
    >
      <Icon size={size} />
    </button>
  );
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  icon: Icon,
  style,
  disabled,
  type = "button",
}) => {
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
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 13.5,
        fontWeight: 600,
        padding: "8px 14px",
        borderRadius: 8,
        border: `1px solid ${v.bd}`,
        background: v.bg,
        color: v.fg,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
};

const Field = ({ label, children, hint, error }) => (
  <label
    style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 13 }}
  >
    <span style={{ fontWeight: 600, color: "#334155" }}>{label}</span>
    {children}
    {hint && !error && (
      <span style={{ color: "#8592a3", fontSize: 11.5 }}>{hint}</span>
    )}
    {error && <span style={{ color: "#a3271f", fontSize: 11.5 }}>{error}</span>}
  </label>
);

const inputStyle = {
  padding: "8px 10px",
  borderRadius: 7,
  border: "1px solid #d7dde5",
  fontSize: 13.5,
  fontFamily: "inherit",
  background: "#fff",
  color: "#1c2733",
  width: "100%",
  boxSizing: "border-box",
};
const Input = (props) => (
  <input
    {...props}
    disabled={props.disabled || READ_ONLY}
    style={{ ...inputStyle, ...(props.style || {}) }}
  />
);
const TextArea = (props) => (
  <textarea
    {...props}
    disabled={props.disabled || READ_ONLY}
    style={{
      ...inputStyle,
      resize: "vertical",
      minHeight: 60,
      ...(props.style || {}),
    }}
  />
);
const Select = ({ children, ...props }) => (
  <select
    {...props}
    disabled={props.disabled || READ_ONLY}
    style={{ ...inputStyle, ...(props.style || {}) }}
  >
    {children}
  </select>
);

function Modal({ open, onClose, title, children, width = 640, footer }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.45)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        overflowY: "auto",
      }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "100%",
          maxWidth: width,
          boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
          border: "1px solid #e2e7ee",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: "1px solid #edf0f4",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 700,
              color: "#0f2a52",
            }}
          >
            {title}
          </h2>
          <IconBtn icon={X} label="Close" onClick={onClose} />
        </div>
        <div style={{ padding: 20, maxHeight: "70vh", overflowY: "auto" }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: "14px 20px",
              borderTop: "1px solid #edf0f4",
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Delete",
  danger = true,
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      width={420}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p style={{ margin: 0, color: "#334155", fontSize: 14, lineHeight: 1.5 }}>
        {message}
      </p>
    </Modal>
  );
}

let toastId = 0;
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, tone = "success") => {
    const id = ++toastId;
    setToasts((t) => [...t, { id, message, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  const ToastHost = () => (
    <div
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 2000,
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            background:
              t.tone === "error"
                ? "#a3271f"
                : t.tone === "info"
                ? "#0f2a52"
                : "#1a7f4b",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: 8,
            fontSize: 13.5,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
            maxWidth: 340,
          }}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
  return { push, ToastHost };
}

/* ============================================================
   KPI CARD
   ============================================================ */
const KPICard = ({ label, value, sub, tone = "navy", icon: Icon }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #e2e7ee",
      borderRadius: 10,
      padding: "14px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      minWidth: 0,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: "#64748b",
        fontSize: 12,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      {Icon && <Icon size={14} />} {label}
    </div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 800,
        color: "#0f2a52",
        lineHeight: 1.1,
      }}
    >
      {value}
    </div>
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
        setData({
          ...defaultData(),
          ...loaded,
          settings: { ...DEFAULT_SETTINGS, ...(loaded.settings || {}) },
        });
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
    saveTimer.current = setTimeout(() => {
      doSave();
    }, data.settings.autosaveDelayMs || 1200);
    return () => clearTimeout(saveTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        doSave(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.getElementById("global-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const doSave = useCallback(
    async (manual = false) => {
      setSaving(true);
      setData((prev) => {
        const next = { ...prev, lastSaved: new Date().toISOString() };
        savePersisted(next).then((ok) => {
          setSaving(false);
          setDirty(false);
          if (manual)
            push(
              ok ? "Saved successfully" : "Save failed — check storage",
              ok ? "success" : "error"
            );
        });
        return next;
      });
    },
    [push]
  );

  const update = useCallback((mutator) => {
    setData((prev) => {
      const next = typeof mutator === "function" ? mutator(prev) : mutator;
      return next;
    });
  }, []);

  const log = useCallback(
    (entry) => {
      update((prev) => ({
        ...prev,
        activityLog: [
          {
            id: uid("LOG"),
            date: new Date().toISOString(),
            user: prev.settings.userDisplayName,
            ...entry,
          },
          ...prev.activityLog,
        ].slice(0, 500),
      }));
    },
    [update]
  );

  if (loading || !data) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#64748b",
        }}
      >
        Loading Objective 5 workspace…
      </div>
    );
  }

  return (
    <AppShell
      data={data}
      update={update}
      log={log}
      dirty={dirty}
      saving={saving}
      onSave={() => doSave(true)}
      search={search}
      setSearch={setSearch}
      drawer={drawer}
      setDrawer={setDrawer}
      confirmState={confirmState}
      setConfirmState={setConfirmState}
      importState={importState}
      setImportState={setImportState}
      fileInputRef={fileInputRef}
      push={push}
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
  { id: "initiatives", label: "Initiatives", icon: ListChecks },
  { id: "kpi", label: "KPI Performance", icon: LineChartIcon },
  { id: "alignments", label: "Alignments", icon: Users },
  { id: "risks", label: "Risks & Dependencies", icon: ShieldAlert },
  { id: "log", label: "Activity Log", icon: History },
  { id: "settings", label: "Settings & Data", icon: SettingsIcon },
];

function AppShell({
  data,
  update,
  log,
  dirty,
  saving,
  onSave,
  search,
  setSearch,
  drawer,
  setDrawer,
  confirmState,
  setConfirmState,
  importState,
  setImportState,
  fileInputRef,
  push,
  children,
}) {
  const activeTab = data.ui.activeTab || "overview";
  const setActiveTab = (id) =>
    update((p) => ({ ...p, ui: { ...p.ui, activeTab: id } }));
  const [navCollapsed, setNavCollapsed] = useState(false);

  const activeInitiatives = data.initiatives.filter((i) => !i.archived);
  const activeRisks = data.risks;
  const health = computeObjectiveHealth(
    activeInitiatives,
    data.activities,
    activeRisks,
    data.kpiResults,
    data.settings.riskThresholds
  );

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `objective5-backup-${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    push("Exported JSON backup");
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        background: "#f4f6f9",
        minHeight: "100vh",
        color: "#1c2733",
      }}
    >
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
        <aside
          className="no-print"
          style={{
            width: navCollapsed ? 64 : 236,
            flexShrink: 0,
            background: "#0f2a52",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.15s ease",
            position: "sticky",
            top: 0,
            height: "100vh",
          }}
        >
          <div
            style={{
              padding: navCollapsed ? "18px 12px" : "20px 18px",
              borderBottom: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {!navCollapsed && (
              <>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: 1,
                    color: "#93a6c9",
                    fontWeight: 700,
                  }}
                >
                  BA STRATEGY 2026
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>
                  Objective 5
                </div>
                <div style={{ fontSize: 12, color: "#c4d0e5" }}>
                  Delivery Excellence
                </div>
              </>
            )}
            {navCollapsed && (
              <div
                style={{ fontSize: 18, fontWeight: 800, textAlign: "center" }}
              >
                O5
              </div>
            )}
          </div>
          <nav
            style={{
              flex: 1,
              padding: "10px 8px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                aria-current={activeTab === t.id ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 8,
                  border: "none",
                  background:
                    activeTab === t.id
                      ? "rgba(255,255,255,0.14)"
                      : "transparent",
                  color: activeTab === t.id ? "#fff" : "#c4d0e5",
                  fontSize: 13.5,
                  fontWeight: 600,
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <t.icon size={16} />
                <span className="app-nav-labels">
                  {navCollapsed ? "" : t.label}
                </span>
              </button>
            ))}
          </nav>
          <div style={{ padding: 10 }}>
            <button
              onClick={() => setNavCollapsed((v) => !v)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "transparent",
                color: "#c4d0e5",
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              {navCollapsed ? "»" : "« Collapse"}
            </button>
          </div>
        </aside>

        {/* Main */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <header
            className="no-print"
            style={{
              background: "#fff",
              borderBottom: "1px solid #e2e7ee",
              padding: "14px 24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              position: "sticky",
              top: 0,
              zIndex: 50,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#8592a3",
                  letterSpacing: 0.3,
                }}
              >
                OBJECTIVE 5 — STREAM 1: DRIVE THE VALUE
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0f2a52" }}>
                "Deliver on time and on client expectation, every time."
                <span style={{ marginLeft: 10 }}>
                  <Badge tone="navy">
                    Owner: {data.settings.objectiveOwner}
                  </Badge>
                </span>
              </div>
            </div>
            <div style={{ position: "relative", width: 260 }}>
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: 10,
                  top: 9,
                  color: "#8592a3",
                }}
              />
              <input
                id="global-search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search everything… (Ctrl+K)"
                style={{ ...inputStyle, paddingLeft: 30, fontSize: 13 }}
              />
            </div>
            <Badge
              tone={
                {
                  "On Track": "green",
                  "Attention Required": "amber",
                  "At Risk": "amber",
                  Delayed: "red",
                  Completed: "green",
                }[health]
              }
            >
              <Circle
                size={8}
                fill={healthColor(health)}
                color={healthColor(health)}
              />{" "}
              {health}
            </Badge>
            {READ_ONLY ? (
              <Badge tone="navy">View only</Badge>
            ) : (
              <>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#8592a3",
                    textAlign: "right",
                    minWidth: 120,
                  }}
                >
                  {saving
                    ? "Saving…"
                    : dirty
                    ? "Unsaved changes"
                    : `Saved ${
                        data.lastSaved ? fmtDateTime(data.lastSaved) : "never"
                      }`}
                </div>
                <Button variant="secondary" icon={Save} onClick={onSave}>
                  Save
                </Button>
              </>
            )}
          </header>

          <main
            style={{
              flex: 1,
              padding: "22px 26px",
              maxWidth: 1500,
              width: "100%",
              margin: "0 auto",
            }}
          >
            {search.trim() ? (
              <GlobalSearchResults
                data={data}
                query={search}
                onClear={() => setSearch("")}
                setDrawer={setDrawer}
                setActiveTab={setActiveTab}
              />
            ) : (
              <>
                {activeTab === "overview" && (
                  <OverviewTab
                    data={data}
                    update={update}
                    log={log}
                    health={health}
                    setActiveTab={setActiveTab}
                    exportJSON={exportJSON}
                    setDrawer={setDrawer}
                  />
                )}
                {activeTab === "timeline" && (
                  <TimelineTab
                    data={data}
                    update={update}
                    log={log}
                    drawer={drawer}
                    setDrawer={setDrawer}
                    push={push}
                    confirmState={confirmState}
                    setConfirmState={setConfirmState}
                  />
                )}
                {activeTab === "initiatives" && (
                  <InitiativesTab
                    data={data}
                    update={update}
                    log={log}
                    drawer={drawer}
                    setDrawer={setDrawer}
                    push={push}
                    confirmState={confirmState}
                    setConfirmState={setConfirmState}
                  />
                )}
                {activeTab === "kpi" && (
                  <KPITab data={data} update={update} log={log} push={push} />
                )}
                {activeTab === "alignments" && (
                  <AlignmentsTab
                    data={data}
                    update={update}
                    log={log}
                    drawer={drawer}
                    setDrawer={setDrawer}
                    push={push}
                  />
                )}
                {activeTab === "risks" && (
                  <RisksTab
                    data={data}
                    update={update}
                    log={log}
                    drawer={drawer}
                    setDrawer={setDrawer}
                    push={push}
                    confirmState={confirmState}
                    setConfirmState={setConfirmState}
                  />
                )}
                {activeTab === "log" && <ActivityLogTab data={data} />}
                {activeTab === "settings" && (
                  <SettingsTab
                    data={data}
                    update={update}
                    push={push}
                    exportJSON={exportJSON}
                    fileInputRef={fileInputRef}
                    importState={importState}
                    setImportState={setImportState}
                    log={log}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {confirmState && (
        <ConfirmDialog
          open={!!confirmState}
          title={confirmState.title}
          message={confirmState.message}
          confirmLabel={confirmState.confirmLabel}
          onConfirm={() => {
            confirmState.onConfirm();
            setConfirmState(null);
          }}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </div>
  );
}

/* ============================================================
   GLOBAL SEARCH
   ============================================================ */
function GlobalSearchResults({
  data,
  query,
  onClear,
  setDrawer,
  setActiveTab,
}) {
  const q = query.toLowerCase();
  const matches = (obj, fields) =>
    fields.some((f) =>
      String(obj[f] || "")
        .toLowerCase()
        .includes(q)
    );
  const initiatives = data.initiatives.filter((i) =>
    matches(i, ["name", "description", "owner", "notes", "latestUpdate"])
  );
  const activities = data.activities.filter((a) =>
    matches(a, ["name", "description", "owner", "notes"])
  );
  const risks = data.risks.filter((r) =>
    matches(r, ["title", "description", "notes"])
  );
  const alignments = data.alignments.filter((a) =>
    matches(a, ["counterpart", "topic", "notes", "agreedActions"])
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 17, color: "#0f2a52" }}>
          Search results for "{query}"
        </h2>
        <Button variant="secondary" onClick={onClear}>
          Clear search
        </Button>
      </div>
      {[
        ["Initiatives", initiatives, "initiatives"],
        ["Activities", activities, "timeline"],
        ["Risks & Dependencies", risks, "risks"],
        ["Alignments", alignments, "alignments"],
      ].map(([label, list, tab]) => (
        <div key={label} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 13,
              color: "#64748b",
              marginBottom: 6,
              textTransform: "uppercase",
            }}
          >
            {label} ({list.length})
          </div>
          {list.length === 0 && (
            <div style={{ fontSize: 13, color: "#94a3b8" }}>No matches.</div>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {list.slice(0, 10).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(tab);
                }}
                style={{
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e7ee",
                  background: "#fff",
                  cursor: "pointer",
                  fontSize: 13.5,
                  color: "#1c2733",
                }}
              >
                {item.name || item.title || item.counterpart}
              </button>
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
function OverviewTab({
  data,
  update,
  log,
  health,
  setActiveTab,
  exportJSON,
  setDrawer,
}) {
  const initiatives = data.initiatives.filter((i) => !i.archived);
  const overallProgress = initiatives.length
    ? Math.round(
        initiatives.reduce((s, i) => s + clampProgress(i.progress), 0) /
          initiatives.length
      )
    : 0;
  const completed = initiatives.filter((i) => i.status === "Completed").length;
  const delayed = initiatives.filter((i) => i.status === "Delayed").length;
  const atRisk = initiatives.filter((i) => i.status === "At Risk").length;
  const overdueActs = data.activities.filter(isOverdue);
  const openDeps = data.risks.filter(
    (r) => r.type === "Dependency" && r.status !== "Completed"
  ).length;
  const overdueAlignActions = data.alignments.filter(
    (a) =>
      a.dueDate &&
      new Date(a.dueDate) < new Date(todayISO()) &&
      a.completionStatus !== "Completed"
  ).length;

  const latestKpiFor = (metric) => {
    const rows = data.kpiResults
      .filter((r) => r.metric === metric)
      .sort((a, b) => b.reportingPeriod.localeCompare(a.reportingPeriod));
    return rows[0];
  };
  const dei = latestKpiFor("Delivery Excellence Index");
  const otd = latestKpiFor("5.1 On-Time Delivery Rate");
  const fra = latestKpiFor("5.2 First-Review Acceptance Rate");

  const milestones = data.activities
    .filter((a) => a.milestone)
    .sort((a, b) => (a.plannedStart || "").localeCompare(b.plannedStart || ""));
  const upcomingMilestone = milestones.find((m) => m.status !== "Completed");
  const mostUrgentBlocker =
    data.activities.find((a) => a.blocker) ||
    data.risks.find((r) => r.status === "Open" && r.type === "Issue");
  const latestUpdate = [...data.activityLog].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  )[0];

  // Progress bar against the actual Objective 5 delivery plan (26 Jul 2026 – 22 Jul 2027)
  const planStart = new Date(OBJECTIVE5_QUARTERS[0].start);
  const planEnd = new Date(
    OBJECTIVE5_QUARTERS[OBJECTIVE5_QUARTERS.length - 1].end
  );
  const now = new Date();
  const planTotalDays = daysBetween(planStart, planEnd);
  const elapsedDays = Math.max(
    0,
    Math.min(planTotalDays, daysBetween(planStart, now))
  );
  const quarterProgressPct =
    now < planStart ? 0 : Math.round((elapsedDays / planTotalDays) * 100);
  const activeQ = OBJECTIVE5_QUARTERS.find(
    (q) => now >= new Date(q.start) && now <= new Date(q.end)
  );
  const currentQuarter =
    now < planStart
      ? "Before plan start (26 Jul 2026)"
      : activeQ
      ? `${activeQ.label} (${activeQ.range})`
      : "After plan end";

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
      <div
        style={{
          background: "linear-gradient(135deg,#0f2a52,#173a6b)",
          borderRadius: 14,
          padding: "22px 26px",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "#a9bcdd",
          }}
        >
          OBJECTIVE STATEMENT
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, marginTop: 4 }}>
          "Deliver on time and on client expectation, every time."
        </div>
        <div style={{ fontSize: 13.5, marginTop: 8, color: "#c4d0e5" }}>
          "Predictable delivery means less firefighting and more trust."
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              flex: 1,
              height: 8,
              background: "rgba(255,255,255,0.18)",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${quarterProgressPct}%`,
                height: "100%",
                background: "#7ea3e0",
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: "#c4d0e5" }}>
            {currentQuarter} · Q1 → Q4 2026
          </span>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 12,
        }}
      >
        <KPICard
          label="Objective Progress"
          value={`${overallProgress}%`}
          sub="Average of initiative progress"
        />
        <KPICard
          label="Delivery Excellence Index"
          value={dei ? `${dei.calculatedPct}%` : "No data"}
          sub={dei ? `Target ${dei.target}%` : "Not yet measured"}
        />
        <KPICard
          label="On-Time Delivery Rate"
          value={otd ? `${otd.calculatedPct}%` : "No data"}
          sub={otd ? `Target ${otd.target}%` : "Not yet measured"}
        />
        <KPICard
          label="First-Review Acceptance"
          value={fra ? `${fra.calculatedPct}%` : "No data"}
          sub={fra ? `Target ${fra.target}%` : "Not yet measured"}
        />
        <KPICard label="Total Initiatives" value={initiatives.length} />
        <KPICard label="Completed Initiatives" value={completed} />
        <KPICard label="Delayed Initiatives" value={delayed} tone="red" />
        <KPICard label="At-Risk Initiatives" value={atRisk} tone="amber" />
        <KPICard label="Open Dependencies" value={openDeps} />
        <KPICard
          label="Overdue Alignment Actions"
          value={overdueAlignActions}
        />
        <KPICard label="Overdue Activities" value={overdueActs.length} />
        <KPICard
          label="Last Saved"
          value={
            data.lastSaved
              ? fmtDateTime(data.lastSaved).split(" ").slice(0, 2).join(" ")
              : "—"
          }
          sub={data.lastSaved ? fmtDateTime(data.lastSaved) : "Not saved yet"}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e7ee",
            borderRadius: 12,
            padding: 18,
          }}
        >
          <div style={{ fontWeight: 700, color: "#0f2a52", marginBottom: 10 }}>
            Initiative Progress Summary
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {initiatives.map((i) => (
              <div key={i.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 13,
                    marginBottom: 4,
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    {i.id} · {i.name}
                  </span>
                  <span style={{ color: "#64748b" }}>
                    {i.progress}% ·{" "}
                    <Badge tone={statusTone(i.status)}>{i.status}</Badge>
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    background: "#eef1f5",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${clampProgress(i.progress)}%`,
                      height: "100%",
                      background: "#0f2a52",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e7ee",
            borderRadius: 12,
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 700, color: "#0f2a52" }}>Snapshot</div>
          <div style={{ fontSize: 13 }}>
            <strong>Upcoming milestone:</strong>{" "}
            {upcomingMilestone
              ? `${upcomingMilestone.name} (${fmtDate(
                  upcomingMilestone.plannedStart
                )})`
              : "None scheduled"}
          </div>
          <div style={{ fontSize: 13 }}>
            <strong>Most urgent blocker:</strong>{" "}
            {mostUrgentBlocker
              ? mostUrgentBlocker.blocker || mostUrgentBlocker.title
              : "None recorded"}
          </div>
          <div style={{ fontSize: 13 }}>
            <strong>Latest update:</strong>{" "}
            {latestUpdate
              ? `${latestUpdate.action} — ${latestUpdate.recordName}`
              : "No activity yet"}
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div style={{ fontWeight: 700, color: "#0f2a52", marginBottom: 12 }}>
          Quick Actions
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Button
            variant="secondary"
            icon={Plus}
            onClick={() => quickAction("activity")}
          >
            Add activity
          </Button>
          <Button
            variant="secondary"
            icon={Flag}
            onClick={() => quickAction("milestone")}
          >
            Add milestone
          </Button>
          <Button
            variant="secondary"
            icon={LineChartIcon}
            onClick={() => quickAction("kpi")}
          >
            Record KPI result
          </Button>
          <Button
            variant="secondary"
            icon={ShieldAlert}
            onClick={() => quickAction("risk")}
          >
            Add risk
          </Button>
          <Button
            variant="secondary"
            icon={Users}
            onClick={() => quickAction("alignment")}
          >
            Add alignment meeting
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() => quickAction("export")}
          >
            Export report
          </Button>
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
  const clampDays = (s, e) =>
    Math.max(
      1,
      daysBetween(s < rangeStart ? rangeStart : s, e > rangeEnd ? rangeEnd : e)
    );

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
        sub: wStart.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        days: clampDays(wStart, wEnd),
      });
      cur.setDate(cur.getDate() + 7);
      n++;
    }
    return cols;
  }

  // Quarterly (default)
  return OBJECTIVE5_QUARTERS.map((q) => ({
    key: q.label,
    label: q.label,
    sub: q.range,
    days: clampDays(new Date(q.start), new Date(q.end)),
  }));
}

function quarterOfDate(iso) {
  const d = new Date(iso);
  const m = d.getMonth();
  return `Q${Math.floor(m / 3) + 1} ${d.getFullYear()}`;
}

function TimelineTab({
  data,
  update,
  log,
  drawer,
  setDrawer,
  push,
  confirmState,
  setConfirmState,
}) {
  const [view, setView] = useState(data.ui.timelineView || "Quarterly");
  const [collapsed, setCollapsed] = useState({});
  const [dragState, setDragState] = useState(null);
  const [rowDragId, setRowDragId] = useState(null);
  const [rowDragOverId, setRowDragOverId] = useState(null);
  const containerRef = useRef(null);

  const rangeStart = new Date(OBJECTIVE5_QUARTERS[0].start);
  const rangeEnd = new Date(
    OBJECTIVE5_QUARTERS[OBJECTIVE5_QUARTERS.length - 1].end
  );
  const totalDays = daysBetween(rangeStart, rangeEnd);

  const setTimelineView = (v) => {
    setView(v);
    update((p) => ({ ...p, ui: { ...p.ui, timelineView: v } }));
  };

  const initiatives = data.initiatives
    .filter((i) => !i.archived)
    .sort((a, b) => a.order - b.order);

  const dayToPct = (iso) => {
    if (!iso) return 0;
    const d = new Date(iso);
    return Math.max(
      0,
      Math.min(100, (daysBetween(rangeStart, d) / totalDays) * 100)
    );
  };

  // ---- Reordering (up/down arrows + drag-and-drop) within same initiative + same parent group ----
  const siblingsOf = (act) =>
    data.activities
      .filter(
        (a) =>
          a.initiativeId === act.initiativeId &&
          (a.parentActivityId || null) === (act.parentActivityId || null)
      )
      .sort((a, b) => a.order - b.order);

  const applyOrder = (act, orderedIds) => {
    const orderMap = new Map(orderedIds.map((id, i) => [id, i]));
    update((p) => ({
      ...p,
      activities: p.activities.map((a) =>
        a.initiativeId === act.initiativeId &&
        (a.parentActivityId || null) === (act.parentActivityId || null) &&
        orderMap.has(a.id)
          ? { ...a, order: orderMap.get(a.id) }
          : a
      ),
    }));
    log({
      action: "Edited",
      recordType: "Activity",
      recordName: act.name,
      previousValue: "",
      newValue: "Reordered",
    });
  };

  const moveActivity = (act, direction) => {
    const ids = siblingsOf(act).map((s) => s.id);
    const idx = ids.indexOf(act.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= ids.length) return;
    [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
    applyOrder(act, ids);
  };

  const dropReorder = (draggedId, targetAct) => {
    if (!draggedId || draggedId === targetAct.id) return;
    const dragged = data.activities.find((a) => a.id === draggedId);
    if (!dragged) return;
    if (
      dragged.initiativeId !== targetAct.initiativeId ||
      (dragged.parentActivityId || null) !==
        (targetAct.parentActivityId || null)
    ) {
      push(
        "You can only reorder within the same initiative and task level.",
        "error"
      );
      return;
    }
    let ids = siblingsOf(targetAct)
      .map((s) => s.id)
      .filter((id) => id !== draggedId);
    const targetIdx = ids.indexOf(targetAct.id);
    ids.splice(targetIdx, 0, draggedId);
    applyOrder(targetAct, ids);
  };

  const saveActivity = (updated) => {
    update((p) => ({
      ...p,
      activities: p.activities.map((a) => (a.id === updated.id ? updated : a)),
    }));
    log({
      action: "Edited",
      recordType: "Activity",
      recordName: updated.name,
      previousValue: "",
      newValue: "Dates/details updated",
    });
  };

  const onMouseDownDrag = (e, activity, mode) => {
    if (READ_ONLY) return; // no rescheduling in view mode
    e.stopPropagation();
    const rect = containerRef.current.getBoundingClientRect();
    setDragState({
      id: activity.id,
      mode,
      startX: e.clientX,
      origStart: activity.plannedStart,
      origEnd: activity.plannedEnd,
      containerWidth: rect.width,
    });
  };

  useEffect(() => {
    if (!dragState) return;
    const onMove = (e) => {
      const deltaPx = e.clientX - dragState.startX;
      const deltaDays = Math.round(
        (deltaPx / dragState.containerWidth) * totalDays
      );
      update((p) => ({
        ...p,
        activities: p.activities.map((a) => {
          if (a.id !== dragState.id) return a;
          let ns = new Date(dragState.origStart),
            ne = new Date(dragState.origEnd);
          if (dragState.mode === "move") {
            ns.setDate(ns.getDate() + deltaDays);
            ne.setDate(ne.getDate() + deltaDays);
          } else if (dragState.mode === "resize-left") {
            ns.setDate(ns.getDate() + deltaDays);
            if (ns >= ne) return a;
          } else if (dragState.mode === "resize-right") {
            ne.setDate(ne.getDate() + deltaDays);
            if (ne <= ns) return a;
          }
          return {
            ...a,
            plannedStart: ns.toISOString().slice(0, 10),
            plannedEnd: ne.toISOString().slice(0, 10),
          };
        }),
      }));
    };
    const onUp = () => {
      setDragState(null);
      update((p) => ({ ...p }));
      log({
        action: "Edited",
        recordType: "Activity",
        recordName: "Timeline reschedule",
        previousValue: "",
        newValue: "Dates changed via drag",
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
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
    view === "Monthly"
      ? columns.length * 90
      : view === "Weekly"
      ? columns.length * 46
      : 0;
  const innerMinWidth = chartMinWidth ? LABEL_W + chartMinWidth : undefined;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {["Quarterly", "Monthly", "Weekly", "List"].map((v) => (
            <button
              key={v}
              onClick={() => setTimelineView(v)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: "1px solid #d7dde5",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: view === v ? "#0f2a52" : "#fff",
                color: view === v ? "#fff" : "#334155",
              }}
            >
              {v}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            variant="secondary"
            icon={Flag}
            onClick={() =>
              setDrawer({
                type: "activity-new",
                initiativeId: initiatives[0]?.id,
                milestone: true,
              })
            }
          >
            Add milestone
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() =>
              setDrawer({
                type: "activity-new",
                initiativeId: initiatives[0]?.id,
              })
            }
          >
            Add activity
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          fontSize: 12,
          color: "#64748b",
          marginBottom: 10,
          flexWrap: "wrap",
        }}
      >
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
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e7ee",
            borderRadius: 12,
            overflowX: "auto",
            overflowY: "hidden",
          }}
        >
          <div style={{ minWidth: innerMinWidth }}>
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid #e2e7ee",
                background: "#f7f8fa",
              }}
            >
              <div
                style={{
                  width: LABEL_W,
                  flexShrink: 0,
                  padding: "10px 14px",
                  fontWeight: 700,
                  fontSize: 12,
                  color: "#64748b",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                  background: "#f7f8fa",
                }}
              >
                INITIATIVE / ACTIVITY
              </div>
              <div
                ref={containerRef}
                style={{
                  flex: 1,
                  position: "relative",
                  padding: "10px 0",
                  display: "flex",
                }}
              >
                {columns.map((c) => (
                  <div
                    key={c.key}
                    title={c.sub}
                    style={{
                      flex: c.days,
                      minWidth: 0,
                      textAlign: "center",
                      fontSize: view === "Weekly" ? 10.5 : 12,
                      fontWeight: 700,
                      color: "#64748b",
                      borderLeft: "1px solid #e2e7ee",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.label}
                    <div
                      style={{
                        fontSize: view === "Quarterly" ? 10 : 9.5,
                        fontWeight: 500,
                        color: "#94a3b8",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {c.sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {initiatives.map((init) => {
              const acts = data.activities
                .filter(
                  (a) => a.initiativeId === init.id && !a.parentActivityId
                )
                .sort((a, b) => a.order - b.order);
              const isCollapsed = collapsed[init.id];
              return (
                <div key={init.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: "#eef1f5",
                      borderBottom: "1px solid #e2e7ee",
                    }}
                  >
                    <button
                      onClick={() =>
                        setCollapsed((c) => ({ ...c, [init.id]: !c[init.id] }))
                      }
                      style={{
                        width: LABEL_W,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "9px 14px",
                        border: "none",
                        background: "#eef1f5",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: 13,
                        color: "#0f2a52",
                        textAlign: "left",
                        position: "sticky",
                        left: 0,
                        zIndex: 2,
                      }}
                    >
                      {isCollapsed ? (
                        <ChevronRight size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}{" "}
                      {init.id} · {init.name}
                    </button>
                    <div
                      style={{
                        flex: 1,
                        padding: "9px 14px",
                        fontSize: 12,
                        color: "#64748b",
                      }}
                    >
                      {init.owner} · {init.progress}% complete
                    </div>
                  </div>
                  {!isCollapsed &&
                    acts.map((act, actIdx) => {
                      const subtasks = data.activities
                        .filter((a) => a.parentActivityId === act.id)
                        .sort((a, b) => a.order - b.order);
                      const rowKey = "row-" + act.id;
                      const subCollapsed = collapsed[rowKey];
                      return (
                        <div key={act.id}>
                          <TimelineRow
                            activity={act}
                            dayToPct={dayToPct}
                            onMouseDownDrag={onMouseDownDrag}
                            onClick={() =>
                              setDrawer({ type: "activity", id: act.id })
                            }
                            isPrimary
                            hasSubtasks={subtasks.length > 0}
                            subCollapsed={subCollapsed}
                            onToggleSub={() =>
                              setCollapsed((c) => ({
                                ...c,
                                [rowKey]: !c[rowKey],
                              }))
                            }
                            onAddSubtask={() =>
                              setDrawer({
                                type: "activity-new",
                                initiativeId: init.id,
                                parentActivityId: act.id,
                              })
                            }
                            canMoveUp={actIdx > 0}
                            canMoveDown={actIdx < acts.length - 1}
                            onMoveUp={() => moveActivity(act, "up")}
                            onMoveDown={() => moveActivity(act, "down")}
                            isRowDragging={rowDragId === act.id}
                            isRowDragOver={rowDragOverId === act.id}
                            onRowDragStart={() => setRowDragId(act.id)}
                            onRowDragOver={(e) => {
                              e.preventDefault();
                              setRowDragOverId(act.id);
                            }}
                            onRowDrop={() => {
                              dropReorder(rowDragId, act);
                              setRowDragId(null);
                              setRowDragOverId(null);
                            }}
                            onRowDragEnd={() => {
                              setRowDragId(null);
                              setRowDragOverId(null);
                            }}
                          />
                          {!subCollapsed &&
                            subtasks.map((st, stIdx) => (
                              <TimelineRow
                                key={st.id}
                                activity={st}
                                dayToPct={dayToPct}
                                onMouseDownDrag={onMouseDownDrag}
                                onClick={() =>
                                  setDrawer({ type: "activity", id: st.id })
                                }
                                indent
                                canMoveUp={stIdx > 0}
                                canMoveDown={stIdx < subtasks.length - 1}
                                onMoveUp={() => moveActivity(st, "up")}
                                onMoveDown={() => moveActivity(st, "down")}
                                isRowDragging={rowDragId === st.id}
                                isRowDragOver={rowDragOverId === st.id}
                                onRowDragStart={() => setRowDragId(st.id)}
                                onRowDragOver={(e) => {
                                  e.preventDefault();
                                  setRowDragOverId(st.id);
                                }}
                                onRowDrop={() => {
                                  dropReorder(rowDragId, st);
                                  setRowDragId(null);
                                  setRowDragOverId(null);
                                }}
                                onRowDragEnd={() => {
                                  setRowDragId(null);
                                  setRowDragOverId(null);
                                }}
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
        <ActivityDrawer
          data={data}
          update={update}
          log={log}
          activityId={drawer.id}
          onClose={() => setDrawer(null)}
          push={push}
          confirmState={confirmState}
          setConfirmState={setConfirmState}
          setDrawer={setDrawer}
        />
      )}
      {drawer && drawer.type === "activity-new" && (
        <ActivityDrawer
          data={data}
          update={update}
          log={log}
          isNew
          initiativeId={drawer.initiativeId}
          milestone={drawer.milestone}
          parentActivityId={drawer.parentActivityId}
          onClose={() => setDrawer(null)}
          push={push}
          setDrawer={setDrawer}
        />
      )}
    </div>
  );
}

const LegendDot = ({ color, label, shape }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
    <span
      style={{
        width: 10,
        height: 10,
        background: color,
        borderRadius: shape === "diamond" ? 2 : 999,
        transform: shape === "diamond" ? "rotate(45deg)" : "none",
      }}
    />
    {label}
  </span>
);

function TimelineRow({
  activity,
  dayToPct,
  onMouseDownDrag,
  onClick,
  isPrimary,
  hasSubtasks,
  subCollapsed,
  onToggleSub,
  onAddSubtask,
  indent,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  isRowDragging,
  isRowDragOver,
  onRowDragStart,
  onRowDragOver,
  onRowDrop,
  onRowDragEnd,
}) {
  const left = dayToPct(activity.plannedStart);
  const right = dayToPct(activity.plannedEnd);
  const width = Math.max(right - left, activity.milestone ? 0 : 1);
  const overdue = isOverdue(activity);
  let color = "#0f2a52";
  if (activity.status === "Completed") color = "#1a7f4b";
  else if (
    overdue ||
    activity.status === "Delayed" ||
    activity.status === "At Risk"
  )
    color = "#a3271f";
  else if (activity.recurring) color = "#4c2f8a";
  const reorderable = !READ_ONLY && !!(onMoveUp || onMoveDown);

  return (
    <div
      draggable={reorderable}
      onDragStart={reorderable ? onRowDragStart : undefined}
      onDragOver={reorderable ? onRowDragOver : undefined}
      onDrop={
        reorderable
          ? (e) => {
              e.preventDefault();
              onRowDrop && onRowDrop();
            }
          : undefined
      }
      onDragEnd={reorderable ? onRowDragEnd : undefined}
      style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #f0f2f5",
        background: isRowDragOver
          ? "#e9edf5"
          : indent
          ? "#fafbfc"
          : "transparent",
        opacity: isRowDragging ? 0.4 : 1,
        borderTop: isRowDragOver
          ? "2px solid #0f2a52"
          : "1px solid transparent",
      }}
    >
      <div
        style={{
          width: 300,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          position: "sticky",
          left: 0,
          zIndex: 1,
          background: isRowDragOver ? "#e9edf5" : indent ? "#fafbfc" : "#fff",
        }}
      >
        {reorderable && (
          <span
            title="Drag to reorder"
            style={{
              cursor: "grab",
              color: "#b7c1cf",
              display: "flex",
              padding: "8px 0 8px 6px",
            }}
          >
            <GripVertical size={13} />
          </span>
        )}
        {reorderable && (
          <span style={{ display: "flex", flexDirection: "column" }}>
            <button
              onClick={onMoveUp}
              disabled={!canMoveUp}
              aria-label="Move up"
              title="Move up"
              style={{
                border: "none",
                background: "transparent",
                cursor: canMoveUp ? "pointer" : "not-allowed",
                color: canMoveUp ? "#64748b" : "#d7dde5",
                padding: "0 2px",
                lineHeight: 0,
              }}
            >
              <ChevronUp size={12} />
            </button>
            <button
              onClick={onMoveDown}
              disabled={!canMoveDown}
              aria-label="Move down"
              title="Move down"
              style={{
                border: "none",
                background: "transparent",
                cursor: canMoveDown ? "pointer" : "not-allowed",
                color: canMoveDown ? "#64748b" : "#d7dde5",
                padding: "0 2px",
                lineHeight: 0,
              }}
            >
              <ChevronDown size={12} />
            </button>
          </span>
        )}
        {hasSubtasks && (
          <button
            onClick={onToggleSub}
            aria-label={
              subCollapsed ? "Expand sub-tasks" : "Collapse sub-tasks"
            }
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              padding: "8px 0 8px 6px",
              color: "#64748b",
            }}
          >
            {subCollapsed ? (
              <ChevronRight size={12} />
            ) : (
              <ChevronDown size={12} />
            )}
          </button>
        )}
        <button
          onClick={onClick}
          style={{
            flex: 1,
            textAlign: "left",
            padding: `8px 8px 8px ${indent ? 24 : hasSubtasks ? 4 : 10}px`,
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: indent ? 12 : 12.5,
            color: indent ? "#64748b" : "#334155",
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontWeight: isPrimary ? 600 : 400,
          }}
        >
          {activity.milestone ? (
            <Flag size={12} color="#0f2a52" />
          ) : (
            <Circle size={6} fill={color} color={color} />
          )}
          <span
            style={{
              textDecoration:
                activity.status === "Completed" ? "line-through" : "none",
            }}
          >
            {activity.name}
          </span>
          {overdue && (
            <AlertTriangle size={12} color="#a3271f" aria-label="Overdue" />
          )}
        </button>
        {!READ_ONLY && isPrimary && onAddSubtask && !activity.milestone && (
          <button
            onClick={onAddSubtask}
            aria-label="Add sub-task"
            title="Add sub-task"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              color: "#8592a3",
              padding: "8px 8px 8px 0",
            }}
          >
            <Plus size={13} />
          </button>
        )}
      </div>
      <div style={{ flex: 1, position: "relative", height: 30 }}>
        {activity.milestone ? (
          <div
            title={`${activity.name} — ${fmtDate(activity.plannedStart)}`}
            style={{
              position: "absolute",
              left: `${left}%`,
              top: "50%",
              transform: "translate(-50%,-50%) rotate(45deg)",
              width: 12,
              height: 12,
              background: color,
              cursor: "pointer",
            }}
            onClick={onClick}
          />
        ) : (
          <div
            title={`${activity.name}\nPlanned: ${fmtDate(
              activity.plannedStart
            )} → ${fmtDate(activity.plannedEnd)}\nStatus: ${
              activity.status
            } · ${activity.progress}%`}
            style={{
              position: "absolute",
              left: `${left}%`,
              width: `${width}%`,
              top: "50%",
              transform: "translateY(-50%)",
              height: indent ? 14 : 18,
              borderRadius: 5,
              background: color,
              opacity: indent ? 0.7 : 0.85,
              cursor: "grab",
              display: "flex",
              alignItems: "center",
            }}
            onMouseDown={(e) => onMouseDownDrag(e, activity, "move")}
            onClick={onClick}
          >
            <div
              style={{
                width: `${clampProgress(activity.progress)}%`,
                height: "100%",
                background: "rgba(255,255,255,0.35)",
                borderRadius: 5,
              }}
            />
            <div
              onMouseDown={(e) => onMouseDownDrag(e, activity, "resize-left")}
              style={{
                position: "absolute",
                left: -3,
                top: 0,
                bottom: 0,
                width: 6,
                cursor: "ew-resize",
              }}
            />
            <div
              onMouseDown={(e) => onMouseDownDrag(e, activity, "resize-right")}
              style={{
                position: "absolute",
                right: -3,
                top: 0,
                bottom: 0,
                width: 6,
                cursor: "ew-resize",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ListView({ data, update, log, setDrawer }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {data.activities
        .slice()
        .sort((a, b) =>
          (a.plannedStart || "").localeCompare(b.plannedStart || "")
        )
        .map((a) => (
          <button
            key={a.id}
            onClick={() => setDrawer({ type: "activity", id: a.id })}
            style={{
              textAlign: "left",
              background: "#fff",
              border: "1px solid #e2e7ee",
              borderRadius: 10,
              padding: 14,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div
                style={{ fontWeight: 700, fontSize: 13.5, color: "#0f2a52" }}
              >
                {a.milestone ? "◆ " : ""}
                {a.name}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge tone={statusTone(a.status)}>{a.status}</Badge>
                {isOverdue(a) && <Badge tone="red">Overdue</Badge>}
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4 }}>
              {fmtDate(a.plannedStart)} → {fmtDate(a.plannedEnd)} · Owner:{" "}
              {a.owner} · Progress: {a.progress}%
            </div>
          </button>
        ))}
    </div>
  );
}

function ActivityDrawer({
  data,
  update,
  log,
  activityId,
  isNew,
  initiativeId,
  milestone,
  parentActivityId,
  onClose,
  push,
  confirmState,
  setConfirmState,
  setDrawer,
}) {
  const existing = !isNew
    ? data.activities.find((a) => a.id === activityId)
    : null;
  const [form, setForm] = useState(
    existing || {
      id: uid("ACT"),
      initiativeId: initiativeId || data.initiatives[0]?.id,
      name: "",
      description: "",
      owner: data.settings.objectiveOwner,
      support: [],
      plannedStart: todayISO(),
      plannedEnd: todayISO(),
      actualStart: "",
      actualEnd: "",
      status: "Not Started",
      priority: "Medium",
      progress: 0,
      dependencyType: "Finish-to-Start",
      predecessors: [],
      deliverable: "",
      milestone: !!milestone,
      recurring: false,
      recurrenceFrequency: "",
      blocker: "",
      risk: "",
      notes: "",
      evidence: "",
      lastUpdate: "",
      createdDate: todayISO(),
      updatedDate: todayISO(),
      order: data.activities.length,
      parentActivityId: parentActivityId || null,
    }
  );
  const [error, setError] = useState("");

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const primaryTasksInInitiative = data.activities.filter(
    (a) =>
      a.initiativeId === form.initiativeId &&
      !a.parentActivityId &&
      a.id !== form.id &&
      !a.milestone
  );
  const subtasksOfThis = !isNew
    ? data.activities.filter((a) => a.parentActivityId === form.id)
    : [];

  const validate = () => {
    if (!form.name.trim()) return "Activity name is required.";
    if (!form.initiativeId) return "Initiative is required.";
    if (new Date(form.plannedEnd) < new Date(form.plannedStart))
      return "Planned end cannot precede planned start.";
    if (
      form.actualStart &&
      form.actualEnd &&
      new Date(form.actualEnd) < new Date(form.actualStart)
    )
      return "Actual end cannot precede actual start.";
    if (form.progress < 0 || form.progress > 100)
      return "Progress must be between 0 and 100.";
    if (form.recurring && !form.recurrenceFrequency)
      return "Recurring activities require a recurrence frequency.";
    if (form.predecessors.includes(form.id))
      return "An activity cannot depend on itself.";
    if (form.parentActivityId === form.id)
      return "A task cannot be its own parent.";
    if (form.parentActivityId) {
      const parent = data.activities.find(
        (a) => a.id === form.parentActivityId
      );
      if (parent && parent.parentActivityId)
        return "A sub-task's parent must be a primary task (no nested sub-tasks).";
    }
    return "";
  };

  const save = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    const updated = { ...form, updatedDate: todayISO() };
    update((p) => {
      const exists = p.activities.some((a) => a.id === updated.id);
      return {
        ...p,
        activities: exists
          ? p.activities.map((a) => (a.id === updated.id ? updated : a))
          : [...p.activities, updated],
      };
    });
    log({
      action: isNew ? "Added" : "Edited",
      recordType: "Activity",
      recordName: updated.name,
      previousValue: "",
      newValue: isNew ? "Created" : "Updated",
    });
    push(isNew ? "Activity added" : "Activity updated");
    onClose();
  };

  const remove = () => {
    setConfirmState({
      title: "Delete activity?",
      message: `This will permanently remove "${form.name}".`,
      confirmLabel: "Delete",
      onConfirm: () => {
        update((p) => ({
          ...p,
          activities: p.activities.filter((a) => a.id !== form.id),
        }));
        log({
          action: "Deleted",
          recordType: "Activity",
          recordName: form.name,
          previousValue: "Existed",
          newValue: "Removed",
        });
        push("Activity deleted");
        onClose();
      },
    });
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={
        isNew
          ? parentActivityId
            ? "Add Sub-task"
            : "Add Activity"
          : form.parentActivityId
          ? `Sub-task · ${form.name || ""}`
          : "Activity Details"
      }
      width={620}
      footer={
        <>
          {!isNew && !form.milestone && !form.parentActivityId && (
            <Button
              variant="secondary"
              icon={Plus}
              onClick={() => {
                onClose();
                setDrawer({
                  type: "activity-new",
                  initiativeId: form.initiativeId,
                  parentActivityId: form.id,
                });
              }}
            >
              Add sub-task
            </Button>
          )}
          {!isNew && (
            <Button variant="danger" icon={Trash2} onClick={remove}>
              Delete
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} onClick={save}>
            {isNew ? "Add" : "Save Changes"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div
            style={{
              background: "#fbe9e7",
              color: "#a3271f",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        <Field label="Activity name *">
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <Field label="Initiative">
            <Select
              value={form.initiativeId}
              onChange={(e) => set("initiativeId", e.target.value)}
            >
              {data.initiatives.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.id} · {i.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Parent task (optional — makes this a sub-task)">
            <Select
              value={form.parentActivityId || ""}
              onChange={(e) => set("parentActivityId", e.target.value || null)}
            >
              <option value="">None — primary task</option>
              {primaryTasksInInitiative.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Input
              value={form.owner}
              onChange={(e) => set("owner", e.target.value)}
            />
          </Field>
          <Field label="Planned start">
            <Input
              type="date"
              value={form.plannedStart}
              onChange={(e) => set("plannedStart", e.target.value)}
            />
          </Field>
          <Field label="Planned end">
            <Input
              type="date"
              value={form.plannedEnd}
              onChange={(e) => set("plannedEnd", e.target.value)}
            />
          </Field>
          <Field label="Actual start">
            <Input
              type="date"
              value={form.actualStart}
              onChange={(e) => set("actualStart", e.target.value)}
            />
          </Field>
          <Field label="Actual end">
            <Input
              type="date"
              value={form.actualEnd}
              onChange={(e) => set("actualEnd", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {data.settings.statusValues.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
            >
              {data.settings.priorityValues.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Progress (%)">
            <Input
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => set("progress", clampProgress(e.target.value))}
            />
          </Field>
          <Field label="Dependency type">
            <Select
              value={form.dependencyType}
              onChange={(e) => set("dependencyType", e.target.value)}
            >
              {[
                "Finish-to-Start",
                "Start-to-Start",
                "Finish-to-Finish",
                "Start-to-Finish",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Predecessors">
          <Select
            multiple
            value={form.predecessors}
            onChange={(e) =>
              set(
                "predecessors",
                Array.from(e.target.selectedOptions).map((o) => o.value)
              )
            }
            style={{ height: 90 }}
          >
            {data.activities
              .filter((a) => a.id !== form.id)
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
          </Select>
        </Field>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={form.milestone}
              onChange={(e) => set("milestone", e.target.checked)}
            />{" "}
            Milestone
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={form.recurring}
              onChange={(e) => set("recurring", e.target.checked)}
            />{" "}
            Recurring
          </label>
          {form.recurring && (
            <Select
              value={form.recurrenceFrequency}
              onChange={(e) => set("recurrenceFrequency", e.target.value)}
              style={{ width: 160 }}
            >
              <option value="">Select frequency</option>
              {["Weekly", "Monthly", "Quarterly"].map((f) => (
                <option key={f}>{f}</option>
              ))}
            </Select>
          )}
        </div>
        <Field label="Deliverable">
          <Input
            value={form.deliverable}
            onChange={(e) => set("deliverable", e.target.value)}
          />
        </Field>
        <Field label="Blocker">
          <Input
            value={form.blocker}
            onChange={(e) => set("blocker", e.target.value)}
          />
        </Field>
        <Field label="Notes">
          <TextArea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
        <Field label="Evidence link">
          <Input
            value={form.evidence}
            onChange={(e) => set("evidence", e.target.value)}
            placeholder="https://…"
          />
        </Field>
        {!isNew && subtasksOfThis.length > 0 && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#0f2a52",
                marginTop: 4,
                marginBottom: 6,
              }}
            >
              Sub-tasks ({subtasksOfThis.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {subtasksOfThis.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setDrawer({ type: "activity", id: st.id })}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12.5,
                    padding: "6px 10px",
                    background: "#f7f8fa",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%",
                  }}
                >
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
function InitiativesTab({
  data,
  update,
  log,
  drawer,
  setDrawer,
  push,
  confirmState,
  setConfirmState,
}) {
  const [viewMode, setViewMode] = useState("card");
  const [filterOwner, setFilterOwner] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showArchived, setShowArchived] = useState(false);

  const list = data.initiatives
    .filter((i) => (showArchived ? i.archived : !i.archived))
    .filter((i) => !filterOwner || i.owner === filterOwner)
    .filter((i) => !filterStatus || i.status === filterStatus)
    .sort((a, b) => a.order - b.order);

  const owners = [...new Set(data.initiatives.map((i) => i.owner))];

  const openNew = () => setDrawer({ type: "initiative-new" });
  const openEdit = (id) => setDrawer({ type: "initiative", id });

  const duplicate = (init) => {
    const copy = {
      ...init,
      id: uid("OBJ5-INIT"),
      name: init.name + " (Copy)",
      createdDate: todayISO(),
      updatedDate: todayISO(),
      order: data.initiatives.length,
    };
    update((p) => ({ ...p, initiatives: [...p.initiatives, copy] }));
    log({
      action: "Added",
      recordType: "Initiative",
      recordName: copy.name,
      previousValue: "",
      newValue: `Duplicated from ${init.id}`,
    });
    push("Initiative duplicated");
  };
  const archive = (init) => {
    update((p) => ({
      ...p,
      initiatives: p.initiatives.map((i) =>
        i.id === init.id ? { ...i, archived: true } : i
      ),
    }));
    log({
      action: "Archived",
      recordType: "Initiative",
      recordName: init.name,
      previousValue: "Active",
      newValue: "Archived",
    });
    push("Initiative archived");
  };
  const restore = (init) => {
    update((p) => ({
      ...p,
      initiatives: p.initiatives.map((i) =>
        i.id === init.id ? { ...i, archived: false } : i
      ),
    }));
    log({
      action: "Restored",
      recordType: "Initiative",
      recordName: init.name,
      previousValue: "Archived",
      newValue: "Active",
    });
    push("Initiative restored");
  };
  const remove = (init) => {
    setConfirmState({
      title: "Delete initiative?",
      message: `Permanently delete "${init.name}" and unlink its activities? This cannot be undone.`,
      onConfirm: () => {
        update((p) => ({
          ...p,
          initiatives: p.initiatives.filter((i) => i.id !== init.id),
        }));
        log({
          action: "Deleted",
          recordType: "Initiative",
          recordName: init.name,
          previousValue: "Existed",
          newValue: "Removed",
        });
        push("Initiative deleted");
      },
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Select
            value={filterOwner}
            onChange={(e) => setFilterOwner(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="">All owners</option>
            {owners.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </Select>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 160 }}
          >
            <option value="">All statuses</option>
            {STATUS_VALUES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Select>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={showArchived}
              onChange={(e) => setShowArchived(e.target.checked)}
            />{" "}
            Show archived
          </label>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setViewMode("card")}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #d7dde5",
              background: viewMode === "card" ? "#0f2a52" : "#fff",
              color: viewMode === "card" ? "#fff" : "#334155",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Card view
          </button>
          <button
            onClick={() => setViewMode("table")}
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #d7dde5",
              background: viewMode === "table" ? "#0f2a52" : "#fff",
              color: viewMode === "table" ? "#fff" : "#334155",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Table view
          </button>
          <Button variant="primary" icon={Plus} onClick={openNew}>
            Add initiative
          </Button>
        </div>
      </div>

      {viewMode === "card" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
            gap: 16,
          }}
        >
          {list.map((init) => (
            <div
              key={init.id}
              style={{
                background: "#fff",
                border: "1px solid #e2e7ee",
                borderRadius: 12,
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{ fontSize: 11, color: "#8592a3", fontWeight: 700 }}
                  >
                    {init.id}
                  </div>
                  <button
                    onClick={() => openEdit(init.id)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      textAlign: "left",
                      cursor: "pointer",
                      fontSize: 14.5,
                      fontWeight: 700,
                      color: "#0f2a52",
                    }}
                  >
                    {init.name}
                  </button>
                </div>
                <Badge tone={priorityTone(init.priority)}>
                  {init.priority}
                </Badge>
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "#64748b",
                  lineHeight: 1.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {init.description}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge tone={statusTone(init.status)}>{init.status}</Badge>
                <Badge>{init.confidence} confidence</Badge>
                <Badge>{init.deadline}</Badge>
              </div>
              <div>
                <div
                  style={{
                    height: 7,
                    background: "#eef1f5",
                    borderRadius: 999,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${clampProgress(init.progress)}%`,
                      height: "100%",
                      background: "#0f2a52",
                    }}
                  />
                </div>
                <div style={{ fontSize: 11.5, color: "#8592a3", marginTop: 3 }}>
                  {init.progress}% complete · Owner: {init.owner}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  marginTop: 4,
                  borderTop: "1px solid #f0f2f5",
                  paddingTop: 8,
                }}
              >
                <IconBtn
                  icon={ChevronRight}
                  label="Open"
                  onClick={() => openEdit(init.id)}
                />
                <IconBtn
                  icon={Copy}
                  label="Duplicate"
                  onClick={() => duplicate(init)}
                />
                {init.archived ? (
                  <IconBtn
                    icon={RotateCcw}
                    label="Restore"
                    onClick={() => restore(init)}
                  />
                ) : (
                  <IconBtn
                    icon={Archive}
                    label="Archive"
                    onClick={() => archive(init)}
                  />
                )}
                <IconBtn
                  icon={Trash2}
                  label="Delete"
                  tone="danger"
                  onClick={() => remove(init)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e7ee",
            borderRadius: 12,
            overflowX: "auto",
          }}
        >
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr style={{ background: "#f7f8fa", textAlign: "left" }}>
                {[
                  "ID",
                  "Name",
                  "Owner",
                  "Status",
                  "Priority",
                  "Confidence",
                  "Progress",
                  "Deadline",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "10px 12px",
                      fontWeight: 700,
                      color: "#64748b",
                      fontSize: 11.5,
                      textTransform: "uppercase",
                      borderBottom: "1px solid #e2e7ee",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((init) => (
                <tr key={init.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <td style={{ padding: "10px 12px", color: "#64748b" }}>
                    {init.id}
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <button
                      onClick={() => openEdit(init.id)}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: 700,
                        color: "#0f2a52",
                      }}
                    >
                      {init.name}
                    </button>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{init.owner}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <Badge tone={statusTone(init.status)}>{init.status}</Badge>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <Badge tone={priorityTone(init.priority)}>
                      {init.priority}
                    </Badge>
                  </td>
                  <td style={{ padding: "10px 12px" }}>{init.confidence}</td>
                  <td style={{ padding: "10px 12px" }}>{init.progress}%</td>
                  <td style={{ padding: "10px 12px" }}>{init.deadline}</td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 2 }}>
                      <IconBtn
                        icon={ChevronRight}
                        label="Open"
                        onClick={() => openEdit(init.id)}
                      />
                      <IconBtn
                        icon={Copy}
                        label="Duplicate"
                        onClick={() => duplicate(init)}
                      />
                      <IconBtn
                        icon={Trash2}
                        label="Delete"
                        tone="danger"
                        onClick={() => remove(init)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {drawer && drawer.type === "initiative" && (
        <InitiativeDrawer
          data={data}
          update={update}
          log={log}
          initiativeId={drawer.id}
          onClose={() => setDrawer(null)}
          push={push}
          setConfirmState={setConfirmState}
        />
      )}
      {drawer && drawer.type === "initiative-new" && (
        <InitiativeDrawer
          data={data}
          update={update}
          log={log}
          isNew
          onClose={() => setDrawer(null)}
          push={push}
        />
      )}
    </div>
  );
}

function InitiativeDrawer({
  data,
  update,
  log,
  initiativeId,
  isNew,
  onClose,
  push,
  setConfirmState,
}) {
  const existing = !isNew
    ? data.initiatives.find((i) => i.id === initiativeId)
    : null;
  const [form, setForm] = useState(
    existing || {
      id: uid("OBJ5-INIT"),
      name: "",
      objective: "Objective 5 — Delivery Excellence",
      description: "",
      owner: data.settings.objectiveOwner,
      support: [],
      plannedStart: "2025-12-12",
      plannedEnd: "2026-12-11",
      actualStart: "",
      actualEnd: "",
      deadline: "Q1 2026",
      status: "Not Started",
      priority: "Medium",
      confidence: "Medium",
      progress: 0,
      servesKpi: [],
      deliverables: [],
      milestoneIds: [],
      dependencies: [],
      risks: [],
      latestUpdate: "",
      notes: "",
      evidenceLinks: [],
      createdDate: todayISO(),
      updatedDate: todayISO(),
      archived: false,
      order: data.initiatives.length,
    }
  );
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const activities = data.activities.filter((a) => a.initiativeId === form.id);

  const validate = () => {
    if (!form.name.trim()) return "Initiative name is required.";
    if (form.progress < 0 || form.progress > 100)
      return "Progress must be between 0% and 100%.";
    if (form.status === "Completed" && Number(form.progress) !== 100)
      return "Completed initiatives should normally have 100% progress.";
    return "";
  };

  const save = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    const updated = { ...form, updatedDate: todayISO() };
    update((p) => {
      const exists = p.initiatives.some((i) => i.id === updated.id);
      return {
        ...p,
        initiatives: exists
          ? p.initiatives.map((i) => (i.id === updated.id ? updated : i))
          : [...p.initiatives, updated],
      };
    });
    log({
      action: isNew ? "Added" : "Edited",
      recordType: "Initiative",
      recordName: updated.name,
      previousValue: "",
      newValue: isNew ? "Created" : "Updated",
    });
    push(isNew ? "Initiative added" : "Initiative saved");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={
        isNew ? "Add Initiative" : `${form.id} · ${form.name || "Initiative"}`
      }
      width={680}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} onClick={save}>
            {isNew ? "Add Initiative" : "Save Changes"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div
            style={{
              background: "#fbe9e7",
              color: "#a3271f",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        <Field label="Name *">
          <Input
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </Field>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            style={{ minHeight: 90 }}
          />
        </Field>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <Field label="Owner">
            <Input
              value={form.owner}
              onChange={(e) => set("owner", e.target.value)}
            />
          </Field>
          <Field label="Support (comma-separated)">
            <Input
              value={form.support.join(", ")}
              onChange={(e) =>
                set(
                  "support",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </Field>
          <Field label="Deadline">
            <Input
              value={form.deadline}
              onChange={(e) => set("deadline", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {data.settings.statusValues.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Priority">
            <Select
              value={form.priority}
              onChange={(e) => set("priority", e.target.value)}
            >
              {data.settings.priorityValues.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Confidence">
            <Select
              value={form.confidence}
              onChange={(e) => set("confidence", e.target.value)}
            >
              {data.settings.confidenceValues.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Progress (%)">
            <Input
              type="number"
              min={0}
              max={100}
              value={form.progress}
              onChange={(e) => set("progress", clampProgress(e.target.value))}
            />
          </Field>
          <Field label="Serves KPI (comma-separated)">
            <Input
              value={form.servesKpi.join(", ")}
              onChange={(e) =>
                set(
                  "servesKpi",
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
            />
          </Field>
        </div>
        <Field label="Latest update">
          <TextArea
            value={form.latestUpdate}
            onChange={(e) => set("latestUpdate", e.target.value)}
          />
        </Field>
        <Field label="Notes">
          <TextArea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
        <Field label="Evidence links (comma-separated URLs)">
          <Input
            value={(form.evidenceLinks || []).join(", ")}
            onChange={(e) =>
              set(
                "evidenceLinks",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </Field>
        {!isNew && (
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#0f2a52",
                marginTop: 6,
                marginBottom: 6,
              }}
            >
              Activities under this initiative ({activities.length})
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                maxHeight: 180,
                overflowY: "auto",
              }}
            >
              {activities.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12.5,
                    padding: "6px 10px",
                    background: "#f7f8fa",
                    borderRadius: 6,
                  }}
                >
                  <span>
                    {a.milestone ? "◆ " : ""}
                    {a.name}
                  </span>
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
   KPI PERFORMANCE TAB
   ============================================================ */
function KPITab({ data, update, log, push }) {
  const [showEntry, setShowEntry] = useState(false);
  const [metricFilter, setMetricFilter] = useState("Delivery Excellence Index");
  const [periodMode, setPeriodMode] = useState("Monthly");
  const [valueMode, setValueMode] = useState("Percentage");

  const metrics = Object.keys(data.kpiDefs);
  const rows = data.kpiResults
    .filter((r) => r.metric === metricFilter)
    .sort((a, b) => a.reportingPeriod.localeCompare(b.reportingPeriod));
  const def = data.kpiDefs[metricFilter];

  const chartData = rows.map((r) => ({
    period: r.reportingPeriod,
    Actual: r.calculatedPct,
    Target: r.target,
    Numerator: Number(r.numerator),
    Denominator: Number(r.denominator),
  }));

  const latest = rows[rows.length - 1];

  const addResult = (entry) => {
    const thresholds = data.settings.performanceThresholds;
    const target = entry.target !== "" ? Number(entry.target) : null;
    const { pct, status, variance } = calcKpiResult(
      entry.numerator,
      entry.denominator,
      target,
      thresholds
    );
    if (Number(entry.numerator) > Number(entry.denominator)) {
      push("Numerator cannot exceed denominator", "error");
      return false;
    }
    if (Number(entry.denominator) < 0) {
      push("Denominator cannot be negative", "error");
      return false;
    }
    const dup = data.kpiResults.find(
      (r) =>
        r.metric === entry.metric && r.reportingPeriod === entry.reportingPeriod
    );
    if (dup && !entry.confirmedReplace) {
      push(
        "A record for this period already exists — confirm to replace it.",
        "error"
      );
      return "duplicate";
    }
    const record = {
      id: dup ? dup.id : uid("KPI"),
      metric: entry.metric,
      reportingPeriod: entry.reportingPeriod,
      numerator: Number(entry.numerator),
      denominator: Number(entry.denominator),
      calculatedPct: pct,
      target,
      variance,
      performanceStatus: status,
      dataSource: entry.dataSource || "Manual KPI Entry",
      evidenceLink: entry.evidenceLink || "",
      enteredBy: data.settings.userDisplayName,
      entryDate: todayISO(),
      notes: entry.notes || "",
    };
    update((p) => ({
      ...p,
      kpiResults: dup
        ? p.kpiResults.map((r) => (r.id === dup.id ? record : r))
        : [...p.kpiResults, record],
    }));
    log({
      action: dup ? "Edited" : "Added",
      recordType: "KPI Result",
      recordName: `${entry.metric} — ${entry.reportingPeriod}`,
      previousValue: dup ? `${dup.calculatedPct}%` : "",
      newValue: `${pct}%`,
    });
    push("KPI result saved");
    return true;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Select
            value={metricFilter}
            onChange={(e) => setMetricFilter(e.target.value)}
            style={{ width: 260 }}
          >
            {metrics.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
          <Select
            value={periodMode}
            onChange={(e) => setPeriodMode(e.target.value)}
            style={{ width: 140 }}
          >
            <option>Monthly</option>
            <option>Quarterly</option>
          </Select>
          <Select
            value={valueMode}
            onChange={(e) => setValueMode(e.target.value)}
            style={{ width: 200 }}
          >
            <option>Percentage</option>
            <option>Numerator/Denominator</option>
          </Select>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setShowEntry(true)}
        >
          Add KPI result
        </Button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
          gap: 12,
        }}
      >
        <KPICard
          label="Latest measurement"
          value={latest ? `${latest.calculatedPct}%` : "No data"}
          sub={latest ? fmtDate(latest.entryDate) : "Not yet measured"}
        />
        <KPICard
          label="Target (latest quarter)"
          value={def.targets["Q4 2026"] ? `${def.targets["Q4 2026"]}%` : "—"}
          sub="Q4 2026 target"
        />
        <KPICard
          label="Variance from target"
          value={
            latest && latest.variance != null
              ? `${latest.variance > 0 ? "+" : ""}${latest.variance} pts`
              : "—"
          }
        />
        <KPICard
          label="Baseline status"
          value={def.baseline}
          sub={def.baselineExplanation}
        />
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <div style={{ fontWeight: 700, color: "#0f2a52", marginBottom: 4 }}>
          {metricFilter} — Target vs Actual
        </div>
        <div style={{ fontSize: 12, color: "#8592a3", marginBottom: 10 }}>
          {def.formula} · Measured {def.frequency.toLowerCase()}
        </div>
        {chartData.length === 0 ? (
          <EmptyState message="No KPI results recorded yet for this metric. Add the first measurement to see the trend." />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            {valueMode === "Percentage" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                <XAxis dataKey="period" fontSize={12} />
                <YAxis domain={[0, 100]} fontSize={12} unit="%" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="Actual"
                  stroke="#0f2a52"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="Target"
                  stroke="#c2410c"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef1f5" />
                <XAxis dataKey="period" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Numerator" fill="#0f2a52" />
                <Bar dataKey="Denominator" fill="#c7d2e2" />
              </BarChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {[
                "Period",
                "Numerator",
                "Denominator",
                "Actual %",
                "Target %",
                "Variance",
                "Status",
                "Entered By",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: 11.5,
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderBottom: "1px solid #e2e7ee",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                <td style={{ padding: "9px 12px" }}>{r.reportingPeriod}</td>
                <td style={{ padding: "9px 12px" }}>{r.numerator}</td>
                <td style={{ padding: "9px 12px" }}>{r.denominator}</td>
                <td style={{ padding: "9px 12px", fontWeight: 700 }}>
                  {r.calculatedPct}%
                </td>
                <td style={{ padding: "9px 12px" }}>
                  {r.target != null ? `${r.target}%` : "—"}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  {r.variance != null
                    ? `${r.variance > 0 ? "+" : ""}${r.variance}`
                    : "—"}
                </td>
                <td style={{ padding: "9px 12px" }}>
                  <Badge
                    tone={
                      {
                        "Above Target": "green",
                        "On Target": "green",
                        "Slightly Below Target": "amber",
                        "Significantly Below Target": "red",
                        "No Data": "neutral",
                      }[r.performanceStatus]
                    }
                  >
                    {r.performanceStatus}
                  </Badge>
                </td>
                <td style={{ padding: "9px 12px" }}>{r.enteredBy}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}
                >
                  No records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showEntry && (
        <KPIEntryModal
          data={data}
          metricDefault={metricFilter}
          onClose={() => setShowEntry(false)}
          addResult={addResult}
        />
      )}
    </div>
  );
}

function KPIEntryModal({ data, metricDefault, onClose, addResult }) {
  const [metric, setMetric] = useState(metricDefault);
  const [period, setPeriod] = useState("");
  const [periodType, setPeriodType] = useState("Monthly");
  const [numerator, setNumerator] = useState("");
  const [denominator, setDenominator] = useState("");
  const [dataSource, setDataSource] = useState(data.settings.kpiDataSource);
  const [evidenceLink, setEvidenceLink] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const def = data.kpiDefs[metric];
  const quarter = period
    ? periodType === "Monthly"
      ? quarterOfDate(period + "-01")
      : period
    : "";
  const target = def.targets[quarter] ?? def.targets["Q4 2026"];

  const submit = (confirmReplace = false) => {
    if (!period) {
      setError("Reporting period is required.");
      return;
    }
    if (numerator === "" || denominator === "") {
      setError("Numerator and denominator are required.");
      return;
    }
    if (Number(numerator) > Number(denominator)) {
      setError("Numerator cannot exceed denominator.");
      return;
    }
    if (Number(denominator) < 0) {
      setError("Denominator cannot be negative.");
      return;
    }
    setError("");
    const result = addResult({
      metric,
      reportingPeriod: period,
      numerator,
      denominator,
      target,
      dataSource,
      evidenceLink,
      notes,
      confirmedReplace: confirmReplace,
    });
    if (result === "duplicate") {
      setNeedsConfirm(true);
      return;
    }
    if (result) onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Add KPI Result"
      width={520}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          {needsConfirm ? (
            <Button variant="danger" onClick={() => submit(true)}>
              Replace existing record
            </Button>
          ) : (
            <Button variant="primary" icon={Save} onClick={() => submit(false)}>
              Save Result
            </Button>
          )}
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div
            style={{
              background: "#fbe9e7",
              color: "#a3271f",
              padding: "8px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
        <Field label="Metric">
          <Select value={metric} onChange={(e) => setMetric(e.target.value)}>
            {Object.keys(data.kpiDefs).map((m) => (
              <option key={m}>{m}</option>
            ))}
          </Select>
        </Field>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <Field label="Period type">
            <Select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value)}
            >
              <option>Monthly</option>
              <option>Quarterly</option>
            </Select>
          </Field>
          <Field label="Reporting period">
            {periodType === "Monthly" ? (
              <Input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              />
            ) : (
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
              >
                <option value="">Select</option>
                {QUARTERS_2026.map((q) => (
                  <option key={q}>{q}</option>
                ))}
              </Select>
            )}
          </Field>
          <Field label="Numerator">
            <Input
              type="number"
              value={numerator}
              onChange={(e) => setNumerator(e.target.value)}
            />
          </Field>
          <Field label="Denominator">
            <Input
              type="number"
              value={denominator}
              onChange={(e) => setDenominator(e.target.value)}
            />
          </Field>
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "#64748b",
            background: "#f7f8fa",
            padding: "8px 12px",
            borderRadius: 8,
          }}
        >
          Calculated:{" "}
          {numerator !== "" && denominator !== "" && Number(denominator) > 0
            ? `${((Number(numerator) / Number(denominator)) * 100).toFixed(1)}%`
            : "—"}{" "}
          · Target for {quarter || "selected period"}:{" "}
          {target != null ? `${target}%` : "—"}
        </div>
        <Field label="Data source">
          <Select
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
          >
            <option>Calculated from Deliverable Register</option>
            <option>Manual KPI Entry</option>
            <option>Hybrid</option>
          </Select>
        </Field>
        <Field label="Evidence link">
          <Input
            value={evidenceLink}
            onChange={(e) => setEvidenceLink(e.target.value)}
            placeholder="https://…"
          />
        </Field>
        <Field label="Notes">
          <TextArea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

function EmptyState({ message }) {
  return (
    <div
      style={{
        padding: "30px 16px",
        textAlign: "center",
        color: "#94a3b8",
        fontSize: 13.5,
        border: "1px dashed #d7dde5",
        borderRadius: 10,
      }}
    >
      {message}
    </div>
  );
}

/* ============================================================
   ALIGNMENTS TAB
   ============================================================ */
function AlignmentsTab({ data, update, log, drawer, setDrawer, push }) {
  const overdueCount = data.alignments.filter(
    (a) =>
      a.dueDate &&
      new Date(a.dueDate) < new Date(todayISO()) &&
      a.completionStatus !== "Completed"
  ).length;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Badge tone={overdueCount ? "red" : "green"}>
          {overdueCount} overdue alignment action(s)
        </Badge>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setDrawer({ type: "alignment-new" })}
        >
          Add alignment meeting
        </Button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.alignments.map((a) => (
          <div
            key={a.id}
            style={{
              background: "#fff",
              border: "1px solid #e2e7ee",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <button
                onClick={() => setDrawer({ type: "alignment", id: a.id })}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: 14.5,
                  color: "#0f2a52",
                  textAlign: "left",
                }}
              >
                {a.counterpart}
              </button>
              <div style={{ display: "flex", gap: 6 }}>
                <Badge
                  tone={
                    {
                      "Not Scheduled": "neutral",
                      Scheduled: "navy",
                      Completed: "green",
                      Rescheduled: "amber",
                      Cancelled: "red",
                    }[a.meetingStatus]
                  }
                >
                  {a.meetingStatus}
                </Badge>
                <Badge
                  tone={
                    {
                      Open: "amber",
                      "In Progress": "navy",
                      Blocked: "red",
                      Completed: "green",
                      Overdue: "red",
                    }[a.completionStatus]
                  }
                >
                  {a.completionStatus}
                </Badge>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 6 }}>
              {a.topic}
            </div>
            {a.agreedActions && (
              <div style={{ fontSize: 12.5, marginTop: 6 }}>
                <strong>Agreed actions:</strong> {a.agreedActions}
              </div>
            )}
            <div style={{ fontSize: 11.5, color: "#8592a3", marginTop: 6 }}>
              Meeting: {a.meetingDate ? fmtDate(a.meetingDate) : "TBD"} · Due:{" "}
              {a.dueDate ? fmtDate(a.dueDate) : "TBD"} · Owner: {a.owner}
            </div>
          </div>
        ))}
      </div>

      {drawer &&
        (drawer.type === "alignment" || drawer.type === "alignment-new") && (
          <AlignmentDrawer
            data={data}
            update={update}
            log={log}
            alignmentId={drawer.id}
            isNew={drawer.type === "alignment-new"}
            onClose={() => setDrawer(null)}
            push={push}
          />
        )}
    </div>
  );
}

function AlignmentDrawer({
  data,
  update,
  log,
  alignmentId,
  isNew,
  onClose,
  push,
}) {
  const existing = !isNew
    ? data.alignments.find((a) => a.id === alignmentId)
    : null;
  const [form, setForm] = useState(
    existing || {
      id: uid("ALN"),
      counterpart: "",
      topic: "",
      requiredDecision: "",
      meetingDate: "",
      meetingStatus: "Not Scheduled",
      owner: data.settings.objectiveOwner,
      attendees: [],
      notes: "",
      agreedActions: "",
      actionOwner: "",
      dueDate: "",
      decision: "",
      evidence: "",
      followUpDate: "",
      completionStatus: "Open",
    }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = () => {
    if (!form.counterpart.trim()) return;
    update((p) => {
      const exists = p.alignments.some((a) => a.id === form.id);
      return {
        ...p,
        alignments: exists
          ? p.alignments.map((a) => (a.id === form.id ? form : a))
          : [...p.alignments, form],
      };
    });
    log({
      action: isNew ? "Added" : "Edited",
      recordType: "Alignment",
      recordName: form.counterpart,
      previousValue: "",
      newValue: isNew ? "Created" : "Updated",
    });
    push("Alignment saved");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Add Alignment" : form.counterpart}
      width={600}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} onClick={save}>
            Save
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Field label="Counterpart *">
          <Input
            value={form.counterpart}
            onChange={(e) => set("counterpart", e.target.value)}
          />
        </Field>
        <Field label="Topic">
          <TextArea
            value={form.topic}
            onChange={(e) => set("topic", e.target.value)}
          />
        </Field>
        <Field label="Required decision">
          <Input
            value={form.requiredDecision}
            onChange={(e) => set("requiredDecision", e.target.value)}
          />
        </Field>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <Field label="Meeting date">
            <Input
              type="date"
              value={form.meetingDate}
              onChange={(e) => set("meetingDate", e.target.value)}
            />
          </Field>
          <Field label="Meeting status">
            <Select
              value={form.meetingStatus}
              onChange={(e) => set("meetingStatus", e.target.value)}
            >
              {MEETING_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Input
              value={form.owner}
              onChange={(e) => set("owner", e.target.value)}
            />
          </Field>
          <Field label="Action owner">
            <Input
              value={form.actionOwner}
              onChange={(e) => set("actionOwner", e.target.value)}
            />
          </Field>
          <Field label="Due date">
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </Field>
          <Field label="Follow-up date">
            <Input
              type="date"
              value={form.followUpDate}
              onChange={(e) => set("followUpDate", e.target.value)}
            />
          </Field>
          <Field label="Completion status">
            <Select
              value={form.completionStatus}
              onChange={(e) => set("completionStatus", e.target.value)}
            >
              {ACTION_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>
        <Field label="Attendees (comma-separated)">
          <Input
            value={form.attendees.join(", ")}
            onChange={(e) =>
              set(
                "attendees",
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        </Field>
        <Field label="Agreed actions">
          <TextArea
            value={form.agreedActions}
            onChange={(e) => set("agreedActions", e.target.value)}
          />
        </Field>
        <Field label="Decision">
          <TextArea
            value={form.decision}
            onChange={(e) => set("decision", e.target.value)}
          />
        </Field>
        <Field label="Notes">
          <TextArea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
        <Field label="Evidence">
          <Input
            value={form.evidence}
            onChange={(e) => set("evidence", e.target.value)}
            placeholder="https://…"
          />
        </Field>
      </div>
    </Modal>
  );
}

/* ============================================================
   RISKS & DEPENDENCIES TAB (RAID)
   ============================================================ */
function RisksTab({
  data,
  update,
  log,
  drawer,
  setDrawer,
  push,
  confirmState,
  setConfirmState,
}) {
  const [typeFilter, setTypeFilter] = useState("");
  const thresholds = data.settings.riskThresholds;

  const list = data.risks
    .filter((r) => !typeFilter || r.type === typeFilter)
    .slice()
    .sort((a, b) => riskScore(b) - riskScore(a));

  const remove = (r) => {
    setConfirmState({
      title: "Delete RAID record?",
      message: `Permanently remove "${r.title}"?`,
      onConfirm: () => {
        update((p) => ({ ...p, risks: p.risks.filter((x) => x.id !== r.id) }));
        log({
          action: "Deleted",
          recordType: "Risk/Dependency",
          recordName: r.title,
          previousValue: "Existed",
          newValue: "Removed",
        });
        push("Record deleted");
      },
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="">All types</option>
          {RAID_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setDrawer({ type: "risk-new" })}
        >
          Add risk / dependency
        </Button>
      </div>

      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {[
                "Type",
                "Title",
                "Probability",
                "Impact",
                "Score",
                "Level",
                "Status",
                "Owner",
                "",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: 11.5,
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderBottom: "1px solid #e2e7ee",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((r) => {
              const score = riskScore(r);
              const level = riskLevel(score, thresholds);
              return (
                <tr key={r.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                  <td style={{ padding: "9px 12px" }}>
                    <Badge>{r.type}</Badge>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <button
                      onClick={() => setDrawer({ type: "risk", id: r.id })}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                        fontWeight: 600,
                        color: "#0f2a52",
                        textAlign: "left",
                      }}
                    >
                      {r.title}
                    </button>
                  </td>
                  <td style={{ padding: "9px 12px" }}>{r.probability}</td>
                  <td style={{ padding: "9px 12px" }}>{r.impact}</td>
                  <td style={{ padding: "9px 12px", fontWeight: 700 }}>
                    {score}
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <Badge
                      tone={
                        {
                          Low: "green",
                          Medium: "navy",
                          High: "amber",
                          Critical: "red",
                        }[level]
                      }
                    >
                      {level}
                    </Badge>
                  </td>
                  <td style={{ padding: "9px 12px" }}>
                    <Badge
                      tone={r.status === "Completed" ? "green" : "neutral"}
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td style={{ padding: "9px 12px" }}>{r.owner}</td>
                  <td style={{ padding: "9px 12px" }}>
                    <IconBtn
                      icon={Trash2}
                      label="Delete"
                      tone="danger"
                      onClick={() => remove(r)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {drawer && (drawer.type === "risk" || drawer.type === "risk-new") && (
        <RiskDrawer
          data={data}
          update={update}
          log={log}
          riskId={drawer.id}
          isNew={drawer.type === "risk-new"}
          onClose={() => setDrawer(null)}
          push={push}
        />
      )}
    </div>
  );
}

function RiskDrawer({ data, update, log, riskId, isNew, onClose, push }) {
  const existing = !isNew ? data.risks.find((r) => r.id === riskId) : null;
  const [form, setForm] = useState(
    existing || {
      id: uid("RAID"),
      type: "Risk",
      title: "",
      description: "",
      relatedInitiative: "",
      relatedActivity: "",
      owner: data.settings.objectiveOwner,
      raisedDate: todayISO(),
      dueDate: "",
      probability: "Medium",
      impact: "Medium",
      status: "Open",
      mitigation: "",
      contingency: "",
      dependencyOwner: "",
      escalationRequired: false,
      decisionRequired: "",
      resolution: "",
      closedDate: "",
      notes: "",
    }
  );
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const score = riskScore(form);
  const level = riskLevel(score, data.settings.riskThresholds);

  const save = () => {
    if (!form.title.trim()) return;
    update((p) => {
      const exists = p.risks.some((r) => r.id === form.id);
      return {
        ...p,
        risks: exists
          ? p.risks.map((r) => (r.id === form.id ? form : r))
          : [...p.risks, form],
      };
    });
    log({
      action: isNew ? "Added" : "Edited",
      recordType: "Risk/Dependency",
      recordName: form.title,
      previousValue: "",
      newValue: isNew ? "Created" : "Updated",
    });
    push("Saved");
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isNew ? "Add Risk / Dependency" : form.title}
      width={620}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} onClick={save}>
            Save
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <Field label="Type">
            <Select
              value={form.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {RAID_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Select>
          </Field>
          <Field label="Title *">
            <Input
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </Field>
        </div>
        <Field label="Description">
          <TextArea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          <Field label="Related initiative">
            <Select
              value={form.relatedInitiative}
              onChange={(e) => set("relatedInitiative", e.target.value)}
            >
              <option value="">None</option>
              {data.initiatives.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Owner">
            <Input
              value={form.owner}
              onChange={(e) => set("owner", e.target.value)}
            />
          </Field>
          <Field label="Probability">
            <Select
              value={form.probability}
              onChange={(e) => set("probability", e.target.value)}
            >
              {PROB_IMPACT.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="Impact">
            <Select
              value={form.impact}
              onChange={(e) => set("impact", e.target.value)}
            >
              {PROB_IMPACT.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </Select>
          </Field>
          <Field label="Due date">
            <Input
              type="date"
              value={form.dueDate}
              onChange={(e) => set("dueDate", e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {["Open", "In Progress", "Mitigated", "Closed", "Completed"].map(
                (s) => (
                  <option key={s}>{s}</option>
                )
              )}
            </Select>
          </Field>
        </div>
        <div
          style={{
            background: "#f7f8fa",
            padding: "10px 12px",
            borderRadius: 8,
            fontSize: 13,
          }}
        >
          Risk score: <strong>{score}</strong> →{" "}
          <Badge
            tone={
              { Low: "green", Medium: "navy", High: "amber", Critical: "red" }[
                level
              ]
            }
          >
            {level}
          </Badge>
        </div>
        <Field label="Mitigation">
          <TextArea
            value={form.mitigation}
            onChange={(e) => set("mitigation", e.target.value)}
          />
        </Field>
        <Field label="Contingency">
          <TextArea
            value={form.contingency}
            onChange={(e) => set("contingency", e.target.value)}
          />
        </Field>
        <Field label="Notes">
          <TextArea
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
          />
        </Field>
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
  const list = data.activityLog.filter(
    (l) =>
      (!recordType || l.recordType === recordType) &&
      (!actionFilter || l.action === actionFilter)
  );
  const recordTypes = [...new Set(data.activityLog.map((l) => l.recordType))];
  const actions = [...new Set(data.activityLog.map((l) => l.action))];

  return (
    <div>
      <div
        style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}
      >
        <Select
          value={recordType}
          onChange={(e) => setRecordType(e.target.value)}
          style={{ width: 200 }}
        >
          <option value="">All record types</option>
          {recordTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <Select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          style={{ width: 160 }}
        >
          <option value="">All actions</option>
          {actions.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </Select>
      </div>
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          overflowX: "auto",
        }}
      >
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f7f8fa" }}>
              {[
                "Date/Time",
                "User",
                "Action",
                "Record Type",
                "Record Name",
                "Change",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 12px",
                    textAlign: "left",
                    fontSize: 11.5,
                    color: "#64748b",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    borderBottom: "1px solid #e2e7ee",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id} style={{ borderBottom: "1px solid #f0f2f5" }}>
                <td style={{ padding: "9px 12px", whiteSpace: "nowrap" }}>
                  {fmtDateTime(l.date)}
                </td>
                <td style={{ padding: "9px 12px" }}>{l.user}</td>
                <td style={{ padding: "9px 12px" }}>
                  <Badge>{l.action}</Badge>
                </td>
                <td style={{ padding: "9px 12px" }}>{l.recordType}</td>
                <td style={{ padding: "9px 12px" }}>{l.recordName}</td>
                <td style={{ padding: "9px 12px", color: "#64748b" }}>
                  {l.previousValue ? `${l.previousValue} → ` : ""}
                  {l.newValue}
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{ padding: 16, textAlign: "center", color: "#94a3b8" }}
                >
                  No log entries match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   SETTINGS & DATA TAB
   ============================================================ */
function SettingsTab({
  data,
  update,
  push,
  exportJSON,
  fileInputRef,
  importState,
  setImportState,
  log,
}) {
  const s = data.settings;
  const setS = (k, v) =>
    update((p) => ({ ...p, settings: { ...p.settings, [k]: v } }));

  const exportCSV = (rows, filename, columns) => {
    const header = columns.join(",");
    const body = rows
      .map((r) =>
        columns
          .map((c) => `"${String(r[c] ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
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
        if (!parsed.initiatives || !Array.isArray(parsed.initiatives))
          throw new Error("Invalid file structure");
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
    update((p) => {
      const backup = { ...p };
      if (mode === "replace") {
        return { ...parsed, lastSaved: p.lastSaved };
      }
      // merge by id
      const mergeArr = (a, b) => {
        const map = new Map(a.map((x) => [x.id, x]));
        b.forEach((x) => map.set(x.id, x));
        return [...map.values()];
      };
      return {
        ...p,
        initiatives: mergeArr(p.initiatives, parsed.initiatives || []),
        activities: mergeArr(p.activities, parsed.activities || []),
        kpiResults: mergeArr(p.kpiResults, parsed.kpiResults || []),
        alignments: mergeArr(p.alignments, parsed.alignments || []),
        risks: mergeArr(p.risks, parsed.risks || []),
        deliverables: mergeArr(p.deliverables, parsed.deliverables || []),
      };
    });
    log({
      action: "Imported data",
      recordType: "Application",
      recordName: importState.fileName,
      previousValue: "",
      newValue: mode === "replace" ? "Replaced all data" : "Merged records",
    });
    push(`Import complete (${mode})`);
    setImportState(null);
  };

  const resetData = () => {
    update(() => defaultData());
    push("Application reset to initial sample data");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <section
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>
          General
        </h3>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <Field label="Objective owner">
            <Input
              value={s.objectiveOwner}
              onChange={(e) => setS("objectiveOwner", e.target.value)}
            />
          </Field>
          <Field label="User display name">
            <Input
              value={s.userDisplayName}
              onChange={(e) => setS("userDisplayName", e.target.value)}
            />
          </Field>
          <Field label="Default timeline view">
            <Select
              value={s.defaultTimelineView}
              onChange={(e) => setS("defaultTimelineView", e.target.value)}
            >
              {["Quarterly", "Monthly", "Weekly", "List"].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </Select>
          </Field>
          <Field label="Week start day">
            <Select
              value={s.weekStartDay}
              onChange={(e) => setS("weekStartDay", e.target.value)}
            >
              <option>Sunday</option>
              <option>Monday</option>
            </Select>
          </Field>
          <Field label="Working days">
            <Input
              value={s.workingDays}
              onChange={(e) => setS("workingDays", e.target.value)}
            />
          </Field>
          <Field label="Date format">
            <Input
              value={s.dateFormat}
              onChange={(e) => setS("dateFormat", e.target.value)}
            />
          </Field>
          <Field label="KPI data source">
            <Select
              value={s.kpiDataSource}
              onChange={(e) => setS("kpiDataSource", e.target.value)}
            >
              <option>Calculated from Deliverable Register</option>
              <option>Manual KPI Entry</option>
              <option>Hybrid</option>
            </Select>
          </Field>
          <Field label="Application data version">
            <Input value={s.appDataVersion} disabled />
          </Field>
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>
          Autosave & Confirmation
        </h3>
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={s.autosaveEnabled}
              onChange={(e) => setS("autosaveEnabled", e.target.checked)}
            />{" "}
            Autosave enabled
          </label>
          <Field label="Autosave delay (ms)">
            <Input
              type="number"
              value={s.autosaveDelayMs}
              onChange={(e) => setS("autosaveDelayMs", Number(e.target.value))}
              style={{ width: 120 }}
            />
          </Field>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
            }}
          >
            <input
              type="checkbox"
              checked={s.confirmBeforeDeletion}
              onChange={(e) => setS("confirmBeforeDeletion", e.target.checked)}
            />{" "}
            Confirm before deletion
          </label>
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>
          Thresholds
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 12,
          }}
        >
          <Field label="Above target (+pts)">
            <Input
              type="number"
              value={s.performanceThresholds.aboveTarget}
              onChange={(e) =>
                setS("performanceThresholds", {
                  ...s.performanceThresholds,
                  aboveTarget: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Slightly below (−pts)">
            <Input
              type="number"
              value={s.performanceThresholds.slightlyBelow}
              onChange={(e) =>
                setS("performanceThresholds", {
                  ...s.performanceThresholds,
                  slightlyBelow: Number(e.target.value),
                })
              }
            />
          </Field>
          <div />
          <Field label="Risk: Low max score">
            <Input
              type="number"
              value={s.riskThresholds.low}
              onChange={(e) =>
                setS("riskThresholds", {
                  ...s.riskThresholds,
                  low: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Risk: Medium max score">
            <Input
              type="number"
              value={s.riskThresholds.medium}
              onChange={(e) =>
                setS("riskThresholds", {
                  ...s.riskThresholds,
                  medium: Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Risk: High max score">
            <Input
              type="number"
              value={s.riskThresholds.high}
              onChange={(e) =>
                setS("riskThresholds", {
                  ...s.riskThresholds,
                  high: Number(e.target.value),
                })
              }
            />
          </Field>
        </div>
      </section>

      <section
        style={{
          background: "#fff",
          border: "1px solid #e2e7ee",
          borderRadius: 12,
          padding: 18,
        }}
      >
        <h3 style={{ marginTop: 0, color: "#0f2a52", fontSize: 15 }}>
          Import, Export & Backup
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Button variant="secondary" icon={Download} onClick={exportJSON}>
            Export all data (JSON)
          </Button>
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => fileInputRef.current.click()}
          >
            Import data (JSON)
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={onFileSelected}
          />
          <Button
            variant="secondary"
            icon={Download}
            onClick={() =>
              exportCSV(data.activities, "activities.csv", [
                "id",
                "name",
                "initiativeId",
                "owner",
                "status",
                "priority",
                "progress",
                "plannedStart",
                "plannedEnd",
              ])
            }
          >
            Export activities (CSV)
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() =>
              exportCSV(data.initiatives, "initiatives.csv", [
                "id",
                "name",
                "owner",
                "status",
                "priority",
                "confidence",
                "progress",
                "deadline",
              ])
            }
          >
            Export initiatives (CSV)
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() =>
              exportCSV(data.kpiResults, "kpi-results.csv", [
                "metric",
                "reportingPeriod",
                "numerator",
                "denominator",
                "calculatedPct",
                "target",
                "performanceStatus",
              ])
            }
          >
            Export KPI results (CSV)
          </Button>
          <Button
            variant="secondary"
            icon={Download}
            onClick={() =>
              exportCSV(data.alignments, "alignment-actions.csv", [
                "counterpart",
                "topic",
                "meetingStatus",
                "dueDate",
                "completionStatus",
              ])
            }
          >
            Export alignments (CSV)
          </Button>
          <Button
            variant="secondary"
            icon={Printer}
            onClick={() => window.print()}
          >
            Print executive report
          </Button>
        </div>
        <div style={{ marginTop: 14 }}>
          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={() => {
              if (
                window.confirm(
                  "Reset the application to initial sample data? This will overwrite all current data."
                )
              )
                resetData();
            }}
          >
            Reset to initial data
          </Button>
        </div>
      </section>

      {importState && (
        <Modal
          open
          onClose={() => setImportState(null)}
          title={`Import "${importState.fileName}"`}
          width={480}
          footer={
            <>
              <Button variant="secondary" onClick={() => setImportState(null)}>
                Cancel
              </Button>
              <Button variant="secondary" onClick={() => doImport("merge")}>
                Merge
              </Button>
              <Button variant="danger" onClick={() => doImport("replace")}>
                Replace all data
              </Button>
            </>
          }
        >
          <p style={{ fontSize: 13.5, color: "#334155" }}>
            This file contains {importState.parsed.initiatives?.length ?? 0}{" "}
            initiatives, {importState.parsed.activities?.length ?? 0}{" "}
            activities, {importState.parsed.kpiResults?.length ?? 0} KPI
            results, {importState.parsed.risks?.length ?? 0} risk records, and{" "}
            {importState.parsed.alignments?.length ?? 0} alignment records.
          </p>
          <p style={{ fontSize: 13, color: "#a3271f" }}>
            Replacing will overwrite all current data. Merging will match
            records by ID.
          </p>
        </Modal>
      )}
    </div>
  );
}
