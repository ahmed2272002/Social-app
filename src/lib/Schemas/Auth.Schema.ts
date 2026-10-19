import * as z from "zod";

export const registerSchema = z
  .object({
    name: z
      .string()
      .nonempty("Name is Required")
      .min(3, "min chars is 3")
      .max(10, "max chars is 10"),

    username: z
      .string()
      .nonempty("UserName is Required")
      .min(3, "min chars is 3")
      .max(10, "max chars is 10"),

    email: z.string().nonempty("Email is required").email("Email is not Valid"),

    dateOfBirth: z
      .string()
      .nonempty("Date of birth is required")
      .refine((date) => {
        const currentYear = new Date().getFullYear();
        const UserYear = new Date(date).getFullYear();
        const age = currentYear - UserYear;
        return age >= 18;
      }, "User Must Be Older than 18"),

    gender: z.string().nonempty("Gender is Required"),

    password: z
      .string()
      .nonempty("Password is Required")
      .min(3, "min chars is 3")
      .max(10, "max chars is 10"),

    rePassword: z.string().nonempty("Password is Required"),
  })
  .refine(
    (data) => {
      return data.password === data.rePassword;
    },
    {
      path: ["rePassword"],
      message: "Password Not Match",
    },
  );

export type RegisterSchemaType = z.infer<typeof registerSchema>;

// login schema

export const loginSchema = z.object({
  email: z.string().nonempty("Email is required").email("Email is not Valid"),
  password: z
    .string()
    .nonempty("Password is Required")
    .min(3, "min chars is 3")
    .max(10, "max chars is 10"),
});

export type loginSchemaType = z.infer<typeof loginSchema>;
