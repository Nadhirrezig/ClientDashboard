'use server';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(['pending', 'paid']),
    date: z.string(),
  });
const createInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoices(formData : FormData){
    const { customerId, amount, status } = createInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
      });
    const AmountHandler = amount * 100;
    const date = new Date().toISOString().split('T')[0];
    console.log('Creating invoice with:', { customerId, amount: AmountHandler, status, date });
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
   
    await sql`
      UPDATE invoices
      SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
  }
export async function deleteInvoice(id: string) {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
   
    revalidatePath('/dashboard/invoices');
};