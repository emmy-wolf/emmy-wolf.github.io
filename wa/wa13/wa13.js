// Problem 1: Create JSON for each employee
const employees = [
    {
      firstName: "Sam",
      department: "Tech",
      designation: "Manager",
      salary: 40000,
      raiseEligible: true
    },
    {
      firstName: "Mary",
      department: "Finance",
      designation: "Trainee",
      salary: 18500,
      raiseEligible: true
    },
    {
      firstName: "Bill",
      department: "HR",
      designation: "Executive",
      salary: 21200,
      raiseEligible: false
    }
  ];
  console.log("Problem 1: Employees JSON", employees);
  
  // Problem 2: Create JSON for the company
  const company = {
    companyName: "Tech Stars",
    website: "www.techstars.site",
    employees: employees
  };
  console.log("Problem 2: Company JSON", company);
  
  // Problem 3: Add new employee Anna
  let newEmployee = {
    firstName: "Anna",
    department: "Tech",
    designation: "Executive",
    salary: 25600,
    raiseEligible: false
  };
  company.employees.push(newEmployee);
  console.log("Problem 3: Company with Anna added", company);
  
  // Problem 4: Calculate total salary
  let totalSalary = 0;
  company.employees.forEach(employee => {
    totalSalary += employee.salary;
  });
  console.log("Problem 4: Total salary of all employees:", totalSalary);
  
  // Problem 5: Apply raises to eligible employees
  company.employees.forEach(employee => {
    if (employee.raiseEligible) {
      employee.salary *= 1.1;
      employee.raiseEligible = false;
    }
  });
  console.log("Problem 5: Updated salaries and eligibility", company);
  
  // Problem 6: Add 'wfh' (work from home) status
  const wfhEmployees = ['Anna', 'Sam'];
  company.employees.forEach(emp => {
    emp.wfh = wfhEmployees.includes(emp.firstName);
  });
  
  console.log("Problem 6: Company after setting WFH status", company);
  
  