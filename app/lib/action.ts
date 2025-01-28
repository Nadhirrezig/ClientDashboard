'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({    invalid_type_error: 'Please select a customer.',}),
    amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter a valid amount.' }),
    status: z.enum(
      ['pending', 'paid'],
      {invalid_type_error: 'Please select an invoice status.'},
    ),
    date: z.string(),
  });
const createInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoices(prevState: State, formData: FormData){
  const validatedFields = createInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
    const { customerId, amount, status } = validatedFields.data;
    const AmountHandler = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    try {
        await sql`
        INSERT INTO invoices (customer_id,amount,status,date)
        VALUES (${customerId},${AmountHandler},${status},${date})
        `
        console.log('Invoice created successfully.');
    }
    catch(error){
        console.error('NADHIR RASO S7I7 Error:', error);
        throw new Error('Failed to create invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}
const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
      customerId: formData.get('customerId'),
      amount: formData.get('amount'),
      status: formData.get('status'),
    });
   console.log('Updating invoice with:', { customerId, amount, status });
    const amountInCents = amount * 100;
   
    try{
      await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
    }catch(error){
      console.error('Failed to update invoice:', error);
      throw new Error('Failed to update invoice.');
    }
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
export async function deleteInvoice(id: string) {
    try{
      await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
    }catch(error){
      console.error('Failed to delete invoice:', error);
      throw new Error('Failed to delete invoice.');
    }
    revalidatePath('/dashboard/invoices');
};
//////////////////////////////////////
export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};