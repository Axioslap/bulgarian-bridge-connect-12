
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin, Calendar, Briefcase, Plus } from "lucide-react";

const JobsTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  
  const categories = ["All", "Technology", "Business", "Marketing", "Finance", "Consulting"];
  const locations = ["All", "Remote", "Sofia", "Plovdiv", "Varna", "USA"];
  
  const jobs = [
    {
      id: 1,
      title: "Senior Software Engineer",
      company: "Tech Innovation Labs",
      location: "Sofia, Bulgaria",
      type: "Full-time",
      category: "Technology",
      remote: true,
      salary: "€40,000 - €60,000",
      postedDate: "2024-01-15",
      description: "Join our team building next-generation software solutions...",
      requirements: ["5+ years experience", "React/Node.js", "Team leadership"]
    },
    {
      id: 2,
      title: "Business Development Manager",
      company: "Bulgarian-American Chamber",
      location: "Remote",
      type: "Full-time",
      category: "Business",
      remote: true,
      salary: "$50,000 - $70,000",
      postedDate: "2024-01-12",
      description: "Develop strategic partnerships between US and Bulgarian companies...",
      requirements: ["MBA preferred", "5+ years BD experience", "Bilingual"]
    },
    {
      id: 3,
      title: "Marketing Specialist",
      company: "Innovation Capital",
      location: "Plovdiv, Bulgaria",
      type: "Contract",
      category: "Marketing",
      remote: false,
      salary: "€25,000 - €35,000",
      postedDate: "2024-01-10",
      description: "Create and execute marketing campaigns for our portfolio companies...",
      requirements: ["3+ years marketing", "Digital marketing expertise", "Creative mindset"]
    },
    {
      id: 4,
      title: "Financial Analyst",
      company: "US Tech Corp",
      location: "Boston, USA",
      type: "Full-time",
      category: "Finance",
      remote: true,
      salary: "$60,000 - $80,000",
      postedDate: "2024-01-08",
      description: "Analyze financial data and support strategic decision making...",
      requirements: ["CFA/CPA preferred", "Excel/SQL proficiency", "Analytical skills"]
    }
  ];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || job.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || 
                           job.location.includes(selectedLocation) ||
                           (selectedLocation === "Remote" && job.remote);
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Jobs</CardTitle>
            <CardDescription>
              Find opportunities in our professional network
            </CardDescription>
          </div>
          <Button size="sm" className="shrink-0">
            <Plus className="h-4 w-4 mr-2" />
            Post a Job
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search jobs by title, company, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">Industry:</span>
              <div className="flex flex-wrap gap-1">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Location:</span>
            <div className="flex flex-wrap gap-1">
              {locations.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLocation(location)}
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{job.title}</h3>
                    <p className="text-gray-600 font-medium">{job.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{job.salary}</p>
                    <Badge variant="outline" className="mt-1">
                      {job.type}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary">{job.category}</Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </div>
                  {job.remote && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Remote OK
                    </Badge>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    Posted {job.postedDate}
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                
                <div className="mb-4">
                  <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requirements.map((req, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="sm">Apply Now</Button>
                  <Button variant="outline" size="sm">Save Job</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No jobs found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobsTab;
