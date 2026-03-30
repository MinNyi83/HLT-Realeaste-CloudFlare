import { DurableObject } from "cloudflare:workers";

export class MyDurableObject extends DurableObject {
	constructor(ctx: DurableObjectState, env: Env) {
		super(ctx, env);
	}
	async sayHello(name: string): Promise<string> {
		return `Hello, ${name}!`;
	}
}

export interface Env {
	antigravity_db: D1Database;
	MY_DURABLE_OBJECT: DurableObjectNamespace<MyDurableObject>;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REDIRECT_URI: string;
	SESSION_SECRET: string;
}

// --- Validation Helpers ---
const validateProperty = (data: any) => {
	const errors: string[] = [];
	if (!data.title || data.title.length < 5) errors.push("Title must be at least 5 characters.");
	if (typeof data.price !== 'number' || data.price <= 0) errors.push("Price must be a positive number.");
	if (typeof data.ward !== 'number' || data.ward < 1 || data.ward > 100) errors.push("Invalid ward number.");
	if (!['Apartment', 'Condo', 'House', 'Land', 'Shop'].includes(data.type)) errors.push("Invalid property type.");
	return errors;
};

// --- Logging Helper ---
async function logAction(db: D1Database, userId: string, action: string, details: any) {
	try {
		await db.prepare("INSERT INTO logs (user_id, action, details) VALUES (?, ?, ?)")
			.bind(userId, action, JSON.stringify(details))
			.run();
	} catch (e) {
		console.error("Failed to log action:", e);
	}
}

// --- Security Utilities ---
async function signToken(payload: any, secret: string): Promise<string> {
	const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, "");
	const encodedPayload = btoa(JSON.stringify({ ...payload, exp: Date.now() + 86400000 })).replace(/=/g, "");
	const data = `${header}.${encodedPayload}`;

	const key = await crypto.subtle.importKey(
		"raw", new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false, ["sign"]
	);
	const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
	const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)))
		.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

	return `${data}.${encodedSignature}`;
}

