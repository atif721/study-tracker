import type { Subject } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...options?.headers,
      ...(options?.body ? { "Content-Type": "application/json" } : {}),
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Request Failed");
  }
  return data as T;
}

export const getSubjects = () => {
  return request<Subject[]>("/subjects");
};

export const createSubject = (name: string) => {
  return request<Subject>("/subjects", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
};

export const deleteSubject = (id: number) => {
  return request<void>(`/subjects/${id}`, { method: "DELETE" });
};
