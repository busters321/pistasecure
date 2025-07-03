// src/services/ipThreatService.ts
import { toast } from "@/hooks/use-toast";

const API_BASE_URL = "/api/ip-threat"; // Will proxy to AbuseIPDB

export const checkIpThreat = async (ip: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/check?ip=${encodeURIComponent(ip)}`);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "API request failed");
        }

        return await response.json();
    } catch (error: any) {
        toast({
            title: "API Error",
            description: error.message || "Failed to fetch IP threat data",
            variant: "destructive",
        });
        throw error;
    }
};