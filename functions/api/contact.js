export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");

  console.log(`
    Name: ${name}
    Email: ${email}
    Message: ${message}
  `);

  return new Response(
    JSON.stringify({
      success: true,
      message: "Message received!"
    }),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}