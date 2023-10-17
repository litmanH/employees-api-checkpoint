import { destroyTestDb, generateTestDb } from "../test-db";
import getTestFastify from "../test-fastify";

const app = getTestFastify();

describe("GET /api/tribes/:id", () => {
  beforeEach(async () => {
    await generateTestDb(app);
  });

  afterEach(async () => {
    await destroyTestDb(app);
  });

  it("should return tribe by id", async () => {
    const res = await app.inject({
      url: "/api/tribes/1",
      method: "GET",
    });

    const response = res.json();

    expect(response).toEqual({
        id: 1,
        name: "Internstellar",
        department: "Other Engineering",
    });
  });
})