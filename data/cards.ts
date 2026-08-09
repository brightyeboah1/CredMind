// ─── CARD DATABASE ────────────────────────────────────────────────────────
// This is a static seed file for local development. In production, this
// data lives in Supabase's `credit_cards` table (see the schema doc) and
// gets fetched via lib/cards.ts. Keeping this file lets the app run and
// be previewed before Supabase is fully wired up.

export type CreditCard = {
  id: string;
  name: string;
  bank: string;
  type: "rewards" | "travel" | "cashback" | "premium" | "low_interest";
  network: "Visa" | "Mastercard" | "Amex";
  annualFee: number;
  annualFeeNote?: string;
  welcomeBonus: string;
  minSpend: number;
  minSpendPeriod: string;
  interestRate: number;
  rewards: Record<string, number>;
  rewardType: "points" | "cashback" | "miles" | "dollars" | "none";
  rewardProgram: string;
  insurance: string[];
  loungeAccess: string | false;
  creditScore: string;
  incomeReq: string;
  featured: boolean;
  featuredBonus: string | null;
  highlights: string[];
  balanceTransfer: boolean;
  btRate?: number;
  btMonths?: number;
  btFee?: number;
  // ─── Product-page detail (drop a photo at /public/cards/{id}.png) ────────
  image?: string;
  rating?: number;
  reviewCount?: number;
  pros?: string[];
  cons?: string[];
  fullDescription?: string;
  eligibility?: string[];
  fees?: { label: string; value: string }[];
  foreignTransactionFee?: number;
  instantApproval?: boolean;
};

