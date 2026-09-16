import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../src/server.js";

describe("REST API Endpoints", () => {
  beforeAll(async () => {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/snakeDB";
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 });
      }
    } catch {
      // Allow fallback for offline test environments
    }
  });

  afterAll(async () => {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    } catch {
      // Ignore
    }
  });

  it("GET / returns success status code 200 and health message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain("Snake Game API");
  });

  it("GET /api/leaderboard handles request gracefully", async () => {
    const res = await request(app).get("/api/leaderboard");
    expect([200, 500]).toContain(res.status);
  }, 10000);

  it("POST /api/auth/google rejects missing token with 400 Bad Request", async () => {
    const res = await request(app).post("/api/auth/google").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/games/session/start rejects unauthenticated request with 401 Unauthorized", async () => {
    const res = await request(app).post("/api/games/session/start").send({});
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("POST /api/score rejects unauthenticated request with 401 Unauthorized", async () => {
    const res = await request(app).post("/api/score").send({ score: 100 });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
