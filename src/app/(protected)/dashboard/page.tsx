import { SubscriptionEntitlementQuery } from "@/convex/qurey.config";
import Loading from "./loading";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";
import { combinedSlug } from "@/lib/utils";

const Page=async()=>{
    const {entitlement , profileName} = await SubscriptionEntitlementQuery();

    // if(!entitlement._valueJSON){
    //     redirect(`/dashboard/${combinedSlug(profileName!)}`)}
    // }

    return <div className="grid grid-cols-1">
        <Navbar/>
        </div>
}
export default Page;