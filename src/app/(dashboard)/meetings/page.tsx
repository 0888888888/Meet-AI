
import { MeetingsListHeader } from "@/modules/meettings/ui/components/meetings-list-header";
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meettings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
//import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { auth} from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Page = async () => {

    const session = await auth.api.getSession({
          headers:  await headers(),
        });
      
        if (!session) {
          redirect("/auth/sign-in");
        }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );
    return (
      <>
            <MeetingsListHeader/>
            <HydrationBoundary state={dehydrate(queryClient)} >
               <Suspense fallback={<MeetingsViewLoading/>}>
                     <ErrorBoundary fallback={<MeetingsViewError/>}>
                        <MeetingsView />
                     </ErrorBoundary>
               </Suspense>
            </HydrationBoundary>
      </>
);
};

export default Page;