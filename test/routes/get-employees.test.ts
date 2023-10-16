import { destroyTestDb, generateTestDb } from "../test-db";
import getTestFastify from "../test-fastify";

const app = getTestFastify();

describe("GET /api/employees", () => {
  beforeEach(async () => {
    await generateTestDb(app);
  });

  afterEach(async () => {
    await destroyTestDb(app);
  });

  it("should return all Employees", async () => {
    const res = await app.inject({
      url: "/api/employees",
      method: "GET",
    });

    const response = res.json();
    expect(response).toHaveLength(10);
  });

  it("should return correct Employees DTO structure", async () => {
    const res = await app.inject({
      url: "/api/employees",
      method: "GET",
    });

    const response = res.json();

    expect(response[0]).toEqual({
      id: 1,
      name: "Cooper",
      title: "Software Engineer",
      tribe: {
        id: 1,
        name: "Internstellar",
        department: "Other Engineering",
      },
    });
  });

  it("should filter by name", async () => {
    const res = await app.inject({
      url: "/api/employees?name=ha",
      method: "GET",
    });

    const response = res.json();
    expect(response).toHaveLength(2);
  });

  it("should filter by title", async () => {
    const res = await app.inject({
      url: "/api/employees?title=Designer",
      method: "GET",
    });

    const response = res.json();
    expect(response).toHaveLength(2);
  });

  it("should filter by tribe", async () => {
    const res = await app.inject({
      url: "/api/employees?tribe=Billing",
      method: "GET",
    });

    const response = res.json();
    expect(response).toHaveLength(4);
  });
});