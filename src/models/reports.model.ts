import { FastifyInstance } from "fastify";

interface EmployeesReport {
  tribe_name: string;
  names: {id: number; name: string; title: string} [];
}

const EMPLOYEES_TABLE = "employees";
const TRIBES_TABLE = "tribes";

const EMPLOYEES_REPORT_CACHE_KEY = "employees_report";

export async function getReportsEmployees(fastify: FastifyInstance) {

  const cache = await fastify.cache.get(EMPLOYEES_REPORT_CACHE_KEY);
  if (cache) {
    return JSON.parse(cache);
  }

  const tribesQuery = await fastify.db
  .from (TRIBES_TABLE)
  .select("name");

  const result: EmployeesReport[] = [];

  const employeesQuery = await fastify.db
  .from(EMPLOYEES_TABLE)
  .innerJoin("tribes", "tribes.id", "employees.tribe_id")
  .select(
      "employees.id as id",
    "employees.name as name",
    "employees.title as title",
    "tribes.name as tribe_name"
  );

  // console.log(employeesQuery);

  for (const tribe of tribesQuery){
      const employeeFilteredByTribe = await employeesQuery.filter((employee)=> employee.tribe_name === tribe.name);

      const employeeNoTribeName = employeeFilteredByTribe.map((employee) => {
          const { tribe_name, ...rest } = employee; 
          return rest; 
      });

      result.push({
          tribe_name: tribe.name,
          names: employeeNoTribeName,
      })
  }

  // await fastify.cache.set(EMPLOYEES_REPORT_CACHE_KEY, JSON.stringify(report));

  return result;
}