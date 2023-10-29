import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Models } from 'appwrite'
import { useNavigate } from 'react-router-dom'

import { PostValidation } from '@/lib/validation'
import {
  useCreatePost,
  useUpdatePost,
} from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { FileUploader } from '@/components/shared/FileUploader'
import { Loader } from '@/components/shared/Loader'

type PostFormProps = {
  post?: Models.Document
  action: 'Create' | 'Update'
}

export const PostForm = ({ post, action }: PostFormProps) => {
  const { user } = useUserContext()
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post.tags.join(', ') : '',
    },
  })

  // Query
  const { mutateAsync: createPost, isPending: isLoadingCreate } =
    useCreatePost()
  const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
    useUpdatePost()

  // Handler
  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    // ACTION = UPDATE
    if (post && action === 'Update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl,
      })

      if (!updatedPost) {
        toast({
          title: 'Please try again',
        })
      }

      return navigate(`/post/${post.$id}`)
    }

    // ACTION = CREATE
    const newPost = await createPost({
      ...values,
      userId: user.id,
    })

    if (!newPost) {
      toast({
        title: 'Please try again',
      })
    }

    navigate('/')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma " , ")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Expression, Learn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            disabled={isLoadingCreate || isLoadingUpdate}
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {(isLoadingCreate || isLoadingUpdate) && <Loader />}
            {action} Post
          </Button>
        </div>
      </form>
    </Form>
  )
}
