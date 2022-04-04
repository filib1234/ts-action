import { getInput } from "@actions/core"

const inputName: string = getInput("name")

greet(inputName)

function greet(name: string) {
    console.log(`'Hello ${name}!'`)
}

