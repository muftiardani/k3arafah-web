export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold md:text-2xl">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Card 1 */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Total Pendaftar
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </div>
        </div>

        {/* Stats Card 2 */}
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">
              Artikel Terbit
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">+0 from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
}
