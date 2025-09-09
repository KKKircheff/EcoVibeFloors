'use client'
import { Grid, Stack, Typography, Button, Box } from '@mui/material';
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import ContactFormTextField from '../../../components/ui/input/ContactFormTextField.component';

export type ContactInfo = {
    name: string
    company?: string
    phonenumber: string
    email: string
    message: string
    time_stamp?: number
    created?: string
}


const ContactForm = () => {
    const t = useTranslations('contact.form');
    const b = useTranslations('buttons');
    const err = useTranslations('errors.contact');
    const [isLoading, setIsLoading] = useState(false)

    const { control, reset, handleSubmit } = useForm<ContactInfo>();

    const clearFormFields = () => {
        reset({
            name: '',
            company: '',
            phonenumber: '',
            email: '',
            message: ''
        })
    }

    const contactTemplate = (formValues: ContactInfo, created: Date, time_stamp: number) => {
        return ({
            to: ["kircheff@protonmail.com"],
            message: {
                subject: "Запитване EcoVibe Floors",
                text: "Some text that maybe is needed",
                html:
                    `<code>
                  <body>
                  <p>Запитване форма EcoVibe Floors</p>
                  <p>Дата: ${created}</p>
                  <p>Име: ${formValues.name}</p>
                  <p>Компания: ${formValues.company} </p>
                  <p>Телефон: ${formValues.phonenumber}</p>
                  <p>е-майл: ${formValues.email}</p>
                  <p>Запитване: ${formValues.message}</p>
                  </body>
                  </code>`,
            },
            name: formValues.name,
            company: formValues.company,
            email: formValues.email,
            phone: formValues.phonenumber,
            userMesssage: formValues.message,
            created,
            time_stamp
        })
    }

    const submit = async (data: ContactInfo) => {
        setIsLoading(true);
        try {
            const { addDoc, collection } = await import('firebase/firestore');
            const { db } = await import("../../../lib/firebase");
            const created = new Date();
            const time_stamp = created.getTime();
            const emailRef = collection(db, 'contacts');
            await addDoc(emailRef, contactTemplate(data, created, time_stamp));
            setIsLoading(false);
            alert(err('submission.success'));
            clearFormFields();
        } catch (error) {
            setIsLoading(false);
            console.log(`Error: ${error}`);
            alert(err('submission.error'));
        }
    }

    return (
        <Stack spacing={5} py={3}>
            <form onSubmit={handleSubmit(submit)} noValidate>
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={8} pb={8}>
                    <Stack width={{ xs: '100%', md: '50%' }} spacing={8}>
                        <ContactFormTextField
                            name="name"
                            control={control}
                            rules={{
                                required: err('validation.name.required'),
                                pattern: {
                                    value: /^[A-Za-z\u0400-\u04FF\s]{2,35}$/,
                                    message: err('validation.name.invalid')
                                }
                            }}
                            label={t('name')}
                            type="text"
                            required
                        />

                        <ContactFormTextField
                            name="company"
                            control={control}
                            rules={{
                                pattern: {
                                    value: /^[A-Za-z\u0400-\u04FF\s\d-]{0,35}$/,
                                    message: err('validation.company.invalid')
                                }
                            }}
                            label={t('company')}
                            type="text"
                        />

                        <ContactFormTextField
                            name="phonenumber"
                            control={control}
                            rules={{
                                required: err('validation.phone.required'),
                                pattern: {
                                    value: /^\+?\d{1,3}[-.\s]?\(?\d{1,3}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
                                    message: err('validation.phone.invalid')
                                }
                            }}
                            label={t('phone')}
                            type="text"
                            required
                        />

                        <ContactFormTextField
                            name="email"
                            control={control}
                            rules={{
                                required: err('validation.email.required'),
                                pattern: {
                                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                                    message: err('validation.email.invalid')
                                }
                            }}
                            label={t('email')}
                            type="email"
                            required
                        />
                    </Stack>

                    <Box width={{ xs: '100%', md: '50%' }}>
                        <ContactFormTextField
                            name="message"
                            control={control}
                            rules={{
                                required: err('validation.message.required'),
                                maxLength: {
                                    value: 400,
                                    message: err('validation.message.tooLong')
                                }
                            }}
                            label={t('message')}
                            multiline
                            variant='outlined'
                            minRows={15}
                            maxRows={15}
                        />
                    </Box>
                </Stack>
                <Button
                    type="submit"
                    disabled={isLoading}
                    variant="contained"
                    sx={{
                        minWidth: 300,
                        maxWidth: 300,
                        // backgroundColor: 'white',
                    }}
                >
                    {b('submitButton')}
                </Button>
            </form>
        </Stack >
    )
}

export default ContactForm;