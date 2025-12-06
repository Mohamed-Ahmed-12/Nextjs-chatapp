import { Login } from "../components/auth/LoginForm";
import PublicRoute from "../gaurds/PublicRoute";

export default function Home() {

  return (
    <>
      <PublicRoute>
        <Login />
      </PublicRoute>
    </>
  )
}
