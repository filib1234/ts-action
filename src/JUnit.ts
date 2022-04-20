import { readFileSync, writeFileSync } from "fs"

// needs test configuraiton yaml file to test it properly
export function injectTestsIntoPom(releaseTests: any[]) {
    let data: string = readFileSync("pom.xml").toString()
    let startIncludesBlock = data.indexOf("<includes>\n")
    let endIncludesBlock = data.indexOf("</includes>\n")
    endIncludesBlock += "</includes>".length
    let subString = data.substring(startIncludesBlock, endIncludesBlock)
    let mergedExecutions = mergeExecutions(releaseTests)
    let newData = data.replace(subString, mergedExecutions)
    writeFileSync("pom.xml", newData)
}

export function injectCredentaislIntoConfig(configFileName: string, user: string, password: string) {
    let data: string = readFileSync(configFileName).toString()
    data = data.replace("JUNIT-TU/USER=\"\"", `JUNIT-TU/USER="${user}"`)
    data = data.replace("JUNIT-TU/PWD=\"\"", `JUNIT-TU/PWD="${password}"`)
    writeFileSync(configFileName, data)
}

export function mergeExecutions(releaseTests: any[]): string {
    let mergedExecutions: string = "<includes>\n"
    releaseTests.forEach(testCase => {
        mergedExecutions += `<include>${testCase.junitSuite}</include>\n`
    })
    mergedExecutions += "</includes>\n"
    return mergedExecutions
}