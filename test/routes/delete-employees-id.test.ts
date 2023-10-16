import { destroyTestDb, generateTestDb } from "../test-db";
import getTestFastify from "../test-fastify";

const app = getTestFastify();

describe("DELETE /api/employees/:id", () => {
  beforeEach(async () => {
    await generateTestDb(app);
  });

  afterEach(async () => {
    await destroyTestDb(app);
  });

  it("should return 404 with get employee id after deleting with the same id", async () => {
    const res = await app.inject({
      url: "/api/employees/1",
      method: "DELETE",
    });

    const response = res.json();

    expect(response).toEqual({ success: true });

    const resAfterDelete = await app.inject({
        url: "/api/employees/1",
        method: "GET",
      });

    const responseAfterDelete = resAfterDelete.json();
    const statusCodeAfterDelete = resAfterDelete.statusCode;
    
    expect(statusCodeAfterDelete).toEqual(404);
    expect(responseAfterDelete).toEqual({error: "No employee with id 1 is found"});
  });
});
