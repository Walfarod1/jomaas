// google.d.ts
declare namespace google.script {
  interface Run {
    withSuccessHandler(handler: (result: any, object?: any) => void): this;
    withFailureHandler(handler: (error: Error, object?: any) => void): this;
    withUserObject(object: any): this;
    // Backend functions
    getInitialData(): void;
    processDelivery(request: any, approver: any): void;
    getEmployeeDotation(employeeId: string): void;
  }

  const run: Run;
}
