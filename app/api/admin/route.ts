import {NextResponse} from "next/server";
import {currentRole} from "@/lib/auth";

export async function GET(){
    const role = await currentRole();

    if(role === "ADMIN"){
        return new NextResponse(null, { status: 200 });
    }else {
        return new NextResponse(null, { status: 403 });
    }
}