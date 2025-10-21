using System.Collections.Generic;
using System.Linq;
using Examine;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;
using Umbraco.Extensions;

namespace UmbracoCMS2.Services;

public interface IBlogSearchService
{
    IEnumerable<BlogPageData> SearchBlogs(string query);
}

public class BlogSearchService : IBlogSearchService
{
    private readonly IExamineManager _examineManager;
    private readonly UmbracoHelper _umbracoHelper;

    public BlogSearchService(IExamineManager examineManager, UmbracoHelper umbracoHelper)
    {
        _examineManager = examineManager;
        _umbracoHelper = umbracoHelper;
    }

    public IEnumerable<BlogPageData> SearchBlogs(string query)
    {
        var results = new List<BlogPageData>();

        if (string.IsNullOrWhiteSpace(query))
            return results;

        if (!_examineManager.TryGetIndex("ExternalIndex", out IIndex index))
            return results;

        // Search for blog pages
        var pageSearchQuery = index
            .Searcher
            .CreateQuery("content")
            .NodeTypeAlias("blogPage");

        var fuzzyQuery = query.Trim() + "~";
        var wildcardQuery = query.Trim() + "*";

        var pageSearchResults = pageSearchQuery
            .And()
            .Group(q => q
                .GroupedOr(new[] { "nodeName", "blogName", "followText" }, query)
                .Or()
                .GroupedOr(new[] { "nodeName", "blogName", "followText" }, fuzzyQuery)
                .Or()
                .GroupedOr(new[] { "nodeName", "blogName", "followText" }, wildcardQuery)
            )
            .Execute();

        // Search for blog posts
        var postSearchQuery = index
            .Searcher
            .CreateQuery("content")
            .NodeTypeAlias("blogPost");

        var postSearchResults = postSearchQuery
            .And()
            .Group(q => q
                .GroupedOr(new[] { "nodeName", "title", "content" }, query)
                .Or()
                .GroupedOr(new[] { "nodeName", "title", "content" }, fuzzyQuery)
                .Or()
                .GroupedOr(new[] { "nodeName", "title", "content" }, wildcardQuery)
            )
            .Or()
            .Group(q => q
                .Field("tags", query)
                .Or()
                .Field("tags", wildcardQuery)
            )
            .Execute();

        // Collect all matching blog page IDs
        var matchingPageIds = new HashSet<int>();

        // Add pages that match directly
        foreach (var result in pageSearchResults)
        {
            if (result.Id != null && int.TryParse(result.Id, out int pageId))
            {
                matchingPageIds.Add(pageId);
            }
        }

        // Add parent pages of matching posts
        foreach (var result in postSearchResults)
        {
            if (result.Id == null)
                continue;

            var postContent = _umbracoHelper.Content(result.Id);
            var parentContent = postContent?.Parent<IPublishedContent>();
            if (parentContent != null)
            {
                matchingPageIds.Add(parentContent.Id);
            }
        }

        // Get all blog posts for popular posts selection
        var allPosts = new List<BlogPost>();
        var allPostsQuery = index.Searcher.CreateQuery("content").NodeTypeAlias("blogPost").Execute();
        foreach (var postResult in allPostsQuery)
        {
            if (postResult.Id == null) continue;
            var postContent = _umbracoHelper.Content(postResult.Id);
            if (postContent == null) continue;

            var post = MapToBlogPost(postContent);
            if (post != null)
                allPosts.Add(post);
        }

        // Build BlogPageData for each matching page
        foreach (var pageId in matchingPageIds)
        {
            var pageContent = _umbracoHelper.Content(pageId);
            if (pageContent == null || pageContent.ContentType.Alias != "blogPage")
                continue;

            var blogPageData = new BlogPageData
            {
                Id = pageContent.Key.ToString(),
                BlogName = pageContent.HasProperty("blogName") ? pageContent.Value<string>("blogName") ?? pageContent.Name : pageContent.Name,
                FollowText = pageContent.HasProperty("followText") ? pageContent.Value<string>("followText") ?? string.Empty : string.Empty,
                Posts = new List<BlogPost>(),
                About = new AboutSection { Title = string.Empty, Image = string.Empty, Description = string.Empty },
                PopularPosts = new List<PopularPost>()
            };

            // Get child blog posts
            var childPosts = pageContent.Children()?.Where(c => c.ContentType.Alias == "blogPost");
            if (childPosts != null)
            {
                foreach (var childPost in childPosts)
                {
                    var post = MapToBlogPost(childPost);
                    if (post != null)
                        blogPageData.Posts.Add(post);
                }
            }

            // Get About section
            var aboutChild = pageContent.Children()?.FirstOrDefault(c => c.ContentType.Alias == "blogAboutMe");
            if (aboutChild != null)
            {
                var aboutSection = MapToAboutSection(aboutChild);
                if (aboutSection != null)
                    blogPageData.About = aboutSection;
            }

            // Generate popular posts - randomly select 3 posts from all posts (excluding current page posts)
            var otherPosts = allPosts.Where(p => !blogPageData.Posts.Any(bp => bp.Id == p.Id)).ToList();
            var random = new Random();
            var popularCount = Math.Min(3, otherPosts.Count);

            for (int i = 0; i < popularCount; i++)
            {
                if (otherPosts.Count == 0) break;
                var randomIndex = random.Next(otherPosts.Count);
                var popularPost = otherPosts[randomIndex];
                blogPageData.PopularPosts.Add(new PopularPost
                {
                    Title = popularPost.Title,
                    Image = popularPost.FeaturedImage
                });
                otherPosts.RemoveAt(randomIndex);
            }

            results.Add(blogPageData);
        }

        return results;
    }

    private BlogPost? MapToBlogPost(IPublishedContent? content)
    {
        if (content == null) return null;

        var tags = new List<string>();
        if (content.HasProperty("tags"))
        {
            var tagsValue = content.Value<string>("tags");
            if (!string.IsNullOrWhiteSpace(tagsValue))
            {
                tags = tagsValue.Split(',').Select(t => t.Trim()).ToList();
            }
        }

        var title = content.HasProperty("title") ? content.Value<string>("title") ?? content.Name : content.Name;
        var publishDate = content.HasProperty("publishDate") ? content.Value<DateTime?>("publishDate") : null;
        var contentText = content.HasProperty("content") ? content.Value<string>("content") ?? string.Empty : string.Empty;

        var featuredImage = string.Empty;
        if (content.HasProperty("featuredImage"))
        {
            var mediaItem = content.Value<IPublishedContent>("featuredImage");
            if (mediaItem != null)
            {
                featuredImage = mediaItem.Url();
            }
        }

        return new BlogPost
        {
            Id = content.Key.ToString(),
            Title = title,
            Content = contentText,
            PublishDate = publishDate,
            FeaturedImage = featuredImage,
            Tags = tags
        };
    }

    private AboutSection? MapToAboutSection(IPublishedContent? content)
    {
        if (content == null) return null;

        var title = content.HasProperty("title") ? content.Value<string>("title") ?? content.Name : content.Name;
        var description = content.HasProperty("description") ? content.Value<string>("description") ?? string.Empty : string.Empty;

        var image = string.Empty;
        if (content.HasProperty("image"))
        {
            var mediaItems = content.Value<IEnumerable<IPublishedContent>>("image");
            var mediaItem = mediaItems?.FirstOrDefault();
            if (mediaItem != null)
            {
                image = mediaItem.Url();
            }
        }

        return new AboutSection
        {
            Title = title,
            Image = image,
            Description = description
        };
    }
}

// Models
public class BlogPost
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime? PublishDate { get; set; }
    public string FeaturedImage { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new List<string>();
}

public class AboutSection
{
    public string Title { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class PopularPost
{
    public string Title { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
}

public class BlogPageData
{
    public string Id { get; set; } = string.Empty;
    public string BlogName { get; set; } = string.Empty;
    public string FollowText { get; set; } = string.Empty;
    public List<BlogPost> Posts { get; set; } = new List<BlogPost>();
    public AboutSection About { get; set; } = new AboutSection();
    public List<PopularPost> PopularPosts { get; set; } = new List<PopularPost>();
}
