import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import SkillTag from "@/components/SkillTag";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useToast } from "@/hooks/use-toast";
const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    interest: "",
    education: "",
    jobTitle: "",
    company: "",
    membershipType: "all"
  });
  const [members, setMembers] = useState<any[]>([]);
  const [displayedMembers, setDisplayedMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const {
    user
  } = useMemberAuth();
  const {
    toast
  } = useToast();
  const observerRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 2;
  useEffect(() => {
    fetchMembers();
    setupRealtimeSubscription();
    return () => {
      supabase.removeAllChannels();
    };
  }, []);
  const setupRealtimeSubscription = () => {
    const channel = supabase.channel('profiles-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'profiles'
    }, payload => {
      fetchMembers();
    }).subscribe();
  };
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };
  const filteredMembers = members.filter(member => {
    const fullName = `${member.first_name} ${member.last_name}`;
    const location = `${member.city}, ${member.country}`;
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) || member.job_title?.toLowerCase().includes(searchQuery.toLowerCase()) || member.company?.toLowerCase().includes(searchQuery.toLowerCase()) || member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !searchFilters.location || location.toLowerCase().includes(searchFilters.location.toLowerCase()) || member.city?.toLowerCase().includes(searchFilters.location.toLowerCase()) || member.country?.toLowerCase().includes(searchFilters.location.toLowerCase());
    const matchesInterest = !searchFilters.interest || member.areas_of_interest && member.areas_of_interest.some((interest: string) => interest.toLowerCase().includes(searchFilters.interest.toLowerCase()));
    const matchesEducation = !searchFilters.education || member.university?.toLowerCase().includes(searchFilters.education.toLowerCase());
    const matchesJobTitle = !searchFilters.jobTitle || member.job_title?.toLowerCase().includes(searchFilters.jobTitle.toLowerCase());
    const matchesCompany = !searchFilters.company || member.company?.toLowerCase().includes(searchFilters.company.toLowerCase());
    const matchesMembershipType = searchFilters.membershipType === "all" || member.membership_type === searchFilters.membershipType;
    return matchesSearch && matchesLocation && matchesInterest && matchesEducation && matchesJobTitle && matchesCompany && matchesMembershipType;
  });
  useEffect(() => {
    setCurrentPage(0);
    setHasMore(true);
    const initialMembers = filteredMembers.slice(0, ITEMS_PER_PAGE);
    setDisplayedMembers(initialMembers);
    setHasMore(filteredMembers.length > ITEMS_PER_PAGE);
  }, [filteredMembers, searchQuery, searchFilters]);
  const loadMoreMembers = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = currentPage + 1;
      const startIndex = nextPage * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      const newMembers = filteredMembers.slice(startIndex, endIndex);
      if (newMembers.length > 0) {
        setDisplayedMembers(prev => [...prev, ...newMembers]);
        setCurrentPage(nextPage);
        setHasMore(endIndex < filteredMembers.length);
      } else {
        setHasMore(false);
      }
      setLoadingMore(false);
    }, 500);
  }, [currentPage, filteredMembers, loadingMore, hasMore]);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loadingMore) {
        loadMoreMembers();
      }
    }, {
      threshold: 0.1
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [loadMoreMembers, hasMore, loadingMore]);
  const clearFilters = () => {
    setSearchQuery("");
    setSearchFilters({
      location: "",
      interest: "",
      education: "",
      jobTitle: "",
      company: "",
      membershipType: "all"
    });
  };
  const handleMessageClick = (member: any) => {
    setSelectedMember(member);
    setMessageSubject("");
    setMessageContent("");
    setMessageDialogOpen(true);
  };
  const handleSendMessage = async () => {
    if (!user || !selectedMember) {
      toast({
        title: "Error",
        description: "You must be logged in to send messages.",
        variant: "destructive"
      });
      return;
    }
    if (!messageSubject.trim() || !messageContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both subject and message content.",
        variant: "destructive"
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: selectedMember.user_id,
        subject: messageSubject,
        content: messageContent
      });
      if (error) throw error;
      toast({
        title: "Message sent successfully!",
        description: `Your message has been sent to ${selectedMember.first_name} ${selectedMember.last_name}.`
      });
      setMessageDialogOpen(false);
      setSelectedMember(null);
      setMessageSubject("");
      setMessageContent("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message.",
        variant: "destructive"
      });
    }
  };
  return <div className="space-y-4 max-w-full overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Find Members</CardTitle>
          <CardDescription className="text-sm">
            Search and connect with other ABTC Bulgaria members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Input placeholder="Search by name, job title, or company..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
              <Input placeholder="Filter by location..." value={searchFilters.location} onChange={e => setSearchFilters({
              ...searchFilters,
              location: e.target.value
            })} className="text-sm" />
              <Input placeholder="Filter by interest..." value={searchFilters.interest} onChange={e => setSearchFilters({
              ...searchFilters,
              interest: e.target.value
            })} className="text-sm" />
              <Input placeholder="Filter by education..." value={searchFilters.education} onChange={e => setSearchFilters({
              ...searchFilters,
              education: e.target.value
            })} className="text-sm" />
              <Input placeholder="Filter by job title..." value={searchFilters.jobTitle} onChange={e => setSearchFilters({
              ...searchFilters,
              jobTitle: e.target.value
            })} className="text-sm" />
              <Input placeholder="Filter by company..." value={searchFilters.company} onChange={e => setSearchFilters({
              ...searchFilters,
              company: e.target.value
            })} className="text-sm" />
              <Select value={searchFilters.membershipType} onValueChange={value => setSearchFilters({
              ...searchFilters,
              membershipType: value
            })}>
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Membership Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="free">Free Members</SelectItem>
                  <SelectItem value="premium">Premium Members</SelectItem>
                  <SelectItem value="student">Student Members</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={clearFilters} className="text-sm w-full sm:w-auto" size="sm">
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">
            Members ({filteredMembers.length}) 
            {displayedMembers.length < filteredMembers.length}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading members...</p>
            </div> : <div className="space-y-4">
              {displayedMembers.map(member => <div key={member.id} className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={member.profile_photo_url || "/placeholder.svg"} />
                            <AvatarFallback>
                              <User className="h-5 w-5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-medium text-sm sm:text-base truncate">
                              {member.first_name} {member.last_name}
                            </h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {member.membership_type || 'Member'}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">📍 {member.city}, {member.country}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">🎓 {member.university}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">💼 {member.job_title} at {member.company}</p>
                        
                        {member.areas_of_interest && member.areas_of_interest.length > 0 && <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Areas of Interest:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {member.areas_of_interest.map((interest: string, index: number) => <Badge key={index} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>)}
                              </div>
                            </div>
                          </div>}
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                        <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-none sm:w-24">
                          View Profile
                        </Button>
                        <Button size="sm" className="text-xs flex-1 sm:flex-none sm:w-24" onClick={() => handleMessageClick(member)}>
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>)}
              
              {/* Infinite scroll trigger */}
              {hasMore && <div ref={observerRef} className="text-center py-4">
                  {loadingMore ? <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span className="text-sm text-muted-foreground">Loading more members...</span>
                    </div> : <Button variant="outline" size="sm" onClick={loadMoreMembers} className="text-sm">
                      Load More Members
                    </Button>}
                </div>}
              
              {filteredMembers.length === 0 && !loading && <div className="text-center py-8 text-muted-foreground text-sm">
                  No members found matching your search criteria.
                </div>}
              
              {!hasMore && displayedMembers.length > 0 && <div className="text-center py-4 text-sm text-muted-foreground">
                  You've reached the end of the member list.
                </div>}
            </div>}
        </CardContent>
      </Card>

      <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedMember?.first_name} {selectedMember?.last_name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input placeholder="Message subject..." value={messageSubject} onChange={e => setMessageSubject(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Textarea placeholder="Type your message here..." value={messageContent} onChange={e => setMessageContent(e.target.value)} rows={4} />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>;
};
export default SearchTab;