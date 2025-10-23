import { ProfileQuery } from "../../../../convex/query.config";

const BillingPage = async ({ params }: { params: { userId: string } }) => {
  const profile = await ProfileQuery();
  const { userId } = params;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Billing</h1>
      <p>Set up your subscription to continue</p>
      <p className="text-sm text-muted-foreground">Profile id: {userId}</p>
      {/* Add your billing UI components here */}
    </div>
  );
};

export default BillingPage;