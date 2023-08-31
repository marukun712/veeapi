import moment from 'npm:moment'
import cron from 'npm:node-cron'
import { load } from "https://deno.land/std/dotenv/mod.ts";

//envファイルを読み込み
const env = await load();

//YoutubeのチャンネルID
var member = {
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
var key = env["APIKEY"]

//取得結果
var items = []

//jsonから必要な情報を取得
async function GetData(json, member) {
    var num = json.items.length;

    for (let i = 0; i < num; i++) {
        //各種情報を取得
        var ID = json.items[i].id.videoId
        var title = json.items[i].snippet.title
        var image = json.items[i].snippet.thumbnails.medium.url;

        //配信開始時間を取得
        var time = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${ID}&key=${key}`)
        var timeJson = await time.json();
        var timeData = await timeJson.items[i].liveStreamingDetails.scheduledStartTime
        var formattedTime = await moment(timeData).format('YYYY.MM.DD HH:mm')

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
        var kohaku = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.kohaku.id + "&key=" + key + "&eventType=upcoming&type=video")
        var kohakuJson = await kohaku.json();
        await GetData(kohakuJson, '秋雪こはく')

        var tuna = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.tuna.id + "&key=" + key + "&eventType=upcoming&type=video")
        var tunaJson = await tuna.json();
        await GetData(tunaJson, 'トゥルシー・ナイトメア')

        var ruki = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.ruki.id + "&key=" + key + "&eventType=upcoming&type=video")
        var rukiJson = await ruki.json();
        await GetData(rukiJson, '音門るき')

        var ringo = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.ringo.id + "&key=" + key + "&eventType=upcoming&type=video")
        var ringoJson = await ringo.json();
        await GetData(ringoJson, '九条林檎')

        var airu = await fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.airu.id + "&key=" + key + "&eventType=upcoming&type=video")
        var airuJson = await airu.json();
        await GetData(airuJson, '雛星あいる')

        //書き込み
        await Deno.writeTextFile("res.json", JSON.stringify(items, null, '    '))

        console.log("情報を更新しました。")
    } catch (e) {
        console.log(e)
    }
}

cron.schedule('0 0 */12 * * *', () => {
    Fetch();
});