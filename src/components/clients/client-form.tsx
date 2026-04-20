"use client";

import { useState } from "react";
import { useClientStore } from "@/store/client-store";

export default function ClientForm() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const addClient = useClientStore((state) => state.addClient);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name || !company || !email) return;

    addClient({
      name,
      company,
      email,
      status: "Active",
    });

    setName("");
    setCompany("");
    setEmail("");
  }

  return (
    <div className="panel p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Add New Client</h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          Create a new client record
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 md:grid-cols-3"
      >
        <input
          type="text"
          placeholder="Client name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-base"
        />

        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="input-base"
        />

        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-base"
        />

        <div className="md:col-span-3">
          <button type="submit" className="btn-primary">
            Add Client
          </button>
        </div>
      </form>
    </div>
  );
}