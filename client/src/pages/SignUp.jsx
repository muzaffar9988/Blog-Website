import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  console.log(formData);

  function handler(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  }
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    if (!formData.username || !formData.email || !formData.password)
      return setErrorMessage("Input fields are required");

    try {
      const res = await fetch("api/auth/signup", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      const data = res.json();

      if (data.success === false) return setErrorMessage(data.errorMessage);
      setLoading(false);
      console.log(res);
      if (res.ok) navigate("/sign-in");
    } catch (error) {
      setErrorMessage(error);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link
            to={"/"}
            className="font-semibold whitespace-nowrap self-center dark:text-white text-4xl"
          >
            <span className="px-2 py-1 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 text-white ">
              Nexus
            </span>
            Blogs
          </Link>
          <p className="text-sm mt-5">
            You can sign up with your email and password or with Google
          </p>
        </div>
        {/* right  */}
        <div className="flex-1 ">
          <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div>
              <Label value="Your username"></Label>
              <TextInput
                type="text"
                placeholder="Username"
                id="username"
                onChange={handler}
              ></TextInput>
            </div>
            <div>
              <Label value="Your email"></Label>
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handler}
              ></TextInput>
            </div>
            <div>
              <Label value="Your password"></Label>
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handler}
              ></TextInput>
            </div>
            <Button
              gradientDuoTone="purpleToBlue"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account? </span>{" "}
            <Link to="/sign-in" className="text-blue-500">
              Sign In
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
