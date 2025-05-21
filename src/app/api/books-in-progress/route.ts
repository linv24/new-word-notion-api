import { NextRequest, NextResponse } from "next/server";
import { Client } from "@notionhq/client";
import axios from "axios";

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_BOOKS_DB_ID as string;

export async function GET() {
    try {
        const res = await notion.databases.query({
            database_id: databaseId,
            filter: {
                and: [
                    {
                        property: "Status",
                        select: {
                            equals: "In progress",
                        },
                    },
                    {
                        or: [
                            {
                            property: "Type",
                            select: {
                                equals: "Pleasure Book",
                            },
                            },
                            {
                            property: "Type",
                            select: {
                                equals: "Educational Book",
                            },
                            },
                        ],
                    },
                ],
            },
        });

        const titles = res.results.map((page: any) => {
            return page.properties.Title?.title?.[0]?.plain_text || "untitled";
        });

        return NextResponse.json(titles);
    } catch (err) {
        console.error("Error fetching book titles:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}