import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useCreateResponse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (answer: string) => {
      // Validate with schema first
      const validated = api.responses.create.input.parse({ answer });
      
      const res = await fetch(api.responses.create.path, {
        method: api.responses.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.responses.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to record response");
      }
      
      return api.responses.create.responses[201].parse(await res.json());
    },
    // We don't strictly need to invalidate anything unless we had an admin dashboard
    // but good practice:
    onSuccess: () => {
      console.log("Response recorded successfully!");
    },
  });
}
