import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Settings, Heart, Upload, BarChart3, Bell, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UserDashboard = () => {
  const { toast } = useToast();
  const [userSettings, setUserSettings] = useState({
    name: "Dr. Marine Researcher",
    email: "researcher@oceaninstitute.org",
    institution: "Pacific Marine Research Institute",
    notifications: {
      newData: true,
      criticalAlerts: true,
      weeklyReports: false,
      systemUpdates: true
    },
    preferences: {
      defaultDepthUnit: "meters",
      defaultTempUnit: "celsius",
      autoRefresh: true,
      darkMode: false
    }
  });

  const [favoriteSpecies, setFavoriteSpecies] = useState([
    { name: "Bluefin Tuna", status: "Endangered", lastSeen: "2024-01-15" },
    { name: "Great White Shark", status: "Vulnerable", lastSeen: "2024-01-12" },
    { name: "Pacific Salmon", status: "Declining", lastSeen: "2024-01-10" }
  ]);

  const [recentActivity] = useState([
    { action: "Uploaded dataset", details: "Marine_Survey_2024.csv", time: "2 hours ago" },
    { action: "Generated visualization", details: "Species Distribution Chart", time: "5 hours ago" },
    { action: "Downloaded results", details: "AI Classification Report", time: "1 day ago" },
    { action: "Updated profile", details: "Contact information", time: "2 days ago" }
  ]);

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully."
    });
  };

  const handleToggleNotification = (key: string) => {
    setUserSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications]
      }
    }));
  };

  const handleTogglePreference = (key: string) => {
    setUserSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key as keyof typeof prev.preferences]
      }
    }));
  };

  const removeFavorite = (speciesName: string) => {
    setFavoriteSpecies(prev => prev.filter(species => species.name !== speciesName));
    toast({
      title: "Removed from favorites",
      description: `${speciesName} has been removed from your watchlist.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'endangered': case 'critical': return 'bg-red-100 text-red-800';
      case 'vulnerable': case 'declining': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-ocean bg-clip-text text-transparent">
            User Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your profile, preferences, and research data
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Profile Card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={userSettings.name}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        value={userSettings.email}
                        onChange={(e) => setUserSettings(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="institution">Institution</Label>
                    <Input 
                      id="institution" 
                      value={userSettings.institution}
                      onChange={(e) => setUserSettings(prev => ({ ...prev, institution: e.target.value }))}
                    />
                  </div>
                  <Button onClick={handleSaveSettings} className="bg-gradient-ocean">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Upload className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Datasets</span>
                    </div>
                    <Badge variant="secondary">23</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Visualizations</span>
                    </div>
                    <Badge variant="secondary">45</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">Favorites</span>
                    </div>
                    <Badge variant="secondary">{favoriteSpecies.length}</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Species Watchlist
                </CardTitle>
                <CardDescription>
                  Track your favorite marine species and their conservation status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {favoriteSpecies.map((species, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{species.name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(species.status)}>
                            {species.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            Last seen: {species.lastSeen}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFavorite(species.name)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-data">New Data Alerts</Label>
                    <Switch
                      id="new-data"
                      checked={userSettings.notifications.newData}
                      onCheckedChange={() => handleToggleNotification('newData')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="critical">Critical Alerts</Label>
                    <Switch
                      id="critical"
                      checked={userSettings.notifications.criticalAlerts}
                      onCheckedChange={() => handleToggleNotification('criticalAlerts')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weekly">Weekly Reports</Label>
                    <Switch
                      id="weekly"
                      checked={userSettings.notifications.weeklyReports}
                      onCheckedChange={() => handleToggleNotification('weeklyReports')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="updates">System Updates</Label>
                    <Switch
                      id="updates"
                      checked={userSettings.notifications.systemUpdates}
                      onCheckedChange={() => handleToggleNotification('systemUpdates')}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* App Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-refresh">Auto Refresh Data</Label>
                    <Switch
                      id="auto-refresh"
                      checked={userSettings.preferences.autoRefresh}
                      onCheckedChange={() => handleTogglePreference('autoRefresh')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <Switch
                      id="dark-mode"
                      checked={userSettings.preferences.darkMode}
                      onCheckedChange={() => handleTogglePreference('darkMode')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depth-unit">Default Depth Unit</Label>
                    <select 
                      id="depth-unit"
                      className="w-full p-2 border rounded-lg"
                      value={userSettings.preferences.defaultDepthUnit}
                      onChange={(e) => setUserSettings(prev => ({
                        ...prev,
                        preferences: { ...prev.preferences, defaultDepthUnit: e.target.value }
                      }))}
                    >
                      <option value="meters">Meters</option>
                      <option value="feet">Feet</option>
                      <option value="fathoms">Fathoms</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and system interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.action}</h4>
                        <p className="text-sm text-muted-foreground">{activity.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UserDashboard;