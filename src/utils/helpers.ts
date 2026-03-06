/**
 * Generic utility helper functions
 * 
 * This module contains pure, reusable utility functions used throughout
 * the application for common operations like clamping, normalization, and calculations.
 */

/**
 * Clamps a number between minimum and maximum values
 * 
 * @param value - The value to clamp
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @returns The clamped value
 * 
 * @example
 * clamp(150, 0, 100) // Returns 100
 * clamp(-10, 0, 100) // Returns 0
 * clamp(50, 0, 100) // Returns 50
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

/**
 * Normalizes a value to 0-100 scale based on a maximum
 * 
 * @param value - The value to normalize
 * @param max - The maximum expected value
 * @returns Normalized score between 0-100
 * 
 * @example
 * normalizeScore(5000, 10000) // Returns 50
 * normalizeScore(15000, 10000) // Returns 100 (capped)
 */
export function normalizeScore(value: number, max: number): number {
    if (max === 0) return 0;
    return clamp((value / max) * 100, 0, 100);
}

/**
 * Safely calculates percentage avoiding division by zero
 * 
 * @param value - The value to calculate percentage of
 * @param total - The total value
 * @returns Percentage value (0-100)
 * 
 * @example
 * calculatePercentage(25, 100) // Returns 25
 * calculatePercentage(50, 0) // Returns 0 (safe)
 */
export function calculatePercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
}

/**
 * Checks if a value falls within a specified range (inclusive)
 * 
 * @param value - The value to check
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns True if value is in range, false otherwise
 * 
 * @example
 * isInRange(50, 0, 100) // Returns true
 * isInRange(150, 0, 100) // Returns false
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Finds common elements between two arrays
 * 
 * @param arr1 - First array
 * @param arr2 - Second array
 * @returns Array containing elements found in both arrays
 * 
 * @example
 * getArrayIntersection([1, 2, 3], [2, 3, 4]) // Returns [2, 3]
 * getArrayIntersection(['a', 'b'], ['c', 'd']) // Returns []
 */
export function getArrayIntersection<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter(item => arr2.includes(item));
}

/**
 * Calculates the sum of all numbers in an array
 * 
 * @param numbers - Array of numbers to sum
 * @returns The sum of all numbers
 * 
 * @example
 * sumArray([1, 2, 3, 4]) // Returns 10
 * sumArray([]) // Returns 0
 */
export function sumArray(numbers: number[]): number {
    return numbers.reduce((sum, num) => sum + num, 0);
}

/**
 * Rounds a number to specified decimal places
 * 
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns Rounded number
 * 
 * @example
 * roundTo(3.14159, 2) // Returns 3.14
 * roundTo(3.14159, 0) // Returns 3
 */
export function roundTo(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Safely divides two numbers, returning 0 if denominator is 0
 * 
 * @param numerator - The numerator
 * @param denominator - The denominator
 * @returns The division result, or 0 if denominator is 0
 * 
 * @example
 * safeDivide(10, 2) // Returns 5
 * safeDivide(10, 0) // Returns 0 (safe)
 */
export function safeDivide(numerator: number, denominator: number): number {
    if (denominator === 0) return 0;
    return numerator / denominator;
}

/**
 * Checks if a value is a valid number (not NaN, Infinity, etc.)
 * 
 * @param value - The value to check
 * @returns True if value is a valid number
 * 
 * @example
 * isValidNumber(42) // Returns true
 * isValidNumber(NaN) // Returns false
 * isValidNumber(Infinity) // Returns false
 */
export function isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Gets the median value from an array of numbers
 * 
 * @param numbers - Array of numbers
 * @returns The median value
 * 
 * @example
 * getMedian([1, 2, 3, 4, 5]) // Returns 3
 * getMedian([1, 2, 3, 4]) // Returns 2.5
 */
export function getMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;

    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
}

/**
 * Calculates a weighted average of values
 * 
 * @param values - Array of values
 * @param weights - Array of corresponding weights
 * @returns Weighted average
 * 
 * @example
 * weightedAverage([80, 90, 70], [0.5, 0.3, 0.2]) // Returns 81
 */
export function weightedAverage(values: number[], weights: number[]): number {
    if (values.length !== weights.length) {
        throw new Error('Values and weights arrays must have same length');
    }

    const weightedSum = values.reduce((sum, value, i) => sum + (value * weights[i]), 0);
    const totalWeight = sumArray(weights);

    return safeDivide(weightedSum, totalWeight);
}

/**
 * Generates a random integer between min and max (inclusive)
 * 
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns Random integer
 * 
 * @example
 * randomInt(1, 10) // Returns number between 1 and 10
 */
export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Debounces a function call
 * 
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * 
 * @example
 * const debouncedSearch = debounce(searchFunction, 300);
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return function (...args: Parameters<T>) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

/**
 * Creates a toggle handler for adding/removing items from a list
 *
 * @param currentItems - The current list of selected items
 * @param addFn - Function to call when adding an item
 * @param removeFn - Function to call when removing an item
 * @returns A function that toggles an item in/out of the list
 *
 * @example
 * const handleBank = createToggleHandler(selected, addBank, removeBank);
 * handleBank('HDFC') // adds if not present, removes if already present
 */
export function createToggleHandler<T>(
    currentItems: T[],
    addFn: (item: T) => void,
    removeFn: (item: T) => void
): (item: T) => void {
    return (item: T) => {
        if (currentItems.includes(item)) {
            removeFn(item);
        } else {
            addFn(item);
        }
    };
}

/**
 * Creates an array of numbers in a range
 *
 * @param start - Start value
 * @param end - End value
 * @param step - Step increment (default: 1)
 * @returns Array of numbers
 *
 * @example
 * range(1, 5) // Returns [1, 2, 3, 4, 5]
 * range(0, 10, 2) // Returns [0, 2, 4, 6, 8, 10]
 */
export function range(start: number, end: number, step: number = 1): number[] {
    const result: number[] = [];
    for (let i = start; i <= end; i += step) {
        result.push(i);
    }
    return result;
}

/**
 * Classifies raw monthly income into one of four buckets for the recommendation engine.
 *
 * @param monthlyIncome - The user's monthly income
 * @returns IncomeBucket type
 */
import { INCOME_BUCKETS, INCOME_INPUT_LIMITS } from "../constants";
import type { IncomeBucket } from "../types";

export function getIncomeBucket(monthlyIncome: number): IncomeBucket {
    if (monthlyIncome <= INCOME_BUCKETS.securedOnlyMax) return "secured_only";
    if (monthlyIncome <= INCOME_BUCKETS.limitedMax) return "limited";
    if (monthlyIncome <= INCOME_BUCKETS.normalMax) return "normal";
    return "premium";
}

/**
 * Clamps monthly income at the engine's processing limit (₹10L).
 * This ensures anyone earning more get the same top-tier recommendations.
 *
 * @param income - Raw income amount
 * @returns Clamped income amount
 */
export function clampIncomeForEngine(income: number): number {
    return Math.min(income, INCOME_INPUT_LIMITS.cap);
}
