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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MessageCircle, 
  Users, 
  Plus, 
  Send, 
  Reply, 
  ArrowLeft,
  Tag,
  MoreVertical,
  Hash,
  X
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
  recipient_profile?: {
    first_name: string;
    last_name: string;
  } | null;
}

interface ConversationTag {
  id: string;
  name: string;
  color: string;
}

interface Conversation {
  id: string;
  participant_id: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
  tags: ConversationTag[];
}

const MessagesTab = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [isNewTagOpen, setIsNewTagOpen] = useState(false);
  const [newMessageContent, setNewMessageContent] = useState("");
  const [newMessageSubject, setNewMessageSubject] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#3b82f6");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [tags, setTags] = useState<ConversationTag[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'conversation'>('list');
  const [replyMessage, setReplyMessage] = useState("");
  const [recipients, setRecipients] = useState<any[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  
  const { user } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchTags();
      fetchRecipients();
      
      // Set up real-time listener for messages
      const channel = supabase
        .channel('messages_realtime')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
          },
          (payload) => {
            console.log('Message update received:', payload);
            fetchConversations();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch messages first
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name');

      if (profilesError) throw profilesError;

      // Create a map of profiles for quick lookup
      const profileMap = new Map(
        profiles?.map(p => [p.user_id, p]) || []
      );

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      messages?.forEach((message) => {
        const isFromUser = message.sender_id === user.id;
        const partnerId = isFromUser ? message.recipient_id : message.sender_id;
        const partnerProfile = profileMap.get(partnerId);
        const partnerName = partnerProfile 
          ? `${partnerProfile.first_name} ${partnerProfile.last_name}`
          : 'Unknown User';

        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            id: partnerId,
            participant_id: partnerId,
            participantName: partnerName,
            lastMessage: message.content,
            lastMessageTime: new Date(message.created_at).toLocaleDateString(),
            unreadCount: 0,
            messages: [],
            tags: []
          });
        }

        const conversation = conversationMap.get(partnerId)!;
        
        // Add profile information to message
        const messageWithProfiles: Message = {
          ...message,
          sender_profile: profileMap.get(message.sender_id) || null,
          recipient_profile: profileMap.get(message.recipient_id) || null
        };
        
        conversation.messages.push(messageWithProfiles);
        
        // Count unread messages from partner
        if (!isFromUser && !message.is_read) {
          conversation.unreadCount++;
        }
      });

      // Sort messages within each conversation by date
      conversationMap.forEach(conversation => {
        conversation.messages.sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      });

      // Fetch tags for conversations
      const { data: tagAssignments } = await supabase
        .from('conversation_tag_assignments')
        .select(`
          conversation_partner_id,
          conversation_tags(id, name, color)
        `)
        .eq('user_id', user.id);

      // Add tags to conversations
      tagAssignments?.forEach(assignment => {
        const conversation = conversationMap.get(assignment.conversation_partner_id);
        if (conversation && assignment.conversation_tags) {
          conversation.tags.push(assignment.conversation_tags);
        }
      });

      setConversations(Array.from(conversationMap.values()));
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

  const fetchTags = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const fetchRecipients = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .neq('user_id', user.id);

      if (error) throw error;
      setRecipients(data || []);
    } catch (error) {
      console.error('Error fetching recipients:', error);
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
    if (!newMessageContent.trim() || !newMessageSubject.trim() || !selectedRecipient) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user!.id,
          recipient_id: selectedRecipient,
          subject: newMessageSubject,
          content: newMessageContent
        })
        .select()
        .single();

      if (error) throw error;

      setNewMessageContent("");
      setNewMessageSubject("");
      setSelectedRecipient("");
      setIsNewMessageOpen(false);
      
      // Refresh conversations
      fetchConversations();
      
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

  const sendReply = async () => {
    if (!replyMessage.trim() || !selectedConversation) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user!.id,
          recipient_id: selectedConversation.participant_id,
          subject: `Re: ${selectedConversation.messages[0]?.subject || 'Message'}`,
          content: replyMessage
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch profile data for the new message
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name')
        .in('user_id', [data.sender_id, data.recipient_id]);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      // Add the new reply to the current conversation immediately
      if (selectedConversation) {
        const newMessage: Message = {
          id: data.id,
          sender_id: data.sender_id,
          recipient_id: data.recipient_id,
          subject: data.subject,
          content: data.content,
          created_at: data.created_at,
          is_read: data.is_read,
          sender_profile: profileMap.get(data.sender_id) || null,
          recipient_profile: profileMap.get(data.recipient_id) || null
        };
        
        setSelectedConversation(prev => ({
          ...prev!,
          messages: [...prev!.messages, newMessage]
        }));
        
        // Update conversations list
        setConversations(prev => 
          prev.map(conv => 
            conv.id === selectedConversation.id 
              ? { 
                  ...conv, 
                  messages: [...conv.messages, newMessage],
                  lastMessage: newMessage.content,
                  lastMessageTime: new Date(newMessage.created_at).toLocaleDateString()
                }
              : conv
          )
        );
      }

      setReplyMessage("");
      
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive",
      });
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .insert({
          user_id: user!.id,
          name: newTagName,
          color: newTagColor
        })
        .select()
        .single();

      if (error) throw error;

      setTags(prev => [...prev, data]);
      setNewTagName("");
      setNewTagColor("#3b82f6");
      setIsNewTagOpen(false);
      
      toast({
        title: "Tag created",
        description: "Your new tag has been created successfully.",
      });
    } catch (error) {
      console.error('Error creating tag:', error);
      toast({
        title: "Error",
        description: "Failed to create tag.",
        variant: "destructive",
      });
    }
  };

  const toggleConversationTag = async (conversationId: string, tagId: string) => {
    if (!user) return;
    
    try {
      // Check if tag is already assigned
      const { data: existing } = await supabase
        .from('conversation_tag_assignments')
        .select('id')
        .eq('user_id', user.id)
        .eq('conversation_partner_id', conversationId)
        .eq('tag_id', tagId)
        .single();

      if (existing) {
        // Remove tag
        await supabase
          .from('conversation_tag_assignments')
          .delete()
          .eq('id', existing.id);
      } else {
        // Add tag
        await supabase
          .from('conversation_tag_assignments')
          .insert({
            user_id: user.id,
            conversation_partner_id: conversationId,
            tag_id: tagId
          });
      }
      
      // Refresh conversations
      fetchConversations();
    } catch (error) {
      console.error('Error toggling tag:', error);
    }
  };

  const filteredConversations = selectedTag
    ? conversations.filter(conv => 
        conv.tags.some(tag => tag.id === selectedTag)
      )
    : conversations;

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
                        <label className="text-sm font-medium">To</label>
                        <select
                          className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                          value={selectedRecipient}
                          onChange={(e) => setSelectedRecipient(e.target.value)}
                        >
                          <option value="">Select a member...</option>
                          {recipients.map((recipient) => (
                            <option key={recipient.user_id} value={recipient.user_id}>
                              {recipient.first_name} {recipient.last_name}
                            </option>
                          ))}
                        </select>
                      </div>
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
                        <Button onClick={sendNewMessage} disabled={!newMessageContent.trim() || !newMessageSubject.trim() || !selectedRecipient}>
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
              {/* Tag Filter */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex flex-wrap gap-2 flex-1">
                  <Button
                    variant={selectedTag === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTag(null)}
                  >
                    All
                  </Button>
                  {tags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant={selectedTag === tag.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTag(tag.id)}
                      className="flex items-center gap-1"
                      style={{ 
                        backgroundColor: selectedTag === tag.id ? tag.color : undefined,
                        borderColor: tag.color 
                      }}
                    >
                      <Hash className="w-3 h-3" />
                      {tag.name}
                    </Button>
                  ))}
                </div>
                <Dialog open={isNewTagOpen} onOpenChange={setIsNewTagOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      New Tag
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Tag</DialogTitle>
                      <DialogDescription>
                        Create a custom tag to organize your conversations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Input
                          placeholder="Tag name"
                          value={newTagName}
                          onChange={(e) => setNewTagName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex gap-2 mt-2">
                          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'].map(color => (
                            <button
                              key={color}
                              className="w-8 h-8 rounded-full border-2"
                              style={{ 
                                backgroundColor: color,
                                borderColor: newTagColor === color ? '#000' : 'transparent'
                              }}
                              onClick={() => setNewTagColor(color)}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsNewTagOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={createTag} disabled={!newTagName.trim()}>
                          Create Tag
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
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
                                  {conversation.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                      {conversation.tags.map((tag) => (
                                        <Badge 
                                          key={tag.id} 
                                          variant="outline" 
                                          className="text-xs"
                                          style={{ borderColor: tag.color, color: tag.color }}
                                        >
                                          {tag.name}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <div className="text-xs text-muted-foreground">
                                {conversation.lastMessageTime}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {tags.map((tag) => (
                                    <DropdownMenuItem
                                      key={tag.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleConversationTag(conversation.participant_id, tag.id);
                                      }}
                                      className="flex items-center gap-2"
                                    >
                                      <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: tag.color }}
                                      />
                                      {conversation.tags.some(t => t.id === tag.id) ? (
                                        <X className="w-3 h-3" />
                                      ) : (
                                        <Plus className="w-3 h-3" />
                                      )}
                                      {tag.name}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
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
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          sendReply();
                        }
                      }}
                    />
                    <Button size="sm" onClick={sendReply} disabled={!replyMessage.trim()}>
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