import Router from "next/router";
import { useState } from "react";
import { supabaseAdmin } from "../imageGallery";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex flex-col  p-4 bg-gray-200 mt-40 m-auto space-y-5 max-w-md ">
      <div className="text-2xl text-center font-bold">Supabase Auth</div>
      <div className="flex gap-2 justify-center">
        <label>Email:</label>
        <input
          className="rounded-md"
          type="email"
          placeholder="enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="flex gap-2 justify-center">
        <label>Password:</label>
        <input
          className="border-2 rounded-md"
          type="password"
          placeholder="enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 items-center">
        <button
          className="ring-1 ring-gray-400 rounded-sm p-2"
          onClick={() => {
            login(email, password);
            setEmail("");
            setPassword("");
          }}
        >
          Login
        </button>
        <button
          className="ring-1 ring-gray-400 rounded-sm p-2"
          onClick={() => {
            signUp(email, password);
            setEmail("");
            setPassword("");
          }}
        >
          SignUP
        </button>
      </div>
    </div>
  );
}

const login = async (email: any, password: any) => {
  console.log(email, password);
  try {
    const { user, error } = await supabaseAdmin.auth.signIn({
      email,
      password,
    });
    if (error) throw error;
    alert("logged in");
    Router.push("/imageGallery");
    console.log(user);
  } catch (error: any) {
    console.log(error.message);
  }
};

const signUp = async (email: any, password: any) => {
  console.log(email, password);
  try {
    const { error } = await supabaseAdmin.auth.signUp({ email, password });
    if (error) throw error;
    alert("signed up");
  } catch (error: any) {
    console.log(error.message);
  }
};
