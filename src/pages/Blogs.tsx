import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useNavigate } from "react-router-dom";

const Blogs = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();
    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = supabase.auth.getUser();
        if (!user) {
            alert("You must be logged in to create a blog post.");
            navigate("/login");
            return;
        }
        const { error } = await supabase.from("blogs").insert([
            { title, content, user_id: (await user).data.user?.id },
        ]);
        if (error) {
            alert("Error creating blog post: " + error.message); 
        } else {
            alert("Blog post created successfully!");
            navigate("/dashboard");
        }
    };
    return ( 
        <div>
            <h2>Create Blog Post</h2>
            <form onSubmit={handleCreateBlog}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <textarea
                    placeholder="Content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                />
                <button type="submit">Create Blog Post</button>
            </form>
        </div>
        );
};

export { Blogs };