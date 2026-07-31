import api from "./api";

// The API returns uploaded file URLs as paths relative to its own origin (e.g.
// "/static/uploads/x.jpg"), not the "/api"-prefixed base the rest of this app calls —
// and the frontend is hosted on a different origin, so an unresolved relative path
// 404s when rendered. Resolve it against the API's origin here, once, for every caller.
const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api").replace(/\/api\/?$/, "");

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  // Let the browser set the multipart Content-Type (with the required boundary) itself —
  // forcing it manually here would omit the boundary and break upload parsing server-side.
  const { data } = await api.post<{ url: string }>("/admin/uploads/image", formData);
  return data.url.startsWith("http") ? data.url : `${API_ORIGIN}${data.url}`;
}
