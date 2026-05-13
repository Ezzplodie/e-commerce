"use client";

import { useEffect, useId, useMemo } from "react";

type Props = {
  className?: string;
  onCredential: (credential: string) => void | Promise<void>;
  disabled?: boolean;
};

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (args: {
            client_id: string;
            callback: (res: { credential?: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export function GoogleSignInButton({ className, onCredential, disabled }: Props) {
  const buttonId = useId();
  const containerId = useMemo(() => `google-btn-${buttonId}`, [buttonId]);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-identity="true"]',
    );
    if (existing) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (disabled) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) return;

    const google = window.google?.accounts?.id;
    const el = document.getElementById(containerId);
    if (!google || !el) return;

    el.innerHTML = "";
    google.initialize({
      client_id: clientId,
      callback: (res) => {
        if (!res.credential) return;
        void onCredential(res.credential);
      },
    });
    google.renderButton(el, {
      theme: "outline",
      size: "large",
      type: "standard",
      width: 320,
      text: "continue_with",
    });
  }, [containerId, disabled, onCredential]);

  return <div id={containerId} className={className} aria-disabled={disabled} />;
}

