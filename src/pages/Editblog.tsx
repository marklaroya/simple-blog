import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      console.log("Fetching blog with id:", id); // Debug log

      const { data, error } = await supabase
        .from("blogpost")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching blog:", error);
        alert("Error loading blog post: " + error.message);
        navigate("/blogs");
      } else if (data) {
        console.log("Blog data loaded:", data); // Debug log
        setTitle(data.title);
        setContent(data.content);
      }
      setLoading(false);
    };
    fetchBlog();
  }, [id, navigate]);

  const handleUpdateBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("You must be logged in to update a blog post.");
      return;
    }

    const { error } = await supabase
      .from("blogpost")
      .update({ title, content })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating blog post:", error);
      alert("Error updating blog post: " + error.message);
    } else {
      alert("Blog post updated successfully!");
      navigate("/blogs");
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Edit Blog Post</h2>
      <form onSubmit={handleUpdateBlog}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            required
            rows={10}
          />
        </div>
        <button type="submit">Update Blog Post</button>
        <button type="button" onClick={() => navigate("/blogs")}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export { EditBlog };
