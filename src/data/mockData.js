// Mock data for Waste Segregation at Source system
// Specifically includes required benchmarks for House #1027 and ward datasets

export const HOUSEHOLD_PRESETS = [
  {
    id: "HH-1027",
    name: "Arjun & Priya Sharma",
    address: "Flat 402, Green Meadows Apt, Sector 14",
    ward: "Ward 12 - Indiranagar",
    phone: "+91 98765 43210",
    green_points: 380,
    current_streak: 8,
    best_streak: 19,
    status: "Good Standing",
    tier: "Gold Eco-Citizen",
    violations_count: 1,
    last_pickup: "Today, 08:30 AM",
    registered_at: "2025-11-12",
  },
  {
    id: "HH-2041",
    name: "Meera Krishnan",
    address: "Villa 18, Palm Grove Layout",
    ward: "Ward 12 - Indiranagar",
    phone: "+91 98450 11223",
    green_points: 620,
    current_streak: 24,
    best_streak: 30,
    status: "Top Segregator",
    tier: "Platinum Green Champion",
    violations_count: 0,
    last_pickup: "Today, 08:42 AM",
    registered_at: "2025-08-01",
  },
  {
    id: "HH-3089",
    name: "Vikram & Ananya Roy",
    address: "House 55, 3rd Cross, 8th Main",
    ward: "Ward 07 - Koramangala",
    phone: "+91 97110 88990",
    green_points: 90,
    current_streak: 0,
    best_streak: 6,
    status: "Frequent Contamination",
    tier: "Silver Citizen",
    violations_count: 3,
    last_pickup: "Yesterday, 09:15 AM",
    registered_at: "2026-01-10",
  }
];

export const TRAY_ANALYSIS_PRESETS = [
  {
    id: "preset-banana-dry",
    title: "Dry Stream + Banana Peel Contamination",
    house_id: "HH-1027",
    stream: "Dry Waste",
    score: 72,
    status: "Partially Compliant",
    confidence: 0.942,
    contamination_pct: 18.5,
    summary: "Organic food waste (banana peel) detected in dry recyclables tray.",
    items: [
      { name: "Cardboard Box", category: "Dry", compliant: true, confidence: 0.98, box: [20, 25, 45, 60] },
      { name: "Plastic Bottle (PET)", category: "Dry", compliant: true, confidence: 0.96, box: [50, 60, 75, 80] },
      { name: "Aluminium Can", category: "Dry", compliant: true, confidence: 0.92, box: [65, 30, 85, 50] }
    ],
    contaminants: [
      { name: "Banana Peel (Organic)", category: "Wet Waste", severity: "Medium", suggestion: "Transfer to green wet waste bin for composting", box: [30, 45, 55, 70] }
    ],
    points_delta: 2,
    streak_delta: 0, // Streak holds
    message: "Minor contamination: Streak maintained! Tip: Organic peels belong in the Green Bin.",
    sample_image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "preset-clean-segregated",
    title: "Clean Dry Segregation (96/100 Benchmark)",
    house_id: "HH-1027",
    stream: "Dry Waste",
    score: 96,
    status: "Compliant",
    confidence: 0.987,
    contamination_pct: 2.1,
    summary: "Exemplary dry segregation. Clean paper, cardboard, and recyclable plastic bottles.",
    items: [
      { name: "Newspaper Stack", category: "Dry", compliant: true, confidence: 0.99, box: [15, 15, 45, 50] },
      { name: "Clean HDPE Bottle", category: "Dry", compliant: true, confidence: 0.97, box: [50, 20, 80, 55] },
      { name: "Flattened Cardboard", category: "Dry", compliant: true, confidence: 0.98, box: [25, 55, 75, 90] }
    ],
    contaminants: [],
    points_delta: 10,
    streak_delta: 1, // Streak increases
    message: "Perfect segregation! +10 Green Points added and 1 day added to your streak.",
    sample_image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "preset-severe-hazardous",
    title: "Severe Contamination (Hazardous Batteries in Wet)",
    house_id: "HH-3089",
    stream: "Wet Waste",
    score: 48,
    status: "Non-compliant",
    confidence: 0.965,
    contamination_pct: 35.0,
    summary: "Severe hazard! Household lithium batteries mixed inside organic wet waste.",
    items: [
      { name: "Vegetable Scraps", category: "Wet", compliant: true, confidence: 0.95, box: [20, 20, 60, 60] },
      { name: "Cooked Rice Waste", category: "Wet", compliant: true, confidence: 0.93, box: [50, 45, 80, 85] }
    ],
    contaminants: [
      { name: "Lithium AA Batteries", category: "Hazardous / E-Waste", severity: "Critical", suggestion: "Wrap in red cover and dispose only on Hazardous collection days", box: [35, 30, 55, 50] }
    ],
    points_delta: -10,
    streak_delta: -8, // Streak resets
    message: "Contaminated pickup. Streak reset. Warning issued: Hazardous items pose safety risks.",
    sample_image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80"
  }
];

