import { useContext, useEffect, useMemo, useState } from "react";
import { Bookmark, Heart, ImageIcon, Mail, Sparkles } from "lucide-react";
import { UserContext } from "../../Components/Context/UserContext";
import { getBookmarkedPosts } from "../../Services/profile.services";
import { getSinglePost } from "../../Services/post.services";
import { getUSerFeed } from "../../Services/feed.services";
import type { PostCardInterface } from "../../types/PostCard.types";
import PostCard from "../../Components/PostCard/PostCard";
import toast from "react-hot-toast";
import useGet from "../../Hooks/useGet";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const [myPosts, setMyPosts] = useState<PostCardInterface[]>([]);
  const [savedPosts, setSavedPosts] = useState<PostCardInterface[]>([]);
  const [isLoadingSavedPosts, setIsLoadingSavedPosts] = useState(false);
  const [savedPostsError, setSavedPostsError] = useState(false);
  const [likedPosts, setLikedPosts] = useState<PostCardInterface[]>([]);
  const [isLoadingLikedPosts, setIsLoadingLikedPosts] = useState(false);
  const [likedPostsError, setLikedPostsError] = useState(false);
  const userContext = useContext(UserContext);
  const UserDetails = userContext?.UserDetails ?? null;
  const userId = UserDetails?._id;

  // costume hook useGet
  const response = useGet(
    userId ? `https://route-posts.routemisr.com/users/${userId}/posts` : "",
  );

  const profileResponse = response as unknown as {
    data?: {
      data?: { posts?: PostCardInterface[] };
      posts?: PostCardInterface[];
    };
    posts?: PostCardInterface[];
  } | null;
  const postsFromResponse = useMemo(
    () =>
      profileResponse?.data?.data?.posts ??
      profileResponse?.data?.posts ??
      profileResponse?.posts ??
      [],
    [profileResponse],
  );

  useEffect(() => {
    if (postsFromResponse.length) setMyPosts(postsFromResponse);
  }, [postsFromResponse]);

  async function refreshMyPost(postId: string) {
    try {
      const { data } = await getSinglePost(postId);
      const updatedPost: PostCardInterface = data.data.post;
      setMyPosts((posts) =>
        posts.map((currentPost) =>
          currentPost._id === postId ? updatedPost : currentPost,
        ),
      );
    } catch (error) {
      console.error("Failed to refresh updated post", error);
      toast.error("Post updated, but the displayed post could not be refreshed.");
    }
  }

  useEffect(() => {
    if (activeTab !== "saved" || !UserDetails) return;

    let isCurrentRequest = true;

    async function loadSavedPosts() {
      setIsLoadingSavedPosts(true);
      setSavedPostsError(false);

      try {
        const posts = await getBookmarkedPosts();
        if (isCurrentRequest) setSavedPosts(posts);
      } catch (error) {
        if (isCurrentRequest) {
          console.error("Failed to load saved posts", error);
          setSavedPostsError(true);
          toast.error("Unable to load saved posts. Please try again.");
        }
      } finally {
        if (isCurrentRequest) setIsLoadingSavedPosts(false);
      }
    }

    void loadSavedPosts();

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, UserDetails]);

  useEffect(() => {
    if (activeTab !== "liked" || !userId) return;
    const currentUserId = userId;

    let isCurrentRequest = true;

    async function loadLikedPosts() {
      setIsLoadingLikedPosts(true);
      setLikedPostsError(false);

      try {
        const feedResponse = await getUSerFeed();
        const feedPosts: PostCardInterface[] = feedResponse.data.posts;
        const posts = feedPosts.filter((post) =>
          post.likes.includes(currentUserId),
        );
        if (isCurrentRequest) setLikedPosts(posts);
      } catch (error) {
        if (isCurrentRequest) {
          console.error("Failed to load liked posts", error);
          setLikedPostsError(true);
          toast.error("Unable to load liked posts. Please try again.");
        }
      } finally {
        if (isCurrentRequest) setIsLoadingLikedPosts(false);
      }
    }

    void loadLikedPosts();

    return () => {
      isCurrentRequest = false;
    };
  }, [activeTab, userId]);

  return (
    <>
    {UserDetails && (
      <main className="min-h-screen bg-sec py-6">
        <title>Profile | Social App</title>
      <div className="container mx-auto max-w-6xl px-4">
        <section className="relative">
          <div className="h-36 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-700 sm:h-44" />

          <div className="relative mx-2 -mt-16 rounded-3xl bg-white p-5 shadow-sm sm:mx-4 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={UserDetails.photo}
                  alt={UserDetails.name}
                  className="size-24 shrink-0 rounded-full object-cover ring-4 ring-white sm:size-28"
                />
                <div>
                  <h1 className="text-2xl font-bold capitalize text-gray-900">
                    {UserDetails.name}
                  </h1>
                  <p className="text-sm text-gray-500">{UserDetails.username}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                    <Sparkles size={12} />
                    Route Posts member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 lg:min-w-80">
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Followers
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {UserDetails.followersCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Following
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {UserDetails.followingCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-3 py-3 text-center">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Bookmarks
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {UserDetails.bookmarksCount}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h2 className="text-sm font-semibold text-gray-900">About</h2>
                <p className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <Mail size={16} className="text-gray-400" />
                  {UserDetails.email}
                </p>
                <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles size={16} className="text-gray-400" />
                  Active on Route Posts
                </p>
              </div>

              <div className="grid gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    My Posts
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {myPosts.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Saved Posts
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900">
                    {UserDetails.bookmarksCount}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
          <div className="flex gap-1 rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                activeTab === "posts"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <ImageIcon size={16} />
              My Posts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                activeTab === "saved"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Bookmark size={16} />
              Saved
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("liked")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold ${
                activeTab === "liked"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-500"
              }`}
            >
              <Heart size={16} />
              Liked
            </button>
          </div>
          <span className="grid size-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-blue-600">
            {activeTab === "posts"
              ? myPosts.length
              : activeTab === "saved"
                ? UserDetails.bookmarksCount
                : likedPosts.length}
          </span>
        </section>

        {activeTab === "posts" ? (
          <section className="mt-3">
            {myPosts.length ? (
              myPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  getAllPost={() => void refreshMyPost(post._id)}
                  onPostDeleted={(postId) =>
                    setMyPosts((posts) =>
                      posts.filter((currentPost) => currentPost._id !== postId),
                    )
                  }
                />
              ))
            ) : (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                You have not posted yet.
              </p>
            )}
          </section>
        ) : activeTab === "liked" ? (
          <section className="mt-3">
            {isLoadingLikedPosts ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                Loading liked posts...
              </p>
            ) : likedPostsError ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-red-500 shadow-sm">
                Could not load liked posts.
              </p>
            ) : likedPosts.length ? (
              likedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onUnlike={() =>
                    setLikedPosts((posts) =>
                      posts.filter((likedPost) => likedPost._id !== post._id),
                    )
                  }
                />
              ))
            ) : (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                You have not liked any posts yet.
              </p>
            )}
          </section>
        ) : (
          <section className="mt-3">
            {isLoadingSavedPosts ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                Loading saved posts...
              </p>
            ) : savedPostsError ? (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-red-500 shadow-sm">
                Could not load saved posts.
              </p>
            ) : savedPosts.length ? (
              savedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onBookmarkChange={(isBookmarked) => {
                    if (!isBookmarked) {
                      setSavedPosts((posts) =>
                        posts.filter((savedPost) => savedPost._id !== post._id),
                      );
                    }
                  }}
                />
              ))
            ) : (
              <p className="rounded-2xl bg-white px-4 py-3 text-sm text-gray-400 shadow-sm">
                You have no saved posts.
              </p>
            )}
          </section>
        )}
      </div>
    </main>
    )}
    </>
  );
}

export default Profile;
