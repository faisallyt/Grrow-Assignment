import { useEffect, useState, useRef } from "react";
import Spinner from "../assets/spinner.gif";
import Navbar from "../components/Navbar";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshToken, setRefreshToken] = useState("");
  const observer = useRef();

  useEffect(() => {
    // Get user data from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      const details = JSON.parse(userData);
      const userD = details.data.refreshToken;
      setRefreshToken(userD);
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://grrow-assignment.onrender.com/api/v1/user/posts?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`, // Send refresh token in Authorization header
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const postData = await response.json();
        console.log(postData?.posts); // Log the posts array if postData is defined
        setPosts((prevPosts) => [...prevPosts, ...(postData?.posts || [])]);
        console.log(posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, refreshToken]);

  const loadMore = (entries) => {
    if (entries[0].isIntersecting) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver(loadMore, {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    });
    if (observer.current) {
      observer.current.observe(document.querySelector("#bottom"));
    }
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <div>
      <Navbar />
      <div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 py-16 px-16 mt-16">
          {posts &&
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={post.thumbnail}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mt-2">{post.description}</p>
                </div>
              </div>
            ))}
        </div>
        {loading && (
          <div className="text-center py-4 flex items-center justify-center">
            <img src={Spinner} alt="" />
          </div>
        )}
        <div id="bottom"></div>
      </div>
    </div>
  );
};

export default Posts;
