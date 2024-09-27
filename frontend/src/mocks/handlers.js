import { rest } from "msw";

const baseURL = "/api";

export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(
            ctx.json({
                "pk": 2,
                "username": "marlon",
                "email": "",
                "first_name": "",
                "last_name": ""
            })
        );
    }),
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req,res,ctx) => {
        return res(ctx.status(200));
    }),
];