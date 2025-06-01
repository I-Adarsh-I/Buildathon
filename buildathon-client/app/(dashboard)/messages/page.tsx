'use client';

import { useState } from 'react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { messages } from '@/lib/placeholder-data';
import { users } from '@/lib/placeholder-data';
import { getCurrentUser } from '@/lib/auth';

export default function MessagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const currentUser = getCurrentUser();
  
  // Group messages by conversation (based on the other person)
  const conversations = messages.reduce((acc, message) => {
    const isCurrentUserSender = message.senderId === currentUser?.id;
    const otherPersonId = isCurrentUserSender ? message.receiverId : message.senderId;
    
    if (!acc[otherPersonId]) {
      const otherPerson = users.find(user => user.id === otherPersonId);
      
      acc[otherPersonId] = {
        person: otherPerson!,
        messages: [],
        latestMessage: message,
        unreadCount: isCurrentUserSender ? 0 : (message.read ? 0 : 1)
      };
    } else {
      // Update latest message if this one is newer
      if (new Date(message.createdAt) > new Date(acc[otherPersonId].latestMessage.createdAt)) {
        acc[otherPersonId].latestMessage = message;
      }
      
      // Update unread count
      if (!isCurrentUserSender && !message.read) {
        acc[otherPersonId].unreadCount += 1;
      }
    }
    
    acc[otherPersonId].messages.push(message);
    return acc;
  }, {} as Record<string, {
    person: typeof users[0],
    messages: typeof messages,
    latestMessage: typeof messages[0],
    unreadCount: number
  }>);
  
  // Convert to array and sort by latest message date
  const conversationList = Object.values(conversations).sort(
    (a, b) => new Date(b.latestMessage.createdAt).getTime() - new Date(a.latestMessage.createdAt).getTime()
  );
  
  // Filter conversations based on search
  const filteredConversations = conversationList.filter(
    conv => conv.person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Communicate with your partners about campaigns and collaborations
        </p>
      </div>
      
      <Card className="p-0 overflow-hidden">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col md:flex-row border-b">
            <TabsList className="h-auto justify-start rounded-none border-r md:flex-col md:space-x-0 md:space-y-1 p-2">
              <TabsTrigger value="all" className="justify-start data-[state=active]:bg-muted">All Messages</TabsTrigger>
              <TabsTrigger value="unread" className="justify-start data-[state=active]:bg-muted">Unread</TabsTrigger>
              <TabsTrigger value="archived" className="justify-start data-[state=active]:bg-muted">Archived</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 p-4 border-b md:border-b-0">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <TabsContent value="all" className="p-0 m-0">
            <div className="divide-y">
              {filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <h3 className="text-lg font-medium">No messages found</h3>
                  <p className="text-muted-foreground mt-1">
                    Your message history will appear here
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation) => {
                  const { person, latestMessage, unreadCount } = conversation;
                  const isLatestFromCurrentUser = latestMessage.senderId === currentUser?.id;
                  
                  return (
                    <Link key={person.id} href={`/messages/${person.id}`}>
                      <div className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={person.image} />
                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-1">
                            <p className={`text-sm font-medium truncate ${unreadCount > 0 ? 'font-semibold' : ''}`}>
                              {person.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(latestMessage.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className={`text-sm truncate ${unreadCount > 0 ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                            {isLatestFromCurrentUser && <span>You: </span>}
                            {latestMessage.content}
                          </p>
                        </div>
                        
                        {latestMessage.campaignId && (
                          <Badge variant="outline" className="hidden sm:inline-flex">
                            Campaign
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="unread" className="flex flex-col items-center justify-center h-40 p-4">
            <p className="text-muted-foreground">Unread messages will appear here</p>
          </TabsContent>
          
          <TabsContent value="archived" className="flex flex-col items-center justify-center h-40 p-4">
            <p className="text-muted-foreground">Archived messages will appear here</p>
          </TabsContent>
        </Tabs>
      </Card>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Select a conversation to view and send messages
        </p>
      </div>
    </div>
  );
}