
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const AboutPartners = lazy(() => import("./pages/AboutPartners"));
const Storytelling = lazy(() => import("./pages/Storytelling"));
const Experts = lazy(() => import("./pages/Experts"));
const ExpertRegistration = lazy(() => import("./pages/ExpertRegistration"));
const BecomeExpert = lazy(() => import("./pages/BecomeExpert"));
const Events = lazy(() => import("./pages/Events"));
const News = lazy(() => import("./pages/News"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const NotFound = lazy(() => import("./pages/NotFound"));
const MemberDashboard = lazy(() => import("./pages/MemberDashboard"));
const AllPosts = lazy(() => import("./pages/AllPosts"));
const CommunityPosts = lazy(() => import("./pages/CommunityPosts"));
const PostDetail = lazy(() => import("./pages/PostDetail"));
const PartnerDetail = lazy(() => import("./pages/PartnerDetail"));
const BoardMember = lazy(() => import("./pages/BoardMember"));
const JoinUs = lazy(() => import("./pages/JoinUs"));

// Components loaded synchronously for better UX
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-pulse flex flex-col items-center space-y-4">
      <div className="h-8 w-8 bg-primary rounded-full animate-bounce"></div>
      <div className="text-muted-foreground">Loading...</div>
    </div>
  </div>
);

// Optimized QueryClient with better defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-partners" element={<AboutPartners />} />
            <Route path="/storytelling" element={<Storytelling />} />
            <Route path="/board-member/:id" element={<BoardMember />} />
            <Route path="/partners/:id" element={<PartnerDetail />} />
            <Route path="/experts" element={<Experts />} />
        <Route path="/expert-registration" element={<ExpertRegistration />} />
        <Route path="/become-expert" element={<BecomeExpert />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
            <Route path="/join" element={<JoinUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/member" element={
              <ProtectedRoute>
                <MemberDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/all-posts" element={
              <ProtectedRoute>
                <AllPosts />
              </ProtectedRoute>
            } />
            <Route path="/community-posts" element={
              <ProtectedRoute>
                <CommunityPosts />
              </ProtectedRoute>
            } />
            <Route path="/community-posts/:postId" element={
              <ProtectedRoute>
                <PostDetail />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
