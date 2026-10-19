import { ChevronDown, Globe, ImageIcon, Send, Smile, X } from "lucide-react";
import { useContext, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { createPost } from "../../Services/post.services";
import toast from "react-hot-toast";
import { Spinner } from "@heroui/react";
import { UserContext } from "../Context/UserContext";
import axios from "axios";


export default function CreatePost() {
  const [content, setContent] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setisLoading] = useState<boolean>(false)

  const UserDetails = useContext(UserContext)?.UserDetails

  useEffect(() => {
    if (!imagePreview) return;
    return () => URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
    e.currentTarget.value = "";
  }

  function handleClosePreview(){
    setImage(null)
    setImagePreview(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isLoading) return;
    setisLoading(true)
    
    try {
      const formData = new FormData();

      formData.append("body" , content);
      if(image){
        formData.append("image" , image)
      }

      const {data} = await createPost(formData)

      toast.success(data.message)

      // empty state
      setContent("")
      setImage(null)
      setImagePreview(null)
      await getAllPost()

      
    } catch (error) {
      const message =
        axios.isAxiosError(error) &&
        typeof error.response?.data?.message === "string"
          ? error.response.data.message
          : "Unable to publish your post. Please try again.";
      toast.error(message);
    }
    finally{
      setisLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mb-4 w-full max-w-2xl overflow-hidden rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5">
      <header className="mb-3 flex items-start gap-3">
        <img
          alt={UserDetails?.name}
          className="size-11 shrink-0 rounded-full object-cover"
          src={UserDetails?.photo}
        />
        <div className="min-w-0">
          <p className="text-sm font-bold capitalize text-gray-900">
            {UserDetails?.name}
          </p>
          <label className="relative mt-1 inline-flex items-center gap-1.5 rounded-full bg-gray-100 py-1 pl-2.5 pr-7 text-xs font-medium text-gray-600">
            <Globe size={12} aria-hidden="true" />

            <span className="sr-only">Post privacy</span>
            <select className="cursor-pointer appearance-none bg-transparent outline-none">
              <option value="only-me">Only me</option>
              <option value="public">Public</option>
            </select>
            <ChevronDown
              size={12}
              aria-hidden="true"
              className="pointer-events-none absolute right-2"
            />
          </label>
        </div>
      </header>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's on your mind, ${UserDetails?.name.split(" ")[0]}?`}
        rows={4}
        className="w-full resize-none rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-200"
      />

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-xl">
          <button
            type="button"
            aria-label="Remove image"
       
            className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/90 text-gray-700"
          >
            <X size={16} className=" cursor-pointer" onClick={handleClosePreview}/>
          </button>
          <img
          src={imagePreview}
            alt="Selected post image"
            className="max-h-64 w-full object-cover"
          />
        </div>
      )
      }

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900">
            <ImageIcon
              size={18}
              className="pointer-events-none text-emerald-500"
            />
            Photo/video
            <input onChange={handleImage} type="file" accept="image/*,video/*" className="sr-only" />
          </label>
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <Smile size={18} className="pointer-events-none text-amber-500" />
            Feeling/activity
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading ? <Spinner size="lg" color="current" className="spin"/> : "Post"}
          <Send size={14} />
        </button>
      </div>
    </form>
  );
}
