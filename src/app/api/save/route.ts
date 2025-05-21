import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_WORDS_DB_ID as string;

export async function POST(req: NextRequest) {
    const { word, definition, book_title } = await req.json();

    if (!word || !definition) {
        return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    try {
        await notion.pages.create({
            parent: { database_id: databaseId },
            properties: {
                Word: { title: [{ text: { content: word } }] },
                Definition: { rich_text: [{ text: { content: definition } }] },
                Book: { rich_text: [{ text: { content: book_title } }] },
            },
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}