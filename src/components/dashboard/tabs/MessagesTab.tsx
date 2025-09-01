import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Edit2, 
  Trash2, 
  Send, 
  Reply, 
  Forward,
  MoreVertical,
  Archive,
  Tag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useToast } from "@/hooks/use-toast";

// Interface for messages
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

interface Group {
  id: string;
  name: string;
  messageIds: string[];
}

interface Profile {
  first_name: string;
  last_name: string;
  id: string;
}

const MessagesTab = () => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([
    { id: "all", name: "All Messages", messageIds: [] },
    { id: "important", name: "Important", messageIds: [] },
    { id: "archived", name: "Archived", messageIds: [] },
  ]);

  const [activeGroup, setActiveGroup] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renamingGroup, setRenamingGroup] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [allProfiles, setAllProfiles] = useState<Profile[]>([]);
  
  const { user } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchProfiles();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      // First get messages without joins
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Then get profile data for each message
      const messagesWithProfiles = await Promise.all(
        (messagesData || []).map(async (message) => {
          const { data: senderProfile } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('user_id', message.sender_id)
            .single();

          return {
            ...message,
            sender_profile: senderProfile
          };
        })
      );

      setMessages(messagesWithProfiles);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .neq('user_id', user?.id || '');

      if (error) throw error;
      setAllProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  useEffect(() => {
    // Load groups from localStorage
    const savedGroups = localStorage.getItem('messageGroups');
    if (savedGroups) {
      setGroups(JSON.parse(savedGroups));
    }
  }, []);

  useEffect(() => {
    // Save groups to localStorage
    localStorage.setItem('messageGroups', JSON.stringify(groups));
  }, [groups]);

  const handleMessageClick = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (message) {
      // Mark as read if user is recipient
      if (message.recipient_id === user?.id && !message.is_read) {
        try {
          const { error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', messageId);

          if (error) throw error;
          
          setMessages(prev => prev.map(m => 
            m.id === messageId ? { ...m, is_read: true } : m
          ));
        } catch (error) {
          console.error('Error marking message as read:', error);
        }
      }
      setSelectedMessage(message);
    }
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      messageIds: []
    };
    
    setGroups([...groups, newGroup]);
    setNewGroupName("");
    setIsCreateGroupOpen(false);
    
    toast({
      title: "Group created",
      description: `"${newGroup.name}" group has been created.`,
    });
  };

  const handleRenameGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    setRenamingGroup(groupId);
    setNewName(group.name);
  };

  const confirmRename = () => {
    if (!newName.trim() || !renamingGroup) return;
    
    setGroups(groups.map(g => 
      g.id === renamingGroup ? { ...g, name: newName } : g
    ));
    
    setRenamingGroup(null);
    setNewName("");
    
    toast({
      title: "Group renamed",
      description: "Group has been successfully renamed.",
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
    
    if (activeGroup === groupId) {
      setActiveGroup("all");
    }
    
    toast({
      title: "Group deleted",
      description: "Group has been successfully deleted.",
    });
  };

  const addToGroup = (messageId: string, groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, messageIds: [...new Set([...group.messageIds, messageId])] }
        : group
    ));
    
    toast({
      title: "Message added to group",
      description: `Message added to ${groups.find(g => g.id === groupId)?.name}`,
    });
  };

  const removeFromGroup = (messageId: string, groupId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, messageIds: group.messageIds.filter(id => id !== messageId) }
        : group
    ));
  };

  const handleReply = () => {
    if (!selectedMessage) return;
    
    const senderName = selectedMessage.sender_profile 
      ? `${selectedMessage.sender_profile.first_name} ${selectedMessage.sender_profile.last_name}`
      : 'Unknown User';
    
    setReplySubject(`Re: ${selectedMessage.subject}`);
    setReplyContent(`\n\n--- Original message from ${senderName} ---\n${selectedMessage.content}`);
    setIsReplyOpen(true);
  };

  const sendReply = async () => {
    if (!selectedMessage || !replyContent.trim() || !user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedMessage.sender_id,
          subject: replySubject,
          content: replyContent,
        });

      if (error) throw error;
      
      setIsReplyOpen(false);
      setReplyContent("");
      setReplySubject("");
      fetchMessages();
      
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

  // Filter messages based on active group
  const filteredMessages = activeGroup === "all" 
    ? messages 
    : messages.filter(msg => {
        const group = groups.find(g => g.id === activeGroup);
        return group?.messageIds.includes(msg.id) || false;
      });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
          </CardTitle>
          <CardDescription>
            Connect and communicate with other ABTC Bulgaria members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar for Groups */}
            <div className="lg:w-1/4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Groups
                </h3>
                <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Message Group</DialogTitle>
                      <DialogDescription>
                        Create a new group to organize your messages
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="groupName">Group Name</Label>
                        <Input
                          id="groupName"
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Enter group name..."
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleCreateGroup}>
                          Create Group
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                {groups.map(group => (
                  <div key={group.id} className="flex items-center justify-between">
                    <Button
                      variant={activeGroup === group.id ? "default" : "outline"}
                      className="flex-1 justify-start"
                      onClick={() => setActiveGroup(group.id)}
                    >
                      {group.name}
                    </Button>
                    {group.id !== "all" && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRenameGroup(group.id)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Group</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this group? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteGroup(group.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {renamingGroup && (
                <div className="space-y-2">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="New group name..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={confirmRename}>
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setRenamingGroup(null);
                        setNewName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages List */}
            <div className="lg:w-1/2 space-y-4">
              <h3 className="text-lg font-semibold">Conversations</h3>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        onClick={() => handleMessageClick(message.id)}
                         className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedMessage?.id === message.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1" onClick={() => handleMessageClick(message.id)}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`font-medium ${
                                message.recipient_id === user?.id && !message.is_read ? 'text-blue-600' : 'text-gray-900'
                              }`}>
                                {message.sender_profile 
                                  ? `${message.sender_profile.first_name} ${message.sender_profile.last_name}`
                                  : 'Unknown User'
                                }
                              </span>
                              {message.recipient_id === user?.id && !message.is_read && (
                                <Badge variant="default" className="text-xs">New</Badge>
                              )}
                            </div>
                            <p className={`font-medium text-sm mb-1 ${
                              message.recipient_id === user?.id && !message.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {message.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {groups.filter(g => g.id !== "all").map(group => (
                                  <DropdownMenuItem
                                    key={group.id}
                                    onClick={() => addToGroup(message.id, group.id)}
                                  >
                                    <Tag className="mr-2 h-4 w-4" />
                                    Add to {group.name}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 text-center py-8">No messages found.</p>
                  )}
                </div>
              )}
            </div>

            {/* Message Detail */}
            <div className="lg:w-1/4 space-y-4">
              <h3 className="text-lg font-semibold">Message Details</h3>
              
              {selectedMessage ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="mb-4">
                      <h4 className="font-semibold text-lg mb-2">{selectedMessage.subject}</h4>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">
                          From: {selectedMessage.sender_profile 
                            ? `${selectedMessage.sender_profile.first_name} ${selectedMessage.sender_profile.last_name}`
                            : 'Unknown User'
                          }
                        </span>
                        <span className="text-sm text-gray-500">
                          • {new Date(selectedMessage.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="text-gray-800 whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleReply} className="flex items-center gap-1">
                        <Reply className="w-4 h-4" />
                        Reply
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center gap-1">
                        <Forward className="w-4 h-4" />
                        Forward
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Select a message to view details
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
            <DialogDescription>
              Send a reply to {selectedMessage?.sender_profile 
                ? `${selectedMessage.sender_profile.first_name} ${selectedMessage.sender_profile.last_name}`
                : 'this user'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="replySubject">Subject</Label>
              <Input
                id="replySubject"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
                placeholder="Reply subject..."
              />
            </div>
            <div>
              <Label htmlFor="replyContent">Message</Label>
              <Textarea
                id="replyContent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply..."
                rows={8}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
                Cancel
              </Button>
              <Button onClick={sendReply} disabled={!replyContent.trim()}>
                <Send className="w-4 h-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MessagesTab;