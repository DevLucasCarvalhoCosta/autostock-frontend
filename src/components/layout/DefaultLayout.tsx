import {
  Menu,
  Package,
  PlusCircle,
  LogOut,
  X,
  Pin,
  PinOff
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { useLocation, Link, Outlet, useNavigate } from "react-router-dom"
import { useState } from "react"
import clsx from "clsx"
import { useAuth } from "@/auth/AuthContext"

export default function DefaultLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [hovered, setHovered] = useState(false)

  const navItems = [
    { label: "Peças", href: "/", icon: <Package size={18} /> },
    { label: "Cadastrar", href: "/cadastrar", icon: <PlusCircle size={18} /> },
  ]

  const Sidebar = ({ onClick }: { onClick?: () => void }) => (
    <nav className="flex flex-col gap-2 p-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={onClick}
          className={clsx(
            "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            location.pathname === item.href
              ? "bg-blue-100 text-blue-700 font-semibold"
              : "text-gray-700 hover:bg-blue-50"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  )

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar desktop responsivo */}
      <aside
        className={clsx(
          "bg-white border-r transition-all duration-300 ease-in-out z-20 flex flex-col",
          pinned || hovered ? "w-64" : "w-4"
        )}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className={clsx("flex items-center justify-between p-2", pinned || hovered ? "px-6" : "px-1")}> 
          {(pinned || hovered) && <div className="text-blue-600 font-bold text-lg">AutoStock</div>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setPinned(!pinned)}
            className={clsx("transition-colors", pinned ? "text-red-600" : "text-gray-500 hover:text-blue-600")}
          >
            {pinned ? <PinOff size={18} /> : <Pin size={18} />}
          </Button>
        </div>
        {(pinned || hovered) && (
          <>
            <Sidebar />
            <div className="mt-auto p-4">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-red-600 hover:bg-red-100"
                onClick={() => {
                  logout()
                  navigate("/login")
                }}
              >
                <LogOut size={16} />
                Sair
              </Button>
            </div>
          </>
        )}
      </aside>

      {/* Mobile menu */}
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex-1 flex flex-col w-full overflow-hidden">
          <header className="bg-white shadow p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </DialogTrigger>
              <h1 className="text-lg font-semibold text-gray-800">AutoStock</h1>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                navigate("/login")
              }}
              className="gap-2 text-red-600"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <Outlet />
          </main>
        </div>

        {/* Drawer lateral mobile */}
        <DialogContent className="p-0 w-[260px] bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-bold text-blue-600">AutoStock</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X size={20} />
            </Button>
          </div>
          <Sidebar onClick={() => setOpen(false)} />
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-600 hover:bg-red-100"
              onClick={() => {
                logout()
                navigate("/login")
              }}
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
