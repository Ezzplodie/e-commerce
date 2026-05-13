"use client";

import { useState } from "react";
import z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/Button";
import { TextInput } from "@/shared/ui/Input";
import { Loading } from "@/shared/ui/Loading";
import { GoogleSignInButton } from "@/shared/ui";
import styles from "./RegisterForm.module.scss";

const registerSchema = z.object({
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
  form?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendRegisterRequest = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        setErrors((prev) => ({
          ...prev,
          form: data?.error || "Registration failed",
        }));
        return;
      }

      router.push("/admin");
    } catch {
      setErrors((prev) => ({ ...prev, form: "Registration failed" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleCredential = async (credential: string) => {
    setIsSubmitting(true);
    setErrors({});
    try {
      const response = await fetch("http://localhost:4000/auth/google", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });

      if (!response.ok) {
        setErrors((prev) => ({ ...prev, form: "Google sign-in failed" }));
        return;
      }

      router.push("/admin");
    } catch {
      setErrors((prev) => ({ ...prev, form: "Google sign-in failed" }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = registerSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    void sendRegisterRequest();
  };

  return (
    <div className={styles.root}>
      <GoogleSignInButton
        className={styles.googleButton}
        disabled={isSubmitting}
        onCredential={handleGoogleCredential}
      />

      <div className={styles.divider} role="separator" aria-label="or" />

      <form className={styles.form} onSubmit={handleSubmit}>
        {errors.form ? <div className={styles.formError}>{errors.form}</div> : null}

        <label className={styles.field}>
          <span>Email</span>
          <TextInput
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            type="email"
            name="email"
            placeholder="Enter your email"
            autoComplete="email"
            className={`${styles.fieldInput} ${errors.email ? styles.fieldInputError : ""}`}
            disabled={isSubmitting}
          />
          {errors.email ? <span className={styles.errorText}>{errors.email}</span> : null}
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
            placeholder="Create a password"
            autoComplete="new-password"
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
                label="Creating account"
                className={styles.buttonSpinner}
              />
              <span>Creating account...</span>
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>
    </div>
  );
}

