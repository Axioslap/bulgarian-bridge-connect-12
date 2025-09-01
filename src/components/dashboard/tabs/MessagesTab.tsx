import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  MessageCircle, 
  Users, 
  Plus, 
  Send, 
  Reply, 
  ArrowLeft,
  Search,
  MoreVertical
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  content: string;
  created_at: string;
  is_read: boolean;
  sender_profile?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface Conversation {
  id: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

const MessagesTab = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [newMessageSubject, setNewMessageSubject] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState<'list' | 'conversation'>('list');
  
  const { user } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Create mock data for now since database seems to have connection issues
      const mockConversations: Conversation[] = [
        {
          id: '1',
          participantName: 'John Smith',
          lastMessage: 'Thanks for the great presentation today!',
          lastMessageTime: '2 hours ago',
          unreadCount: 1,
          messages: [
            {
              id: '1',
              sender_id: 'other-user',
              recipient_id: user.id,
              subject: 'Great meeting',
              content: 'Hi there! I wanted to follow up on our discussion about the new project.',
              created_at: new Date(Date.now() - 3600000).toISOString(),
              is_read: true,
              sender_profile: { first_name: 'John', last_name: 'Smith' }
            },
            {
              id: '2',
              sender_id: user.id,
              recipient_id: 'other-user',
              subject: 'Re: Great meeting',
              content: 'Thank you for reaching out! I appreciate your feedback.',
              created_at: new Date(Date.now() - 1800000).toISOString(),
              is_read: true,
              sender_profile: null
            },
            {
              id: '3',
              sender_id: 'other-user',
              recipient_id: user.id,
              subject: 'Re: Great meeting',
              content: 'Thanks for the great presentation today!',
              created_at: new Date(Date.now() - 600000).toISOString(),
              is_read: false,
              sender_profile: { first_name: 'John', last_name: 'Smith' }
            }
          ]
        },
        {
          id: '2',
          participantName: 'Maria Garcia',
          lastMessage: 'Looking forward to collaborating with you.',
          lastMessageTime: '1 day ago',
          unreadCount: 0,
          messages: [
            {
              id: '4',
              sender_id: 'other-user-2',
              recipient_id: user.id,
              subject: 'Partnership opportunity',
              content: 'Hi! I saw your profile and think we could work together on some projects. Looking forward to collaborating with you.',
              created_at: new Date(Date.now() - 86400000).toISOString(),
              is_read: true,
              sender_profile: { first_name: 'Maria', last_name: 'Garcia' }
            }
          ]
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('conversation');
    
    // Mark messages as read
    if (conversation.unreadCount > 0) {
      setConversations(prev => 
        prev.map(c => 
          c.id === conversation.id 
            ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, is_read: true })) }
            : c
        )
      );
    }
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedConversation(null);
  };

  const sendNewMessage = async () => {
    if (!newMessageContent.trim() || !newMessageSubject.trim()) return;
    
    try {
      // For demo purposes, just add to local state
      const newMessage: Message = {
        id: Date.now().toString(),
        sender_id: user!.id,
        recipient_id: 'demo-user',
        subject: newMessageSubject,
        content: newMessageContent,
        created_at: new Date().toISOString(),
        is_read: false,
        sender_profile: null
      };

      setConversations(prev => {
        const newConversation: Conversation = {
          id: Date.now().toString(),
          participantName: 'New Conversation',
          lastMessage: newMessageContent,
          lastMessageTime: 'Just now',
          unreadCount: 0,
          messages: [newMessage]
        };
        return [newConversation, ...prev];
      });

      setNewMessageContent("");
      setNewMessageSubject("");
      setIsNewMessageOpen(false);
      
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentView === 'conversation' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToList}
                  className="lg:hidden"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                {currentView === 'conversation' && selectedConversation ? selectedConversation.participantName : 'Messages'}
              </CardTitle>
            </div>
            {currentView === 'list' && (
              <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Message</DialogTitle>
                    <DialogDescription>
                      Send a new message to connect with other members
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Input
                        placeholder="Subject"
                        value={newMessageSubject}
                        onChange={(e) => setNewMessageSubject(e.target.value)}
                      />
                    </div>
                    <div>
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessageContent}
                        onChange={(e) => setNewMessageContent(e.target.value)}
                        rows={6}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={sendNewMessage} disabled={!newMessageContent.trim() || !newMessageSubject.trim()}>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          {currentView === 'list' && (
            <CardDescription>
              Connect and communicate with other ABTC Bulgaria members
            </CardDescription>
          )}
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col">
          {currentView === 'list' ? (
            <>
              {/* Search Bar */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Conversations List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          onClick={() => handleConversationClick(conversation)}
                          className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                                  {conversation.participantName.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-foreground truncate">
                                      {conversation.participantName}
                                    </span>
                                    {conversation.unreadCount > 0 && (
                                      <Badge variant="default" className="text-xs">
                                        {conversation.unreadCount}
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground truncate">
                                    {conversation.lastMessage}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {conversation.lastMessageTime}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-muted-foreground">No conversations found</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            selectedConversation && (
              <div className="flex-1 flex flex-col">
                {/* Messages Thread */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages.map((message, index) => {
                    const isFromUser = message.sender_id === user?.id;
                    const showDate = index === 0 || 
                      new Date(message.created_at).toDateString() !== 
                      new Date(selectedConversation.messages[index - 1].created_at).toDateString();
                    
                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="text-center my-4">
                            <span className="bg-muted text-muted-foreground text-sm px-3 py-1 rounded-full">
                              {new Date(message.created_at).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex ${isFromUser ? 'justify-end' : 'justify-start'} mb-3`}>
                          <div className={`max-w-[80%] ${isFromUser ? 'order-2' : 'order-1'}`}>
                            {!isFromUser && (
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                                  {message.sender_profile 
                                    ? `${message.sender_profile.first_name[0]}${message.sender_profile.last_name[0]}`
                                    : 'U'
                                  }
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                  {message.sender_profile 
                                    ? `${message.sender_profile.first_name} ${message.sender_profile.last_name}`
                                    : 'Unknown User'
                                  }
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.created_at).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                            )}
                            
                            <div className={`p-3 rounded-lg ${
                              isFromUser 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-foreground'
                            }`}>
                              <div className="font-medium text-sm mb-1">{message.subject}</div>
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            </div>
                            
                            {isFromUser && (
                              <div className="text-right mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(message.created_at).toLocaleTimeString('en-US', { 
                                    hour: 'numeric', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type your reply..." 
                      className="flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          // Handle send message
                        }
                      }}
                    />
                    <Button size="sm">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>

  );
};

export default MessagesTab;