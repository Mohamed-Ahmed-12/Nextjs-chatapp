import SignupForm from "@/src/components/auth/SignupForm";
import PublicRoute from "@/src/gaurds/PublicRoute";

export default function Home() {

  return (
    <>
      <PublicRoute>
        <SignupForm />
      </PublicRoute>
    </>
  )
}