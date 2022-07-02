import "../styles/globals.css";
import type { AppProps } from "next/app";
import { withTRPC } from "@trpc/next";
import { loggerLink } from "@trpc/client/links/loggerLink";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import superjson from "superjson";
import { AppRouter } from "../server/route/app.router";
import { url } from "../constants";
import { useQuery } from "../utils/trpc";
import { UserContextProvider } from "../context/user.context";

function MyApp({ Component, pageProps }: AppProps) {
  const { data, error, isLoading } = useQuery(["users.me"]);

  if (isLoading) {
    return <>Loading User...</>;
  }
  return (
    <UserContextProvider value={data}>
      <main>
        <Component {...pageProps} />;
      </main>
    </UserContextProvider>
  );
}

export default withTRPC<AppRouter>({
  config({ ctx }) {
    const links = [loggerLink(), httpBatchLink({ maxBatchSize: 10, url })];

    return {
      links,
      queryClientConfig: {
        defaultOptions: {
          queries: { staleTime: 60 },
        },
      },
      headers() {
        if (ctx?.req) {
          return { ...ctx.req.headers, "x-ssr": "1" };
        }
        return {};
      },
      transformer: superjson,
      ssr: false,
    };
  },
})(MyApp);
