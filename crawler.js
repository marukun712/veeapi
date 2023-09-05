import moment from 'https://deno.land/x/momentjs@2.29.1-deno/mod.ts'
import { cron } from "https://deno.land/x/simple_cron@v0.1.0/mod.ts";
import { load } from "https://deno.land/std@0.200.0/dotenv/mod.ts";

//envファイルを読み込み
const env = await load();

//YoutubeのチャンネルID
const member = {
    'tuna': {
        id: "UCUdlDvZJGGP78zvta3swIhw"
    },
    'ruki': {
        id: "UCAUicVZlApAIhcdL9df3gWw"
    },
    'airu': {
        id: "UCJGQPbaqTY91JhVzD8gIZyw"
    },
    'ringo': {
        id: "UCf57-IJn5mUJDyqd9uNEmrg"
    },
    'kohaku': {
        id: "UCQLyq7TDKHlmp2Ufd5Z2qMw"
    }
}

//apikey
const key = env["APIKEY"]

//取得結果
const items = []

//jsonから必要な情報を取得
async function GetData(json, member) {
    const num = json.items.length;

    for (let i = 0; i < num; i++) {
        //各種情報を取得
        const ID = json.items[i].id.videoId
        const title = json.items[i].snippet.title
        const image = json.items[i].snippet.thumbnails.medium.url;

        //配信開始時間を取得
        const time = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${ID}&key=${key}`)
        const timeJson = await time.json();
        const timeData = await timeJson.items[i].liveStreamingDetails.scheduledStartTime
        const formattedTime = await moment(timeData).format('YYYY.MM.DD HH:mm')

        items.push(
            {
                title: title,
                image: image,
                id: ID,
                member: member,
                url: `https://www.youtube.com/watch?v=${ID}`,
                time: formattedTime
            }
        )

    }
}

async function Fetch() {
    items.length = 0;

    try {
        const kohaku = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.kohaku.id + "&key=" + key + "&eventType=upcoming&type=video")
        const kohakuJson = await kohaku.json();
        await GetData(kohakuJson, '秋雪こはく')

        const tuna = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.tuna.id + "&key=" + key + "&eventType=upcoming&type=video")
        const tunaJson = await tuna.json();
        await GetData(tunaJson, 'トゥルシー・ナイトメア')

        const ruki = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.ruki.id + "&key=" + key + "&eventType=upcoming&type=video")
        const rukiJson = await ruki.json();
        await GetData(rukiJson, '音門るき')

        const ringo = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.ringo.id + "&key=" + key + "&eventType=upcoming&type=video")
        const ringoJson = await ringo.json();
        await GetData(ringoJson, '九条林檎')

        const airu = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.airu.id + "&key=" + key + "&eventType=upcoming&type=video")
        const airuJson = await airu.json();
        await GetData(airuJson, '雛星あいる')

        //書き込み
        await Deno.writeTextFile("res.json", JSON.stringify(items, null, '    '))

        console.log("情報を更新しました。")
    } catch (e) {
        console.log(e)
    }
}
Fetch();

const task = cron('0 0 */12 * * *', () => {
    Fetch();
});

