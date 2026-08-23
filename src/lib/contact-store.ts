import { jsonStore } from "./json-store";

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
};

const store = jsonStore<ContactMessage[]>("contacts", []);

export function listContacts() {
  return store.load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addContact(input: { name: string; email: string; message: string }) {
  const msg: ContactMessage = {
    id: `msg-${Date.now().toString(36)}`,
    name: input.name.trim().slice(0, 120),
    email: input.email.trim().toLowerCase().slice(0, 120),
    message: input.message.trim().slice(0, 4000),
    createdAt: new Date().toISOString(),
    read: false,
  };
  const all = store.load();
  all.unshift(msg);
  store.save(all.slice(0, 500));
  return msg;
}

export function patchContact(id: string, patch: Partial<Pick<ContactMessage, "read">>) {
  const all = store.load();
  const row = all.find((m) => m.id === id);
  if (!row) return null;
  if (patch.read != null) row.read = patch.read;
  store.save(all);
  return row;
}

export function removeContact(id: string) {
  store.save(store.load().filter((m) => m.id !== id));
}
