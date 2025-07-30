Educational Video Player Assessment

A fully featured educational video platform built with React, TypeScript, and Vite. This project highlights advanced video playback capabilities, custom controls, and a clean, professional interface designed for learning and content management.

Overview

This application provides a modern and responsive solution for streaming and managing educational videos. It supports multiple video platforms, includes a rich commenting system, and offers full CRUD operations for managing content.

The project demonstrates practical use of React 18, TypeScript, and Tailwind CSS, combined with best practices for performance, accessibility, and user experience.

Features

Video Playback
- Support for YouTube, Vimeo, and direct video files
- Custom controls (play/pause, volume, fullscreen, progress bar)
- Keyboard shortcuts (Space = play/pause, arrows = seek, F = fullscreen)
- Playback speed adjustments (0.75x – 2x)
- Fully responsive design across devices

Video Management
- Add new videos with title, description, and URL
- Edit and delete existing videos
- Grid and list view for browsing
- Advanced search and filter functionality

Interactive Comments
- Real-time commenting with optimistic updates
- User attribution for each comment
- Persistent storage with API integration

User Experience
- Clean, modern design with Tailwind CSS
- Framer Motion animations for smooth transitions
- Mobile-first responsive layout
- Accessible UI components (via Radix UI and shadcn/ui)

Tech Stack

Frontend: React 18 + TypeScript + Vite
Styling: Tailwind CSS + shadcn/ui + Radix UI
Icons: Lucide React
Animations: Framer Motion
Video: React Player with custom controls
State Management: React Hooks, Context API, and custom hooks

System Requirements

Node.js: 20+
npm: 9+ (or yarn)
Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
RAM: 4GB minimum (8GB recommended)
Storage: ~1GB free
OS: macOS 12+, Windows 10+, Linux

Getting Started

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd educational-video-player-assessment
npm install
```

Start the development server:

```bash
npm run dev
```

Build & Deployment

Development:
```bash
npm run dev
```

Production Build:
```bash
npm run build
```

Preview Production Build:
```bash
npm run preview
```

Type Checking:
```bash
npm run type-check
```

Project Structure

```
src/
├── components/           
│   ├── ui/              
│   ├── VideoCard.tsx
│   ├── VideoPlayer.tsx
│   ├── VideoThumbnail.tsx
│   ├── VideoPlayerControls.tsx
│   ├── CommentSection.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── VideosPage.tsx
│   ├── VideoPlayerPage.tsx
│   ├── NewVideoPage.tsx
│   └── VideoManagementPage.tsx
├── hooks/
│   ├── useVideoPlayer.ts
│   └── use-api.ts
├── contexts/
│   └── VideosContext.tsx
├── lib/
│   ├── api-client.ts
│   ├── video-utils.ts
│   └── error-handler.ts
├── types/
└── config/
```

Testing the Application

- Playback: Open /videos, select a video, and test custom controls + shortcuts
- Management: Use /videos/create to add content or /manage to edit existing videos
- Comments: Add and verify real-time updates on a video page
- Responsive Design: Test on desktop, tablet, and mobile devices

Performance Highlights

- Code Splitting & Tree Shaking via Vite
- Lazy Loading components for faster initial load
- Framer Motion animations optimized for smoothness
- Memoization to minimize unnecessary re-renders

Troubleshooting

Build errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

TypeScript issues:
```bash
npm run type-check
```

Vite dev server not responding:
```bash
rm -rf .vite
npm run dev
```

Contributing

This project was built as an assessment for ScopeLabs by Ashwin Ranjan.
It follows professional standards:

- Strict TypeScript configuration
- ESLint + Prettier for linting and formatting
- Modular and reusable component architecture
- Accessibility-first design principles

License

This project was created as part of a private assessment.
All rights reserved.

Built with care by Ashwin Ranjan for ScopeLabs

