import { useParams } from "react-router-dom";
import "../styles/VlogPage.css";
import vlogPageData from "../data/VlogSeed"; // assumed to be an array of VlogPageData

export default function VlogPage() {
  const { id } = useParams();

  // Normalize id to match slugified blogName
  const vlog = vlogPageData.find(
    (vlog) => vlog.id === Number(id)
  );

  if (!vlog) {
    return <div>Vlog not found</div>;
  }

  return (
    <div className="blog-layout">
      <div className="header">
        <h2>{vlog.blogName}</h2>
      </div>

      <div className="row">
        <div className="leftcolumn">
          {vlog.posts.map((post) => (
            <div className="card" key={post.id}>
              <h2>{post.title}</h2>
              <h5>
                {post.description}, {post.date}
              </h5>
              <div
                className="fakeimg"
                style={{
                  height: "200px",
                  backgroundImage: `url(${post.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              ></div>
              <p>{post.content}</p>
            </div>
          ))}
        </div>

        <div className="rightcolumn">
          <div className="card">
            <h2>{vlog.about.title}</h2>
            <div
              className="fakeimg"
              style={{
                height: "100px",
                backgroundImage: `url(${vlog.about.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
            <p>{vlog.about.description}</p>
          </div>

          <div className="card">
            <h3>Popular Posts</h3>
            {vlog.popularPosts.map((img, idx) => (
              <div
                key={idx}
                className="fakeimg"
                style={{
                  backgroundImage: `url(${img})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  height: "100px",
                  marginBottom: "10px",
                }}
              ></div>
            ))}
          </div>

          <div className="card">
            <h3>Follow Me</h3>
            <p>{vlog.followText}</p>
          </div>
        </div>
      </div>

      <div className="footer">
        <h2>Footer</h2>
      </div>
    </div>
  );
}
