import {
  Alert,
  Button,
  FieldError,
  Input,
  ListBox,
  Select,
  Spinner,
  TextField,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  registerSchema,
  type RegisterSchemaType,
} from "../../lib/Schemas/Auth.Schema";
import { registerUser } from "../../Services/auth.services";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";



function Register() {

const [ResponseMessage, setResponseMessage] = useState(null);
const [ErrorMessage, setErrorMessage] = useState(null);

const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
  });

  async function SubmitData(values: RegisterSchemaType) {
    setResponseMessage(null);
    setErrorMessage(null);
    try {
      const response = await registerUser(values);
      console.log(response);
      // navigate Message
      console.log(response.data.message);
      // to display message success use one method of these two (useState or toast)
      // setResponseMessage(response.data.message);
      toast.success(response.data.message, {
        duration: 3000,
        position: "top-right",

        // style
        style: { background: "green", color: "white" , textTransform: "capitalize"},
      });
      setTimeout(function(){
        navigate("/auth/login")
      }, 2000)



    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Error message
        // console.log(error.response?.data?.message);
        // setErrorMessage(error.response?.data?.message);
        toast.error(error.response?.data?.message, {
          duration: 4000,
          position: "top-right",

          // style
          style: { background: "red", color: "white" , textTransform: "capitalize" },
        });
      }
    }
  }

  return (
    <>
      <main>
        <section className="bg-white p-7 rounded-2xl">
          <h1 className=" text-4xl font-black text-main">
            Create a new account
          </h1>
          <p className=" py-3">It is quick and easy</p>
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
              aria-label="name"
              className="w-full"
              isInvalid={Boolean(errors.name)}
            >
              <Input
                {...register("name")}
                aria-label="FullName"
                className="w-full rounded-md"
                placeholder="Full Name"
              />

              <FieldError>{errors.name?.message}</FieldError>
            </TextField>

            <TextField
              aria-label="username"
              className="w-full"
              isInvalid={Boolean(errors.username)}
            >
              <Input
                {...register("username")}
                aria-label="username"
                className="w-full rounded-md"
                placeholder="User Name"
              />
              <FieldError>{errors.username?.message}</FieldError>
            </TextField>

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
              aria-label="gender"
              className="w-full"
              isInvalid={Boolean(errors.gender)}
            >
              <Controller
                name="gender"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <Select
                        {...field}
                        aria-label="gender"
                        className="w-full"
                        placeholder="Select Gender"
                      >
                        <Select.Trigger>
                          <Select.Value />
                          <Select.Indicator />
                        </Select.Trigger>
                        <Select.Popover>
                          <ListBox>
                            <ListBox.Item id="male" textValue="Male">
                              Male
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                            <ListBox.Item id="female" textValue="Female">
                              Female
                              <ListBox.ItemIndicator />
                            </ListBox.Item>
                          </ListBox>
                        </Select.Popover>
                      </Select>
                    </>
                  );
                }}
              />
              <FieldError>{errors.gender?.message}</FieldError>
            </TextField>

            <TextField
              aria-label="date"
              className="w-full"
              isInvalid={Boolean(errors.dateOfBirth)}
            >
              <Input
                {...register("dateOfBirth")}
                type="date"
                aria-label="date"
                className="w-full rounded-md"
              />
              <FieldError>{errors.dateOfBirth?.message}</FieldError>
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

            <TextField
              aria-label="repassword"
              className="w-full"
              isInvalid={Boolean(errors.rePassword)}
            >
              <Input
                {...register("rePassword")}
                type="password"
                aria-label="password"
                className="w-full rounded-md"
                placeholder="Confirm Password"
              />
              <FieldError>{errors.rePassword?.message}</FieldError>
            </TextField>

            <Button type="submit" className="bg-main w-full rounded-2xl">
              {isSubmitting ? (
                <div className="flex gap-2">
                  <Spinner className="spin text-white" />
                  <p>Loading.....</p>
                </div>
              ) : (
                "Create New Account"
              )}
            </Button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register;
