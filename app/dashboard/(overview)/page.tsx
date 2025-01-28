export const dynamic = 'force-dynamic';
////////////////////// please do not write this code
// IN PRODUCTION it forces the static to be dynamic im just using it for some testing DO NOT USE IT IN PRODUCTION
// LOVE AND THANKS
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import {fetchCardData } from '@/app/lib/data';
import { RevenueChartSkeleton, LatestInvoicesSkeleton , CardsSkeleton} from '@/app/ui/skeletons';
import CardWrapper from '@/app/ui/dashboard/cards';
import { Suspense } from 'react';
export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton/>}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton/>}>
          <RevenueChart/>
        </Suspense>
        <Suspense fallback = {<LatestInvoicesSkeleton/>}>
          <LatestInvoices/>
        </Suspense>
        
      </div>
    </main>
  );
}