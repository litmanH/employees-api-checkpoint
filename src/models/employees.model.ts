import { FastifyInstance } from "fastify";
import { ResourceNotFoundError } from "../errors/resource-not-found";
import { EmployeeBodyType, searchQueryType } from "../routes/schemas";
import { Tribe } from "./tribes.model";

interface EmployeeDTO {
  id: number;
  name: string;
  title: string;
  tribe: Tribe;
}

interface EmployeeQueryResult {
  id: number;
  name: string;
  title: string;
  "tribe.id": number;
  "tribe.name": string;
  "tribe.department": string;
}

const TABLE_NAME = "employees";

const EMPLOYEES_REPORT_CACHE_KEY = "employees_report";

const toEmployeeDTO = (employee: EmployeeQueryResult): EmployeeDTO => {
  const employeeDTO: EmployeeDTO = {
    id: employee.id,
    name: employee.name,
    title: employee.title,
    tribe: {
      id: employee["tribe.id"],
      name: employee["tribe.name"],
      department: employee["tribe.department"],
    },
  };

  return employeeDTO;
};

export async function getEmployees(
  fastify: FastifyInstance,
  searchQuery: searchQueryType
): Promise<EmployeeDTO[]> {
  const employeesQuery = fastify.db
    .from(TABLE_NAME)
    .innerJoin("tribes", "tribes.id", "employees.tribe_id")
    .select(
      "employees.id as id",
      "employees.name as name",
      "employees.title as title",
      "tribes.id as tribe.id",
      "tribes.name as tribe.name",
      "tribes.department as tribe.department"
    );

  if (searchQuery.name)
    employeesQuery.whereLike("employees.name", `%${searchQuery.name}%`);
  if (searchQuery.title)
    employeesQuery.where({ "employees.title": searchQuery.title });
  if (searchQuery.tribe)
    employeesQuery.where({ "tribes.name": searchQuery.tribe });

  const employeesQueryResult = await employeesQuery.then();
  const employees: EmployeeDTO[] = employeesQueryResult.map(toEmployeeDTO);

  return employees;
}

export async function getEmployee(fastify: FastifyInstance, id: number) {
  const employeeQueryResult = await fastify.db
    .from(TABLE_NAME)
    .select(
      "employees.id as id",
      "employees.name as name",
      "employees.title as title",
      "tribes.id as tribe.id",
      "tribes.name as tribe.name",
      "tribes.department as tribe.department"
    )
    .innerJoin("tribes", "tribes.id", "employees.tribe_id")
    .where({ "employees.id": id })
    .first();

  if (!employeeQueryResult) {
    const message = `No employee with id ${id} is found`;
    throw new ResourceNotFoundError(message);
  }

  return toEmployeeDTO(employeeQueryResult);
}

export async function createEmployee(
  fastify: FastifyInstance,
  employee: EmployeeBodyType
) {
  const [id] = await fastify.db.from(TABLE_NAME).insert(employee).returning('id');
  await fastify.cache.del(EMPLOYEES_REPORT_CACHE_KEY);

  return id;

}

export async function deleteEmployee(fastify: FastifyInstance, id: number) {
  await fastify.db.from(TABLE_NAME).where({ id }).del();
  await fastify.cache.del(EMPLOYEES_REPORT_CACHE_KEY);
}
