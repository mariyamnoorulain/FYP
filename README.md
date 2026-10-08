# FYP-LearnHUB

## AI-Powered Adaptive Interactive Video Learning Ecosystem with Multimodal Analytics

LearnHUB is an **AI-powered adaptive and interactive video learning ecosystem** designed to improve online learning by combining **video-based learning, learner behavior analysis, visual engagement signals, natural language processing, AI-generated assessments, and personalized learning recommendations**.

The system analyzes multiple sources of learner information—including **facial/visual signals, attention, interaction behavior, quiz performance, learning progress, and lecture content**—to understand how a student is learning and provide a more adaptive learning experience.

The core concept of LearnHUB is a closed learning loop:

> **Observe → Analyze → Assess → Adapt**

Instead of treating every learner in the same way, LearnHUB attempts to understand individual learner behavior and performance and use that information to support a more personalized learning experience.

---

## Table of Contents

* [Project Overview](#project-overview)
* [Problem Statement](#problem-statement)
* [Project Objectives](#project-objectives)
* [Key Features](#key-features)
* [System Concept](#system-concept)
* [Multimodal Analytics](#multimodal-analytics)
* [AI and Machine Learning Components](#ai-and-machine-learning-components)
* [Lecture Intelligence Pipeline](#lecture-intelligence-pipeline)
* [Adaptive Learning Engine](#adaptive-learning-engine)
* [System Architecture](#system-architecture)
* [Technology Stack](#technology-stack)
* [Major System Modules](#major-system-modules)
* [Database Design](#database-design)
* [Data Flow](#data-flow)
* [Learner Workflow](#learner-workflow)
* [Instructor Analytics](#instructor-analytics)
* [API and Backend Integration](#api-and-backend-integration)
* [Project Structure](#project-structure)
* [Installation and Setup](#installation-and-setup)
* [Environment Variables](#environment-variables)
* [Running the Project](#running-the-project)
* [AI Processing Workflow](#ai-processing-workflow)
* [Development Challenges](#development-challenges)
* [Privacy and Ethical Considerations](#privacy-and-ethical-considerations)
* [Limitations](#limitations)
* [Future Enhancements](#future-enhancements)
* [My Contribution](#my-contribution)
* [Academic Project](#academic-project)

---

# Project Overview

Traditional online learning platforms mainly provide recorded lectures, static quizzes, and basic progress tracking.

LearnHUB introduces an **adaptive learning approach** by combining different forms of learner and content data.

The platform can collect and analyze:

* Learner interaction data
* Video learning behavior
* Attention-related visual signals
* Facial/emotional signals
* Quiz performance
* Learning progress
* Lecture transcripts
* Lecture content
* Assessment results

These inputs are processed through different AI/ML and backend components to generate useful learning information such as:

* Lecture summaries
* Automatically generated quizzes
* Learner engagement information
* Performance analytics
* Learning recommendations
* Instructor insights

The objective is to create a learning environment that is more **interactive, measurable, and personalized** than a conventional video-learning platform.

---

# Problem Statement

Online video learning provides flexibility, but conventional video-learning systems have several limitations.

A typical platform may know whether a learner:

* Opened a lecture
* Watched a video
* Completed a quiz
* Obtained a particular score

However, it may not understand **how the learner was engaging with the material during the learning process**.

For example, a learner may watch a lecture but experience:

* Reduced attention
* Confusion
* Frustration
* Difficulty understanding particular concepts
* Poor assessment performance

Traditional systems generally do not combine these signals into a single learning model.

LearnHUB addresses this problem by integrating **multimodal learner analytics** with AI-powered content processing and adaptive learning mechanisms.

---

# Project Objectives

The major objectives of LearnHUB are:

1. Develop an interactive video-learning environment.
2. Analyze learner engagement using multimodal signals.
3. Process lecture content using Natural Language Processing.
4. Generate summaries from lecture transcripts.
5. Generate AI-assisted multiple-choice quizzes.
6. Track learner assessment performance.
7. Analyze learner progress and interaction behavior.
8. Provide personalized learning recommendations.
9. Provide instructors with meaningful learner analytics.
10. Build an architecture capable of connecting frontend, backend, database, and AI/ML services.

---

# Key Features

## 1. Interactive Video Learning

Learners can access educational video lectures through the platform.

The system can associate learning activity with a specific lecture and learning session.

---

## 2. Lecture Transcription

Lecture audio/video content can be processed to obtain a textual transcript.

The transcript becomes the foundation for downstream NLP and AI processing.

### Processing Flow

```text
Lecture Video
      ↓
Audio / Speech Processing
      ↓
Transcript
      ↓
NLP Processing
      ↓
Summary + Questions + Learning Content
```

---

## 3. AI-Generated Lecture Summaries

Lecture transcripts can be processed to generate concise summaries.

The purpose is to help learners quickly review important concepts without watching the entire lecture again.

---

## 4. AI-Generated Quizzes

LearnHUB can use lecture transcripts/content to generate assessment questions.

The quiz pipeline is designed around:

```text
Lecture
   ↓
Transcript
   ↓
Content Processing
   ↓
AI Question Generation
   ↓
MCQs
   ↓
Learner Attempt
   ↓
Performance Analysis
```

The generated questions can then be associated with the relevant lecture and learner attempt.

---

## 5. Learner Performance Analysis

The system tracks assessment-related information such as:

* Quiz attempts
* Answers
* Scores
* Correct/incorrect responses
* Learning progress
* Interaction information

This information contributes to the learner's overall performance profile.

---

# Multimodal Analytics

One of the main aspects of LearnHUB is its **multimodal analytics approach**.

Instead of depending on a single data source, the system combines different categories of learner information.

### Multimodal Inputs

```text
                    ┌────────────────────┐
                    │   Learner Activity  │
                    └─────────┬──────────┘
                              │
             ┌────────────────┼────────────────┐
             ↓                ↓                ↓
       Visual Signals    Performance Data   Interaction Data
             │                │                │
             ↓                ↓                ↓
        Attention         Quiz Scores      Video Activity
        Emotions          Attempts         Progress
             │                │                │
             └────────────────┼────────────────┘
                              ↓
                    ┌────────────────────┐
                    │ Multimodal Analysis│
                    └─────────┬──────────┘
                              ↓
                    Adaptive Learning
                              ↓
                    Recommendations
```

---

# Visual Learner Analytics

LearnHUB explores webcam-based visual analytics to estimate learner engagement.

The visual-processing pipeline was developed around computer vision techniques.

Potential signals include:

* Facial landmarks
* Head position
* Eye-related features
* Attention-related behavior
* Facial expression/emotion signals

The system uses computer vision technologies such as:

* OpenCV
* MediaPipe
* YOLO-based visual processing

### General Processing Flow

```text
Webcam
   ↓
Video Frames
   ↓
OpenCV Processing
   ↓
Face / Landmark Detection
   ↓
Feature Extraction
   ↓
Attention / Emotion Analysis
   ↓
Learner Analytics
```

The purpose of this module is **not to continuously store raw video**, but to derive meaningful learning-related signals from visual information.

---

# Attention Analysis

Attention-related analysis can use visual features such as:

* Face presence
* Head orientation
* Eye/landmark information
* Facial positioning
* Interaction context

These signals can contribute to an estimated learner engagement/attention state.

For example:

```text
Visual Input
     ↓
Face Detection
     ↓
Landmark Detection
     ↓
Feature Extraction
     ↓
Attention Estimation
     ↓
Learning Session Analytics
```

---

# Emotion / Engagement Analysis

LearnHUB also explores facial-expression and emotion-related signals as part of its multimodal analytics component.

The objective is to identify possible learner states that may provide useful context about the learning experience.

Example conceptual states include:

* Engaged
* Neutral
* Distracted
* Confused
* Frustrated

These signals are treated as **analytics indicators**, rather than definitive statements about a learner's actual emotional state.

---

# Natural Language Processing

The second major AI component focuses on understanding lecture content.

Lecture transcripts can be processed using NLP techniques to extract useful educational information.

Technologies and approaches explored include:

* BERT
* TF-IDF
* LDA
* TextRank
* OpenAI API
* Transcript preprocessing
* Text summarization
* Question generation

---

# Lecture Intelligence Pipeline

The lecture-processing pipeline follows approximately:

```text
              Lecture Video
                    │
                    ↓
            Speech Transcription
                    │
                    ↓
              Raw Transcript
                    │
                    ↓
            Text Preprocessing
                    │
          ┌─────────┴──────────┐
          ↓                    ↓
     Summarization        Question Generation
          │                    │
          ↓                    ↓
   Lecture Summary          MCQ Dataset
          │                    │
          └──────────┬─────────┘
                     ↓
              Learning Platform
```

---

# Transcript and AI Quiz Pipeline

A major backend workflow developed for the project connects lecture processing, storage, and AI-generated assessment.

The conceptual workflow is:

```text
Cloudinary
    ↓
Lecture / Video
    ↓
MongoDB Lecture Record
    ↓
Python Transcript Processing
    ↓
Lecture Transcript
    ↓
AI Processing
    ↓
MCQ Generation
    ↓
Quiz Data
    ↓
Database
    ↓
Frontend
```

The system uses the lecture transcript as contextual information for generating questions relevant to the lecture.

---

# Adaptive Learning Engine

The adaptive component combines learner information to support personalized learning decisions.

The conceptual adaptive model considers:

* Quiz score
* Attention signals
* Emotion/engagement signals
* Learning progress
* Video interactions
* Assessment performance

### Adaptive Learning Loop

```text
             ┌──────────────────────┐
             │       Observe        │
             │ Learner interactions │
             │ Visual signals       │
             │ Performance         │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │       Analyze        │
             │ AI/ML + Analytics    │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │       Assess         │
             │ Performance + State  │
             └──────────┬───────────┘
                        ↓
             ┌──────────────────────┐
             │        Adapt         │
             │ Recommendations      │
             │ Learning Support     │
             └──────────┬───────────┘
                        │
                        └──────→ Observe
```

This creates the core **closed-loop learning architecture** of LearnHUB.

---

# System Architecture

At a high level, LearnHUB consists of four major layers.

```text
┌──────────────────────────────────────────────┐
│                Presentation Layer             │
│                                              │
│ React.js / JavaScript                        │
│ Video Player                                 │
│ Quiz Interface                               │
│ Learner Dashboard                            │
│ Instructor Dashboard                         │
└──────────────────────┬───────────────────────┘
                       │
                       ↓
┌──────────────────────────────────────────────┐
│                Application Layer              │
│                                              │
│ REST APIs                                    │
│ Authentication / User Management             │
│ Course & Lecture Management                  │
│ Quiz Management                               │
│ Progress Tracking                             │
└──────────────────────┬───────────────────────┘
                       │
          ┌────────────┼────────────┐
          ↓            ↓            ↓
┌────────────────┐ ┌────────────┐ ┌───────────────┐
│ AI/ML Services │ │ Databases  │ │ Media Storage │
│                │ │            │ │               │
│ Python         │ │ MongoDB    │ │ Cloudinary    │
│ OpenCV         │ │ SQL/MySQL  │ │               │
│ MediaPipe      │ │            │ │               │
│ NLP            │ │            │ │               │
│ AI APIs        │ │            │ │               │
└────────────────┘ └────────────┘ └───────────────┘
```

---

# Technology Stack

## Frontend

* React.js
* JavaScript
* HTML5
* CSS
* Responsive UI
* Interactive video components

## Backend

* Python
* REST APIs
* Backend services
* API integration

## Databases

* MongoDB
* MySQL / SQL
* Structured learning and analytics data

## AI / Machine Learning

* Python
* OpenCV
* MediaPipe
* YOLO-based computer vision
* NLP techniques
* BERT
* TF-IDF
* LDA
* TextRank
* OpenAI API

## Media

* Cloudinary

## Development Tools

* Git
* GitHub
* VS Code
* Python development environment

---

# Major System Modules

## 1. User Management

Manages learner and instructor information.

Potential roles include:

* Student/Learner
* Instructor
* Administrator

---

## 2. Course Management

Responsible for:

* Courses
* Lectures
* Videos
* Course enrollment
* Lecture metadata

---

## 3. Interactive Video Module

Responsible for:

* Video playback
* Lecture access
* Learner interaction
* Session tracking
* Video-related analytics

---

## 4. Computer Vision Module

Responsible for processing webcam frames and extracting visual learning signals.

Main technologies:

```text
OpenCV
MediaPipe
YOLO
```

---

## 5. NLP Module

Responsible for:

* Transcript processing
* Text analysis
* Summarization
* Content extraction
* Question generation

---

## 6. Quiz Module

Responsible for:

* Quiz creation
* Question management
* Answer options
* Quiz attempts
* Score calculation
* Performance tracking

---

## 7. Recommendation / Adaptive Module

Uses learner information to identify potential learning needs and provide adaptive recommendations.

---

## 8. Analytics Module

Aggregates learner information and presents useful analytics.

---

## 9. Instructor Dashboard

Provides instructors with information about learner performance and engagement.

Potential analytics include:

* Quiz performance
* Learning progress
* Engagement trends
* Attention-related signals
* Learner activity
* Assessment outcomes

---

# Database Design

LearnHUB requires both structured and flexible data storage.

Major logical entities include:

```text
Users
│
├── Roles
│
├── Courses
│     └── Videos / Lectures
│
├── Enrollments
│
├── Quizzes
│     ├── Questions
│     ├── Options
│     └── Attempts
│            └── Answers
│
├── Learning Sessions
│
├── Emotion Data
│
├── Attention Data
│
├── Interaction Data
│
├── Student Performance
│
└── Recommendations
```

---

# Logical Data Model

### Users

Stores learner/instructor information.

### Courses

Stores course-level information.

### Lectures

Stores lecture/video information.

### Enrollments

Connects learners with courses.

### Quizzes

Stores assessments associated with lectures.

### Questions

Stores quiz questions.

### Options

Stores answer options.

### Attempts

Stores individual learner attempts.

### Answers

Stores selected learner responses.

### Learning Sessions

Associates learner activity with a particular learning session.

### Emotion / Attention Data

Stores processed visual analytics associated with learning sessions.

### Interaction Data

Stores learner interactions with learning content.

### Student Performance

Stores aggregated performance information.

### Recommendations

Stores adaptive learning decisions or recommendations.

---

# Data Flow

The overall system data flow can be represented as:

```text
                    USER
                     │
                     ↓
              React Frontend
                     │
                     ↓
                 REST API
                     │
        ┌────────────┼─────────────┐
        ↓            ↓             ↓
     Lecture       Quiz        User Data
        │            │             │
        ↓            ↓             ↓
    Database     Database       Database
        │
        ↓
  AI Processing
        │
   ┌────┴─────────┐
   ↓              ↓
NLP Processing   CV Processing
   │              │
   ↓              ↓
Summary / MCQs   Attention /
                 Emotion Signals
   │              │
   └──────┬───────┘
          ↓
   Multimodal Analytics
          ↓
   Adaptive Engine
          ↓
 Recommendations /
 Learning Insights
          ↓
    Dashboards
```

---

# Learner Workflow

A typical learner journey is:

```text
1. Register / Login
        ↓
2. Select Course
        ↓
3. Open Lecture
        ↓
4. Watch Interactive Video
        ↓
5. Learning Activity Collected
        ↓
6. Visual Signals Processed
        ↓
7. Lecture Content Analyzed
        ↓
8. Complete AI-Generated Quiz
        ↓
9. Performance Calculated
        ↓
10. Multimodal Analytics
        ↓
11. Adaptive Feedback / Recommendations
```

---

# Instructor Workflow

The instructor workflow includes:

```text
Instructor
    ↓
Create / Manage Course
    ↓
Upload Lecture
    ↓
Lecture Processing
    ↓
Transcript Generation
    ↓
AI Content Generation
    ↓
Quiz / Summary
    ↓
Learner Activity
    ↓
Analytics
    ↓
Instructor Dashboard
```

---

# Instructor Analytics Dashboard

The instructor dashboard is designed to convert raw learner data into understandable insights.

The dashboard can provide information related to:

### Learner Performance

* Quiz scores
* Attempts
* Correct/incorrect answers
* Performance trends

### Engagement

* Video interactions
* Learning sessions
* Attention-related information
* Activity patterns

### Progress

* Course completion
* Lecture progress
* Assessment progress

### Learning Insights

The combination of these metrics can help instructors identify learners who may require additional support.

---

# API and Backend Integration

LearnHUB follows a modular architecture in which the frontend communicates with backend services through APIs.

Typical communication:

```text
React Frontend
      │
      │ HTTP Request
      ↓
REST API
      │
      ├── User Service
      ├── Course Service
      ├── Lecture Service
      ├── Quiz Service
      ├── Analytics Service
      └── AI Services
             │
             ↓
       Python / AI Processing
```

This separation allows the frontend, backend, database, and AI modules to be developed and debugged independently.

---

# Project Structure

A conceptual project structure is:

```text
LearnHUB/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── assets/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── services/
│   └── server/
│
├── ai/
│   ├── computer_vision/
│   ├── emotion_detection/
│   ├── attention_detection/
│   ├── nlp/
│   ├── summarization/
│   └── quiz_generation/
│
├── database/
│   ├── schemas/
│   └── queries/
│
├── docs/
│
├── .env.example
├── README.md
└── .gitignore
```

> The exact directory structure may vary depending on the implementation branch/version.

---

# Installation and Setup

## Prerequisites

Before running LearnHUB, install:

* Node.js
* npm
* Python 3.x
* MongoDB
* MySQL, where applicable
* Git

For computer vision functionality, a compatible webcam is required.

---

# Clone the Repository

```bash
git clone <repository-url>
cd LearnHUB
```

---

# Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

---

# Python / AI Environment

Navigate to the AI/backend directory and create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```bash
venv\Scripts\activate
```

Install required packages:

```bash
pip install -r requirements.txt
```

Depending on the implementation, packages may include:

```text
numpy
opencv-python
mediapipe
pandas
scikit-learn
transformers
torch
requests
pymongo
```

---

# Environment Variables

Create a `.env` file based on the project's environment configuration.

Example:

```env
MONGODB_URI=your_mongodb_connection_string

MYSQL_HOST=your_mysql_host
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_database

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

OPENAI_API_KEY=your_openai_api_key

API_BASE_URL=your_backend_url
```

**Never commit real API keys, passwords, or database credentials to GitHub.**

---

# Running the Project

A typical development environment requires the following services:

### Frontend

```bash
npm run dev
```

### Backend

```bash
python <backend-entry-file>.py
```

### AI Services

Run the required Python AI-processing services according to the project configuration.

The exact commands depend on the final implementation and deployment configuration.

---

# AI Processing Workflow

The AI components of LearnHUB can be divided into two major pipelines.

## Pipeline 1 — Visual Analytics

```text
Webcam
   ↓
Frame Capture
   ↓
OpenCV
   ↓
Face / Landmark Detection
   ↓
Feature Extraction
   ↓
Attention / Emotion Analysis
   ↓
Analytics Data
   ↓
Database
```

## Pipeline 2 — Lecture Intelligence

```text
Video
   ↓
Speech-to-Text
   ↓
Transcript
   ↓
NLP Processing
   ↓
Summary
   +
Quiz Generation
   ↓
Database
   ↓
Learner
```

These pipelines eventually contribute to the multimodal learning analytics layer.

---

# Development Challenges

Developing LearnHUB required integration between several independent technologies and services.

Some of the major technical challenges encountered during development included:

## 1. AI Service Integration

Connecting AI processing with the web application required communication between:

* Frontend
* Backend
* Python services
* Databases
* External AI APIs

---

## 2. Webcam Processing

Real-time webcam processing introduced challenges related to:

* Frame processing
* Face detection
* Landmark detection
* Lighting conditions
* Camera angle
* Model accuracy
* Performance

---

## 3. Backend-to-Database Communication

The visual analytics pipeline required processed information to move from Python processing into the application's database.

This created challenges around:

```text
Frame
 ↓
Prediction
 ↓
Backend
 ↓
Database
 ↓
Analytics
```

Maintaining reliable communication across these components was an important part of the system development.

---

## 4. AI API Rate Limits

During AI-powered quiz generation, the OpenAI API returned an HTTP `429` response because of quota/rate-limit limitations.

This demonstrated an important real-world consideration when integrating external AI services into an application.

The architecture therefore treats AI processing as a separate service rather than tightly coupling the entire application to a single external API.

---

## 5. Python Environment Dependencies

AI components also required correct Python environments and dependencies.

For example, the project encountered dependency-related execution errors such as:

```text
ModuleNotFoundError: No module named 'numpy'
```

This highlighted the importance of maintaining a reproducible Python environment for computer vision and AI modules.

---

# Privacy and Ethical Considerations

Because LearnHUB involves learner analytics and potentially webcam-based signals, privacy is an important consideration.

The system should follow principles such as:

### Consent

Learners should be informed before webcam-based analysis is activated.

### Data Minimization

Only information necessary for the intended analytics should be collected.

### Raw Video Protection

Raw webcam footage should not be unnecessarily stored.

### Secure Storage

Learner analytics and performance information should be protected from unauthorized access.

### Transparency

Learners and instructors should understand that emotion and attention predictions are estimates and can contain errors.

### Responsible AI

AI-generated recommendations should support learning rather than make high-impact judgments about a learner.

---

# Limitations

LearnHUB is a research/academic prototype and has several limitations.

## Computer Vision Limitations

Visual analytics can be affected by:

* Poor lighting
* Camera quality
* Camera angle
* Occlusion
* Face positioning
* Model limitations

Therefore, predicted attention or emotion should not be treated as perfectly accurate measurements.

---

## Webcam Dependency

Learner visual analytics depend on webcam availability.

If a learner does not have a webcam or does not provide camera access, those signals cannot be collected.

---

## AI API Dependency

External AI APIs may have:

* Rate limits
* Quotas
* Availability constraints
* Network dependencies

---

## Model Accuracy

Emotion and attention detection are inherently challenging problems.

The system's predictions depend on the quality and capabilities of the underlying models.

---

## Adaptive Learning

The adaptive engine depends on the quality and availability of learner data.

More reliable personalization would require larger datasets and extensive real-world evaluation.

---

# Future Enhancements

Future versions of LearnHUB can be extended with:

## Advanced Personalization

Use historical learner behavior to build stronger personalized learning models.

## Improved Multimodal Fusion

Develop dedicated multimodal machine-learning models that combine:

```text
Visual Data
+
Behavioral Data
+
Performance Data
+
Textual Data
```

into a unified learner representation.

## Real-Time Adaptive Content

Modify learning content dynamically according to learner performance and engagement.

## Improved Emotion Recognition

Evaluate and fine-tune models on education-specific datasets.

## Better Attention Estimation

Combine visual attention with interaction behavior instead of relying only on webcam signals.

## Recommendation Models

Introduce machine-learning-based recommendation systems for:

* Revision material
* Additional lectures
* Practice questions
* Difficult concepts
* Personalized learning paths

## Instructor Alerts

Automatically identify learners who may require additional support based on multiple indicators.

## Offline AI Models

Use locally hosted models where possible to reduce dependency on external APIs and improve privacy.

---

# My Contribution

As a contributor to LearnHUB, my work involved the **software engineering and AI/ML integration aspects** of the platform.

My responsibilities included working across multiple layers of the system, including:

### AI/ML Integration

* Integrated AI/ML components into the learning platform.
* Worked with computer vision pipelines for learner visual analytics.
* Explored attention and emotion-related analysis.
* Worked with NLP-based lecture processing.
* Integrated AI-assisted quiz generation.

### Backend Integration

* Connected frontend components with backend services.
* Worked with REST APIs.
* Integrated AI services with application workflows.
* Worked with database interactions.

### Data Processing

* Worked with learner performance information.
* Worked with lecture transcripts.
* Integrated learning-session analytics.
* Connected processed AI outputs with application data.

### Debugging and System Integration

* Debugged frontend/backend communication.
* Troubleshot Python environment and dependency issues.
* Worked on AI service integration problems.
* Investigated database communication issues.
* Connected independent modules into a unified application workflow.

---

# Technical Skills Demonstrated

Through LearnHUB, the project provided hands-on experience in:

```text
Software Engineering
        │
        ├── Frontend Development
        ├── Backend Development
        ├── REST APIs
        ├── Database Integration
        └── System Architecture
                │
                ↓
        Artificial Intelligence
                │
        ├── Computer Vision
        ├── NLP
        ├── AI APIs
        ├── Multimodal Analytics
        └── Adaptive Learning
```

The project therefore combines **software development, artificial intelligence, data processing, database engineering, and user-centered learning technology** into one system.

---

# Academic Project

**Project Name:** LearnHUB

**Project Title:**

> **AI-Powered Adaptive Interactive Video Learning Ecosystem with Multimodal Analytics**

**Project Type:** Final Year Project (FYP)

**Field:** Computer Science / Artificial Intelligence / Educational Technology

### Core Domains

* Artificial Intelligence
* Machine Learning
* Computer Vision
* Natural Language Processing
* Multimodal Analytics
* Adaptive Learning
* Web Development
* Database Systems
* Educational Technology

---

# Project Vision

LearnHUB aims to move online learning from a simple:

> **"Watch → Complete Quiz"**

model toward a more intelligent:

> **"Observe → Understand → Assess → Adapt"**

learning ecosystem.

By combining learner behavior, visual signals, assessment performance, lecture content, and AI-based analysis, LearnHUB demonstrates how multimodal artificial intelligence can be integrated into an educational platform to create a more **interactive, measurable, and adaptive learning experience**.

---

# Conclusion

LearnHUB demonstrates the integration of multiple modern technologies into a unified educational ecosystem.

The project combines:

* Interactive video learning
* Computer vision
* Attention and emotion analysis
* Natural language processing
* AI-generated summaries
* AI-generated quizzes
* Learner performance analytics
* Adaptive learning
* Instructor dashboards
* Database systems
* REST APIs
* Full-stack web development

The central idea of LearnHUB is that a learning platform should not only deliver educational content—it should also **understand learner interaction, analyze learning behavior, evaluate performance, and use those insights to improve the learning experience.**

---

## LearnHUB

**AI-Powered Adaptive Interactive Video Learning Ecosystem with Multimodal Analytics**

> **Observe → Analyze → Assess → Adapt**
