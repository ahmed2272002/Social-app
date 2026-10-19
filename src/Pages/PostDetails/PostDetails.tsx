import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Pencil,
  Share2,
  Trash,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { deletePost, getSinglePost } from "../../Services/post.services";
import type { PostCardInterface, TopComment } from "../../types/PostCard.types";
import PostDetailsSkeleton from "./PostDetailsSkeleton";
import { getPostComments } from "../../Services/comment.services";
import PostComment from "../../Components/PostComment/PostComment";
import PostBookmarkButton from "../../Components/PostCard/PostBookmarkButton";
import PostLikeButton from "../../Components/PostCard/PostLikeButton";
import { usePostBookmark } from "../../Components/PostCard/usePostBookmark";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { useContext } from "react";
import { UserContext } from "../../Components/Context/UserContext";
import EditPost from "../../Components/PostCard/EditPost";
import toast from "react-hot-toast";

function PostDetails() {
  const [details, setDetails] = useState<PostCardInterface | null>(null);
  const [allcomments, setAllComments] = useState<TopComment[] | []>([]);
  const [visibleComments, setVisibleComments] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [showEditPost, setShowEditPost] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const userContext = useContext(UserContext);
  const userId = userContext?.UserDetails?._id ?? userContext?.UserDetails?.id;
  const navigate = useNavigate();
  const { id } = useParams();
  const bookmarkState = usePostBookmark({
    postId: details?._id ?? id ?? "",
    bookmarked: details?.bookmarked ?? false,
  });
  const restOfComments = allcomments.filter(
    (comment) => comment._id !== details?.topComment._id,
  );

  // call api getPostDerails
  async function getPostDetails(postId: string) {
    try {
      const { data } = await getSinglePost(postId);
      setDetails(data.data.post);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // call api Comments
  async function getComments(postId: string) {
    try {
      const { data } = await getPostComments(postId);
      setAllComments(data.data.comments);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPostDetails(id!);
    getComments(id!);
  }, [id]);

  function handleMoreComments() {
    setVisibleComments(visibleComments + 2);
  }

  async function handleDeletePost() {
    if (!details) return;

    try {
      const { data } = await deletePost(details._id);
      toast.success(data.message || "Post deleted");
      navigate("/feed");
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Unable to delete this post. Please try again.");
    }
  }

  return (
    <>
      {details && (
        <>
          <div className="mx-auto mt-6 w-full  px-4 sm:px-5">
            <Link
              className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              to="/feed"
            >
              <ArrowLeft aria-hidden="true" size={17} />
              Back to feed
            </Link>
          </div>
          {isLoading ? (
            <div className="mx-auto mb-6 mt-2 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <PostDetailsSkeleton />
            </div>
          ) : (
            <article className="mx-auto mb-6 mt-2 w-full max-w-2xl overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <header className="flex items-start justify-between gap-3 px-4 pt-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <img
                    className="size-11 shrink-0 rounded-full object-cover ring-2 ring-white"
                    src={details.user.photo}
                    alt={details.user.name}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className="truncate text-sm font-semibold text-gray-900">
                        {details.user.name}
                      </span>
                      <span className="truncate text-xs text-gray-500">
                        {details.user.username}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                      <span>
                        {new Date(details.createdAt).toLocaleString("en-us", {
                          timeStyle: "short",
                          dateStyle: "full",
                        })}
                      </span>
                      <span aria-hidden="true">·</span>
                      <Globe2 aria-label="Public" size={13} />
                      <span>{details.privacy}</span>
                    </div>
                  </div>
                </div>
                <Dropdown>
                  <Button
                    aria-label="More post options"
                    className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full bg-transparent text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                  >
                    <MoreHorizontal size={21} />
                  </Button>
                  <Dropdown.Popover>
                    <Dropdown.Menu
                      onAction={(key) => {
                        if (key === "save-post") {
                          void bookmarkState.handleToggleBookmark();
                        } else if (key === "edit-post") {
                          setShowEditPost(true);
                        } else if (key === "delete-post") {
                          setIsDeleteDialogOpen(true);
                        }
                      }}
                    >
                      <Dropdown.Item
                        id="save-post"
                        textValue={
                          bookmarkState.isBookmarked
                            ? "Remove saved post"
                            : "Save post"
                        }
                        isDisabled={bookmarkState.isUpdating}
                      >
                        <Label
                          className={`flex items-center gap-2 ${bookmarkState.isBookmarked ? "text-blue-600" : ""}`}
                        >
                          <Bookmark
                            size={20}
                            fill={
                              bookmarkState.isBookmarked
                                ? "currentColor"
                                : "none"
                            }
                          />
                          {bookmarkState.isBookmarked
                            ? "Remove saved post"
                            : "Save post"}
                        </Label>
                      </Dropdown.Item>
                      {details.user._id === userId && (
                        <>
                          <Dropdown.Item id="edit-post" textValue="Edit post">
                            <Label className="flex items-center gap-2">
                              <Pencil size={20} />
                              Edit post
                            </Label>
                          </Dropdown.Item>
                          <Dropdown.Item
                            id="delete-post"
                            textValue="Delete post"
                            variant="danger"
                          >
                            <Label className="flex items-center gap-2">
                              <Trash size={20} />
                              Delete post
                            </Label>
                          </Dropdown.Item>
                        </>
                      )}
                    </Dropdown.Menu>
                  </Dropdown.Popover>
                </Dropdown>
              </header>

              <AlertDialog isOpen={isDeleteDialogOpen}>
                <AlertDialog.Backdrop>
                  <AlertDialog.Container>
                    <AlertDialog.Dialog className="sm:max-w-[400px]">
                      <AlertDialog.CloseTrigger
                        onClick={() => setIsDeleteDialogOpen(false)}
                      />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="danger" />
                        <AlertDialog.Heading>Delete post permanently?</AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p>This action cannot be undone.</p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button
                          slot="close"
                          variant="tertiary"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          slot="close"
                          variant="danger"
                          onClick={() => void handleDeletePost()}
                        >
                          Delete Post
                        </Button>
                      </AlertDialog.Footer>
                    </AlertDialog.Dialog>
                  </AlertDialog.Container>
                </AlertDialog.Backdrop>
              </AlertDialog>

              {showEditPost ? (
                <div className="px-4 pb-4 pt-2 sm:px-5">
                  <EditPost
                    postId={details._id}
                    setShowEditPost={setShowEditPost}
                    getAllPost={() => getPostDetails(details._id)}
                  />
                </div>
              ) : (
                <>
              <div className="px-4 pb-3 pt-3 text-sm leading-6 text-gray-800 sm:px-5">
                <p>{details.body}</p>
              </div>

              {details.image && (
                <img
                  className="block max-h-[520px] w-full bg-gray-100 object-cover"
                  src={details.image}
                  alt={details.body}
                />
              )}

              <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-gray-500 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="flex size-[18px] items-center justify-center rounded-full bg-rose-500 text-white">
                    <Heart aria-hidden="true" fill="currentColor" size={11} />
                  </span>
                  <span>{details.likesCount} likes</span>
                </div>
                <div className="flex gap-3">
                  <span>{details.commentsCount} comments</span>
                  <span>{details.sharesCount} shares</span>
                </div>
              </div>

              <div className="mx-4 flex border-y border-gray-200 sm:mx-5">
                <PostLikeButton
                  postId={details._id}
                  likes={details.likes}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  onLikeChange={(isLiked) =>
                    setDetails((currentDetails) =>
                      currentDetails
                        ? {
                            ...currentDetails,
                            likesCount: Math.max(
                              0,
                              currentDetails.likesCount + (isLiked ? 1 : -1),
                            ),
                          }
                        : currentDetails,
                    )
                  }
                />
                <button
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                  onClick={() =>
                    document.getElementById("post-details-comment")?.focus()
                  }
                  type="button"
                >
                  <MessageCircle size={18} />
                  Comment
                </button>
                <button
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                  type="button"
                >
                  <Share2 size={18} />
                  Share
                </button>
                <PostBookmarkButton
                  postId={details._id}
                  bookmarked={details.bookmarked}
                  bookmarkState={bookmarkState}
                  className="flex min-h-11 flex-1 items-center justify-center gap-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 hover:text-gray-900"
                />
              </div>

              <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
                <button
                  className="mb-3 flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-900"
                  type="button"
                  onClick={handleMoreComments}
                >
                  Show more comments
                  <ChevronDown size={16} />
                </button>

                {/* top Comment */}

                {/* top Comment */}

                {details.topComment && (
                  <>
                    <div className="flex item-start gap-2">
                      <img
                        className="h-8 w-8 rounded-full object-cover"
                        src={details.topComment.commentCreator.photo}
                        alt=""
                      />
                      <div className="rounded-2xl bg-gray-100 px-3 py-2">
                        <div className="text-xs flex flex-col gap-1 font-semibold text-gray-900">
                          <h2 className="text-green-400 text-sm font-black">
                            Top Comment
                          </h2>
                          <p>{details.topComment.commentCreator.name}</p>
                        </div>
                        <p className="text-sm text-gray-700">
                          {details.topComment.content}
                        </p>
                        {details.topComment.image && (
                          <img
                            className="mt-2 max-h-80 max-w-full rounded-lg object-cover"
                            src={details.topComment.image}
                            alt="Comment attachment"
                          />
                        )}
                      </div>
                    </div>
                  </>
                )}

                {restOfComments &&
                  restOfComments.slice(0, visibleComments).map((comment) => {
                    return (
                      <React.Fragment key={comment._id}>
                        <div className="flex item-start gap-2 my-2">
                          <img
                            className="h-8 w-8 rounded-full object-cover"
                            src={comment.commentCreator.photo}
                            alt=""
                          />
                          <div className="rounded-2xl bg-gray-100 px-3 py-2">
                            <div className="text-xs font-semibold text-gray-900">
                              <p>{comment.commentCreator.name}</p>
                            </div>
                            <p className="text-sm text-gray-700">
                              {comment.content}
                            </p>
                            {comment.image && (
                              <img
                                className="mt-2 max-h-80 max-w-full rounded-lg object-cover"
                                src={comment.image}
                                alt="Comment attachment"
                              />
                            )}
                          </div>
                        </div>
                      </React.Fragment>
                    );
                  })}

                {/* form */}

                <PostComment postId={details._id} getComments={getComments} />
              </section>
                </>
              )}
            </article>
          )}
        </>
      )}
    </>
  );
}

export default PostDetails;
