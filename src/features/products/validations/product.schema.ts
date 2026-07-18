import { z } from "zod";

export const CreateProductSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  unit: z.string().default("PIECE"),
  purchasePrice: z.string().optional(),
  salePrice: z.string(),
  taxRate: z.string().default("0"),
  currentStock: z.number().default(0),
  minStock: z.number().default(0),
  maxStock: z.number().optional(),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const UpdateProductSchema = z.object({
  code: z.string().min(2).optional(),
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  unit: z.string().optional(),
  purchasePrice: z.string().optional(),
  salePrice: z.string().optional(),
  taxRate: z.string().optional(),
  currentStock: z.number().optional(),
  minStock: z.number().optional(),
  maxStock: z.number().optional(),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
