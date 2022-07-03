import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreatePostInput } from "../../schema/post.schema";
import { useMutation } from "../../utils/trpc";

function CreatePostPage() {
  const { handleSubmit, register } = useForm<CreatePostInput>();
  const router = useRouter();

  const { mutate, error } = useMutation(["post.create-post"], {
    onSuccess: (data, variables, ctx) => {
      console.log({ data, variables, ctx });
      router.push(`/post/${data.id}`);
    },
  });

  function onSubmit(values: CreatePostInput) {
    mutate(values);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {error && error.message}
      <h1>Create Post</h1>
      <input type="text" placeholder="Title" {...register("title")} />
      <textarea placeholder="Post your title" {...register("body")} />
      <button>Create Post</button>
    </form>
  );
}

export default CreatePostPage;
