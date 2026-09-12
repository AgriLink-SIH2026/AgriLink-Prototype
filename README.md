# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.

# 🌾 AgriLink

### Smart Digital Agricultural Procurement Platform

AgriLink is a unified digital platform designed to simplify and digitize the agricultural procurement process by connecting **farmers and processing units** through a transparent, accessible, and efficient procurement workflow.

The platform addresses common challenges faced by farmers such as **long waiting times, lack of procurement information, unclear scheduling, fragmented records, and uncertainty about procurement status**.

AgriLink provides farmers with a simple digital interface along with **IVR-based access**, while processing units can manage procurement, capacity, scheduling, and farmer records through a centralized dashboard.

---

## 🎯 Smart India Hackathon 2026

**Problem Statement ID:** `SIH26032`

**Problem Statement:**
Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status.

**Theme:** Smart Automation
**Category:** Software

---

## 💡 Our Solution

AgriLink creates a connected procurement ecosystem where farmers can:

* Register their crops for procurement
* View available processing/procurement centers
* Check indicative crop prices before registering
* Book procurement slots
* Track procurement status
* Receive notifications and updates
* Access their procurement history
* View bills and payment information
* Access essential services through IVR

Processing units can:

* Manage registered farmers and crops
* Define procurement capacity
* Manage procurement queues
* Allocate and manage slots
* Monitor incoming procurement
* Track procurement progress
* Manage billing and payment records
* View procurement analytics

---

# 🚜 Key Features

## 👨‍🌾 Farmer Module

### 1. Simple Farmer Interface

A clean and easy-to-use interface designed for farmers with minimal technical complexity.

### 2. Crop Registration

Farmers can register crops for procurement by providing relevant crop and quantity information.

### 3. Price Visibility

Before registering for procurement, farmers can view the **indicative price/rate configured by the respective processing unit**.

This helps farmers make a more informed decision before entering the procurement process.

> Prices displayed on the platform are indicative unless explicitly locked by the processing unit.

### 4. Processing Center Discovery

Farmers can discover eligible procurement/processing centers based on the selected crop.

AgriLink follows a configurable structure:

**Crop → Processing Type → Eligible Processing Centers**

### 5. Dynamic Slot Booking

Instead of relying only on a static queue, AgriLink connects farmer demand with available processing capacity.

Slot allocation considers factors such as:

* Crop
* Estimated quantity
* Farmer requirement/readiness
* Processing-center capacity
* Available time slots
* Existing bookings
* Cancellations

When a farmer cancels a slot, the released capacity can be made available to other farmers.

### 6. Procurement Status Tracking

Farmers can track the progress of their procurement request through clear status stages.

Example:

```text
Registered
    ↓
Slot Allocated
    ↓
Scheduled
    ↓
Arrived at Center
    ↓
Procurement Completed
    ↓
Billing
    ↓
Payment
```

### 7. Notifications

Farmers receive important procurement updates such as:

* Slot confirmation
* Schedule changes
* Cancellation updates
* Procurement status
* Billing/payment updates

### 8. Procurement History

Farmers can access records of previous procurement transactions.

### 9. IVR Access

AgriLink provides an IVR-based alternative for farmers who may have limited smartphone access or internet connectivity.

Through IVR, farmers can access essential procurement services such as:

* Crop registration
* Slot availability
* Current booking status
* Rescheduling
* Cancellation
* Procurement status

This allows the procurement system to remain accessible beyond smartphone users.

---

# 🏭 Processing Unit / Factory Module

Processing units receive a centralized dashboard to manage procurement activities.

### Dashboard

Provides an overview of:

* Registered farmers
* Active procurement requests
* Available capacity
* Upcoming slots
* Completed procurements
* Pending transactions

### Farmer & Crop Management

Processing units can view and manage farmer and crop procurement records.

### Capacity Management

Processing units can define their available procurement capacity.

The system uses this information to support dynamic slot allocation.

### Procurement Queue

