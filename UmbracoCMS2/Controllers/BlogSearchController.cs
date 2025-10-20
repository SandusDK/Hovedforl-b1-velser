using Microsoft.AspNetCore.Mvc;
using UmbracoCMS2.Services;

namespace UmbracoCMS2.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogSearchController : ControllerBase
{
    private readonly IBlogSearchService _searchService;

    public BlogSearchController(IBlogSearchService searchService)
    {
        _searchService = searchService;
    }

    [HttpGet("search")]
    public ActionResult<IEnumerable<BlogSearchResult>> Search([FromQuery] string q)
    {
        if (string.IsNullOrWhiteSpace(q))
            return BadRequest(new { error = "Search query cannot be empty" });

        var results = _searchService.SearchBlogs(q);

        return Ok(new
        {
            query = q,
            count = results.Count(),
            results = results
        });
    }

    [HttpGet("health")]
    public ActionResult Health()
    {
        return Ok(new { status = "healthy", service = "BlogSearchAPI" });
    }
}
