import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import ChennaiMap from '@/components/ChennaiMap';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

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
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  useEffect(() => {
    const fetchMapData = async () => {
      const { data: congestionData } = await supabase
        .from('congestion_data')
        .select(`
          id,
          congestion_level,
          prediction_10min,
          current_speed,
          vehicle_density,
          reason,
          chennai_areas (id, name, latitude, longitude)
        `)
        .order('recorded_at', { ascending: false });

      if (congestionData) {
        const uniqueMarkers = new Map<string, MapMarker>();
        
        congestionData.forEach((item: any) => {
          const area = item.chennai_areas;
          if (area && !uniqueMarkers.has(area.id)) {
            uniqueMarkers.set(area.id, {
              id: area.id,
              lat: Number(area.latitude),
              lng: Number(area.longitude),
              name: area.name,
              congestionLevel: item.congestion_level,
              isHotspot: item.prediction_10min === 'high' && item.congestion_level !== 'high',
              speed: item.current_speed,
              density: item.vehicle_density,
              prediction: item.prediction_10min,
              reason: item.reason
            });
          }
        });

        setMarkers(Array.from(uniqueMarkers.values()));
      }
    };

    fetchMapData();
  }, []);

  const handleSendMessage = async (content: string) => {
    if (!user) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          chatType: 'authority'
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Save to chat history
      await supabase.from('chat_history').insert([
        { user_id: user.id, role: 'user', content, chat_type: 'authority' },
        { user_id: user.id, role: 'assistant', content: data.response, chat_type: 'authority' }
      ]);

    } catch (error: any) {
      console.error('Chat error:', error);
      if (error.message?.includes('429')) {
        toast.error('Rate limit exceeded. Please try again in a moment.');
      } else if (error.message?.includes('402')) {
        toast.error('AI credits exhausted. Please add more credits.');
      } else {
        toast.error('Failed to get response. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-bold mb-2">AI Decision Helper</h1>
          <p className="text-muted-foreground">Get smart insights and recommendations for traffic management</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-240px)]">
          {/* Map Preview */}
          <Card className="overflow-hidden">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Live Traffic Overview</CardTitle>
            </CardHeader>
            <ChennaiMap 
              markers={markers}
              className="h-[calc(100%-52px)]"
            />
          </Card>

          {/* AI Chat */}
          <Card className="flex flex-col overflow-hidden">
            <CardHeader className="py-3 border-b">
              <CardTitle className="text-sm">AI Assistant</CardTitle>
            </CardHeader>
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              placeholder="Ask for traffic insights, deployment suggestions..."
              className="flex-1"
            />
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AuthorityHelper;
