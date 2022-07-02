import Link from "next/link";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { CreateUserInput } from "../schema/user.schema";
import { trpc } from "../utils/trpc";

type Props = {};

const RegisterPage = (props: Props) => {
  const { handleSubmit, register } = useForm<CreateUserInput>();
  const router = useRouter();
  const { mutate, isLoading, error } = trpc.useMutation(
    ["users.register-user"],
    {
      onSuccess: ({ id, email, name }) => {
        router.push("/login");
      },
      onError: (error) => {
        console.log({ error });
      },
    }
  );

  const onSubmit = (values: CreateUserInput) => {
    mutate(values);
  };
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Register</h1>
        <input
          type="email"
          placeholder="johne.deo.examle.com"
          {...register("email")}
        />
        <br />
        <input type="text" placeholder="johne" {...register("name")} />
        <button type="submit"> Register</button>
        {error && error.message}
      </form>
      <Link href="/login">Login</Link>
    </>
  );
};

export default RegisterPage;
