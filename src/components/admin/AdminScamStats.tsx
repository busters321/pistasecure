
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, ShieldAlert, Mail, Instagram, FileText, Search, UserX } from "lucide-react";
import { BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

interface ScamReport {
  id: string;
  type: 'email' | 'social' | 'report';
  content: string;
  result: any;
  date: string;
}

export function AdminScamStats() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [timeRange, setTimeRange] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    // Load reports from localStorage
    const storedReports = JSON.parse(localStorage.getItem('pistaSecure_scamReports') || '[]');
    setReports(storedReports);
    
    // Set up refresh interval
    const interval = setInterval(() => {
      const refreshedReports = JSON.parse(localStorage.getItem('pistaSecure_scamReports') || '[]');
      setReports(refreshedReports);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Filter reports by time range
  const getFilteredReports = () => {
    if (timeRange === 'all') return reports;
    
    const now = new Date();
    const cutoff = new Date();
    
    switch (timeRange) {
      case 'day':
        cutoff.setDate(now.getDate() - 1);
        break;
      case 'week':
        cutoff.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoff.setMonth(now.getMonth() - 1);
        break;
      default:
        return reports;
    }
    
    return reports.filter(report => new Date(report.date) >= cutoff);
  };
  
  const filteredReports = getFilteredReports();
  
  // Calculate statistics
  const emailReports = filteredReports.filter(r => r.type === 'email');
  const socialReports = filteredReports.filter(r => r.type === 'social');
  const manualReports = filteredReports.filter(r => r.type === 'report');
  
  const dangerousCount = emailReports.filter(r => r.result.riskLevel === 'dangerous').length + 
                        socialReports.filter(r => r.result.trustLevel === 'scam').length +
                        manualReports.filter(r => r.result.analysis.severity === 'high').length;
                        
  const suspiciousCount = emailReports.filter(r => r.result.riskLevel === 'suspicious').length + 
                          socialReports.filter(r => r.result.trustLevel === 'suspicious').length +
                          manualReports.filter(r => r.result.analysis.severity === 'medium').length;
                          
  const safeCount = emailReports.filter(r => r.result.riskLevel === 'safe').length + 
                   socialReports.filter(r => r.result.trustLevel === 'trusted').length +
                   manualReports.filter(r => r.result.analysis.severity === 'low').length;
  
  // Prepare chart data
  const pieChartData = [
    { name: 'Dangerous', value: dangerousCount, color: '#f87171' },
    { name: 'Suspicious', value: suspiciousCount, color: '#facc15' },
    { name: 'Safe', value: safeCount, color: '#4ade80' }
  ];
  
  const barChartData = [
    { name: 'Email', dangerous: emailReports.filter(r => r.result.riskLevel === 'dangerous').length, 
      suspicious: emailReports.filter(r => r.result.riskLevel === 'suspicious').length,
      safe: emailReports.filter(r => r.result.riskLevel === 'safe').length },
    { name: 'Social', dangerous: socialReports.filter(r => r.result.trustLevel === 'scam').length,
      suspicious: socialReports.filter(r => r.result.trustLevel === 'suspicious').length,
      safe: socialReports.filter(r => r.result.trustLevel === 'trusted').length },
    { name: 'Reports', dangerous: manualReports.filter(r => r.result.analysis.severity === 'high').length,
      suspicious: manualReports.filter(r => r.result.analysis.severity === 'medium').length,
      safe: manualReports.filter(r => r.result.analysis.severity === 'low').length }
  ];
  
  const getRiskBadge = (type: string, result: any) => {
    let riskLevel: string = 'unknown';
    let color = 'bg-secondary text-secondary-foreground';
    
    if (type === 'email') {
      riskLevel = result.riskLevel;
    } else if (type === 'social') {
      riskLevel = result.trustLevel;
    } else if (type === 'report') {
      riskLevel = result.analysis.severity === 'high' ? 'dangerous' : 
                 result.analysis.severity === 'medium' ? 'suspicious' : 'safe';
    }
    
    switch (riskLevel) {
      case 'dangerous':
      case 'scam':
        color = 'bg-destructive/20 text-destructive';
        break;
      case 'suspicious':
        color = 'bg-warning/20 text-warning';
        break;
      case 'safe':
      case 'trusted':
        color = 'bg-success/20 text-success';
        break;
    }
    
    return <Badge className={color}>{riskLevel}</Badge>;
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4 text-blue-500" />;
      case 'social':
        return <Instagram className="h-4 w-4 text-purple-500" />;
      case 'report':
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Scam Reports</h2>
          <p className="text-muted-foreground">Monitor and analyze user-submitted scam reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setTimeRange('day')}>
            24h
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('week')}>
            7d
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('month')}>
            30d
          </Button>
          <Button variant="outline" size="sm" onClick={() => setTimeRange('all')}>
            All
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Reports</CardTitle>
            <CardDescription>All detection methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{filteredReports.length}</div>
            <div className="text-xs text-muted-foreground mt-1">
              {emailReports.length} emails, {socialReports.length} profiles, {manualReports.length} manual
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Dangerous</CardTitle>
            <CardDescription>High-risk threats</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-3xl font-bold text-destructive">{dangerousCount}</div>
            <ShieldAlert className="h-5 w-5 text-destructive" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Safe</CardTitle>
            <CardDescription>Low-risk items</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <div className="text-3xl font-bold text-success">{safeCount}</div>
            <CheckCircle className="h-5 w-5 text-success" />
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Risk Distribution</CardTitle>
                <CardDescription>Proportion of risk levels across all reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(1)}%`}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Report Sources</CardTitle>
                <CardDescription>Risk levels by detection method</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={barChartData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="dangerous" fill="#f87171" name="Dangerous" />
                      <Bar dataKey="suspicious" fill="#facc15" name="Suspicious" />
                      <Bar dataKey="safe" fill="#4ade80" name="Safe" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Reports</CardTitle>
              <CardDescription>Complete list of scam reports</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredReports.length === 0 ? (
                <div className="py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No reports found</h3>
                  <p className="text-muted-foreground mt-2">
                    No scam reports have been submitted in the selected time period.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Risk Level</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            {getTypeIcon(report.type)}
                            <span className="capitalize">{report.type}</span>
                          </TableCell>
                          <TableCell>{new Date(report.date).toLocaleString()}</TableCell>
                          <TableCell className="max-w-[200px] truncate">{report.content}</TableCell>
                          <TableCell>{getRiskBadge(report.type, report.result)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Scam Patterns</CardTitle>
              <CardDescription>Common patterns detected in scam reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Phishing', count: 32 },
                      { name: 'Financial', count: 28 },
                      { name: 'Identity', count: 23 },
                      { name: 'Romance', count: 19 },
                      { name: 'Employment', count: 17 },
                      { name: 'Lottery', count: 12 },
                      { name: 'Tech Support', count: 10 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
