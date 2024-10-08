export default function getFormErrors(errors: { field: string, message: string }[], key: string): string[] {
  return errors.filter(e => e.field === key).map(x => x.message)
}