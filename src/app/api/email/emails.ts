"use server";
import React from "react";
import { Resend, CreateEmailResponse } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
type Template<T> = (props: T) => React.ReactElement;

export async function sendEmail<T>(
  to: string,
  template: Template<T>,
  subject: string,
  props: T
): Promise<CreateEmailResponse> {
  return await resend.emails.send({
    from: "Savoir Investir <savoirinvestir@investmasterymind.pro>",
    to,
    subject,
    react: template(props) as React.ReactElement,
  });
}
