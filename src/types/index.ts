/**
 * Central type definitions for the Credit Card Recommendation System
 * 
 * This file contains all TypeScript interfaces, types, and enums used throughout
 * the application to ensure type safety and consistency.
 */

/**
 * User's occupation type - determines eligibility and personal fit scoring
 */
export type Occupation = "Student" | "Salaried" | "Self-Employed" | "Business";

/**
 * Credit score range selected by the user
 */
export type CreditScoreRange = "poor" | "fair" | "good" | "excellent" | "dont_know";

/**
 * How frequently the user travels
 */
export type TravelFrequency = "none" | "occasional" | "frequent";

/**
 * User's primary goal for getting a credit card
 */
export type PrimaryGoal = "cashback" | "rewards" | "travel" | "building_credit";

/**
 * User's preference regarding annual fees
 */
export type FeePreference = "lifetime_free" | "low_fee" | "dont_mind";

/**
 * How difficult it is to get approval for a card
 */
export type ApprovalDifficulty = "easy" | "moderate" | "difficult";

/**
 * Approval probability label for display
 */
export type ApprovalLabel = "High" | "Moderate" | "Low";

/**
 * Card type categorization
 */
export type CardType = "cashback" | "rewards" | "travel" | "fuel" | "shopping" | "lifestyle";

/**
 * User's spending pattern across different categories
 * All values are monthly amounts in INR
 */
export interface SpendingProfile {
    /** Online shopping (Amazon, Flipkart, etc.) */
    online: number;
    /** Dining out at restaurants and cafes */
    dining: number;
    /** Food delivery (Swiggy, Zomato, etc.) */
    foodDelivery: number;
    /** Groceries (BigBasket, Blinkit, local stores) */
    groceries: number;
    /** Fuel and gas station purchases */
    fuel: number;
    /** Bills, utilities, phone recharges */
    utilities: number;
    /** Travel bookings, hotels, flights */
    travel: number;
    /** EMI and large purchases */
    emi: number;
    /** All other spending */
    other: number;
}

/**
 * Complete user profile with demographics, financials, and preferences
 * Used for matching against credit card criteria and calculating scores
 */
export interface UserProfile {
    // Demographics
    /** User's occupation type */
    occupation: Occupation;
    /** User's age in years (18-100) */
    age: number;

    // Financial Information
    /** Monthly take-home income in INR */
    monthlyIncome: number;
    /** Monthly spending breakdown by category */
    spending: SpendingProfile;
    /** Optional credit score (300-900 range) */
    creditScore?: number;
    /** Number of existing credit cards (0-5+) */
    existingCardsCount: number;
    /** Banks where user has existing accounts */
    bankAccounts: string[];

    // Lifestyle Preferences
    /** How often the user travels */
    travelFrequency: TravelFrequency;
    /** Importance of airport lounge access (1=not important, 5=very important) */
    airportLoungeImportance: 1 | 2 | 3 | 4 | 5;
    /** Primary shopping platforms user frequents */
    primaryShoppingPlatforms: string[];

    // Goals and Preferences
    /** Primary reasons for getting a credit card (max 2) */
    primaryGoals: PrimaryGoal[];
    /** Preference regarding annual fees */
    feePreference: FeePreference;
}

/**
 * Reward caps for specific categories
 * Defines monthly or quarterly limits on reward earning
 */
export interface RewardCaps {
    online?: number;
    dining?: number;
    fuel?: number;
    utilities?: number;
    travel?: number;
}

/**
 * Credit card data model with comprehensive attributes
 * Represents a single credit card with all its features and requirements
 */
export interface CreditCard {
    // Basic Information
    /** Unique identifier for the card */
    id: string;
    /** Card name (e.g., "Millennia", "Amazon Pay") */
    name: string;
    /** Issuing bank name */
    issuer: string;
    /** URL to card image */
    image: string;
    /** Card type categorization */
    type: CardType;

    // Eligibility Criteria
    /** Minimum monthly income required in INR */
    minIncome: number;
    /** Minimum age requirement */
    minAge: number;
    /** Maximum age limit */
    maxAge: number;
    /** Target user occupation types */
    targetUserTypes: Occupation[];
    /** How difficult is approval */
    approvalDifficulty: ApprovalDifficulty;

    // Fees and Charges
    /** Annual fee amount in INR */
    annualFee: number;
    /** Annual spending required for fee waiver (0 if not applicable) */
    annualFeeWaiver: number;

    // Rewards Structure
    /** Reward multipliers (%) for each spending category */
    categories: {
        online?: number;
        dining?: number;
        foodDelivery?: number;
        groceries?: number;
        fuel?: number;
        utilities?: number;
        travel?: number;
        emi?: number;
        other: number;
    };
    /** Optional reward caps by category */
    rewardCaps?: RewardCaps;

    // Benefits and Features
    /** List of key benefits and features */
    benefits: string[];
    /** Number of complimentary lounge visits per quarter */
    loungeAccess: number;
    /** Quick tags for card positioning */
    bestFor: string[];
    /** Supported shopping platforms for bonus rewards */
    supportedPlatforms?: string[];

    // Application
    /** URL to apply for the card */
    applyUrl: string;
}

/**
 * Detailed breakdown of how a card scored across all dimensions
 * All scores are on a 0-100 scale
 */
export interface CardScoreBreakdown {
    /** Reward value score (0-100) */
    rewardScore: number;
    /** Fee efficiency score (0-100) */
    feeScore: number;
    /** Personal fit score (0-100) */
    fitScore: number;
    /** Benefits value score (0-100) */
    benefitsScore: number;
    /** Approval probability score (0-100) */
    approvalScore: number;
    /** Total weighted score (0-100) */
    totalScore: number;
}

/**
 * Credit card with ranking information for display
 * Extends CreditCard with calculated scores and recommendation reasoning
 */
export interface RankedCard extends CreditCard {
    /** Score breakdown across all dimensions */
    scoreBreakdown: CardScoreBreakdown;
    /** Human-readable reasons why this card is recommended */
    reasoning: string[];
    /** Net annual monetary benefit in INR (rewards - fees) */
    netAnnualBenefit: number;
    /** Approval probability label for display */
    approvalProbability: ApprovalLabel;
    /** Rank position (1 = best match) */
    rank: number;
}

/**
 * Configuration for scoring algorithm weights
 * Defines relative importance of each scoring dimension
 * All weights should sum to 1.0
 */
export interface ScoringWeights {
    /** Weight for reward value (default: 0.35) */
    reward: number;
    /** Weight for fee efficiency (default: 0.20) */
    fee: number;
    /** Weight for personal fit (default: 0.25) */
    fit: number;
    /** Weight for benefits value (default: 0.15) */
    benefits: number;
    /** Weight for approval probability (default: 0.05) */
    approval: number;
}

/**
 * Option for selection components
 * Generic interface for any selectable option with display properties
 */
export interface SelectOption {
    /** Unique identifier */
    id: string;
    /** Display label */
    label: string;
    /** Optional icon string (emoji) */
    icon?: string;
    /** Optional description text */
    description?: string;
}