export const CARDS: CreditCard[] = [
  {
    id: "amex-cobalt",
    name: "Amex Cobalt",
    bank: "American Express",
    type: "rewards",
    network: "Amex",
    annualFee: 155.88,
    annualFeeNote: "$12.99/mo",
    welcomeBonus: "Up to 15,000 MR points (1,250/mo for 12 months with $750/mo spend)",
    minSpend: 750,
    minSpendPeriod: "monthly",
    interestRate: 21.99,
    rewards: { dining: 5, groceries: 5, streaming: 3, transit: 2, travel: 2, gas: 2, other: 1 },
    rewardType: "points",
    rewardProgram: "Amex MR Points",
    insurance: ["Travel Medical", "Trip Cancellation", "Lost Baggage", "Purchase Protection"],
    loungeAccess: false,
    creditScore: "Good (660+)",
    incomeReq: "None stated",
    featured: true,
    featuredBonus: "$25",
    highlights: [
      "Best dining & food card in Canada",
      "5x on food delivery & restaurants",
      "MR points transfer to Aeroplan",
    ],
    balanceTransfer: false,
    image: "/cards/amex-cobalt.png",
    rating: 4.7,
    reviewCount: 1284,
    instantApproval: true,
    foreignTransactionFee: 2.5,
    pros: [
      "Highest everyday earn rate on food & drink of any Canadian card",
      "Monthly fee spreads the cost out instead of one annual hit",
      "MR points transfer 1:1 to Aeroplan and Marriott Bonvoy",
    ],
    cons: [
      "No lounge access",
      "2.5% foreign transaction fee applies like most non-premium cards",
      "Bonus caps at $750/mo spend — heavy spenders top out fast",
    ],
    fullDescription:
      "The Amex Cobalt is built around how people actually spend day-to-day — dining, groceries, and streaming — rather than travel perks few people use. It trades a traditional annual fee for a monthly one, which makes the cost easier to swallow and easy to cancel mid-year if it's not working out.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Age of majority in your province",
      "Good credit history recommended (660+)",
    ],
    fees: [
      { label: "Annual fee", value: "$155.88/yr ($12.99/mo)" },
      { label: "Additional card", value: "$0" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Cash advance", value: "22.99%" },
    ],
  },
  {
    id: "td-aeroplan-infinite",
    name: "TD Aeroplan Visa Infinite",
    bank: "TD Bank",
    type: "travel",
    network: "Visa",
    annualFee: 139,
    welcomeBonus: "Up to 50,000 Aeroplan points (first year fee rebated)",
    minSpend: 1000,
    minSpendPeriod: "first 3 months",
    interestRate: 20.99,
    rewards: { groceries: 1.5, gas: 1.5, air_canada: 3, dining: 1, travel: 1.5, other: 1 },
    rewardType: "points",
    rewardProgram: "Aeroplan",
    insurance: ["Travel Medical (21 days)", "Trip Cancellation", "Flight Delay", "Baggage"],
    loungeAccess: "Maple Leaf Lounges (same-day AC flight)",
    creditScore: "Good (660+)",
    incomeReq: "$60,000 personal / $100,000 household",
    featured: true,
    featuredBonus: "$20",
    highlights: [
      "Best Aeroplan earning outside co-brand",
      "Maple Leaf Lounge access",
      "Strong travel insurance suite",
    ],
    balanceTransfer: false,
    image: "/cards/td-aeroplan-infinite.png",
    rating: 4.5,
    reviewCount: 892,
    instantApproval: true,
    foreignTransactionFee: 2.5,
    pros: [
      "First-year annual fee is rebated, so the welcome bonus is effectively free",
      "Priority check-in, boarding, and Maple Leaf Lounge access on Air Canada",
      "Strong travel insurance suite for a mid-tier card",
    ],
    cons: [
      "Meaningful income requirement compared to no-fee alternatives",
      "Aeroplan point values fluctuate — best value is on Air Canada redemptions",
      "1x base earn rate on non-bonus categories",
    ],
    fullDescription:
      "TD's Aeroplan Visa Infinite is the strongest non-co-brand way to earn Aeroplan points, aimed at people who fly Air Canada a few times a year and want lounge access without the $799 Amex Platinum price tag.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Personal income of $60,000+ or household income of $100,000+",
      "Good to excellent credit (660+)",
    ],
    fees: [
      { label: "Annual fee", value: "$139/yr (rebated year 1)" },
      { label: "Additional card", value: "$50" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Cash advance", value: "22.99%" },
    ],
  },
  {
    id: "scotia-gold-amex",
    name: "Scotiabank Gold American Express",
    bank: "Scotiabank",
    type: "rewards",
    network: "Amex",
    annualFee: 120,
    welcomeBonus: "Up to 45,000 Scene+ points",
    minSpend: 1000,
    minSpendPeriod: "first 3 months",
    interestRate: 20.99,
    rewards: { dining: 6, groceries: 6, entertainment: 6, gas: 3, transit: 3, other: 1 },
    rewardType: "points",
    rewardProgram: "Scene+",
    insurance: ["Travel Medical", "Trip Cancellation", "Lost Baggage"],
    loungeAccess: false,
    creditScore: "Good (660+)",
    incomeReq: "None stated",
    featured: true,
    featuredBonus: "$20",
    highlights: [
      "6x on dining, groceries & entertainment",
      "No foreign transaction fees",
      "Scene+ redeemable at Cineplex, Empire",
    ],
    balanceTransfer: false,
    image: "/cards/scotia-gold-amex.png",
    rating: 4.6,
    reviewCount: 1043,
    instantApproval: true,
    foreignTransactionFee: 0,
    pros: [
      "One of only a handful of Canadian cards with no foreign transaction fee",
      "6x on three everyday categories most people spend heavily in",
      "Scene+ points are flexible — travel, Cineplex, Empire grocery brands, or cash back",
    ],
    cons: [
      "Amex acceptance is lower than Visa/Mastercard at some smaller merchants",
      "No lounge access or elevated travel insurance vs. the Passport Visa Infinite",
    ],
    fullDescription:
      "The Scotia Gold Amex pairs a high, broad earn rate with a genuinely rare perk: zero foreign transaction fees. For anyone who travels or shops cross-border online, that alone can outweigh a card with a flashier welcome bonus.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Age of majority in your province",
      "Good credit history recommended (660+)",
    ],
    fees: [
      { label: "Annual fee", value: "$120/yr" },
      { label: "Additional card", value: "$50" },
      { label: "Foreign transaction", value: "0%" },
      { label: "Cash advance", value: "22.99%" },
    ],
  },
  {
    id: "rbc-avion-infinite",
    name: "RBC Avion Visa Infinite",
    bank: "RBC",
    type: "travel",
    network: "Visa",
    annualFee: 120,
    welcomeBonus: "35,000 Avion points (first year fee rebated)",
    minSpend: 0,
    minSpendPeriod: "",
    interestRate: 20.99,
    rewards: { travel: 1.25, other: 1 },
    rewardType: "points",
    rewardProgram: "RBC Avion",
    insurance: ["Travel Medical (15 days)", "Trip Cancellation", "Flight Delay"],
    loungeAccess: false,
    creditScore: "Good (660+)",
    incomeReq: "$60,000 personal / $100,000 household",
    featured: false,
    featuredBonus: null,
    highlights: [
      "Flexible Avion points transfer to Avios, WestJet",
      "Strong welcome bonus, no min spend",
      "Comprehensive travel insurance",
    ],
    balanceTransfer: false,
    image: "/cards/rbc-avion-infinite.png",
    rating: 4.3,
    reviewCount: 611,
    instantApproval: false,
    foreignTransactionFee: 2.5,
    pros: [
      "Welcome bonus with zero minimum spend requirement",
      "Avion points transfer to British Airways Avios and WestJet dollars",
      "First-year fee rebate",
    ],
    cons: [
      "Base earn rate is just 1x outside travel purchases",
      "No lounge access at this tier",
    ],
    fullDescription:
      "RBC Avion Visa Infinite is a straightforward, flexible travel card — the points program has more transfer partners than most Canadian banks offer, which matters if you like to optimize redemptions rather than just book through a fixed travel portal.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Personal income of $60,000+ or household income of $100,000+",
      "Good credit history (660+)",
    ],
    fees: [
      { label: "Annual fee", value: "$120/yr (rebated year 1)" },
      { label: "Additional card", value: "$50" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Cash advance", value: "22.99%" },
    ],
  },
  {
    id: "amex-platinum",
    name: "Amex Platinum Canada",
    bank: "American Express",
    type: "premium",
    network: "Amex",
    annualFee: 799,
    welcomeBonus: "Up to 100,000 MR points",
    minSpend: 3000,
    minSpendPeriod: "first 3 months",
    interestRate: 0,
    rewards: { dining: 3, travel: 2, other: 1 },
    rewardType: "points",
    rewardProgram: "Amex MR Points",
    insurance: ["Comprehensive Travel Medical", "Trip Cancellation", "Flight Delay"],
    loungeAccess: "Unlimited Priority Pass + Centurion Lounges",
    creditScore: "Excellent (720+)",
    incomeReq: "None stated (charge card)",
    featured: true,
    featuredBonus: "$50",
    highlights: [
      "Best lounge access in Canada",
      "$200 annual travel credit",
      "Centurion Lounge access",
    ],
    balanceTransfer: false,
    image: "/cards/amex-platinum.png",
    rating: 4.8,
    reviewCount: 2107,
    instantApproval: false,
    foreignTransactionFee: 2.5,
    pros: [
      "Unlimited Priority Pass and Centurion Lounge access — the strongest in Canada",
      "$200 annual travel credit plus NEXUS application fee credit",
      "As a charge card, there's no preset spending limit or revolving interest rate",
    ],
    cons: [
      "$799 annual fee is only worth it if you actually use the lounge/travel perks",
      "Charge card — balance is due in full each month",
      "Excellent credit typically required to be approved",
    ],
    fullDescription:
      "The Amex Platinum is a lifestyle card more than a rewards-optimization card — it's built for people who travel enough to make lounge access, elite hotel status, and annual credits pay for themselves. It's overkill for anyone who isn't flying regularly.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Excellent credit history (720+)",
      "Charge card — full balance due monthly, subject to Amex's underwriting",
    ],
    fees: [
      { label: "Annual fee", value: "$799/yr" },
      { label: "Additional card", value: "$175" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Late payment", value: "Charge card — balance due in full" },
    ],
  },
  {
    id: "tangerine-moneyback",
    name: "Tangerine Money-Back",
    bank: "Tangerine",
    type: "cashback",
    network: "Mastercard",
    annualFee: 0,
    welcomeBonus: "10% cash back on first $1,000 (first 2 months)",
    minSpend: 1000,
    minSpendPeriod: "first 2 months",
    interestRate: 19.95,
    rewards: { categories_choice: 2, other: 0.5 },
    rewardType: "cashback",
    rewardProgram: "Cash Back",
    insurance: ["Purchase Protection (90 days)"],
    loungeAccess: false,
    creditScore: "Fair (600+)",
    incomeReq: "None stated",
    featured: false,
    featuredBonus: null,
    highlights: ["No annual fee", "Choose your own 2% categories", "True no-cost card"],
    balanceTransfer: false,
    image: "/cards/tangerine-moneyback.png",
    rating: 4.4,
    reviewCount: 1560,
    instantApproval: true,
    foreignTransactionFee: 2.5,
    pros: [
      "No annual fee, ever",
      "You choose which 2 (or 3, with a Tangerine chequing account) categories earn 2%",
      "Cash back pays out monthly, not just once a year",
    ],
    cons: [
      "Base rate outside chosen categories is a low 0.5%",
      "No travel insurance or purchase perks beyond 90-day protection",
    ],
    fullDescription:
      "The Tangerine Money-Back card is the simplest card on this list: no fee, no complicated points math, and you pick the categories that match how you actually spend. It's the card most people should default to if they don't want to think about credit cards at all.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Age of majority in your province",
      "Fair credit or better (600+)",
    ],
    fees: [
      { label: "Annual fee", value: "$0" },
      { label: "Additional card", value: "$0" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Cash advance", value: "22.95%" },
    ],
  },
  {
    id: "scotia-passport-infinite",
    name: "Scotiabank Passport Visa Infinite",
    bank: "Scotiabank",
    type: "travel",
    network: "Visa",
    annualFee: 150,
    welcomeBonus: "Up to 35,000 Scene+ points + first year fee waived",
    minSpend: 1000,
    minSpendPeriod: "first 3 months",
    interestRate: 20.99,
    rewards: { groceries: 3, dining: 3, entertainment: 3, transit: 3, other: 1 },
    rewardType: "points",
    rewardProgram: "Scene+",
    insurance: ["Travel Medical (25 days)", "Trip Cancellation", "Baggage"],
    loungeAccess: "6 complimentary Priority Pass visits/year",
    creditScore: "Good (660+)",
    incomeReq: "$60,000 personal / $100,000 household",
    featured: true,
    featuredBonus: "$20",
    highlights: [
      "No foreign transaction fees",
      "6 Priority Pass lounge visits",
      "Strong travel insurance (25 days)",
    ],
    balanceTransfer: false,
    image: "/cards/scotia-passport-infinite.png",
    rating: 4.6,
    reviewCount: 734,
    instantApproval: false,
    foreignTransactionFee: 0,
    pros: [
      "6 free Priority Pass lounge visits a year — rare at this fee tier",
      "No foreign transaction fee, unusual for a Visa Infinite card",
      "25 days of travel medical, longer than most mid-tier cards",
    ],
    cons: [
      "Income requirement locks out some applicants",
      "Lounge visits are capped at 6/year, not unlimited like Amex Platinum",
    ],
    fullDescription:
      "The Passport Visa Infinite punches above its $150 fee — it's one of the few cards in Canada combining no foreign transaction fees with real lounge access, making it a strong pick for frequent travelers who don't want to pay premium-card prices.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Personal income of $60,000+ or household income of $100,000+",
      "Good credit history (660+)",
    ],
    fees: [
      { label: "Annual fee", value: "$150/yr (waived year 1)" },
      { label: "Additional card", value: "$50" },
      { label: "Foreign transaction", value: "0%" },
      { label: "Cash advance", value: "22.99%" },
    ],
  },
  // Balance transfer / low-interest cards
  {
    id: "mbna-trueline",
    name: "MBNA True Line Mastercard",
    bank: "MBNA",
    type: "low_interest",
    network: "Mastercard",
    annualFee: 0,
    welcomeBonus: "0% balance transfer for 12 months (3% transfer fee)",
    minSpend: 0,
    minSpendPeriod: "",
    interestRate: 12.99,
    rewards: { other: 0 },
    rewardType: "none",
    rewardProgram: "None",
    insurance: [],
    loungeAccess: false,
    creditScore: "Good (660+)",
    incomeReq: "None stated",
    featured: true,
    featuredBonus: "$20",
    highlights: [
      "No annual fee — best free balance transfer card",
      "0% for 12 months (longest in Canada)",
      "12.99% ongoing — well below average",
    ],
    balanceTransfer: true,
    btRate: 0,
    btMonths: 12,
    btFee: 3,
    image: "/cards/mbna-trueline.png",
    rating: 4.2,
    reviewCount: 388,
    instantApproval: true,
    foreignTransactionFee: 2.5,
    pros: [
      "Longest 0% balance transfer window available in Canada (12 months)",
      "No annual fee",
      "12.99% ongoing rate is well below the ~20% most cards charge",
    ],
    cons: [
      "No rewards program at all",
      "3% one-time fee on the transferred balance",
    ],
    fullDescription:
      "True Line exists for one job: getting high-interest debt off a 20%+ card and onto something you can actually pay down. There's no rewards program to distract from that — it's the cheapest way in Canada to buy yourself 12 interest-free months.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Good credit history (660+)",
      "Balance transfers typically must be completed within 30–90 days of approval",
    ],
    fees: [
      { label: "Annual fee", value: "$0" },
      { label: "Balance transfer fee", value: "3% one-time" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Cash advance", value: "24.99%" },
    ],
  },
  {
    id: "cibc-select",
    name: "CIBC Select Visa Card",
    bank: "CIBC",
    type: "low_interest",
    network: "Visa",
    annualFee: 29,
    welcomeBonus: "0% balance transfer for 10 months (3% transfer fee)",
    minSpend: 0,
    minSpendPeriod: "",
    interestRate: 13.99,
    rewards: { other: 0 },
    rewardType: "none",
    rewardProgram: "None",
    insurance: ["Purchase Protection"],
    loungeAccess: false,
    creditScore: "Good (660+)",
    incomeReq: "None stated",
    featured: true,
    featuredBonus: "$20",
    highlights: [
      "0% balance transfer for 10 months",
      "Lowest ongoing rate at 13.99%",
      "Great for consolidating high-interest debt",
    ],
    balanceTransfer: true,
    btRate: 0,
    btMonths: 10,
    btFee: 3,
    image: "/cards/cibc-select.png",
    rating: 4.1,
    reviewCount: 302,
    instantApproval: true,
    foreignTransactionFee: 2.5,
    pros: [
      "Lowest ongoing interest rate of any card on this list (13.99%)",
      "Purchase protection included despite the low fee",
      "$29/yr is cheap insurance if you carry a balance past the promo period",
    ],
    cons: [
      "Small annual fee, unlike MBNA True Line",
      "Shorter 0% window (10 months) than True Line's 12",
    ],
    fullDescription:
      "CIBC Select trades a small $29 annual fee for the lowest ongoing purchase rate of any card here — useful if there's a real chance you won't clear the transferred balance inside the promotional window.",
    eligibility: [
      "Canadian resident with a valid SIN",
      "Good credit history (660+)",
      "Balance transfers typically must be completed within 30–90 days of approval",
    ],
    fees: [
      { label: "Annual fee", value: "$29/yr" },
      { label: "Balance transfer fee", value: "3% one-time" },
      { label: "Foreign transaction", value: "2.5%" },
      { label: "Cash advance", value: "24.99%" },
    ],
  },
];

export const BANKS = [...new Set(CARDS.map((c) => c.bank))];
export const CARD_TYPES = ["travel", "cashback", "rewards", "premium", "low_interest"] as const;
