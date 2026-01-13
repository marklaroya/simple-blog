import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";
import React from "react";

const Blogs = () => {
  const [blogs, setBlogs] = useState<
    Array<{ id: number; title: string; content: string; user_id: string }>
  >([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 5;
  const navigate = useNavigate();

  const fetchBlogs = async (page = 1) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error("User not logged in");
      navigate("/login");
      return;
    }

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from("blogpost")
      .select("*", { count: "exact" })
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching blogs:", error);
    } else {
      setBlogs(data || []);
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE));
    }
  };

  React.useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      alert("You must be logged in to create a blog post.");
      navigate("/login");
      return;
    }

    const { data, error } = await supabase
      .from("blogpost")
      .insert([
        {
          title,
          content,
          user_id: user.id,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating blog post:", error);
      alert("Error creating blog post.");
    } else {
      console.log("Blog post created successfully:", data);
      setTitle("");
      setContent("");
      setCurrentPage(1);
      fetchBlogs(1);
    }
  };

  const handleDeleteBlog = async (id: number, userId: string) => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user || user.id !== userId) {
      alert("You can only delete your own posts.");
      return;
    }

    const { error } = await supabase.from("blogpost").delete().eq("id", id);

    if (error) {
      console.error("Error deleting blog post:", error);
      alert("Error deleting blog post.");
    } else {
      fetchBlogs(currentPage);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert("Error logging out: " + error.message);
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      <h2>Blog Posts</h2>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <form onSubmit={handleCreateBlog}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          required
        />
        <button type="submit">Create Blog Post</button>
      </form>

      <h3>My Blogs</h3>
      {blogs.length === 0 ? (
        <div className="empty-state">
          <p>No blog posts yet. Create your first one!</p>
        </div>
      ) : (
        <>
          <ul>
            {blogs.map((blog) => (
              <li key={blog.id}>
                <h3>{blog.title}</h3>
                <p>{blog.content}</p>
                <button onClick={() => navigate(`/edit/${blog.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteBlog(blog.id, blog.user_id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className="empty-state">
            <p>No blog posts yet. Create your first one!</p>
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export { Blogs };
