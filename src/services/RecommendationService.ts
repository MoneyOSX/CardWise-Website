/**
 * Enhanced Credit Card Recommendation Engine
 * 
 * This module implements a sophisticated multi-dimensional scoring algorithm
 * that evaluates credit cards across 5 key dimensions to provide personalized
 * recommendations based on user profile and preferences.
 */

import type {
    UserProfile,
    RankedCard,
    CardScoreBreakdown,
    CreditCard,
    ApprovalLabel,
    SpendingProfile
} from "../types";
import {
    SCORING_WEIGHTS,
    SCORE_THRESHOLDS,
    DISPLAY_CONSTANTS,
    BENEFITS_VALUES,
    SCORING_CONSTANTS
} from "../constants";
import { clamp, normalizeScore, getArrayIntersection, clampIncomeForEngine, getIncomeBucket } from "../utils/helpers";
import { INCOME_BUCKETS } from "../constants";
import type { RecommendationResult, IncomeBucket } from "../types";

/**
 * Calculates total annual spending from a user's monthly spending profile.
 */
function calculateTotalAnnualSpend(spending: SpendingProfile): number {
    return Object.values(spending).reduce((sum, amt) => sum + amt, 0) * 12;
}

/**
 * Calculates total annual reward value for a card given spending patterns.
 */
function calculateAnnualRewards(card: CreditCard, spending: SpendingProfile): number {
    let total = 0;
    for (const [category, monthlySpend] of Object.entries(spending)) {
        const cat = category as keyof SpendingProfile;
        const rewardRate = card.categories[cat] || card.categories.other;
        const annualSpend = monthlySpend * 12;
        const reward = calculateCappedReward(
            annualSpend,
            rewardRate,
            (card.rewardCaps as Record<string, number | undefined> | undefined)?.[cat]
        );
        total += reward;
    }
    return total;
}

/**
 * Checks if user has an existing banking relationship with the card issuer.
 */
function hasBankingRelationship(bankAccounts: string[], issuer: string): boolean {
    return bankAccounts.some(bank =>
        issuer.toLowerCase().includes(bank.toLowerCase())
    );
}

/**
 * Main recommendation function that orchestrates the entire scoring process
 * 
 * @param userProfile - Complete user profile with all preferences
 * @param allCards - Array of all available credit cards
 * @returns Sorted array of top 5 recommended cards with scores and reasoning
 * 
 * @example
 * const recommendations = rankCards(userProfile, cards);
 * recommendations[0].scoreBreakdown.totalScore // 87.5
 */
export function rankCards(
    userProfile: UserProfile,
    allCards: CreditCard[]
): RecommendationResult {
    const rawIncome = userProfile.monthlyIncome;
    const bucket: IncomeBucket = getIncomeBucket(rawIncome);
    const effectiveIncome = clampIncomeForEngine(rawIncome);

    // Create a modified profile with effective income for internal calculations
    const effectiveProfile = {
        ...userProfile,
        monthlyIncome: effectiveIncome
    };

    // Filter out cards the user already owns
    const ownedIds = new Set(userProfile.existingCardIds ?? []);
    const availableCards = ownedIds.size > 0
        ? allCards.filter(c => !ownedIds.has(c.id))
        : allCards;

    let resultCards: RankedCard[] = [];
    let limitedResults = false;
    let note = "";

    // 1. Bucket-specific logic
    if (bucket === "secured_only") {
        // Skip engine. Show secured/student/easy cards only.
        const securedCards = availableCards.filter(card =>
            card.minIncome <= 10000 ||
            (card.approvalDifficulty === "easy" && card.annualFee === 0) ||
            card.targetUserTypes.includes("Student")
        );

        resultCards = scoreAndRankCards(securedCards, effectiveProfile, allCards).slice(0, 5);
        note = "Showing entry-level cards perfect for building credit.";
    } else {
        // Run engine with bucket-specific filters
        let eligibleCards = filterEligibleCards(availableCards, effectiveProfile);

        if (bucket === "limited") {
            // Aggressive filter for limited results
            eligibleCards = eligibleCards.filter(card =>
                card.minIncome <= INCOME_BUCKETS.limitedMaxCardIncome
            );
            limitedResults = true;
            note = "Showing limited results best suited for your income level.";
        }

        resultCards = scoreAndRankCards(eligibleCards, effectiveProfile, allCards);

        // Cap limited results
        if (bucket === "limited") {
            resultCards = resultCards.slice(0, INCOME_BUCKETS.limitedMaxResults);
        } else {
            resultCards = resultCards.slice(0, DISPLAY_CONSTANTS.maxCardsDisplay);
        }
    }

    // 2. Zero-results fallback
    if (resultCards.length === 0) {
        const fallbacks = availableCards.filter(card =>
            card.minIncome <= 15000 ||
            card.approvalDifficulty === "easy" ||
            card.targetUserTypes.includes("Student")
        );
        resultCards = scoreAndRankCards(fallbacks, effectiveProfile, allCards).slice(0, 3);
        note = "We've matched you with these highly-accessible cards to get you started.";
    }

    return {
        cards: resultCards,
        incomeBucket: bucket,
        limitedResults,
        note
    };
}

