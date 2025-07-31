"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InfoIcon, FilterIcon, BellIcon, Settings2Icon, LogOutIcon, UserIcon } from "lucide-react";

export default function DashboardExample() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard Components</h1>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon">
                  <BellIcon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings2Icon className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <Input placeholder="Search..." />
        </div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        <Button>
          <FilterIcon className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Information</AlertTitle>
        <AlertDescription>
          This is an example dashboard showing shadcn/ui components.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
            <CardDescription>Pneumonia cases across regions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,234</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">↑ 12%</span> from last month
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">View Details</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>High Risk Areas</CardTitle>
            <CardDescription>Regions with critical pneumonia rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">12</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-red-500">↑ 3</span> from last month
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">View Details</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recovery Rate</CardTitle>
            <CardDescription>Average recovery percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground mt-2">
              <span className="text-green-500">↑ 2%</span> from last month
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">View Details</Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regions">Regions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
              <CardDescription>Summary of pneumonia cases across all regions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <span>Total confirmed cases</span>
                <span className="font-medium">1,234</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Active cases</span>
                <span className="font-medium">421</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Recovered</span>
                <span className="font-medium">789</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Fatality rate</span>
                <span className="font-medium">2.4%</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="regions">
          <Card>
            <CardHeader>
              <CardTitle>Regions</CardTitle>
              <CardDescription>Cases by geographic distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">High</Badge>
                    <span>Jakarta</span>
                  </div>
                  <span>289 cases</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="destructive">High</Badge>
                    <span>Bandung</span>
                  </div>
                  <span>214 cases</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Medium</Badge>
                    <span>Surabaya</span>
                  </div>
                  <span>176 cases</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Medium</Badge>
                    <span>Semarang</span>
                  </div>
                  <span>154 cases</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Medium</Badge>
                    <span>Cianjur</span>
                  </div>
                  <span>153 cases</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Detailed analytics data will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 