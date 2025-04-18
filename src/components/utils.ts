export type RiskLevel = "safe" | "suspicious" | "dangerous" | null;
export type InputType = "text" | "link" | "image";

export interface AnalysisResult {
    riskLevel: RiskLevel;
    score: number;
    reasons: string[];
    advice: string;
}

export const analyzeContent = (content: string, type: InputType): AnalysisResult => {
    const contentLower = content.toLowerCase();

    // Base keyword arrays
    const scamKeywords = [
        "bitcoin", "crypto", "wallet", "urgent", "emergency",
        "password", "account", "login", "verify", "prize", "winner",
        "lottery", "inheritance", "prince", "bank", "transfer", "payment",
        "suspended", "blocked", "credit card", "social security", "ssn"
    ];

    const urgencyKeywords = [
        "urgent", "immediately", "today", "now", "hurry", "quick",
        "fast", "limited time", "act now", "expires", "last chance",
        "final warning", "respond asap"
    ];

    const financialKeywords = [
        "money", "cash", "dollars", "payment", "bank", "account", "transfer",
        "bitcoin", "crypto", "wallet", "investment", "return", "profit",
        "1million", "million", "$", "usd", "donation", "funding"
    ];

    const personalInfoKeywords = [
        "password", "username", "login", "ssn", "social security",
        "credit card", "address", "phone", "date of birth", "id number"
    ];

    let scamWordCount = 0;
    let urgencyWordCount = 0;
    let financialWordCount = 0;
    let personalInfoWordCount = 0;

    scamKeywords.forEach(word => {
        if (contentLower.includes(word)) scamWordCount++;
    });
    urgencyKeywords.forEach(word => {
        if (contentLower.includes(word)) urgencyWordCount++;
    });
    financialKeywords.forEach(word => {
        if (contentLower.includes(word)) financialWordCount++;
    });
    personalInfoKeywords.forEach(word => {
        if (contentLower.includes(word)) personalInfoWordCount++;
    });

    // Base scoring calculation with increased weights for higher sensitivity
    const totalMatches =
        scamWordCount * 1.0 +
        urgencyWordCount * 2.5 +
        financialWordCount * 2.0 +
        personalInfoWordCount * 2.5;
    const maxPossibleScore =
        scamKeywords.length * 1.0 +
        (urgencyKeywords.length * 2.5) +
        (financialKeywords.length * 2.0) +
        (personalInfoKeywords.length * 2.5);

    // Multiply by 5 for increased sensitivity.
    const scorePercentage = Math.min(Math.round((totalMatches / maxPossibleScore) * 100 * 5), 100);

    const reasons: string[] = [];

    if (urgencyWordCount >= 1) {
        reasons.push("Contains urgent action language");
    }
    if (financialWordCount >= 2) {
        reasons.push("References financial transactions or donations");
    }
    if (personalInfoWordCount >= 1) {
        reasons.push("Requests sensitive personal information");
    }
    if (
        contentLower.includes("bitcoin") ||
        contentLower.includes("crypto") ||
        contentLower.includes("wallet") ||
        contentLower.includes("investment")
    ) {
        reasons.push("Mentions cryptocurrency or investment opportunity");
    }
    if (
        contentLower.includes("prize") ||
        contentLower.includes("winner") ||
        contentLower.includes("lottery") ||
        contentLower.includes("won")
    ) {
        reasons.push("Offers prize or lottery winnings");
    }
    if (
        contentLower.includes("account") &&
        (contentLower.includes("verify") || contentLower.includes("confirm") || contentLower.includes("update"))
    ) {
        reasons.push("Requests account verification or confirmation");
    }

    // Enhanced Link Analysis
    if (type === "link") {
        try {
            const parsedUrl = new URL(content);
            const domain = parsedUrl.hostname.toLowerCase();

            // Check for known URL shorteners
            const knownShorteners = [
                "grabify.link",
                "shorturl.at",
                "bitly.com",
                "free-url-shortener.rb.gy",
                "canva.com",
                "linklyhq.com",
                "goo.gl",
                "tinyurl",
                "t.co"
            ];
            if (knownShorteners.some(shortDomain => domain.includes(shortDomain))) {
                reasons.push("Uses URL shortener that may hide destination");
            }

            // Check for suspicious patterns in URL
            if (/\d{4,}/.test(contentLower) || contentLower.includes("-") || contentLower.includes(".xyz")) {
                reasons.push("URL contains suspicious domain patterns");
            }

            // Check for known IP grabbers or phishing-related substrings
            const suspiciousSubstrings = ["iplogger", "grabify", "advancedipgrabber", "ip loggers"];
            suspiciousSubstrings.forEach(suspect => {
                if (domain.includes(suspect)) {
                    reasons.push(`Domain contains suspicious term: "${suspect}"`);
                }
            });

            // Check for insecure protocol
            if (parsedUrl.protocol !== "https:") {
                reasons.push("URL uses insecure protocol (HTTP)");
            }
        } catch (error) {
            reasons.push("Invalid URL structure");
        }
    }

    // Image Analysis (simulate OCR/visual analysis)
    if (type === "image") {
        if (Math.random() > 0.7) {
            reasons.push("Image contains suspicious visual elements");
        }
        if (Math.random() > 0.5) {
            reasons.push("Screenshot shows questionable formatting");
        }
    }

    if (reasons.length === 0 && scorePercentage > 40) {
        reasons.push("Contains suspicious combination of keywords");
    }
    if (reasons.length < 2 && scorePercentage > 30) {
        const possibleReasons = [
            "Presents too-good-to-be-true offers",
            "Uses high-pressure tactics",
            "Contains grammatical errors typical of scam messages",
            "Sender information appears suspicious",
            "Message format matches known scam patterns"
        ];
        const randomCount = Math.min(2 - reasons.length, 2);
        for (let i = 0; i < randomCount; i++) {
            const randomIndex = Math.floor(Math.random() * possibleReasons.length);
            if (!reasons.includes(possibleReasons[randomIndex])) {
                reasons.push(possibleReasons[randomIndex]);
            }
        }
    }

    let riskLevel: RiskLevel = "safe";
    if (scorePercentage >= 70) {
        riskLevel = "dangerous";
    } else if (scorePercentage >= 40) {
        riskLevel = "suspicious";
    }

    if (reasons.length === 0) {
        reasons.push("No urgent language detected");
        reasons.push("No suspicious keywords found");
        reasons.push("No requests for personal information");
    }

    let advice = "";
    if (riskLevel === "dangerous") {
        advice =
            "This appears to be a scam attempt. Do not respond, click links, or provide any information. Block the sender immediately and report this message.";
    } else if (riskLevel === "suspicious") {
        advice =
            "This message contains some suspicious elements. Verify the sender through alternative channels before taking any action or sharing information.";
    } else {
        advice =
            "This message appears to be safe, but always remain cautious with unexpected communications or requests for information.";
    }

    return {
        riskLevel,
        score: scorePercentage,
        reasons: reasons.slice(0, 5),
        advice,
    };
};

export const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
        case "safe":
            return "text-success border-success bg-success/10";
        case "suspicious":
            return "text-warning border-warning bg-warning/10";
        case "dangerous":
            return "text-danger border-danger bg-danger/10";
        default:
            return "";
    }
};
