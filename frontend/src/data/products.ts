
import { Server, HardDrive, Router, Shield, Cpu, Monitor, Laptop, Smartphone, Database, Lock, ArrowRightLeft, Network, Globe, FileText, UserCheck } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: any;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
  icon: any;
  category: string;
  featured?: boolean;
  inStock: boolean;
  tags?: string[];
  features?: string[];
};

export const categories: Category[] = [
  {
    id: "infrastructure",
    name: "IT Infrastructure",
    description: "Enterprise-grade hardware for your organization",
    icon: Server
  },
  {
    id: "user-devices",
    name: "User Devices",
    description: "Laptops, smartphones and mobility devices",
    icon: Laptop
  },
  {
    id: "networking",
    name: "Networking",
    description: "Connectivity and network management solutions",
    icon: Network
  },
  {
    id: "security",
    name: "Security",
    description: "Protection against threats and vulnerabilities",
    icon: Shield
  },
  {
    id: "solutions",
    name: "Solutions",
    description: "Integrated solutions for specific requirements",
    icon: Database
  }
];

export const products: Product[] = [
  {
    id: 1,
    title: "Enterprise Servers",
    description: "High-performance servers for business-critical applications.",
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹89,999",
    icon: Server,
    category: "infrastructure",
    featured: true,
    inStock: true,
    tags: ["server", "hardware", "enterprise"],
    features: ["Dual Intel Xeon processors", "128GB ECC RAM", "Hot-swappable drive bays", "Redundant power supplies", "Remote management"]
  },
  {
    id: 2,
    title: "Network Switches",
    description: "Enterprise-grade switches for high-speed network connectivity.",
    image: "https://images.unsplash.com/photo-1647423619058-8b3aa04a4c97?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹24,999",
    icon: Router,
    category: "networking",
    featured: true,
    inStock: true,
    tags: ["networking", "switch", "connectivity"],
    features: ["48 Gigabit Ethernet ports", "4 SFP+ uplinks", "Layer 3 switching", "Advanced QoS", "VLAN support"]
  },
  {
    id: 3,
    title: "Storage Arrays",
    description: "Scalable storage systems for growing data needs.",
    image: "https://images.unsplash.com/photo-1600267204026-d2162b128773?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹39,999",
    icon: HardDrive,
    category: "infrastructure",
    inStock: true,
    tags: ["storage", "data", "enterprise"],
    features: ["20TB raw capacity", "RAID 0, 1, 5, 10 support", "Expandable design", "Hot-swap capability", "Data deduplication"]
  },
  {
    id: 4,
    title: "Hardware Firewalls",
    description: "Hardware firewalls and security devices for robust protection.",
    image: "https://images.unsplash.com/photo-1563770557593-978789a237fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹59,999",
    icon: Shield,
    category: "security",
    featured: true,
    inStock: true,
    tags: ["security", "firewall", "protection"],
    features: ["Stateful packet inspection", "VPN support", "IDS/IPS capabilities", "Multiple WAN interfaces", "Content filtering"]
  },
  {
    id: 5,
    title: "Server Processors",
    description: "High-performance CPUs designed for server applications.",
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹45,999",
    icon: Cpu,
    category: "infrastructure",
    inStock: false,
    tags: ["processor", "server", "hardware"],
    features: ["28 cores / 56 threads", "4.5GHz max turbo frequency", "38.5MB cache", "PCIe 4.0 support", "Advanced security features"]
  },
  
  {
    id: 6,
    title: "Business Laptops",
    description: "Reliable laptops designed for business use with extended warranty.",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹68,999",
    icon: Laptop,
    category: "user-devices",
    featured: true,
    inStock: true,
    tags: ["laptop", "business", "mobility"],
    features: ["14\" 4K display", "Intel Core i7 processor", "32GB RAM", "1TB SSD", "Windows 11 Pro", "3-year warranty"]
  },
  {
    id: 7,
    title: "Enterprise Smartphones",
    description: "Secure smartphones with enterprise management features.",
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=2027&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹52,999",
    icon: Smartphone,
    category: "user-devices",
    inStock: true,
    tags: ["mobile", "smartphone", "enterprise"],
    features: ["6.7\" AMOLED display", "Advanced biometric security", "5G connectivity", "Enterprise-grade security", "MDM integration"]
  },
  {
    id: 8,
    title: "Professional Monitors",
    description: "High-resolution monitors for professional work environments.",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹29,999",
    icon: Monitor,
    category: "user-devices",
    inStock: true,
    tags: ["monitor", "display", "professional"],
    features: ["32\" 4K UHD display", "HDR10 support", "99% Adobe RGB", "USB-C connectivity", "Height adjustable stand"]
  },
  
  {
    id: 9,
    title: "Zero Trust Access Solution",
    description: "Comprehensive zero trust network access solution for secure remote access.",
    image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹79,999",
    icon: Lock,
    category: "security",
    featured: true,
    inStock: true,
    tags: ["zero-trust", "security", "access"],
    features: ["Multi-factor authentication", "Least privilege access", "Real-time monitoring", "User behavior analytics", "Seamless VPN integration"]
  },
  {
    id: 10,
    title: "Data Loss Prevention",
    description: "Enterprise DLP solution to prevent data leakage and theft.",
    image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=2232&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹69,999",
    icon: Shield,
    category: "security",
    inStock: true,
    tags: ["DLP", "data-security", "protection"],
    features: ["Content awareness", "Endpoint protection", "Email monitoring", "Cloud application security", "Regulatory compliance"]
  },
  {
    id: 11,
    title: "Web Application Firewall",
    description: "Advanced WAF for protecting web applications from attacks.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹54,999",
    icon: Globe,
    category: "security",
    inStock: true,
    tags: ["WAF", "web-security", "firewall"],
    features: ["OWASP top 10 protection", "Bot mitigation", "API security", "Custom rule creation", "Real-time threat intelligence"]
  },
  
  {
    id: 12,
    title: "Migration Solution",
    description: "End-to-end migration services for cloud or datacenter transitions.",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹145,999",
    icon: ArrowRightLeft,
    category: "solutions",
    inStock: true,
    tags: ["migration", "cloud", "datacenter"],
    features: ["Assessment and planning", "Data migration", "Application modernization", "Minimal downtime", "Post-migration support"]
  },
  {
    id: 13,
    title: "vCISO Service",
    description: "Virtual Chief Information Security Officer services for organizations.",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹99,999",
    icon: UserCheck,
    category: "solutions",
    inStock: true,
    tags: ["vCISO", "security", "advisory"],
    features: ["Security strategy development", "Risk assessment", "Compliance management", "Security awareness training", "Incident response planning"]
  },
  {
    id: 14,
    title: "Security Audit Package",
    description: "Comprehensive security audit and compliance assessment.",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹89,999",
    icon: FileText,
    category: "solutions",
    featured: true,
    inStock: true,
    tags: ["audit", "compliance", "security"],
    features: ["Vulnerability assessment", "Penetration testing", "Compliance gap analysis", "Security control evaluation", "Remediation guidance"]
  },
  
  {
    id: 15,
    title: "Enterprise Routers",
    description: "High-performance routers for enterprise networks.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹35,999",
    icon: Network,
    category: "networking",
    inStock: true,
    tags: ["router", "networking", "connectivity"],
    features: ["10 Gbps throughput", "SD-WAN capabilities", "Advanced routing protocols", "Integrated security", "High availability"]
  },
  {
    id: 16,
    title: "Wireless Access Points",
    description: "Enterprise-grade wireless access points for reliable connectivity.",
    image: "https://images.unsplash.com/photo-1605146768851-eda79da39897?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹12,999",
    icon: Router,
    category: "networking",
    inStock: true,
    tags: ["wireless", "wifi", "networking"],
    features: ["Wi-Fi 6 support", "MIMO technology", "Mesh networking", "Enterprise-grade security", "Cloud management"]
  }
];