/**
 * Shared logic for scoring, reasoning, and ranking a subset of cards
 */
function scoreAndRankCards(cardsToRank: CreditCard[], profile: UserProfile, allCards: CreditCard[]): RankedCard[] {
    const scored = cardsToRank.map((card) => {
        const scoreBreakdown = calculateCardScore(card, profile, allCards);
        const netAnnualBenefit = calculateNetAnnualBenefit(card, profile);
        const reasoning = generateReasoning(card, profile, scoreBreakdown, netAnnualBenefit, allCards);
        const approvalProbability = getApprovalProbabilityLabel(scoreBreakdown.approvalScore);

        return {
            ...card,
            scoreBreakdown,
            reasoning,
            netAnnualBenefit,
            approvalProbability,
            rank: 0,
        } as RankedCard;
    });

    return scored
        .sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore)
        .map((card, index) => ({
            ...card,
            rank: index + 1,
        }));
}

/**
 * Filters cards based on hard eligibility criteria
 * 
 * @param cards - Array of cards to filter
 * @param profile - User profile to check against
 * @returns Array of eligible cards
 */
function filterEligibleCards(
    cards: CreditCard[],
    profile: UserProfile
): CreditCard[] {
    return cards.filter((card) => {
        // Income eligibility
        if (card.minIncome > profile.monthlyIncome) return false;

        // Age eligibility
        if (profile.age < card.minAge || profile.age > card.maxAge) return false;

        return true;
    });
}

/**
 * Calculates comprehensive score for a single card
 * 
 * @param card - Credit card to score
 * @param profile - User profile to score against
 * @returns Complete scoring breakdown with total score
 */
function calculateCardScore(
    card: CreditCard,
    profile: UserProfile,
    allCards: CreditCard[]
): CardScoreBreakdown {
    // Calculate individual dimension scores (0-100 each)
    const rewardScore = calculateRewardScore(card, profile.spending);
    const feeScore = calculateFeeScore(card, profile);
    const fitScore = calculateFitScore(card, profile, allCards);
    const benefitsScore = calculateBenefitsScore(card, profile);
    const approvalScore = calculateApprovalScore(card, profile);

    // Calculate weighted total score
    const totalScore =
        rewardScore * SCORING_WEIGHTS.reward +
        feeScore * SCORING_WEIGHTS.fee +
        fitScore * SCORING_WEIGHTS.fit +
        benefitsScore * SCORING_WEIGHTS.benefits +
        approvalScore * SCORING_WEIGHTS.approval;

    return {
        rewardScore,
        feeScore,
        fitScore,
        benefitsScore,
        approvalScore,
        totalScore: Math.round(totalScore * 10) / 10, // Round to 1 decimal
    };
}

/**
 * Calculates annual reward value based on user's spending patterns
 * Applies category-specific multipliers and respects reward caps
 * 
 * @param card - Credit card with reward rates and caps
 * @param spending - User's monthly spending by category
 * @returns Score from 0-100 representing reward value
 * 
 * Algorithm:
 * 1. Iterate through each spending category
 * 2. Apply card's reward multiplier for that category
 * 3. Apply reward cap if exists
 * 4. Sum annual rewards across all categories
 * 5. Normalize to 0-100 scale (max ₹20,000 annual reward)
 */
function calculateRewardScore(
    card: CreditCard,
    spending: SpendingProfile
): number {
    const annualRewardValue = calculateAnnualRewards(card, spending);
    return normalizeScore(annualRewardValue, SCORE_THRESHOLDS.maxAnnualReward);
}

/**
 * Evaluates how good the card's fee structure is for the user
 * Considers fee waivers and user's fee preference
 * 
 * @param card - Credit card with fee structure
 * @param profile - User profile with spending and preferences
 * @returns Score from 0-100 representing fee efficiency
 * 
 * Algorithm:
 * 1. Calculate if user qualifies for fee waiver
 * 2. Determine actual annual fee user will pay
 * 3. Match against user's fee preference
 * 4. Bonus points for lifetime free cards
 * 5. Normalize based on fee amount
 */