Processing units can monitor upcoming procurement requests and schedules.

### Dynamic Scheduling

Slots can be adjusted based on:

* Available processing capacity
* Farmer demand
* Quantity
* Cancellations
* Schedule availability

### Billing & Payment Records

The system maintains procurement-related billing and payment information.

### Analytics

Processing units can monitor basic procurement trends and operational data.

---

# 🌱 Supported Crops

AgriLink is designed around a configurable crop-to-processing-unit workflow.

### Original Cash Crops

* 🌾 Sugarcane → Sugar Factory
* 🧵 Cotton → Textile / Ginning Unit
* 🌻 Oilseeds → Oil Processing Factory

  * Mustard
  * Soybean
  * Sunflower
  * Groundnut
* 🍃 Tea / Coffee → Processing Unit

### Additional Crops

* 🍅 Tomato → Ketchup / Tomato Processing
* 🥔 Potato → Chips / Fries Processing
* 🍊 Orange → Juice / Fruit Processing

The architecture allows additional crops and processing units to be added without creating separate applications.

---

# ⚙️ Dynamic Procurement Engine

One of the key refinements in AgriLink is the **dynamic procurement allocation system**.

Instead of treating procurement as a simple fixed queue:

```text
Farmer → Queue → Factory
```

AgriLink considers both **farmer demand and processing-unit capacity**:

```text
                    ┌─────────────────┐
                    │ Farmer Demand   │
                    └────────┬────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Procurement Engine  │
                  └─────────┬───────────┘
                            │
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        Crop Type       Quantity       Readiness
             │              │              │
             └──────────────┼──────────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Factory Capacity    │
                  │ & Availability      │
                  └─────────┬───────────┘
                            │
                            ▼
                  ┌─────────────────────┐
                  │ Dynamic Slot        │
                  │ Allocation           │
                  └─────────┬───────────┘
                            │
                            ▼
                       Farmer Slot
```

This helps reduce unnecessary waiting and makes better use of available procurement capacity.

---

# 🔄 Procurement Workflow

```text
Farmer
   │
   ▼
Select Crop
   │
   ▼
View Indicative Prices
   │
   ▼
Select Eligible Processing Center
   │
   ▼
Enter Estimated Quantity
   │
   ▼
Check Available Slots
   │
   ▼
Dynamic Slot Allocation
   │
   ▼
Procurement Schedule
   │
   ▼
Farmer Arrives at Center
   │
   ▼
Procurement
   │
   ▼
Billing & Payment
   │
   ▼
Procurement History
```

---

# 📞 Multi-Channel Accessibility

AgriLink is designed around the principle:

> **Digital procurement should not depend entirely on smartphone access.**

Farmers can interact with the platform through:

### 📱 Web / Mobile Interface

For farmers who use smartphones and internet connectivity.

### ☎️ IVR

For farmers who prefer voice-based interaction or have limited access to smartphones/internet.

The goal is to provide the **same core procurement information through multiple access channels**.

---

# 🧠 What Makes AgriLink Different?

AgriLink does not claim that individual components such as digital records, notifications, factory dashboards, or IVR are completely new.

The focus of our innovation is the **integration and coordination of these components around the procurement lifecycle**.

### Our key refinement:

**Dynamic capacity-based procurement allocation**

The platform connects:

> **Farmer Demand + Crop + Quantity + Processing Capacity + Availability**

to dynamically support procurement-slot allocation.

At the same time, the farmer can access the procurement process through either a **simple digital interface or IVR**.

This creates a more accessible and coordinated procurement workflow rather than simply digitizing paperwork.

---

# 🏗️ System Architecture

```text
                 ┌───────────────────┐
                 │      Farmer       │
                 │ Web / Mobile / IVR│
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │   API / Backend   │
                 └─────────┬─────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       Procurement     Slot Engine    Notification
         Records       & Capacity       Service
             │             │
             └─────────────┼─────────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │     Database      │
                 └─────────┬─────────┘
                           │
                           ▼
                 ┌───────────────────┐
                 │ Factory Dashboard │
                 └───────────────────┘
```

