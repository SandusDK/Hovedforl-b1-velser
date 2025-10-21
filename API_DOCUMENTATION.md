# Blog Search API Documentation

## Endpoint
**GET** `/api/BlogSearch/search?q={keyword}`

## Description
Searches for blog pages that match the keyword in the page itself OR its child blog posts. Returns complete `BlogPageData` objects with nested posts, about section, and randomly selected popular posts.

## Response Structure
- `BlogPageData`: Contains `Id`, `BlogName`, `FollowText`, `Posts[]`, `About`, and `PopularPosts[]`
- `BlogPost`: Contains `Id`, `Title`, `Content`, `PublishDate`, `FeaturedImage`, and `Tags[]`
- `AboutSection`: Contains `Title`, `Image`, and `Description`
- `PopularPost`: Contains `Title` and `Image`
