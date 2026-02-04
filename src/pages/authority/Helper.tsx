import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import ChennaiMap from '@/components/ChennaiMap';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { congestionData, areas, chatResponses } from '@/data/mockData';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  name: string;
  congestionLevel: 'low' | 'medium' | 'high';
  isHotspot?: boolean;
  speed?: number;
  density?: number;
  prediction?: string;
  reason?: string;
}

const AuthorityHelper = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Convert demo data to map markers
  const markers: MapMarker[] = congestionData.map(data => {
    const area = areas.find(a => a.id === data.areaId);
    return {
      id: data.id,
      lat: area?.latitude || 13.0827,
      lng: area?.longitude || 80.2707,
      name: data.areaName,
      congestionLevel: data.congestionLevel,
      isHotspot: data.prediction30min === 'high' && data.congestionLevel !== 'high',
      speed: data.currentSpeed,
      density: data.vehicleDensity,
      prediction: data.prediction30min,
      reason: data.reason
    };
  });

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('congestion') || lowerMessage.includes('traffic') || lowerMessage.includes('jam')) {
      return "**Authority Analysis:**\n\n" + chatResponses.congestion + "\n\n**Recommended Actions:**\n• Deploy traffic personnel to Guindy junction\n• Activate alternate route signage for OMR traffic\n• Consider signal timing adjustments at T. Nagar";
    }
    if (lowerMessage.includes('route') || lowerMessage.includes('best way') || lowerMessage.includes('diversion')) {
      return "**Route Analysis:**\n\n" + chatResponses.route + "\n\n**Diversion Recommendations:**\n• Direct OMR traffic to ECR via Perungudi\n• Use Inner Ring Road as primary alternate\n• Avoid Mount Road during peak hours";
    }
    if (lowerMessage.includes('predict') || lowerMessage.includes('forecast') || lowerMessage.includes('next') || lowerMessage.includes('expect')) {
      return "**Traffic Prediction:**\n\n" + chatResponses.prediction + "\n\n**Planning Recommendations:**\n• Pre-position resources at Guindy by 4:30 PM\n• Alert backup teams for OMR corridor\n• Prepare diversion routes for T. Nagar area";
    }
    if (lowerMessage.includes('cost') || lowerMessage.includes('economic') || lowerMessage.includes('fuel') || lowerMessage.includes('emission')) {
      return "**Economic Impact Analysis:**\n\nCurrent congestion is estimated to cause:\n• Fuel wastage: ~2,500 liters/day\n• Time loss: ~15,000 person-hours/day\n• CO2 emissions: ~5,775 kg/day\n• Economic cost: ₹4.5 lakhs/day\n\nUse the Cost Calculator for detailed analysis.";
    }
    if (lowerMessage.includes('stable') || lowerMessage.includes('reliable')) {
      return "**Reliability Analysis:**\n\n" + chatResponses.stability + "\n\n**Operational Guidance:**\n• Prioritize patrol presence on unstable routes\n• Monitor Guindy and OMR for sudden changes\n• ECR is most reliable for emergency diversions";
    }
    
    return "I can help with traffic analysis, route recommendations, congestion predictions, and cost impact assessments. You can ask about:\n\n• Current traffic conditions and hotspots\n• Route stability and reliability\n• Traffic predictions for the next 3 hours\n• Economic and environmental impact\n• Recommended actions for traffic management";
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
      <Navbar role="authority" />
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Full Map */}
        <div className="flex-1 relative min-h-[300px] lg:min-h-0">
          <ChennaiMap 
            markers={markers}
            className="h-full w-full"
          />
          {/* Title overlay on map */}
          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
            <h1 className="font-display text-lg font-bold">AI Decision Helper</h1>
            <p className="text-xs text-muted-foreground">Live traffic overview</p>
          </div>
        </div>

        {/* AI Chat Sidebar */}
        <Card className="w-full lg:w-96 flex flex-col border-l rounded-none border-y-0 border-r-0">
          <CardHeader className="py-3 border-b shrink-0">
            <CardTitle className="text-sm">Conversational Traffic Assistant</CardTitle>
          </CardHeader>
          
          {/* Suggested Questions */}
          <div className="p-3 border-b flex flex-wrap gap-2">
            {[
              "Current hotspots?",
              "3-hour forecast",
              "Economic impact"
            ].map((q, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(q)}
                className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <ChatInterface
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            placeholder="Ask for traffic insights..."
            className="flex-1 min-h-0"
          />
        </Card>
      </div>
    </div>
  );
};

export default AuthorityHelper;