export const HOUSEHOLD_HISTORY_DATA = {
  "HH-1027": [
    {
      collection_id: "COL-8921",
      timestamp: "2026-09-20 08:30 AM",
      date: "2026-09-20",
      stream: "Dry Waste",
      score: 96,
      status: "Compliant",
      points_earned: 10,
      streak_count: 8,
      collector_id: "COL-TRUCK-04",
      items_count: 5,
      contaminants_count: 0,
      image: "https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&w=800&q=80"
    },
    {
      collection_id: "COL-8840",
      timestamp: "2026-09-19 08:35 AM",
      date: "2026-09-19",
      stream: "Dry Waste",
      score: 72,
      status: "Partially Compliant",
      points_earned: 2,
      streak_count: 7,
      collector_id: "COL-TRUCK-04",
      items_count: 4,
      contaminants_count: 1,
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"
    },
    {
      collection_id: "COL-8712",
      timestamp: "2026-09-18 08:28 AM",
      date: "2026-09-18",
      stream: "Wet Waste",
      score: 94,
      status: "Compliant",
      points_earned: 10,
      streak_count: 7,
      collector_id: "COL-TRUCK-04",
      items_count: 6,
      contaminants_count: 0,
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
    },
    {
      collection_id: "COL-8601",
      timestamp: "2026-09-17 08:40 AM",
      date: "2026-09-17",
      stream: "Recyclables",
      score: 91,
      status: "Compliant",
      points_earned: 10,
      streak_count: 6,
      collector_id: "COL-TRUCK-04",
      items_count: 8,
      contaminants_count: 0,
      image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=800&q=80"
    },
    {
      collection_id: "COL-8499",
      timestamp: "2026-09-16 08:31 AM",
      date: "2026-09-16",
      stream: "Dry Waste",
      score: 51,
      status: "Non-compliant",
      points_earned: -10,
      streak_count: 0,
      collector_id: "COL-TRUCK-04",
      items_count: 7,
      contaminants_count: 2,
      image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=800&q=80"
    },
    {
      collection_id: "COL-8380",
      timestamp: "2026-09-15 08:33 AM",
      date: "2026-09-15",
      stream: "Wet Waste",
      score: 48,
      status: "Non-compliant",
      points_earned: -10,
      streak_count: 0,
      collector_id: "COL-TRUCK-04",
      items_count: 5,
      contaminants_count: 2,
      image: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?auto=format&fit=crop&w=800&q=80"
    }
  ]
};

export const BADGES_DATA = [
  {
    id: "badge-7d",
    title: "7-Day Green Streak",
    icon: "🔥",
    description: "Maintained 7 consecutive clean segregation pickups.",
    unlocked: true,
    unlocked_on: "2026-09-19",
    category: "Streak"
  },
  {
    id: "badge-dry-master",
    title: "Dry Stream Specialist",
    icon: "📦",
    description: "Scored 90+ in dry waste 10 times in a row.",
    unlocked: true,
    unlocked_on: "2026-09-18",
    category: "Mastery"
  },
  {
    id: "badge-30d",
    title: "30-Day Eco Champion",
    icon: "🏆",
    description: "Earn 10% property tax / utility rebate coupon.",
    unlocked: false,
    progress: 8,
    max_progress: 30,
    category: "Rebate"
  },
  {
    id: "badge-zero-e-waste",
    title: "Hazard Shield",
    icon: "🛡️",
    description: "Safely disposed all electronics on designated pickup days.",
    unlocked: false,
    progress: 3,
    max_progress: 5,
    category: "Safety"
  }
];

