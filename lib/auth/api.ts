import { plaidSyncCursorRepository } from "../repositories/plaidSyncCursorRepository";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Use absolute URL on the server

// checkAccessToken calls the access-token api to validate the access-token is saved as a cookie
export const checkAccessToken = async () => {
  const response = await fetch(`${baseUrl}/api/auth/access-token`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  await response.json();
  return response.ok;
};

// saveAccessToken calls the access-token api to save the token server-side using cookies
export const saveAccessToken = async (
  accessToken: string | null
): Promise<{
  data: any | null;
  error: { message: string; code: number } | null;
}> => {
  if (!accessToken) {
    return {
      data: null,
      error: { message: "Missing accessToken parameter!", code: 400 },
    };
  }

  try {
    const response = await fetch(`${baseUrl}/api/auth/access-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: accessToken }),
    });

    // Check if the response status is successful
    if (!response.ok) {
      const errorData = await response.json();
      return {
        data: null,
        error: {
          message: errorData?.message || "Failed to save access token",
          code: response.status,
        },
      };
    }

    // Parse the response data
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("Error in saveAccessToken:", error);
    return {
      data: null,
      error: { message: "Network error or API not reachable", code: 500 },
    };
  }
};
