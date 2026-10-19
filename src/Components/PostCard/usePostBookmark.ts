import { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserContext } from "../Context/UserContext";
import { togglePostBookmark } from "../../Services/post.services";

type UsePostBookmarkProps = {
  postId: string;
  bookmarked: boolean;
  onBookmarkChange?: (isBookmarked: boolean) => void;
};

export function usePostBookmark({
  postId,
  bookmarked,
  onBookmarkChange,
}: UsePostBookmarkProps) {
  const userContext = useContext(UserContext);
  const profileBookmarkState = userContext?.UserDetails?.bookmarks?.includes(postId);
  const [localBookmarked, setLocalBookmarked] = useState(bookmarked);
  const [isUpdating, setIsUpdating] = useState(false);
  const isBookmarked = profileBookmarkState ?? localBookmarked;

  async function handleToggleBookmark() {
    if (isUpdating) return;

    const nextBookmarkedState = !isBookmarked;
    setIsUpdating(true);

    try {
      const { data } = await togglePostBookmark(postId);
      setLocalBookmarked(nextBookmarkedState);
      userContext?.setUserDetails((currentUser) => {
        if (!currentUser) return currentUser;

        const bookmarks = currentUser.bookmarks ?? [];
        const alreadyBookmarked = bookmarks.includes(postId);
        if (alreadyBookmarked === nextBookmarkedState) return currentUser;

        const updatedBookmarks = nextBookmarkedState
          ? [...bookmarks, postId]
          : bookmarks.filter((bookmarkId) => bookmarkId !== postId);

        return {
          ...currentUser,
          bookmarks: updatedBookmarks,
          bookmarksCount: updatedBookmarks.length,
        };
      });
      onBookmarkChange?.(nextBookmarkedState);
      toast.success(
        typeof data.message === "string"
          ? data.message
          : nextBookmarkedState
            ? "Post saved"
            : "Post removed from saved posts",
      );
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to update the saved post. Please try again.";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  }

  return { isBookmarked, isUpdating, handleToggleBookmark };
}
