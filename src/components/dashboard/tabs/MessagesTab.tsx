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
  MessageCircle, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  Send, 
  Reply, 
  Forward 
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
  };
}

interface Group {
  id: string;
  name: string;
  members: string[];
}

const MessagesTab = () => {
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([
    { id: "all", name: "All Messages", members: [] },
  ]);

  const [activeGroup, setActiveGroup] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [renamingGroup, setRenamingGroup] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  
  const { user } = useMemberAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
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
      members: []
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

  // Filter messages based on active group
  const filteredMessages = activeGroup === "all" 
    ? messages 
    : messages; // For now, show all messages regardless of group

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
                          <div className="flex-1">
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
                          <span className="text-xs text-gray-500">
                            {new Date(message.created_at).toLocaleDateString()}
                          </span>
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
                      <Button size="sm" className="flex items-center gap-1">
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
    </div>
  );
};

export default MessagesTab;