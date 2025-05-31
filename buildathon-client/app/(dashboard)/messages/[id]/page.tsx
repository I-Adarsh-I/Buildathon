'use client';

import { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { messages, users } from '@/lib/placeholder-data';
import { getCurrentUser } from '@/lib/auth';
import { ArrowLeft, Send, Paperclip, Smile } from 'lucide-react';
import Link from 'next/link';

interface ChatMessageProps {
  content: string;
  timestamp: string;
  isCurrentUser: boolean;
}

function ChatMessage({ content, timestamp, isCurrentUser }: ChatMessageProps) {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isCurrentUser ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
          <p>{content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

export default function MessagePage({ params }: { params: { id: string } }) {
  const [messageText, setMessageText] = useState('');
  const [chatMessages, setChatMessages] = useState<typeof messages>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = getCurrentUser();
  const otherUser = users.find(user => user.id === params.id);
  
  // Filter messages for this conversation
  useEffect(() => {
    const conversationMessages = messages.filter(
      msg => 
        (msg.senderId === currentUser?.id && msg.receiverId === params.id) ||
        (msg.senderId === params.id && msg.receiverId === currentUser?.id)
    ).sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    
    setChatMessages(conversationMessages);
  }, [currentUser?.id, params.id]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    // Create a new message
    const newMessage = {
      id: String(Date.now()),
      senderId: currentUser?.id || '',
      receiverId: params.id,
      content: messageText,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    // Add to chat
    setChatMessages([...chatMessages, newMessage]);
    setMessageText('');
  };

  if (!otherUser) {
    return <div>User not found</div>;
  }
  
  return (
    <div className="h-[calc(100vh-10rem)] flex flex-col">
      <div className="mb-4">
        <Link href="/messages" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span className="text-sm">Back to messages</span>
        </Link>
      </div>
      
      <Card className="flex flex-col flex-1 overflow-hidden">
        <CardHeader className="py-3 px-4 border-b flex-row items-center gap-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser.image} />
            <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-medium">{otherUser.name}</h2>
            <p className="text-sm text-muted-foreground">{otherUser.role}</p>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-muted-foreground mb-2">No messages yet</p>
              <p className="text-sm text-muted-foreground">
                Send a message to start the conversation with {otherUser.name}
              </p>
            </div>
          ) : (
            chatMessages.map((msg) => (
              <ChatMessage 
                key={msg.id}
                content={msg.content}
                timestamp={msg.createdAt}
                isCurrentUser={msg.senderId === currentUser?.id}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="flex-shrink-0"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Type a message..."
                className="w-full rounded-full border border-input px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full flex-shrink-0"
              disabled={!messageText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}