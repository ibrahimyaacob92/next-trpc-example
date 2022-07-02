import dynamic from "next/dynamic";

type Props = {};

const LoginForm = dynamic(() => import("../components/LoginForm"), {
  ssr: false,
});

const LoginPage = (props: Props) => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
