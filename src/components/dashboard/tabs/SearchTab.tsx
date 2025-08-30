
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SkillTag from "@/components/SkillTag";
import { mockMembers } from "@/data/mockData";

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState({
    location: "",
    interest: "",
    education: "",
    businessInterest: "all"
  });

  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !searchFilters.location || member.location.toLowerCase().includes(searchFilters.location.toLowerCase());
    const matchesInterest = !searchFilters.interest || member.interests.some(interest => interest.toLowerCase().includes(searchFilters.interest.toLowerCase()));
    const matchesEducation = !searchFilters.education || member.education.toLowerCase().includes(searchFilters.education.toLowerCase());
    
    // Since businessInterest doesn't exist in mock data, we'll skip this filter for now
    const matchesBusinessInterest = searchFilters.businessInterest === "all";
    
    return matchesSearch && matchesLocation && matchesInterest && matchesEducation && matchesBusinessInterest;
  });

  const clearFilters = () => {
    setSearchFilters({
      location: "", 
      interest: "", 
      education: "", 
      businessInterest: "all"
    });
  };

  return (
    <div className="space-y-4 max-w-full overflow-hidden">
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Find Members</CardTitle>
          <CardDescription className="text-sm">
            Search and connect with other ABTC Bulgaria members
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <Input
              placeholder="Search by name, interests, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              <Input
                placeholder="Filter by location..."
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                className="text-sm"
              />
              <Input
                placeholder="Filter by interest..."
                value={searchFilters.interest}
                onChange={(e) => setSearchFilters({...searchFilters, interest: e.target.value})}
                className="text-sm"
              />
              <Input
                placeholder="Filter by education..."
                value={searchFilters.education}
                onChange={(e) => setSearchFilters({...searchFilters, education: e.target.value})}
                className="text-sm"
              />
              <Select
                value={searchFilters.businessInterest}
                onValueChange={(value) => setSearchFilters({...searchFilters, businessInterest: value})}
              >
                <SelectTrigger className="text-sm">
                  <SelectValue placeholder="Business Interest" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Interests</SelectItem>
                  <SelectItem value="expand-existing">Want to Expand Company</SelectItem>
                  <SelectItem value="start-company">Looking to Start Company</SelectItem>
                  <SelectItem value="join-company">Looking to Join Company</SelectItem>
                  <SelectItem value="other">Other Interests</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="text-sm w-full"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg">Members ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredMembers.map((member) => (
              <div key={member.id} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h4 className="font-medium text-sm sm:text-base truncate">{member.name}</h4>
                        <Badge variant="outline" className="text-xs">{member.role}</Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">📍 {member.location}</p>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2">🎓 {member.education}</p>
                      <p className="text-xs sm:text-sm text-gray-700 mb-3 line-clamp-2">{member.bio}</p>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Interests:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.interests.map((interest, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {member.skills.map((skill, index) => (
                              <SkillTag key={index} skill={skill} variant="outline" />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                      <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-none sm:w-24">
                        View Profile
                      </Button>
                      <Button size="sm" className="text-xs flex-1 sm:flex-none sm:w-24">
                        Message
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredMembers.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">
                No members found matching your search criteria.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SearchTab;
