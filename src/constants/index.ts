/**
 * Application-wide constants and configuration values
 * 
 * This file centralizes all magic numbers, configuration values, and thresholds
 * used throughout the application for easy maintenance and tuning.
 */

import type { ScoringWeights, PrimaryGoal } from "../types";

/**
 * Scoring algorithm weights
 * Defines relative importance of each scoring dimension
 * Total must sum to 1.0
 */
export const SCORING_WEIGHTS: ScoringWeights = {
    reward: 0.35,      // Reward value is most important
    fee: 0.20,         // Fee efficiency is moderately important
    fit: 0.25,         // Personal fit matters significantly
    benefits: 0.15,    // Additional benefits add value
    approval: 0.05,    // Approval probability is least weighted
} as const;

/**
 * Score thresholds for categorization and normalization
 */
export const SCORE_THRESHOLDS = {
    /** Threshold for "High" approval probability */
    highApproval: 70,
    /** Threshold for "Moderate" approval probability */
    moderateApproval: 40,
    /** Maximum expected annual reward for normalization (INR) */
    maxAnnualReward: 20000,
    /** Maximum expected annual benefit for display */
    maxAnnualBenefit: 30000,
} as const;

/**
 * Display and UI constants
 */
export const DISPLAY_CONSTANTS = {
    /** Maximum number of cards to display in results */
    maxCardsDisplay: 5,
    /** Number of top reasons to show per card */
    maxReasonsDisplay: 4,
    /** Number of benefits to show in card preview */
    maxBenefitsPreview: 3,
} as const;

/**
 * User profile validation ranges
 */
export const VALIDATION_RANGES = {
    /** Minimum credit score value */
    minCreditScore: 300,
    /** Maximum credit score value */
    maxCreditScore: 900,
    /** Minimum valid age */
    minAge: 18,
    /** Maximum valid age */
    maxAge: 100,
    /** Minimum income for any card (INR) */
    minIncome: 0,
    /** Maximum reasonable income for validation (INR) */
    maxIncome: 10000000,
    /** Maximum number of existing cards */
    maxExistingCards: 10,
} as const;

/**
 * Scoring calculation constants
 */
export const SCORING_CONSTANTS = {
    /** Base score for personal fit calculation */
    baseFitScore: 50,
    /** Bonus points for occupation match */
    occupationMatchBonus: 20,
    /** Bonus points for age eligibility */
    ageEligibilityBonus: 10,
    /** Bonus points for goal alignment */
    goalAlignmentBonus: 15,
    /** Bonus points for platform match */
    platformMatchBonus: 10,
    /** Bonus points for banking relationship */
    bankingRelationshipBonus: 15,
    /** Bonus points for lifetime free cards */
    lifetimeFreeBonus: 25,
    /** Income buffer multiplier for high approval */
    highApprovalIncomeBuffer: 2.0,
    /** Income buffer multiplier for moderate approval */
    moderateApprovalIncomeBuffer: 1.3,
    /** Bonus points for complementary card type */
    complementaryBonus: 8,
} as const;

/**
 * Benefits valuation constants
 * Used to estimate monetary value of card benefits
 */
export const BENEFITS_VALUES = {
    /** Value per lounge visit (INR) */
    loungeVisitValue: 800,
    /** Quarterly lounge visits for frequent travelers */
    frequentTravelerVisits: 4,
    /** Quarterly lounge visits for occasional travelers */
    occasionalTravelerVisits: 2,
    /** Travel insurance value for frequent travelers (INR) */
    travelInsuranceValue: 2000,
    /** Estimated milestone reward value (INR) */
    milestoneRewardValue: 1500,
} as const;

/**
 * Popular shopping platforms in India
 * Used for platform matching in personal fit score
 */
export const SHOPPING_PLATFORMS = [
    "Amazon",
    "Flipkart",
    "Myntra",
    "Swiggy",
    "Zomato",
    "BigBasket",
    "BookMyShow",
    "MakeMyTrip",
    "Nykaa",
    "IRCTC",
] as const;

/**
 * Major banks in India
 * Used for banking relationship matching
 */
export const MAJOR_BANKS = [
    "HDFC",
    "ICICI",
    "SBI",
    "Axis",
    "Kotak",
    "IndusInd",
    "IDFC First",
    "Yes Bank",
    "Citibank",
    "Standard Chartered",
] as const;

/**
 * Age ranges for categorization
 */
export const AGE_RANGES = {
    student: { min: 18, max: 25 },
    youngProfessional: { min: 26, max: 35 },
    established: { min: 36, max: 50 },
    senior: { min: 51, max: 100 },
} as const;

