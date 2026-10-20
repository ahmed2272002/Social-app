import React, { useContext, useEffect, useState } from "react";
import {
  Bookmark,
  ChevronDown,
  Ellipsis,
  Forward,
  MessageCircle,
  Pencil,
  ThumbsUp,
  Trash,
} from "lucide-react";
import type { PostCardInterface, TopComment } from "../../types/PostCard.types";
import moment from "moment";
import { Link } from "react-router";
import { deleteComment, getPostComments } from "../../Services/comment.services";
import PostComment from "../PostComment/PostComment";
import PostBookmarkButton from "./PostBookmarkButton";
import PostLikeButton from "./PostLikeButton";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import { UserContext } from "../Context/UserContext";
import EditPost from "./EditPost";
import { deletePost } from "../../Services/post.services";
import toast from "react-hot-toast";
import { usePostBookmark } from "./usePostBookmark";
import EditComment from "../PostComment/EditComment";
import { useQueryClient } from "@tanstack/react-query";

function PostCard({  post,  onUnlike, onBookmarkChange, onPostDeleted, getAllPost}: {  post: PostCardInterface;  onUnlike?: () => void; onBookmarkChange?: (isBookmarked: boolean) => void; onPostDeleted?: (postId: string) => void; getAllPost?: () => void}) {
  const [allcomments, setAllComments] = useState<TopComment[] | null>(null);
  const [visibleComments, setVisibleComments] = useState(2);
  const UserDetails = useContext(UserContext)?.UserDetails

  const queryClient = useQueryClient();

  const [DeleteDialog, setDeleteDialog] = useState<boolean>(false)

  const [showEditPost, setShowEditPost] = useState<boolean>(false)
  const { isBookmarked, isUpdating: isUpdatingBookmark, handleToggleBookmark } =
    usePostBookmark({
      postId: post._id,
      bookmarked: post.bookmarked,
      onBookmarkChange,
    });

  const restOfComments = (allcomments ?? []).filter(
    (comment) => comment._id !== post.topComment._id,
  );
  const topComment = allcomments === null
    ? post.topComment
    : allcomments.find((comment) => comment._id === post.topComment._id);

  const [updateComment, setUpdateComment] = useState<string | null>(null)

  async function getComments(postId: string) {
    try {
      const { data } = await getPostComments(postId);
      setAllComments(data.data.comments);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleDeleteComment(commentId: string) {
    try {
      const { data } = await deleteComment(post._id, commentId);
      toast.success(data.message);
      setUpdateComment(null);
      await getComments(post._id);
      await queryClient.invalidateQueries({
              queryKey: ["getFeed"],
            });
    } catch (error) {
      console.error("Failed to delete comment", error);
      toast.error("Unable to delete this comment. Please try again.");
    }
  }

  useEffect(() => {
    getComments(post._id);
  }, [post._id]);


  async function deleteMyPost(postId:string){
    try {
      const {data} = await deletePost(postId)
      onPostDeleted?.(postId)
      setDeleteDialog(false)
      toast.success(data.message)
    } catch (error) {
      console.error("Failed to delete post", error)
      toast.error("Unable to delete this post. Please try again.")
    }
  }

  function handleMoreComments() {
    setVisibleComments(visibleComments + 1);
  }

  const [likesCount, setLikesCount] = useState(post.likesCount);

  const actionBtn =
    "flex flex-1 items-center justify-center gap-2 rounded-md py-2 text-[15px] font-semibold text-[#65676b] transition-colors duration-150 hover:bg-[#f0f2f5]";

  return (
    <article className="mb-4 w-full max-w-[740px] overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,0.15)]">
      {/* ===== Header: creator picture, name, username, time, privacy ===== */}
      <header className="flex items-center gap-3 px-4 pt-3">
        <img
          src={post.user.photo}
          alt={post.user.name}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <p className="text-[15px] font-bold text-[#050505]">
            {post.user.name}{" "}
            <span className="text-[13px] font-normal text-[#65676b]">
              @{post.user.username}
            </span>
          </p>

          <p className="flex items-center gap-1 text-[13px] text-[#65676b]">
            {moment(post.createdAt).fromNow()}
            <span className="ms-2">{post.privacy}</span>
          </p>
        </div>


        {post.user._id === UserDetails?._id ? <>
        <Dropdown>
          <Button aria-label="Menu" className="rounded-full p-2 px-3 text-[#65676b] hover:bg-[#f0f2f5] bg-transparent">
            <Ellipsis size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => {
              if (key === "save-post" && !isUpdatingBookmark) {
                void handleToggleBookmark();
              } else if (key === "edit-post") {
                setShowEditPost(true);
              } else if (key === "delete-post") {
                setDeleteDialog(true);
              }
            }}>
              <Dropdown.Item id="save-post" textValue={isBookmarked ? "Remove saved post" : "Save post"} isDisabled={isUpdatingBookmark}>
                <Label className={`flex items-center gap-2 ${isBookmarked ? "text-blue-600" : ""}`}>
                  <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                  {isBookmarked ? "Remove saved post" : "Save post"}
                </Label>
              </Dropdown.Item>
              <Dropdown.Item id="edit-post" textValue="Edit post">
                <Label className="flex items-center gap-2"><Pencil size={20}/> Edit post</Label>
              </Dropdown.Item>
              <Dropdown.Item id="delete-post" textValue="Delete post" variant="danger">
                <Label className="flex items-center gap-2"><Trash size={20}/> Delete post</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>

        </>: <>

        <Dropdown>
          <Button aria-label="Menu" className="rounded-full p-2 px-3 text-[#65676b] hover:bg-[#f0f2f5] bg-transparent">
            <Ellipsis size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => {
              if (key === "save-post" && !isUpdatingBookmark) {
                void handleToggleBookmark();
              }
            }}>
              <Dropdown.Item id="save-post" textValue={isBookmarked ? "Remove saved post" : "Save post"} isDisabled={isUpdatingBookmark}>
                <Label className={`flex items-center gap-2 ${isBookmarked ? "text-blue-600" : ""}`}>
                  <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
                  {isBookmarked ? "Remove saved post" : "Save post"}
                </Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
        </>
        }


        {/* Delete Dialog */}

<AlertDialog isOpen={DeleteDialog}>
      <AlertDialog.Backdrop>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <AlertDialog.CloseTrigger onClick={()=>setDeleteDialog(false)} />
            <AlertDialog.Header>
              <AlertDialog.Icon status="danger" />
              <AlertDialog.Heading>Delete project permanently?</AlertDialog.Heading>
            </AlertDialog.Header>
            <AlertDialog.Body>
              <p>
                This will permanently delete <strong>My Awesome Project</strong> and all of its
                data. This action cannot be undone.
              </p>
            </AlertDialog.Body>
            <AlertDialog.Footer>
              <Button slot="close" variant="tertiary" onClick={()=>setDeleteDialog(false)}>
                Cancel
              </Button>
              <Button onClick={()=>deleteMyPost(post._id)} slot="close" variant="danger">
                Delete Post
              </Button>
            </AlertDialog.Footer>
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </AlertDialog>







      </header>


{/* edit form */}
{
  showEditPost ? <EditPost postId = {post._id} initialContent={post.body} setShowEditPost = {setShowEditPost} getAllPost={getAllPost}/> : <>
  {/* ===== Body ===== */}
      <p className="px-4 py-3 text-[15px] text-[#050505]">{post.body}</p>

      {/* ===== Image ===== */}
      {post.image && (
        <img
          src={post.image}
          alt={post.body}
          className="aspect-[16/10] w-full object-cover"
        />
      )}

  </>
}

      

      {/* ===== Shared post (only if this post is a share) ===== */}
      {post.isShare && post.sharedPost && (
        <div className="mx-4 mb-3 rounded-lg border border-[#e4e6eb] p-3">
          <div className="flex items-center gap-2">
            <img
              src={post.sharedPost.user.photo}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
            <p className="text-[14px] font-bold text-[#050505]">
              {post.sharedPost.user.name}
            </p>
          </div>
          <p className="mt-2 text-[15px] text-[#050505]">
            {post.sharedPost.body}
          </p>
          {post.sharedPost.image && (
            <img
              src={post.sharedPost.image}
              alt=""
              className="mt-2 w-full rounded-md object-cover"
            />
          )}
        </div>
      )}

      {/* ===== Stats: likes, shares, comments ===== */}
      <div className="mx-4 flex items-center justify-between border-b border-[#e4e6eb] py-3 text-[13px] text-[#65676b]">
        <div className="flex items-center gap-1.5">
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#0866ff] text-white">
            <ThumbsUp size={11} fill="currentColor" />
          </span>
          <span>{likesCount} likes</span>
        </div>

        <div className="flex gap-3">
          <span>{post.sharesCount} shares</span>
          <span>{post.commentsCount} comments</span>
          <Link
            to={`/PostDetails/${post._id}`}
            className=" text-blue-400 font-bold"
          >
            View Details
          </Link>
        </div>
      </div>

      {/* ===== Buttons: like, comment, share ===== */}
      <div className="flex gap-1 border-b border-[#e4e6eb] px-4 py-1">
        <PostLikeButton
          postId={post._id}
          likes={post.likes}
          className={actionBtn}
          onLikeChange={(isLiked) => {
            setLikesCount((count) => Math.max(0, count + (isLiked ? 1 : -1)));
            if (!isLiked) onUnlike?.();
          }}
        />

        <button type="button" className={actionBtn}>
          <MessageCircle size={20} />
          Comment
        </button>

        <button type="button" className={actionBtn}>
          <Forward size={20} />
          Share
        </button>
        <PostBookmarkButton
          postId={post._id}
          bookmarked={post.bookmarked}
          className={actionBtn}
          bookmarkState={{
            isBookmarked,
            isUpdating: isUpdatingBookmark,
            handleToggleBookmark,
          }}
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

        {/* ===== Top comment + show more ===== */}
        {/* top Comment */}

        {topComment && (
          <>
            <div className="flex item-start gap-2">
              <img
                className="h-8 w-8 rounded-full object-cover"
                src={topComment.commentCreator.photo}
                alt=""
              />
              <div className="rounded-2xl bg-gray-100 px-3 py-2">
                <div className="text-xs flex flex-col gap-1 font-semibold text-gray-900">
                  <h2 className="text-green-400 text-sm font-black">
                    Top Comment
                  </h2>
                  <p>{topComment.commentCreator.name}</p>
                </div>

                {/* EditComment */}
                {updateComment === topComment._id ? <EditComment  
                setUpdateCommnent={setUpdateComment}
                postId={post._id}
                commentId={topComment._id}
                getComments={getComments}
                getAllPost={getAllPost}
                initialContent={topComment.content}/> : <>
                <p className="text-sm text-gray-700">
                  {topComment.content}
                </p>
                {topComment.image && (
                  <img
                    className="mt-2 max-h-80 max-w-full rounded-lg object-cover"
                    src={topComment.image}
                    alt="Comment attachment"
                  />
                )}
                </>}

                
              </div>
              {/* comment Action */}
              {
                topComment.commentCreator._id === UserDetails?._id ? <>
                <div className="ms-auto">
                <Dropdown>
          <Button aria-label="Menu" className="rounded-full p-2 px-3 text-[#65676b] hover:bg-[#f0f2f5] bg-transparent">
            <Ellipsis size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
              <Dropdown.Item id="edit-comment" textValue="Edit comment" onClick={()=>setUpdateComment(topComment._id)}>
                <Label className="flex items-center gap-2"><Pencil size={20}/> Edit comment</Label>
              </Dropdown.Item>
              <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger" onClick={() => handleDeleteComment(topComment._id)}>
                <Label className="flex items-center gap-2"><Trash size={20}/> Delete comment</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
              </div>
                </> : <>
                <div className="ms-auto">
                <Dropdown>
          <Button aria-label="Menu" className="rounded-full p-2 px-3 text-[#65676b] hover:bg-[#f0f2f5] bg-transparent">
            <Ellipsis size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
              <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger" onClick={() => handleDeleteComment(topComment._id)}>
                <Label className="flex items-center gap-2"><Trash size={20}/> Delete comment</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
              </div>
                </>
              }
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
                    {updateComment === comment._id ? <EditComment
                      setUpdateCommnent={setUpdateComment}
                      postId={post._id}
                      commentId={comment._id}
                      getComments={getComments}
                      getAllPost={getAllPost}
                      initialContent={comment.content}
                    /> : <>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                      {comment.image && (
                        <img
                          className="mt-2 max-h-80 max-w-full rounded-lg object-cover"
                          src={comment.image}
                          alt="Comment attachment"
                        />
                      )}
                    </>}
                  </div>
                  
                  {/* comment Actions */}
                  {
                comment.commentCreator._id === UserDetails?._id ? <>
                <div className="ms-auto">
                <Dropdown>
          <Button aria-label="Menu" className="rounded-full p-2 px-3 text-[#65676b] hover:bg-[#f0f2f5] bg-transparent">
            <Ellipsis size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
              <Dropdown.Item id="edit-comment" textValue="Edit comment" onClick={()=>setUpdateComment(comment._id)}>
                <Label className="flex items-center gap-2"><Pencil size={20}/> Edit comment</Label>
              </Dropdown.Item>
              <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger" onClick={() => handleDeleteComment(comment._id)}>
                <Label className="flex items-center gap-2"><Trash size={20}/> Delete comment</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
              </div>
                </> : <>
                <div className="ms-auto">
                <Dropdown>
          <Button aria-label="Menu" className="rounded-full p-2 px-3 text-[#65676b] hover:bg-[#f0f2f5] bg-transparent">
            <Ellipsis size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
              <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger" onClick={() => handleDeleteComment(comment._id)}>
                <Label className="flex items-center gap-2"><Trash size={20}/> Delete comment</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
              </div>
                </>
              }
                </div>
              </React.Fragment>
            );
          })}

        <PostComment postId={post._id} getComments={getComments} />
      </section>
    </article>
  );
}

export default PostCard;
