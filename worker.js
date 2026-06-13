export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (
      url.pathname === "/api/contact" &&
      request.method === "POST"
    ) {
      const formData = await request.formData();

      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      return new Response(
        JSON.stringify({
          success: true,
          name,
          email,
          message
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
    }

    return new Response("Not Found", {
      status: 404
    });
  }
};