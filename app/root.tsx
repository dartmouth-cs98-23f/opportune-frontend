import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { LinksFunction, json } from '@remix-run/node';
import mainStyles from '~/styles/main.css';
import homeStyles from '~/styles/home.css';

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: mainStyles },
			{ rel: "stylesheet", href: homeStyles }
	];
};

export function loader() {
  const ENV = {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ?? "",
    CLOUDINARY_PRESET_NAME: process.env.CLOUDINARY_PRESET_NAME ?? "",
  };
  return json({  ENV });
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
		    <link href="https://fonts.googleapis.com/css2?family=Mulish&display=swap" rel="stylesheet"></link>
        <Meta />
        <Links />
      </head>
      <body>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript" />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
