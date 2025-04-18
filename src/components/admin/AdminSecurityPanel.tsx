import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function SecurityPanel() {
    return (
        <div className="p-4 grid gap-4">
            <h1 className="text-2xl font-bold">Security Panel</h1>

            <Tabs defaultValue="threat-scanner" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="threat-scanner">Threat Scanner</TabsTrigger>
                    <TabsTrigger value="firewall">Firewall</TabsTrigger>
                    <TabsTrigger value="logs">Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="threat-scanner">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Threat Scanner</h2>
                            <p>Scan your website for malware, viruses, and vulnerabilities.</p>
                            <Button className="mt-4">Start Scan</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="firewall">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Firewall Settings</h2>
                            <p>Enable or adjust firewall settings to protect against intrusions.</p>
                            <Button className="mt-4">Configure Firewall</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="logs">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Activity Logs</h2>
                            <p>View recent activity and security events on your site.</p>
                            <Button className="mt-4">View Logs</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Tabs defaultValue="advanced" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="2fa">2FA Enforcement</TabsTrigger>
                    <TabsTrigger value="threat-feed">Threat Feed</TabsTrigger>
                    <TabsTrigger value="session">Sessions</TabsTrigger>
                    <TabsTrigger value="api">API Logs</TabsTrigger>
                    <TabsTrigger value="anomaly">Anomalies</TabsTrigger>
                </TabsList>

                <TabsContent value="2fa">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Two-Factor Authentication</h2>
                            <p>Require 2FA for all admins. Reset or disable user 2FA settings.</p>
                            <Button className="mt-4">Manage 2FA</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="threat-feed">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Real-Time Threat Feed</h2>
                            <p>View the latest global security threats and CVEs.</p>
                            <Button className="mt-4">Fetch Feed</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="session">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Session Management</h2>
                            <p>View and terminate active user sessions.</p>
                            <Button className="mt-4">Manage Sessions</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="api">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">API & Webhook Logs</h2>
                            <p>Track external access, monitor abuse, and control usage.</p>
                            <Button className="mt-4">View Logs</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="anomaly">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">User Behavior Anomalies</h2>
                            <p>Detect suspicious login patterns or abnormal behavior.</p>
                            <Button className="mt-4">Analyze Activity</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            <Tabs defaultValue="audit" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="permissions">Permissions Audit</TabsTrigger>
                    <TabsTrigger value="score">Security Score</TabsTrigger>
                    <TabsTrigger value="exposure">Data Exposure</TabsTrigger>
                    <TabsTrigger value="rate">Rate Limits</TabsTrigger>
                    <TabsTrigger value="checklist">Checklist</TabsTrigger>
                </TabsList>

                <TabsContent value="permissions">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Permissions Audit</h2>
                            <p>Review all users with elevated access and permissions.</p>
                            <Button className="mt-4">Audit Permissions</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="score">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Security Score</h2>
                            <p>Track your current security rating and how to improve it.</p>
                            <Button className="mt-4">Check Score</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="exposure">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Sensitive Data Exposure</h2>
                            <p>Scan for leaked or unsecured sensitive information.</p>
                            <Button className="mt-4">Run Scanner</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="rate">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Rate Limit & Firewall</h2>
                            <p>Configure API rate limits and block abusive IPs.</p>
                            <Button className="mt-4">Edit Limits</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="checklist">
                    <Card>
                        <CardContent className="p-4">
                            <h2 className="text-xl font-semibold">Security Checklist</h2>
                            <p>Complete essential steps to secure your website.</p>
                            <Button className="mt-4">View Checklist</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
