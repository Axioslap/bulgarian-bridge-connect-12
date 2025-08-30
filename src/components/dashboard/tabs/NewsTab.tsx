
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SkillSelector from "@/components/SkillSelector";
import { mockCuratedNews } from "@/data/mockData";

interface NewsTabProps {
  newsInterests: string[];
  setNewsInterests: (interests: string[]) => void;
}

const NewsTab = ({ newsInterests, setNewsInterests }: NewsTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your News Interests</CardTitle>
          <CardDescription>
            Customize what topics you want to see in your personalized news feed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Topics of Interest</label>
            <SkillSelector
              skills={newsInterests}
              onSkillsChange={setNewsInterests}
              placeholder="Add topics (e.g., AI, fintech, blockchain)..."
            />
          </div>
          <Button>Update Preferences</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personalized News Feed</CardTitle>
          <CardDescription>
            Latest stories based on your interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCuratedNews.map((article) => (
              <div key={article.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium">{article.title}</h4>
                    {article.isNew && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <Badge variant="outline" className="text-xs">{article.category}</Badge>
                    <span>{article.date}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">Read</Button>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/news">
              <Button variant="outline" className="w-full">
                View All News
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsTab;
