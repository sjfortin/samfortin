export default function PlaylistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-full w-full">
      <div className="flex-1">
        {children}
      </div>
    </div>
  )
}
