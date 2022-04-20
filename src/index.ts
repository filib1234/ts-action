import { getInput } from "@actions/core"
import { cleanUpBranchesMatchingPattern, cleanUpSynchPullRequests, createFile, createPullRequest, deleteBranch, getAllBranchesNames, getAllOpenPullRequests, initFlow, setLabels, updateCommitStatusError, validateCommitMessages, writeCommentToPr } from "./Ghe"
import { createConfigFile, createTestEventXml } from "./Tosca"
import { checkIfFileExists, readValueFromIni, writeContentToFile } from './Test'
import { multilineTest } from "./Maven"

const inputName: string = getInput("name")
const ghToken: string = getInput("ghToken")

greet(inputName)

async function greet(name: string) {
    console.log(`'Hello ${name}!'`)
    let test = "asd"

    console.log(`variable: "${test}"`)
}


