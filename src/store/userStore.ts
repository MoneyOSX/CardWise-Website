/**
 * User Profile Store
 * 
 * Zustand store managing user profile state throughout the application.
 * Contains demographics, financial information, and preferences needed
 * for credit card recommendations.
 */

import { create } from "zustand";
import type { UserProfile, Occupation, TravelFrequency, PrimaryGoal, FeePreference } from "../types";
import { DEFAULT_VALUES } from "../constants";

/**
 * Initial user profile with default values
 */
const initialProfile: UserProfile = {
    // Demographics
    occupation: "Salaried",
    age: DEFAULT_VALUES.age,

    // Financial Information
    monthlyIncome: 0,
    spending: {
        online: 0,
        dining: 0,
        foodDelivery: 0,
        groceries: 0,
        fuel: 0,
        utilities: 0,
        travel: 0,
        emi: 0,
        other: 0,
    },
    creditScore: undefined,
    existingCardsCount: DEFAULT_VALUES.existingCardsCount,
    bankAccounts: [],

    // Lifestyle Preferences
    travelFrequency: DEFAULT_VALUES.travelFrequency,
    airportLoungeImportance: DEFAULT_VALUES.airportLoungeImportance,
    primaryShoppingPlatforms: [],

    // Goals and Preferences
    primaryGoals: DEFAULT_VALUES.primaryGoals,
    feePreference: DEFAULT_VALUES.feePreference,
};

/**
 * User store interface defining all available actions
 */
interface UserStore {
    /** Current user profile */
    profile: UserProfile;

    // Demographic Setters

    /**
     * Sets user's occupation and infers age
     * @param occupation - User's occupation type
     */
    setOccupation: (occupation: Occupation) => void;

    /**
     * Sets user's age
     * @param age - User's age in years (18-100)
     */
    setAge: (age: number) => void;

    // Financial Setters

    /**
     * Sets user's monthly take-home income
     * @param income - Monthly income in INR
     */
    setIncome: (income: number) => void;

    /**
     * Sets spending amount for a specific category
     * @param category - Spending category
     * @param amount - Monthly spending amount in INR
     */
    setSpending: (category: keyof UserProfile["spending"], amount: number) => void;

    /**
     * Sets user's credit score
     * @param score - Credit score (300-900), undefined to clear
     */
    setCreditScore: (score: number | undefined) => void;

    /**
     * Sets number of existing credit cards user has
     * @param count - Number of existing cards (0-10)
     */
    setExistingCardsCount: (count: number) => void;

    /**
     * Sets banks where user has existing accounts
     * @param banks - Array of bank names
     */
    setBankAccounts: (banks: string[]) => void;

    /**
     * Adds a bank account to the list
     * @param bank - Bank name to add
     */
    addBankAccount: (bank: string) => void;

    /**
     * Removes a bank account from the list
     * @param bank - Bank name to remove
     */
    removeBankAccount: (bank: string) => void;

    // Lifestyle Preference Setters

    /**
     * Sets how frequently user travels
     * @param frequency - Travel frequency level
     */
    setTravelFrequency: (frequency: TravelFrequency) => void;

    /**
     * Sets importance of airport lounge access
     * @param importance - Importance rating (1-5)
     */
    setAirportLoungeImportance: (importance: 1 | 2 | 3 | 4 | 5) => void;

    /**
     * Sets primary shopping platforms user frequents
     * @param platforms - Array of platform names
     */
    setPrimaryShoppingPlatforms: (platforms: string[]) => void;

    /**
     * Adds a shopping platform to preferences
     * @param platform - Platform name to add
     */
    addShoppingPlatform: (platform: string) => void;

    /**
     * Removes a shopping platform from preferences
     * @param platform - Platform name to remove
     */
    removeShoppingPlatform: (platform: string) => void;

    // Goal and Preference Setters

    /**
     * Sets user's primary goals for getting a credit card (max 2)
     * @param goals - Array of primary goals
     */
    setPrimaryGoals: (goals: PrimaryGoal[]) => void;

    /**
     * Sets user's preference regarding annual fees
     * @param preference - Fee preference
     */
    setFeePreference: (preference: FeePreference) => void;

    // Utility Methods

