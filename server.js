import { Application } from 'https://deno.land/x/oak/mod.ts';

const app = new Application();

app.use(async (ctx) => {
    let json = await Deno.readTextFile("./res.json");
    ctx.response.body = json;
})

await app.listen({ port: 8000 }, () => {
    console.log("8000番で開始")
});