export class IntentService {
    /**
     * Detect the intent of a user's question using keyword matching.
     */
    static detectIntent(question) {
        const q = question.toLowerCase();
        // Define keywords for each intent
        const intentMap = {
            project: ['project', 'portfolio', 'application', 'github', 'built', 'developed', 'created', 'app', 'website'],
            skills: ['skill', 'technology', 'stack', 'framework', 'language', 'tools', 'know', 'can you do'],
            experience: ['experience', 'work', 'job', 'company', 'role', 'position', 'career'],
            education: ['education', 'degree', 'university', 'college', 'school', 'study', 'graduat'],
            certificate: ['certificate', 'certification', 'award', 'achievement', 'course'],
            contact: ['contact', 'email', 'phone', 'call', 'reach', 'social', 'linkedin', 'hire'],
            resume: ['resume', 'cv', 'download', 'pdf'],
            timeline: ['timeline', 'history', 'chronolog'],
            links: ['link', 'url', 'website'],
            multiple: ['about', 'who', 'profile', 'bio', 'overview', 'sohag'],
            text: [], // Fallback
        };
        const matches = new Set();
        for (const [intent, keywords] of Object.entries(intentMap)) {
            if (intent === 'text')
                continue;
            for (const keyword of keywords) {
                if (q.includes(keyword)) {
                    matches.add(intent);
                    break; // move to the next intent once one keyword matches for this intent
                }
            }
        }
        if (matches.size > 1) {
            return 'multiple';
        }
        if (matches.size === 1) {
            return Array.from(matches)[0];
        }
        return 'text';
    }
}
//# sourceMappingURL=intent.service.js.map