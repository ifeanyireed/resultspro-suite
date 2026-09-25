import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTenant } from '@/lib/tenant';
import { BookOpenIcon, ArchiveBoxIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { COURSES_API } from '@/lib/api';

export default async function StorePage({ params }: { params: Promise<{ tenant: string }> }) {
  const resolvedParams = await params;
  const tenant = await getTenant(resolvedParams.tenant);

  if (!tenant) {
    notFound();
  }

  // Fetch store products server-side
  let products = [];
  try {
    const res = await fetch(`${COURSES_API}/api/public/store?tenant_id=${tenant.id}`, { next: { revalidate: 60 } });
    if (res.ok) {
      const data = await res.json();
      products = data.products || [];
    }
  } catch (err) {
    console.error("Failed to fetch store products", err);
  }

  const getIconForType = (type: string) => {
    switch (type) {
      case 'BOOK': return <BookOpenIcon className="w-6 h-6 text-indigo-500" strokeWidth={2} />;
      case 'DOWNLOADABLE_COURSE': return <ArchiveBoxIcon className="w-6 h-6 text-emerald-500" strokeWidth={2} />;
      default: return <DocumentIcon className="w-6 h-6 text-gray-500" strokeWidth={2} />;
    }
  };

  return (
    <main>
      <Navbar tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} contactEmail={tenant.contact_email} contactPhone={tenant.contact_phone} contactLocation={tenant.full_address} />
      
      <section className="section-py bg-navy text-white text-center" style={{ marginTop: "-72px", paddingTop: "calc(5rem + 72px)" }}>
        <div className="container-nets max-w-3xl pt-16">
          <h1 className="text-d2 fw-300 mb-6">Digital Store</h1>
          <p className="text-body-lg text-muted-light mb-10">
            E-books, downloadable courses, and premium templates for your learning journey.
          </p>
        </div>
      </section>

      <section className="section-py bg-light min-h-[50vh]">
        <div className="container-nets">
          {products.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200">
              <ArchiveBoxIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl fw-600 mb-2">Store is Empty</h3>
              <p className="text-muted">There are no digital products available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {products.map((prod: any) => (
                <div key={prod.id} className="card bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                  {prod.cover_image ? (
                    <img src={prod.cover_image} alt={prod.title} className="w-full h-48 object-cover border-b border-slate-100" />
                  ) : (
                    <div className="w-full h-48 bg-slate-50 flex items-center justify-center border-b border-slate-100">
                      {getIconForType(prod.product_type)}
                    </div>
                  )}
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                        {getIconForType(prod.product_type)}
                        {prod.product_type.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-xl fw-600 mb-2">{prod.title}</h3>
                    <p className="text-muted text-sm flex-1 mb-6">{prod.description}</p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-2xl fw-700 text-navy">${Number(prod.price).toFixed(2)}</span>
                      <button className="btn btn-outline-navy py-2 px-5 text-sm">Buy Now</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer tenantName={tenant.name} tenantLogo={tenant.logo_url} darkLogoUrl={tenant.dark_logo_url} flattenLogo={tenant.flatten_logo} contactEmail={tenant.contact_email} contactPhone={tenant.contact_phone} contactLocation={tenant.full_address} />
    </main>
  );
}
