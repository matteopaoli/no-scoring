export default function formatZodErrors(validationResult: unknown) {
  return validationResult.error.issues.map(issue => ({
    field: issue.path[0],
    message: issue.message
  }));
}