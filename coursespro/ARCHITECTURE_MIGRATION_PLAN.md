# Multi-Tenant Architecture Migration Plan

This plan outlines the strategic migration of `@coursespro` to a modern, scalable, and highly performant multi-tenant architecture. It is broken down into 4 progressive phases based on the best practices discussed.

## Phase 1: Edge Routing & Server Components Enabler (High Impact, Low Effort)

**The Problem:** Currently, your `coursespro/src/middleware.ts` explicitly skips rewriting `/admin` and `/mentor` routes. Because they aren't rewritten into a `[tenant]` dynamic route, Next.js doesn't provide the tenant slug via URL parameters. This forces your app to rely on `window.location.hostname` in the browser to figure out the tenant, which means you **cannot use Server Components** to fetch data (since the server doesn't have a `window`).

**The Fix:**
1.  **Update Edge Middleware:** Modify `middleware.ts` to inject an `x-tenant-slug` header into the request before passing it along.
    ```typescript
    // In middleware.ts
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-tenant-slug', tenantSlug);
    return NextResponse.next({
      request: { headers: requestHeaders }
    });
    ```
2.  **Universalize `api.ts`:** Update `getTenantSlug()` in `api.ts` to be isomorphic (works on both Client and Server).
    ```typescript
    import { headers } from 'next/headers';
    
    export function getTenantSlug() {
      if (typeof window === 'undefined') {
        // We are on the Server Component!
        return headers().get('x-tenant-slug') || process.env.NEXT_PUBLIC_TENANT_SLUG;
      }
      // We are on the Client Component
      return window.location.hostname.split('.')[0];
    }
    ```
3.  **Result:** You can now instantly convert pages like `CohortsPage` to Next.js Server Components, fetching data before the page even loads.

---

## Phase 2: Frontend Data Fetching Modernization (React Query)

**The Problem:** Naked `useEffect` + Axios fetching is highly prone to race conditions, double-fetching in React Strict Mode, and leaves users staring at loading spinners.

**The Fix:**
1.  **Install TanStack Query:** `npm install @tanstack/react-query`
2.  **Create a Provider:** Wrap your root layout in a `<QueryClientProvider>`.
3.  **Refactor Client Pages:** For pages that *must* remain Client Components (e.g., due to heavy interactivity), replace the `useEffect` blocks:
    ```typescript
    // Before:
    useEffect(() => { fetchData() }, []);
    
    // After:
    const { data, isLoading, error } = useQuery({
      queryKey: ['payments', 'summary', tenantSlug],
      queryFn: () => api.get('/api/v1/admin/payments/summary').then(res => res.data)
    });
    ```
4.  **Result:** Built-in caching, automatic retries on failure, deduplication of requests, and background refetching when the user switches tabs.

---

## Phase 3: Stateless JWT Auth (Backend)

**The Problem:** Your `coursespro` backend currently intercepts requests and makes a synchronous HTTP POST call to `users_service/auth/introspect` just to verify if a token is valid for a tenant. This doubles the network latency of *every single API request*.

**The Fix:**
1.  **Enhance JWT Payload:** When a user logs in via `users_service`, the generated JWT should contain custom claims embedding their tenant access:
    ```json
    {
      "sub": "user_123",
      "email": "admin@skillup.com",
      "tenants": {
        "skillupacademy": { "role": "tenant-admin" }
      }
    }
    ```
2.  **Verify Locally:** Update the `AuthMiddleware` in the Go backend (`service_coursespro/middleware/auth.go`). Instead of calling the introspect endpoint, it should simply cryptographically verify the JWT signature (using a shared secret or JWKS) and read the claims directly from the payload.
3.  **Result:** Zero-latency authentication. The `users_service` is only pinged during login, password reset, or token refresh.

---

## Phase 4: Database Row-Level Security (Postgres)

**The Problem:** Multi-tenant systems are notorious for data leaks (e.g., accidentally writing `SELECT * FROM payments` without `WHERE tenant_id = ?`).

**The Fix:**
1.  **Ensure Schema Standard:** Ensure every table has a `tenant_id` column.
2.  **Enable RLS in Neon Postgres:**
    ```sql
    ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY tenant_isolation_policy ON cohorts
    USING (tenant_id = current_setting('app.current_tenant', true)::uuid);
    ```
3.  **Update Go Backend Repositories:** Modify your database connection lifecycle. Before executing queries for a request, execute:
    ```go
    db.Exec("SET LOCAL app.current_tenant = $1", tenantID)
    ```
4.  **Result:** Unbreakable security at the database engine level. Even if a junior developer forgets a `WHERE` clause, the database will refuse to return rows belonging to other tenants.
