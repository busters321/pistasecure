
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Users, AlertTriangle, Globe, CheckCircle } from "lucide-react";

export function AdminStats() {
  // Mock stats data - in a real app, this would come from a database
  const stats = {
    totalUsers: 1248,
    activeToday: 487,
    scamsReported: 328,
    scamsDetected: 1893,
    sitesAnalyzed: 4251,
    emailsScanned: 3128,
    averageRiskScore: 27.8
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
      <p className="text-muted-foreground">
        Monitor the platform's performance and user activity.
      </p>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 50) + 10} from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeToday}</div>
            <div className="text-xs text-muted-foreground">
              {((stats.activeToday / stats.totalUsers) * 100).toFixed(1)}% of total users
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scams Detected</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scamsDetected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{Math.floor(Math.random() * 100) + 50} from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Risk Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRiskScore}%</div>
            <p className="text-xs text-muted-foreground">
              -{Math.floor(Math.random() * 5) + 1}% from last week
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Weekly Activity Overview</CardTitle>
            <CardDescription>
              Platform usage and detections over the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-[200px] flex items-center justify-center">
              {/* In a real app, this would be a chart component */}
              <div className="flex items-end space-x-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="bg-pistachio rounded-md w-10" 
                    style={{ 
                      height: `${Math.floor(Math.random() * 100) + 50}px`,
                      opacity: 0.6 + (i * 0.05) 
                    }}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tool Usage Breakdown</CardTitle>
            <CardDescription>
              Most active security tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">Link Inspection</span>
                  <span className="text-sm text-muted-foreground">38%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "38%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">Email Scanner</span>
                  <span className="text-sm text-muted-foreground">27%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "27%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">Scam Intelligence</span>
                  <span className="text-sm text-muted-foreground">22%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "22%" }}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium flex-1">SafeView Browser</span>
                  <span className="text-sm text-muted-foreground">13%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div className="bg-pistachio h-2.5 rounded-full" style={{ width: "13%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
