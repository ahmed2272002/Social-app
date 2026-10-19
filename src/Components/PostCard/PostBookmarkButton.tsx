import { Bookmark } from "lucide-react";
import { usePostBookmark } from "./usePostBookmark";

type PostBookmarkButtonProps = {
  postId: string;
  bookmarked: boolean;
  className: string;
  onBookmarkChange?: (isBookmarked: boolean) => void;
  bookmarkState?: {
    isBookmarked: boolean;
    isUpdating: boolean;
    handleToggleBookmark: () => void;
  };
};

function PostBookmarkButton({
  postId,
  bookmarked,
  className,
  onBookmarkChange,
  bookmarkState,
}: PostBookmarkButtonProps) {
  const bookmark = usePostBookmark({
    postId,
    bookmarked,
    onBookmarkChange,
  });
  const { isBookmarked, isUpdating, handleToggleBookmark } =
    bookmarkState ?? bookmark;

  return (
    <button
      type="button"
      aria-label={isBookmarked ? "Remove saved post" : "Save post"}
      aria-pressed={isBookmarked}
      disabled={isUpdating}
      onClick={handleToggleBookmark}
      className={`${className} ${isBookmarked ? "text-blue-600" : ""} disabled:cursor-wait disabled:opacity-60`}
    >
      <Bookmark size={20} fill={isBookmarked ? "currentColor" : "none"} />
      {isBookmarked ? "Saved" : "Save"}
    </button>
  );
}

export default PostBookmarkButton;
