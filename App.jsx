import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, FileText, Users, MessageCircle, Menu, X, Settings } from 'lucide-react';

const AuntMaeApp = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello there, dear. I'm Aunt Mae, and I'm here to help you navigate the healthcare system with confidence and clarity. Whether you're facing a new diagnosis, caring for a loved one, or just feeling overwhelmed by medical appointments and insurance, I've got you covered. What's on your mind today?",
      sender: 'mae',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiSetup, setShowApiSetup] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Aunt Mae's comprehensive system prompt with all her expertise
  const getSystemPrompt = () => {
    return `You are Aunt Mae, a patient advocacy expert with deep healthcare systems knowledge. Your role is to provide warm, practical guidance to help people navigate healthcare challenges.

PERSONALITY & VOICE:
- Warm, direct, and wise - like a trusted relative who's "seen it all"
- Speak human, not clinical - translate complex medical jargon into understandable terms
- Lead with empathy and validation, especially for emotional situations
- Use phrases like "Let's slow this down and make sense of it" and "You deserve to understand every single word they say"
- Never patronizing or dismissive - always empowering

EXPERTISE AREAS:
- Patient Safety & Medical Errors
- Insurance Appeals & Medication Denials  
- Medicare & Medicaid Navigation
- Medical Billing & Financial Assistance
- Advance Directives & End-of-Life Planning
- Hospital Systems & Care Coordination
- Skilled Nursing & Long-Term Care
- Behavioral Health Navigation
- Pediatric Care Advocacy
- CMS & Joint Commission Standards
- State Health Department Regulations
- Healthcare Economics & Innovation
- FDA Regulations & Drug Safety
- Physician Credentialing & Malpractice
- COVID & Pandemic Healthcare Changes

THE MAE METHOD™:
Guide people through: Find MEANING in their situation → ASK the right questions → EMPOWER themselves with tools and confidence

CRITICAL BOUNDARIES:
- NEVER provide medical advice, diagnosis, or treatment recommendations
- Always redirect medical questions to healthcare providers
- Focus on advocacy, navigation, and system understanding
- If someone asks for medical advice, say: "While I can't provide medical advice, I can help you prepare to get the answers you need from your healthcare team."

RESPONSE APPROACH:
1. Lead with empathy and validation for emotional situations
2. Provide context without making excuses for poor care
3. Offer specific, actionable next steps
4. End with offers to help further: "How can I help you with this situation?"
5. Be responsive to the specific context - pain medication refusal is different from ER neglect

SPECIAL SITUATIONS:
- Pregnancy concerns: Validate maternal instincts, emphasize second opinion rights
- Pain management: Acknowledge opioid crisis context while validating pain
- Medical errors: Focus on safety, documentation, and reporting
- Insurance denials: Explain appeal rights and specific timelines
- Emotional distress: Lead with Brené Brown-style validation

Remember: You're helping people feel empowered and informed, not replacing their medical team.`;
  };

  // Generate AI response using Claude API
  const generateAIResponse = async (userMessage) => {
    if (!apiKey) {
      return "I need an API key to provide you with intelligent responses. Please click the settings icon to set up your Claude API key.";
    }

    // For now, provide a smart fallback response while we set up proper API handling
    // In production, this would go through a backend server to avoid CORS issues
    return `I hear you, and I understand you're reaching out for help with this healthcare situation. 

Right now, I'm running in demo mode while we set up the full API integration. In the deployed version, I'll be able to provide you with comprehensive, contextual responses using the MAE Method™:

**Find MEANING** - I'll help you understand what's really happening in your situation
**ASK Smart** - I'll guide you to the right questions to get clarity  
**EMPOWER Yourself** - I'll give you specific tools and next steps

For immediate help, I recommend:
- Documenting your concerns in writing
- Preparing specific questions for your healthcare team
- Knowing you have rights and options, even when situations feel overwhelming

Would you like me to help you think through your specific situation using these principles? What's the most pressing healthcare challenge you're facing right now?

*Note: This is a demonstration. The full version will provide detailed, personalized guidance.*`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(inputText);
      
      const maeResponse = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'mae',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, maeResponse]);
    } catch (error) {
      const errorResponse = {
        id: messages.length + 2,
        text: "I'm having some technical difficulties right now. Please try again in a moment. If you're experiencing a medical emergency, please call 911 immediately.",
        sender: 'mae',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setShowApiSetup(false);
      // In a real deployment, you'd want to encrypt/secure this
      sessionStorage.setItem('claude_api_key', apiKey);
    }
  };

  const quickStartOptions = [
    "I need help preparing for a doctor's appointment",
    "My insurance denied coverage - what now?",
    "I'm caring for an aging parent and feel overwhelmed",
    "I don't understand my diagnosis or test results",
    "How do I advocate for better care?",
    "I think there was a medical error - what should I do?",
    "I need help with Medicare or Medicaid",
    "I can't afford my medical bills",
    "I need to understand advance directives",
    "How do I navigate a hospital stay?",
    "I need help with mental health care navigation",
    "My child needs special healthcare coordination",
    "My medication was denied by insurance",
    "I want to file a complaint about my hospital",
    "I need help understanding healthcare quality ratings",
    "How do I know if my doctor is qualified?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* API Setup Modal */}
      {showApiSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Setup Claude API Key</h3>
            <p className="text-sm text-gray-600 mb-4">
              To enable Aunt Mae's AI responses, you'll need a Claude API key from Anthropic.
              <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" 
                 className="text-sky-500 hover:underline ml-1">
                Get your API key here
              </a>
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Claude API key"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <div className="flex gap-2">
              <button
                onClick={saveApiKey}
                className="flex-1 bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600"
              >
                Save Key
              </button>
              <button
                onClick={() => setShowApiSetup(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b-2 border-sky-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-sky-500 to-blue-800 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Ask Aunt Mae</h1>
                <p className="text-sm text-gray-600">AI-Powered Patient Advocacy Guide</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setShowApiSetup(true)}
                className="p-2 rounded-lg hover:bg-gray-100"
                title="API Settings"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showMenu ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-sky-500" />
                The MAE Method™
              </h3>
              <div className="space-y-4">
                <div className="border-l-4 border-sky-400 pl-4">
                  <h4 className="font-medium text-sky-700">Find Meaning</h4>
                  <p className="text-sm text-gray-600">Understand what's really happening in your care</p>
                </div>
                <div className="border-l-4 border-blue-800 pl-4">
                  <h4 className="font-medium text-blue-800">Ask Smart</h4>
                  <p className="text-sm text-gray-600">Know the right questions to get clarity</p>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-medium text-green-700">Empower Yourself</h4>
                  <p className="text-sm text-gray-600">Take control with tools and confidence</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-800" />
                Quick Start
              </h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {quickStartOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setInputText(option)}
                    className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-sky-50 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-sky-300"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg h-96 lg:h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-sky-500 to-blue-800 rounded-full flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Aunt Mae</h3>
                    <p className={`text-sm ${apiKey ? 'text-green-600' : 'text-orange-500'}`}>
                      {apiKey ? '● AI-Powered - Ready to help' : '⚠ Setup required - Click settings'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-xl ${
                        message.sender === 'user'
                          ? 'bg-gradient-to-r from-sky-500 to-blue-800 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      <p className={`text-xs mt-2 ${
                        message.sender === 'user' ? 'text-sky-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-xl rounded-bl-none px-4 py-3 max-w-xs">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Aunt Mae is thinking...</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Aunt Mae anything about healthcare navigation..."
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isTyping}
                    className="bg-gradient-to-r from-sky-500 to-blue-800 text-white px-6 py-3 rounded-lg hover:from-sky-600 hover:to-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Aunt Mae provides guidance and support, not medical advice. Always consult healthcare professionals for medical decisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="w-5 h-5 text-red-400" />
              <span className="text-gray-600">Created with care by a leader in Patient Safety</span>
            </div>
            <p className="text-sm text-gray-500">
              Healthcare navigation wisdom you can trust. Because you don't need a degree to advocate like a pro.
            </p>
          </div>
          
          {/* Medical Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-4xl mx-auto">
            <h3 className="font-semibold text-yellow-800 mb-3 text-center">Important Medical Disclaimer</h3>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>
                <strong>Aunt Mae provides patient advocacy guidance and healthcare navigation support only.</strong> 
                This service does not provide medical advice, diagnosis, or treatment recommendations.
              </p>
              <p>
                All information shared is for educational and advocacy purposes only. Always consult with qualified 
                healthcare professionals for medical decisions, symptom evaluation, treatment options, and health concerns.
              </p>
              <p>
                If you are experiencing a medical emergency, please call 911 or go to your nearest emergency room immediately.
              </p>
              <p className="text-center font-medium">
                Aunt Mae helps you ask better questions and navigate the healthcare system - 
                your medical team provides the medical expertise.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuntMaeApp;