using System.Collections.Generic;
using System.Linq;
using Examine;
using Umbraco.Cms.Core.Models.PublishedContent;
using Umbraco.Cms.Web.Common;

namespace UmbracoCMS2.Services;

public interface IBlogSearchService
{
    IEnumerable<BlogSearchResult> SearchBlogs(string query);
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

    public IEnumerable<BlogSearchResult> SearchBlogs(string query)
    {
        var results = new List<BlogSearchResult>();

        if (string.IsNullOrWhiteSpace(query))
            return results;

        if (!_examineManager.TryGetIndex("ExternalIndex", out IIndex index))
            return results;

        var searchQuery = index
            .Searcher
            .CreateQuery("content")
            .NodeTypeAlias("blog");

        var fuzzyQuery = query.Trim() + "~";
        var wildcardQuery = query.Trim() + "*";

        var searchResults = searchQuery
            .And()
            .Group(q => q
                .GroupedOr(new[] { "nodeName", "title" }, query)
                .Or()
                .GroupedOr(new[] { "nodeName", "title" }, fuzzyQuery)
                .Or()
                .GroupedOr(new[] { "nodeName", "title" }, wildcardQuery)
            )
            .Or()
            .Group(q => q
                .GroupedOr(new[] { "body1", "body2", "body3" }, query)
                .Or()
                .GroupedOr(new[] { "body1", "body2", "body3" }, wildcardQuery)
            )
            .Or()
            .Group(q => q
                .GroupedOr(new[] { "subtitle1", "subtitle2", "subtitle3" }, query)
                .Or()
                .GroupedOr(new[] { "subtitle1", "subtitle2", "subtitle3" }, wildcardQuery)
            )
            .Or()
            .Group(q => q
                .Field("tags", query)
                .Or()
                .Field("tags", wildcardQuery)
            )
            .Execute();

        // Convert Examine results to our model
        foreach (var result in searchResults)
        {
            if (result.Id == null)
                continue;

            var content = _umbracoHelper.Content(result.Id);
            if (content == null)
                continue;

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

            var featuredImage = string.Empty;
            if (content.HasProperty("featuredImage"))
            {
                var mediaItem = content.Value<IPublishedContent>("featuredImage");
                if (mediaItem != null)
                {
                    featuredImage = mediaItem.Url();
                }
            }

            var subtitle1 = content.HasProperty("subtitle1") ? content.Value<string>("subtitle1") ?? string.Empty : string.Empty;
            var body1 = content.HasProperty("body1") ? content.Value<string>("body1") ?? string.Empty : string.Empty;
            var subtitle2 = content.HasProperty("subtitle2") ? content.Value<string>("subtitle2") ?? string.Empty : string.Empty;
            var body2 = content.HasProperty("body2") ? content.Value<string>("body2") ?? string.Empty : string.Empty;
            var subtitle3 = content.HasProperty("subtitle3") ? content.Value<string>("subtitle3") ?? string.Empty : string.Empty;
            var body3 = content.HasProperty("body3") ? content.Value<string>("body3") ?? string.Empty : string.Empty;

            results.Add(new BlogSearchResult
            {
                Id = content.Id,
                Title = title,
                Url = content.Url(),
                PublishDate = publishDate,
                FeaturedImage = featuredImage,
                Subtitle1 = subtitle1,
                Body1 = body1,
                Subtitle2 = subtitle2,
                Body2 = body2,
                Subtitle3 = subtitle3,
                Body3 = body3,
                Tags = tags,
                Score = result.Score
            });
        }

        return results.OrderByDescending(x => x.Score);
    }
}

public class BlogSearchResult
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;
    public DateTime? PublishDate { get; set; }
    public string FeaturedImage { get; set; } = string.Empty;
    public string Subtitle1 { get; set; } = string.Empty;
    public string Body1 { get; set; } = string.Empty;
    public string Subtitle2 { get; set; } = string.Empty;
    public string Body2 { get; set; } = string.Empty;
    public string Subtitle3 { get; set; } = string.Empty;
    public string Body3 { get; set; } = string.Empty;
    public List<string> Tags { get; set; } = new List<string>();
    public float Score { get; set; }
}