function calculateFeeScore(
    card: CreditCard,
    profile: UserProfile
): number {
    const totalAnnualSpend = calculateTotalAnnualSpend(profile.spending);

    // Check if fee waiver applies
    const feeWaived = card.annualFeeWaiver > 0 && totalAnnualSpend >= card.annualFeeWaiver;
    const actualFee = feeWaived ? 0 : card.annualFee;

    let score = 100;

    // Lifetime free cards get maximum score
    if (card.annualFee === 0) {
        score = 100;
    }
    // Fee waived cards get high score
    else if (feeWaived) {
        score = 90;
    }
    // Otherwise, score based on fee amount
    else {
        // Penalize based on fee (₹5000 fee = 0 points, ₹0 = 100 points)
        score = Math.max(0, 100 - (actualFee / 50));
    }

    // Adjust based on user's fee preference
    if (profile.feePreference === "lifetime_free") {
        if (card.annualFee === 0) {
            score = Math.min(100, score + 10); // Bonus for matching preference
        } else {
            score *= 0.8; // Penalty for not matching
        }
    } else if (profile.feePreference === "low_fee") {
        if (actualFee <= 1000) {
            score = Math.min(100, score + 5);
        }
    }
    // "dont_mind" has no adjustment

    return clamp(score, 0, 100);
}

/**
 * Measures how well the card matches user's profile and lifestyle
 * Considers occupation, age, goals, and shopping preferences
 * 
 * @param card - Credit card with target demographics
 * @param profile - User profile with personal details
 * @returns Score from 0-100 representing personal fit
 * 
 * Algorithm:
 * 1. Check occupation match (+20 points)
 * 2. Verify age eligibility (+10 points)
 * 3. Match primary goal with card type (+15 points)
 * 4. Check shopping platform overlap (+10 points)
 * 5. Consider banking relationship (+5 points)
 */
function calculateFitScore(
    card: CreditCard,
    profile: UserProfile,
    allCards: CreditCard[]
): number {
    let score = SCORING_CONSTANTS.baseFitScore;

    // Occupation match
    if (card.targetUserTypes.includes(profile.occupation)) {
        score += SCORING_CONSTANTS.occupationMatchBonus;
    }

    // Age eligibility (bonus for being in ideal range)
    const idealAge = (card.minAge + card.maxAge) / 2;
    const ageDeviation = Math.abs(profile.age - idealAge);
    const ageScore = Math.max(0, SCORING_CONSTANTS.ageEligibilityBonus - ageDeviation / 5);
    score += ageScore;

    // Goal alignment with card type
    const goalCardTypeMap: Record<string, string[]> = {
        cashback: ["cashback", "shopping"],
        rewards: ["rewards", "lifestyle"],
        travel: ["travel"],
        building_credit: ["cashback", "lifestyle"], // Entry-level cards
    };

    if (profile.primaryGoals.some(goal => goalCardTypeMap[goal]?.includes(card.type))) {
        score += SCORING_CONSTANTS.goalAlignmentBonus;
    }

    // Shopping platform overlap
    if (card.supportedPlatforms && profile.primaryShoppingPlatforms.length > 0) {
        const overlap = getArrayIntersection(card.supportedPlatforms, profile.primaryShoppingPlatforms);
        if (overlap.length > 0) {
            score += SCORING_CONSTANTS.platformMatchBonus * Math.min(overlap.length, 3);
        }
    }

    // Banking relationship
    if (profile.bankAccounts.length > 0 && hasBankingRelationship(profile.bankAccounts, card.issuer)) {
        score += SCORING_CONSTANTS.bankingRelationshipBonus;
    }

    // Complementary card type boost
    const ownedTypes = new Set<string>();

    if (profile.existingCardIds?.length > 0) {
        for (const c of allCards) {
            if (profile.existingCardIds.includes(c.id)) {
                ownedTypes.add(c.type);
            }
        }
    }

    if (profile.existingCardTypes?.length > 0) {
        for (const t of profile.existingCardTypes) {
            ownedTypes.add(t);
        }
    }

    if (ownedTypes.size > 0) {
        const complementMap: Record<string, string[]> = {
            cashback: ["travel", "rewards"],
            rewards: ["travel", "cashback"],
            travel: ["cashback", "shopping"],
            shopping: ["travel", "rewards"],
            fuel: ["travel", "cashback"],
            lifestyle: ["travel", "cashback"],
        };
        for (const ownedType of ownedTypes) {
            if (complementMap[ownedType]?.includes(card.type)) {
                score += SCORING_CONSTANTS.complementaryBonus;
                break;
            }
        }
    }

    return clamp(score, 0, 100);
}

