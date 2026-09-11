const swaggerDefinition = {
	openapi: "3.0.3",
	info: { title: "Personal Finance Tracker API", version: "1.0.0", description: "Track income, expenses, categories, and monthly summaries." },
	servers: [{ url: process.env.RENDER_URL || "http://localhost:5000" }],
	tags: [{ name: "Auth" }, { name: "Transactions" }, { name: "Categories" }, { name: "Upload" }, { name: "Admin" }],
	components: {
		securitySchemes: { bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" } },
		schemas: {
			User: { type: "object", properties: { id: { type: "string", example: "67a1b2c3d4e5f67890123456" }, name: { type: "string", example: "Aisha Khan" }, email: { type: "string", example: "aisha.khan@example.com" }, role: { type: "string", example: "user" } } },
			Transaction: { type: "object", required: ["title", "amount", "type", "category"], properties: { id: { type: "string", example: "67b2c3d4e5f6789012345678" }, title: { type: "string", example: "Weekly groceries" }, amount: { type: "number", example: 84.5 }, type: { type: "string", enum: ["income", "expense"], example: "expense" }, category: { type: "string", example: "Food" }, date: { type: "string", format: "date", example: "2025-05-27" } } }
		}
	},
	paths: {
		"/auth/register": { post: { tags: ["Auth"], summary: "Register a user", requestBody: { required: true, content: { "application/json": { schema: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string", example: "Aisha Khan" }, email: { type: "string", example: "aisha.khan@example.com" }, password: { type: "string", example: "Aisha123!" } } } } } }, responses: { 201: { description: "Registered" }, 400: { description: "Validation error" } } } },
		"/auth/login": { post: { tags: ["Auth"], summary: "Log in", requestBody: { required: true, content: { "application/json": { schema: { type: "object", properties: { email: { type: "string", example: "aisha.khan@example.com" }, password: { type: "string", example: "Aisha123!" } } } } } }, responses: { 200: { description: "Logged in" } } } },
		"/auth/profile": { get: { tags: ["Auth"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Profile" } } } },
		"/transactions": { get: { tags: ["Transactions"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Transactions" } } }, post: { tags: ["Transactions"], security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Transaction" } } } }, responses: { 201: { description: "Created" } } } },
		"/transactions/monthly-summary": { get: { tags: ["Transactions"], security: [{ bearerAuth: [] }], parameters: [{ name: "month", in: "query", schema: { type: "string", example: "2025-05" } }], responses: { 200: { description: "Monthly totals" } } } },
		"/transactions/{id}": { put: { tags: ["Transactions"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", example: "67b2c3d4e5f6789012345678" } }], responses: { 200: { description: "Updated" } } }, delete: { tags: ["Transactions"], security: [{ bearerAuth: [] }], parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "Deleted" } } } },
		"/categories": { get: { tags: ["Categories"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Categories" } } } },
		"/upload/profile-picture": { post: { tags: ["Upload"], security: [{ bearerAuth: [] }], requestBody: { content: { "multipart/form-data": { schema: { type: "object", properties: { profilePicture: { type: "string", format: "binary" } } } } } }, responses: { 200: { description: "Uploaded" } } } },
		"/admin/overview": { get: { tags: ["Admin"], security: [{ bearerAuth: [] }], responses: { 200: { description: "Admin analytics" }, 403: { description: "Admin role required" } } } }
	}
};

module.exports = swaggerDefinition;