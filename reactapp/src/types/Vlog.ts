// types/VlogPage.ts

export interface Post {
	id: string;
	title: string;
	content: string;
	publishDate: string;
	featuredImage: string;
	tags: string[];
}

export interface AboutSection {
	title: string;
	image: string;
	description: string;
}

export interface PopularPost {
	title: string;
	image: string;
}

export interface VlogPageData {
	id: string;
	blogName: string;
	followText: string;
	posts: Post[];
	about: AboutSection;
	popularPosts: PopularPost[];
}
