import { LogoIcon } from "@/components/Logo";
import { createAdminClient, DATABASE_ID } from "@/lib/appwrite.server";
import { Query } from "node-appwrite";

export default async function DispatchPortalPage({ params }: { params: { companyId: string } }) {
  const { databases } = createAdminClient();

  const companyReq = await databases.listDocuments(DATABASE_ID, "dispatch_companies", [
    Query.equal("companyId", params.companyId)
  ]);
  
  if (companyReq.total === 0) {
    return <div className="p-10 text-center">Dispatch partner not found</div>;
  }
  
  const company = companyReq.documents[0];

  return (
    <div className="min-h-screen bg-app text-text-primary p-6">
      <div className="max-w-4xl mx-auto bg-surface border border-default rounded-xl p-8">
        <LogoIcon size={48} className="mb-6" />
        <h1 className="text-2xl font-bold mb-2">{company.name} Dispatch Portal</h1>
        <p className="text-text-muted mb-8">Manage your Veridrop delivery riders and active pickups.</p>
        
        <div className="p-4 bg-input rounded-md border border-default">
           <p className="text-sm">Rider dashboard integration active.</p>
        </div>
      </div>
    </div>
  );
}
