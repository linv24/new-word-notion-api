import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const word = searchParams.get("word");

    if (!word) {
        return NextResponse.json({ error: "Missing word" }, { status: 400 });
    }

    try {
        const res = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const definitions = res.data[0].meanings.flatMap((m: any) =>
            m.definitions.map((d: any) => `${m.partOfSpeech}: ${d.definition}`)
        );
        return NextResponse.json({ word, definitions });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}