import { ActionFunctionArgs, json, LoaderFunction, redirect } from "@remix-run/node";

export const action = async ({
	request,
  }: ActionFunctionArgs) => {
	const formData = await request.formData();
	const username = formData.get('username');
	const password = formData.get('password');
	console.log(username, password)

	const response = await fetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: username, password: password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

	return redirect("/login");
};


export let loader: LoaderFunction = async ({ request }) => {
  if (request.method === "POST") {
    // Handle the form submission here
    const formData = new URLSearchParams(await request.text());
    const username = formData.get("username");
    const password = formData.get("password");
	
	console.log(username, password);
    // Perform authentication logic here
    // If authentication is successful, redirect to a success page
    // If authentication fails, return an error response
  }

  // Return a default response or initial form view
  return json({ message: "Please submit the form" });
};