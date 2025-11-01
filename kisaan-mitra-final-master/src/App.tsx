import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DataProvider } from "@/contexts/DataContext";
import Overview from "./pages/Overview";
import WeatherPage from "./pages/WeatherPage";
import SoilPage from "./pages/SoilPage";
import CropsPage from "./pages/CropsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ChatbotPage from "./pages/ChatbotPage";
import SetupPage from "./pages/SetupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Standalone Setup Page - No Dashboard Layout */}
          <Route path="/" element={<SetupPage />} />
          
          {/* Dashboard Pages - With Sidebar and Header Layout */}
          <Route path="/overview" element={
            <DataProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background flex items-center px-4">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">Kisaan Mitra</h2>
                      </div>
                    </header>
                    <main className="flex-1 p-6 bg-background overflow-y-auto">
                      <Overview />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </DataProvider>
          } />
          
          <Route path="/weather" element={
            <DataProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background flex items-center px-4">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">Kisaan Mitra</h2>
                      </div>
                    </header>
                    <main className="flex-1 p-6 bg-background overflow-y-auto">
                      <WeatherPage />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </DataProvider>
          } />
          
          <Route path="/soil" element={
            <DataProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background flex items-center px-4">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">Kisaan Mitra</h2>
                      </div>
                    </header>
                    <main className="flex-1 p-6 bg-background overflow-y-auto">
                      <SoilPage />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </DataProvider>
          } />
          
          <Route path="/crops" element={
            <DataProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background flex items-center px-4">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">Kisaan Mitra</h2>
                      </div>
                    </header>
                    <main className="flex-1 p-6 bg-background overflow-y-auto">
                      <CropsPage />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </DataProvider>
          } />
          
          <Route path="/analytics" element={
            <DataProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background flex items-center px-4">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">Kisaan Mitra</h2>
                      </div>
                    </header>
                    <main className="flex-1 p-6 bg-background overflow-y-auto">
                      <AnalyticsPage />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </DataProvider>
          } />
          
          <Route path="/chatbot" element={
            <DataProvider>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <div className="flex-1 flex flex-col">
                    <header className="h-14 border-b bg-background flex items-center px-4">
                      <SidebarTrigger />
                      <div className="ml-4">
                        <h2 className="font-semibold text-lg">Kisaan Mitra</h2>
                      </div>
                    </header>
                    <main className="flex-1 p-6 bg-background overflow-y-auto">
                      <ChatbotPage />
                    </main>
                  </div>
                </div>
              </SidebarProvider>
            </DataProvider>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
