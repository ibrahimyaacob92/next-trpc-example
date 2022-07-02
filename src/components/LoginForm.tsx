import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateUserInput, RequestOtpInput } from "../schema/user.schema";
import { trpc, useQuery } from "../utils/trpc";

type Props = {};

const VerifyToken = ({ hash }: { hash: string }) => {
  const router = useRouter();
  useQuery(["users.verify-otp", { hash }], {
    onSuccess: ({ redirect }) => {
      console.log(redirect);
      router.push(redirect);
    },
  });
  return <p>Verifying</p>;
};

const LoginForm = (props: Props) => {
  const { handleSubmit, register } = useForm<RequestOtpInput>();
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();
  const { mutate, isLoading, error } = trpc.useMutation(["users.request-otp"], {
    onSuccess: () => {
      setOtpSent(true);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const onSubmit = (values: RequestOtpInput) => {
    mutate(values);
  };

  // Catching email hash
  const hash = router.asPath.split("#token=")[1];

  if (hash) {
    return <VerifyToken hash={hash} />;
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="johne.deo.examle.com"
          {...register("email")}
        />
        <br />
        <button type="submit"> Login</button>
        {error && error.message}
        {otpSent && <p>Otp sent check your email</p>}
      </form>
      <Link href="/register">Register</Link>
    </>
  );
};

export default LoginForm;