export const REWARDS_CATALOG = [
  {
    id: "rew-1",
    title: "₹150 Municipal Water Bill Credit",
    points_required: 300,
    category: "Utility Rebate",
    icon: "💧",
    popular: true,
    description: "Applied directly to your next month BBMP / Municipal water invoice."
  },
  {
    id: "rew-2",
    title: "Free Aerobic Kitchen Composting Starter Kit",
    points_required: 450,
    category: "Home Eco",
    icon: "🌱",
    popular: true,
    description: "Includes compost powder, aerated bin and step-by-step handbook."
  },
  {
    id: "rew-3",
    title: "20% Organic Produce Voucher (BigBasket/Local Farm)",
    points_required: 200,
    category: "Groceries",
    icon: "🥬",
    popular: false,
    description: "Redeemable on certified organic vegetables and groceries."
  },
  {
    id: "rew-4",
    title: "10% Property Tax Green Citizen Rebate",
    points_required: 1000,
    category: "Tax Benefit",
    icon: "🏛️",
    popular: true,
    description: "Official municipal property tax concession for 90-day compliant homes."
  }
];

export const ADMIN_ANALYTICS_DATA = {
  overview: {
    total_households: 28450,
    active_daily_pickups: 24810,
    city_compliance_rate: 82.4, // %
    green_points_issued: 384920,
    contamination_prevented_tons: 142.8,
    active_penalties_issued: 84
  },
  wards: [
    { ward_id: "W-12", name: "Indiranagar", households: 4200, compliance_rate: 89.2, contamination_rate: 10.8, streak_avg: 14.2, status: "Excellent" },
    { ward_id: "W-07", name: "Koramangala", households: 5100, compliance_rate: 84.5, contamination_rate: 15.5, streak_avg: 11.8, status: "Good" },
    { ward_id: "W-04", name: "Jayanagar", households: 6400, compliance_rate: 91.0, contamination_rate: 9.0, streak_avg: 16.5, status: "Top Performer" },
    { ward_id: "W-19", name: "Whitefield Tech Park Zone", households: 4800, compliance_rate: 76.1, contamination_rate: 23.9, streak_avg: 7.4, status: "Needs Improvement" },
    { ward_id: "W-22", name: "Electronic City Phase 1", households: 3950, compliance_rate: 71.8, contamination_rate: 28.2, streak_avg: 5.9, status: "Attention Required" },
    { ward_id: "W-02", name: "Malleshwaram", households: 4000, compliance_rate: 88.6, contamination_rate: 11.4, streak_avg: 13.9, status: "Good" }
  ],
  stream_breakdown: [
    { stream: "Wet (Organic)", compliance: 88.4, volume_share: 52 },
    { stream: "Dry (Recyclables)", compliance: 81.2, volume_share: 34 },
    { stream: "Hazardous & E-Waste", compliance: 74.0, volume_share: 8 },
    { stream: "Sanitary / Inert", compliance: 85.6, volume_share: 6 }
  ],
  repeat_violators: [
    { id: "HH-3089", name: "Vikram & Ananya Roy", ward: "Ward 07 - Koramangala", violations_count: 3, last_violation: "Yesterday (Hazardous in Wet)", penalty_status: "Pending Warning #3" },
    { id: "HH-5112", name: "Suresh & Malini Rao", ward: "Ward 22 - Electronic City", violations_count: 4, last_violation: "2 days ago (Wet in Dry)", penalty_status: "Penalty Review Triggered" },
    { id: "HH-9021", name: "Apex Residency Tower B", ward: "Ward 19 - Whitefield", violations_count: 5, last_violation: "Today (Mixed Waste)", penalty_status: "Escalated Fine ₹500" }
  ]
};

export const DEFAULT_MUNICIPAL_POLICY = {
  penalty_enabled: true,
  warn_after_n: 2, // Violations before financial penalty
  penalty_fine_amount: 250, // INR
  compliant_score_min: 85,
  partial_score_min: 60,
  compliant_points_reward: 10,
  partial_points_reward: 2,
  non_compliant_points_penalty: -10,
  appeals_allowed: true
};
