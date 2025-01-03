"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod"; // Import z from Zod
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import { UserFormValidation } from "@/lib/validation"; // Import your validation schema
import SubmitButton from "@/components/ui/SubmitButton"; // Import the SubmitButton component
import { createUser } from "@/lib/actions/patient.actions";

export enum FormFieldType {
    INPUT = "input",
    TEXTAREA = "textarea",
    PHONE_INPUT = "phoneInput",
    CHECKBOX = "checkbox",
    DATE_PICKER = "datePicker",
    SELECT = "select",
    SKELETON = "skeleton",
}

// Assuming UserFormValidation is a Zod schema
const formSchema = UserFormValidation;

const PatientForm = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Define your form with the imported schema
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    // Function to handle form submission
    const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsLoading(true);

        try {
            const user = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            };
            const newUser = await createUser(user);

            if (newUser) {
                router.push(`/patients/${newUser.$id}/register`);
            }
        } catch (error) {
            console.log(error);
        }

        setIsLoading(false);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6 flex-1">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there 👋</h1>
                    <p className="text-dark-700">Schedule your First Appointment.</p>
                </section>

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="name"
                    label="Full name"
                    placeholder="John Doe"
                    iconSrc="/assets/icons/user.svg"
                    iconAlt="user"
                />

                <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email"
                    placeholder="johndoe@gmail.com"
                    iconSrc="/assets/icons/email.svg"
                    iconAlt="email"
                />

                <CustomFormField
                    fieldType={FormFieldType.PHONE_INPUT}
                    control={form.control}
                    name="phone"
                    label="Phone number"
                    placeholder="(555) 123-4567"
                />

                {/* Use the SubmitButton component */}
                <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
            </form>
        </Form>
    );
};

export default PatientForm;