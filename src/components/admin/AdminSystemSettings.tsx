
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Bell, Globe, RefreshCw, Cloud, Lock, MailCheck } from "lucide-react";
import { toast } from "sonner";

export function AdminSystemSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "PistaSecure",
    maxActiveUsers: 500,
    maxDailyScans: 10000,
    adminEmail: "admin@pistasecure.com",
    maintenanceMode: false,
    debugMode: false,
    userRegistration: true
  });
  
  const [securitySettings, setSecuritySettings] = useState({
    passThroughLevel: 3,
    apiRateLimit: 60,
    sessionTimeout: 30,
    twoFactorAuth: true,
    ipBlocking: true,
    sensitivityLevel: [65]
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    securityAlerts: true,
    weeklyReports: true,
    criticalThreatsOnly: false,
    adminNotificationEmail: "alerts@pistasecure.com",
    customMessage: "Important security alert from PistaSecure"
  });

  const handleGeneralSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setGeneralSettings(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleGeneralSwitchChange = (name: string, checked: boolean) => {
    setGeneralSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSecuritySettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setSecuritySettings(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
  };

  const handleSecuritySwitchChange = (name: string, checked: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNotificationSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNotificationSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationSwitchChange = (name: string, checked: boolean) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const saveSettings = (settingType: string) => {
    toast.success(`${settingType} settings saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">System Settings</h2>
        <p className="text-muted-foreground">
          Configure and manage PistaSecure platform settings
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-pistachio" /> 
                General Settings
              </CardTitle>
              <CardDescription>
                Configure basic system settings and operational parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Site Name</label>
                  <Input 
                    name="siteName"
                    value={generalSettings.siteName}
                    onChange={handleGeneralSettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Email</label>
                  <Input 
                    name="adminEmail"
                    type="email"
                    value={generalSettings.adminEmail}
                    onChange={handleGeneralSettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Concurrent Users</label>
                  <Input 
                    name="maxActiveUsers"
                    type="number"
                    value={generalSettings.maxActiveUsers}
                    onChange={handleGeneralSettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Daily Scans</label>
                  <Input 
                    name="maxDailyScans"
                    type="number"
                    value={generalSettings.maxDailyScans}
                    onChange={handleGeneralSettingChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">System Modes</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Maintenance Mode</label>
                      <p className="text-xs text-muted-foreground">
                        Put site in maintenance mode for all users
                      </p>
                    </div>
                    <Switch 
                      checked={generalSettings.maintenanceMode}
                      onCheckedChange={(checked) => handleGeneralSwitchChange("maintenanceMode", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Debug Mode</label>
                      <p className="text-xs text-muted-foreground">
                        Enable extended logging and debugging
                      </p>
                    </div>
                    <Switch 
                      checked={generalSettings.debugMode}
                      onCheckedChange={(checked) => handleGeneralSwitchChange("debugMode", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">User Registration</label>
                      <p className="text-xs text-muted-foreground">
                        Allow new users to register
                      </p>
                    </div>
                    <Switch 
                      checked={generalSettings.userRegistration}
                      onCheckedChange={(checked) => handleGeneralSwitchChange("userRegistration", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button 
                className="bg-pistachio hover:bg-pistachio-dark text-black"
                onClick={() => saveSettings("General")}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Security Settings Tab */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-pistachio" /> 
                Security Settings
              </CardTitle>
              <CardDescription>
                Configure security parameters and protection levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pass-through Security Level (1-5)</label>
                  <Input 
                    name="passThroughLevel"
                    type="number"
                    min={1}
                    max={5}
                    value={securitySettings.passThroughLevel}
                    onChange={handleSecuritySettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">API Rate Limit (requests/minute)</label>
                  <Input 
                    name="apiRateLimit"
                    type="number"
                    value={securitySettings.apiRateLimit}
                    onChange={handleSecuritySettingChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Session Timeout (minutes)</label>
                  <Input 
                    name="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={handleSecuritySettingChange}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Security Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Two-Factor Authentication</label>
                      <p className="text-xs text-muted-foreground">
                        Require 2FA for all admin users
                      </p>
                    </div>
                    <Switch 
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecuritySwitchChange("twoFactorAuth", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">IP Blocking</label>
                      <p className="text-xs text-muted-foreground">
                        Automatically block suspicious IP addresses
                      </p>
                    </div>
                    <Switch 
                      checked={securitySettings.ipBlocking}
                      onCheckedChange={(checked) => handleSecuritySwitchChange("ipBlocking", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Threat Detection Sensitivity</label>
                    <span className="text-sm text-muted-foreground">{securitySettings.sensitivityLevel[0]}%</span>
                  </div>
                  <Slider
                    defaultValue={[65]}
                    max={100}
                    step={1}
                    value={securitySettings.sensitivityLevel}
                    onValueChange={(value) => 
                      setSecuritySettings(prev => ({ ...prev, sensitivityLevel: value }))
                    }
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Lower (fewer alerts)</span>
                    <span>Higher (more alerts)</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button 
                className="bg-pistachio hover:bg-pistachio-dark text-black"
                onClick={() => saveSettings("Security")}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings Tab */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-pistachio" /> 
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure alerts, reports and communication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Email Notifications</label>
                      <p className="text-xs text-muted-foreground">
                        Send email notifications to users
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => handleNotificationSwitchChange("emailNotifications", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Security Alerts</label>
                      <p className="text-xs text-muted-foreground">
                        Send real-time security alerts
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.securityAlerts}
                      onCheckedChange={(checked) => handleNotificationSwitchChange("securityAlerts", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Weekly Reports</label>
                      <p className="text-xs text-muted-foreground">
                        Send weekly security summary reports
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) => handleNotificationSwitchChange("weeklyReports", checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div className="space-y-0.5">
                      <label className="text-sm font-medium">Critical Threats Only</label>
                      <p className="text-xs text-muted-foreground">
                        Only notify for high severity threats
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.criticalThreatsOnly}
                      onCheckedChange={(checked) => handleNotificationSwitchChange("criticalThreatsOnly", checked)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Admin Notification Email</label>
                  <Input 
                    name="adminNotificationEmail"
                    type="email"
                    value={notificationSettings.adminNotificationEmail}
                    onChange={handleNotificationSettingChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Alert Message</label>
                <Textarea 
                  name="customMessage"
                  value={notificationSettings.customMessage}
                  onChange={handleNotificationSettingChange}
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button 
                className="bg-pistachio hover:bg-pistachio-dark text-black"
                onClick={() => saveSettings("Notification")}
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
