# Backend Engineering Roadmap

A structured list of the core topics to learn when building backend systems, from fundamentals to production-ready engineering.

---

## 1. Foundations

Start here and build a strong understanding of how backend systems work.

- [ ] High-level understanding
- [ ] HTTP protocol
- [ ] Routing
- [ ] Serialisation / Deserialisation
- [ ] Databases

---

## 2. Core Request Lifecycle

Understand what happens from the moment a request reaches your server until a response is returned.

- [ ] Middlewares
- [ ] Request context
- [ ] Validation and transformation
- [ ] Handlers, controllers and services
- [ ] CRUD deep dive
- [ ] RESTful architecture and best practices
- [ ] Error handling

---

## 3. Security & Access

Learn how backend applications authenticate users, control access and protect resources.

- [ ] Authentication and authorisation
- [ ] Security fundamentals
- [ ] Password hashing
- [ ] Sessions
- [ ] JWT
- [ ] Access tokens and refresh tokens
- [ ] Role-based access control (RBAC)
- [ ] Permissions
- [ ] CORS
- [ ] CSRF
- [ ] XSS
- [ ] SQL Injection
- [ ] Rate limiting
- [ ] Input validation

---

## 4. Application Architecture

Learn how to structure backend applications so they remain maintainable as they grow.

- [ ] Business Logic Layer (BLL)
- [ ] Configuration management
- [ ] Environment variables
- [ ] Logging
- [ ] Monitoring
- [ ] Observability
- [ ] Testing
- [ ] Code quality
- [ ] Project structure
- [ ] Separation of concerns

---

## 5. Scaling & Real-World Systems

Move beyond basic CRUD applications and learn how production systems handle large amounts of traffic and data.

- [ ] Caching
- [ ] Redis
- [ ] Task queuing and scheduling
- [ ] Background jobs
- [ ] Message queues
- [ ] Retries and backoff
- [ ] Transactional emails
- [ ] Elasticsearch
- [ ] Concurrency and parallelism
- [ ] Object storage
- [ ] Large file handling
- [ ] Real-time backend systems
- [ ] WebSockets
- [ ] Scaling and performance
- [ ] Load balancing
- [ ] Graceful shutdown
- [ ] Health checks
- [ ] Performance optimisation
- [ ] Load testing

---

## 6. Standards & Professional Practice

Learn the practices and standards commonly used in professional backend development.

- [ ] OpenAPI standards
- [ ] API documentation
- [ ] Webhooks
- [ ] 12-Factor App
- [ ] DevOps for backend engineers
- [ ] Docker
- [ ] CI/CD
- [ ] Deployment
- [ ] Linux fundamentals
- [ ] Cloud fundamentals
- [ ] Reverse proxies
- [ ] SSL/TLS
- [ ] Infrastructure basics

---

# Recommended Learning Order

```text
Foundations
     ↓
HTTP & Routing
     ↓
Databases
     ↓
Request Lifecycle
     ↓
CRUD & REST APIs
     ↓
Authentication & Authorization
     ↓
Application Architecture
     ↓
Error Handling & Validation
     ↓
Testing
     ↓
Security
     ↓
Caching
     ↓
Background Jobs & Queues
     ↓
File Storage
     ↓
Real-time Systems
     ↓
Search / Elasticsearch
     ↓
Concurrency & Parallelism
     ↓
Performance & Scaling
     ↓
Observability
     ↓
OpenAPI & Webhooks
     ↓
Docker & DevOps
     ↓
Deployment & Cloud
```

---
---
# Backend Engineering — Beyond the Basics

> The uncomfortable truth first:
>
> 90% of backend engineers can build a CRUD API with authentication.
> That's the bar for being employable.
>
> The top 10% are the engineers who get called when things break at 3 AM,
> when the system needs to scale, or when a design decision has no obvious
> right answer.
>
> That level comes from **depth, debugging real systems, and understanding why**,
> not just knowing how to implement something.

---

## 🧠 Tier 1 — Non-Negotiable Depth

> Most people skip this. Don't.

### 1. Databases — Go Deep

Don't stop at:

> "I know how to write a JOIN."

Learn how databases actually behave.

- [ ] Indexing strategies
- [ ] B-Tree indexes
- [ ] Composite indexes
- [ ] Query optimization
- [ ] Query plans
- [ ] `EXPLAIN`
- [ ] Transactions
- [ ] ACID
- [ ] Transaction isolation levels
- [ ] Locks
- [ ] Deadlocks
- [ ] N+1 query problems
- [ ] Normalization
- [ ] Denormalization
- [ ] Connection pooling
- [ ] Read replicas
- [ ] Database replication
- [ ] Database migrations
- [ ] Database constraints

> **Why it matters:**  
> Deep database knowledge separates junior engineers from senior engineers
> more than knowing another framework.

---

### 2. Concurrency & Runtime Internals

Understand how your backend runtime actually works.

- [ ] Concurrency
- [ ] Parallelism
- [ ] Threads
- [ ] Processes
- [ ] Async programming
- [ ] Event loops
- [ ] Worker pools
- [ ] Race conditions
- [ ] Locks
- [ ] Deadlocks
- [ ] Atomic operations
- [ ] Shared state
- [ ] Connection pools
- [ ] Resource contention
- [ ] Backpressure

### Understand Your Runtime

For Node.js:

```text
JavaScript
    ↓
Event Loop
    ↓
Asynchronous I/O
    ↓
Worker Pool
    ↓
Multiple Processes / Instances