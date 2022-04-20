import { execInShell } from "./ShUtils"
import { writeFile } from "fs";

export function uploadMavenLog(mavenLogUrl: string, pathToPayload: string, pathToLogFile: string) {
    sendResults("text/plain", pathToLogFile, pathToPayload, mavenLogUrl)
}

export function uploadJunitResult(mavenLogUrl: string, pathToPayload: string, pathToJunitXml: string) {
    sendResults("application/xml", pathToJunitXml, pathToPayload, mavenLogUrl)
}

function sendResults(contentType: string, pathToResult: string, pathToEnvFile: string, url: string, proxyUrl: string = "http://surf.cc.azd.cloud.allianz:8080") {
    execInShell(`curl -x ${proxyUrl} -H "Content-Type:multipart/form-data" -F "file=@${pathToResult};type=${contentType}" -F "env=@${pathToEnvFile};type=application/json" ${url}`)
}

export function writePayload(company: string, fileName: string, testCase: any, branch: string = "develop") {
    let timestamp: string = new Date().toLocaleString('en_EU', { timeZone: 'Europe/Paris' });

    let payload = createPayload(testCase, timestamp, branch, company)

    if (!fileName.endsWith(".json")) {
        fileName += ".json"
    }

    writeJson(fileName, payload)
}

export function writeTeamPayload(company: string, fileName: string, testCases: any[], branch: string = "develop") {
    let timestamp = new Date().toLocaleString('en_EU', { timeZone: 'Europe/Paris' });
    let testObjectIds: string[] = []
    let jiraIds: string[] = []
    let testObjectName: string[] = []
    let testCase: any = null
    testCases.forEach(testCaseElement => {
        if (testCase == null) {
            testCase = testCaseElement
        }
        if (testObjectIds.includes(testCaseElement.testObjectId) != null && !testObjectIds.includes(testCaseElement.testObjectId)) {
            testObjectIds.push(testCaseElement.testObjectId)
        }
        if (jiraIds.includes(testCaseElement.jiraID) != null && !jiraIds.includes(testCaseElement.jiraID)) {
            jiraIds.push(testCaseElement.jiraID)
        }
        if (testObjectName.includes(testCaseElement.testObjectName) != null && !testObjectName.includes(testCaseElement.testObjectName)) {
            testObjectName.push(testCaseElement.testObjectName)
        }
    })

    let payload = createPayload(testCase, timestamp, branch, company)

    if (!fileName.endsWith(".json")) {
        fileName += ".json"
    }

    writeJson(fileName, payload)
}

function createPayload(testCase: any, timestamp: string, branch: string, company: string): string {
    return `{
    "teststufe": "${testCase.testStufe}",
    "testart": "${testCase.testUtil}",
    "businessArea": "${testCase.businessArea}",
    "tribe": "${testCase.tribe}",
    "team": "${testCase.team}",
    "release": "${testCase.release}",
    "testEnvironment": "${testCase.environment}",
    "branch": "${branch}",
    "company": "${company}",
    "application": "${testCase.application}",
    "testObjectId": "${testCase.testObjectId}",
    "toscaWorkspace": "${testCase.toscaWorkspace}",
    "toscaUniqueId": "${testCase.toscaUniqueId}",
    "soapUiPath": "${testCase.soapUiPath}",
    "jUnitSuitePath": "${testCase.junitSuite}",
    "jiraID": "${testCase.jiraID}",
    "testObjectName": "${testCase.testObjectName}",
    "timestamp": "${timestamp}",
    }`
}

function writeJson(fileName: string, json: string) {
    let prettyJson: string = JSON.stringify(JSON.parse(json), undefined, 4)
    writeFile(fileName, prettyJson, function (err) {
        if (err) {
            return console.error(err);
        }
    })
}

