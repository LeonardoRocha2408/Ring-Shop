import { useState } from "react";
import AuthLayout from "../auth-layout";

export default function Login() {
    const [email, setEmail] = useState()

  return (
      <AuthLayout>
          <form className="auth-form">

          </form>
      </AuthLayout>
  );
}