using Umbraco.Cms.Core.Composing;
using Umbraco.Cms.Core.DependencyInjection;
using UmbracoCMS2.Services;

namespace UmbracoCMS2.Composers;

public class BlogSearchComposer : IComposer
{
    public void Compose(IUmbracoBuilder builder)
    {
        // Register the blog search service
        builder.Services.AddScoped<IBlogSearchService, BlogSearchService>();
    }
}
