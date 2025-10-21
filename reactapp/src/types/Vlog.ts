// types/VlogPage.ts

export interface BlogPost {
  id: number;
  title: string;
  description: string;
  date: string;
  image: string;
  content: string;
}

export interface AboutSection {
  title: string;
  image: string;
  description: string;
}

export interface VlogPageData {
id: number;
  blogName: string;
  posts: BlogPost[];
  about: AboutSection;
  popularPosts: string[]; // image URLs or descriptions
  followText: string;
}
