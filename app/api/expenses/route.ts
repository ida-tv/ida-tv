import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"



export async function GET(){

  try{

    const expenses = await prisma.expense.findMany({
      orderBy:{ id:"desc" }
    })

    return NextResponse.json(expenses)

  }catch(error){

    return NextResponse.json(
      { error:"Ошибка загрузки расходов" },
      { status:500 }
    )

  }

}



export async function POST(req:Request){

  try{

    const data = await req.json()

    const expense = await prisma.expense.create({

      data:{
        title:data.title,
        amount:Number(data.amount),
        date:data.date
      }

    })

    return NextResponse.json(expense)

  }catch(error){

    return NextResponse.json(
      { error:"Ошибка сохранения расхода" },
      { status:500 }
    )

  }

}



export async function DELETE(req:Request){

  try{

    const { id } = await req.json()

    await prisma.expense.delete({
      where:{ id }
    })

    return NextResponse.json({ success:true })

  }catch(error){

    return NextResponse.json(
      { error:"Ошибка удаления расхода" },
      { status:500 }
    )

  }

}