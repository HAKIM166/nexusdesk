"use client";

import { useState } from "react";
import { Client, useClientStore } from "@/store/client-store";

export default function ClientTable() {
  const clients = useClientStore((state) => state.clients);
  const deleteClient = useClientStore((state) => state.deleteClient);
  const updateClient = useClientStore((state) => state.updateClient);

  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editedClient, setEditedClient] = useState<Client | null>(null);

  function startEditing(client: Client) {
    setEditingEmail(client.email);
    setEditedClient(client);
  }

  function saveEditing() {
    if (!editingEmail || !editedClient) return;
    updateClient(editingEmail, editedClient);
    setEditingEmail(null);
    setEditedClient(null);
  }

  function cancelEditing() {
    setEditingEmail(null);
    setEditedClient(null);
  }

  return (
    <div className="panel overflow-hidden">
      <div className="border-b border-[var(--border)] px-6 py-4">
        <h2 className="text-lg font-semibold text-white">Clients List</h2>
        <p className="text-sm text-[var(--foreground-soft)]">
          Overview of your recent clients
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--border)] text-left">
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                Name
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                Company
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                Email
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                Status
              </th>
              <th className="px-6 py-4 text-sm font-medium text-[var(--foreground-soft)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client, index) => {
              const isEditing = editingEmail === client.email;

              return (
                <tr
                  key={`${client.email}-${index}`}
                  className="border-b border-[rgba(255,255,255,0.04)]"
                >
                  <td className="px-6 py-4 text-sm text-white">
                    {isEditing ? (
                      <input
                        className="input-base"
                        value={editedClient?.name ?? ""}
                        onChange={(e) =>
                          setEditedClient((prev) =>
                            prev ? { ...prev, name: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      client.name
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">
                    {isEditing ? (
                      <input
                        className="input-base"
                        value={editedClient?.company ?? ""}
                        onChange={(e) =>
                          setEditedClient((prev) =>
                            prev ? { ...prev, company: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      client.company
                    )}
                  </td>

                  <td className="px-6 py-4 text-sm text-[var(--foreground-muted)]">
                    {isEditing ? (
                      <input
                        className="input-base"
                        value={editedClient?.email ?? ""}
                        onChange={(e) =>
                          setEditedClient((prev) =>
                            prev ? { ...prev, email: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      client.email
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {isEditing ? (
                      <input
                        className="input-base"
                        value={editedClient?.status ?? ""}
                        onChange={(e) =>
                          setEditedClient((prev) =>
                            prev ? { ...prev, status: e.target.value } : prev
                          )
                        }
                      />
                    ) : (
                      <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--primary)]">
                        {client.status}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex gap-3 text-xs">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEditing}
                            className="text-[var(--primary)] hover:opacity-80"
                          >
                            Save
                          </button>
                          <button
                            onClick={cancelEditing}
                            className="text-[var(--foreground-soft)] hover:text-white"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(client)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteClient(client.email)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}