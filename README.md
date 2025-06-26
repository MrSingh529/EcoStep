# EcoStep: Understand and Reduce Your Environmental Impact

<p align="center">
  <img src="https://placehold.co/1200x630.png" alt="EcoStep App Screenshot" data-ai-hint="nature app"/>
</p>

**EcoStep** is a modern, AI-powered web application designed to help environmentally conscious individuals understand, track, and reduce their carbon footprint. By logging daily activities across various categories, users gain valuable insights into their environmental impact through rich visualizations. The app provides personalized, actionable recommendations and a suite of AI tools to foster a more sustainable lifestyle, all while making the journey fun with gamification and community features.

## ✨ Features In-Depth

EcoStep is packed with features to make sustainability engaging, data-driven, and achievable.

### 1. 📊 Interactive Dashboard
The dashboard is the user's central hub, providing a comprehensive overview at a glance.
- **Impact Summary Cards:** Key metrics like "Today's Footprint," "Weekly Footprint," and potential CO2e savings are displayed prominently.
- **Gamification Status:** Tracks user level, XP progress towards the next level, and their current daily login streak.
- **Impact Charts:**
  - **Overview Chart:** A bar chart breaking down the estimated monthly footprint by category (Transport, Energy, etc.).
  - **Progress Chart:** A line chart showing the user's total footprint over time, visualizing their progress.
- **Activity Status:** Prompts users to log their daily activities and shows a summary of recent entries.
- **Milestones & Challenges:** Displays unlocked achievements and active community challenges the user has joined.
- **Daily Quote:** An AI-generated inspirational quote to keep users motivated.

### 2. ✍️ Activity & Impact Logging
The core of the app, allowing users to quantify their daily habits.
- **Categorized Logging:** Users can log data across five key areas: Transportation, Energy, Waste, Water, and Food.
- **Intuitive Forms:** Uses sliders, radio buttons, and clear inputs to make data entry fast and easy.
- **Dynamic Calculations:** The app instantly calculates the CO2e (carbon dioxide equivalent) for each entry, providing immediate feedback.

### 3. 🤖 AI Hub (Powered by Genkit)
A suite of intelligent tools to guide users on their sustainability journey.
- **Personalized Eco-Tips:** The AI analyzes a user's latest activity log and generates custom-tailored tips to help them reduce their impact.
- **Product Analyzer:** Users can enter a product name or upload a photo, and the AI will provide an eco-friendliness score (1-10), a summary, pros, cons, and sustainable alternatives.
- **Eco-Recipe Generator:** Users can specify dietary needs, cuisine types, and available ingredients to generate unique, low-impact recipes complete with instructions and a sustainability tip.
- **Learn Section:** An educational corner where users can select environmental topics (e.g., "What is Fast Fashion?") and receive a well-structured, AI-generated article.
- **Local Recommendations:** By providing their country, users can get AI-generated tips tailored to their region's specific environmental context (e.g., local recycling programs, conservation efforts).

### 4. 🌍 Community & Gamification
Features designed to make sustainability a collaborative and rewarding experience.
- **Gamification Engine:**
  - **XP & Levels:** Earn experience points for logging activities, which helps users level up.
  - **Daily Streaks:** Stay motivated by logging consistently to build a streak.
  - **Milestones:** Unlock achievements for reaching key goals (e.g., "First Steps," "Green Commuter").
- **Community Hub:**
  - **Global Leaderboard:** A public leaderboard ranking the top "Earth Guardians" by their total XP.
  - **Community Challenges:** Users can join collective goals (e.g., "Energy Saver Week") to make a bigger impact together.

### 5. 👤 User Management
Secure and personalized user accounts powered by Firebase.
- **Authentication:** Secure sign-up and login with Email/Password.
- **Onboarding:** A guided, multi-step questionnaire to establish a baseline carbon footprint for new users, creating a starting point for their journey.
- **Profile Management:** Users can update their display name, country (for local recommendations), and other personal details.

### 6. 🎨 UI & UX
A clean, modern, and user-friendly interface.
- **Responsive Design:** A mobile-first layout that works beautifully on all devices, from phones to desktops.
- **Dark/Light Mode:** A theme toggle allows users to choose their preferred mode for optimal readability.
- **Custom Fonts:** Uses the "Caveat" font for headlines to give the app a unique, personal touch, paired with "Inter" for clarity.

## 🛠️ Tech Stack

This project is built with a modern, robust, and scalable tech stack:

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN UI](https://ui.shadcn.com/)
- **AI Integration:** [Genkit](https://firebase.google.com/docs/genkit) (with Google's Gemini models)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication & Firestore)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for schema validation.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/en) (v18 or later)
- [npm](https://www.npmjs.com/) (or yarn/pnpm)

### 2. Firebase Setup

For the app to function correctly, you must configure a Firebase project.

#### A. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click "Add project" and follow the on-screen instructions.

#### B. Set Up Authentication
1. In your new project, go to the **Authentication** section.
2. Click "Get started".
3. Under the "Sign-in method" tab, enable the **Email/Password** provider.

#### C. Set Up Firestore
1. Go to the **Firestore Database** section.
2. Click "Create database" and start in **production mode**.
3. Choose a location for your database.

#### D. Environment Variables
1. In your Firebase project settings (click the gear icon > Project settings), find the "Your apps" section.
2. Click the web icon (`</>`) to create a new web app.
3. Register the app and you will be given a `firebaseConfig` object.
4. Create a `.env` file in the root of the project. Copy the keys from the `firebaseConfig` object into this file.

```env
# .env
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="your-measurement-id"
```

#### E. Firestore Security Rules
The database requires rules to protect user data.
1. Copy the contents of the `firestore.rules` file in this project.
2. Paste them into the **Firestore Database > Rules** tab in your Firebase console.
3. Click **Publish**.

### 3. Running Locally

Once your environment variables are set, you can install the dependencies and run the development server.

```sh
# Clone the repository (if you haven't already)
# git clone <repository-url>
# cd <repository-name>

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
