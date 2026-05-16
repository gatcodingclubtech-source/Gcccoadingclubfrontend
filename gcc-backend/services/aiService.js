const Groq = require('groq-sdk');

class AIService {
  constructor() {
    this._initialize();
  }

  _initialize() {
    // If we're in development, we can try to re-read the .env file if the key is missing
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'ENTER_YOUR_GROQ_KEY_HERE') {
      require('dotenv').config();
    }
    
    this.apiKey = process.env.GROQ_API_KEY;
    if (!this.apiKey || this.apiKey === 'ENTER_YOUR_GROQ_KEY_HERE') {
      this.groq = null;
    } else {
      this.groq = new Groq({
        apiKey: this.apiKey
      });
      console.log('🚀 GCC OS: AI Neural Link Established (Groq Online)');
    }
  }

  get client() {
    // Check if key in process.env changed
    if (process.env.GROQ_API_KEY !== this.apiKey) {
      this._initialize();
    }
    return this.groq;
  }

  /**
   * AI Mentor: Provides technical guidance and club-specific info
   */
  async getMentorResponse(prompt, context = "") {
    try {
      if (!this.client) return "My AI Core is currently offline. Please configure the GROQ_API_KEY.";

      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are the GCC AI Mentor, a technical guide for the GAT Coding Club (GCC) platform. You are helpful, professional, and futuristic. You know everything about the club's domains (Web, AI, Cyber, etc.) and events. Keep responses concise, elite, and insightful."
          },
          {
            role: "user",
            content: context ? `Context: ${context}\n\nMember Query: ${prompt}` : prompt
          }
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.7,
        max_tokens: 1024,
      });

      return completion.choices[0]?.message?.content || "My neural link is temporarily offline.";
    } catch (error) {
      console.error("AI Mentor Error Detail:", error.message);
      if (error.status === 401) return "Unauthorized: Your GROQ_API_KEY appears to be invalid.";
      if (error.status === 429) return "Rate Limit: Too many requests to the AI Core. Please wait.";
      return `Neural Link Error: ${error.message.substring(0, 50)}...`;
    }
  }

  /**
   * AI Toxicity Detection: Checks for inappropriate content
   */
  async checkToxicity(content) {
    try {
      if (!this.client) return { toxic: false, reason: "AI Analysis Offline" };

      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "Analyze the following message for toxicity, harassment, or inappropriate content. Return ONLY a JSON object with 'toxic' (boolean) and 'reason' (string)."
          },
          {
            role: "user",
            content: content
          }
        ],
        model: "llama-3.1-8b-instant",
        response_format: { type: "json_object" }
      });

      return JSON.parse(completion.choices[0]?.message?.content);
    } catch (error) {
      return { toxic: false, reason: "Analysis failed" };
    }
  }
}

module.exports = new AIService();