/**
 * Quantifies value of card benefits based on user's lifestyle
 * Values lounge access, insurance, and milestone rewards
 * 
 * @param card - Credit card with benefits package
 * @param profile - User profile with lifestyle preferences
 * @returns Score from 0-100 representing benefits value
 * 
 * Algorithm:
 * 1. Calculate lounge access value based on travel frequency
 * 2. Value insurance coverage for frequent travelers
 * 3. Estimate milestone rewards user will achieve
 * 4. Sum total benefits value in INR
 * 5. Normalize to 0-100 scale
 */
function calculateBenefitsScore(
    card: CreditCard,
    profile: UserProfile
): number {
    let benefitsValue = 0;

    // Lounge access value
    if (card.loungeAccess > 0) {
        let expectedVisits = 0;

        if (profile.travelFrequency === "frequent") {
            expectedVisits = Math.min(card.loungeAccess, BENEFITS_VALUES.frequentTravelerVisits);
        } else if (profile.travelFrequency === "occasional") {
            expectedVisits = Math.min(card.loungeAccess, BENEFITS_VALUES.occasionalTravelerVisits);
        }

        const loungeValue = expectedVisits * BENEFITS_VALUES.loungeVisitValue * (profile.airportLoungeImportance / 5);
        benefitsValue += loungeValue;
    }

    // Travel insurance (for frequent travelers)
    if (profile.travelFrequency === "frequent" && card.type === "travel") {
        benefitsValue += BENEFITS_VALUES.travelInsuranceValue;
    }

    // Milestone rewards (if user will likely achieve them)
    const totalAnnualSpend = calculateTotalAnnualSpend(profile.spending);
    if (totalAnnualSpend >= 100000) {
        benefitsValue += BENEFITS_VALUES.milestoneRewardValue;
    }

    // Normalize to 0-100 scale (max ₹10,000 in benefits value)
    return normalizeScore(benefitsValue, 10000);
}

/**
 * Estimates likelihood of credit card approval
 * Based on income buffer, credit score, and card difficulty
 * 
 * @param card - Credit card with approval requirements
 * @param profile - User profile with financial details
 * @returns Score from 0-100 representing approval probability
 * 
 * Algorithm:
 * 1. Calculate income buffer (user income / required income)
 * 2. Factor in credit score if available
 * 3. Adjust for card's approval difficulty rating
 * 4. Bonus for existing banking relationship
 * 5. Convert to 0-100 probability score
 */
function calculateApprovalScore(
    card: CreditCard,
    profile: UserProfile
): number {
    // Income buffer calculation
    const incomeBuffer = profile.monthlyIncome / Math.max(card.minIncome, 1);

    let score = 50; // Base score

    // High income buffer increases approval odds
    if (incomeBuffer >= SCORING_CONSTANTS.highApprovalIncomeBuffer) {
        score = 90;
    } else if (incomeBuffer >= SCORING_CONSTANTS.moderateApprovalIncomeBuffer) {
        score = 70;
    } else if (incomeBuffer >= 1.0) {
        score = 60;
    }

    // Credit score factor (if available)
    if (profile.creditScore) {
        if (profile.creditScore >= 750) {
            score = Math.min(100, score + 10);
        } else if (profile.creditScore >= 700) {
            score = Math.min(100, score + 5);
        } else if (profile.creditScore < 650) {
            score = Math.max(0, score - 15);
        }
    }

    // Approval difficulty adjustment
    if (card.approvalDifficulty === "easy") {
        score = Math.min(100, score + 10);
    } else if (card.approvalDifficulty === "difficult") {
        score = Math.max(0, score - 15);
    }

    // Banking relationship bonus
    if (hasBankingRelationship(profile.bankAccounts, card.issuer)) {
        score = Math.min(100, score + 10);
    }

    return clamp(score, 0, 100);
}

/**
 * Calculates category-specific rewards with caps
 * 
 * @param spending - Amount spent in category (annual)
 * @param rate - Reward rate percentage
 * @param cap - Optional reward cap per period
 * @returns Capped reward amount
 */
function calculateCappedReward(
    spending: number,
    rate: number,
    cap?: number
): number {
    const reward = spending * (rate / 100);

    if (cap && cap > 0) {
        return Math.min(reward, cap * 12); // Cap is typically monthly, so multiply by 12
    }

    return reward;
}

