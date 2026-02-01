import { z } from "zod";

export const loginSchema = z.object({
	role: z.enum(["sponsor", "publisher"], {
		required_error: "Please select a role",
	}),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
