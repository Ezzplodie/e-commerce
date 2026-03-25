"use client";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { Loading } from "@/shared/ui/Loading";
import styles from "./LoginForm.module.scss";
import { useState } from "react";
import z from "zod";
import { useRouter } from "next/navigation";
const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

type FormErrors = {
  email?: string;
  password?: string;
};

export const LoginForm = () => {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendLoginRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: login,
          password: password,
        }),
      });
      if (response.ok) {
        router.push("/admin");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email: login, password: password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    sendLoginRequest();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span>Email</span>
        <TextInput
          onChange={(e) => {
            setLogin(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          type="email"
          name="email"
          placeholder="Enter your email"
          autoComplete="email"
          className={`${styles.fieldInput} ${errors.email ? styles.fieldInputError : ""}`}
          disabled={isSubmitting}
        />
        {errors.email ? (
          <span className={styles.errorText}>{errors.email}</span>
        ) : null}
      </label>

      <label className={styles.field}>
        <span>Password</span>
        <TextInput
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) {
              setErrors((prev) => ({ ...prev, password: undefined }));
            }
          }}
          type="password"
          name="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          className={`${styles.fieldInput} ${errors.password ? styles.fieldInputError : ""}`}
          disabled={isSubmitting}
        />
        {errors.password ? (
          <span className={styles.errorText}>{errors.password}</span>
        ) : null}
      </label>

      <Button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loading
              size="sm"
              label="Logging in"
              className={styles.buttonSpinner}
            />
            <span>Logging In...</span>
          </>
        ) : (
          "Log In"
        )}
      </Button>
    </form>
  );
};
