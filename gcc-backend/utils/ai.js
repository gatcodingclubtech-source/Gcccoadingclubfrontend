/**
 * AI Utility for GCC Portal
 * Handles Discussion Summarization and Toxicity Detection
 */

const summarizeDiscussion = (content) => {
    // In production, this would call OpenAI/Gemini
    // For now, it's a "Smart Logic" summarizer
    const sentences = content.split(/[.!?]/).filter(s => s.trim().length > 0);
    if (sentences.length <= 2) return content;
    
    return sentences.slice(0, 2).join('. ') + '... [AI Summarized]';
};

const detectToxicity = (text) => {
    const toxicKeywords = ['spam', 'abuse', 'hate', 'badword']; // Placeholder
    const words = text.toLowerCase().split(/\s+/);
    return words.some(word => toxicKeywords.includes(word));
};

module.exports = { summarizeDiscussion, detectToxicity };