    /**
     * Resets profile to initial default values
     * Useful for starting a new recommendation session
     */
    reset: () => void;

    /**
     * Checks if user has completed basic profile (occupation and income)
     * @returns True if basic profile is complete
     */
    isBasicProfileComplete: () => boolean;

    /**
     * Checks if user has completed full profile including preferences
     * @returns True if full profile is complete
     */
    isFullProfileComplete: () => boolean;

    /**
     * Gets total monthly spending across all categories
     * @returns Total monthly spending in INR
     */
    getTotalSpending: () => number;
}

/**
 * Zustand store for user profile management
 * Provides centralized state management with type-safe setters
 */
export const useUserStore = create<UserStore>((set, get) => ({
    profile: initialProfile,

    // Demographic Setters
    setOccupation: (occupation) => {
        let impliedAge = 25;
        if (occupation === "Student") impliedAge = 22;
        else if (occupation === "Salaried") impliedAge = 30;
        else if (occupation === "Self-Employed") impliedAge = 35;
        else if (occupation === "Business") impliedAge = 40;

        set((state) => ({
            profile: { ...state.profile, occupation, age: impliedAge }
        }));
    },

    setAge: (age) =>
        set((state) => ({ profile: { ...state.profile, age } })),

    // Financial Setters
    setIncome: (monthlyIncome) =>
        set((state) => ({ profile: { ...state.profile, monthlyIncome } })),

    setSpending: (category, amount) =>
        set((state) => ({
            profile: {
                ...state.profile,
                spending: { ...state.profile.spending, [category]: amount },
            },
        })),

    setCreditScore: (creditScore) =>
        set((state) => ({ profile: { ...state.profile, creditScore } })),

    setExistingCardsCount: (existingCardsCount) =>
        set((state) => ({ profile: { ...state.profile, existingCardsCount } })),

    setBankAccounts: (bankAccounts) =>
        set((state) => ({ profile: { ...state.profile, bankAccounts } })),

    addBankAccount: (bank) =>
        set((state) => ({
            profile: {
                ...state.profile,
                bankAccounts: [...new Set([...state.profile.bankAccounts, bank])],
            },
        })),

    removeBankAccount: (bank) =>
        set((state) => ({
            profile: {
                ...state.profile,
                bankAccounts: state.profile.bankAccounts.filter(b => b !== bank),
            },
        })),

    // Lifestyle Preference Setters
    setTravelFrequency: (travelFrequency) =>
        set((state) => ({ profile: { ...state.profile, travelFrequency } })),

    setAirportLoungeImportance: (airportLoungeImportance) =>
        set((state) => ({ profile: { ...state.profile, airportLoungeImportance } })),

    setPrimaryShoppingPlatforms: (primaryShoppingPlatforms) =>
        set((state) => ({ profile: { ...state.profile, primaryShoppingPlatforms } })),

    addShoppingPlatform: (platform) =>
        set((state) => ({
            profile: {
                ...state.profile,
                primaryShoppingPlatforms: [
                    ...new Set([...state.profile.primaryShoppingPlatforms, platform])
                ],
            },
        })),

    removeShoppingPlatform: (platform) =>
        set((state) => ({
            profile: {
                ...state.profile,
                primaryShoppingPlatforms: state.profile.primaryShoppingPlatforms.filter(
                    p => p !== platform
                ),
            },
        })),

    // Goal and Preference Setters
    setPrimaryGoals: (primaryGoals) =>
        set((state) => ({ profile: { ...state.profile, primaryGoals } })),

    setFeePreference: (feePreference) =>
        set((state) => ({ profile: { ...state.profile, feePreference } })),

    // Utility Methods
    reset: () => set({ profile: initialProfile }),

    isBasicProfileComplete: () => {
        const { occupation, monthlyIncome } = get().profile;
        return !!occupation && monthlyIncome > 0;
    },

    isFullProfileComplete: () => {
        const { occupation, monthlyIncome, age } = get().profile;
        return !!occupation && monthlyIncome > 0 && age >= 18;
    },

    getTotalSpending: () => {
        const spending = get().profile.spending;
        return Object.values(spending).reduce((sum, amount) => sum + amount, 0);
    },
}));

// Export the Occupation type for use in components
export type { Occupation };
