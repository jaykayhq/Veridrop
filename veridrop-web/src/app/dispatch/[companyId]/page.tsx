import Link from "next/link";
import { LogoIcon } from "@/components/Logo";
import { getCompanyById } from "@/lib/api/dispatch-queries";
import { notFound } from "next/navigation";

export default async function DispatchPortalPage({ params }: { params: Promise<{ companyId: string }> }) {
  const { companyId } = await params;
  const company = await getCompanyById(companyId);

  if (!company) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-app text-text-primary p-6">
      <div className="max-w-4xl mx-auto bg-surface border border-default rounded-xl p-8">
        <LogoIcon size={48} className="mb-6" />
        <h1 className="text-2xl font-bold mb-2">{company.name} Dispatch Portal</h1>
        <p className="text-text-muted mb-8">Manage your Veridrop delivery riders and active pickups.</p>

        <div className="flex gap-4">
          <Link
            href={`/dispatch/${companyId}/dashboard`}
            className="px-6 py-3 bg-gradient-to-r from-brand-blue to-brand-teal-light text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
          >
            Dashboard
          </Link>
          <Link
            href={`/dispatch/${companyId}/onboard`}
            className="px-6 py-3 border border-default text-text-secondary text-sm font-medium rounded-lg hover:border-hover transition-colors"
          >
            Manage Riders
          </Link>
        </div>
      </div>
    </div>
  );
}
