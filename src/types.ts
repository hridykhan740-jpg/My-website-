export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link?: string;
  github?: string;
  createdAt: number;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  date: number;
  tags: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "Tools" | "Design" | "Other";
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
  createdAt: number;
}

export interface Visitor {
  id: string;
  email: string;
  name: string;
  photo: string;
  lastVisit: number;
  device: string;
  country?: string;
  visitCount: number;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: number;
  read: boolean;
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  detailedBio: string;
  heroImage: string;
  aboutImage: string;
  contactEmail: string;
  socials: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}