/**
 * Calculates net annual monetary benefit
 * 
 * @param card - Credit card
 * @param profile - User profile with spending
 * @returns Estimated annual benefit in INR (rewards - fees)
 */
function calculateNetAnnualBenefit(
    card: CreditCard,
    profile: UserProfile
): number {
    const annualRewardValue = calculateAnnualRewards(card, profile.spending);
    const totalAnnualSpend = calculateTotalAnnualSpend(profile.spending);
    const feeWaived = card.annualFeeWaiver > 0 && totalAnnualSpend >= card.annualFeeWaiver;
    const actualFee = feeWaived ? 0 : card.annualFee;

    return Math.round(annualRewardValue - actualFee);
}

/**
 * Generates human-readable reasons why a card is recommended
 * 
 * @param card - Recommended card
 * @param profile - User profile
 * @param scores - Calculated score breakdown
 * @returns Array of 3-5 compelling reason strings
 */
function generateReasoning(
    card: CreditCard,
    profile: UserProfile,
    scores: CardScoreBreakdown,
    netAnnualBenefit: number,
    allCards: CreditCard[]
): string[] {
    const reasons: string[] = [];

    // Net benefit reason
    if (netAnnualBenefit > 0) {
        reasons.push(`Earn ₹${netAnnualBenefit.toLocaleString()} annually after fees`);
    }

    // Category match reason
    const topCategory = Object.entries(profile.spending)
        .sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
        const [category] = topCategory;
        const cat = category as keyof SpendingProfile;
        const rate = card.categories[cat];

        if (rate && rate >= 2) {
            const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
            reasons.push(`${rate}% rewards on ${categoryName} (your top category)`);
        }
    }

    // Fee reason
    if (card.annualFee === 0) {
        reasons.push("Lifetime free, no annual fee");
    } else {
        const totalAnnualSpend = calculateTotalAnnualSpend(profile.spending);
        if (card.annualFeeWaiver > 0 && totalAnnualSpend >= card.annualFeeWaiver) {
            reasons.push("Annual fee waived based on your spending");
        }
    }

    // Lounge access reason
    if (card.loungeAccess > 0 && profile.airportLoungeImportance >= 3) {
        reasons.push(`${card.loungeAccess} complimentary lounge visits per quarter`);
    }

    // Approval probability
    if (scores.approvalScore >= SCORE_THRESHOLDS.highApproval) {
        reasons.push("High approval probability for your profile");
    }

    // Platform match
    if (card.supportedPlatforms && profile.primaryShoppingPlatforms.length > 0) {
        const overlap = getArrayIntersection(card.supportedPlatforms, profile.primaryShoppingPlatforms);
        if (overlap.length > 0) {
            reasons.push(`Special rewards on ${overlap[0]}`);
        }
    }

    // Complementary card reasoning
    const ownedTypesForReasoning = new Set<string>();
    if (profile.existingCardIds?.length > 0) {
        for (const c of allCards) {
            if (profile.existingCardIds.includes(c.id)) {
                ownedTypesForReasoning.add(c.type);
            }
        }
    }
    if (profile.existingCardTypes?.length > 0) {
        for (const t of profile.existingCardTypes) {
            ownedTypesForReasoning.add(t);
        }
    }
    if (ownedTypesForReasoning.size > 0) {
        const complementMap: Record<string, string[]> = {
            cashback: ["travel", "rewards"],
            rewards: ["travel", "cashback"],
            travel: ["cashback", "shopping"],
            shopping: ["travel", "rewards"],
            fuel: ["travel", "cashback"],
            lifestyle: ["travel", "cashback"],
        };
        for (const ownedType of ownedTypesForReasoning) {
            if (complementMap[ownedType]?.includes(card.type)) {
                reasons.push(`Complements your existing ${ownedType} card with ${card.type} benefits`);
                break;
            }
        }
    }

    // Return top 4 reasons
    return reasons.slice(0, DISPLAY_CONSTANTS.maxReasonsDisplay);
}

/**
 * Determines approval probability label
 * 
 * @param score - Approval score (0-100)
 * @returns 'High' | 'Moderate' | 'Low'
 */
function getApprovalProbabilityLabel(score: number): ApprovalLabel {
    if (score >= SCORE_THRESHOLDS.highApproval) {
        return "High";
    } else if (score >= SCORE_THRESHOLDS.moderateApproval) {
        return "Moderate";
    } else {
        return "Low";
    }
}