---

# 🛠️ Technology Stack

### Frontend

* React
* TypeScript
* HTML
* CSS
* Tailwind CSS

### Backend

* Node.js / Express
  **or**
* Python / FastAPI

### Database

* PostgreSQL / MySQL

### Additional Technologies

* REST APIs
* Role-Based Authentication
* IVR / Voice Integration
* Notification Services
* Responsive UI

---

# 🔐 Security

AgriLink follows basic security principles including:

* Role-based access control
* Secure authentication
* Protected API endpoints
* Input validation
* Secure password handling
* Controlled access to farmer and procurement records
* Separation of farmer and processing-unit privileges

Sensitive information is only exposed to authorized users based on their role.

---

# 📂 Project Structure

The project is organized around the major components of the procurement ecosystem.

```text
AgriLink/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── layouts/
│   ├── services/
│   └── assets/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── middleware/
│
├── database/
│   ├── schema/
│   └── seed/
│
├── ivr/
│   └── services/
│
├── README.md
└── package.json
```

> The exact structure may vary depending on the final implementation.

---

# 🚀 Getting Started

## 1. Clone the Repository

```bash
git clone <repository-url>
cd AgriLink
```

## 2. Install Dependencies

For the frontend:

```bash
cd frontend
npm install
```

For the backend:

```bash
cd backend
npm install
```

## 3. Configure Environment Variables

Create a `.env` file and configure the required environment variables.

Example:

```env
DATABASE_URL=your_database_url
API_URL=your_api_url
AUTH_SECRET=your_secret
```

## 4. Start the Development Server

Frontend:

```bash
npm run dev
```

Backend:

```bash
npm run dev
```

---

# 🧪 Demo Flow

For demonstration purposes, the system can be tested using three primary perspectives:

### 👨‍🌾 Farmer

```text
Login
↓
Select Crop
↓
View Price
↓
Select Processing Center
↓
Enter Quantity
↓
Book Slot
↓
Track Procurement
↓
View Bill / Payment
```

### 🏭 Processing Unit

```text
Login
↓
View Capacity
↓
View Procurement Requests
↓
Manage Slots
↓
Monitor Arrivals
↓
Complete Procurement
↓
Manage Billing
```

### ☎️ IVR

```text
Call
↓
Language Selection
↓
Farmer Identification
↓
Select Service
↓
Check / Book / Reschedule / Cancel
↓
Receive Confirmation
```

---

# 🌍 Future Scope

AgriLink can be expanded with:

* Multilingual voice assistance
* Offline-first functionality
* SMS-based procurement updates
* Advanced demand forecasting
* Harvest and yield prediction
* Intelligent procurement optimization
* Shared transportation coordination
* More crop-specific procurement workflows
* Integration with additional processing units
* Advanced analytics for procurement planning

---

# 📈 Expected Impact

### For Farmers

* Reduced waiting time
* Better procurement visibility
* Easier slot booking
* Price awareness before registration
* Accessible procurement services through IVR
* Digital procurement history

### For Processing Units

* Better capacity utilization
* Organized procurement scheduling
* Improved farmer management
* Reduced manual coordination
* Better visibility into upcoming procurement demand

### System-Level Impact

AgriLink aims to make agricultural procurement **more transparent, predictable, accessible, and efficiently coordinated**.

---

# 👥 Team

### Team INFERNUS

Developed as part of **Smart India Hackathon 2026**.

**Project:** AgriLink
**Problem Statement ID:** SIH26032
**Category:** Software
**Theme:** Smart Automation

---

# 📜 License

This project is developed for **Smart India Hackathon 2026** and academic/project demonstration purposes.

---

## 🌾 AgriLink

### Connecting Farmers. Coordinating Procurement. Reducing the Wait.

> **From uncertain queues to coordinated procurement.**
