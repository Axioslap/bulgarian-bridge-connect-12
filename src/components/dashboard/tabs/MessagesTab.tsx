import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { mockMessages, mockMembers } from "@/data/mockData";
import { ArrowLeft, MoreHorizontal, Plus, Users, FolderDot } from "lucide-react";

interface Message {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  fullContent: string;
  time: string;
  unread: boolean;
}

interface Group {
  id: string;
  name: string;
  members: string[]; // member names
  createdAt: number;
}

const defaultGroups: Group[] = [
  { id: "all", name: "All", members: [], createdAt: Date.now() - 100000 },
  { id: "partnerships", name: "Partnerships", members: ["Alex Petrov"], createdAt: Date.now() - 90000 },
  { id: "events", name: "Events", members: ["ABTC Bulgaria"], createdAt: Date.now() - 80000 },
  { id: "mentorship", name: "Mentorship", members: ["Maria Dimitrova"], createdAt: Date.now() - 70000 },
];

const MessagesTab = () => {
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  // Groups state (persist lightly in localStorage)
  const persisted = typeof window !== "undefined" ? localStorage.getItem("message_groups") : null;
  const initialGroups = useMemo<Group[]>(() => {
    try {
      return persisted ? (JSON.parse(persisted) as Group[]) : defaultGroups;
    } catch {
      return defaultGroups;
    }
  }, [persisted]);

  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [activeGroupId, setActiveGroupId] = useState<string>(groups[0]?.id || "all");

  // Create / edit group dialog state
  const [openCreate, setOpenCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0];

  const filteredMessages = useMemo(() => {
    if (!activeGroup || activeGroup.id === "all") return messages;
    const nameMatch = activeGroup.name.toLowerCase();
    return messages.filter(
      (m) =>
        activeGroup.members.includes(m.sender) ||
        m.subject.toLowerCase().includes(nameMatch)
    );
  }, [messages, activeGroup]);

  const selectedMessage = messages.find((m) => m.id === selectedMessageId) || null;

  const handleMessageClick = (messageId: number) => {
    setSelectedMessageId(messageId);
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, unread: false } : m))
    );
  };

  const handleBack = () => setSelectedMessageId(null);

  const saveGroups = (next: Group[]) => {
    setGroups(next);
    try {
      localStorage.setItem("message_groups", JSON.stringify(next));
    } catch {}
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    const newGroup: Group = {
      id: `${groupName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: groupName.trim(),
      members: selectedMembers,
      createdAt: Date.now(),
    };
    const next = [...groups, newGroup];
    saveGroups(next);
    setGroupName("");
    setSelectedMembers([]);
    setOpenCreate(false);
    setActiveGroupId(newGroup.id);
  };

  const handleRenameGroup = (groupId: string) => {
    const nextName = prompt("Rename group to:");
    if (!nextName) return;
    const next = groups.map((g) => (g.id === groupId ? { ...g, name: nextName } : g));
    saveGroups(next);
  };

  const handleDeleteGroup = (groupId: string) => {
    if (!confirm("Delete this group?")) return;
    const next = groups.filter((g) => g.id !== groupId);
    saveGroups(next);
    if (activeGroupId === groupId) setActiveGroupId("all");
  };

  const toggleMemberSelection = (name: string) => {
    setSelectedMembers((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
          <CardDescription>Organize conversations by groups for fast navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Groups */}
            <aside className="lg:col-span-3 border rounded-lg">
              <div className="flex items-center justify-between p-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Users className="h-4 w-4" /> Message Groups
                </div>
                <Dialog open={openCreate} onOpenChange={setOpenCreate}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-1" /> New
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Create a group</DialogTitle>
                      <DialogDescription>Add a name and select members to include.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="group-name">Group name</Label>
                        <Input id="group-name" value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="e.g. Project Alpha" />
                      </div>
                      <div className="space-y-2">
                        <Label>Select members</Label>
                        <ScrollArea className="h-56 rounded-md border p-3">
                          <div className="grid grid-cols-1 gap-2">
                            {mockMembers.map((m) => (
                              <label key={m.id} className="flex items-center gap-2 text-sm">
                                <Checkbox
                                  checked={selectedMembers.includes(m.name)}
                                  onCheckedChange={() => toggleMemberSelection(m.name)}
                                />
                                <span>{m.name}</span>
                              </label>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
                      <Button onClick={handleCreateGroup}>Create</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <Separator />
              <ScrollArea className="h-[420px]">
                <div className="p-2 space-y-1">
                  {groups.map((g) => {
                    const isActive = activeGroupId === g.id;
                    const unread = mockMessages.filter((m) =>
                      g.id === "all" ? m.unread : g.members.includes(m.sender) && m.unread
                    ).length;
                    return (
                      <div key={g.id} className={`group flex items-center justify-between rounded-md px-2 py-2 cursor-pointer ${isActive ? "bg-muted" : "hover:bg-muted/50"}`} onClick={() => setActiveGroupId(g.id)}>
                        <div className="flex items-center gap-2">
                          <FolderDot className="h-4 w-4" />
                          <span className="text-sm font-medium">{g.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {unread > 0 && <Badge variant="secondary" className="h-5 px-1 text-[10px]">{unread}</Badge>}
                          {g.id !== "all" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost" className="h-7 w-7">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="z-50">
                                <DropdownMenuLabel>Group actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRenameGroup(g.id); }}>Rename</DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteGroup(g.id); }}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </aside>

            {/* Middle: Conversations */}
            <section className="lg:col-span-5 border rounded-lg">
              <div className="flex items-center justify-between p-3">
                <div className="text-sm font-medium">{activeGroup?.name} Conversations</div>
                <Button variant="outline" size="sm">Compose</Button>
              </div>
              <Separator />
              <ScrollArea className="h-[420px]">
                <div className="p-2 space-y-3">
                  {filteredMessages.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-3">No conversations in this group yet.</p>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${message.unread ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50"}`}
                        onClick={() => handleMessageClick(message.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className={`text-sm ${message.unread ? "font-semibold" : "font-medium"}`}>{message.sender}</h4>
                              {message.unread && <Badge variant="secondary" className="text-[10px]">New</Badge>}
                            </div>
                            <p className="text-sm line-clamp-1">{message.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{message.preview}</p>
                          </div>
                          <span className="text-xs text-muted-foreground flex-shrink-0 ml-3">{message.time}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </section>

            {/* Right: Message Detail */}
            <section className="lg:col-span-4 border rounded-lg">
              <div className="p-3 flex items-center gap-2 border-b">
                {selectedMessage ? (
                  <>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleBack}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                      <div className="text-sm font-medium">{selectedMessage.subject}</div>
                      <div className="text-xs text-muted-foreground">From: {selectedMessage.sender} • {selectedMessage.time}</div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">Select a conversation to read</div>
                )}
              </div>
              <div className="p-4 h-[380px] overflow-auto">
                {selectedMessage ? (
                  <div className="whitespace-pre-line text-sm">{selectedMessage.fullContent}</div>
                ) : (
                  <div className="text-sm text-muted-foreground">Nothing selected.</div>
                )}
              </div>
              <div className="p-3 flex gap-2 border-t">
                <Button size="sm" disabled={!selectedMessage}>Reply</Button>
                <Button size="sm" variant="outline" disabled={!selectedMessage}>Forward</Button>
              </div>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagesTab;
