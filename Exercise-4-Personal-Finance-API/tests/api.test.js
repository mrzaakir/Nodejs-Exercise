const test = require("node:test");
const assert = require("node:assert/strict");
const http = require("node:http");
const app = require("../index");

const request = (path) => new Promise((resolve, reject) => {
	const server = http.createServer(app).listen(0, "127.0.0.1", () => {
		const { port } = server.address();
		http.get({ hostname: "127.0.0.1", port, path }, (response) => {
			let body = "";
			response.on("data", (chunk) => { body += chunk; });
			response.on("end", () => { server.close(); resolve({ status: response.statusCode, body: JSON.parse(body) }); });
		}).on("error", (error) => { server.close(); reject(error); });
	});
});

test("API health response exposes docs and examples", async () => {
	const response = await request("/");
	assert.equal(response.status, 200);
	assert.equal(response.body.name, "Personal Finance Tracker API");
	assert.equal(response.body.docs, "/docs");
	assert.equal(response.body.examples.email, "aisha.khan@example.com");
});

test("unknown routes return a JSON 404", async () => {
	const response = await request("/missing-route");
	assert.equal(response.status, 404);
	assert.equal(response.body.docs, "/docs");
});

test("protected transactions reject requests without a token", async () => {
	const response = await request("/transactions");
	assert.equal(response.status, 401);
	assert.match(response.body.message, /token required/i);
});