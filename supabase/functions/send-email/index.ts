import { serve } from "https://deno.fresh.dev/std@v9.6.1/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const RECIPIENT_EMAIL = "kadir.diego@web.de";

serve(async (req) => {
  try {
    const { name, email, subject, message } = await req.json();

    const client = new SmtpClient();

    await client.connect({
      hostname: Deno.env.get("SMTP_HOSTNAME") || "",
      port: Number(Deno.env.get("SMTP_PORT")) || 587,
      username: Deno.env.get("SMTP_USERNAME") || "",
      password: Deno.env.get("SMTP_PASSWORD") || "",
    });

    await client.send({
      from: Deno.env.get("SMTP_USERNAME") || "",
      to: RECIPIENT_EMAIL,
      subject: `Neue Kontaktanfrage: ${subject}`,
      content: `
        Name: ${name}
        E-Mail: ${email}
        Betreff: ${subject}
        
        Nachricht:
        ${message}
      `,
    });

    await client.close();

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
