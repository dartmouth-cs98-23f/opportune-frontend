import { createCookieSessionStorage } from "@remix-run/node";

type SessionData = {
    auth: string;
    user_type: string;
};

type SessionFlashData = {
    error: string;
}

const { getSession, commitSession, destroySession } = 
    createCookieSessionStorage<SessionData, SessionFlashData>(
        {
            cookie: {
                name: "__session",

                httpOnly: true,
                secure: true,
                secrets: ["s3cret1"]
            },
        }
    );

export { getSession, commitSession, destroySession }