
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

// Example customer data - in a real app, this would come from an API
const initialCustomers = [
  {
    id: "1",
    companyName: "Acme Corp",
    subscription: "Enterprise",
    startDate: "2023-05-12",
    contactName: "John Doe",
    email: "john@acmecorp.com",
    status: "active",
  },
  {
    id: "2",
    companyName: "Widgets Inc",
    subscription: "Premium",
    startDate: "2023-08-21",
    contactName: "Jane Smith",
    email: "jane@widgetsinc.com",
    status: "active",
  },
  {
    id: "3",
    companyName: "Tech Solutions",
    subscription: "Basic",
    startDate: "2024-01-05",
    contactName: "Robert Johnson",
    email: "robert@techsolutions.com",
    status: "active",
  },
  {
    id: "4",
    companyName: "Global Services",
    subscription: "Premium",
    startDate: "2023-11-15", 
    contactName: "Emma Wilson",
    email: "emma@globalservices.com",
    status: "active",
  },
  {
    id: "5",
    companyName: "Innovative Labs",
    subscription: "Enterprise",
    startDate: "2024-02-28",
    contactName: "Michael Brown",
    email: "michael@innovativelabs.com",
    status: "active",
  },
  {
    id: "6",
    companyName: "Digital Creations",
    subscription: "Basic",
    startDate: "2023-09-10",
    contactName: "Sarah Garcia",
    email: "sarah@digitalcreations.com",
    status: "inactive",
  },
];

// Format the date to a more readable format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

// Helper function to get badge color based on subscription type
const getSubscriptionBadgeColor = (subscription: string) => {
  switch (subscription.toLowerCase()) {
    case "basic":
      return "bg-blue-100 text-blue-800";
    case "premium":
      return "bg-purple-100 text-purple-800";
    case "enterprise":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get status badge color
const getStatusBadgeColor = (status: string) => {
  return status === "active" 
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";
};

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(initialCustomers);
  
  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableCaption>A list of all your customers.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Subscription</TableHead>
                <TableHead>Customer Since</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{customer.companyName}</TableCell>
                  <TableCell>
                    <Badge className={getSubscriptionBadgeColor(customer.subscription)} variant="outline">
                      {customer.subscription}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(customer.startDate)}</TableCell>
                  <TableCell>
                    <div>
                      <div>{customer.contactName}</div>
                      <div className="text-sm text-muted-foreground">{customer.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(customer.status)} variant="outline">
                      {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default Customers;
