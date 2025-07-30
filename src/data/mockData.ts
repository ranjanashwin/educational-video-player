import { Video, Comment } from '@/types';

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    description: 'Learn the fundamentals of React Hooks and how to use useState, useEffect, and custom hooks in your applications.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnail: '',
    duration: '15:32',
    created_at: '2024-01-15T10:00:00Z',
    user_id: 'ashwin_ranjan',
    num_comments: 2,
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    description: 'Explore advanced TypeScript patterns including generics, utility types, and conditional types for better type safety.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: '',
    duration: '22:45',
    created_at: '2024-01-10T10:00:00Z',
    user_id: 'ashwin_ranjan',
    num_comments: 1,
  },
  {
    id: '3',
    title: 'CSS Grid Mastery',
    description: 'Master CSS Grid layout system with practical examples and real-world use cases for modern web design.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnail: '',
    duration: '18:20',
    created_at: '2024-01-08T10:00:00Z',
    user_id: 'ashwin_ranjan',
    num_comments: 0,
  },
  {
    id: '4',
    title: 'Node.js Best Practices',
    description: 'Learn industry best practices for building scalable and maintainable Node.js applications.',
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnail: '',
    duration: '25:10',
    created_at: '2024-01-05T10:00:00Z',
    user_id: 'ashwin_ranjan',
    num_comments: 0,
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    video_id: '1',
    user_id: 'ashwin_ranjan',
    content: 'Great explanation of React Hooks! This really helped me understand useState better.',
    created_at: '2024-01-16T10:00:00Z',
  },
  {
    id: '2',
    video_id: '1',
    user_id: 'ashwin_ranjan',
    content: 'The examples were very clear. Could you make a video about useContext next?',
    created_at: '2024-01-17T10:00:00Z',
  },
  {
    id: '3',
    video_id: '2',
    user_id: 'ashwin_ranjan',
    content: 'Advanced TypeScript concepts made simple. Thanks for sharing!',
    created_at: '2024-01-12T10:00:00Z',
  },
];