import { TestSchema, TestSchemaType } from "./schema";


export async function testUseCase (values:TestSchemaType) {
  const validateFields = TestSchema.safeParse(values);

  const test = validateFields.error;
  console.log(test?.message)

  if (!validateFields.success) {
    return { success: false, error: 'Invalid fields!' };
  }

  return { success: true, data: values };
}