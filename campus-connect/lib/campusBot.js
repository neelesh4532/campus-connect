// Simple rule-based demo bot. Replace with Dialogflow/Vertex calls.
export async function campusBotReply(message) {
    const msg = message?.toLowerCase?.() || '';
    if (!msg) return "Ask me about events, peer matching, or Google programs.";

    if (/(event|workshop|hackathon)/.test(msg)) {
        return `Upcoming: "Intro to Google Cloud + Firebase" on 2025-09-15 at CSE Seminar Hall. Check Event Hub.`;
    }
    if (/(gdsc|google|program|gsoc|step)/.test(msg)) {
        return `Explore Career Hub — Google programs like GSoC, STEP, Cloud Skills Boost are great.`;
    }
    if (/(mentor|study|team|group)/.test(msg)) {
        return `Use Peer Connect: filter by skills/interests to find teammates or mentors.`;
    }
    if (/(contact|help|ambassador|lead)/.test(msg)) {
        return `Contact the Campus Ambassador via the Help menu in-app.`;
    }
    return "I can help with Events, Peer Connect, and Career resources. Try asking: \"upcoming events\" or \"find a mentor\".";
}
