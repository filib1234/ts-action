import { getInput } from "@actions/core"
import { cleanUpBranchesMatchingPattern, cleanUpSynchPullRequests, createFile, createPullRequest, deleteBranch, getAllBranchesNames, getAllOpenPullRequests, initFlow, setLabels, updateCommitStatusError, validateCommitMessages, writeCommentToPr } from "./Ghe"
import { createConfigFile, createTestEventXml } from "./Tosca"
import { checkIfFileExists, readValueFromIni, writeContentToFile } from './Test'
import { multilineTest } from "./Maven"
import { createNewProject } from "./Jira"
import { generatePomString, writeSettings } from "./SoapUI"

const inputName: string = getInput("name")
const ghToken: string = getInput("ghToken")

greet(inputName)

async function greet(name: string) {
    console.log(`'Hello ${name}!'`)
    let test = "asd"

    console.log(`variable: "${test}"`)

    // let releaseTests = [
    //     { environment: "env1", pathToProjectDirectory: "ptpd1", soapUiProjectName: "supn1", soapUiPath: "sup1", businessArea: "ba1", tribe: "tribe1", team: "team1" },
    //     { environment: "env2", pathToProjectDirectory: "ptpd2", soapUiProjectName: "supn2", soapUiPath: "sup2", businessArea: "ba2", tribe: "tribe2", team: "team2" },
    //     { environment: "env3", pathToProjectDirectory: "ptpd3", soapUiProjectName: "supn3", soapUiPath: "sup3", businessArea: "ba3", tribe: "tribe3", team: "team3" },
    // ]


    // console.log(generatePomString(releaseTests, "filip-workspace"))

    // let testCase = {
    //     environment: "env1",
    //     pathToProjectDirectory: "ptpd1",
    //     soapUiProjectName: "supn1",
    //     soapUiPath: "sup1",
    //     soapUiKeystore: "suk1",
    //     businessArea: "ba1",
    //     tribe: "tribe1",
    //     team: "team1"

    // }

    // writeSettings(testCase, "filip-workspace")

}


