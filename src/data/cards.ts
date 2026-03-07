/**
 * Credit Cards Database
 * 
 * Comprehensive database of credit cards available in India with detailed
 * attributes for accurate recommendation matching.
 * 
 * Each card includes eligibility criteria, rewards structure, benefits,
 * and target user demographics for multi-dimensional scoring.
 */

import type { CreditCard } from "../types";

/**
 * Complete database of credit cards
 * Includes 25+ cards covering various segments from entry-level to premium
 */
export const cards: CreditCard[] = [
    /**
     * HDFC Millennia - Popular card for online shoppers
     * Best for young professionals with significant online spending
     */
    {
        id: "hdfc-millennia",
        name: "Millennia",
        issuer: "HDFC Bank",
        image: "https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/247161e1-1bdf-48bb-a0e2-7634ec2d619a?",
        type: "shopping",
        minIncome: 25000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "moderate",
        annualFee: 1000,
        annualFeeWaiver: 100000,
        categories: {
            online: 5,
            foodDelivery: 2,
            groceries: 1,
            emi: 1,
            other: 1,
        },
        rewardCaps: {
            online: 1000, // ₹1000 per month cap on 5% cashback
        },
        benefits: [
            "5% Cashback on Amazon, Flipkart (up to ₹1000/month)",
            "1% Cashback on all other spends",
            "Complimentary Airport Lounge Access (Domestic)",
            "Fuel Surcharge Waiver"
        ],
        loungeAccess: 4,
        bestFor: ["online shoppers", "millennials", "young professionals"],
        supportedPlatforms: ["Amazon", "Flipkart", "Nykaa"],
        applyUrl: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/millennia-credit-card",
    },
    /**
     * Amazon Pay ICICI - Best lifetime free card for Amazon Prime members
     * Entry-level card with excellent online rewards
     */
    {
        id: "icici-amazon-pay",
        name: "Amazon Pay",
        issuer: "ICICI Bank",
        image: "https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/personal-banking/cards/credit-card/amazon-pay-icici-bank-credit-card.png",
        type: "cashback",
        minIncome: 15000,
        minAge: 18,
        maxAge: 65,
        targetUserTypes: ["Student", "Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 0,
        annualFeeWaiver: 0,
        categories: {
            online: 5,
            foodDelivery: 2,
            groceries: 1,
            emi: 1,
            other: 1,
        },
        benefits: [
            "5% Cashback for Prime members on Amazon",
            "3% for non-Prime members on Amazon",
            "Lifetime Free Card with no joining fee",
            "2% Cashback on dining and travel bookings via Amazon Pay"
        ],
        loungeAccess: 0,
        bestFor: ["students", "amazon shoppers", "first credit card"],
        supportedPlatforms: ["Amazon"],
        applyUrl: "https://www.amazon.in/cbcc/ref=amb_link_1",
    },
    /**
     * Flipkart Axis Bank - Excellent for Flipkart shoppers
     * Good all-around cashback card with decent fee waiver threshold
     */
    {
        id: "axis-flipkart",
        name: "Flipkart",
        issuer: "Axis Bank",
        image: "https://www.axisbank.com/docs/default-source/default-document-library/flipkart-axis-bank-credit-card.png",
        type: "shopping",
        minIncome: 15000,
        minAge: 18,
        maxAge: 70,
        targetUserTypes: ["Student", "Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "easy",
        annualFee: 500,
        annualFeeWaiver: 200000,
        categories: {
            online: 5,
            foodDelivery: 1.5,
            groceries: 1.5,
            emi: 1.5,
            other: 1.5,
        },
        benefits: [
            "5% Unlimited Cashback on Flipkart & Myntra",
            "1.5% Unlimited Cashback on all other spends",
            "4 Complimentary Airport Lounge visits per year",
            "Fuel Surcharge Waiver"
        ],
        loungeAccess: 4,
        bestFor: ["flipkart shoppers", "online shopping", "cashback"],
        supportedPlatforms: ["Flipkart", "Myntra", "Nykaa"],
        applyUrl: "https://www.axisbank.com/retail/cards/credit-card/flipkart-axis-bank-credit-card",
    },
    /**
     * SBI SimplyClick - Best for online shopping with partner benefits
     * Good entry-level rewards card with low fee
     */
    {
        id: "sbi-simplyclick",
        name: "SimplyClick",
        issuer: "SBI Card",
        image: "https://www.sbicard.com/sbi-card-en/assets/images/personal/cards/shopping/simplyclick/simplyclick-card.png",
        type: "rewards",
        minIncome: 20000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 499,
        annualFeeWaiver: 100000,
        categories: {
            online: 2.5,
            foodDelivery: 1,
            groceries: 1,
            emi: 1,
            other: 1,
        },
        benefits: [
            "10X Rewards on partner merchants (Amazon, BookMyShow, etc.)",
            "5X Rewards on other online spends",
            "₹500 Amazon voucher on joining",
            "1% fuel surcharge waiver"
        ],
        loungeAccess: 0,
        bestFor: ["online shopping", "rewards points", "low annual fee"],
        supportedPlatforms: ["Amazon", "BookMyShow", "Cleartrip", "Nykaa"],
        applyUrl: "https://www.sbicard.com/en/personal/credit-cards/shopping/simplyclick-sbi-card.page",
    },
    /**
     * HDFC Regalia Gold - Premium card for high spenders
     * Excellent for travel and dining with comprehensive benefits
     */
    {
        id: "hdfc-regalia-gold",
        name: "Regalia Gold",
        issuer: "HDFC Bank",
        image: "https://www.hdfcbank.com/content/api/contentstream-id/723fb80a-2dde-42a3-9793-7ae1be57c87f/247161e1-1bdf-48bb-a0e2-7634ec2d619a?",
        type: "travel",
        minIncome: 100000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "difficult",
        annualFee: 2500,
        annualFeeWaiver: 400000,
        categories: {
            travel: 5,
            dining: 5,
            foodDelivery: 5,
            groceries: 2,
            emi: 1.33,
            other: 1.33,
        },
        benefits: [
            "Complimentary domestic and international lounge access",
            "4 Reward Points per ₹150 spent",
            "Golf privileges and luxury brand discounts",
            "Insurance coverage on flights and hotels"
        ],
        loungeAccess: 12,
        bestFor: ["travel", "dining", "premium benefits"],
        applyUrl: "https://www.hdfcbank.com/personal/pay/cards/credit-cards/regalia-gold-credit-card",
    },

    /**
     * Axis ACE - Best lifetime free cashback card
     * Perfect for young professionals focusing on utility bills and online
     */
    {
        id: "axis-ace",
        name: "ACE",
        issuer: "Axis Bank",
        image: "https://www.axisbank.com/images/default-source/revamp_new/cards/ace.png",
        type: "cashback",
        minIncome: 15000,
        minAge: 18,
        maxAge: 70,
        targetUserTypes: ["Student", "Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 0,
        annualFeeWaiver: 0,
        categories: {
            utilities: 5,
            online: 2,
            foodDelivery: 2,
            groceries: 2,
            emi: 1,
            other: 1,
        },
        benefits: [
            "5% Cashback on bill payments via Google Pay",
            "2% Cashback on Swiggy, Zomato, Ola",
            "Lifetime Free with no annual fee",
            "4% Cashback on Myntra, Cult.fit, Pepperfry"
        ],
        loungeAccess: 0,
        bestFor: ["bill payments", "food delivery", "lifetime free"],
        supportedPlatforms: ["Google Pay", "Swiggy", "Zomato", "Nykaa"],
        applyUrl: "https://www.axisbank.com/retail/cards/credit-card/ace-credit-card",
    },

    /**
     * IDFC First WOW - Feature-rich lifetime free card
     * Great all-rounder for students and first-time users
     */
    {
        id: "idfc-wow",
        name: "FIRST WOW",
        issuer: "IDFC First Bank",
        image: "https://www.idfcfirstbank.com/content/dam/IDFCFirstBank/images/credit-cards/wow-cc.png",
        type: "rewards",
        minIncome: 0, // No minimum income requirement
        minAge: 18,
        maxAge: 70,
        targetUserTypes: ["Student", "Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 0,
        annualFeeWaiver: 0,
        categories: {
            online: 2,
            dining: 2,
            fuel: 10,
            foodDelivery: 2,
            groceries: 2,
            emi: 1,
            other: 1,
        },
        rewardCaps: {
            fuel: 100, // ₹100 per transaction
        },
        benefits: [
            "10X Rewards on fuel (up to ₹100 per transaction)",
            "Lifetime free with no joining fee",
            "2X Rewards on online and dining",
            "Welcome bonus reward points"
        ],
        loungeAccess: 0,
        bestFor: ["students", "first credit card", "fuel savings"],
        supportedPlatforms: [],
        applyUrl: "https://www.idfcfirstbank.com/credit-card/wow-credit-card",
    },

    /**
     * OneCard - Metal card with lifetime free benefits
     * Modern app-based credit card for tech-savvy users
     */
    {
        id: "onecard-metal",
        name: "OneCard Metal",
        issuer: "OneCard (Federal Bank)",
        image: "https://www.getonecard.app/images/metal-card.png",
        type: "cashback",
        minIncome: 20000,
        minAge: 18,
        maxAge: 65,
        targetUserTypes: ["Student", "Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 0,
        annualFeeWaiver: 0,
        categories: {
            online: 5,
            dining: 2,
            foodDelivery: 5,
            groceries: 2,
            emi: 1,
            other: 1,
        },
        benefits: [
            "5% Cashback on top 2 spending categories",
            "1% Cashback on all other spends",
            "Fully digital with powerful mobile app",
            "Premium metal card design"
        ],
        loungeAccess: 0,
        bestFor: ["tech users", "customizable rewards", "app experience"],
        supportedPlatforms: [],
        applyUrl: "https://www.getonecard.app",
    },

    /**
     * ICICI Coral - Well-rounded lifestyle credit card
     * Mid-tier card with good rewards and benefits
     */
    {
        id: "icici-coral",
        name: "Coral",
        issuer: "ICICI Bank",
        image: "https://www.icicibank.com/content/dam/icicibank/india/managed-assets/images/personal-banking/cards/credit-card/coral-credit-card.png",
        type: "lifestyle",
        minIncome: 35000,
        minAge: 23,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "moderate",
        annualFee: 500,
        annualFeeWaiver: 200000,
        categories: {
            dining: 2,
            online: 2,
            utilities: 2,
            foodDelivery: 2,
            groceries: 2,
            emi: 1,
            other: 1,
        },
        benefits: [
            "2 Reward Points per ₹100 spent",
            "4 complimentary airport lounge visits",
            "Dining discounts at partner restaurants",
            "Fuel surcharge waiver"
        ],
        loungeAccess: 4,
        bestFor: ["balanced rewards", "lifestyle", "dining"],
        supportedPlatforms: [],
        applyUrl: "https://www.icicibank.com/personal-banking/cards/credit-cards/coral-credit-card",
    },

    /**
     * IndusInd Iconia - Premium lifestyle and travel card
     * Great for frequent travelers with comprehensive benefits
     */
    {
        id: "indusind-iconia",
        name: "Iconia",
        issuer: "IndusInd Bank",
        image: "https://www.indusind.com/content/dam/indusind/cards/credit-card/iconia.png",
        type: "travel",
        minIncome: 60000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "moderate",
        annualFee: 3000,
        annualFeeWaiver: 500000,
        categories: {
            travel: 3,
            dining: 3,
            fuel: 1.5,
            foodDelivery: 3,
            groceries: 1.5,
            emi: 1,
            other: 1,
        },
        benefits: [
            "Unlimited domestic and international lounge access",
            "Complimentary golf rounds",
            "Movie tickets on BookMyShow",
            "Reward points never expire"
        ],
        loungeAccess: 99, // Unlimited
        bestFor: ["travel", "lounge access", "lifestyle"],
        supportedPlatforms: ["BookMyShow"],
        applyUrl: "https://www.indusind.com/in/en/personal/cards/credit-card/iconia-credit-card.html",
    },

    /**
     * SBI Elite - Premium rewards card for high spenders
     * Excellent earning rate with luxury benefits
     */
    {
        id: "sbi-elite",
        name: "Elite",
        issuer: "SBI Card",
        image: "https://www.sbicard.com/sbi-card-en/assets/images/personal/cards/premium/elite/elite-card.png",
        type: "rewards",
        minIncome: 75000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "difficult",
        annualFee: 4999,
        annualFeeWaiver: 500000,
        categories: {
            dining: 5,
            travel: 5,
            online: 2,
            foodDelivery: 5,
            groceries: 2,
            emi: 1.5,
            other: 1.5,
        },
        benefits: [
            "10 Reward Points per ₹100 on travel and dining",
            "Complimentary airport lounge access (8 domestic + 2 international)",
            "Golf privileges at select courses",
            "Milestone benefits and luxury brand offers"
        ],
        loungeAccess: 10,
        bestFor: ["premium rewards", "travel", "dining"],
        applyUrl: "https://www.sbicard.com/en/personal/credit-cards/premium/elite-credit-card.page",
    },

    /**
     * Axis Vistara - Co-branded airline card
     * Best for Vistara flyers and travel enthusiasts
     */
    {
        id: "axis-vistara",
        name: "Vistara",
        issuer: "Axis Bank",
        image: "https://www.axisbank.com/images/default-source/revamp_new/cards/vistara-card.png",
        type: "travel",
        minIncome: 40000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "moderate",
        annualFee: 1500,
        annualFeeWaiver: 250000,
        categories: {
            travel: 4,
            online: 1.5,
            foodDelivery: 1,
            groceries: 1,
            emi: 1,
            other: 1,
        },
        benefits: [
            "Welcome bonus: 1000 Club Vistara points",
            "4 Club Vistara points per ₹200 on Vistara spends",
            "Complimentary Vistara flight tickets on milestones",
            "Airport lounge access"
        ],
        loungeAccess: 8,
        bestFor: ["vistara flyers", "air miles", "travel rewards"],
        applyUrl: "https://www.axisbank.com/retail/cards/credit-card/vistara-credit-cards",
    },

    /**
     * Standard Chartered Smart - Multi-category rewards
     * Flexible rewards card with good earning potential
     */
    {
        id: "sc-smart",
        name: "Smart Credit Card",
        issuer: "Standard Chartered",
        image: "https://www.sc.com/in/credit-cards/smart-credit-card.png",
        type: "rewards",
        minIncome: 30000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "moderate",
        annualFee: 999,
        annualFeeWaiver: 200000,
        categories: {
            online: 5,
            dining: 5,
            travel: 5,
            foodDelivery: 5,
            groceries: 5,
            emi: 1,
            other: 1,
        },
        rewardCaps: {
            online: 2000,
            dining: 2000,
            travel: 2000,
        },
        benefits: [
            "5X Rewards on 3 chosen categories",
            "Dining benefits at partner restaurants",
            "Movie ticket discounts",
            "Fuel surcharge waiver"
        ],
        loungeAccess: 2,
        bestFor: ["flexible rewards", "category selection", "dining"],
        applyUrl: "https://www.sc.com/in/credit-cards/smart-credit-card/",
    },

    /**
     * Kotak Essentia - Entry-level platinum card
     * Good starter card with decent benefits
     */
    {
        id: "kotak-essentia",
        name: "Essentia",
        issuer: "Kotak Mahindra Bank",
        image: "https://www.kotak.com/content/dam/Kotak/cards/essentia.png",
        type: "lifestyle",
        minIncome: 25000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 499,
        annualFeeWaiver: 100000,
        categories: {
            online: 2,
            dining: 2,
            fuel: 1,
            foodDelivery: 2,
            groceries: 10,
            emi: 1,
            other: 1,
        },
        benefits: [
            "4 Reward Points per ₹150 spent",
            "Dining privileges at partner restaurants",
            "Welcome gift voucher",
            "Fuel surcharge waiver"
        ],
        loungeAccess: 0,
        bestFor: ["entry level", "rewards", "low fee"],
        applyUrl: "https://www.kotak.com/en/personal-banking/cards/credit-cards/essentia-credit-card.html",
    },

    /**
     * YES Bank Prosperity Rewards Plus - High reward rate
     * Excellent for high spenders across all categories
     */
    {
        id: "yes-prosperity",
        name: "Prosperity Rewards Plus",
        issuer: "Yes Bank",
        image: "https://www.yesbank.in/images/prosperity-rewards-plus.png",
        type: "rewards",
        minIncome: 50000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "moderate",
        annualFee: 2499,
        annualFeeWaiver: 400000,
        categories: {
            travel: 4,
            dining: 4,
            online: 3,
            foodDelivery: 4,
            groceries: 3,
            emi: 2,
            other: 2,
        },
        benefits: [
            "High reward rate across all categories",
            "8 complimentary airport lounge visits",
            "Golf privileges",
            "Milestone bonus rewards"
        ],
        loungeAccess: 8,
        bestFor: ["high rewards", "all-round spending", "premium"],
        applyUrl: "https://www.yesbank.in/personal-banking/yes-individual/cards/credit-card/rewards-cards/prosperity-rewards-plus",
    },

    /**
     * AU LIT - Modern lifestyle card for millennials
     * Feature-rich with focus on entertainment and dining
     */
    {
        id: "au-lit",
        name: "LIT",
        issuer: "AU Small Finance Bank",
        image: "https://www.aubank.in/images/lit-card.png",
        type: "lifestyle",
        minIncome: 20000,
        minAge: 21,
        maxAge: 60,
        targetUserTypes: ["Student", "Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 500,
        annualFeeWaiver: 100000,
        categories: {
            dining: 3,
            online: 2.5,
            fuel: 1,
            foodDelivery: 3,
            groceries: 1,
            emi: 1,
            other: 1,
        },
        benefits: [
            "Cashback on dining and entertainment",
            "Movie ticket offers on BookMyShow",
            "Fuel surcharge waiver",
            "Low annual fee with easy waiver"
        ],
        loungeAccess: 0,
        bestFor: ["millennials", "entertainment", "dining"],
        supportedPlatforms: ["BookMyShow", "Swiggy", "Zomato", "Nykaa", "IRCTC"],
        applyUrl: "https://www.aubank.in/personal-banking/cards/credit-card/lit-credit-card",
    },

    /**
     * RBL ShopRite - Cashback focused card
     * Good for online shopping and retail
     */
    {
        id: "rbl-shoprite",
        name: "ShopRite",
        issuer: "RBL Bank",
        image: "https://www.rblbank.com/images/shoprite-card.png",
        type: "cashback",
        minIncome: 25000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 0,
        annualFeeWaiver: 0,
        categories: {
            online: 3,
            dining: 2,
            fuel: 1.5,
            foodDelivery: 2,
            groceries: 5,
            emi: 1,
            other: 1,
        },
        benefits: [
            "Cashback on all purchases",
            "Extra cashback on partner merchants",
            "Lifetime free with no annual charges",
            "Fuel surcharge waiver"
        ],
        loungeAccess: 0,
        bestFor: ["cashback", "shopping", "lifetime free"],
        applyUrl: "https://www.rblbank.com/credit-cards/shoprite",
    },

    /**
     * HSBC Visa Platinum - International travel focused
     * Great for travelers with global acceptance
     */
    {
        id: "hsbc-platinum",
        name: "Visa Platinum",
        issuer: "HSBC",
        image: "https://www.hsbc.co.in/content/dam/hsbc/in/images/cards/platinum.png",
        type: "travel",
        minIncome: 50000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "moderate",
        annualFee: 1500,
        annualFeeWaiver: 300000,
        categories: {
            travel: 4,
            dining: 3,
            online: 2,
            foodDelivery: 3,
            groceries: 2,
            emi: 1,
            other: 1,
        },
        benefits: [
            "Complimentary international airport lounge access",
            "Travel insurance coverage",
            "Dining privileges at partner restaurants worldwide",
            "SmartEMI facility"
        ],
        loungeAccess: 6,
        bestFor: ["international travel", "premium", "global acceptance"],
        applyUrl: "https://www.hsbc.co.in/credit-cards/products/visa-platinum/",
    },

    /**
     * American Express Membership Rewards - Premium rewards program
     * Best-in-class rewards and exclusive benefits
     */
    {
        id: "amex-mrcc",
        name: "Membership Rewards",
        issuer: "American Express",
        image: "https://www.americanexpress.com/in/credit-cards/mrcc.png",
        type: "rewards",
        minIncome: 45000,
        minAge: 18,
        maxAge: 70,
        targetUserTypes: ["Salaried", "Self-Employed", "Business"],
        approvalDifficulty: "moderate",
        annualFee: 1000,
        annualFeeWaiver: 150000,
        categories: {
            dining: 3,
            travel: 3,
            online: 2,
            foodDelivery: 3,
            groceries: 2,
            emi: 1,
            other: 1,
        },
        benefits: [
            "1000 bonus points per month on 4 transactions (₹1500 each)",
            "Flexible rewards program with transfer partners",
            "Exclusive dining and lifestyle offers",
            "Comprehensive purchase protection"
        ],
        loungeAccess: 0,
        bestFor: ["rewards maximization", "premium benefits", "dining"],
        applyUrl: "https://www.americanexpress.com/in/credit-cards/membership-rewards-credit-card/",
    },

    /**
     * Citi Rewards - Strong rewards earning
     * Good all-round card for various spending categories
     */
    {
        id: "citi-rewards",
        name: "Rewards",
        issuer: "Citibank",
        image: "https://www.citibank.co.in/images/rewards-card.png",
        type: "rewards",
        minIncome: 35000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Salaried", "Self-Employed"],
        approvalDifficulty: "moderate",
        annualFee: 1000,
        annualFeeWaiver: 200000,
        categories: {
            dining: 4,
            online: 3,
            travel: 3,
            foodDelivery: 4,
            groceries: 4,
            emi: 1,
            other: 1,
        },
        benefits: [
            "10X Reward Points on dining",
            "4X Reward Points on movies, fuel, grocery",
            "Easy EMI options",
            "Welcome bonus reward points"
        ],
        loungeAccess: 0,
        bestFor: ["dining rewards", "balanced earning", "flexibility"],
        applyUrl: "https://www.citibank.co.in/credit-cards/rewards-credit-card",
    },

    /**
     * IDFC First Millennia - Youth-focused card
     * Good entry card with decent rewards and no fees
     */
    {
        id: "idfc-millennia",
        name: "Millennia",
        issuer: "IDFC First Bank",
        image: "https://www.idfcfirstbank.com/content/dam/IDFCFirstBank/images/credit-cards/millennia-cc.png",
        type: "lifestyle",
        minIncome: 20000,
        minAge: 21,
        maxAge: 65,
        targetUserTypes: ["Student", "Salaried", "Self-Employed"],
        approvalDifficulty: "easy",
        annualFee: 0,
        annualFeeWaiver: 0,
        categories: {
            online: 2.5,
            dining: 2.5,
            fuel: 2,
            foodDelivery: 2.5,
            groceries: 2.5,
            emi: 1,
            other: 1,
        },
        benefits: [
            "Cashback on online shopping and dining",
            "Lifetime free with no annual charges",
            "Fuel surcharge waiver",
            "Welcome bonus"
        ],
        loungeAccess: 0,
        bestFor: ["young professionals", "lifetime free", "balanced"],
        applyUrl: "https://www.idfcfirstbank.com/credit-card/millennia-credit-card",
    },
];

/**
 * Returns cards grouped by issuer for UI selection
 */
export function getCardsByIssuer(): Map<string, CreditCard[]> {
    const grouped = new Map<string, CreditCard[]>();
    for (const card of cards) {
        const existing = grouped.get(card.issuer) || [];
        existing.push(card);
        grouped.set(card.issuer, existing);
    }
    return grouped;
}

const BANK_TO_ISSUER: Record<string, string> = {
    "HDFC": "HDFC Bank",
    "ICICI": "ICICI Bank",
    "SBI": "SBI Card",
    "Axis": "Axis Bank",
    "Kotak": "Kotak Mahindra Bank",
    "IndusInd": "IndusInd Bank",
    "IDFC First": "IDFC First Bank",
    "Yes Bank": "Yes Bank",
    "Citibank": "Citibank",
    "Standard Chartered": "Standard Chartered",
};

export function getCardsForBanks(selectedBanks: string[]): {
    prioritized: CreditCard[];
    others: CreditCard[];
} {
    const issuerNames = new Set(
        selectedBanks.map(bank => BANK_TO_ISSUER[bank]).filter(Boolean)
    );

    const prioritized: CreditCard[] = [];
    const others: CreditCard[] = [];

    for (const card of cards) {
        if (issuerNames.has(card.issuer)) {
            prioritized.push(card);
        } else {
            others.push(card);
        }
    }

    return { prioritized, others };
}
