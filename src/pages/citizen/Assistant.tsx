import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { Card } from '@/components/ui/card';
import { chatResponses } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const CitizenAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('congestion') || lowerMessage.includes('traffic') || lowerMessage.includes('jam')) {
      return chatResponses.congestion;
    }
    if (lowerMessage.includes('route') || lowerMessage.includes('best way') || lowerMessage.includes('how to get')) {
      return chatResponses.route;
    }
    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast') || lowerMessage.includes('next') || lowerMessage.includes('later')) {
      return chatResponses.prediction;
    }
    if (lowerMessage.includes('stable') || lowerMessage.includes('reliable') || lowerMessage.includes('consistent')) {
      return chatResponses.stability;
    }
    if (lowerMessage.includes('peak') || lowerMessage.includes('busy') || lowerMessage.includes('rush')) {
      return chatResponses.peak;
    }
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('monsoon')) {
      return chatResponses.weather;
    }
    
    return chatResponses.default;
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const response = getAIResponse(content);
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar role="citizen" />
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold mb-2">Conversational Traffic Assistant</h1>
          <p className="text-muted-foreground">Ask any question about traffic conditions, routes, predictions, and more</p>
        </div>

        {/* Suggested Questions */}
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            "What's the current traffic situation?",
            "Which route is most stable?",
            "What's the prediction for the next 3 hours?",
            "When are peak traffic hours?"
          ].map((question, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(question)}
              className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            placeholder="Ask about traffic, routes, predictions..."
            className="h-[calc(100vh-320px)]"
          />
        </Card>
      </main>
    </div>
  );
};

export default CitizenAssistant;
