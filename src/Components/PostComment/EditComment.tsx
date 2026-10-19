import { ImageIcon, X } from 'lucide-react'
import { useState, type ChangeEvent, type FormEvent } from 'react'
import { updateComment } from '../../Services/comment.services';
import toast from 'react-hot-toast';
import { Spinner } from '@heroui/react';

export default function EditComment({
  setUpdateCommnent,
  postId,
  commentId,
  getComments,
  getAllPost,
  initialContent,
}: {
  setUpdateCommnent: (value: string | null) => void;
  postId: string;
  commentId: string;
  getComments: (postId: string) => Promise<void>;
  getAllPost?: () => void | Promise<void>;
  initialContent: string;
}) {
    

    const [content, setContent] = useState<string>(initialContent);
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isLoading, setisLoading] = useState<boolean>(false)


    function handleImage(e : ChangeEvent<HTMLInputElement>){
        const file = e.currentTarget.files?.[0]
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
            const formData = new FormData()

            formData.append("content" , content)
            if(image){
                formData.append("image" ,image)
            }

            const {data} = await updateComment(postId ,commentId ,formData)
            toast.success(data.message)
            setImage(null)
            setImagePreview(null)
            await getComments(postId)
            await getAllPost?.()
            setUpdateCommnent(null)
            
            
        } catch (error) {
            console.error("Failed to update post", error)
            toast.error("Unable to update this post. Please try again.")
        }finally{
            setisLoading(false)
        }
    
    }
    

  return (
    <>
    <form onSubmit={handleSubmit} className='my-2 flex gap-2 items-center'>
        <input 
        value={content}
        onChange={(e)=> setContent(e.target.value)}
         type="text" className='bg-white border-1 border-gray-400 rounded-xl p-1 px-2 text-[15px]'  />
        <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900">
            <ImageIcon
              size={18}
              className="pointer-events-none text-emerald-500"
            />
            <input onChange={handleImage} type="file" accept="image/*,video/*" className="sr-only" />
          </label>
        <button className='bg-blue-500 cursor-pointer text-white font-semibold text-[13px] p-2 px-3 rounded-2xl'>{isLoading ? <Spinner className='text-white spin'/> : "Save"}</button>
        <button type='button' onClick={()=>setUpdateCommnent(null)} className='bg-gray-500 cursor-pointer text-white font-semibold text-[13px] p-2 px-3 rounded-2xl'>Cancel</button>
    </form>
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
              )}
    </>
  )
}
