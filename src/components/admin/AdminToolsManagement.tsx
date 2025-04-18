
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Link, 
  Mail, 
  MessageCircle, 
  Globe, 
  Instagram, 
  Key,
  FileText,
  BarChart3,
  Settings2,
  AlertOctagon
} from "lucide-react";

export function AdminToolsManagement() {
  const [tools, setTools] = useState([
    { 
      id: "1", 
      name: "AI Scam Intelligence", 
      icon: Shield,
      enabled: true,
      status: "operational",
      usageCount: 1245,
      path: "/scam-intelligence",
      description: "Detect scams using text, links, or screenshots",
      apiKey: "sk-ai-xxxxxxxxxxxx"
    },
    { 
      id: "2", 
      name: "Deep Link Inspection", 
      icon: Link,
      enabled: true,
      status: "operational",
      usageCount: 894,
      path: "/link-inspection",
      description: "Analyze URLs for safety and behavior",
      apiKey: "api-link-xxxxxxxxxxxx"
    },
    { 
      id: "3", 
      name: "Email Threat Scanner", 
      icon: Mail,
      enabled: true,
      status: "operational",
      usageCount: 756,
      path: "/email-scanner",
      description: "Check emails for phishing and spoofing",
      apiKey: "api-mail-xxxxxxxxxxxx"
    },
    { 
      id: "4", 
      name: "Cyber Copilot Chat", 
      icon: MessageCircle,
      enabled: true,
      status: "operational",
      usageCount: 1082,
      path: "/cyber-copilot",
      description: "Get AI security advice and answers",
      apiKey: "api-chat-xxxxxxxxxxxx"
    },
    { 
      id: "5", 
      name: "SafeView Browser", 
      icon: Globe,
      enabled: true,
      status: "operational",
      usageCount: 567,
      path: "/safe-view",
      description: "Browse securely in a sandbox environment",
      apiKey: "api-browser-xxxxxxxxxxxx"
    },
    { 
      id: "6", 
      name: "Social Media Protection", 
      icon: Instagram,
      enabled: true,
      status: "maintenance",
      usageCount: 432,
      path: "/social-protection",
      description: "Detect fake profiles and scam accounts",
      apiKey: "api-social-xxxxxxxxxxxx"
    },
    { 
      id: "7", 
      name: "Password Risk Checker", 
      icon: Key,
      enabled: true,
      status: "operational",
      usageCount: 621,
      path: "/password-checker",
      description: "Check if your passwords have been leaked",
      apiKey: "api-pass-xxxxxxxxxxxx"
    },
    { 
      id: "8", 
      name: "Scam Report Generator", 
      icon: FileText,
      enabled: true,
      status: "operational",
      usageCount: 289,
      path: "/scam-report",
      description: "Create and send scam reports easily",
      apiKey: "api-report-xxxxxxxxxxxx"
    },
    { 
      id: "9", 
      name: "Live Threat Feed", 
      icon: BarChart3,
      enabled: true,
      status: "operational",
      usageCount: 1105,
      path: "/threat-feed",
      description: "See real-time scam trends and alerts",
      apiKey: "api-feed-xxxxxxxxxxxx"
    }
  ]);
  
  const [editingTool, setEditingTool] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    apiKey: ""
  });
  
  const toggleToolStatus = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? {...tool, enabled: !tool.enabled} : tool
    ));
  };
  
  const startEditing = (tool: any) => {
    setEditingTool(tool.id);
    setEditForm({
      name: tool.name,
      description: tool.description,
      apiKey: tool.apiKey
    });
  };
  
  const saveChanges = (id: string) => {
    setTools(tools.map(tool => 
      tool.id === id ? {
        ...tool, 
        name: editForm.name,
        description: editForm.description,
        apiKey: editForm.apiKey
      } : tool
    ));
    setEditingTool(null);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return <Badge className="bg-green-500">Operational</Badge>;
      case "maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      case "down":
        return <Badge className="bg-red-500">Down</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tools Management</h2>
          <p className="text-muted-foreground">Configure and monitor security tools</p>
        </div>
        <Button className="bg-pistachio hover:bg-pistachio-dark text-black">
          <Settings2 className="h-4 w-4 mr-2" />
          Configure Global Settings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Tools</CardTitle>
            <CardDescription>Tools available to users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-pistachio">
              {tools.filter(t => t.enabled).length}/{tools.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Usage</CardTitle>
            <CardDescription>All tools combined</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tools.reduce((sum, tool) => sum + tool.usageCount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Issues</CardTitle>
            <CardDescription>Tools with problems</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-yellow-500">
              {tools.filter(t => t.status !== "operational").length}
            </div>
            {tools.filter(t => t.status !== "operational").length > 0 && (
              <AlertOctagon className="h-5 w-5 text-yellow-500" />
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tool</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>API Key</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tools.map((tool) => (
              <TableRow key={tool.id}>
                {editingTool === tool.id ? (
                  <>
                    <TableCell>
                      <Input 
                        value={editForm.name} 
                        onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea 
                        value={editForm.description} 
                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                        rows={2}
                        className="min-h-0"
                      />
                    </TableCell>
                    <TableCell>{getStatusBadge(tool.status)}</TableCell>
                    <TableCell>
                      <Input 
                        value={editForm.apiKey} 
                        onChange={(e) => setEditForm({...editForm, apiKey: e.target.value})}
                        type="password"
                      />
                    </TableCell>
                    <TableCell>{tool.usageCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={tool.enabled} 
                        onCheckedChange={() => toggleToolStatus(tool.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => saveChanges(tool.id)}
                      >
                        Save
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className="font-medium flex items-center space-x-2">
                      <span className="rounded-full bg-pistachio/10 p-1">
                        <tool.icon className="h-4 w-4 text-pistachio" />
                      </span>
                      <span>{tool.name}</span>
                    </TableCell>
                    <TableCell>{tool.description}</TableCell>
                    <TableCell>{getStatusBadge(tool.status)}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {tool.apiKey.substring(0, 8)}•••••••
                    </TableCell>
                    <TableCell>{tool.usageCount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={tool.enabled} 
                        onCheckedChange={() => toggleToolStatus(tool.id)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => startEditing(tool)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
