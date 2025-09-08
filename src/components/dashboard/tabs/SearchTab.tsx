import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMemberAuth } from "@/hooks/useMemberAuth";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [lastMember, setLastMember] = useState<{ created_at: string; id: string } | null>(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const { user } = useMemberAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // Responsive page sizes: mobile: 6, tablet: 8, desktop: 12
  const getPageSize = () => {
    if (isMobile) return 6;
    if (window.innerWidth < 1024) return 8; // tablet
    return 12; // desktop
  };
  
  const PAGE_SIZE = getPageSize();
  useEffect(() => {
    fetchMembers();
    setupRealtimeSubscription();
    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  useEffect(() => {
    // Reset pagination when filters change
    fetchMembers();
  }, [searchQuery, searchFilters]);

  const setupRealtimeSubscription = () => {
    const channel = supabase.channel('profiles-changes').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'profiles'
    }, payload => {
      fetchMembers();
    }).subscribe();
  };

  const buildQuery = () => {
    let query = supabase
      .from('profiles')
      .select('id,first_name,last_name,email,city,country,university,job_title,company,areas_of_interest,membership_type,profile_photo_url,user_id,created_at', { count: 'exact' })
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    // Apply filters
    if (searchQuery) {
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,job_title.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    if (searchFilters.location) {
      query = query.or(`city.ilike.%${searchFilters.location}%,country.ilike.%${searchFilters.location}%`);
    }
    if (searchFilters.education) {
      query = query.ilike('university', `%${searchFilters.education}%`);
    }
    if (searchFilters.jobTitle) {
      query = query.ilike('job_title', `%${searchFilters.jobTitle}%`);
    }
    if (searchFilters.company) {
      query = query.ilike('company', `%${searchFilters.company}%`);
    }
    if (searchFilters.membershipType !== "all") {
      query = query.eq('membership_type', searchFilters.membershipType);
    }

    return query;
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setMembers([]);
      setLastMember(null);
      setHasMore(true);

      const query = buildQuery();
      const { data, count, error } = await query.limit(PAGE_SIZE);

      if (error) throw error;

      setMembers(data || []);
      setTotalCount(count || 0);
      
      if (data && data.length > 0) {
        setLastMember({ created_at: data[data.length - 1].created_at, id: data[data.length - 1].id });
        setHasMore(data.length === PAGE_SIZE && data.length < (count || 0));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to load members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMoreMembers = useCallback(async () => {
    if (loadingMore || !hasMore || !lastMember) return;
    
    setLoadingMore(true);
    try {
      const query = buildQuery();
      const { data, error } = await query
        .or(`created_at.lt.${lastMember.created_at},and(created_at.eq.${lastMember.created_at},id.lt.${lastMember.id})`)
        .limit(PAGE_SIZE);

      if (error) throw error;

      if (data && data.length > 0) {
        setMembers(prev => [...prev, ...data]);
        setLastMember({ created_at: data[data.length - 1].created_at, id: data[data.length - 1].id });
        setHasMore(data.length === PAGE_SIZE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error loading more members:', error);
      toast({
        title: "Error",
        description: "Failed to load more members. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastMember, searchQuery, searchFilters, PAGE_SIZE]);
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
            Members ({totalCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading members...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map(member => (
                <div key={member.id} className="p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors">
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
                        
                        {member.areas_of_interest && member.areas_of_interest.length > 0 && (
                          <div className="space-y-2">
                            <div>
                              <span className="text-xs font-medium text-muted-foreground">Areas of Interest:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {member.areas_of_interest.map((interest: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {interest}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs flex-1 sm:flex-none sm:w-24"
                          onClick={() => window.open(`/members/${member.id}`, '_blank')}
                        >
                          View Profile
                        </Button>
                        <Button size="sm" className="text-xs flex-1 sm:flex-none sm:w-24" onClick={() => handleMessageClick(member)}>
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Load more button */}
              {hasMore && (
                <div className="text-center py-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={loadMoreMembers} 
                    disabled={loadingMore}
                    className="text-sm"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                        Loading...
                      </>
                    ) : (
                      'Load More Members'
                    )}
                  </Button>
                </div>
              )}
              
              {members.length === 0 && !loading && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No members found matching your search criteria.
                </div>
              )}
              
              {!hasMore && members.length > 0 && (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No more members to load.
                </div>
              )}
            </div>
          )}
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