
export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div>
            <div className="max-w-7xl mx-auto px-4 sm:px-4 lg:px-6">
                {children}
            </div>
        </div>
    )

}