/**
 * Income bucket thresholds (monthly, INR)
 * Defines the 4 tiers used by the recommendation engine.
 *
 * Bucket behaviour:
 * - secured_only: ₹0 – ₹10K  — skip engine, show secured/student cards
 * - limited:      >₹10K–₹20K — run engine with aggressive filter (top 3 only)
 * - normal:       >₹20K–₹2L  — normal flow
 * - premium:      >₹2L        — clamp to ₹10L, show all premium cards
 */
export const INCOME_BUCKETS = {
    /** Upper bound for secured-only tier (₹0–₹10K) */
    securedOnlyMax: 10_000,
    /** Upper bound for limited-results tier (>₹10K–₹20K) */
    limitedMax: 20_000,
    /** Upper bound for normal tier (>₹20K–₹2L) */
    normalMax: 200_000,
    /** Max minIncome allowed for limited-tier cards */
    limitedMaxCardIncome: 15_000,
    /** Max cards to show in limited-results tier */
    limitedMaxResults: 3,
} as const;

/**
 * Income input limits for the wizard income step
 *
 * - min: anything below this shows a warning and disables Continue
 * - cap: anything above this is silently clamped for the engine
 */
export const INCOME_INPUT_LIMITS = {
    /** Minimum sensible monthly income (₹1,000) */
    min: 1_000,
    /** Engine cap — amounts above map to the same premium outcome (₹10L) */
    cap: 1_000_000,
} as const;

/**
 * Spending category labels for display
 */
export const CATEGORY_LABELS = {
    online: "Online Shopping",
    foodDelivery: "Food Delivery",
    dining: "Dining Out",
    groceries: "Groceries",
    fuel: "Fuel",
    utilities: "Bills & Utilities",
    travel: "Travel & Hotels",
    emi: "EMI & Large Purchases",
    other: "Everything Else",
} as const;

/**
 * Pre-defined spending range slabs for UI selection
 */
export const SPENDING_SLABS = {
    online: [{ label: "None", value: 0 }, { label: "₹1-2K", value: 1500 }, { label: "₹2-5K", value: 3500 }, { label: "₹5-10K", value: 7500 }, { label: "₹10K+", value: 15000 }],
    foodDelivery: [{ label: "None", value: 0 }, { label: "₹500-1K", value: 750 }, { label: "₹1-3K", value: 2000 }, { label: "₹3-5K", value: 4000 }, { label: "₹5K+", value: 7500 }],
    dining: [{ label: "None", value: 0 }, { label: "₹500-1K", value: 750 }, { label: "₹1-3K", value: 2000 }, { label: "₹3-5K", value: 4000 }, { label: "₹5K+", value: 7500 }],
    groceries: [{ label: "None", value: 0 }, { label: "₹1-3K", value: 2000 }, { label: "₹3-5K", value: 4000 }, { label: "₹5-10K", value: 7500 }, { label: "₹10K+", value: 15000 }],
    fuel: [{ label: "None", value: 0 }, { label: "₹1-2K", value: 1500 }, { label: "₹2-5K", value: 3500 }, { label: "₹5-8K", value: 6500 }, { label: "₹8K+", value: 12000 }],
    utilities: [{ label: "None", value: 0 }, { label: "₹1-3K", value: 2000 }, { label: "₹3-5K", value: 4000 }, { label: "₹5-10K", value: 7500 }, { label: "₹10K+", value: 15000 }],
    travel: [{ label: "None", value: 0 }, { label: "₹1-3K", value: 2000 }, { label: "₹3-5K", value: 4000 }, { label: "₹5-10K", value: 7500 }, { label: "₹10K+", value: 15000 }],
    emi: [{ label: "None", value: 0 }, { label: "₹2-5K", value: 3500 }, { label: "₹5-10K", value: 7500 }, { label: "₹10-20K", value: 15000 }, { label: "₹20K+", value: 30000 }],
    other: [{ label: "None", value: 0 }, { label: "₹1-3K", value: 2000 }, { label: "₹3-5K", value: 4000 }, { label: "₹5-10K", value: 7500 }, { label: "₹10K+", value: 15000 }],
} as const;

/**
 * Default values for user profile initialization
 */
export const DEFAULT_VALUES = {
    age: 25,
    existingCardTypes: [] as import("../types").CardType[],
    airportLoungeImportance: 3 as const,
    travelFrequency: "occasional" as const,
    primaryGoals: ["cashback"] as PrimaryGoal[],
    feePreference: "lifetime_free" as const,
} as const;

/**
 * Animation and UI timing constants (milliseconds)
 */
export const ANIMATION_TIMING = {
    /** Standard transition duration */
    standardTransition: 300,
    /** Quick animation */
    quick: 150,
    /** Slow animation */
    slow: 500,
    /** Debounce delay for input */
    inputDebounce: 300,
} as const;

/**
 * Currency formatting locale
 */
export const LOCALE = "en-IN" as const;

/**
 * Currency code
 */
export const CURRENCY = "INR" as const;
