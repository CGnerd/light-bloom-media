export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Handle contact form
    if (url.pathname === "/api/contact" && request.method === "POST") {
      try {
        const formData = await request.formData();

        const name = formData.get("name");
        const email = formData.get("email");
        const message = formData.get("message");

        if (!name || !email || !message) {
          return new Response("Missing required fields.", {
            status: 400,
          });
        }

        const emailResponse = await fetch(
          "https://api.resend.com/emails",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Website Form <website@lightbloommedia.com>",
              to: "jhughanderson@gmail.com",
              subject: `New Contact Form Submission from ${name}`,
              html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, "<br>")}</p>
              `,
            }),
          }
        );

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();

          return new Response(errorText, {
            status: 500,
          });
        }

        return Response.redirect(
          `${url.origin}/?success=true`,
          303
        );
      } catch (err) {
        return new Response(err.message, {
          status: 500,
        });
      }
    }

    return new Response("Not Found", {
      status: 404,
    });
  },
};