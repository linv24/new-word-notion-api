import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_WORDS_DB_ID as string;

export async function POST(req: NextRequest) {
    const { word, fullDefinition, bookTitle } = await req.json();

    if (!word || !fullDefinition) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // definition actually contains part of speech and definition:
    // <pos>: <definition>
    const splitIx = fullDefinition.indexOf(": ");
    const partOfSpeech = fullDefinition.slice(0, splitIx).trim();
    const definition = fullDefinition.slice(splitIx + 2).trim(); // account for colon and space

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Word: { title: [{ text: { content: word } }] },
                "Part of Speech": { rich_text: [{ text: { content: partOfSpeech } }] },
                Definition: { rich_text: [{ text: { content: definition } }] },
                Book: { rich_text: [{ text: { content: bookTitle } }] },
            },
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}