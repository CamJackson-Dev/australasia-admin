import emailjs from "@emailjs/browser";

export class EmailSender {
    serviceId: string;
    publicKey: string;
    templateId: string;
        
    constructor() {
        this.serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
        this.publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "";
        this.templateId = process.env.NEXT_PUBLIC_EMAILJS_ADMIN_TEMPLATE_ID || "";
        emailjs.init(this.publicKey);
    }

    sentInvitation(
        {to_email, accept_link, reject_link}
            : 
        {to_email: string, accept_link: string, reject_link: string}
        ) {
            return emailjs.send(
            this.serviceId,
            this.templateId,
            {
                from_name: "Australasia.com",
                from_email: "admin@australasia.com",
                to_email: to_email,
                accept_link,
                reject_link
            },
            this.publicKey
        );
    }
}

// export const EmailSender = new EmailSender();
