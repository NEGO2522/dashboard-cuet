import React, { useState, useRef, useEffect } from 'react';
import './AMABot.css';

export function AMABot() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [inputText, setInputText] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = [
    "What documents do I need?",
    "How does CSAS work?",
    "Best colleges for Commerce?",
    "What is EWS quota?",
    "Explain seat allocation rounds"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [conversationHistory, isOpen, isLoading]);

  const toggleBot = () => {
    setIsOpen(!isOpen);
    if (!hasOpened) setHasOpened(true);
  };

  const clearChat = () => {
    setConversationHistory([]);
  };

  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    const newHistory = [...conversationHistory, { role: "user", content: userText }];
    setConversationHistory(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          system: `You are DU Buddy, a helpful Delhi University admissions assistant for CuetPro. Answer questions about:
- CSAS process (Phase 1: registration & preferences, Phase 2: 3 allocation rounds, Phase 3: document verification & fee)
- CUET exam (subjects, scores, NTA portal)
- Eligibility (which subjects needed for which programs)
- All 91 DU colleges (campuses: North/South/East/West/Central, specialisations)
- Categories: UR, OBC-NCL, SC, ST, EWS, PwBD — seat percentages, certificate requirements
- Quotas: ECA (5% seats, cultural activities), Sports (5%, national/state level), Defence, CW
- Required documents: CUET scorecard, Class 12 marksheet, Class 10, character certificate, migration certificate, category certificates, Aadhaar
- Key portals: admission.uod.ac.in (CSAS), nta.ac.in (CUET scores)
- Previous cutoff context: SRCC, Miranda, Hindu, LSR, Hansraj have highest cutoffs (typically 95-99 percentile range)

Rules:
- Always clarify cutoffs change yearly — never guarantee admission
- If asked about current year cutoffs: say "I have last year's data — always verify on admission.uod.ac.in"
- Be concise, use bullet points for lists
- Warm and helpful tone — students are stressed
- If question is completely unrelated to DU admissions, politely say so`,
          messages: newHistory
        })
      });

      const data = await response.json();
      if (data && data.content && data.content[0]) {
        const botReply = data.content[0].text;
        setConversationHistory([...newHistory, { role: "assistant", content: botReply }]);
      } else {
        setConversationHistory([...newHistory, { role: "assistant", content: "I'm sorry, I encountered an error connecting to the server. Please try again." }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setConversationHistory([...newHistory, { role: "assistant", content: "I'm having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(inputText);
    }
  };

  return (
    <div className="ama-bot-wrapper">
      <div className={`ama-bot-panel ${isOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="ama-bot-header">
          <div className="ama-header-info">
            <div className="ama-header-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              DU Buddy
            </div>
            <div className="ama-header-subtitle">Ask me anything about DU admissions</div>
          </div>
          <div className="ama-header-actions">
            <button className="ama-header-btn" onClick={clearChat} title="Clear Chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
            <button className="ama-header-btn" onClick={toggleBot} title="Close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="ama-messages-area">
          {conversationHistory.length === 0 ? (
            <div className="ama-suggestions">
              {suggestedQuestions.map((q, idx) => (
                <button 
                  key={idx} 
                  className="ama-suggestion-pill"
                  onClick={() => {
                    setInputText(q);
                    sendMessage(q);
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          ) : (
            conversationHistory.map((msg, idx) => (
              <div key={idx} className={`ama-message-row ${msg.role === 'user' ? 'user' : 'bot'}`}>
                <div className="ama-message-bubble-container">
                  {msg.role !== 'user' && (
                    <div className="ama-bot-avatar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                    </div>
                  )}
                  <div className="ama-message-bubble">{msg.content}</div>
                </div>
                <div className="ama-message-time">Just now</div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="ama-message-row bot">
              <div className="ama-message-bubble-container">
                <div className="ama-bot-avatar">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
                </div>
                <div className="ama-typing-indicator">
                  <div className="ama-typing-dot"></div>
                  <div className="ama-typing-dot"></div>
                  <div className="ama-typing-dot"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="ama-input-area">
          <input 
            type="text" 
            className="ama-input" 
            placeholder="Type your question..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            className="ama-send-btn" 
            onClick={() => sendMessage(inputText)}
            disabled={!inputText.trim() || isLoading}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>

      </div>

      <button className="ama-bot-toggle" onClick={toggleBot}>
        {!hasOpened && <div className="ama-notification-dot"></div>}
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
        )}
      </button>
    </div>
  );
}
