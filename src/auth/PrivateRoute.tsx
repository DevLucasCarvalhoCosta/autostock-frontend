import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./AuthContext"

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()

  // Se não houver token (nem no sessionStorage), redireciona
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
