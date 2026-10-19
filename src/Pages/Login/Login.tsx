import {
  Alert,
  Button,
  FieldError,
  Input,
  Spinner,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  loginSchema,
  type loginSchemaType,
} from "../../lib/Schemas/Auth.Schema";
import { loginUser } from "../../Services/auth.services";
import axios from "axios";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { TokenContext } from "../../Components/Context/tokenContext";


function Login() {
  const [ResponseMessage, setResponseMessage] = useState(null);
  const [ErrorMessage, setErrorMessage] = useState(null);
  const {setToken} = useContext(TokenContext)

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<loginSchemaType>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function SubmitData(values: loginSchemaType) {
    setResponseMessage(null);
    setErrorMessage(null);
    try {
      const response = await loginUser(values);

      // save token
      console.log(response.data.data.token)
      localStorage.setItem("userToken", response.data.data.token);
      setToken(response.data.data.token)

      // console.log(response);
      // navigate Message
      // console.log(response.data.message);
      // to display message success use one method of these two (useState or toast)
      // setResponseMessage(response.data.message);
      toast.success(response.data.message, {
        duration: 3000,
        position: "top-right",

        // style
        style: {
          background: "green",
          color: "white",
          textTransform: "capitalize",
        },
      });

      setTimeout(function () {
        navigate("/");
      }, 2000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Error message
        // console.log(error.response?.data?.message);
        // setErrorMessage(error.response?.data?.message);
        toast.error(error.response?.data?.message, {
          duration: 4000,
          position: "top-right",

          // style
          style: {
            background: "red",
            color: "white",
            textTransform: "capitalize",
          },
        });
      }
    }
  }

  return (
    <>
      <main>
        <section className="bg-white p-7 rounded-2xl">
          <h1 className=" text-4xl font-black text-main">
            Log in to Route Posts
          </h1>
          <p className=" py-3">Log in and continue your social journey.</p>
          {ResponseMessage && (
            <>
              <Alert
                status="success"
                className="py-3 my-1 bg-green-200 capitalize"
              >
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{ResponseMessage}</Alert.Title>
                </Alert.Content>
              </Alert>
            </>
          )}

          {ErrorMessage && (
            <>
              <Alert
                status="danger"
                className="py-3 my-1 bg-red-200 capitalize"
              >
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>{ErrorMessage}</Alert.Title>
                </Alert.Content>
              </Alert>
            </>
          )}

          <form className="space-y-5 pt-4" onSubmit={handleSubmit(SubmitData)}>
            <TextField
              aria-label="email"
              className="w-full"
              isInvalid={Boolean(errors.email)}
            >
              <Input
                {...register("email")}
                type="email"
                aria-label="email"
                className="w-full rounded-md"
                placeholder="Email"
              />
              <FieldError>{errors.email?.message}</FieldError>
            </TextField>

            <TextField
              aria-label="password"
              className="w-full"
              isInvalid={Boolean(errors.password)}
            >
              <Input
                {...register("password")}
                type="password"
                aria-label="password"
                className="w-full rounded-md"
                placeholder="Password"
              />

              <FieldError>{errors.password?.message}</FieldError>
            </TextField>

            <Button type="submit" className="bg-main w-full rounded-2xl">
              {isSubmitting ? (
                <div className="flex gap-2">
                  <Spinner className="spin text-white" />
                  <p>Loading.....</p>
                </div>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Login;