async function verifyToken(token: string, secret: string): Promise<any> {
	try {
		const [header, payload, signature] = token.split(".");
		if (!header || !payload || !signature) return null;

		const data = `${header}.${payload}`;
		const key = await crypto.subtle.importKey(
			"raw", new TextEncoder().encode(secret),
			{ name: "HMAC", hash: "SHA-256" },
			false, ["verify"]
		);

		const sigArray = Uint8Array.from(atob(signature.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
		const isValid = await crypto.subtle.verify("HMAC", key, sigArray, new TextEncoder().encode(data));

		if (!isValid) return null;

		const decodedPayload = JSON.parse(atob(payload));
		if (decodedPayload.exp < Date.now()) return null;

		return decodedPayload;
	} catch {
		return null;
	}
}

function getCookie(request: Request, name: string): string | null {
	const cookieString = request.headers.get("Cookie");
	if (!cookieString) return null;
	const cookies = cookieString.split(";").map(c => c.trim());
	const cookie = cookies.find(c => c.startsWith(`${name}=`));
	return cookie ? cookie.substring(name.length + 1) : null;
}

const baseHeaders = {
	"Content-Type": "application/json",
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

const securityHeaders = {
	"Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; form-action 'self';",
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
	"Cross-Origin-Opener-Policy": "same-origin",
	"Cross-Origin-Resource-Policy": "same-origin",
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const method = request.method;

		const origin = request.headers.get("Origin") || "*";

		const getResponse = async (): Promise<Response> => {
			if (method === "OPTIONS") {
				return new Response(null, {
					headers: {
						...baseHeaders,
						"Access-Control-Allow-Origin": origin,
						"Access-Control-Allow-Credentials": "true",
					}
				});
			}

			const getUser = async () => {
				const token = getCookie(request, "auth_token");
				if (!token) return null;
				return await verifyToken(token, env.SESSION_SECRET);
			};

			try {
				if (path === "/") {
					return new Response(JSON.stringify({ status: "Htein Lin Thar API Active", version: "1.2.0" }), { headers: baseHeaders });
				}

				// --- Properties API ---
				if (path === "/api/properties") {
					if (method === "GET") {
						const currentUser = await getUser();
						const role = currentUser?.role || 'user';
						const { results } = await env.antigravity_db
							.prepare(`
								SELECT p.*, 
									CASE WHEN b.user_id IS NOT NULL THEN 1 ELSE 0 END as is_bookmarked
								FROM properties p
								LEFT JOIN bookmarks b ON p.id = b.property_id AND b.user_id = ?
								WHERE p.listing_status = 'Active' OR ? = 'admin'
								ORDER BY p.created_at DESC
							`)
							.bind(currentUser?.sub || null, role)
							.all();
						return new Response(JSON.stringify(results), { headers: baseHeaders });
					}

					if (method === "POST") {
						const user = await getUser();
						if (!user || (user.role !== 'admin' && user.role !== 'agent')) {
							return new Response("Unauthorized", { status: 401, headers: baseHeaders });
						}
						const data: any = await request.json();
						const errors = validateProperty(data);
						if (errors.length > 0) return new Response(JSON.stringify({ errors }), { status: 400, headers: baseHeaders });

						const id = data.id || crypto.randomUUID();
						await env.antigravity_db
							.prepare(`INSERT INTO properties (id, title, price, ward, location, type, status, listing_status, bedrooms, bathrooms, area, phone, commission_percent, internal_remarks, images, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
							.bind(id, data.title, data.price, data.ward, data.location, data.type, data.status, data.listing_status, data.bedrooms, data.bathrooms, data.area, data.phone, data.commission_percent, data.internal_remarks, data.images ? JSON.stringify(data.images) : null, data.description)
							.run();

						await logAction(env.antigravity_db, user.sub, "CREATE_PROPERTY", { id, title: data.title });
						return new Response(JSON.stringify({ id, success: true }), { headers: baseHeaders });
					}
				}

				if (path.startsWith("/api/properties/")) {
					const id = path.split("/").pop();
					if (method === "GET") {
						const result = await env.antigravity_db.prepare("SELECT * FROM properties WHERE id = ?").bind(id).first();
						return new Response(JSON.stringify(result), { headers: baseHeaders });
					}
					if (method === "PUT" || method === "DELETE") {
						const user = await getUser();
						if (!user || (user.role !== 'admin' && user.role !== 'agent')) return new Response("Unauthorized", { status: 401, headers: baseHeaders });

						if (method === "PUT") {
							const data: any = await request.json();
							const errors = validateProperty(data);
							if (errors.length > 0) return new Response(JSON.stringify({ errors }), { status: 400, headers: baseHeaders });

							await env.antigravity_db.prepare(`UPDATE properties SET title=?, price=?, ward=?, location=?, type=?, status=?, listing_status=?, bedrooms=?, bathrooms=?, area=?, phone=?, commission_percent=?, internal_remarks=?, images=?, description=?, updated_at=CURRENT_TIMESTAMP WHERE id=?`).bind(data.title, data.price, data.ward, data.location, data.type, data.status, data.listing_status, data.bedrooms, data.bathrooms, data.area, data.phone, data.commission_percent, data.internal_remarks, data.images ? JSON.stringify(data.images) : null, data.description, id).run();
							await logAction(env.antigravity_db, user.sub, "UPDATE_PROPERTY", { id, title: data.title });
							return new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
						}
						if (method === "DELETE" && user.role === 'admin') {
							await env.antigravity_db.prepare("DELETE FROM properties WHERE id = ?").bind(id).run();
							await logAction(env.antigravity_db, user.sub, "DELETE_PROPERTY", { id });
							return new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
						}
					}
				}

				// --- Agents API ---
				if (path === "/api/agents") {
					if (method === "GET") {
						const { results } = await env.antigravity_db.prepare("SELECT * FROM agents").all();
						return new Response(JSON.stringify(results), { headers: baseHeaders });
					}
					if (method === "POST") {
						const user = await getUser();
						if (!user || user.role !== 'admin') return new Response("Unauthorized", { status: 401, headers: baseHeaders });
						const data: any = await request.json();
						if (!data.name || !data.email) return new Response("Required fields missing", { status: 400, headers: baseHeaders });
						const id = crypto.randomUUID();
						await env.antigravity_db.prepare("INSERT INTO agents (id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)").bind(id, data.name, data.email, data.phone, data.role).run();
						await logAction(env.antigravity_db, user.sub, "CREATE_AGENT", { name: data.name });
						return new Response(JSON.stringify({ id, success: true }), { headers: baseHeaders });
					}
				}

				// --- Stats & Analytics API ---
				if (path === "/api/stats") {
					const propertiesCount: any = await env.antigravity_db.prepare("SELECT COUNT(*) as count FROM properties").first();
					const agentsCount: any = await env.antigravity_db.prepare("SELECT COUNT(*) as count FROM agents").first();
					const activeListings: any = await env.antigravity_db.prepare("SELECT COUNT(*) as count FROM properties WHERE listing_status = 'Active'").first();
					const totalValue: any = await env.antigravity_db.prepare("SELECT SUM(price) as total FROM properties").first();

					// Type Distribution
					const typeResults: any = await env.antigravity_db.prepare(`
						SELECT type, COUNT(*) as count, SUM(price) as total_price 
						FROM properties 
						GROUP BY type
					`).all();

					// Ward Market Averages
					const wardAverages: any = await env.antigravity_db.prepare(`
						SELECT ward, AVG(price) as avg_price, COUNT(*) as count 
						FROM properties 
						GROUP BY ward 
						ORDER BY avg_price DESC 
						LIMIT 10
					`).all();

					return new Response(JSON.stringify({
						totalProperties: propertiesCount?.count || 0,
						totalAgents: agentsCount?.count || 0,
						activeListings: activeListings?.count || 0,
						totalPortfolioValue: totalValue?.total || 0,
						typeDistribution: typeResults.results || [],
						wardAverages: wardAverages.results || []
					}), { headers: baseHeaders });
				}

				// --- Auth ---
				if (path === "/api/auth/google/url") {
					const redirectUri = url.searchParams.get("redirect_uri") || env.GOOGLE_REDIRECT_URI;
					const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent`;
					return new Response(JSON.stringify({ url: googleAuthUrl }), { headers: baseHeaders });
				}

				if (path === "/api/auth/google/callback") {
					const code = url.searchParams.get("code");
					const redirectUri = url.searchParams.get("redirect_uri") || env.GOOGLE_REDIRECT_URI;
					if (!code) return new Response("Code missing", { status: 400, headers: baseHeaders });
					const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
					const tokens: any = await tokenRes.json();
					const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
					const profile: any = await userRes.json();
					const userCount: any = await env.antigravity_db.prepare("SELECT COUNT(*) as count FROM users").first();
					const existingUser: any = await env.antigravity_db.prepare("SELECT * FROM users WHERE google_id = ?").bind(profile.sub).first();
					let role = existingUser?.role || (userCount?.count === 0 ? 'admin' : 'user');
					if (existingUser?.is_blocked) return new Response("Account blocked", { status: 403, headers: baseHeaders });
					if (!existingUser) {
						await env.antigravity_db.prepare("INSERT INTO users (id, google_id, email, name, picture, role, is_blocked) VALUES (?, ?, ?, ?, ?, ?, 0)").bind(crypto.randomUUID(), profile.sub, profile.email, profile.name, profile.picture, role).run();
					}
					const sessionToken = await signToken({ sub: profile.sub, email: profile.email, role }, env.SESSION_SECRET);
					const res = new Response(JSON.stringify({ user: { name: profile.name, email: profile.email, picture: profile.picture, role } }), { headers: baseHeaders });
					res.headers.append("Set-Cookie", `auth_token=${sessionToken}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=86400`);
					return res;
				}

				if (path === "/api/auth/me") {
					const user = await getUser();
					if (!user) return new Response("Not Authenticated", { status: 401, headers: baseHeaders });
					const userData: any = await env.antigravity_db.prepare("SELECT email, name, picture, role FROM users WHERE google_id = ?").bind(user.sub).first();
					return new Response(JSON.stringify({ user: userData }), { headers: baseHeaders });
				}

				if (path === "/api/auth/logout") {
					const res = new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
					res.headers.set("Set-Cookie", "auth_token=; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=0");
					return res;
				}

				// --- User Management ---
				if (path === "/api/users") {
					const user = await getUser();
					if (!user || user.role !== 'admin') return new Response("Unauthorized", { status: 401, headers: baseHeaders });
					const { results } = await env.antigravity_db.prepare("SELECT * FROM users ORDER BY created_at DESC").all();
					return new Response(JSON.stringify(results), { headers: baseHeaders });
				}

				if (path.startsWith("/api/users/")) {
					const user = await getUser();
					if (!user || user.role !== 'admin') return new Response("Unauthorized", { status: 401, headers: baseHeaders });
					const id = path.split("/").pop();
					if (method === "PUT") {
						const data: any = await request.json();
						if (data.role) await env.antigravity_db.prepare("UPDATE users SET role=? WHERE id=?").bind(data.role, id).run();
						if (data.is_blocked !== undefined) await env.antigravity_db.prepare("UPDATE users SET is_blocked=? WHERE id=?").bind(data.is_blocked ? 1 : 0, id).run();
						await logAction(env.antigravity_db, user.sub, "UPDATE_USER", { id });
						return new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
					}
					if (method === "DELETE") {
						await env.antigravity_db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
						await logAction(env.antigravity_db, user.sub, "DELETE_USER", { id });
						return new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
					}
				}

				// --- Logs ---
				if (path === "/api/logs") {
					const user = await getUser();
					if (!user || user.role !== 'admin') return new Response("Unauthorized", { status: 401, headers: baseHeaders });
					const { results } = await env.antigravity_db.prepare("SELECT l.*, u.name as user_name FROM logs l LEFT JOIN users u ON l.user_id = u.google_id ORDER BY timestamp DESC LIMIT 100").all();
					return new Response(JSON.stringify(results), { headers: baseHeaders });
				}

				// --- Bookmarks ---
				if (path === "/api/bookmarks") {
					const user = await getUser();
					if (!user) return new Response("Unauthorized", { status: 401, headers: baseHeaders });
					if (method === "GET") {
						const { results } = await env.antigravity_db.prepare("SELECT p.* FROM properties p INNER JOIN bookmarks b ON p.id = b.property_id WHERE b.user_id = ?").bind(user.sub).all();
						return new Response(JSON.stringify(results), { headers: baseHeaders });
					}
					if (method === "POST") {
						const { property_id } = await request.json() as any;
						await env.antigravity_db.prepare("INSERT OR IGNORE INTO bookmarks (user_id, property_id) VALUES (?, ?)").bind(user.sub, property_id).run();
						return new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
					}
				}
				if (path.startsWith("/api/bookmarks/") && method === "DELETE") {
					const user = await getUser();
					if (!user) return new Response("Unauthorized", { status: 401, headers: baseHeaders });
					const pid = path.split("/").pop();
					await env.antigravity_db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND property_id = ?").bind(user.sub, pid).run();
					return new Response(JSON.stringify({ success: true }), { headers: baseHeaders });
				}

				return new Response("Not Found", { status: 404, headers: baseHeaders });
			} catch (e: any) {
				return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: baseHeaders });
			}
		};

		const response = await getResponse();
		Object.entries(securityHeaders).forEach(([k, v]) => response.headers.set(k, v));
		response.headers.set("Access-Control-Allow-Origin", origin);
		response.headers.set("Access-Control-Allow-Credentials", "true");
		return response;
	},
};
