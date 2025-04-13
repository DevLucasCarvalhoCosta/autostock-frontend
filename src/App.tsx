import { BrowserRouter, Routes, Route } from "react-router-dom"
import DefaultLayout from "@/components/layout/DefaultLayout"
import PecaForm from "@/pages/PecaForm"
import PecaList from "@/pages/PecaList"
import Login from "@/pages/Login"
import PrivateRoute from "@/auth/PrivateRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas */}
        <Route element={<DefaultLayout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <PecaList />
              </PrivateRoute>
            }
          />
          <Route
            path="/cadastrar"
            element={
              <PrivateRoute>
                <PecaForm />
              </PrivateRoute>
            }
          />
          <Route path="/editar/:id"
           element={
              <PrivateRoute>
                <PecaForm />
              </PrivateRoute>
           }
           />

        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
