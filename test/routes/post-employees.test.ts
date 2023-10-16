import { destroyTestDb, generateTestDb } from "../test-db";
import getTestFastify from "../test-fastify";

const app = getTestFastify();

describe("POST /api/employees/:id", () => {
  beforeEach(async () => {
    await generateTestDb(app);
  });

  afterEach(async () => {
    await destroyTestDb(app);
  });

  const employeeData = {
    "name": "Mihkel Huang",
    "title": "Intern",
    "tribe_id": 1
};

  it("should return success message with the id of the employee created", async () => {
    const res = await app.inject({
      url: "/api/employees",
      method: "POST",
      payload: employeeData,
    });

    const response = res.json();

    expect(response.success).toBe(true);
    expect(response.id).toBeDefined();
  });
});
