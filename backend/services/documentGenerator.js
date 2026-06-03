/**
 * Document Generator Service
 * Automatically generates 55+ cloud computing knowledge documents
 * covering AWS, Azure, GCP, Docker, Kubernetes, Cloud Security, and Virtualization.
 */

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

const DOCUMENTS_DIR = path.join(__dirname, '..', 'documents');

/**
 * All 55 cloud computing knowledge documents
 */
function getDocuments() {
  return [
    // ==================== AWS (15 documents) ====================
    {
      id: 'aws-ec2',
      title: 'Amazon EC2 (Elastic Compute Cloud)',
      category: 'AWS',
      subcategory: 'EC2',
      content: `Amazon Elastic Compute Cloud (Amazon EC2) is a web service that provides resizable compute capacity in the cloud. It is designed to make web-scale cloud computing easier for developers and system administrators. EC2 allows users to rent virtual computers on which they can run their own applications.

Key Features and Capabilities:
EC2 provides a wide variety of instance types optimized for different use cases. These include General Purpose instances (T3, M5) for balanced compute, memory, and networking; Compute Optimized instances (C5) for compute-intensive workloads; Memory Optimized instances (R5, X1) for memory-intensive applications; Storage Optimized instances (I3, D2) for high sequential read/write access; and Accelerated Computing instances (P3, G4) for machine learning and graphics workloads.

How EC2 Works:
When you launch an EC2 instance, you select an Amazon Machine Image (AMI) that contains the operating system and software configuration. You then choose an instance type that determines the hardware configuration. The instance runs in a Virtual Private Cloud (VPC) and can be assigned security groups to control inbound and outbound traffic. You can attach Elastic Block Store (EBS) volumes for persistent storage.

Instance Lifecycle:
EC2 instances go through several states: pending, running, stopping, stopped, shutting-down, and terminated. You can stop and restart instances without losing data on EBS volumes. When terminated, the instance and its associated resources are released.

Pricing Models:
EC2 offers several pricing options. On-Demand instances let you pay by the hour with no commitments. Reserved Instances provide up to 75% discount for 1-3 year commitments. Spot Instances let you bid on unused capacity at up to 90% discount. Savings Plans offer flexible pricing with commitments to consistent usage. Dedicated Hosts provide physical servers dedicated to your use.

Security and Networking:
EC2 instances can be launched in specific Availability Zones for high availability. You can use Elastic IP addresses for static public IPs, and Elastic Network Interfaces for additional network interfaces. Security groups act as virtual firewalls, and you can use key pairs for SSH access.

Auto Scaling and Load Balancing:
EC2 Auto Scaling automatically adjusts the number of instances based on demand. Combined with Elastic Load Balancing, it distributes incoming traffic across multiple instances. This ensures high availability and fault tolerance.

Use Cases:
EC2 is used for web hosting, application development, batch processing, high-performance computing, machine learning, gaming servers, and enterprise applications. Its flexibility makes it suitable for virtually any compute workload.

Best Practices:
Use the right instance type for your workload. Implement auto-scaling to handle variable demand. Use multiple Availability Zones for high availability. Regularly patch and update your instances. Monitor performance with CloudWatch. Use IAM roles instead of storing credentials on instances.`,
      metadata: { difficulty: 'beginner', tags: ['compute', 'virtual-machines', 'cloud-infrastructure', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-lambda',
      title: 'AWS Lambda - Serverless Computing',
      category: 'AWS',
      subcategory: 'Lambda',
      content: `AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. Lambda runs your code in response to events and automatically manages the underlying compute resources. You pay only for the compute time you consume — there is no charge when your code is not running.

How Lambda Works:
You upload your code as a Lambda function. AWS Lambda takes care of provisioning and managing the servers needed to run your code. You define triggers that invoke your function, such as HTTP requests through API Gateway, changes to data in S3 buckets, updates to DynamoDB tables, or messages in SQS queues.

Supported Runtimes:
Lambda supports multiple programming languages including Node.js, Python, Java, Go, C#, Ruby, and PowerShell. You can also bring your own runtime using custom layers or container images up to 10 GB.

Key Features:
Automatic scaling — Lambda automatically scales your application by running code in response to each trigger. Your code runs in parallel and processes each trigger individually, scaling precisely with the size of the workload. Event-driven architecture — Lambda integrates with over 200 AWS services and SaaS applications. Concurrency controls — you can set reserved concurrency to guarantee a maximum number of concurrent instances. Provisioned concurrency keeps functions initialized and ready to respond in milliseconds.

Lambda Layers:
Layers let you manage supplementary code and data separately from your function code. A layer is a ZIP archive that contains libraries, a custom runtime, or other dependencies. This promotes code sharing and separation of responsibilities.

Pricing:
Lambda pricing is based on the number of requests and the duration of execution. The free tier includes 1 million free requests and 400,000 GB-seconds of compute time per month. Beyond the free tier, you pay $0.20 per 1 million requests and $0.00001667 per GB-second.

Cold Starts:
When a Lambda function is invoked after not being used for a while, there is a delay called a cold start. This happens because AWS needs to set up a new execution environment. Provisioned concurrency eliminates cold starts by keeping functions warm.

Best Practices:
Keep functions small and focused. Minimize deployment package size. Use environment variables for configuration. Implement proper error handling and dead letter queues. Optimize memory allocation — more memory means more CPU. Use AWS X-Ray for tracing and debugging.

Common Use Cases:
Real-time file processing (S3 triggers), real-time stream processing (Kinesis), API backends (with API Gateway), data transformation, chatbots, IoT backends, scheduled tasks (CloudWatch Events), and web applications.

Comparison with EC2:
Unlike EC2, Lambda requires no server management, scales automatically, and charges per execution. EC2 is better for long-running processes, applications requiring specific OS configurations, or workloads needing consistent high compute power. Lambda is ideal for event-driven, short-duration workloads.`,
      metadata: { difficulty: 'intermediate', tags: ['serverless', 'functions', 'event-driven', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-s3',
      title: 'Amazon S3 (Simple Storage Service)',
      category: 'AWS',
      subcategory: 'S3',
      content: `Amazon Simple Storage Service (Amazon S3) is an object storage service offering industry-leading scalability, data availability, security, and performance. S3 is designed for 99.999999999% (11 nines) of durability and stores data for millions of customers around the world.

Core Concepts:
S3 stores data as objects within buckets. An object consists of the data itself, metadata, and a unique identifier (key). Buckets are containers for objects and must have globally unique names. Each object can be up to 5 TB in size, and there is no limit on the number of objects in a bucket.

Storage Classes:
S3 offers multiple storage classes for different use cases. S3 Standard for frequently accessed data with low latency and high throughput. S3 Intelligent-Tiering automatically moves data between access tiers. S3 Standard-IA for infrequently accessed data. S3 One Zone-IA for infrequently accessed data that doesn't require multi-AZ resilience. S3 Glacier Instant Retrieval for archive data with instant access. S3 Glacier Flexible Retrieval for archives with retrieval in minutes to hours. S3 Glacier Deep Archive for long-term archive with retrieval in 12-48 hours.

Security and Access Control:
S3 provides multiple mechanisms for access control. Bucket policies define permissions at the bucket level. Access Control Lists (ACLs) manage access at the object level. IAM policies control user-level access. S3 supports server-side encryption (SSE-S3, SSE-KMS, SSE-C) and client-side encryption. S3 Block Public Access prevents accidental public exposure.

Versioning and Lifecycle:
Versioning keeps multiple variants of an object in the same bucket, enabling recovery from accidental deletions. Lifecycle policies automate transitioning objects between storage classes and deleting expired objects.

Data Management Features:
S3 Replication enables automatic copying of objects across buckets in different AWS Regions (Cross-Region Replication) or within the same region (Same-Region Replication). S3 Object Lock provides write-once-read-many (WORM) protection. S3 Inventory provides scheduled reports of objects and metadata.

Performance:
S3 supports up to 5,500 GET/HEAD requests per second and 3,500 PUT/COPY/POST/DELETE requests per second per partitioned prefix. Multipart upload enables parallel uploads of large objects. S3 Transfer Acceleration uses CloudFront edge locations to accelerate uploads.

Use Cases:
Data lakes and big data analytics, backup and disaster recovery, static website hosting, content distribution, application hosting, media hosting and streaming, software delivery, and archival storage.

Best Practices:
Use appropriate storage classes to optimize costs. Enable versioning for critical data. Implement lifecycle policies. Use server-side encryption for data at rest. Enable S3 access logging for audit trails. Use VPC endpoints for private access.`,
      metadata: { difficulty: 'beginner', tags: ['storage', 'object-storage', 'data-lake', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-iam',
      title: 'AWS IAM (Identity and Access Management)',
      category: 'AWS',
      subcategory: 'IAM',
      content: `AWS Identity and Access Management (IAM) is a web service that helps you securely control access to AWS resources. IAM enables you to manage users, groups, roles, and their level of access to AWS resources. It is a fundamental security service that is used by virtually every AWS service.

Core Components:
IAM Users represent individual people or applications that interact with AWS. Each user has unique credentials. IAM Groups are collections of users that share the same permissions. IAM Roles are identities with specific permissions that can be assumed by users, applications, or AWS services. IAM Policies are JSON documents that define permissions.

Policy Types:
Identity-based policies are attached to users, groups, or roles. Resource-based policies are attached to resources like S3 buckets. Permission boundaries set the maximum permissions an identity can have. Organizations SCPs set maximum permissions for accounts. Session policies limit permissions for temporary sessions.

Policy Structure:
IAM policies use a JSON format with Effect (Allow/Deny), Action (specific API actions), Resource (ARN of the resource), and Condition (optional constraints). The principle of least privilege should be applied — granting only the permissions needed to perform a task.

Multi-Factor Authentication (MFA):
IAM supports MFA for additional security. Users must provide a second factor (like a code from a hardware or virtual MFA device) in addition to their password. MFA can be required for specific API calls or console access.

IAM Roles for Services:
AWS services can assume IAM roles to access other AWS resources. For example, an EC2 instance can assume a role to access S3, or a Lambda function can assume a role to write to DynamoDB. This eliminates the need to store credentials in applications.

Federation:
IAM supports identity federation, allowing users authenticated by external identity providers to access AWS resources. This includes SAML 2.0 federation with enterprise identity providers, Web Identity Federation with social identity providers (Google, Facebook, Amazon), and AWS SSO for centralized access management.

Best Practices:
Enable MFA for all users, especially the root account. Follow the principle of least privilege. Use IAM roles instead of sharing credentials. Regularly rotate credentials. Monitor IAM activity with CloudTrail. Use IAM Access Analyzer to identify unintended access. Never use the root account for daily tasks. Create individual IAM users for each person.

Security Tools:
IAM Access Analyzer identifies resources shared with external entities. IAM Credentials Report lists all users and their credential status. IAM Policy Simulator tests the effects of policies before applying them. AWS CloudTrail logs all IAM API calls for auditing.`,
      metadata: { difficulty: 'intermediate', tags: ['security', 'identity', 'access-management', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-vpc',
      title: 'Amazon VPC (Virtual Private Cloud)',
      category: 'AWS',
      subcategory: 'VPC',
      content: `Amazon Virtual Private Cloud (Amazon VPC) lets you provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network that you define. You have complete control over your virtual networking environment, including selection of IP address ranges, creation of subnets, and configuration of route tables and network gateways.

VPC Architecture:
A VPC spans all Availability Zones in a region. When you create a VPC, you specify a range of IPv4 addresses using CIDR notation (e.g., 10.0.0.0/16). You then divide this into subnets, which are associated with specific Availability Zones. Subnets can be public (with internet access via an Internet Gateway) or private (no direct internet access).

Key Components:
Subnets partition the VPC into segments. Route Tables control traffic routing within the VPC. Internet Gateways enable communication between VPC and the internet. NAT Gateways allow instances in private subnets to access the internet. Security Groups act as virtual firewalls at the instance level. Network ACLs provide subnet-level firewall rules. VPC Endpoints enable private connections to AWS services without internet access.

VPC Peering and Transit Gateway:
VPC Peering connects two VPCs allowing direct routing between them. Transit Gateway acts as a central hub connecting multiple VPCs and on-premises networks. This simplifies network architecture and reduces the number of connections needed.

VPN and Direct Connect:
AWS Site-to-Site VPN creates encrypted connections between your data center and VPC over the internet. AWS Direct Connect provides dedicated private connections from your premises to AWS, offering more consistent network performance and reduced bandwidth costs.

Flow Logs:
VPC Flow Logs capture information about IP traffic going to and from network interfaces in your VPC. Flow logs can be published to CloudWatch Logs, S3, or Kinesis Data Firehose for monitoring and troubleshooting.

Security:
Security Groups are stateful — if you allow inbound traffic, the response is automatically allowed. Network ACLs are stateless — you must explicitly allow both inbound and outbound traffic. Defense in depth is achieved by combining both.

Best Practices:
Use multiple Availability Zones for high availability. Place databases and application servers in private subnets. Use NAT Gateways for outbound internet access from private subnets. Implement VPC Flow Logs for monitoring. Use VPC Endpoints for AWS service access. Follow the principle of least privilege for security group rules.`,
      metadata: { difficulty: 'intermediate', tags: ['networking', 'security', 'infrastructure', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-rds',
      title: 'Amazon RDS (Relational Database Service)',
      category: 'AWS',
      subcategory: 'RDS',
      content: `Amazon Relational Database Service (Amazon RDS) is a managed relational database service that makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient and resizable capacity while automating time-consuming administration tasks such as hardware provisioning, database setup, patching, and backups.

Supported Database Engines:
RDS supports six popular database engines: Amazon Aurora (MySQL and PostgreSQL compatible), MySQL, MariaDB, PostgreSQL, Oracle Database, and Microsoft SQL Server. Amazon Aurora is AWS's cloud-native database offering up to 5x better performance than MySQL and 3x better than PostgreSQL.

Key Features:
Automated Backups enable point-in-time recovery for your database. Automated backups are retained for 1-35 days. Database Snapshots are user-initiated backups stored in S3. Multi-AZ Deployments provide high availability with automatic failover to a standby replica in a different Availability Zone. Read Replicas allow you to create read-only copies for read-heavy workloads, scaling read capacity.

Instance Classes:
RDS offers Standard instances (db.m5, db.m6g) for general-purpose workloads, Memory Optimized instances (db.r5, db.r6g) for memory-intensive applications, and Burstable instances (db.t3) for variable workloads with moderate CPU usage.

Storage:
RDS uses Amazon EBS for database storage. General Purpose SSD (gp2/gp3) provides balanced price and performance. Provisioned IOPS SSD (io1/io2) delivers high-performance I/O-intensive workloads. Magnetic storage is available for backward compatibility. Storage auto-scaling automatically increases storage when needed.

Security:
RDS instances run in a VPC for network isolation. Encryption at rest uses AWS KMS. Encryption in transit uses SSL/TLS. IAM database authentication allows authentication using IAM credentials instead of passwords. Security groups control network access.

Monitoring:
Amazon CloudWatch provides metrics for CPU utilization, storage, memory, I/O, and database connections. Enhanced Monitoring provides OS-level metrics. Performance Insights analyzes database performance and identifies bottlenecks.

Best Practices:
Use Multi-AZ for production workloads. Implement read replicas for read-heavy applications. Enable automated backups and test recovery procedures. Use appropriate instance and storage types. Monitor performance with CloudWatch and Performance Insights. Regularly apply security patches.`,
      metadata: { difficulty: 'intermediate', tags: ['database', 'relational', 'managed-service', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-route53',
      title: 'Amazon Route 53 - DNS Service',
      category: 'AWS',
      subcategory: 'Route53',
      content: `Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service. It is designed to give developers and businesses an extremely reliable and cost-effective way to route end users to internet applications by translating domain names into IP addresses.

Core Functions:
Route 53 performs three main functions: Domain Registration — you can register domain names directly through Route 53. DNS Routing — it translates domain names to IP addresses and routes internet traffic to your resources. Health Checking — it monitors the health of your resources and routes traffic only to healthy endpoints.

DNS Record Types:
Route 53 supports standard DNS record types including A (maps domain to IPv4), AAAA (maps domain to IPv6), CNAME (maps domain to another domain), MX (mail routing), NS (name server), TXT (text verification), SOA (start of authority), and Alias records (AWS-specific, maps to AWS resources like ELB, CloudFront, S3).

Routing Policies:
Simple Routing directs traffic to a single resource. Weighted Routing distributes traffic across resources based on assigned weights. Latency-Based Routing directs users to the lowest-latency endpoint. Failover Routing routes traffic to a standby resource when the primary is unhealthy. Geolocation Routing directs traffic based on user location. Geoproximity Routing routes based on geographic location with adjustable bias. Multivalue Answer Routing returns multiple healthy records randomly.

Health Checks:
Route 53 health checks monitor the availability of your endpoints. You can configure HTTP, HTTPS, or TCP health checks with customizable intervals and thresholds. Calculated health checks combine the results of multiple health checks. CloudWatch alarm health checks integrate with CloudWatch.

DNSSEC:
Route 53 supports DNSSEC (Domain Name System Security Extensions) for domain registration and DNS signing, protecting against DNS spoofing and man-in-the-middle attacks.

Pricing:
Route 53 charges for hosted zones ($0.50/month per hosted zone), queries (starting at $0.40 per million queries), health checks ($0.50-$0.75/month per health check), and domain registration (varies by TLD).

Use Cases:
Website hosting with custom domains, load balancing across regions, disaster recovery with failover routing, blue-green deployments, and global traffic management. Route 53 integrates seamlessly with other AWS services like ELB, CloudFront, and S3 static websites.`,
      metadata: { difficulty: 'intermediate', tags: ['dns', 'networking', 'routing', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-cloudfront',
      title: 'Amazon CloudFront - CDN Service',
      category: 'AWS',
      subcategory: 'CloudFront',
      content: `Amazon CloudFront is a fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally with low latency and high transfer speeds. CloudFront is integrated with AWS services and the AWS global network infrastructure.

How CloudFront Works:
CloudFront delivers content through a worldwide network of data centers called edge locations. When a user requests content, CloudFront routes the request to the edge location with the lowest latency. If the content is already cached at that edge location, CloudFront delivers it immediately. If not, CloudFront retrieves it from the origin (such as an S3 bucket or HTTP server) and caches it for future requests.

Edge Locations and Regional Edge Caches:
CloudFront has over 400 edge locations across 90+ cities in 48 countries. Regional Edge Caches sit between origin servers and edge locations, providing an additional caching layer for content that isn't popular enough to remain at edge locations but is accessed often enough to benefit from caching.

Origins:
CloudFront can use multiple origin types: S3 buckets for static content, EC2 instances or ELB for dynamic content, custom HTTP servers, MediaStore or MediaPackage for video streaming, and Lambda@Edge for serverless computing at the edge.

Distribution Types:
Web distributions deliver static and dynamic content over HTTP/HTTPS. RTMP distributions (deprecated) were used for streaming media. CloudFront supports HTTP/2 and HTTP/3 (QUIC) for improved performance.

Security:
CloudFront integrates with AWS Shield for DDoS protection, AWS WAF for web application firewall capabilities, and ACM for free SSL/TLS certificates. Origin Access Identity (OAI) restricts direct access to S3 buckets. Field-level encryption protects sensitive data throughout the system.

Lambda@Edge and CloudFront Functions:
Lambda@Edge lets you run code closer to users at CloudFront edge locations. CloudFront Functions are lightweight JavaScript functions for high-scale, latency-sensitive CDN customizations. Both enable request/response manipulation, A/B testing, URL rewrites, and header manipulation.

Pricing:
CloudFront pricing is based on data transfer out, number of HTTP/HTTPS requests, and invalidation requests. Pricing varies by geographic region. There is no minimum commitment, and the first 1 TB of data transfer out per month is free.

Use Cases:
Website acceleration, video streaming (both live and on-demand), API acceleration, software distribution, and security at the edge.`,
      metadata: { difficulty: 'intermediate', tags: ['cdn', 'content-delivery', 'caching', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-auto-scaling',
      title: 'AWS Auto Scaling',
      category: 'AWS',
      subcategory: 'Auto Scaling',
      content: `AWS Auto Scaling monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost. It provides a simple, powerful interface that lets you build scaling plans for resources including EC2 instances, ECS tasks, DynamoDB tables, and Aurora replicas.

How Auto Scaling Works:
Auto Scaling uses scaling policies to determine when to add or remove resources. It continuously monitors specified metrics (like CPU utilization, request count, or custom metrics) and triggers scaling actions when thresholds are crossed. The service maintains the desired number of instances and replaces unhealthy ones automatically.

Auto Scaling Components:
Launch Templates/Configurations define the instance configuration (AMI, instance type, key pair, security groups). Auto Scaling Groups define the minimum, maximum, and desired number of instances. Scaling Policies define when and how to scale.

Scaling Policy Types:
Target Tracking Scaling maintains a specific metric at a target value (e.g., keep CPU at 50%). Step Scaling adds/removes capacity in steps based on alarm thresholds. Simple Scaling adds/removes a fixed number of instances. Scheduled Scaling adds/removes capacity on a schedule. Predictive Scaling uses machine learning to predict future demand.

Health Checks:
Auto Scaling performs health checks to ensure instances are healthy. EC2 health checks verify instance status. ELB health checks verify application health through the load balancer. Custom health checks can be implemented using the Auto Scaling API.

Lifecycle Hooks:
Lifecycle hooks let you perform custom actions as instances launch or terminate. For example, you can configure instances, pull log files, or drain connections before termination. Instances are placed in a wait state until the hook is completed or times out.

Cooldown Periods:
Cooldown periods prevent Auto Scaling from launching or terminating additional instances before previous scaling activities take effect. This prevents rapid fluctuations in instance count.

Best Practices:
Use Target Tracking policies for simplicity. Set appropriate minimum and maximum capacity. Use multiple Availability Zones. Implement proper health checks. Use lifecycle hooks for graceful scaling. Monitor scaling activities with CloudWatch. Test scaling policies before production deployment.

Integration:
Auto Scaling integrates with ELB for traffic distribution, CloudWatch for monitoring and alarms, SNS for notifications, and CloudFormation for infrastructure as code. It supports scaling across multiple resource types simultaneously.`,
      metadata: { difficulty: 'intermediate', tags: ['scaling', 'high-availability', 'cost-optimization', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-elb',
      title: 'Elastic Load Balancing (ELB)',
      category: 'AWS',
      subcategory: 'Load Balancer',
      content: `Elastic Load Balancing (ELB) automatically distributes incoming application traffic across multiple targets, such as EC2 instances, containers, IP addresses, and Lambda functions. It can handle the varying load of your application traffic in a single Availability Zone or across multiple Availability Zones.

Types of Load Balancers:
Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) and is best suited for web applications. It supports content-based routing, host-based routing, path-based routing, and WebSocket connections. Network Load Balancer (NLB) operates at Layer 4 (TCP/UDP/TLS) and is designed for ultra-high performance. It can handle millions of requests per second with ultra-low latency. Gateway Load Balancer (GLB) operates at Layer 3 and is used for deploying third-party virtual appliances. Classic Load Balancer (CLB) is the legacy option supporting both Layer 4 and Layer 7 (not recommended for new applications).

Key Features:
Health Checks monitor the health of registered targets and route traffic only to healthy targets. Cross-Zone Load Balancing distributes traffic evenly across all targets in all enabled Availability Zones. SSL/TLS Termination offloads encryption/decryption from your application servers. Sticky Sessions route requests from the same client to the same target.

ALB-Specific Features:
Content-based routing routes requests to different target groups based on URL path or host header. Authentication integrates with Cognito or OIDC identity providers. Lambda targets allow routing to Lambda functions. HTTP/2 support enables multiplexed connections.

NLB-Specific Features:
Static IP addresses — each NLB gets one static IP per Availability Zone. Elastic IP support for fixed IPs. Preserves source IP address. TLS termination with centralized certificate management.

Target Groups:
Targets are registered in target groups. A target group routes requests to registered targets using the specified protocol and port. Target groups support instance, IP, Lambda, and ALB target types.

Security:
Load balancers are deployed in VPC subnets. Security groups control inbound/outbound traffic. SSL/TLS certificates from ACM can be attached for encrypted connections. Access logs record information about requests sent to the load balancer.

Pricing:
ELB pricing includes an hourly charge for each running load balancer and charges for data processed. ALB pricing is based on Load Balancer Capacity Units (LCUs). NLB pricing is based on Network Load Balancer Capacity Units (NLCUs).

Best Practices:
Use ALB for HTTP/HTTPS traffic. Use NLB for extreme performance or TCP/UDP traffic. Enable cross-zone load balancing. Configure health checks properly. Use SSL termination at the load balancer. Enable access logging for troubleshooting.`,
      metadata: { difficulty: 'intermediate', tags: ['networking', 'load-balancing', 'high-availability', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-ecs',
      title: 'Amazon ECS (Elastic Container Service)',
      category: 'AWS',
      subcategory: 'ECS',
      content: `Amazon Elastic Container Service (Amazon ECS) is a fully managed container orchestration service that helps you deploy, manage, and scale containerized applications. It deeply integrates with the AWS environment to provide an easy-to-use solution for running container workloads in the cloud.

How ECS Works:
ECS runs containers on a cluster of EC2 instances or using AWS Fargate (serverless). You define your application as a Task Definition, which specifies the Docker containers to run, their resources, networking, and other configurations. Tasks are instances of a task definition running on the cluster.

Key Concepts:
Clusters are logical groupings of tasks and services. Task Definitions are blueprints describing how Docker containers should launch, including image, CPU, memory, port mappings, and environment variables. Tasks are running instances of task definitions. Services maintain a desired number of tasks and integrate with load balancers.

Launch Types:
EC2 Launch Type — you manage the EC2 instances that form the cluster. You have control over instance types, AMIs, and capacity. Fargate Launch Type — serverless option where AWS manages the infrastructure. You just specify CPU and memory requirements, define networking, and launch your containers.

Networking:
ECS supports awsvpc networking mode, which gives each task its own elastic network interface (ENI) and private IP address. This enables tasks to use security groups and communicate within a VPC like EC2 instances.

Service Discovery:
AWS Cloud Map integration enables automatic service discovery. Services register themselves and can discover other services by name. This is essential for microservices architectures.

Task Placement:
ECS provides strategies for placing tasks across container instances: binpack (minimizes instances used), spread (distributes across Availability Zones), and random. Placement constraints can restrict tasks to specific instance types or attributes.

Integration with AWS Services:
ECS integrates with ELB for load balancing, ECR for container image storage, CloudWatch for monitoring and logging, IAM for task-level security, Secrets Manager for managing sensitive data, and App Mesh for service mesh capabilities.

Use Cases:
Microservices architecture, batch processing, machine learning model deployment, application migration from on-premises to cloud, and CI/CD pipeline automation.

Best Practices:
Use Fargate for simpler management. Define appropriate resource limits. Use service auto-scaling. Implement health checks. Store images in ECR. Use task IAM roles for security. Monitor with CloudWatch Container Insights.`,
      metadata: { difficulty: 'advanced', tags: ['containers', 'orchestration', 'microservices', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-eks',
      title: 'Amazon EKS (Elastic Kubernetes Service)',
      category: 'AWS',
      subcategory: 'EKS',
      content: `Amazon Elastic Kubernetes Service (Amazon EKS) is a managed Kubernetes service that makes it easy to run Kubernetes on AWS without needing to install, operate, and maintain your own Kubernetes control plane. EKS runs upstream Kubernetes, so applications running on EKS are fully compatible with standard Kubernetes environments.

How EKS Works:
EKS manages the Kubernetes control plane for you, including the API server and etcd persistence layer. The control plane runs across multiple Availability Zones for high availability. You manage the worker nodes where your applications run, either using EC2 instances, Fargate, or EKS Anywhere for on-premises deployment.

Node Types:
Managed Node Groups — EKS automatically provisions and manages EC2 instances. You specify the instance type, and EKS handles provisioning, updating, and scaling. Self-Managed Nodes — you manually create and manage EC2 instances and join them to the cluster. Fargate — serverless compute for Kubernetes pods, eliminating the need to manage nodes entirely.

Networking:
EKS uses the Amazon VPC CNI plugin for Kubernetes, which assigns VPC IP addresses directly to pods. This provides native VPC networking for pod-to-pod communication. EKS supports Kubernetes Network Policies through Calico integration.

Security:
EKS integrates with IAM for authentication using the aws-iam-authenticator. Kubernetes RBAC provides fine-grained access control. Pod Security Standards enforce security policies. Secrets can be managed using AWS Secrets Manager or Kubernetes secrets encrypted with KMS.

Storage:
EKS supports multiple storage options through the Container Storage Interface (CSI). Amazon EBS CSI driver for block storage. Amazon EFS CSI driver for shared file storage. Amazon FSx for high-performance file systems.

Add-ons:
EKS supports managed add-ons including CoreDNS (DNS resolution), kube-proxy (network proxying), Amazon VPC CNI (networking), and AWS Load Balancer Controller (ALB/NLB integration).

Monitoring and Logging:
EKS integrates with CloudWatch Container Insights for monitoring. Control plane logs can be sent to CloudWatch Logs. Prometheus and Grafana can be deployed for custom monitoring. AWS Distro for OpenTelemetry provides observability.

Use Cases:
Running Kubernetes workloads in the cloud, hybrid cloud deployments, microservices architectures, batch processing, machine learning workloads with Kubeflow, and multi-cloud Kubernetes management.

Best Practices:
Use managed node groups for easier management. Implement cluster auto-scaler. Use Fargate for burstable workloads. Follow Kubernetes RBAC best practices. Enable control plane logging. Use namespace isolation for multi-tenancy. Regularly update Kubernetes versions.`,
      metadata: { difficulty: 'advanced', tags: ['kubernetes', 'containers', 'orchestration', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-cloudwatch',
      title: 'Amazon CloudWatch - Monitoring Service',
      category: 'AWS',
      subcategory: 'CloudWatch',
      content: `Amazon CloudWatch is a monitoring and management service built for developers, system operators, site reliability engineers, and IT managers. CloudWatch provides data and actionable insights to monitor applications, respond to system-wide performance changes, and optimize resource utilization.

Core Features:
CloudWatch Metrics collect and track metrics from AWS resources and custom applications. CloudWatch Alarms watch metrics and trigger actions when thresholds are crossed. CloudWatch Logs collect, monitor, and store log files from AWS resources. CloudWatch Events (now EventBridge) respond to state changes in AWS resources. CloudWatch Dashboards create customizable visual displays of metrics.

Metrics:
AWS services automatically send metrics to CloudWatch. EC2 sends CPU utilization, network I/O, and disk I/O. ELB sends request counts and latency. RDS sends database connections and storage. Custom metrics can be published using the CloudWatch API or CloudWatch Agent.

CloudWatch Alarms:
Alarms evaluate metrics over a specified time period and trigger actions. Actions can include sending SNS notifications, executing Auto Scaling policies, or invoking Lambda functions. Alarm states include OK, ALARM, and INSUFFICIENT_DATA. Composite alarms combine multiple alarms using logical operators.

CloudWatch Logs:
Log Groups organize related log streams. Log Streams represent a sequence of log events from a single source. Metric Filters extract metric observations from log data. Log Insights provides interactive queries for analyzing log data. Subscription Filters stream log data to Lambda, Elasticsearch, or Kinesis.

CloudWatch Agent:
The unified CloudWatch Agent collects metrics and logs from EC2 instances and on-premises servers. It can collect system-level metrics (memory, disk, CPU), custom metrics, and log files. The agent supports both Linux and Windows.

Container Insights:
CloudWatch Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications running on ECS, EKS, and Kubernetes. It provides performance data at the cluster, service, task, and pod levels.

Anomaly Detection:
CloudWatch Anomaly Detection uses machine learning to continuously analyze metrics and detect anomalous behavior. It creates a model of expected behavior and generates alarms when metrics deviate from the model.

Pricing:
CloudWatch offers a free tier with 10 custom metrics, 10 alarms, and 5 GB of log data ingestion per month. Beyond the free tier, pricing is based on metrics, alarms, API requests, logs ingested, and dashboards.

Best Practices:
Create dashboards for critical metrics. Set up alarms for key performance indicators. Use CloudWatch Logs for centralized logging. Implement CloudWatch Agent for detailed system metrics. Use Log Insights for troubleshooting. Enable anomaly detection for critical metrics.`,
      metadata: { difficulty: 'intermediate', tags: ['monitoring', 'logging', 'observability', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-elastic-beanstalk',
      title: 'AWS Elastic Beanstalk',
      category: 'AWS',
      subcategory: 'Elastic Beanstalk',
      content: `AWS Elastic Beanstalk is an easy-to-use service for deploying and scaling web applications and services. You simply upload your code, and Elastic Beanstalk automatically handles the deployment, from capacity provisioning, load balancing, and auto-scaling to application health monitoring.

How Elastic Beanstalk Works:
You create an application, upload a version of your code, and Elastic Beanstalk provisions the AWS resources needed to run it. This includes EC2 instances, load balancers, auto-scaling groups, security groups, and databases. You retain full control over the underlying resources.

Supported Platforms:
Elastic Beanstalk supports applications written in Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker. You can also use custom platforms for any other language or framework.

Environment Types:
Web Server Environment runs a web application that handles HTTP requests. Worker Environment processes background tasks from an SQS queue. Each environment runs a single application version, but you can create multiple environments for development, staging, and production.

Configuration:
Elastic Beanstalk provides configuration options for instance type, scaling triggers, load balancer settings, database configuration, environment variables, and deployment policies. Configuration can be managed through the console, CLI, configuration files (.ebextensions), or saved configurations.

Deployment Policies:
All at once — deploys to all instances simultaneously (fastest but causes downtime). Rolling — deploys in batches, maintaining capacity. Rolling with additional batch — launches new instances before removing old ones. Immutable — launches a completely new set of instances. Blue/Green — creates a new environment and swaps CNAMEs.

Managed Updates:
Elastic Beanstalk can automatically apply platform updates during a configurable maintenance window. This keeps your environment running on the latest platform version with security patches.

Monitoring:
Elastic Beanstalk provides enhanced health reporting with color-coded status indicators (Green, Yellow, Red, Grey). It monitors instance health, application health, and environment health. CloudWatch metrics and alarms are automatically configured.

Cost:
There is no additional charge for Elastic Beanstalk. You pay only for the AWS resources used (EC2, ELB, RDS, etc.).

Best Practices:
Use environment configurations for consistency. Implement blue/green deployments for zero-downtime. Use .ebextensions for customization. Monitor application health actively. Use managed platform updates. Store application state externally. Test in a staging environment before production.`,
      metadata: { difficulty: 'beginner', tags: ['paas', 'deployment', 'managed-service', 'aws'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'aws-security',
      title: 'AWS Security - Comprehensive Overview',
      category: 'AWS',
      subcategory: 'AWS Security',
      content: `AWS Security encompasses a comprehensive set of tools, services, and best practices designed to protect your data, applications, and infrastructure in the AWS cloud. AWS follows a shared responsibility model where AWS secures the cloud infrastructure, and customers secure their workloads within the cloud.

Shared Responsibility Model:
AWS is responsible for security OF the cloud — physical infrastructure, networking hardware, hypervisor, and managed services. Customers are responsible for security IN the cloud — operating systems, applications, data, identity management, network configuration, and firewall rules.

Identity and Access Management:
AWS IAM provides centralized access control. AWS Organizations enables multi-account management with Service Control Policies. AWS SSO provides single sign-on across AWS accounts. Amazon Cognito manages user authentication for applications.

Network Security:
VPC provides network isolation. Security Groups and NACLs control traffic flow. AWS WAF protects against web exploits. AWS Shield provides DDoS protection (Standard is free, Advanced offers enhanced protection). AWS Firewall Manager centrally manages firewall rules.

Data Protection:
AWS KMS manages encryption keys. AWS CloudHSM provides hardware security modules. S3 server-side encryption protects data at rest. ACM manages SSL/TLS certificates. AWS Secrets Manager stores and rotates secrets. AWS Macie discovers and protects sensitive data.

Detection and Monitoring:
Amazon GuardDuty provides intelligent threat detection using machine learning. AWS Security Hub aggregates security findings from multiple services. Amazon Inspector assesses applications for vulnerabilities. AWS CloudTrail logs API calls for audit trails. Amazon Detective investigates security issues.

Compliance:
AWS Artifact provides compliance reports and agreements. AWS Config tracks resource configurations and compliance. AWS Audit Manager automates evidence collection for audits. AWS maintains compliance certifications including SOC, PCI DSS, HIPAA, ISO 27001, and FedRAMP.

Incident Response:
AWS provides services and features to support incident response: CloudTrail for investigation, VPC Flow Logs for network analysis, CloudWatch for monitoring, and AWS Systems Manager for remediation.

Best Practices:
Enable MFA on all accounts. Use the principle of least privilege. Encrypt data at rest and in transit. Enable CloudTrail in all regions. Use AWS Config rules for compliance. Implement network segmentation. Regularly rotate credentials. Monitor with GuardDuty and Security Hub. Conduct regular security assessments.`,
      metadata: { difficulty: 'advanced', tags: ['security', 'compliance', 'best-practices', 'aws'], lastUpdated: '2024-01-15' }
    },

    // ==================== AZURE (10 documents) ====================
    {
      id: 'azure-vms',
      title: 'Azure Virtual Machines',
      category: 'Azure',
      subcategory: 'Azure VMs',
      content: `Azure Virtual Machines (VMs) provide on-demand, scalable computing resources in Microsoft Azure. They give you the flexibility of virtualization without having to buy and maintain physical hardware. Azure VMs support Windows and Linux operating systems with a wide variety of configurations.

VM Series and Sizes:
Azure offers various VM series optimized for different workloads. A-series for entry-level and dev/test workloads. B-series for burstable, cost-effective workloads with variable CPU usage. D-series for general-purpose computing with balanced CPU-to-memory ratio. E-series for memory-intensive applications. F-series for compute-intensive workloads. G-series for large memory and storage. H-series for high-performance computing (HPC). L-series for storage-optimized workloads. M-series for very large memory databases. N-series for GPU-enabled computing including AI and deep learning.

Availability Options:
Availability Sets distribute VMs across fault domains and update domains within a data center, providing 99.95% SLA. Availability Zones distribute VMs across physically separated zones within a region, providing 99.99% SLA. Virtual Machine Scale Sets automatically create and manage a group of load-balanced VMs.

Disk Options:
Azure Managed Disks simplify disk management. Ultra Disks provide the highest performance for I/O-intensive workloads. Premium SSD v2 offers flexible configuration. Premium SSD for production workloads. Standard SSD for dev/test. Standard HDD for backup and archival.

Networking:
VMs are deployed in Virtual Networks (VNets) with subnets. Network Security Groups (NSGs) filter traffic. Public IP addresses enable internet connectivity. Load balancers distribute traffic. Azure Bastion provides secure RDP/SSH access without public IPs.

Security:
Azure Defender for servers provides threat protection. Just-in-time VM access reduces attack surface. Disk encryption protects data at rest. Azure Active Directory integration for authentication. Confidential computing with secure enclaves.

Pricing:
Pay-as-you-go charges per second of usage. Reserved VM Instances offer up to 72% savings with 1-3 year commitments. Spot VMs provide up to 90% discount for interruptible workloads. Azure Hybrid Benefit allows using existing Windows Server licenses.

Best Practices:
Choose the right VM size for your workload. Use availability zones for high availability. Implement Azure Backup for disaster recovery. Use Managed Disks for simplified management. Apply security best practices including NSGs and disk encryption. Monitor with Azure Monitor.`,
      metadata: { difficulty: 'beginner', tags: ['compute', 'virtual-machines', 'infrastructure', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-storage',
      title: 'Azure Storage Services',
      category: 'Azure',
      subcategory: 'Azure Storage',
      content: `Azure Storage is Microsoft's cloud storage solution for modern data storage scenarios. Azure Storage offers a massively scalable object store, a messaging store, a NoSQL store, and a file system service. It provides durability, high availability, and massive scalability.

Storage Services:
Azure Blob Storage is optimized for storing massive amounts of unstructured data like text, images, and video. Azure Files offers fully managed file shares accessible via SMB and NFS protocols. Azure Queue Storage provides reliable messaging between application components. Azure Table Storage stores structured NoSQL data. Azure Disk Storage provides block-level storage for Azure VMs.

Blob Storage Access Tiers:
Hot tier for frequently accessed data with lowest access costs. Cool tier for infrequently accessed data stored for at least 30 days. Cold tier for infrequently accessed data stored for at least 90 days. Archive tier for rarely accessed data stored for at least 180 days with flexible retrieval latency.

Redundancy Options:
Locally Redundant Storage (LRS) replicates data three times within a single data center. Zone-Redundant Storage (ZRS) replicates across three availability zones. Geo-Redundant Storage (GRS) replicates to a secondary region. Read-Access Geo-Redundant Storage (RA-GRS) provides read access to the secondary region. Geo-Zone-Redundant Storage (GZRS) combines ZRS and GRS.

Security:
All data is encrypted at rest using Storage Service Encryption (SSE). Microsoft-managed keys, customer-managed keys in Key Vault, or customer-provided keys are supported. Shared Access Signatures (SAS) provide delegated access. Azure Active Directory integration for RBAC. Private endpoints enable private network access.

Data Management:
Lifecycle management policies automatically tier or delete data based on rules. Blob versioning maintains previous versions of objects. Soft delete enables recovery of deleted data. Immutable blob storage provides WORM compliance. Object replication copies blobs asynchronously between storage accounts.

Performance:
Premium storage accounts use SSDs for low-latency access. Standard accounts use HDDs. Azure Content Delivery Network integrates with Blob Storage for global content distribution. Data Lake Storage Gen2 combines blob storage features with a hierarchical namespace for big data analytics.

Pricing:
Storage pricing varies by redundancy option, access tier, and region. You pay for storage capacity, transactions, data retrieval, and data transfer. Reserved capacity offers up to 38% savings with 1-3 year commitments.`,
      metadata: { difficulty: 'beginner', tags: ['storage', 'blob', 'file-storage', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-functions',
      title: 'Azure Functions - Serverless Computing',
      category: 'Azure',
      subcategory: 'Azure Functions',
      content: `Azure Functions is a serverless compute service that lets you run event-driven code without having to explicitly provision or manage infrastructure. It enables you to run small pieces of code (functions) in the cloud without worrying about the application infrastructure.

How Azure Functions Work:
Functions are triggered by events such as HTTP requests, timer schedules, queue messages, blob storage changes, Event Grid events, or Cosmos DB changes. The runtime manages the execution environment, scaling, and resource allocation automatically.

Supported Languages:
Azure Functions supports C#, JavaScript, TypeScript, Python, Java, PowerShell, Go, Rust, and custom handlers for any language. Functions can run on .NET, Node.js, Python, Java, or PowerShell runtimes.

Hosting Plans:
Consumption Plan scales automatically and charges only for execution time. Functions scale from 0 to hundreds of instances. Premium Plan provides pre-warmed instances to eliminate cold starts, VNet connectivity, and unlimited execution duration. Dedicated (App Service) Plan runs functions on dedicated VMs with full App Service features.

Durable Functions:
Durable Functions is an extension that lets you write stateful functions in a serverless environment. Patterns include function chaining, fan-out/fan-in, async HTTP APIs, monitoring, and human interaction. Orchestrator functions coordinate the execution of activity functions.

Bindings:
Input bindings read data from a data source. Output bindings write data to a data source. Trigger bindings define how a function is invoked. Bindings simplify integration with services like Cosmos DB, Service Bus, Event Hubs, Storage, and SignalR.

Security:
Functions support Azure AD authentication, API keys, and managed identities. VNet integration enables access to private resources. Access restrictions and IP filtering control who can invoke functions.

Monitoring:
Application Insights provides monitoring, logging, and diagnostics. Live metrics stream shows real-time performance. Log streaming enables real-time log viewing. Distributed tracing tracks requests across services.

Best Practices:
Keep functions small and focused. Use durable functions for complex orchestrations. Minimize cold starts with Premium Plan. Use managed identities for authentication. Implement proper error handling and retries. Avoid long-running functions on the Consumption Plan.`,
      metadata: { difficulty: 'intermediate', tags: ['serverless', 'functions', 'event-driven', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-networking',
      title: 'Azure Networking Services',
      category: 'Azure',
      subcategory: 'Azure Networking',
      content: `Azure Networking provides a comprehensive set of networking services that enable you to connect, protect, deliver, and monitor your cloud resources. These services form the foundation of any Azure infrastructure deployment.

Virtual Network (VNet):
Azure VNet is the fundamental building block for private networks in Azure. VNets enable Azure resources to securely communicate with each other, the internet, and on-premises networks. You define address spaces using CIDR notation and create subnets to segment the network.

Network Security:
Network Security Groups (NSGs) filter network traffic to and from Azure resources. Each NSG contains security rules that allow or deny inbound and outbound traffic. Application Security Groups (ASGs) logically group VMs for simplified security rule management. Azure Firewall is a managed, cloud-based network security service.

Load Balancing:
Azure Load Balancer distributes inbound traffic at Layer 4 (TCP/UDP). Azure Application Gateway operates at Layer 7 with URL-based routing, SSL termination, and WAF. Azure Front Door provides global HTTP load balancing with URL-based routing, SSL offloading, and caching. Azure Traffic Manager uses DNS-based traffic routing for global distribution.

Connectivity:
VNet Peering connects VNets within or across regions with low-latency, high-bandwidth connections. VPN Gateway creates encrypted connections between Azure VNets and on-premises networks. ExpressRoute provides dedicated private connections from on-premises to Azure with guaranteed bandwidth. Azure Virtual WAN connects branches, VNets, and users through a unified hub.

DNS:
Azure DNS hosts DNS domains and manages DNS records using Azure infrastructure. Azure Private DNS provides DNS resolution within virtual networks. Azure DNS Private Resolver enables conditional forwarding between Azure and on-premises.

Content Delivery:
Azure CDN caches content at strategically placed edge locations worldwide. Azure Front Door combines CDN, global load balancing, and application acceleration. Both support custom domains and HTTPS.

Network Monitoring:
Azure Network Watcher provides monitoring, diagnostics, and analytics for Azure networks. It includes packet capture, connection troubleshooting, flow logs, and network topology visualization.

Best Practices:
Use hub-spoke network topology. Implement NSGs on all subnets. Use Azure Firewall for centralized network security. Enable DDoS protection. Use private endpoints for Azure services. Monitor network traffic with Network Watcher.`,
      metadata: { difficulty: 'intermediate', tags: ['networking', 'vnet', 'load-balancing', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-security',
      title: 'Azure Security Services',
      category: 'Azure',
      subcategory: 'Azure Security',
      content: `Azure Security encompasses a wide range of services, tools, and features designed to protect your cloud infrastructure, applications, and data. Microsoft invests over $1 billion annually in cybersecurity research and development.

Microsoft Defender for Cloud:
Defender for Cloud is a unified infrastructure security management system that strengthens the security posture of your data centers and provides advanced threat protection. It provides security recommendations, Secure Score, threat protection alerts, and regulatory compliance dashboards.

Azure Security Center Features:
Continuous assessment identifies vulnerabilities and misconfigurations. Security recommendations provide actionable steps to improve security. Secure Score quantifies your security posture. Just-in-time VM access reduces exposure to attacks. Adaptive application controls whitelist approved applications.

Identity Security:
Azure Active Directory provides identity and access management. Conditional Access policies enforce access controls based on conditions. Privileged Identity Management (PIM) manages, controls, and monitors access to critical resources. Identity Protection detects potential identity vulnerabilities.

Network Security:
Azure Firewall provides stateful network filtering. Azure DDoS Protection defends against distributed denial-of-service attacks. Web Application Firewall (WAF) protects web applications from common exploits. Azure Private Link enables private access to Azure services.

Data Security:
Azure Key Vault safeguards cryptographic keys, secrets, and certificates. Azure Information Protection classifies and protects documents and emails. Transparent Data Encryption (TDE) encrypts databases at rest. Always Encrypted protects sensitive data in Azure SQL Database.

Threat Protection:
Microsoft Sentinel is a cloud-native SIEM and SOAR solution. Azure Defender provides advanced threat detection across multiple services. Advanced Threat Analytics detects suspicious activities. Microsoft Defender for Identity protects hybrid identity environments.

Compliance:
Azure Policy enforces organizational standards and compliance. Azure Blueprints packages policies, role assignments, and ARM templates. Compliance Manager provides compliance assessments. Azure maintains 100+ compliance certifications including ISO 27001, SOC 2, GDPR, and HIPAA.

Best Practices:
Enable Defender for Cloud on all subscriptions. Use Azure AD with MFA. Implement network segmentation. Encrypt all data at rest and in transit. Use Key Vault for secret management. Enable Microsoft Sentinel for threat detection. Conduct regular security reviews.`,
      metadata: { difficulty: 'advanced', tags: ['security', 'compliance', 'threat-protection', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-sql',
      title: 'Azure SQL Database',
      category: 'Azure',
      subcategory: 'Azure SQL',
      content: `Azure SQL Database is a fully managed platform-as-a-service (PaaS) database engine that handles most database management functions such as upgrading, patching, backups, and monitoring without user involvement. It is built on the latest stable version of the SQL Server database engine.

Deployment Options:
Single Database is a fully managed, isolated database. Elastic Pool shares resources among multiple databases for cost optimization. Managed Instance provides near 100% compatibility with on-premises SQL Server, making migration straightforward.

Service Tiers:
General Purpose (Standard) offers balanced compute and storage for general business workloads. Business Critical (Premium) provides high-performance, low-latency I/O for mission-critical applications. Hyperscale offers highly scalable storage (up to 100 TB) and compute for large databases.

Purchasing Models:
vCore model lets you choose the number of vCores, amount of memory, and storage. DTU (Database Transaction Unit) model bundles compute, storage, and I/O into predefined packages. Serverless compute tier auto-scales based on workload demand and pauses when inactive.

High Availability:
Built-in high availability with 99.99% SLA. General Purpose tier uses remote storage with failover. Business Critical tier uses Always On availability groups with local SSD storage. Zone-redundant configuration distributes replicas across availability zones.

Security:
Advanced Threat Protection detects anomalous activities. Vulnerability Assessment identifies potential database vulnerabilities. Data Discovery and Classification labels sensitive data. Dynamic Data Masking limits sensitive data exposure. Row-Level Security controls row-level access. TDE encrypts data at rest.

Intelligent Performance:
Automatic tuning identifies and fixes performance issues. Query Performance Insight provides query analysis. Intelligent Insights uses AI to detect performance anomalies. Database Advisor provides optimization recommendations.

Backup and Recovery:
Automated backups with point-in-time restore for up to 35 days. Long-term backup retention stores backups for up to 10 years. Geo-restore recovers databases from geo-redundant backups. Active geo-replication provides readable secondary databases in different regions.

Best Practices:
Use elastic pools for multi-tenant applications. Enable Advanced Threat Protection. Implement geo-replication for disaster recovery. Use Azure AD authentication. Monitor performance with Intelligent Insights. Optimize queries regularly.`,
      metadata: { difficulty: 'intermediate', tags: ['database', 'sql', 'relational', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-aks',
      title: 'Azure Kubernetes Service (AKS)',
      category: 'Azure',
      subcategory: 'Azure Kubernetes Service',
      content: `Azure Kubernetes Service (AKS) simplifies deploying a managed Kubernetes cluster in Azure by offloading the operational overhead to Azure. As a hosted Kubernetes service, Azure handles critical tasks like health monitoring and maintenance. The Kubernetes masters are managed by Azure at no cost — you only pay for the agent nodes.

AKS Architecture:
The control plane includes the Kubernetes API server, scheduler, etcd, and controller manager — all managed by Azure. Worker nodes run in your subscription as Azure VMs within a Virtual Machine Scale Set. Each node runs a kubelet agent, kube-proxy, and container runtime.

Networking Options:
Kubenet creates a virtual network with basic networking for simple deployments. Azure CNI assigns VNet IP addresses directly to pods for advanced networking. Azure CNI Overlay provides scalable pod networking without exhausting VNet IP addresses. BYO CNI supports third-party networking plugins.

Node Pools:
System node pools host critical system pods. User node pools host your application workloads. You can have multiple node pools with different VM sizes, scaling settings, and configurations. Virtual nodes integrate with Azure Container Instances for rapid, serverless scaling.

Scaling:
Cluster Autoscaler adjusts the number of nodes based on pending pod scheduling. Horizontal Pod Autoscaler scales the number of pods based on CPU/memory utilization or custom metrics. KEDA (Kubernetes Event-Driven Autoscaling) scales based on external event sources.

Security:
Azure AD integration for authentication. Azure RBAC for authorization. Pod-managed identities (Azure AD Workload Identity) for service-to-service authentication. Azure Policy for Kubernetes enforces cluster governance. Network Policies control pod-to-pod traffic.

Monitoring:
Azure Monitor Container Insights collects performance metrics and logs. Prometheus integration for metrics collection. Grafana for visualization. Azure Log Analytics for log querying.

CI/CD Integration:
AKS integrates with Azure DevOps, GitHub Actions, and GitOps tools like Flux. Azure Container Registry provides private image storage with geo-replication and vulnerability scanning.

Best Practices:
Use managed identities instead of service principals. Implement network policies. Use pod disruption budgets for availability. Enable cluster auto-scaling. Use Azure Policy for governance. Regularly upgrade Kubernetes versions. Separate system and user workloads into different node pools.`,
      metadata: { difficulty: 'advanced', tags: ['kubernetes', 'containers', 'orchestration', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-ad',
      title: 'Azure Active Directory (Microsoft Entra ID)',
      category: 'Azure',
      subcategory: 'Azure Active Directory',
      content: `Azure Active Directory (Azure AD), now part of Microsoft Entra, is Microsoft's cloud-based identity and access management service. It helps employees sign in and access resources including Microsoft 365, the Azure portal, thousands of SaaS applications, and custom applications.

Core Features:
Single Sign-On (SSO) enables users to access all applications with one set of credentials. Multi-Factor Authentication (MFA) adds a second layer of security. Conditional Access policies enforce access controls based on user, device, location, and risk signals. Self-service password reset reduces IT support burden.

Identity Types:
Users — employees, guests, and B2B collaboration partners. Groups — security groups and Microsoft 365 groups for organizing users. Applications — service principals representing applications. Managed Identities — automatically managed identities for Azure resources. Devices — joined or registered devices.

Azure AD Editions:
Free includes basic identity management and SSO for up to 10 apps. Premium P1 adds conditional access, dynamic groups, and self-service password reset. Premium P2 adds Identity Protection, Privileged Identity Management, and access reviews.

Authentication Methods:
Password-based, passwordless (FIDO2 security keys, Microsoft Authenticator, Windows Hello), certificate-based, and token-based authentication are supported. Azure AD supports OAuth 2.0, OpenID Connect, SAML 2.0, and WS-Federation protocols.

Conditional Access:
Conditional Access policies are if-then statements: IF a user wants to access a resource, THEN they must complete an action. Policies can require MFA, compliant devices, specific locations, approved applications, or risk-based responses.

B2B and B2C:
Azure AD B2B enables collaboration with external partners using their own identities. Azure AD B2C provides customer-facing identity management with social account login (Google, Facebook, Apple), custom branded sign-up/sign-in experiences, and progressive profiling.

Hybrid Identity:
Azure AD Connect synchronizes on-premises AD with Azure AD. Password Hash Synchronization, Pass-Through Authentication, and Federation provide different authentication options for hybrid environments.

Best Practices:
Enable MFA for all users. Implement conditional access policies. Use privileged identity management for admin roles. Configure identity protection policies. Review access regularly. Use managed identities for Azure resources. Monitor sign-in logs and audit logs.`,
      metadata: { difficulty: 'intermediate', tags: ['identity', 'authentication', 'access-management', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-monitor',
      title: 'Azure Monitor',
      category: 'Azure',
      subcategory: 'Azure Monitor',
      content: `Azure Monitor is a comprehensive monitoring solution for collecting, analyzing, and responding to monitoring data from cloud and on-premises environments. It helps you understand how your applications are performing and proactively identifies issues affecting them.

Data Sources:
Azure Monitor collects data from multiple sources: Applications (Application Insights), Operating Systems (VM agents), Azure Resources (platform metrics and logs), Azure Subscriptions (service health), Azure Tenant (Azure AD logs), and Custom Sources (APIs and agents).

Data Types:
Metrics are numerical values collected at regular intervals describing aspects of a system. They are stored in a time-series database. Logs are records of events with rich structured or free-text data. They are stored in a Log Analytics workspace.

Azure Monitor Components:
Application Insights monitors live web applications and detects performance anomalies. Log Analytics collects and analyzes log data using the Kusto Query Language (KQL). Alerts notify you when conditions are met. Dashboards visualize monitoring data. Workbooks combine text, log queries, metrics, and parameters into interactive reports.

Metrics Explorer:
Metrics Explorer lets you interactively analyze metrics data. You can chart multiple metrics, apply filters and splitting, pin charts to dashboards, and configure advanced visualizations.

Log Analytics and KQL:
Log Analytics provides a rich query environment using Kusto Query Language (KQL). KQL enables complex queries to filter, aggregate, join, and visualize log data. Example: requests | where duration > 500 | summarize count() by name.

Alerts:
Metric alerts trigger when a metric crosses a threshold. Log alerts trigger based on log query results. Activity log alerts trigger on subscription-level events. Smart detection automatically detects performance anomalies. Action groups define notification and automation responses.

Autoscale:
Azure Monitor Autoscale automatically adjusts resource capacity based on metrics. You define rules with conditions and actions. Supports scale-out (add instances) and scale-in (remove instances) with cooldown periods.

Integration:
Azure Monitor integrates with Azure DevOps, ITSM tools, Power BI, Grafana, and third-party monitoring solutions. Data can be exported to Event Hubs, Storage Accounts, or partner solutions.

Best Practices:
Enable Application Insights for all web applications. Create comprehensive dashboards. Configure alerts for critical metrics. Use Log Analytics for deep analysis. Implement distributed tracing. Monitor costs with Azure Cost Management.`,
      metadata: { difficulty: 'intermediate', tags: ['monitoring', 'observability', 'logging', 'azure'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'azure-devops',
      title: 'Azure DevOps Services',
      category: 'Azure',
      subcategory: 'Azure DevOps',
      content: `Azure DevOps provides developer services for allowing teams to plan work, collaborate on code development, and build and deploy applications. It provides integrated features accessible through a web browser or IDE client.

Azure DevOps Services:
Azure Boards provides agile tools for planning, tracking, and discussing work. Azure Repos provides Git repositories or Team Foundation Version Control for source code management. Azure Pipelines enables CI/CD for building, testing, and deploying code. Azure Test Plans provides tools for planned and exploratory testing. Azure Artifacts allows teams to share packages (Maven, npm, NuGet, Python).

Azure Boards:
Boards support Scrum, Kanban, and Agile methodologies. Work items track features, user stories, tasks, bugs, and issues. Sprints organize work into time-boxed iterations. Backlogs prioritize and plan work. Dashboards provide real-time visibility into team progress. Queries filter and find work items.

Azure Repos:
Git repositories with unlimited free private repos. Branch policies enforce code quality (require reviewers, successful builds, linked work items). Pull requests enable code review with inline comments and discussions. Code search enables full-text search across repositories.

Azure Pipelines:
YAML pipelines define CI/CD as code. Classic pipelines use a visual designer. Multi-stage pipelines combine CI and CD in a single pipeline. Pipeline templates enable reusable pipeline definitions. Environments manage deployment targets with approvals and checks.

Azure Pipelines Features:
Parallel jobs enable running multiple jobs simultaneously. Self-hosted agents run pipelines on your own infrastructure. Microsoft-hosted agents provide pre-configured VMs for common languages. Service connections integrate with external services (Azure, AWS, Docker Hub, Kubernetes).

Azure Test Plans:
Manual testing with test cases and test suites. Exploratory testing with the Test & Feedback extension. Automated testing integration with pipelines. Test analytics and reporting.

Azure Artifacts:
Universal Packages, Maven, npm, NuGet, and Python package feeds. Upstream sources proxy packages from public registries. Retention policies manage feed storage. Integration with Azure Pipelines for publishing and consuming packages.

Integration:
Azure DevOps integrates with GitHub, Slack, Microsoft Teams, Jira, Jenkins, and many other tools through service hooks and extensions. The Azure DevOps Marketplace provides thousands of extensions.

Best Practices:
Use YAML pipelines for CI/CD as code. Implement branch policies for code quality. Use pull request reviews. Automate testing in pipelines. Implement deployment gates and approvals. Use variable groups for secret management. Monitor pipeline performance.`,
      metadata: { difficulty: 'intermediate', tags: ['devops', 'ci-cd', 'agile', 'azure'], lastUpdated: '2024-01-15' }
    },

    // ==================== GOOGLE CLOUD (10 documents) ====================
    {
      id: 'gcp-compute-engine',
      title: 'Google Cloud Compute Engine',
      category: 'Google Cloud',
      subcategory: 'Compute Engine',
      content: `Google Cloud Compute Engine delivers virtual machines running in Google's innovative data centers and worldwide fiber network. Compute Engine VMs boot quickly, come with persistent disk storage, and deliver consistent performance.

Machine Types:
General-purpose (E2, N2, N2D, N1) provide balanced price-performance for diverse workloads. Compute-optimized (C2, C2D, H3) offer high-performance for compute-intensive tasks. Memory-optimized (M1, M2, M3) support large in-memory databases. Accelerator-optimized (A2, G2) include GPUs for ML and HPC. Custom machine types let you specify exact vCPU and memory combinations.

Sole-Tenant Nodes:
Physical Compute Engine servers dedicated exclusively to your use. Required for compliance, licensing, or performance requirements. Support bring-your-own-license scenarios.

Preemptible and Spot VMs:
Spot VMs offer up to 91% discount over on-demand pricing. They can be reclaimed by Google with 30-second notice. Ideal for batch processing, fault-tolerant workloads, and CI/CD jobs.

Storage Options:
Persistent Disks provide durable block storage (Standard HDD, Balanced SSD, SSD, Extreme). Local SSDs offer high-performance temporary storage physically attached to the host. Persistent disks can be resized online and support snapshots for backups.

Networking:
VMs run in VPC networks. External IPs for internet access. Internal IPs for private communication. Load balancing distributes traffic across VMs. Cloud NAT enables outbound internet access for private VMs.

Instance Groups:
Managed Instance Groups (MIGs) provide auto-scaling, auto-healing, rolling updates, and load balancing. Unmanaged Instance Groups contain manually created VMs with different configurations.

Security:
Shielded VMs protect against rootkits and bootkits. Confidential VMs encrypt data in use with AMD SEV. OS Login manages SSH access through IAM. Organization policies control VM creation and configuration.

Live Migration:
Google's live migration technology moves running VMs between host machines during maintenance events with no noticeable impact. This eliminates maintenance windows.

Pricing:
Per-second billing with a 1-minute minimum. Sustained use discounts automatically reduce prices for VMs running more than 25% of the month. Committed use discounts offer up to 57% savings with 1-3 year commitments.

Best Practices:
Use custom machine types for optimal price-performance. Leverage preemptible VMs for batch workloads. Use managed instance groups for production. Enable Shielded VM features. Implement proper IAM controls. Use snapshots for backup and disaster recovery.`,
      metadata: { difficulty: 'beginner', tags: ['compute', 'virtual-machines', 'infrastructure', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-cloud-storage',
      title: 'Google Cloud Storage',
      category: 'Google Cloud',
      subcategory: 'Cloud Storage',
      content: `Google Cloud Storage is a managed service for storing unstructured data. It offers a unified object storage with global edge caching, providing 99.999999999% annual durability. Cloud Storage is suitable for serving website content, storing data for archival, and distributing large data objects to users.

Storage Classes:
Standard Storage is best for frequently accessed data with no minimum storage duration. Nearline Storage is for data accessed less than once a month (30-day minimum storage). Coldline Storage is for data accessed less than once a quarter (90-day minimum). Archive Storage is for data accessed less than once a year (365-day minimum). Autoclass automatically transitions objects between storage classes based on access patterns.

Key Concepts:
Buckets are containers for objects with globally unique names. Objects are individual pieces of data stored in buckets. Object metadata includes content type, custom metadata, and generation numbers. ACLs and IAM policies control access.

Consistency:
Cloud Storage provides strong global consistency for all operations including reads after writes, list operations after changes, bucket metadata operations, and object metadata updates.

Access Control:
Uniform bucket-level access uses IAM exclusively. Fine-grained access uses both IAM and ACLs. Signed URLs provide time-limited access without authentication. Signed policy documents control uploads. Public access prevention can be enforced at the organization level.

Object Lifecycle Management:
Lifecycle rules automatically transition objects between storage classes, delete objects, or set noncurrent version retention. Rules are based on age, creation date, storage class, number of newer versions, or days since becoming noncurrent.

Data Transfer:
gsutil command-line tool for basic transfers. Storage Transfer Service for large-scale online transfers from other clouds or URLs. Transfer Appliance for offline transfers of large datasets. Parallel composite uploads for faster uploads of large objects.

Security:
All data is encrypted at rest by default. Customer-managed encryption keys (CMEK) use Cloud KMS. Customer-supplied encryption keys (CSEK) let you manage your own keys. VPC Service Controls restrict data movement.

Integration:
Cloud Storage integrates with BigQuery for analytics, Dataflow for processing, Cloud Functions for event-driven processing, Pub/Sub for notifications, and CDN for content delivery.

Best Practices:
Use appropriate storage classes for cost optimization. Enable lifecycle management. Use uniform bucket-level access. Enable Object Versioning for critical data. Implement VPC Service Controls for sensitive data. Use Autoclass for unpredictable access patterns.`,
      metadata: { difficulty: 'beginner', tags: ['storage', 'object-storage', 'data-lake', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-bigquery',
      title: 'Google BigQuery',
      category: 'Google Cloud',
      subcategory: 'BigQuery',
      content: `BigQuery is a serverless, highly scalable, and cost-effective multi-cloud data warehouse designed for business agility. It enables super-fast SQL queries using the processing power of Google's infrastructure, with no infrastructure management required.

Architecture:
BigQuery separates storage and compute, allowing each to scale independently. Storage uses Colossus (Google's distributed storage system) with columnar format (Capacitor). Compute uses Dremel (a distributed query engine) that can process petabytes of data in seconds. Borg (Google's cluster management system) allocates compute resources.

Key Features:
Serverless architecture requires no infrastructure provisioning. Standard SQL support (ANSI SQL:2011 compliant). Built-in machine learning (BigQuery ML) enables ML models using SQL. Geospatial analysis with geography data types. Time-series analysis with window functions. Nested and repeated fields for semi-structured data.

Data Loading:
Batch loading from Cloud Storage, local files, or other databases. Streaming inserts for real-time data ingestion. BigQuery Data Transfer Service automates data loading from Google services (Ads, YouTube) and third-party sources. Federated queries access data in Cloud Storage, Bigtable, or Cloud SQL without loading.

Partitioning and Clustering:
Partitioned tables divide data into segments by date, integer range, or ingestion time. Clustered tables sort data within partitions by specified columns. Both improve query performance and reduce costs by limiting data scanned.

Security:
Column-level security restricts access to specific columns. Row-level security filters rows based on user identity. Data masking hides sensitive data. Customer-managed encryption keys. VPC Service Controls. Data exfiltration prevention. Authorized views and datasets.

BigQuery ML:
Create and execute ML models using SQL. Supported models include linear/logistic regression, K-means clustering, matrix factorization, time-series forecasting, deep neural networks, XGBoost, AutoML Tables, and TensorFlow models. Models can be exported for serving.

Pricing:
On-demand pricing charges per TB of data processed ($6.25/TB). Flat-rate pricing provides dedicated slots for predictable costs. Storage pricing is $0.02/GB/month for active storage and $0.01/GB/month for long-term storage (data not modified for 90 days). The first 1 TB of queries and 10 GB of storage per month are free.

Best Practices:
Use partitioned and clustered tables. Avoid SELECT * queries. Use approximate aggregation functions when possible. Materialize intermediate results. Use streaming inserts judiciously. Implement column-level security for sensitive data. Monitor costs with billing reports.`,
      metadata: { difficulty: 'intermediate', tags: ['analytics', 'data-warehouse', 'big-data', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-cloud-functions',
      title: 'Google Cloud Functions',
      category: 'Google Cloud',
      subcategory: 'Cloud Functions',
      content: `Google Cloud Functions is a lightweight, event-driven, serverless compute platform that allows you to create small, single-purpose functions that respond to cloud events without the need to manage a server or runtime environment.

Cloud Functions Generations:
1st Gen provides a simple event-driven programming model. 2nd Gen (recommended) is built on Cloud Run and Eventarc, offering longer request timeouts (up to 60 minutes), larger instances (up to 16 GB RAM, 4 vCPUs), concurrency (up to 1000 concurrent requests per instance), traffic splitting, and CloudEvents support.

Supported Runtimes:
Node.js (12, 14, 16, 18, 20), Python (3.7-3.12), Go (1.13-1.22), Java (11, 17, 21), Ruby (2.7, 3.0-3.2), PHP (7.4, 8.1-8.3), .NET (6.0, 8.0). Custom runtimes are supported via Docker containers in 2nd Gen.

Triggers:
HTTP triggers invoke functions via HTTP requests. Cloud Storage triggers respond to bucket events (create, delete, archive, metadata update). Pub/Sub triggers process messages from topics. Firestore triggers respond to document changes. Eventarc triggers (2nd Gen) support 90+ event sources from Google Cloud services and custom events.

Event-Driven Architecture:
Cloud Functions integrates with Eventarc for event routing. Events follow the CloudEvents specification. Retry policies handle transient failures. Dead-letter topics capture failed events.

Networking:
VPC connector enables access to VPC resources. Ingress controls restrict incoming traffic to internal, internal-and-cloud-load-balancing, or all traffic. Egress controls route outbound traffic through VPC connectors.

Security:
IAM controls who can deploy and invoke functions. Service accounts define the identity under which functions run. Secret Manager integration for managing sensitive data. Binary Authorization ensures only trusted container images are deployed.

Monitoring:
Cloud Logging captures function execution logs. Cloud Monitoring provides metrics (invocations, execution times, errors). Cloud Trace enables distributed tracing. Error Reporting aggregates and displays errors.

Pricing:
Pricing is based on invocations ($0.40 per million), compute time (per 100ms of execution), and networking. The free tier includes 2 million invocations, 400,000 GB-seconds, and 200,000 GHz-seconds per month.

Best Practices:
Use 2nd Gen for new functions. Keep functions focused. Use environment variables and Secret Manager for configuration. Implement idempotent functions. Set appropriate timeouts and memory. Use VPC connectors for private resource access. Test locally before deploying.`,
      metadata: { difficulty: 'intermediate', tags: ['serverless', 'functions', 'event-driven', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-gke',
      title: 'Google Kubernetes Engine (GKE)',
      category: 'Google Cloud',
      subcategory: 'GKE',
      content: `Google Kubernetes Engine (GKE) is a managed Kubernetes service that lets you deploy, manage, and scale containerized applications on Google Cloud. GKE provides a managed environment for deploying, managing, and scaling your containerized applications using Google infrastructure.

GKE Modes:
Standard Mode gives you full control over the cluster's underlying infrastructure, including configuring individual nodes. Autopilot Mode provides a fully managed Kubernetes experience where Google manages the cluster infrastructure, node pools, and scaling — you only manage your workloads.

Cluster Architecture:
The control plane runs the Kubernetes API server, scheduler, and etcd. In Standard mode, node pools are groups of VMs with the same configuration. Autopilot automatically provisions and manages nodes based on workload requirements. Regional clusters replicate the control plane across three zones.

Networking:
VPC-native clusters use alias IP ranges for pod networking, enabling direct VPC routing. Shared VPC allows multiple projects to share a common VPC. Dataplane V2 (powered by Cilium/eBPF) provides advanced networking with built-in network policy enforcement. Gateway API provides advanced traffic management.

Security:
Workload Identity federates Kubernetes service accounts with Google Cloud IAM. Binary Authorization ensures only trusted container images are deployed. Container-native security scanning identifies vulnerabilities. GKE Sandbox (gVisor) provides kernel-level isolation. Shielded GKE Nodes protect against node tampering.

Auto-scaling:
Cluster Autoscaler adjusts the number of nodes. Horizontal Pod Autoscaler scales pods based on metrics. Vertical Pod Autoscaler adjusts pod resource requests. Node Auto-provisioning automatically creates new node pools with optimal configuration.

Storage:
Persistent Disk CSI driver for block storage. Filestore CSI driver for NFS file storage. Cloud Storage FUSE for object storage access. Backup for GKE provides backup and restore capabilities.

Release Channels:
Rapid channel provides earliest access to new features. Regular channel offers a balance of features and stability. Stable channel prioritizes stability for production workloads. Extended channel provides the longest support window.

Cost Optimization:
Autopilot charges only for pod resources requested. Spot VMs offer significant discounts for fault-tolerant workloads. Committed use discounts reduce costs with usage commitments. Resource quotas prevent runaway costs.

Best Practices:
Use Autopilot for simplified operations. Implement Workload Identity for security. Use namespace isolation for multi-tenancy. Enable Binary Authorization. Set resource requests and limits. Use release channels for controlled upgrades. Monitor with Cloud Monitoring and Logging.`,
      metadata: { difficulty: 'advanced', tags: ['kubernetes', 'containers', 'orchestration', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-cloud-iam',
      title: 'Google Cloud IAM',
      category: 'Google Cloud',
      subcategory: 'Cloud IAM',
      content: `Google Cloud Identity and Access Management (IAM) lets you manage access control by defining who (identity) has what access (role) for which resource. IAM provides a unified view into security policy across your entire organization with built-in auditing.

Core Concepts:
Members (principals) are the identities that can access resources — Google Accounts, service accounts, Google Groups, Google Workspace domains, or Cloud Identity domains. Roles are collections of permissions — predefined roles, custom roles, and basic roles. Policies bind members to roles on resources. The resource hierarchy determines how policies are inherited.

Resource Hierarchy:
Organization (top level) > Folders (optional grouping) > Projects (contain resources) > Resources. IAM policies are inherited down the hierarchy. A policy set at the organization level applies to all folders, projects, and resources within it.

Role Types:
Basic Roles (Owner, Editor, Viewer) provide broad access and should be avoided in production. Predefined Roles are created by Google for specific services with fine-grained permissions. Custom Roles let you define exact permissions for your organization's needs.

Service Accounts:
Service accounts are identities for applications and VMs. User-managed service accounts are created and managed by you. Default service accounts are created automatically with some services. Service account keys should be avoided — use Workload Identity Federation instead.

Workload Identity Federation:
Allows external identities (from AWS, Azure, Active Directory, OIDC providers) to access Google Cloud resources without service account keys. This eliminates the need to manage and rotate long-lived credentials.

IAM Conditions:
Conditional role bindings grant access only when specified conditions are met. Conditions can be based on resource attributes, request attributes (IP address, time), or resource type.

Organization Policies:
Organization Policy Service provides centralized constraints on how resources can be configured. Constraints include restricting resource locations, disabling service account key creation, and enforcing domain-restricted sharing.

Recommender:
IAM Recommender analyzes actual permission usage and recommends removing unused permissions, helping enforce the principle of least privilege.

Best Practices:
Follow the principle of least privilege. Use predefined roles over basic roles. Avoid service account keys — use Workload Identity. Use groups for access management. Enable audit logging. Review IAM recommendations regularly. Use organization policies for guardrails.`,
      metadata: { difficulty: 'intermediate', tags: ['security', 'identity', 'access-management', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-vpc',
      title: 'Google Cloud VPC',
      category: 'Google Cloud',
      subcategory: 'VPC',
      content: `Google Cloud Virtual Private Cloud (VPC) provides networking functionality to Compute Engine, GKE, and other services. VPC networks are global resources that span all Google Cloud regions, allowing you to create subnets in any region.

VPC Network Types:
Auto mode VPC networks automatically create subnets in each region. Custom mode VPC networks give you full control over subnet creation and IP ranges. Google recommends custom mode for production.

Subnets:
Subnets are regional resources with a primary IP range and optional secondary ranges. Private Google Access allows instances without external IPs to reach Google services. Flow Logs capture network flow information for monitoring and analysis.

Firewall Rules:
VPC firewall rules control traffic to and from VM instances. Rules are defined by direction (ingress/egress), action (allow/deny), priority, target, source/destination, and protocol/port. Hierarchical firewall policies can be applied at the organization or folder level. Cloud Firewall provides advanced threat protection and FQDN-based filtering.

Routes:
System-generated routes define paths for default internet access and subnet-to-subnet communication. Custom routes can direct traffic to specific destinations. Policy-based routes enable advanced traffic management.

VPC Peering:
VPC Network Peering connects two VPC networks for private communication. Peered networks can be in the same or different projects/organizations. Traffic stays within Google's network and uses internal IP addresses.

Shared VPC:
Shared VPC allows an organization to connect resources from multiple projects to a common VPC network. A host project provides the network, and service projects use it. This centralizes network management and security.

Cloud NAT:
Cloud NAT provides outbound internet access for VMs without external IP addresses. It uses a NAT gateway that maps internal IPs to external IPs. Supports manual and automatic NAT IP address allocation.

Private Service Connect:
Private Service Connect enables private connectivity to Google APIs, managed services, and your own services. It uses private endpoints with internal IP addresses from your VPC.

Cloud Interconnect and VPN:
Cloud Interconnect provides dedicated physical connections (10 Gbps or 100 Gbps) to Google's network. Partner Interconnect provides connectivity through a supported service provider. Cloud VPN creates encrypted IPsec tunnels over the internet. HA VPN provides 99.99% availability SLA.

Best Practices:
Use custom mode VPC for production. Implement least-privilege firewall rules. Use Shared VPC for multi-project environments. Enable VPC Flow Logs. Use Private Google Access. Implement Cloud NAT instead of external IPs. Use hierarchical firewall policies for organization-wide rules.`,
      metadata: { difficulty: 'intermediate', tags: ['networking', 'infrastructure', 'security', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-cloud-monitoring',
      title: 'Google Cloud Monitoring',
      category: 'Google Cloud',
      subcategory: 'Cloud Monitoring',
      content: `Google Cloud Monitoring provides visibility into the performance, uptime, and overall health of cloud-powered applications. It collects metrics, events, and metadata from Google Cloud, AWS, hosted uptime probes, and application instrumentation.

Core Features:
Metrics Explorer enables interactive exploration of metrics data. Dashboards provide customizable visual displays. Alerting notifies you when metrics exceed defined thresholds. Uptime Checks monitor the availability of URLs, VMs, and services. Service Monitoring tracks SLO (Service Level Objective) compliance.

Metrics:
Google Cloud services automatically export metrics to Cloud Monitoring. Over 1,500 built-in metrics cover compute, storage, networking, databases, and more. Custom metrics can be created using the Monitoring API, OpenTelemetry, or the Monitoring client libraries.

Dashboards:
Pre-built dashboards provide instant visibility into Google Cloud services. Custom dashboards use widgets including line charts, bar charts, stacked areas, heatmaps, scorecards, and tables. Dashboard JSON definitions enable version control and sharing.

Alerting:
Alerting policies define conditions that trigger notifications. Metric-based alerts evaluate time-series data. Log-based alerts trigger on matching log entries. Notification channels include email, SMS, Slack, PagerDuty, webhooks, and Pub/Sub. Alert policies support documentation with instructions for responders.

Uptime Checks:
HTTP, HTTPS, and TCP uptime checks monitor service availability. Checks run from multiple global locations. Content matchers verify response content. SSL certificate monitoring alerts on expiration.

Service Monitoring:
Define services and set SLOs. Track error budgets. Monitor SLI (Service Level Indicator) performance. Receive alerts when error budget is being consumed too quickly.

Managed Prometheus:
Google Cloud Managed Service for Prometheus provides fully managed Prometheus-compatible monitoring. It stores metrics in Monarch (Google's global metrics system). PromQL queries work natively. Grafana integration provides familiar visualization.

Integration:
Cloud Monitoring integrates with Cloud Logging, Cloud Trace, Error Reporting, and Cloud Profiler for a complete observability stack. Third-party integrations include Datadog, Grafana, and Splunk.

Best Practices:
Create dashboards for key services. Set up alerting for critical SLOs. Use uptime checks for external monitoring. Implement custom metrics for application-level monitoring. Use Managed Prometheus for Kubernetes workloads. Document alert response procedures.`,
      metadata: { difficulty: 'intermediate', tags: ['monitoring', 'observability', 'metrics', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-cloud-security',
      title: 'Google Cloud Security',
      category: 'Google Cloud',
      subcategory: 'Cloud Security',
      content: `Google Cloud Security provides a comprehensive set of security services and features built on Google's infrastructure. Google's security model is an end-to-end process built on over 20 years of experience running secure services at scale.

Security Command Center:
Security Command Center (SCC) is the centralized security and risk management platform for Google Cloud. It provides asset inventory, vulnerability scanning, threat detection, and compliance monitoring. SCC Premium tier includes Event Threat Detection, Container Threat Detection, and Security Health Analytics.

Identity Security:
Cloud Identity provides identity management. IAM controls resource access. Beyond Corp Enterprise implements zero-trust access. Identity-Aware Proxy (IAP) protects applications without VPN. Identity Platform provides customer identity services.

Network Security:
Cloud Armor provides DDoS protection and WAF capabilities. Cloud Firewall controls network traffic with threat intelligence. VPC Service Controls create security perimeters around Google Cloud resources. Private Google Access and Private Service Connect enable private connectivity.

Data Security:
Cloud KMS manages encryption keys. Cloud HSM provides FIPS 140-2 Level 3 hardware security modules. Cloud EKM integrates with external key management systems. Confidential Computing encrypts data in use. Data Loss Prevention (DLP) discovers and protects sensitive data.

Threat Detection:
Chronicle Security Operations is a cloud-native SIEM built on Google infrastructure. Event Threat Detection identifies threats in Cloud Logging. Container Threat Detection identifies container attacks. Web Security Scanner scans web applications for vulnerabilities.

Software Supply Chain Security:
Binary Authorization ensures only trusted container images are deployed. Artifact Registry provides secure, private container image storage with vulnerability scanning. Container Analysis scans for OS and language package vulnerabilities. Software Delivery Shield provides end-to-end software supply chain security.

Compliance:
Access Transparency logs when Google staff access your data. Access Approval requires your approval before Google accesses your data. Assured Workloads simplifies compliance configuration for regulated industries. Compliance reports are available through the Cloud Console.

Best Practices:
Enable Security Command Center. Implement VPC Service Controls for sensitive data. Use Cloud KMS for key management. Enable audit logging. Implement zero-trust with BeyondCorp. Use Binary Authorization for container security. Regularly review security findings. Maintain compliance through Assured Workloads.`,
      metadata: { difficulty: 'advanced', tags: ['security', 'compliance', 'threat-detection', 'gcp'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'gcp-cloud-run',
      title: 'Google Cloud Run',
      category: 'Google Cloud',
      subcategory: 'Cloud Run',
      content: `Cloud Run is a fully managed compute platform that lets you run containers directly on top of Google's scalable infrastructure. You can deploy code written in any programming language if you can build a container image. Cloud Run is built on Knative, giving you the option of running your containers fully managed or in your own GKE cluster.

How Cloud Run Works:
You provide a container image, and Cloud Run handles provisioning, scaling, and managing the infrastructure. Cloud Run automatically scales from zero to thousands of instances based on incoming traffic. You pay only for the resources your containers consume during request processing.

Key Features:
Any language or library — if it can run in a container, it runs on Cloud Run. Automatic scaling from zero to N based on traffic. HTTPS endpoints automatically provisioned. Custom domains with managed SSL certificates. Request-based pricing — pay only for what you use.

Deployment Options:
Cloud Run Services handle HTTP requests. Cloud Run Jobs execute tasks to completion (batch processing, database migrations). Multi-container deployments support sidecar patterns.

Scaling:
Minimum instances can be set to prevent cold starts. Maximum instances limit scaling for cost control. Concurrency settings control how many requests each container handles simultaneously (default: 80, max: 1000). CPU allocation can be set to always-on or only during request processing.

Networking:
Cloud Run services get HTTPS endpoints by default. VPC connector enables access to VPC resources. Direct VPC egress provides lower latency VPC access. Ingress controls restrict incoming traffic sources.

Security:
Each revision runs as a unique service account. IAM controls who can invoke the service. Automatic HTTPS with managed certificates. Secret Manager integration for sensitive configuration. Binary Authorization for image verification.

CI/CD Integration:
Cloud Build can automatically build and deploy to Cloud Run. Cloud Deploy provides managed continuous delivery. GitHub Actions and GitLab CI integration. Source-based deployments build directly from source code.

Traffic Management:
Gradual traffic splitting between revisions enables canary deployments and A/B testing. Rollback by routing traffic to previous revisions. Tags allow testing specific revisions before routing production traffic.

Pricing:
CPU: $0.00002400 per vCPU-second. Memory: $0.00000250 per GiB-second. Requests: $0.40 per million requests. Free tier: 2 million requests, 360,000 GiB-seconds, 180,000 vCPU-seconds per month.

Best Practices:
Set appropriate concurrency levels. Use minimum instances to reduce cold starts. Implement health check endpoints. Use managed secrets. Set memory and CPU limits. Use traffic splitting for safe deployments. Monitor with Cloud Monitoring and Logging.`,
      metadata: { difficulty: 'intermediate', tags: ['serverless', 'containers', 'paas', 'gcp'], lastUpdated: '2024-01-15' }
    },

    // ==================== DOCKER (5 documents) ====================
    {
      id: 'docker-basics',
      title: 'Docker Fundamentals',
      category: 'Docker',
      subcategory: 'Docker Basics',
      content: `Docker is an open-source platform for developing, shipping, and running applications. Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications.

What is Docker?
Docker uses containerization technology to package applications and their dependencies into standardized units called containers. Unlike virtual machines, containers share the host OS kernel, making them lightweight, fast, and efficient. A container includes everything needed to run the application: code, runtime, system tools, libraries, and settings.

Docker Architecture:
Docker uses a client-server architecture. The Docker Client (docker CLI) sends commands to the Docker Daemon (dockerd). The Docker Daemon manages Docker objects (images, containers, networks, volumes). Docker Registry stores Docker images (Docker Hub is the default public registry). Docker Desktop provides a GUI for managing Docker on Windows and Mac.

Key Concepts:
Dockerfile is a text file with instructions for building a Docker image. Each instruction creates a layer in the image. Docker Images are read-only templates used to create containers. They are built from Dockerfiles and can be shared through registries. Docker Containers are runnable instances of images. They are isolated from each other and the host system.

Basic Docker Commands:
docker build -t myapp . — builds an image from a Dockerfile. docker run -d -p 8080:80 myapp — runs a container in detached mode with port mapping. docker ps — lists running containers. docker stop <id> — stops a container. docker pull nginx — downloads an image from a registry. docker push myuser/myapp — uploads an image to a registry. docker logs <id> — views container logs. docker exec -it <id> bash — opens a shell in a running container.

Dockerfile Best Practices:
Use official base images. Minimize the number of layers. Use multi-stage builds to reduce image size. Don't run as root — use USER instruction. Use .dockerignore to exclude files. Order instructions from least to most frequently changing. Use specific image tags instead of latest.

Docker Compose:
Docker Compose defines and runs multi-container applications. A docker-compose.yml file describes services, networks, and volumes. docker compose up starts all services. docker compose down stops and removes services. Compose is ideal for development environments and simple multi-container deployments.

Benefits of Docker:
Consistency across development, testing, and production environments. Fast startup times (seconds vs minutes for VMs). Efficient resource utilization. Easy horizontal scaling. Simplified dependency management. Improved CI/CD pipelines. Application isolation.

Use Cases:
Microservices architecture, CI/CD pipelines, development environments, application modernization, hybrid cloud deployments, and edge computing.`,
      metadata: { difficulty: 'beginner', tags: ['containers', 'devops', 'microservices', 'docker'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'docker-images',
      title: 'Docker Images - Deep Dive',
      category: 'Docker',
      subcategory: 'Docker Images',
      content: `Docker images are the building blocks of containers. An image is a read-only template with instructions for creating a Docker container. Images are composed of layers, where each layer represents a set of filesystem changes.

Image Layers:
Each instruction in a Dockerfile creates a new layer. Layers are cached and shared between images. If a layer hasn't changed, Docker uses the cached version. This makes builds faster and images smaller. The final image is a stack of layers combined using a union filesystem.

Building Images:
Images are built from Dockerfiles using docker build. The build context is the set of files at the specified path. Each instruction (FROM, RUN, COPY, etc.) creates a new layer. Build arguments (ARG) allow parameterized builds. Multi-stage builds use multiple FROM instructions to create intermediate build stages, keeping the final image small.

Multi-Stage Builds Example:
Stage 1 uses a full development image with build tools to compile the application. Stage 2 uses a minimal runtime image and copies only the compiled binary from stage 1. This can reduce image sizes from hundreds of megabytes to tens of megabytes.

Image Registries:
Docker Hub is the default public registry with millions of images. Private registries (AWS ECR, Azure ACR, Google AR, Harbor) store proprietary images. Images are identified by repository:tag (e.g., nginx:1.25-alpine). The latest tag is the default if no tag is specified.

Image Inspection:
docker image inspect shows detailed information about an image. docker history shows the layers and commands that created them. docker image ls lists local images with sizes. docker manifest inspect shows multi-platform image manifests.

Image Security:
Use official or verified images from trusted sources. Scan images for vulnerabilities using Docker Scout, Trivy, or Snyk. Use minimal base images (Alpine, distroless) to reduce attack surface. Don't store secrets in images. Sign images with Docker Content Trust.

Image Optimization:
Use Alpine-based images (5 MB vs 100+ MB for Ubuntu). Remove unnecessary files and packages. Combine RUN commands to reduce layers. Use .dockerignore to exclude build artifacts. Clean up package manager caches in the same RUN instruction.

Image Tagging:
Use semantic versioning (1.0.0, 1.0, 1). Tag images with git commit SHA for traceability. Use immutable tags in production. Don't rely on the latest tag for deployments.

Best Practices:
Use multi-stage builds. Keep images small and focused. Scan for vulnerabilities regularly. Use specific base image versions. Implement image signing. Clean up unused images. Document image contents and usage.`,
      metadata: { difficulty: 'intermediate', tags: ['containers', 'images', 'dockerfile', 'docker'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'docker-containers',
      title: 'Docker Containers - Management and Operations',
      category: 'Docker',
      subcategory: 'Docker Containers',
      content: `Docker containers are lightweight, standalone, and executable packages that include everything needed to run an application. Containers are instances of Docker images running as isolated processes on the host machine.

Container Lifecycle:
Created — container exists but hasn't started. Running — container is actively executing. Paused — container processes are suspended. Stopped — container has been stopped. Removed — container has been deleted.

Running Containers:
docker run creates and starts a container. Key flags: -d (detached mode), -p (port mapping), -v (volume mount), -e (environment variable), --name (container name), --restart (restart policy), --memory (memory limit), --cpus (CPU limit), -it (interactive terminal).

Container Management:
docker ps — lists running containers (add -a for all). docker start/stop/restart — manages container state. docker rm — removes stopped containers. docker logs — views container output. docker stats — shows real-time resource usage. docker top — displays running processes. docker inspect — shows detailed container information.

Resource Limits:
--memory sets maximum memory (e.g., --memory=512m). --cpus limits CPU usage (e.g., --cpus=1.5). --pids-limit restricts the number of processes. --blkio-weight sets block I/O priority. These limits prevent containers from consuming excessive resources.

Health Checks:
HEALTHCHECK instruction in Dockerfile defines how to test container health. Docker periodically runs the health check command. Container status shows as healthy, unhealthy, or starting. Orchestrators use health checks to manage container lifecycle.

Container Security:
Run containers as non-root users. Use read-only filesystems (--read-only). Drop unnecessary Linux capabilities (--cap-drop ALL). Use seccomp profiles to restrict system calls. Enable AppArmor or SELinux profiles. Don't run containers in privileged mode. Use namespaces and cgroups for isolation.

Container Debugging:
docker exec -it <container> sh — opens a shell inside the container. docker logs --follow <container> — streams logs in real-time. docker cp — copies files between container and host. docker diff — shows filesystem changes in a container. docker events — streams real-time Docker events.

Restart Policies:
no — never restart (default). on-failure — restart if exit code is non-zero. always — always restart regardless of exit code. unless-stopped — restart unless explicitly stopped.

Best Practices:
One process per container. Use environment variables for configuration. Use health checks. Set resource limits. Run as non-root. Use restart policies. Log to stdout/stderr. Keep containers stateless. Use meaningful names and labels.`,
      metadata: { difficulty: 'intermediate', tags: ['containers', 'operations', 'management', 'docker'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'docker-networking',
      title: 'Docker Networking',
      category: 'Docker',
      subcategory: 'Docker Networking',
      content: `Docker networking enables containers to communicate with each other and with external systems. Docker provides several network drivers and options to control how containers connect and interact.

Network Drivers:
Bridge is the default network driver for standalone containers. Containers on the same bridge network can communicate using container names as hostnames. Host removes network isolation between container and host — the container uses the host's networking directly. Overlay enables communication between containers across multiple Docker hosts (used with Docker Swarm). Macvlan assigns a MAC address to a container, making it appear as a physical device on the network. None disables all networking for a container.

Default Bridge Network:
When you install Docker, a default bridge network (docker0) is created automatically. Containers on the default bridge communicate by IP address. User-defined bridge networks support automatic DNS resolution between containers by name.

User-Defined Bridge Networks:
docker network create mynetwork creates a custom bridge network. Containers on the same user-defined network can resolve each other by name. Networks provide isolation — containers on different networks can't communicate. docker network connect/disconnect manages container network membership.

Port Mapping:
The -p flag maps container ports to host ports. -p 8080:80 maps host port 8080 to container port 80. -p 127.0.0.1:8080:80 binds only to localhost. -P publishes all exposed ports to random host ports. EXPOSE in Dockerfile documents which ports the container listens on.

DNS Resolution:
User-defined networks have built-in DNS. Containers can reach each other by container name. Docker also supports --dns flags for custom DNS servers. Docker Compose services are automatically discoverable by service name.

Network Security:
Networks provide isolation between groups of containers. Firewall rules can control traffic between networks. Encrypted overlay networks secure inter-host communication. Use network policies to restrict container communication.

Docker Compose Networking:
Docker Compose automatically creates a network for each project. Services within a Compose file can communicate by service name. External networks can be referenced for cross-project communication. Network aliases provide additional hostnames for services.

Advanced Networking:
IPv6 support can be enabled on Docker networks. Custom subnets and gateways can be specified. Multiple networks can be attached to a single container. Network plugins extend Docker networking capabilities.

Best Practices:
Use user-defined bridge networks instead of the default bridge. Isolate application components on separate networks. Use service names for container discovery. Minimize published ports. Use overlay networks for multi-host deployments. Document network topology.`,
      metadata: { difficulty: 'intermediate', tags: ['networking', 'containers', 'connectivity', 'docker'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'docker-volumes',
      title: 'Docker Volumes and Data Management',
      category: 'Docker',
      subcategory: 'Docker Volumes',
      content: `Docker volumes are the preferred mechanism for persisting data generated by and used by Docker containers. While bind mounts depend on the host machine's directory structure, volumes are completely managed by Docker.

Types of Data Storage:
Volumes are stored in a part of the host filesystem managed by Docker (/var/lib/docker/volumes/). They are the best way to persist data. Bind Mounts can be stored anywhere on the host system. They map a host directory to a container directory. tmpfs Mounts are stored in the host system's memory only and are never written to the filesystem.

Volume Commands:
docker volume create myvolume — creates a named volume. docker volume ls — lists all volumes. docker volume inspect myvolume — shows volume details. docker volume rm myvolume — removes a volume. docker volume prune — removes unused volumes.

Using Volumes:
Mount volumes with the -v or --mount flag. -v myvolume:/app/data mounts a named volume. -v /host/path:/container/path creates a bind mount. --mount type=volume,source=myvolume,target=/app/data is the more explicit syntax.

Volume Drivers:
Local driver stores data on the host filesystem (default). NFS driver mounts remote NFS shares. Cloud storage drivers (AWS EFS, Azure Files, GCS) mount cloud storage. Third-party drivers provide specialized storage solutions.

Volume in Docker Compose:
Volumes are defined in the volumes section of docker-compose.yml. Services reference volumes in their volumes configuration. Named volumes persist across docker compose up/down cycles. External volumes reference pre-existing volumes.

Data Sharing Between Containers:
Multiple containers can mount the same volume simultaneously. This enables data sharing between application containers and backup containers. Use read-only mounts (ro suffix) when containers only need to read data.

Backup and Restore:
Back up volumes by running a temporary container that mounts the volume and creates a tar archive. Restore by running a container that extracts the archive into the volume. Third-party tools like Velero can automate volume backups.

Volume Security:
Set appropriate permissions on volume data. Use read-only mounts when possible. Encrypt sensitive data in volumes. Use volume labels for organization. Implement regular backup procedures.

Best Practices:
Use named volumes for persistent data. Use bind mounts for development (live code reloading). Use tmpfs for sensitive data that shouldn't persist. Don't store data in the container's writable layer. Clean up unused volumes regularly. Document volume usage and backup procedures. Use volume labels for organization.`,
      metadata: { difficulty: 'intermediate', tags: ['storage', 'data-management', 'persistence', 'docker'], lastUpdated: '2024-01-15' }
    },

    // ==================== KUBERNETES (5 documents) ====================
    {
      id: 'k8s-pods',
      title: 'Kubernetes Pods',
      category: 'Kubernetes',
      subcategory: 'Pods',
      content: `A Pod is the smallest deployable unit in Kubernetes. It represents a single instance of a running process in your cluster. Pods contain one or more containers that share storage, network, and a specification for how to run the containers.

Pod Anatomy:
A Pod encapsulates one or more containers, storage resources, a unique network IP, and options governing how the containers should run. Containers within a Pod share the same network namespace (IP address and port space), can communicate via localhost, and can share volumes.

Single vs Multi-Container Pods:
Single-container pods are the most common use case — one container per Pod. Multi-container pods are used for tightly coupled containers that need to share resources. Common multi-container patterns include Sidecar (adds functionality like logging or monitoring), Ambassador (proxies network traffic), Adapter (transforms output), and Init Containers (run setup tasks before app containers start).

Pod Lifecycle:
Pending — Pod has been accepted but containers aren't running yet. Running — at least one container is running. Succeeded — all containers terminated successfully. Failed — all containers terminated, at least one with failure. Unknown — Pod status couldn't be determined.

Pod Specification (YAML):
apiVersion: v1, kind: Pod. The spec section defines containers (image, ports, resources, environment variables), volumes, restart policy, service account, and tolerations. The metadata section includes name, namespace, labels, and annotations.

Resource Management:
Requests define the minimum resources a container needs. Limits define the maximum resources a container can use. CPU is measured in cores (1 = 1 core, 100m = 0.1 core). Memory is measured in bytes (128Mi, 1Gi). Quality of Service classes: Guaranteed (requests == limits), Burstable (requests < limits), BestEffort (no requests or limits).

Health Probes:
Liveness probes determine if a container is running — if it fails, the container is restarted. Readiness probes determine if a container is ready to receive traffic. Startup probes determine if a container application has started. Probes can use HTTP, TCP, or command-based checks.

Pod Networking:
Each Pod gets its own IP address. Containers within a Pod communicate via localhost. Pods communicate with other Pods using their IP addresses. Services provide stable network endpoints for sets of Pods.

Pod Security:
Security Context defines privilege and access control settings. PodSecurityStandards enforce security best practices. RunAsNonRoot prevents containers from running as root. ReadOnlyRootFilesystem prevents filesystem modifications.

Best Practices:
One application per Pod. Set resource requests and limits. Use health probes. Don't use naked Pods — use Deployments. Use labels and annotations. Implement pod disruption budgets. Use init containers for setup tasks.`,
      metadata: { difficulty: 'beginner', tags: ['kubernetes', 'containers', 'orchestration', 'pods'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'k8s-services',
      title: 'Kubernetes Services',
      category: 'Kubernetes',
      subcategory: 'Services',
      content: `A Kubernetes Service is an abstraction that defines a logical set of Pods and a policy by which to access them. Services enable network access to a set of Pods, providing stable networking endpoints even as Pods are created and destroyed.

Why Services?
Pods are ephemeral — they can be created, destroyed, and rescheduled at any time. Each Pod gets a unique IP address, but these IPs change as Pods come and go. Services provide a stable IP address and DNS name that remains constant regardless of which Pods are backing it.

Service Types:
ClusterIP (default) — exposes the Service on an internal IP within the cluster. Only accessible from within the cluster. Used for internal communication between services. NodePort — exposes the Service on each Node's IP at a static port (range 30000-32767). Accessible from outside the cluster via NodeIP:NodePort. LoadBalancer — provisions an external load balancer (in supported cloud environments) and assigns a fixed external IP. Used for exposing services to the internet. ExternalName — maps a Service to a DNS name using a CNAME record. Used for accessing external services by name.

Service Discovery:
DNS-based discovery — Kubernetes DNS automatically creates DNS records for Services. Service is accessible at <service-name>.<namespace>.svc.cluster.local. Environment variables — Kubernetes injects environment variables for each active Service into new Pods.

Selectors:
Services use label selectors to identify the Pods they route traffic to. The selector matches labels defined on Pods. Only Pods with matching labels receive traffic from the Service. Services without selectors can be used for external endpoints.

Endpoints:
When you create a Service with a selector, Kubernetes automatically creates an Endpoints object mapping to the Pods' IP addresses. EndpointSlices are the newer, more scalable replacement. Manual endpoints can be defined for services without selectors.

Session Affinity:
sessionAffinity: ClientIP directs requests from the same client IP to the same Pod. sessionAffinityConfig sets the timeout for session stickiness. Default is None (round-robin load balancing).

Headless Services:
A Service with clusterIP: None is a headless service. DNS returns the IP addresses of individual Pods instead of a cluster IP. Used for stateful applications where clients need to connect to specific Pods. Common with StatefulSets.

Multi-Port Services:
Services can expose multiple ports. Each port can have a different name, protocol, and target port. Useful for applications that serve multiple protocols.

Best Practices:
Use ClusterIP for internal services. Use LoadBalancer or Ingress for external access. Define meaningful service names. Use namespaces for isolation. Set appropriate port names. Use headless services for StatefulSets. Monitor service endpoints health.`,
      metadata: { difficulty: 'intermediate', tags: ['kubernetes', 'networking', 'service-discovery', 'services'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'k8s-deployments',
      title: 'Kubernetes Deployments',
      category: 'Kubernetes',
      subcategory: 'Deployments',
      content: `A Deployment provides declarative updates for Pods and ReplicaSets. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate. Deployments are the recommended way to manage the creation and scaling of Pods.

How Deployments Work:
A Deployment creates a ReplicaSet, which in turn creates the specified number of Pod replicas. The Deployment manages the ReplicaSet and provides declarative updates, rollback capability, and scaling.

Deployment Strategy:
RollingUpdate (default) — gradually replaces old Pods with new ones. Parameters: maxSurge (max extra Pods during update), maxUnavailable (max Pods that can be unavailable). Recreate — terminates all existing Pods before creating new ones. Causes downtime but is simpler. Used when applications can't run multiple versions simultaneously.

Creating Deployments:
Deployments are defined in YAML with apiVersion: apps/v1, kind: Deployment. The spec includes replicas (desired Pod count), selector (label selector), and template (Pod template with containers, volumes, etc.).

Scaling:
kubectl scale deployment myapp --replicas=5 — manual scaling. Horizontal Pod Autoscaler (HPA) automatically scales based on CPU, memory, or custom metrics. KEDA enables scaling based on external event sources.

Rolling Updates:
kubectl set image deployment/myapp container=image:v2 — updates the container image. kubectl rollout status deployment/myapp — monitors update progress. Kubernetes creates a new ReplicaSet with the updated specification. Old Pods are gradually replaced by new Pods. If the update fails, Pods continue running with the old version.

Rollbacks:
kubectl rollout undo deployment/myapp — rolls back to the previous version. kubectl rollout undo deployment/myapp --to-revision=2 — rolls back to a specific revision. kubectl rollout history deployment/myapp — shows revision history. Deployment keeps a configurable number of old ReplicaSets for rollback (revisionHistoryLimit).

Health and Readiness:
Deployments use Pod health probes to determine if new Pods are ready. Rolling updates only proceed when new Pods pass their readiness probes. minReadySeconds specifies how long a Pod must be ready without crashing before it's considered available.

Pod Disruption Budgets:
PDBs limit the number of Pods that can be unavailable during voluntary disruptions. minAvailable specifies the minimum number of Pods that must be available. maxUnavailable specifies the maximum number that can be unavailable. Essential for maintaining availability during cluster maintenance.

Deployment Annotations:
kubernetes.io/change-cause records the reason for a change. deployment.kubernetes.io/revision tracks the revision number.

Best Practices:
Always use Deployments (not naked Pods). Set resource requests and limits. Configure health probes. Use rolling updates for zero-downtime deployments. Set revisionHistoryLimit. Use Pod Disruption Budgets. Label and annotate deployments. Test updates in staging first.`,
      metadata: { difficulty: 'intermediate', tags: ['kubernetes', 'deployments', 'scaling', 'rolling-updates'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'k8s-configmaps',
      title: 'Kubernetes ConfigMaps and Secrets',
      category: 'Kubernetes',
      subcategory: 'ConfigMaps',
      content: `ConfigMaps and Secrets are Kubernetes objects used to decouple configuration from container images. ConfigMaps store non-confidential configuration data, while Secrets store sensitive information like passwords, tokens, and keys.

ConfigMaps:
ConfigMaps store configuration data as key-value pairs. They can be created from literal values, files, or directories. ConfigMaps decouple configuration from container images, making applications portable across environments.

Creating ConfigMaps:
kubectl create configmap myconfig --from-literal=key=value — from literal values. kubectl create configmap myconfig --from-file=config.properties — from a file. kubectl create configmap myconfig --from-env-file=env.conf — from an env file. YAML definition with data or binaryData fields.

Using ConfigMaps:
Environment variables — reference individual keys or entire ConfigMaps. Volume mounts — mount ConfigMap data as files in the container's filesystem. Command-line arguments — use ConfigMap values in container commands. ConfigMaps are namespaced — they must be in the same namespace as the Pods using them.

Secrets:
Secrets store sensitive data encoded in base64. Types include Opaque (arbitrary data), kubernetes.io/tls (TLS certificates), kubernetes.io/dockerconfigjson (Docker registry credentials), kubernetes.io/service-account-token (service account tokens).

Creating Secrets:
kubectl create secret generic mysecret --from-literal=password=mypass — from literal values. kubectl create secret tls mytls --cert=cert.pem --key=key.pem — TLS secret. kubectl create secret docker-registry myregistry --docker-server=... — registry credentials. YAML definition with base64-encoded data.

Using Secrets:
Environment variables — inject secret values as environment variables. Volume mounts — mount secrets as files (commonly used for TLS certificates). imagePullSecrets — authenticate with private container registries.

Secret Security:
Secrets are base64-encoded, NOT encrypted by default. Enable encryption at rest using EncryptionConfiguration. Use external secret management (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault) with operators like External Secrets Operator. Limit access with RBAC. Avoid committing secrets to version control.

Immutable ConfigMaps and Secrets:
Setting immutable: true prevents modifications after creation. This protects against accidental changes, improves cluster performance (Kubernetes stops watching for changes), and ensures consistency.

Hot Reloading:
ConfigMaps mounted as volumes are automatically updated when the ConfigMap changes (with a delay). Environment variables from ConfigMaps are NOT automatically updated — the Pod must be restarted. Using a sidecar or init container can implement application-level hot reloading.

Best Practices:
Use ConfigMaps for non-sensitive configuration. Use Secrets for sensitive data. Enable encryption at rest for Secrets. Use external secret management for production. Set immutable when configuration shouldn't change. Use volume mounts for file-based configuration. Namespace ConfigMaps and Secrets appropriately. Don't store large binary data in ConfigMaps.`,
      metadata: { difficulty: 'intermediate', tags: ['kubernetes', 'configuration', 'secrets', 'configmaps'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'k8s-ingress',
      title: 'Kubernetes Ingress',
      category: 'Kubernetes',
      subcategory: 'Ingress',
      content: `Kubernetes Ingress is an API object that manages external access to services in a cluster, typically HTTP and HTTPS. Ingress can provide load balancing, SSL termination, and name-based virtual hosting. It consolidates routing rules into a single resource.

Why Ingress?
Without Ingress, exposing services externally requires NodePort (limited port range) or LoadBalancer (one load balancer per service, expensive). Ingress provides a single entry point for all external HTTP/HTTPS traffic, with path-based and host-based routing to multiple services.

Ingress Controller:
An Ingress resource requires an Ingress Controller to function. Popular controllers include: NGINX Ingress Controller (most widely used), Traefik, HAProxy, AWS ALB Ingress Controller, GKE Ingress Controller, and Istio Gateway.

Ingress Rules:
Host-based routing directs traffic based on the hostname (app1.example.com → service1, app2.example.com → service2). Path-based routing directs traffic based on the URL path (/api → backend-service, /web → frontend-service). Default backend handles requests that don't match any rule.

Ingress Resource YAML:
apiVersion: networking.k8s.io/v1, kind: Ingress. The spec includes rules with host and http.paths definitions. Each path specifies a backend service name and port. pathType can be Prefix, Exact, or ImplementationSpecific.

TLS/SSL:
Ingress supports TLS termination using TLS secrets. The tls section specifies hosts and the secret containing the certificate and key. Let's Encrypt integration through cert-manager automates certificate provisioning and renewal.

Annotations:
Ingress behavior is customized through annotations. Common annotations: nginx.ingress.kubernetes.io/rewrite-target (URL rewriting), nginx.ingress.kubernetes.io/ssl-redirect (HTTPS redirect), nginx.ingress.kubernetes.io/proxy-body-size (request size limit), nginx.ingress.kubernetes.io/rate-limiting (rate limiting).

IngressClass:
IngressClass defines which controller handles an Ingress resource. Multiple Ingress controllers can coexist in a cluster. Each Ingress resource specifies its class via ingressClassName.

Gateway API:
Gateway API is the successor to Ingress, offering more features and expressiveness. It introduces Gateway, HTTPRoute, and GatewayClass resources. Gateway API supports traffic splitting, header matching, request mirroring, and more. It is designed to be portable across different implementations.

Advanced Features:
Rate limiting controls request frequency. CORS configuration handles cross-origin requests. Authentication integration with OAuth2 or basic auth. Canary deployments with traffic splitting. WebSocket support. gRPC routing.

Best Practices:
Use Ingress instead of multiple LoadBalancer services. Implement TLS with cert-manager. Use annotations for fine-tuning. Set appropriate timeouts and limits. Monitor Ingress controller health. Use Gateway API for advanced routing. Test routing rules thoroughly.`,
      metadata: { difficulty: 'advanced', tags: ['kubernetes', 'networking', 'routing', 'ingress'], lastUpdated: '2024-01-15' }
    },

    // ==================== CLOUD SECURITY (5 documents) ====================
    {
      id: 'security-cia-triad',
      title: 'CIA Triad - Foundation of Information Security',
      category: 'Cloud Security',
      subcategory: 'CIA Triad',
      content: `The CIA Triad is the foundational model for information security. It stands for Confidentiality, Integrity, and Availability. Every security control, policy, and architecture decision in cloud computing maps back to one or more of these three principles.

Confidentiality:
Confidentiality ensures that information is accessible only to those authorized to have access. In cloud computing, confidentiality is maintained through encryption (at rest, in transit, in use), access controls (IAM, RBAC), data classification, network segmentation, and multi-factor authentication.

Cloud Confidentiality Controls:
Encryption at rest — AES-256 for stored data in S3, Azure Storage, GCS. Encryption in transit — TLS 1.2/1.3 for data movement. Encryption in use — confidential computing with secure enclaves. Access controls — IAM policies, role-based access control, attribute-based access control. Data masking — hiding sensitive fields in non-production environments. DLP (Data Loss Prevention) — detecting and preventing data exfiltration.

Integrity:
Integrity ensures that data is accurate, complete, and trustworthy. Data should not be modified by unauthorized parties or processes. Integrity controls detect and prevent unauthorized modifications.

Cloud Integrity Controls:
Checksums and hashing — verifying data hasn't been tampered with (SHA-256, MD5). Digital signatures — authenticating the source and integrity of data. Version control — tracking changes to data and code. Database constraints — enforcing data validity rules. Audit logging — recording all changes for accountability. Immutable storage — preventing modification of critical data (S3 Object Lock, Azure Immutable Blob).

Availability:
Availability ensures that systems and data are accessible when needed. Cloud services must maintain uptime and performance to meet business requirements.

Cloud Availability Controls:
Redundancy — multi-AZ, multi-region deployments. Load balancing — distributing traffic across multiple instances. Auto-scaling — adjusting capacity based on demand. Backup and disaster recovery — regular backups with tested recovery procedures. DDoS protection — AWS Shield, Azure DDoS Protection, Cloud Armor. Failover mechanisms — automatic routing to healthy resources. SLAs — contractual guarantees from cloud providers.

The Extended CIA Model:
Authentication verifies identity before granting access. Authorization determines what actions are permitted. Non-repudiation ensures actions cannot be denied (audit trails). Accountability traces actions to specific users.

Threats to CIA:
Confidentiality threats: data breaches, eavesdropping, social engineering. Integrity threats: man-in-the-middle attacks, data corruption, malware. Availability threats: DDoS attacks, hardware failures, natural disasters.

Best Practices:
Implement defense in depth with multiple security layers. Apply the principle of least privilege. Encrypt data at rest and in transit. Enable comprehensive audit logging. Design for high availability. Test disaster recovery procedures regularly. Maintain security awareness training.`,
      metadata: { difficulty: 'beginner', tags: ['security', 'fundamentals', 'cia-triad', 'cloud-security'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'security-authentication',
      title: 'Cloud Authentication Methods',
      category: 'Cloud Security',
      subcategory: 'Authentication',
      content: `Authentication is the process of verifying the identity of a user, device, or system. In cloud computing, robust authentication mechanisms are critical because resources are accessible over the internet. Cloud authentication must balance security with usability.

Authentication Factors:
Something you know — passwords, PINs, security questions. Something you have — hardware tokens, smartphones, smart cards. Something you are — biometrics (fingerprints, facial recognition, iris scans). Multi-factor authentication (MFA) combines two or more factors for stronger security.

Password-Based Authentication:
Traditional username/password remains common. Cloud providers enforce password policies: minimum length, complexity requirements, expiration, and history. Password managers help users manage complex passwords. Risks include brute force attacks, credential stuffing, and phishing.

Multi-Factor Authentication (MFA):
MFA requires two or more verification methods. Time-based One-Time Passwords (TOTP) generate codes using authenticator apps (Google Authenticator, Microsoft Authenticator, Authy). SMS/email codes provide a second factor via text or email. Hardware security keys (FIDO2/WebAuthn) like YubiKey provide phishing-resistant authentication. Push notifications sent to registered devices for approval.

Token-Based Authentication:
JSON Web Tokens (JWT) are compact, URL-safe tokens for claims transfer. OAuth 2.0 provides authorization framework for delegated access. OpenID Connect (OIDC) adds identity layer on top of OAuth 2.0. SAML 2.0 enables enterprise single sign-on through XML-based assertions.

API Authentication:
API keys provide simple authentication for machine-to-machine communication. Bearer tokens (OAuth 2.0) provide scoped access to APIs. Mutual TLS (mTLS) authenticates both client and server using certificates. Service accounts provide identity for applications and workloads.

Federated Identity:
Identity federation allows users to authenticate with external identity providers. SAML federation connects enterprise Active Directory to cloud providers. Social identity federation allows login with Google, Facebook, or Apple accounts. Cross-cloud federation enables authentication across AWS, Azure, and GCP.

Zero Trust Authentication:
Zero trust assumes no implicit trust based on network location. Every access request is authenticated, authorized, and encrypted. Continuous verification assesses risk throughout the session. Context-aware access considers device health, location, and user behavior.

Cloud Provider Authentication:
AWS — IAM users, roles, MFA, federation, IAM Identity Center. Azure — Azure AD, Conditional Access, MFA, B2B, B2C. GCP — Cloud Identity, IAM, Workload Identity Federation.

Best Practices:
Enable MFA for all users. Use phishing-resistant methods (FIDO2). Implement single sign-on. Use short-lived tokens. Rotate credentials regularly. Monitor authentication events. Implement conditional access policies. Use passwordless authentication where possible.`,
      metadata: { difficulty: 'intermediate', tags: ['security', 'authentication', 'identity', 'cloud-security'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'security-authorization',
      title: 'Cloud Authorization Models',
      category: 'Cloud Security',
      subcategory: 'Authorization',
      content: `Authorization is the process of determining what actions an authenticated user or system is allowed to perform. While authentication verifies identity, authorization controls what that identity can access and do. Cloud authorization is critical for enforcing the principle of least privilege.

Authorization Models:
Role-Based Access Control (RBAC) assigns permissions based on roles. Attribute-Based Access Control (ABAC) makes decisions based on attributes of users, resources, and environment. Policy-Based Access Control uses policies to determine access. Discretionary Access Control (DAC) allows resource owners to control access. Mandatory Access Control (MAC) enforces system-wide access policies.

RBAC in Cloud:
AWS IAM Policies define permissions for users, groups, and roles. Azure RBAC assigns roles at different scopes (management group, subscription, resource group, resource). GCP IAM uses predefined and custom roles with hierarchical inheritance. Kubernetes RBAC uses Roles, ClusterRoles, RoleBindings, and ClusterRoleBindings.

Principle of Least Privilege:
Grant only the minimum permissions necessary to perform a task. Start with no permissions and add only what's needed. Regularly review and remove unnecessary permissions. Use just-in-time access for privileged operations. AWS IAM Access Analyzer, Azure Privileged Identity Management, and GCP IAM Recommender help enforce this principle.

Policy Evaluation:
AWS evaluates policies in order: explicit deny, Organizations SCP, resource-based policy, identity-based policy, permissions boundary, session policy. Azure evaluates deny assignments first, then role assignments at the closest scope. GCP evaluates policies from most specific (resource) to least specific (organization), with deny policies taking precedence.

Conditional Access:
Conditions add context-aware access controls. Time-based conditions restrict access to business hours. Location-based conditions limit access to specific regions or IP ranges. Device-based conditions require managed or compliant devices. Risk-based conditions evaluate sign-in risk before granting access.

Cross-Account/Cross-Project Access:
AWS — cross-account roles and resource-based policies. Azure — Azure Lighthouse and cross-tenant access. GCP — cross-project IAM bindings and Shared VPC. Careful management prevents unauthorized cross-boundary access.

Service-to-Service Authorization:
Managed identities (Azure), service accounts (GCP), IAM roles (AWS) provide identity for workloads. Service mesh technologies (Istio, Linkerd) enforce mTLS and authorization policies. API gateways enforce authorization at the API layer.

Audit and Compliance:
CloudTrail (AWS), Activity Log (Azure), Cloud Audit Logs (GCP) record authorization decisions. Regular access reviews ensure permissions remain appropriate. Automated compliance checking enforces authorization policies.

Best Practices:
Implement least privilege. Use RBAC with predefined roles when possible. Regular access reviews and cleanup. Use conditional access for sensitive resources. Separate duties for critical operations. Document authorization policies. Monitor and alert on privilege escalation.`,
      metadata: { difficulty: 'intermediate', tags: ['security', 'authorization', 'rbac', 'cloud-security'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'security-encryption',
      title: 'Cloud Encryption',
      category: 'Cloud Security',
      subcategory: 'Encryption',
      content: `Encryption is the process of converting readable data (plaintext) into an unreadable format (ciphertext) using mathematical algorithms and keys. In cloud computing, encryption is essential for protecting data confidentiality at every stage of its lifecycle.

Encryption at Rest:
Encryption at rest protects stored data. All major cloud providers encrypt data at rest by default. AWS uses AES-256 with AWS-managed keys (SSE-S3), customer-managed keys in KMS (SSE-KMS), or customer-provided keys (SSE-C). Azure uses Storage Service Encryption with Microsoft-managed or customer-managed keys. GCP uses AES-256 with Google-managed or customer-managed encryption keys.

Encryption in Transit:
Encryption in transit protects data moving between systems. TLS 1.2/1.3 encrypts HTTP traffic (HTTPS). VPN tunnels encrypt site-to-site and client-to-site connections. mTLS provides mutual authentication and encryption between services. Cloud providers encrypt data between data centers automatically.

Encryption in Use:
Encryption in use protects data during processing. Confidential Computing uses hardware-based Trusted Execution Environments (TEEs). AWS Nitro Enclaves isolate sensitive data processing. Azure Confidential Computing uses Intel SGX and AMD SEV. GCP Confidential VMs use AMD SEV for memory encryption.

Key Management:
AWS KMS provides centralized key management with automatic key rotation, auditing, and integration with 100+ AWS services. Azure Key Vault stores keys, secrets, and certificates with HSM-backed protection. GCP Cloud KMS offers symmetric and asymmetric key management with automatic rotation. Cloud HSM provides hardware security modules for FIPS 140-2 Level 3 compliance.

Encryption Algorithms:
Symmetric encryption (AES-128, AES-256) uses the same key for encryption and decryption — fast, used for data encryption. Asymmetric encryption (RSA, ECC) uses a key pair (public/private) — slower, used for key exchange and digital signatures. Hashing (SHA-256, SHA-512) creates fixed-length digests — used for integrity verification.

Envelope Encryption:
Envelope encryption uses a data encryption key (DEK) to encrypt data and a key encryption key (KEK) to encrypt the DEK. This is the standard approach used by cloud KMS services. Only the encrypted DEK is stored alongside the data.

Client-Side vs Server-Side:
Server-side encryption is managed by the cloud provider — simpler to implement. Client-side encryption is managed by the application — data is encrypted before sending to the cloud, providing stronger control but more complexity.

Certificate Management:
AWS Certificate Manager (ACM) provides free SSL/TLS certificates. Azure App Service Certificates and Key Vault manage certificates. GCP Certificate Manager handles SSL/TLS certificates. Let's Encrypt provides free certificates with automated renewal.

Best Practices:
Encrypt all data at rest and in transit. Use customer-managed keys for sensitive data. Implement key rotation policies. Use envelope encryption for large datasets. Avoid hardcoding encryption keys in code. Audit key usage regularly. Use HSMs for high-security requirements.`,
      metadata: { difficulty: 'intermediate', tags: ['security', 'encryption', 'key-management', 'cloud-security'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'security-compliance',
      title: 'Cloud Compliance and Governance',
      category: 'Cloud Security',
      subcategory: 'Compliance',
      content: `Cloud compliance refers to adhering to regulatory standards, industry best practices, and organizational policies when using cloud services. Compliance ensures that cloud deployments meet legal, security, and operational requirements.

Shared Responsibility for Compliance:
Cloud providers maintain compliance certifications for their infrastructure and services. Customers are responsible for compliance of their workloads, data, and configurations. The shared responsibility model defines the boundary between provider and customer compliance obligations.

Major Compliance Standards:
SOC 2 (Service Organization Control) — assesses security, availability, processing integrity, confidentiality, and privacy controls. ISO 27001 — international standard for information security management systems. PCI DSS (Payment Card Industry Data Security Standard) — requirements for handling cardholder data. HIPAA (Health Insurance Portability and Accountability Act) — protects sensitive health information in the US. GDPR (General Data Protection Regulation) — EU data protection and privacy regulation. FedRAMP — US government cloud security assessment framework. CSA STAR — Cloud Security Alliance Security Trust Assurance and Risk framework.

Compliance Tools by Provider:
AWS — AWS Artifact (compliance reports), AWS Config (configuration compliance), AWS Audit Manager (audit evidence collection), AWS Security Hub (compliance dashboards). Azure — Azure Policy (enforce standards), Azure Blueprints (repeatable compliant environments), Compliance Manager (compliance assessments), Purview (data governance). GCP — Assured Workloads (compliance configuration), Security Command Center (compliance monitoring), Access Transparency (Google access logs), Organization Policy (governance constraints).

Data Sovereignty and Residency:
Data sovereignty requires data to be subject to the laws of the country where it's stored. Data residency specifies where data must be physically stored. Cloud providers offer region selection to meet residency requirements. Some regulations require data to remain within specific geographic boundaries.

Governance Frameworks:
Cloud governance establishes policies, processes, and controls for cloud usage. Cost governance controls cloud spending with budgets and alerts. Security governance enforces security standards across cloud environments. Operational governance ensures consistent deployment and management practices.

Configuration Management:
Infrastructure as Code (IaC) ensures consistent, auditable configurations. Policy as Code automates compliance checking (AWS Config Rules, Azure Policy, GCP Organization Policies). Drift detection identifies configuration changes from the desired state. Remediation automation fixes non-compliant resources automatically.

Audit and Reporting:
Comprehensive audit logging (CloudTrail, Activity Log, Cloud Audit Logs) records all actions. Regular compliance assessments evaluate adherence to standards. Automated compliance reporting reduces manual effort. Evidence collection supports audit requirements.

Risk Management:
Risk assessment identifies and evaluates cloud-related risks. Risk treatment plans address identified risks. Continuous monitoring detects new risks and compliance gaps. Vendor risk management evaluates cloud provider security.

Best Practices:
Understand applicable compliance requirements before deployment. Use provider compliance tools and certifications. Implement policy as code for automated compliance. Enable comprehensive audit logging. Conduct regular compliance assessments. Document compliance processes and evidence. Train staff on compliance requirements. Use landing zones for consistent compliant deployments.`,
      metadata: { difficulty: 'advanced', tags: ['security', 'compliance', 'governance', 'cloud-security'], lastUpdated: '2024-01-15' }
    },

    // ==================== VIRTUALIZATION (5 documents) ====================
    {
      id: 'virt-hypervisors',
      title: 'Hypervisors and Virtualization Technology',
      category: 'Virtualization',
      subcategory: 'Hypervisors',
      content: `A hypervisor, also known as a virtual machine monitor (VMM), is software, firmware, or hardware that creates and runs virtual machines. The physical computer running the hypervisor is called the host, and each virtual machine is called a guest. Hypervisors are the foundational technology enabling cloud computing.

Types of Hypervisors:
Type 1 (Bare-Metal) hypervisors run directly on the physical hardware without an underlying operating system. They are more efficient and secure than Type 2 hypervisors. Examples include VMware ESXi, Microsoft Hyper-V, Citrix Hypervisor (XenServer), KVM (Kernel-based Virtual Machine), and AWS Nitro Hypervisor.

Type 2 (Hosted) hypervisors run on top of a conventional operating system as a software application. They are easier to set up but have more overhead. Examples include VMware Workstation, Oracle VirtualBox, Parallels Desktop, and QEMU.

How Hypervisors Work:
The hypervisor abstracts physical hardware resources (CPU, memory, storage, networking) and allocates them to virtual machines. Each VM runs its own operating system and applications in isolation. The hypervisor manages resource scheduling, memory management, and I/O handling between VMs.

CPU Virtualization:
Hardware-assisted virtualization (Intel VT-x, AMD-V) provides hardware support for running VMs efficiently. Virtual CPUs (vCPUs) are mapped to physical CPU cores. CPU overcommitment allows allocating more vCPUs than physical cores. CPU pinning dedicates specific cores to specific VMs for performance.

Memory Virtualization:
The hypervisor manages memory allocation between VMs. Memory ballooning allows the hypervisor to reclaim unused memory from VMs. Memory overcommitment allocates more virtual memory than physical memory available. Transparent page sharing deduplicates identical memory pages across VMs.

Storage Virtualization:
Virtual disks abstract physical storage. Thin provisioning allocates storage space on demand. Thick provisioning pre-allocates the entire disk space. Storage I/O control prioritizes disk access across VMs.

Network Virtualization:
Virtual switches connect VMs within a host. Virtual NICs provide network interfaces for VMs. VLANs segment virtual networks. SR-IOV (Single Root I/O Virtualization) provides near-native network performance.

Cloud Provider Hypervisors:
AWS uses the Nitro Hypervisor (custom KVM-based) providing near-bare-metal performance. Azure uses a modified Hyper-V hypervisor. GCP uses a KVM-based hypervisor. Each provider has optimized their hypervisor for cloud workloads.

Security Considerations:
VM escape vulnerabilities allow breaking out of VM isolation. Hypervisor hardening reduces the attack surface. Patch management keeps hypervisors updated. Micro-segmentation isolates VM traffic. Confidential computing protects data from the hypervisor.

Best Practices:
Use Type 1 hypervisors for production. Keep hypervisors updated with security patches. Implement resource limits to prevent noisy neighbors. Use hardware-assisted virtualization. Monitor hypervisor performance. Implement proper access controls for hypervisor management.`,
      metadata: { difficulty: 'intermediate', tags: ['virtualization', 'hypervisors', 'infrastructure', 'cloud-computing'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'virt-virtual-machines',
      title: 'Virtual Machines in Cloud Computing',
      category: 'Virtualization',
      subcategory: 'Virtual Machines',
      content: `Virtual machines (VMs) are software-based emulations of physical computers. Each VM runs its own operating system and applications, completely isolated from other VMs on the same physical host. VMs are the building blocks of cloud computing infrastructure.

VM Components:
Virtual CPU (vCPU) emulates a processor core. Virtual Memory (RAM) provides isolated memory space. Virtual Disk stores the operating system, applications, and data. Virtual NIC connects the VM to networks. Virtual BIOS/UEFI initializes the VM hardware.

VM Images and Templates:
VM images are pre-configured snapshots containing an OS and software. Cloud providers offer marketplace images (AWS AMIs, Azure VM Images, GCP Machine Images). Custom images allow you to create standardized configurations. Templates define VM specifications for automated provisioning.

VM Lifecycle Management:
Provisioning creates a new VM from an image or template. Running state consumes allocated resources. Stopping deallocates compute (but may retain storage). Snapshotting captures the current VM state for backup or cloning. Migrating moves a VM between physical hosts. Terminating permanently removes the VM.

Live Migration:
Live migration moves a running VM from one physical host to another with minimal downtime. This enables hardware maintenance without service interruption. Memory state is transferred iteratively while the VM continues running. Final cutover takes milliseconds.

VM vs Containers:
VMs provide full OS isolation with their own kernel — heavier but more isolated. Containers share the host OS kernel — lighter but less isolated. VMs boot in minutes; containers start in seconds. VMs are better for diverse OS requirements; containers are better for microservices.

VM Sizing and Optimization:
Right-sizing matches VM resources to actual workload needs. Cloud providers offer tools to recommend optimal sizes. Over-provisioning wastes resources; under-provisioning causes performance issues. Vertical scaling changes VM size; horizontal scaling adds more VMs.

VM High Availability:
Availability sets distribute VMs across fault domains. Availability zones distribute VMs across data centers. VM scale sets automatically manage groups of VMs. Health probes detect and replace unhealthy VMs. Backup and restore capabilities protect against data loss.

VM Security:
OS hardening removes unnecessary software and services. Patch management keeps systems updated. Antivirus and endpoint detection protect against malware. Disk encryption protects data at rest. Network security groups control traffic. Just-in-time access limits exposure.

Nested Virtualization:
Nested virtualization runs a hypervisor inside a VM. Useful for development, testing, and training environments. Supported by AWS, Azure, and GCP on specific instance types.

Best Practices:
Use the right VM size for your workload. Implement auto-scaling for variable workloads. Use managed disks for reliability. Enable boot diagnostics for troubleshooting. Implement backup and disaster recovery. Use spot/preemptible VMs for cost savings. Apply security hardening and monitoring.`,
      metadata: { difficulty: 'beginner', tags: ['virtualization', 'virtual-machines', 'infrastructure', 'cloud-computing'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'virt-containerization',
      title: 'Containerization Technology',
      category: 'Virtualization',
      subcategory: 'Containerization',
      content: `Containerization is a lightweight form of virtualization that packages an application and its dependencies into a standardized unit called a container. Unlike virtual machines, containers share the host operating system's kernel, making them faster, more portable, and more efficient.

Container vs VM Architecture:
VMs include a full guest OS, hypervisor layer, and virtual hardware — typically hundreds of MBs to GBs. Containers share the host kernel and include only the application and its dependencies — typically tens of MBs. This makes containers much lighter and faster to start.

Container Runtimes:
Docker is the most popular container runtime and platform. containerd is an industry-standard container runtime used by Docker and Kubernetes. CRI-O is a lightweight container runtime specifically for Kubernetes. runc is the low-level runtime that actually creates and runs containers.

Container Images:
Container images are built in layers using a Dockerfile. Each layer represents a filesystem change. Layers are cached and shared between images for efficiency. Images are stored in registries (Docker Hub, AWS ECR, Azure ACR, Google AR). Image scanning identifies security vulnerabilities.

Container Orchestration:
Kubernetes is the leading container orchestration platform. Docker Swarm provides simpler orchestration built into Docker. Amazon ECS is AWS's proprietary container orchestration service. Orchestrators handle scheduling, scaling, networking, and health management.

Microservices Architecture:
Containers enable microservices by packaging each service independently. Services communicate through APIs (REST, gRPC) or message queues. Each service can be developed, deployed, and scaled independently. Service mesh technologies (Istio, Linkerd) manage inter-service communication.

Container Networking:
Container networking connects containers to each other and external systems. Container Network Interface (CNI) provides a standard for networking plugins. Overlay networks enable cross-host container communication. Service discovery helps containers find each other dynamically.

Container Storage:
Containers are ephemeral by default — data is lost when the container stops. Volumes provide persistent storage that outlives the container. Storage drivers manage the container's writable layer. CSI (Container Storage Interface) standardizes storage integration in Kubernetes.

Container Security:
Run containers as non-root users. Use minimal base images to reduce attack surface. Scan images for vulnerabilities regularly. Implement network policies to control traffic. Use secrets management for sensitive data. Apply runtime security with tools like Falco. Use Pod Security Standards in Kubernetes.

Benefits of Containerization:
Portability across development, testing, and production. Fast deployment and scaling. Efficient resource utilization. Simplified dependency management. Improved developer productivity. Better CI/CD integration. Consistent environments.

Best Practices:
One process per container. Keep images small. Use multi-stage builds. Implement health checks. Set resource limits. Use immutable container images. Implement proper logging. Scan images for vulnerabilities. Use orchestration for production.`,
      metadata: { difficulty: 'intermediate', tags: ['containerization', 'docker', 'microservices', 'cloud-computing'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'virt-cloud-networking',
      title: 'Cloud Networking Fundamentals',
      category: 'Virtualization',
      subcategory: 'Cloud Networking',
      content: `Cloud networking refers to the infrastructure, services, and technologies used to connect cloud resources, users, and on-premises environments. It encompasses virtual networks, load balancing, DNS, CDN, and hybrid connectivity solutions.

Virtual Networks:
Cloud virtual networks provide isolated network environments. AWS VPC, Azure VNet, and GCP VPC create private network spaces. Subnets segment networks into smaller address ranges. Route tables control traffic flow between subnets and external destinations. CIDR notation defines IP address ranges.

Network Security:
Security groups (AWS, GCP) and NSGs (Azure) act as virtual firewalls. They control inbound and outbound traffic at the instance/VM level. Network ACLs provide subnet-level traffic filtering. Cloud firewalls (AWS Network Firewall, Azure Firewall, GCP Cloud Firewall) offer advanced features like intrusion detection and URL filtering.

Load Balancing:
Layer 4 (TCP/UDP) load balancers distribute traffic based on IP and port. Layer 7 (HTTP/HTTPS) load balancers route based on content (URL path, host header, headers). Global load balancers distribute traffic across regions. Cloud providers offer managed load balancing services.

DNS Services:
Cloud DNS services translate domain names to IP addresses. AWS Route 53, Azure DNS, and GCP Cloud DNS provide managed DNS hosting. Advanced routing policies (weighted, latency-based, geolocation, failover) optimize traffic distribution. Private DNS zones provide internal name resolution.

Content Delivery Networks (CDN):
CDNs cache content at edge locations worldwide. AWS CloudFront, Azure CDN, and GCP Cloud CDN reduce latency and improve performance. Edge computing processes data closer to users. CDNs also provide DDoS protection and SSL termination.

Hybrid Connectivity:
VPN connections create encrypted tunnels over the internet. Dedicated connections (AWS Direct Connect, Azure ExpressRoute, GCP Cloud Interconnect) provide private, high-bandwidth links. SD-WAN integrates with cloud networking for branch connectivity. Transit gateways (AWS Transit Gateway, Azure Virtual WAN) centralize network connectivity.

Network Monitoring:
Flow logs capture network traffic metadata for analysis. Network monitoring tools visualize traffic patterns. Performance monitoring detects latency and packet loss. Security monitoring identifies suspicious network activity.

Software-Defined Networking (SDN):
SDN separates the control plane from the data plane. This enables programmatic network configuration. Network functions can be deployed as software (NFV). APIs allow automated network management.

Network Performance:
Bandwidth allocation determines throughput capacity. Latency is affected by distance, routing, and network congestion. MTU (Maximum Transmission Unit) affects packet efficiency. Jumbo frames improve throughput for large data transfers.

Best Practices:
Use private subnets for internal resources. Implement defense in depth with multiple security layers. Use load balancers for high availability. Enable flow logs for monitoring. Use private connectivity for sensitive traffic. Implement DNS failover for resilience. Monitor network performance continuously. Use CDN for static content delivery.`,
      metadata: { difficulty: 'intermediate', tags: ['networking', 'cloud-networking', 'infrastructure', 'cloud-computing'], lastUpdated: '2024-01-15' }
    },
    {
      id: 'virt-deployment-models',
      title: 'Cloud Deployment Models',
      category: 'Virtualization',
      subcategory: 'Cloud Deployment Models',
      content: `Cloud deployment models define how cloud infrastructure is provisioned and made available to users. The four primary deployment models — Public, Private, Hybrid, and Multi-Cloud — each have distinct characteristics, advantages, and use cases.

Public Cloud:
Public cloud services are provided by third-party providers over the public internet. Resources are shared among multiple tenants (multi-tenancy). AWS, Microsoft Azure, and Google Cloud Platform are the three largest public cloud providers. Benefits include no upfront capital expenditure, pay-as-you-go pricing, elastic scalability, global reach, and managed services. Challenges include limited customization, potential compliance concerns, shared infrastructure risks, and vendor lock-in.

Private Cloud:
Private cloud infrastructure is dedicated to a single organization. It can be hosted on-premises or by a third-party provider. Private clouds provide greater control, customization, and security. Benefits include complete control over infrastructure, enhanced security and compliance, customizable to specific requirements, and dedicated performance. Challenges include higher capital and operational costs, limited scalability, maintenance responsibility, and need for specialized IT staff.

Hybrid Cloud:
Hybrid cloud combines public and private cloud environments connected through networking. Data and applications move between the two environments. Benefits include workload flexibility, cost optimization, compliance capabilities, and gradual cloud migration. Challenges include complex management, networking complexity, security across environments, and data governance.

Multi-Cloud:
Multi-cloud uses services from multiple public cloud providers. Organizations may use AWS for compute, Azure for identity, and GCP for analytics. Benefits include avoiding vendor lock-in, best-of-breed services, geographic coverage, and resilience. Challenges include increased complexity, skills requirements, cost management across providers, and data portability.

Service Models:
Infrastructure as a Service (IaaS) provides virtual machines, storage, and networking. Platform as a Service (PaaS) provides runtime environments for application deployment. Software as a Service (SaaS) provides complete applications accessed via the internet. Function as a Service (FaaS) provides serverless compute for event-driven code.

Edge Computing:
Edge computing processes data closer to where it's generated. It reduces latency and bandwidth usage. AWS Outposts, Azure Stack Edge, and Google Distributed Cloud extend cloud to the edge. Use cases include IoT, real-time analytics, content delivery, and AR/VR.

Cloud-Native Architecture:
Cloud-native applications are designed specifically for cloud environments. They use microservices, containers, and serverless computing. CI/CD enables rapid, automated deployments. Infrastructure as Code (IaC) manages infrastructure programmatically. The twelve-factor app methodology guides cloud-native design.

Choosing a Deployment Model:
Consider security and compliance requirements. Evaluate cost implications (CapEx vs OpEx). Assess performance and latency needs. Consider existing infrastructure investments. Evaluate team skills and capabilities. Plan for future growth and flexibility.

Migration Strategies:
The 7 Rs of migration: Refactor, Replatform, Repurchase, Rehost (lift and shift), Relocate, Retain, and Retire. Cloud adoption frameworks from AWS, Azure, and GCP provide structured migration approaches. Migration tools automate discovery, assessment, and migration.

Best Practices:
Start with a cloud strategy aligned to business goals. Choose deployment models based on workload requirements. Implement cloud governance frameworks. Use landing zones for consistent deployments. Plan for disaster recovery across environments. Monitor costs and optimize continuously. Build cloud skills within the organization.`,
      metadata: { difficulty: 'beginner', tags: ['cloud-computing', 'deployment-models', 'architecture', 'strategy'], lastUpdated: '2024-01-15' }
    }
  ];
}

/**
 * Generate all documents and save to the documents folder
 * @returns {Array} Array of generated document objects
 */
async function generateDocuments() {
  // Create documents directory if it doesn't exist
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    fs.mkdirSync(DOCUMENTS_DIR, { recursive: true });
  }

  // Check if documents already exist
  const existingFiles = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.json'));
  if (existingFiles.length >= 50) {
    logger.info(`Documents already exist (${existingFiles.length} files). Skipping generation.`);
    // Load and return existing documents
    return existingFiles.map(file => {
      const content = fs.readFileSync(path.join(DOCUMENTS_DIR, file), 'utf-8');
      return JSON.parse(content);
    });
  }

  logger.info('Generating cloud computing knowledge documents...');
  const documents = getDocuments();

  // Save each document as a JSON file
  for (const doc of documents) {
    const filename = `${doc.id}.json`;
    const filepath = path.join(DOCUMENTS_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(doc, null, 2), 'utf-8');
  }

  logger.success(`Generated ${documents.length} documents in ${DOCUMENTS_DIR}`);
  return documents;
}

/**
 * Load all documents from the documents folder
 * @returns {Array} Array of document objects
 */
function loadDocuments() {
  if (!fs.existsSync(DOCUMENTS_DIR)) {
    return [];
  }
  const files = fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.json'));
  return files.map(file => {
    const content = fs.readFileSync(path.join(DOCUMENTS_DIR, file), 'utf-8');
    return JSON.parse(content);
  });
}

/**
 * Get document count
 * @returns {number}
 */
function getDocumentCount() {
  if (!fs.existsSync(DOCUMENTS_DIR)) return 0;
  return fs.readdirSync(DOCUMENTS_DIR).filter(f => f.endsWith('.json')).length;
}

/**
 * Get document statistics
 * @returns {Object}
 */
function getDocumentStats() {
  const documents = loadDocuments();
  const categories = {};
  let totalWords = 0;

  documents.forEach(doc => {
    if (!categories[doc.category]) {
      categories[doc.category] = 0;
    }
    categories[doc.category]++;
    totalWords += doc.content.split(/\s+/).length;
  });

  return {
    totalDocuments: documents.length,
    totalWords,
    averageWordsPerDocument: Math.round(totalWords / (documents.length || 1)),
    categories
  };
}

module.exports = {
  generateDocuments,
  loadDocuments,
  getDocumentCount,
  getDocumentStats
};
