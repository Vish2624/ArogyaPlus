import { z } from "zod";

import { MAX_AGE, MIN_AGE } from "./constants";
import { TIME_SLOTS } from "@/types/booking";

const NAME_PATTERN = /^[A-Za-z\s.'-]+$/;
const COUNTRY_CODE_PATTERN = /^\+\d{1,4}$/;
const PHONE_PATTERN = /^\d{7,15}$/;

const optionalPrice = z.preprocess(
  (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
  z.number().min(0).optional()
);

export const bookingFormSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Please enter your full name.")
    .max(150)
    .regex(NAME_PATTERN, "Name cannot contain numbers or special characters."),
  age: z.coerce
    .number({ invalid_type_error: "Age is required." })
    .int("Age must be a whole number.")
    .min(MIN_AGE, `Age must be at least ${MIN_AGE}.`)
    .max(MAX_AGE, `Age must be at most ${MAX_AGE}.`),
  gender: z.enum(["Male", "Female"], { required_error: "Please select a gender." }),
  country_code: z
    .string()
    .min(1, "Required.")
    .regex(COUNTRY_CODE_PATTERN, "Use format +971."),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .regex(PHONE_PATTERN, "Phone number must contain digits only."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  address: z.string().min(10, "Please enter your full address.").max(300),
  preferred_date: z.string().min(1, "Please select a preferred date."),
  time_slot: z.enum(TIME_SLOTS, { required_error: "Please select a time slot." }),
  visit_mode: z.enum(["home", "lab"], { required_error: "Please select a visit mode." }),
  payment_mode: z.enum(["cash", "online"], { required_error: "Please select a payment mode." }),
});

export type BookingFormValues = z.infer<typeof bookingFormSchema>;

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username or email is required."),
  password: z.string().min(1, "Password is required."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;

export const testFormSchema = z.object({
  name: z.string().min(1, "Test name is required.").max(150),
  description: z.string().optional(),
  category: z.string().optional(),
  sample_type: z.string().optional(),
  image_url: z.string().optional(),
  lab_price: z.coerce.number({ invalid_type_error: "Price is required." }).min(0),
  original_lab_price: optionalPrice,
  tat: z.string().optional(),
  fasting_required: z.boolean().nullable().optional(),
  is_active: z.boolean(),
});

export type TestFormValues = z.infer<typeof testFormSchema>;

export const parameterFormSchema = z.object({
  name: z.string().min(1, "Parameter name is required.").max(150),
  unit: z.string().optional(),
  reference_range: z.string().optional(),
  method: z.string().optional(),
  description: z.string().optional(),
  is_active: z.boolean(),
});

export type ParameterFormValues = z.infer<typeof parameterFormSchema>;

export const packageFormSchema = z.object({
  name: z.string().min(1, "Package name is required.").max(150),
  description: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().optional(),
  lab_price: z.coerce.number({ invalid_type_error: "Price is required." }).min(0),
  original_lab_price: optionalPrice,
  tat: z.string().optional(),
  fasting_required: z.boolean().nullable().optional(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  test_ids: z.array(z.number()).default([]),
});

export type PackageFormValues = z.infer<typeof packageFormSchema>;
