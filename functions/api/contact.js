export async function onRequestPost(context) {
  try {
    // 1. Parse the incoming form data
    const formData = await context.request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Quick validation
    if (!name || !email || !message) {
      return new Response('Missing required fields.', { status: 400 });
    }

    // 2. Send the data to an email API (Example using Resend)
    // You will need to get a free API key from resend.com
    const resendApiKey = context.env.RESEND_API_KEY; 

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website Form <website@lightbloommedia.com>', // Must be a domain you verify in Resend
        to: 'jhughanderson@gmail.com', 
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      return new Response(`Email delivery failed: ${errorText}`, { status: 500 });
    }

    // 3. Redirect the user to a success state or home page
    // You can build a custom "thank-you.html" or just redirect back home with a query string
    return Response.redirect(`${new URL(context.request.url).origin}/?success=true`, 303);

  } catch (error) {
    return new Response(`Server Error: ${error.message}`, { status: 500 });
  }
}