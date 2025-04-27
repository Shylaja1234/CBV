
import { Button } from "@/components/ui/button";
import Card from "@/components/shared/Card";
import { motion } from "framer-motion";
import { ArrowRight, Server, HardDrive, Router, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    title: "Enterprise Servers",
    description: "High-performance servers for business-critical applications.",
    image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹89,999",
    icon: Server,
    delay: 0
  },
  {
    id: 2,
    title: "Network Devices",
    description: "Enterprise-grade routers, switches, and access points.",
    image: "https://images.unsplash.com/photo-1647423619058-8b3aa04a4c97?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹24,999",
    icon: Router,
    delay: 1
  },
  {
    id: 3,
    title: "Storage Solutions",
    description: "Scalable storage systems for growing data needs.",
    image: "https://images.unsplash.com/photo-1600267204026-d2162b128773?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹39,999",
    icon: HardDrive,
    delay: 2
  },
  {
    id: 4,
    title: "Security Appliances",
    description: "Hardware firewalls and security devices for robust protection.",
    image: "https://images.unsplash.com/photo-1563770557593-978789a237fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    price: "₹59,999",
    icon: Shield,
    delay: 3
  }
];

const Products = () => {
  return (
    <section id="products" className="py-20 relative">
      <div className="container px-4 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-block rounded-full bg-accent/10 backdrop-blur-sm px-4 py-1.5 mb-4">
              <span className="text-xs font-medium text-accent-foreground">Featured Products</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Premium IT Hardware & Solutions
            </h2>
            <p className="text-muted-foreground text-pretty">
              Explore our curated collection of enterprise-grade IT infrastructure products designed to elevate your business operations.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col" delay={product.delay}>
              <div className="relative h-52 w-full overflow-hidden rounded-lg mb-4">
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10" />
                <img 
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-3 left-3 z-20">
                  <div className="bg-white dark:bg-black/60 backdrop-blur-sm p-2 rounded-lg">
                    <product.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
              
              <div className="flex-grow">
                <h3 className="text-lg font-semibold mb-1">{product.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-lg">{product.price}</span>
                  <Link to={`/products/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      View details
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link to="/products">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4 text-foreground" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products;
